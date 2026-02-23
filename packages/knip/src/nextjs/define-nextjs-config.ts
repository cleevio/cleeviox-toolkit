import type { KnipConfigObject } from '../types/index.js';
import { baseNextjsConfig } from './nextjs.js';

export function defineNextjsConfig(overrides?: KnipConfigObject): KnipConfigObject {
  return {
    ...baseNextjsConfig,
    ...overrides,
    ignore: [...baseNextjsConfig.ignore, ...(overrides?.ignore ?? [])],
    ignoreDependencies: [...baseNextjsConfig.ignoreDependencies, ...(overrides?.ignoreDependencies ?? [])],
    project: [...baseNextjsConfig.project, ...(overrides?.project ?? [])],
  };
}
