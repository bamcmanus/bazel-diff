# Contributing

Contributions are welcome via pull requests.

## Requirements

- **Conventional commits** — all commit messages must follow the
  [Conventional Commits](https://www.conventionalcommits.org/) specification.
  This is enforced by commitlint in CI. Common types: `fix:`, `feat:`, `chore:`,
  `docs:`, `refactor:`, `test:`.
- **Tests** — changes to `src/index.js` must include corresponding test coverage
  in `src/index.test.js`.
- **Passing CI** — all of the following must pass before a PR can be merged:
  - `npm test` — unit tests
  - `npm run lint` — ESLint
  - `npm run format:check` — Prettier
  - `npm run build` followed by `git diff --exit-code dist/` — the compiled
    `dist/index.js` must be committed and up to date

## Getting Started

```sh
git clone https://github.com/bamcmanus/bazel-diff-action.git
cd bazel-diff-action
npm install
```

Run tests:

```sh
npm test
```

Build the action:

```sh
npm run build
```

## Reporting Issues

Open a [GitHub Issue](https://github.com/bamcmanus/bazel-diff-action/issues) for
bug reports and feature requests. For security vulnerabilities, use
[private vulnerability reporting](https://github.com/bamcmanus/bazel-diff-action/security/advisories/new)
instead.
