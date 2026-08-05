// Template files import assets that only exist in generated apps
// (e.g. Storybook's preview importing globals.css) — declare them so the
// template typecheck resolves.
declare module '*.css';
