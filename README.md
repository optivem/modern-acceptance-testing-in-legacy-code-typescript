# Modern Acceptance Testing in Legacy Code (TypeScript)

[![commit-stage-monolith](https://github.com/optivem/modern-acceptance-testing-in-legacy-code-typescript/actions/workflows/commit-stage-monolith.yml/badge.svg)](https://github.com/optivem/modern-acceptance-testing-in-legacy-code-typescript/actions/workflows/commit-stage-monolith.yml)
[![acceptance-stage](https://github.com/optivem/modern-acceptance-testing-in-legacy-code-typescript/actions/workflows/acceptance-stage.yml/badge.svg)](https://github.com/optivem/modern-acceptance-testing-in-legacy-code-typescript/actions/workflows/acceptance-stage.yml)
[![qa-stage](https://github.com/optivem/modern-acceptance-testing-in-legacy-code-typescript/actions/workflows/qa-stage.yml/badge.svg)](https://github.com/optivem/modern-acceptance-testing-in-legacy-code-typescript/actions/workflows/qa-stage.yml)
[![qa-signoff](https://github.com/optivem/modern-acceptance-testing-in-legacy-code-typescript/actions/workflows/qa-signoff.yml/badge.svg)](https://github.com/optivem/modern-acceptance-testing-in-legacy-code-typescript/actions/workflows/qa-signoff.yml)
[![prod-stage](https://github.com/optivem/modern-acceptance-testing-in-legacy-code-typescript/actions/workflows/prod-stage.yml/badge.svg)](https://github.com/optivem/modern-acceptance-testing-in-legacy-code-typescript/actions/workflows/prod-stage.yml)

## Prerequisites

- Node.js 20+ (LTS)
- Docker Desktop
- PowerShell 7+

Ensure you have Node.js installed:

```shell
node --version
```

Check that you have PowerShell 7:

```shell
$PSVersionTable.PSVersion
```

## Run Everything

```powershell
.\run.ps1 all
```

This will:
1. Build the Monolith (compile TypeScript and create build)
2. Start Docker containers (Monolith, PostgreSQL, & Simulated External Systems)
3. Wait for services to be healthy
4. Run all System Tests

You can open these URLs in your browser:
- Monolith Application: [http://localhost:8082](http://localhost:8082)
- ERP API (JSON Server): [http://localhost:3200](http://localhost:3200)
- Tax API (JSON Server): [http://localhost:3201](http://localhost:3201)

## Separate Commands

### Build
Compiles the code and creates the Docker image (local mode only):
```powershell
.\run.ps1 build
```

### Start Services
Starts the Docker containers:
```powershell
# Local mode (uses locally built code)
.\run.ps1 start

# Pipeline mode (uses pre-built image from registry)
.\run.ps1 start pipeline
```

You can open these URLs in your browser:
- Monolith Application: [http://localhost:8082](http://localhost:8082)
- ERP API (JSON Server): [http://localhost:3200](http://localhost:3200)
- Tax API (JSON Server): [http://localhost:3201](http://localhost:3201)
- PostgreSQL Database: localhost:5434 (database: `eshop`, user: `eshop_user`, password: `eshop_password`)

### Run Tests
```powershell
.\run.ps1 test
```

### View Logs
```powershell
.\run.ps1 logs
```

### Stop Services
```powershell
.\run.ps1 stop
```

## License

[![MIT License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://opensource.org/licenses/MIT)

This project is released under the [MIT License](https://opensource.org/licenses/MIT).

## Contributors

- [Valentina Jemuović](https://github.com/valentinajemuovic)
- [Jelena Cupać](https://github.com/jcupac)
