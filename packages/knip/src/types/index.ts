import type { KnipConfig } from 'knip';

export type KnipConfigObject = Exclude<KnipConfig, (...args: never[]) => unknown>;
