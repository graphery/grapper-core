# 1.0.0-beta.8 (2025-08-27)

- Fixes a bug in the support to `intersection.enter` and `intersection.exit` when the component is
  a gSVG object and has directly the `._el` property.

# 1.0.0-beta.7 (2025-08-26)

- Adds support for `intersection.enter` and `intersection.exit` events in `svg` components that have
  gSVG support, that is, it has `svg._el` property.
- Prevents multiple `intersection.exit` events from being fired.

# 1.0.0-beta.6 (2025-08-21)

- Adds support to `.alias()` to set multiple names to a component.

# 1.0.0-beta.5 (2025-08-08)

- Initial release.
- Migration from Graphane projects.
- Build NPM package and fix minor errors (from beta.1 to beta.5).