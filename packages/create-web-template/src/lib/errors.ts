/**
 * An expected, user-facing failure (bad input, unreachable registry, dirty
 * target dir). Rendered as a plain message and exit code 1 — anything else
 * that reaches the top level is treated as a bug and printed with its stack.
 */
export class CliError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CliError';
  }
}
