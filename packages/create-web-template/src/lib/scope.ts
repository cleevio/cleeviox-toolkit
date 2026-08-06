/** Single flip-point for the org scope. */
export const SCOPE = '@cleeviox' as const;

export const pkg = (name: string): string => `${SCOPE}/${name}`;
