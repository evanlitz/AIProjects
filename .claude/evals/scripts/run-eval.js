#!/usr/bin/env node

/**
 * Claude Code Eval Runner
 *
 * Usage:
 *   node run-eval.js --suite all
 *   node run-eval.js --task code-gen-001
 *   node run-eval.js --suite all --compare results/baseline.json
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const yaml = require('yaml'); // Install: npm install yaml

const TASKS_DIR = path.join(__dirname, '../tasks');
const RESULTS_DIR = path.join(__dirname, '../results');

// Parse CLI args
const args = process.argv.slice(2);
const suite = args.includes('--suite') ? args[args.indexOf('--suite') + 1] : null;
const taskId = args.includes('--task') ? args[args.indexOf('--task') + 1] : null;
const compareFile = args.includes('--compare') ? args[args.indexOf('--compare') + 1] : null;
const outputFile = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

/**
 * Load task definitions
 */
function loadTasks() {
  const taskFiles = fs.readdirSync(TASKS_DIR).filter(f => f.endsWith('.yaml'));
  return taskFiles.map(file => {
    const content = fs.readFileSync(path.join(TASKS_DIR, file), 'utf8');
    return yaml.parse(content);
  });
}

/**
 * Run a single task
 */
async function runTask(task) {
  console.log(`\n[${ task.id }] Running...`);

  const startTime = Date.now();
  const result = {
    id: task.id,
    status: 'pending',
    score: 0,
    metrics: {},
    acceptance: {}
  };

  try {
    // TODO: Invoke Claude here (via Task tool or API)
    // For now, this is a placeholder that shows the structure

    console.log(`  Prompt: ${task.input.prompt.substring(0, 100)}...`);

    // Simulate running acceptance checks
    let totalScore = 0;
    let maxScore = 0;

    for (const criterion of task.acceptance.criteria) {
      maxScore += criterion.weight;

      try {
        // Run the check command (e.g., grep, tsc, npm test)
        if (criterion.check) {
          execSync(criterion.check, { stdio: 'ignore', cwd: process.cwd() });
          result.acceptance[criterion.id] = { pass: true, score: criterion.weight };
          totalScore += criterion.weight;
          console.log(`  ✅ ${criterion.id}: ${criterion.description}`);
        } else {
          // Manual check (placeholder)
          result.acceptance[criterion.id] = { pass: false, score: 0 };
          console.log(`  ⚠️  ${criterion.id}: ${criterion.description} (manual check required)`);
        }
      } catch (err) {
        result.acceptance[criterion.id] = { pass: false, score: 0 };
        console.log(`  ❌ ${criterion.id}: ${criterion.description}`);
      }
    }

    result.score = Math.round((totalScore / maxScore) * 100);
    result.status = result.score >= task.acceptance.min_passing_score ? 'pass' : 'fail';

    // Record metrics
    result.metrics = {
      tokens_used: 0, // TODO: Get from Claude API response
      wall_time_sec: (Date.now() - startTime) / 1000,
      edits_count: 0, // TODO: Count Edit tool calls
      compile_success: result.acceptance.compile?.pass ?? null,
      tests_passed: 0, // TODO: Parse test output
      tests_failed: 0
    };

    console.log(`  Result: ${result.status.toUpperCase()} (${result.score}/${maxScore * (task.acceptance.min_passing_score / 100)})`);

  } catch (err) {
    result.status = 'error';
    result.error = err.message;
    console.error(`  ❌ Error: ${err.message}`);
  }

  return result;
}

/**
 * Main runner
 */
async function main() {
  const tasks = loadTasks();
  let tasksToRun = tasks;

  // Filter by suite or task ID
  if (taskId) {
    tasksToRun = tasks.filter(t => t.id === taskId);
  } else if (suite && suite !== 'all') {
    tasksToRun = tasks.filter(t => t.category === suite);
  }

  if (tasksToRun.length === 0) {
    console.error('No tasks found matching criteria');
    process.exit(1);
  }

  console.log(`\n🧪 Running ${tasksToRun.length} tasks...\n`);

  // Run all tasks
  const results = [];
  for (const task of tasksToRun) {
    const result = await runTask(task);
    results.push(result);
  }

  // Summary
  const summary = {
    total_tasks: results.length,
    passed: results.filter(r => r.status === 'pass').length,
    failed: results.filter(r => r.status === 'fail').length,
    errors: results.filter(r => r.status === 'error').length,
    pass_rate: results.filter(r => r.status === 'pass').length / results.length,
    avg_tokens: results.reduce((sum, r) => sum + (r.metrics.tokens_used || 0), 0) / results.length,
    avg_time_sec: results.reduce((sum, r) => sum + (r.metrics.wall_time_sec || 0), 0) / results.length,
    total_tokens: results.reduce((sum, r) => sum + (r.metrics.tokens_used || 0), 0),
    total_time_sec: results.reduce((sum, r) => sum + (r.metrics.wall_time_sec || 0), 0)
  };

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary');
  console.log('='.repeat(60));
  console.log(`Tasks run: ${summary.total_tasks}`);
  console.log(`Passed: ${summary.passed} | Failed: ${summary.failed} | Errors: ${summary.errors}`);
  console.log(`Pass rate: ${(summary.pass_rate * 100).toFixed(1)}%`);
  console.log(`Avg tokens: ${summary.avg_tokens.toFixed(0)}`);
  console.log(`Avg time: ${summary.avg_time_sec.toFixed(1)}s`);

  // Save results
  const output = {
    run_id: new Date().toISOString(),
    config: {
      model: 'claude-sonnet-4', // TODO: Detect from settings
      settings: '.claude/claude.md',
      mcp_servers: [] // TODO: Detect installed servers
    },
    tasks: results,
    summary
  };

  const timestamp = new Date().toISOString().split('T')[0];
  const resultFile = outputFile || path.join(RESULTS_DIR, `${timestamp}.json`);
  fs.writeFileSync(resultFile, JSON.stringify(output, null, 2));
  console.log(`\n💾 Results saved to: ${resultFile}`);

  // Compare to baseline if requested
  if (compareFile) {
    const baselinePath = path.join(__dirname, '..', compareFile);
    if (fs.existsSync(baselinePath)) {
      const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
      console.log('\n' + '='.repeat(60));
      console.log('📈 Comparison to Baseline');
      console.log('='.repeat(60));

      const passRateDelta = (summary.pass_rate - baseline.summary.pass_rate) * 100;
      const tokensDelta = summary.avg_tokens - baseline.summary.avg_tokens;
      const timeDelta = summary.avg_time_sec - baseline.summary.avg_time_sec;

      console.log(`Pass rate: ${(summary.pass_rate * 100).toFixed(1)}% (${passRateDelta > 0 ? '+' : ''}${passRateDelta.toFixed(1)}%)`);
      console.log(`Avg tokens: ${summary.avg_tokens.toFixed(0)} (${tokensDelta > 0 ? '+' : ''}${tokensDelta.toFixed(0)})`);
      console.log(`Avg time: ${summary.avg_time_sec.toFixed(1)}s (${timeDelta > 0 ? '+' : ''}${timeDelta.toFixed(1)}s)`);

      // Find regressions
      const regressions = [];
      for (const result of results) {
        const baselineTask = baseline.tasks.find(t => t.id === result.id);
        if (baselineTask && baselineTask.status === 'pass' && result.status !== 'pass') {
          regressions.push(result.id);
        }
      }

      if (regressions.length > 0) {
        console.log(`\n⚠️  Regressions detected: ${regressions.join(', ')}`);
      } else {
        console.log('\n✅ No regressions');
      }
    } else {
      console.error(`\n⚠️  Baseline file not found: ${baselinePath}`);
    }
  }

  // Exit code based on results
  process.exit(summary.failed > 0 || summary.errors > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
