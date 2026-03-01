import type { Configuration } from 'lint-staged';
import type { Script } from '~/types/script.js';

export type DefineConfigArgs = Script[];

// biome-ignore lint/correctness/noUnusedFunctionParameters: TODO
export const defineConfig = (config: DefineConfigArgs = []): Configuration => {
  return {};
};
