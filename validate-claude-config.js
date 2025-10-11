#!/usr/bin/env node

/**
 * Claude Config Validator
 * Validates .claude/claude.md for common issues
 */

const fs = require("fs");
const path = require("path");

const CLAUDE_MD_PATH = path.join(__dirname, ".claude", "claude.md");

// Required sections in claude.md
const REQUIRED_SECTIONS = [
  "Your Role",
  "Core Principles",
  "Communication Style",
  "Tool Usage",
  "Forbidden Actions",
];

/**
 * Main validation function
 */
function validateClaudeConfig() {
  const issues = [];

  // Check if file exists
  if (!fs.existsSync(CLAUDE_MD_PATH)) {
    console.error(`❌ ERROR: ${CLAUDE_MD_PATH} not found`);
    return 1;
  }

  // Read file
  let content;
  try {
    content = fs.readFileSync(CLAUDE_MD_PATH, "utf8");
  } catch (err) {
    console.error(`❌ ERROR: Cannot read ${CLAUDE_MD_PATH}: ${err.message}`);
    return 1;
  }

  // Check for empty file
  if (content.trim().length === 0) {
    issues.push("File is empty");
  }

  // Check for required sections
  REQUIRED_SECTIONS.forEach((section) => {
    const regex = new RegExp(`##\\s+${section}`, "i");
    if (!regex.test(content)) {
      issues.push(`Missing required section: "${section}"`);
    }
  });

  // Check for broken internal links (markdown format)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const linkText = match[1];
    const linkPath = match[2];

    // Skip external links (http/https)
    if (linkPath.startsWith("http")) continue;

    // Check if internal file reference exists
    const fullPath = path.join(__dirname, linkPath.split("#")[0]);
    if (!fs.existsSync(fullPath)) {
      issues.push(`Broken link: [${linkText}](${linkPath})`);
    }
  }

  // Report results
  console.log("\n📋 Claude Config Validation Report\n");
  console.log(`File: ${CLAUDE_MD_PATH}`);
  console.log(`Size: ${content.length} characters`);
  console.log(`Lines: ${content.split("\n").length}`);

  if (issues.length === 0) {
    console.log("\n✅ Validation PASSED - No issues found\n");
    return 0;
  } else {
    console.log(`\n❌ Validation FAILED - Found ${issues.length} issue(s):\n`);
    issues.forEach((issue, index) => {
      console.log(`  ${index + 1}. ${issue}`);
    });
    console.log();
    return 1;
  }
}

// Run validation
const exitCode = validateClaudeConfig();
process.exit(exitCode);
