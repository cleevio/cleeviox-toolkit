import { describe, expect, test } from 'bun:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { targetDirectoryConflict } from '../src/lib/target-dir.js';

function tmp(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'target-dir-test-'));
}

describe('targetDirectoryConflict', () => {
  test('nonexistent directory is fine', () => {
    expect(targetDirectoryConflict(path.join(tmp(), 'does-not-exist'))).toBeUndefined();
  });

  test('empty directory is fine', () => {
    expect(targetDirectoryConflict(tmp())).toBeUndefined();
  });

  test('.git and .DS_Store do not block', () => {
    const dir = tmp();
    fs.mkdirSync(path.join(dir, '.git'));
    fs.writeFileSync(path.join(dir, '.DS_Store'), '');
    expect(targetDirectoryConflict(dir)).toBeUndefined();
  });

  test('any real content blocks', () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'package.json'), '{}');
    expect(targetDirectoryConflict(dir)).toContain('not empty');
  });
});
