import { describe, expect, test } from 'bun:test';

import { type FigmaVariablesPayload, figmaVariablesToThemeCss, parseFigmaFileKey } from '../src/lib/figma.js';

describe('parseFigmaFileKey', () => {
  test('accepts file, design and board URLs', () => {
    expect(parseFigmaFileKey('https://www.figma.com/design/AbCd1234efGh/tokens?node-id=1')).toBe('AbCd1234efGh');
    expect(parseFigmaFileKey('https://figma.com/file/xYz987654321/app')).toBe('xYz987654321');
  });

  test('rejects non-figma URLs', () => {
    expect(parseFigmaFileKey('https://example.com/file/AbCd1234efGh')).toBeUndefined();
    expect(parseFigmaFileKey('not a url')).toBeUndefined();
  });
});

const PAYLOAD: FigmaVariablesPayload = {
  meta: {
    variableCollections: {
      'coll:1': { defaultModeId: 'mode:light', name: 'Primitives' },
      'coll:2': { defaultModeId: 'mode:default', name: 'Semantic' },
    },
    variables: {
      'var:alias': {
        name: 'Color/Surface',
        resolvedType: 'COLOR',
        valuesByMode: { 'mode:default': { id: 'var:white', type: 'VARIABLE_ALIAS' } },
        variableCollectionId: 'coll:2',
      },
      'var:bool': {
        name: 'Feature/Enabled',
        resolvedType: 'BOOLEAN',
        valuesByMode: { 'mode:light': true },
        variableCollectionId: 'coll:1',
      },
      'var:brand': {
        name: 'Color/Brand/Primary',
        resolvedType: 'COLOR',
        valuesByMode: { 'mode:light': { a: 1, b: 0.9059, g: 0.3608, r: 0.4235 } },
        variableCollectionId: 'coll:1',
      },
      'var:font': {
        name: 'Font/Family/Base',
        resolvedType: 'STRING',
        valuesByMode: { 'mode:light': 'Inter' },
        variableCollectionId: 'coll:1',
      },
      'var:overlay': {
        name: 'Color/Overlay',
        resolvedType: 'COLOR',
        valuesByMode: { 'mode:light': { a: 0.5, b: 0, g: 0, r: 0 } },
        variableCollectionId: 'coll:1',
      },
      'var:radius': {
        name: 'Radius/Md',
        resolvedType: 'FLOAT',
        valuesByMode: { 'mode:light': 8 },
        variableCollectionId: 'coll:1',
      },
      'var:spacing': {
        name: 'Spacing/Lg',
        resolvedType: 'FLOAT',
        valuesByMode: { 'mode:light': 24 },
        variableCollectionId: 'coll:1',
      },
      'var:white': {
        name: 'Color/White',
        resolvedType: 'COLOR',
        valuesByMode: { 'mode:light': { a: 1, b: 1, g: 1, r: 1 } },
        variableCollectionId: 'coll:1',
      },
      'var:zindex': {
        name: 'Elevation/Modal',
        resolvedType: 'FLOAT',
        valuesByMode: { 'mode:light': 40 },
        variableCollectionId: 'coll:1',
      },
    },
  },
};

describe('figmaVariablesToThemeCss', () => {
  const css = figmaVariablesToThemeCss(PAYLOAD, 'https://www.figma.com/design/AbCd1234efGh/tokens');

  test('colors land in @theme as hex / rgb with alpha', () => {
    expect(css).toContain('--color-color-brand-primary: #6c5ce7;');
    expect(css).toContain('--color-color-overlay: rgb(0 0 0 / 0.5);');
  });

  test('aliases resolve through the referenced variable default mode', () => {
    expect(css).toContain('--color-color-surface: #ffffff;');
  });

  test('floats map by name hint, unmatched ones fall back to :root', () => {
    expect(css).toContain('--radius-radius-md: 8px;');
    expect(css).toContain('--spacing-spacing-lg: 24px;');
    expect(css).toContain('--elevation-modal: 40px;');
  });

  test('font strings map to --font-*, booleans are skipped', () => {
    expect(css).toContain('--font-font-family-base: Inter;');
    expect(css).not.toContain('feature-enabled');
  });

  test('source URL is documented in the header', () => {
    expect(css).toContain('figma.com/design/AbCd1234efGh');
  });
});
