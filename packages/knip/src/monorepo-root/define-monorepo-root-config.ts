import type { KnipConfigObject } from '../types/index.js';
import { baseMonorepoRootConfig } from './monorepo-root.js';

export function defineMonorepoRootConfig(overrides?: KnipConfigObject): KnipConfigObject {
  return {
    ...baseMonorepoRootConfig,
    ...overrides,
  };
}
