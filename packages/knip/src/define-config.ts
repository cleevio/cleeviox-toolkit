import type { KnipConfigObject } from './types/index.js';

export function defineConfig(base: KnipConfigObject, overrides?: KnipConfigObject): KnipConfigObject {
  return {
    ...base,
    ...overrides,
    ignore: [...(base.ignore ?? []), ...(overrides?.ignore ?? [])],
    ignoreDependencies: [...(base.ignoreDependencies ?? []), ...(overrides?.ignoreDependencies ?? [])],
    project: [...(base.project ?? []), ...(overrides?.project ?? [])],
  };
}
