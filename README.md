<div align="center">

<a href="https://github.com/cleevio/cleeviox-toolkit">
<img alt="CleevioX Logo" src="./public/logo.svg" width="308" style="background-color: #151a1d; padding: 15px" />
</a>

# CLEEVIOX TOOLKIT

### Shared configurations and tools for CleevioX projects

<!-- #### Technologies -->

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE) [![Node.js](https://img.shields.io/badge/node-%3E%3D24.0.0-brightgreen.svg)](https://nodejs.org/) [![Bun](https://img.shields.io/badge/bun-1.3.6-f472b6.svg)](https://bun.sh/)

[![Code Quality](https://github.com/cleevio/cleeviox-toolkit/actions/workflows/code-quality.yaml/badge.svg)](https://github.com/cleevio/cleeviox-toolkit/actions/workflows/code-quality.yaml) [![Tests](https://github.com/cleevio/cleeviox-toolkit/actions/workflows/tests.yaml/badge.svg)](https://github.com/cleevio/cleeviox-toolkit/actions/workflows/tests.yaml) [![Release](https://github.com/cleevio/cleeviox-toolkit/actions/workflows/release-packages.yaml/badge.svg)](https://github.com/cleevio/cleeviox-toolkit/actions/workflows/release-packages.yaml)

</div>

---

## Packages

| Package | Description |
|---------|-------------|
| [@cleeviox/biome](./packages/biome/README.md) | Biome configurations for linting and formatting |
| [@cleeviox/tsconfig](./packages/tsconfig/README.md) | TypeScript configurations for various project types |
| [@cleeviox/lint-staged](./packages/lint-staged/README.md) | Lint-staged configurations for pre-commit hooks |
| [@cleeviox/knip](./packages/knip/README.md) | Knip configurations |


## Getting Started

### Prerequisites

- Node.js >= 24.0.0
- Bun >= 1.3.6

### Installation

```bash
git clone https://github.com/cleevio/cleeviox-toolkit.git
cd cleeviox-toolkit
bun install
```

### Development

```bash
# Build all packages
bun run build

# Run linting
bun run lint

# Run type checking
bun run ts

# Format code
bun run format:fix
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using [conventional commits](https://www.conventionalcommits.org/)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
