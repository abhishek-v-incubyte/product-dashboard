## Product Dashboard

A React Router (v7) + Chakra UI app demonstrating a product catalog with search, cart, and a test suite (Vitest + Testing Library).

### Prerequisites

- Node 20+
- pnpm (recommended)

### Install

```bash
pnpm install
```

### Development (HMR)

```bash
pnpm dev
```

App runs at `http://localhost:5173`.

### Build

```bash
pnpm build
```

Build output goes to `build/` (server and client bundles).

### Preview/Serve build

```bash
pnpm start
```

This uses `react-router-serve` to serve `./build/server/index.js`.

### Tests

Run tests in watch/UI mode:

```bash
pnpm test
```

Run once (CI):

```bash
pnpm test:run
```

### Coverage

Generate coverage (text + json + html):

```bash
pnpm test:coverage
```

Open HTML report:

```bash
open ./coverage/index.html
```

### Notes

- Coverage excludes generated/config and design-only files (see `vitest.config.ts`).
- UI components from Chakra are not directly tested; behavior is covered via app components.
