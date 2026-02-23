import { baseNextjsConfig } from './nextjs.js';
import type { KnipConfigObject } from './types.js';

export function defineNextjsConfig(overrides?: KnipConfigObject): KnipConfigObject {
  return {
    ...baseNextjsConfig,
    ...overrides,
    ignore: [...baseNextjsConfig.ignore, ...(overrides?.ignore ?? [])],
    ignoreDependencies: [...baseNextjsConfig.ignoreDependencies, ...(overrides?.ignoreDependencies ?? [])],
    project: [...baseNextjsConfig.project, ...(overrides?.project ?? [])],
  };
}
