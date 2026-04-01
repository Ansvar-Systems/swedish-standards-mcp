# Swedish Standards MCP

[![npm version](https://img.shields.io/npm/v/@ansvar/swedish-standards-mcp)](https://www.npmjs.com/package/@ansvar/swedish-standards-mcp)
[![CI](https://github.com/Ansvar-Systems/swedish-standards-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/Ansvar-Systems/swedish-standards-mcp/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)
[![MCP Registry](https://img.shields.io/badge/MCP%20Registry-ansvar.ai%2Fmcp-blue)](https://ansvar.ai/mcp)

Structured access to Swedish government cybersecurity standards: MSB Metodstod for systematiskt informationssakerhetsarbete, MSB Grundlaggande sakerhetesatgarder, DIGG digital sakerhet, MSBFS 2020:6/2020:7, SAPO sakerhetsskydd, and CERT-SE rekommendationer. Bilingual Swedish/English with FTS search, ISO 27002:2022 cross-references, and sector-based filtering.

Part of the [Ansvar MCP Network](https://ansvar.ai/mcp) -- specialist MCP servers for compliance and security intelligence.

---

## Quick Start

### Remote endpoint (no installation)

Add to your MCP client config:

```json
{
  "mcpServers": {
    "swedish-standards": {
      "url": "https://swedish-standards-mcp.vercel.app/mcp"
    }
  }
}
```

### Local (stdio via npx)

**Claude Desktop** -- edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "swedish-standards": {
      "command": "npx",
      "args": ["-y", "@ansvar/swedish-standards-mcp"]
    }
  }
}
```

**Cursor** -- edit `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "swedish-standards": {
      "command": "npx",
      "args": ["-y", "@ansvar/swedish-standards-mcp"]
    }
  }
}
```

**VS Code / GitHub Copilot** -- add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "swedish-standards": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@ansvar/swedish-standards-mcp"]
    }
  }
}
```

---


### Public Endpoint (Streamable HTTP)

Connect from any MCP client (Claude Desktop, ChatGPT, Cursor, VS Code, GitHub Copilot):

```
https://mcp.ansvar.eu/standards-se/mcp
```

**Claude Code:**
```bash
claude mcp add standards-se --transport http https://mcp.ansvar.eu/standards-se/mcp
```

**Claude Desktop / Cursor** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "standards-se": {
      "type": "url",
      "url": "https://mcp.ansvar.eu/standards-se/mcp"
    }
  }
}
```

No authentication required. See [all Ansvar MCP endpoints](https://github.com/Ansvar-Systems/Ansvar-Architecture-Documentation/blob/main/docs/mcp-remote-access.md).
## What's Included

| Source | Authority | Items | Language | Refresh |
|--------|-----------|-------|----------|---------|
| MSB Metodstod (Systematiskt informationssakerhetsarbete) | MSB | 98 controls | SV+EN | Annual |
| MSB Grundlaggande sakerhetesatgarder | MSB | 53 controls | SV+EN | Annual |
| DIGG Digital Sakerhet | DIGG | 25 controls | SV+EN | Annual |
| MSBFS 2020:6 / 2020:7 | MSB | 25 controls | SV+EN | Annual |
| SAPO Sakerhetsskydd | SAPO | 27 controls | SV+EN | Annual |
| CERT-SE Rekommendationer | CERT-SE | 25 controls | SV+EN | Annual |

**Total:** 253 controls across 6 frameworks.

For full coverage details, see [COVERAGE.md](COVERAGE.md).

---

## What's NOT Included

| Gap | Status |
|-----|--------|
| PTS (Post- och telestyrelsen) telecom security requirements | Planned for v0.2 |
| Finansinspektionen (FI) financial sector IT requirements | Planned for v0.2 |
| IVO (Inspektionen for vard och omsorg) healthcare IT requirements | Planned for v0.2 |
| ISO/IEC 27001:2022 full text | Excluded -- commercial ISO license; ISO cross-references available via `get_iso_mapping` |
| SS-EN ISO/IEC 27001 (Swedish adoption) | Excluded -- commercial SIS license |

For the complete gap list, see [COVERAGE.md -- What's NOT Included](COVERAGE.md#whats-not-included).

---

## Available Tools

| Tool | Category | Description |
|------|----------|-------------|
| `search_controls` | Search | Full-text search across all 6 frameworks. Returns controls ranked by FTS5 relevance. |
| `search_by_sector` | Search | Returns frameworks for a sector (`government`, `healthcare`, `finance`, etc.), optionally filtered by keyword. |
| `get_control` | Lookup | Full record for a single control: bilingual description, implementation guidance, ISO mapping. |
| `get_framework` | Lookup | Metadata for a framework: issuing body, version, control count, category breakdown. |
| `list_controls` | Lookup | All controls in a framework, filterable by category and level. Paginated. |
| `compare_controls` | Comparison | Side-by-side comparison of the same topic across 2-4 frameworks. |
| `get_iso_mapping` | Comparison | All Swedish controls mapped to a given ISO 27002:2022 control reference. |
| `list_frameworks` | Meta | Lists all frameworks in the database with summary stats. |
| `about` | Meta | Server version, build date, and coverage statistics. |
| `list_sources` | Meta | Data provenance: authority, standard name, retrieval method, license for each source. |
| `check_data_freshness` | Meta | Per-source freshness status against the expected refresh schedule. |

For full parameter documentation, return formats, and examples, see [TOOLS.md](TOOLS.md).

---

## Data Sources & Freshness

| Source | Last Refresh | Refresh Schedule |
|--------|-------------|-----------------|
| MSB Metodstod | 2026-03-12 | Annual |
| MSB Grundlaggande | 2026-03-12 | Annual |
| DIGG Digital Sakerhet | 2026-03-12 | Annual |
| MSBFS 2020:6/2020:7 | 2026-03-12 | Annual |
| SAPO Sakerhetsskydd | 2026-03-12 | Annual |
| CERT-SE Rekommendationer | 2026-03-12 | Annual |

The `ingest.yml` workflow runs automatically on the most frequent source schedule. The `check-updates.yml` workflow runs daily and creates a GitHub issue if any source is overdue.

To check freshness at runtime, call `check_data_freshness`. Full source provenance and licenses: [sources.yml](sources.yml).

---

## Security

This repository runs 6-layer automated security scanning on every push and weekly:

| Layer | Tool | What it checks |
|-------|------|----------------|
| Static analysis | CodeQL | Code vulnerabilities |
| SAST | Semgrep | Security anti-patterns |
| Container / dependency scan | Trivy | Known CVEs in dependencies |
| Secret detection | Gitleaks | Leaked credentials |
| Supply chain | OSSF Scorecard | Repository security posture |
| Dependency updates | Dependabot | Automated dependency PRs |

---

## Disclaimer

**THIS TOOL IS NOT PROFESSIONAL ADVICE.**

This MCP provides structured access to Swedish cybersecurity standards sourced from authoritative publications. It is provided for informational and research purposes only.

- Verify critical compliance decisions against the original standards
- Data is a snapshot -- sources update, and there may be a delay between upstream changes and database refresh
- See [DISCLAIMER.md](DISCLAIMER.md) for the full disclaimer and no-warranty statement

---

## Ansvar MCP Network

This server is part of the [Ansvar MCP Network](https://ansvar.ai/mcp) -- 276+ specialist MCP servers covering legislation, compliance frameworks, and cybersecurity standards.

| Category | Servers | Coverage |
|----------|---------|----------|
| Law MCPs | 108 | 119 countries, 668K+ laws |
| EU Regulations | 1 | 61 regulations, 4,054 articles |
| Security frameworks | 1 | 262 frameworks, 1,451 SCF controls |
| Domain-specific | ~48 | CVE, STRIDE, sanctions, OWASP, healthcare, financial, and more |

Browse the full directory at [ansvar.ai/mcp](https://ansvar.ai/mcp).

---

## Development

### Branch strategy

`feature-branch -> PR to dev -> verify on dev -> PR to main -> deploy`

Never push directly to `main`. `main` triggers npm publish and Vercel deployment.

### Setup

```bash
git clone https://github.com/Ansvar-Systems/swedish-standards-mcp.git
cd swedish-standards-mcp
npm install
npm run build
npm test
```

### Ingestion

```bash
# Full pipeline: fetch -> diff -> build DB -> update coverage
npm run ingest:full

# Individual steps
npm run ingest:fetch     # Download latest data from upstream sources
npm run ingest:diff      # Check for changes against current DB
npm run build:db         # Rebuild SQLite database
npm run coverage:update  # Regenerate coverage.json and COVERAGE.md

# Check freshness
npm run freshness:check
```

### Pre-deploy verification

```bash
npm run build            # Gate 1: build
npm run lint             # Gate 2: TypeScript strict
npm test                 # Gate 3: unit tests
npm run test:contract    # Gate 4: golden contract tests
sqlite3 data/standards.db "PRAGMA integrity_check;"   # Gate 5: DB integrity
npm run coverage:verify  # Gate 6: coverage consistency
```

---

## License & Data Licenses

**Code:** [Apache-2.0](LICENSE)

**Data licenses by source:**

| Source | License |
|--------|---------|
| MSB Metodstod | Public sector publication (MSB) |
| MSB Grundlaggande | Public sector publication (MSB) |
| DIGG Digital Sakerhet | Public sector publication (DIGG) |
| MSBFS 2020:6/2020:7 | Swedish government regulation (public) |
| SAPO Sakerhetsskydd | Public sector publication (SAPO) |
| CERT-SE Rekommendationer | Public sector publication (CERT-SE) |

All data is extracted from publicly available authoritative Swedish government publications. Zero AI-generated content in the database. See [sources.yml](sources.yml) for complete provenance.
