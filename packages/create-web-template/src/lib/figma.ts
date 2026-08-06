import { CliError } from './errors.js';

const FILE_KEY_PATTERN = /figma\.com\/(?:file|design|board)\/([A-Za-z0-9]{8,})/;
const FETCH_TIMEOUT_MS = 15_000;
const RGB_MAX = 255;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_FOUND = 404;
const HEX_RADIX = 16;
const HEX_WIDTH = 2;
const ALPHA_DECIMALS = 3;

const RADIUS_HINT = /(^|-)(radius|corner)/;
const SPACING_HINT = /(^|-)(spacing|space|gap)($|-)/;
const FONT_HINT = /(^|-)(font|family)($|-)/;

/** Extracts the file key from a figma.com file/design URL, or undefined. */
export function parseFigmaFileKey(url: string): string | undefined {
  return FILE_KEY_PATTERN.exec(url)?.[1];
}

interface FigmaAlias {
  readonly id: string;
  readonly type: 'VARIABLE_ALIAS';
}

interface FigmaColor {
  readonly a: number;
  readonly b: number;
  readonly g: number;
  readonly r: number;
}

type FigmaVariableValue = FigmaAlias | FigmaColor | boolean | number | string;

interface FigmaVariable {
  readonly name: string;
  readonly resolvedType: 'BOOLEAN' | 'COLOR' | 'FLOAT' | 'STRING';
  readonly valuesByMode: Readonly<Record<string, FigmaVariableValue>>;
  readonly variableCollectionId: string;
}

interface FigmaCollection {
  readonly defaultModeId: string;
  readonly name: string;
}

export interface FigmaVariablesPayload {
  readonly meta: {
    readonly variableCollections: Readonly<Record<string, FigmaCollection>>;
    readonly variables: Readonly<Record<string, FigmaVariable>>;
  };
}

/** GET /v1/files/:key/variables/local — requires a token with file_variables:read (Figma Enterprise). */
export async function fetchFigmaVariables(fileKey: string, token: string): Promise<FigmaVariablesPayload> {
  let response: Response;
  try {
    response = await fetch(`https://api.figma.com/v1/files/${fileKey}/variables/local`, {
      headers: { 'X-Figma-Token': token },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch {
    throw new CliError('Could not reach the Figma API — check your network and try again.');
  }

  if (response.status === HTTP_FORBIDDEN) {
    throw new CliError(
      'Figma rejected the request (403). The variables API needs a token with the ' +
        'file_variables:read scope and is available on Figma Enterprise plans only.',
    );
  }
  if (response.status === HTTP_NOT_FOUND) {
    throw new CliError('Figma file not found (404) — check the URL and that your token can access the file.');
  }
  if (!response.ok) {
    throw new CliError(`Figma API request failed with status ${response.status}.`);
  }
  return (await response.json()) as FigmaVariablesPayload;
}

function slugify(name: string): string {
  return name
    .split('/')
    .map((segment) =>
      segment
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    )
    .filter(Boolean)
    .join('-');
}

function isAlias(value: FigmaVariableValue): value is FigmaAlias {
  return typeof value === 'object' && value !== null && 'type' in value && value.type === 'VARIABLE_ALIAS';
}

function resolveValue(
  value: FigmaVariableValue,
  payload: FigmaVariablesPayload,
  seen: ReadonlySet<string>,
): Exclude<FigmaVariableValue, FigmaAlias> | undefined {
  if (!isAlias(value)) {
    return value;
  }
  if (seen.has(value.id)) {
    // Alias cycle — broken file data; skip the variable rather than loop.
    return undefined;
  }
  const target = payload.meta.variables[value.id];
  if (!target) {
    return undefined;
  }
  const mode = payload.meta.variableCollections[target.variableCollectionId]?.defaultModeId;
  const targetValue = mode === undefined ? undefined : target.valuesByMode[mode];
  if (targetValue === undefined) {
    return undefined;
  }
  return resolveValue(targetValue, payload, new Set([...seen, value.id]));
}

function colorToCss(color: FigmaColor): string {
  const channel = (component: number): number => Math.round(component * RGB_MAX);
  const [r, g, b] = [channel(color.r), channel(color.g), channel(color.b)];
  if (color.a >= 1) {
    const hex = (component: number): string => component.toString(HEX_RADIX).padStart(HEX_WIDTH, '0');
    return `#${hex(r)}${hex(g)}${hex(b)}`;
  }
  return `rgb(${r} ${g} ${b} / ${Number(color.a.toFixed(ALPHA_DECIMALS))})`;
}

interface ThemeEntry {
  /** `theme` lands in @theme (generates Tailwind utilities); `root` in :root. */
  readonly block: 'root' | 'theme';
  readonly property: string;
  readonly value: string;
}

function toThemeEntry(
  variable: FigmaVariable,
  resolved: Exclude<FigmaVariableValue, FigmaAlias>,
): ThemeEntry | undefined {
  const slug = slugify(variable.name);
  if (slug.length === 0) {
    return undefined;
  }

  if (variable.resolvedType === 'COLOR' && typeof resolved === 'object') {
    return { block: 'theme', property: `--color-${slug}`, value: colorToCss(resolved) };
  }
  if (variable.resolvedType === 'FLOAT' && typeof resolved === 'number') {
    if (RADIUS_HINT.test(slug)) {
      return { block: 'theme', property: `--radius-${slug}`, value: `${resolved}px` };
    }
    if (SPACING_HINT.test(slug)) {
      return { block: 'theme', property: `--spacing-${slug}`, value: `${resolved}px` };
    }
    return { block: 'root', property: `--${slug}`, value: `${resolved}px` };
  }
  if (variable.resolvedType === 'STRING' && typeof resolved === 'string') {
    if (FONT_HINT.test(slug)) {
      return { block: 'theme', property: `--font-${slug}`, value: resolved };
    }
    return { block: 'root', property: `--${slug}`, value: `'${resolved.replace(/'/g, "\\'")}'` };
  }
  // Booleans (and type mismatches) have no CSS representation.
  return undefined;
}

/**
 * Maps Figma variables (default mode, aliases resolved) onto a Tailwind v4
 * theme stylesheet: COLOR to --color-*, FLOAT to --radius-* or --spacing-*
 * by name hint (plain :root var otherwise), font-ish STRING to --font-*.
 */
export function figmaVariablesToThemeCss(payload: FigmaVariablesPayload, sourceUrl: string): string {
  const entries: ThemeEntry[] = [];
  const used = new Set<string>();

  for (const variable of Object.values(payload.meta.variables)) {
    const mode = payload.meta.variableCollections[variable.variableCollectionId]?.defaultModeId;
    const raw = mode === undefined ? undefined : variable.valuesByMode[mode];
    if (raw === undefined) {
      continue;
    }
    const resolved = resolveValue(raw, payload, new Set());
    if (resolved === undefined) {
      continue;
    }
    const entry = toThemeEntry(variable, resolved);
    // First occurrence wins on slug collisions across collections.
    if (entry && !used.has(entry.property)) {
      used.add(entry.property);
      entries.push(entry);
    }
  }

  const render = (block: ThemeEntry['block'], wrapper: string): string => {
    const lines = entries
      .filter((entry) => entry.block === block)
      .sort((a, b) => a.property.localeCompare(b.property))
      .map((entry) => `  ${entry.property}: ${entry.value};`);
    return lines.length === 0 ? '' : `${wrapper} {\n${lines.join('\n')}\n}\n`;
  };

  const header =
    `/*\n * Design tokens generated from Figma variables:\n * ${sourceUrl}\n *\n` +
    ' * Edit by hand or regenerate — this file is yours after scaffolding.\n */\n';
  return [header, render('theme', '@theme'), render('root', ':root')].filter(Boolean).join('\n');
}
