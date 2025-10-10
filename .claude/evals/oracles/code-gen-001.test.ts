import { deepClone } from '../deepClone';

describe('deepClone', () => {
  test('clones primitives', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('hello')).toBe('hello');
    expect(deepClone(true)).toBe(true);
  });

  test('clones null and undefined', () => {
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
  });

  test('clones simple objects', () => {
    const obj = { a: 1, b: 2 };
    const cloned = deepClone(obj);

    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj); // Different reference
  });

  test('clones nested objects', () => {
    const obj = { a: { b: { c: 3 } } };
    const cloned = deepClone(obj);

    expect(cloned).toEqual(obj);
    expect(cloned.a).not.toBe(obj.a); // Nested objects are also cloned
  });

  test('clones arrays', () => {
    const arr = [1, 2, 3];
    const cloned = deepClone(arr);

    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
  });

  test('clones nested arrays', () => {
    const arr = [[1, 2], [3, 4]];
    const cloned = deepClone(arr);

    expect(cloned).toEqual(arr);
    expect(cloned[0]).not.toBe(arr[0]);
  });

  test('clones objects with arrays', () => {
    const obj = { items: [{ id: 1 }, { id: 2 }] };
    const cloned = deepClone(obj);

    expect(cloned).toEqual(obj);
    expect(cloned.items).not.toBe(obj.items);
    expect(cloned.items[0]).not.toBe(obj.items[0]);
  });

  test('handles Date objects', () => {
    const date = new Date('2025-01-01');
    const cloned = deepClone(date);

    expect(cloned).toEqual(date);
    expect(cloned).not.toBe(date);
  });

  test('mutations to cloned object do not affect original', () => {
    const obj = { a: { b: 1 } };
    const cloned = deepClone(obj);

    cloned.a.b = 999;

    expect(obj.a.b).toBe(1); // Original unchanged
    expect(cloned.a.b).toBe(999);
  });

  test('preserves type information', () => {
    interface User {
      id: number;
      name: string;
      meta?: { lastLogin: Date };
    }

    const user: User = {
      id: 1,
      name: 'Alice',
      meta: { lastLogin: new Date() }
    };

    const cloned = deepClone(user);

    // TypeScript should infer correct type
    const _typeCheck: User = cloned;
    expect(cloned.id).toBe(1);
    expect(cloned.name).toBe('Alice');
  });
});
