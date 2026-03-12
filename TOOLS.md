# Tools -- Swedish Standards MCP

> 11 tools across 4 categories: search, lookup, comparison, and meta

---

## Search Tools

### `search_controls`

Full-text search across all Swedish cybersecurity controls using FTS5. Returns controls ranked by relevance from the combined MSB Metodstod, MSB Grundlaggande, DIGG, MSBFS, SAPO, and CERT-SE datasets. Use this when you need to find controls by keyword without knowing the framework.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | string | Yes | Search terms, e.g. `"informationssakerhet"`, `"encryption"`, `"incident response"` |
| `framework_id` | string | No | Restrict results to one framework, e.g. `"msb-metodstod"`, `"cert-se-rekommendationer"`, `"msbfs-2020"` |
| `category` | string | No | Filter by control category, e.g. `"Ledning och styrning"` |
| `language` | `"sv"` \| `"en"` | No | Preferred display language for titles. Defaults to Swedish (`"sv"`). Controls without an English title always show Swedish. |
| `limit` | integer | No | Maximum results to return. Default: `20`. |
| `offset` | integer | No | Pagination offset. Default: `0`. |

**Returns:** A Markdown table with columns `ID`, `Control`, `Title`, `Framework`, `Category`, `Level` plus a `total_results` count above the table.

**Example:**
```
"Which Swedish government controls address information security management?"
-> search_controls({ query: "informationssakerhet", language: "sv" })

"Find MSB Metodstod controls on risk analysis"
-> search_controls({ query: "riskanalys", framework_id: "msb-metodstod" })
```

**Data sources:** All 6 frameworks (msb-metodstod, msb-grundlaggande, digg-digital-sakerhet, msbfs-2020, sapo-sakerhetsskydd, cert-se-rekommendationer)

**Limitations:**
- FTS5 phrase search: special characters (`"`, `^`, `*`, `-`, `:`) are stripped from the query before matching
- Searches bilingual content -- a Swedish-only query may miss English-only descriptions in the same control
- Does not support wildcard or regex patterns
- Relevance ranking is FTS5 rank, not semantic similarity

---

### `search_by_sector`

Returns frameworks applicable to a specific sector, optionally filtered by a keyword query within those frameworks. Use this to scope a compliance review to a particular industry before drilling into controls.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `sector` | string | Yes | One of: `government`, `healthcare`, `finance`, `energy`, `telecom`, `transport`, `water`, `digital_infrastructure`, `education`, `defense` |
| `query` | string | No | Optional keyword search within the sector's frameworks |

**Returns:** A Markdown table of matching frameworks (ID, name, issuing body, version, control count, language). If `query` is provided, a second table lists matching controls within those frameworks (top 10 per framework, ranked by FTS5 relevance).

**Example:**
```
"What security frameworks apply to Swedish government agencies?"
-> search_by_sector({ sector: "government" })

"Which government controls cover risk analysis?"
-> search_by_sector({ sector: "government", query: "riskanalys" })
```

**Data sources:** Framework `scope_sectors` metadata + FTS5 on controls

**Limitations:**
- Sector taxonomy is fixed to the values listed above
- A framework appears only if it was ingested with sector metadata -- frameworks without `scope_sectors` are not returned
- Query within sector does not cross-search frameworks not assigned to that sector

---

## Lookup Tools

### `get_control`

Retrieves the full record for a single control by its database ID. Returns the complete bilingual description, implementation guidance, verification guidance, ISO 27002 mapping, and source URL. Use this after `search_controls` or `list_controls` to get the full text of a specific control.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `control_id` | string | Yes | The control's database ID, e.g. `"msb-metodstod:L1"`, `"cert-se-rekommendationer:CSE-1"`, `"msbfs-2020:2020:6-1"` |

**Returns:** A structured Markdown document with control number, Swedish and English titles, framework and issuing body, category, level, ISO 27002 mapping, Swedish description (`Beskrivning`), English description, implementation guidance, verification guidance, and source URL.

**Example:**
```
"Give me the full text of MSB Metodstod control L1"
-> get_control({ control_id: "msb-metodstod:L1" })
```

**Data sources:** `controls` table joined to `frameworks`

**Limitations:**
- Returns a `NO_MATCH` error if the ID does not exist -- use `search_controls` or `list_controls` to discover valid IDs
- Not all controls have English descriptions -- Swedish is always present

---

### `get_framework`

Returns metadata for a single framework: issuing body, version, effective date, language, scope, control count, category breakdown, and source URL. Use this to understand what a framework covers before listing its controls.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `framework_id` | string | Yes | Framework identifier, e.g. `"msb-metodstod"`, `"msb-grundlaggande"`, `"digg-digital-sakerhet"`, `"msbfs-2020"`, `"sapo-sakerhetsskydd"`, `"cert-se-rekommendationer"` |

**Returns:** A Markdown document with framework name (Swedish and English), issuing body, version, language, control count, effective date, sectors, scope description, structure description, license, and a category breakdown table.

**Example:**
```
"What is the MSB Metodstod framework and how many controls does it have?"
-> get_framework({ framework_id: "msb-metodstod" })
```

**Data sources:** `frameworks` table, `controls` aggregate

**Limitations:**
- Does not return the controls themselves -- use `list_controls` to enumerate them
- Sector and scope fields depend on ingestion quality; some frameworks may have incomplete metadata

---

## Comparison Tools

### `list_controls`

Lists all controls in a framework, with optional filtering by category and level. Returns a paginated table. Use this to browse a complete framework or to enumerate controls within a specific control category.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `framework_id` | string | Yes | Framework identifier, e.g. `"msb-metodstod"`, `"msb-grundlaggande"` |
| `category` | string | No | Filter to one category, e.g. `"Ledning och styrning"`, `"Tekniska atgarder"` |
| `level` | string | No | Filter by level, e.g. `"Grundlaggande"`, `"Bindande"` |
| `language` | `"sv"` \| `"en"` | No | Preferred display language for titles. Defaults to Swedish. |
| `limit` | integer | No | Maximum results. Default: `50`. |
| `offset` | integer | No | Pagination offset. Default: `0`. |

**Returns:** A Markdown table with columns `ID`, `Control`, `Title`, `Category`, `Level` plus a `total_results` count.

**Example:**
```
"List all MSB Metodstod controls in the leadership category"
-> list_controls({ framework_id: "msb-metodstod", category: "Ledning och styrning" })

"Show me all MSB Grundlaggande technical controls"
-> list_controls({ framework_id: "msb-grundlaggande", category: "Tekniska atgarder" })
```

**Data sources:** `controls` table

**Limitations:**
- Category and level values must match exactly as stored in the database -- use `get_framework` to see the available categories first
- Default limit of 50 may truncate large frameworks (msb-metodstod has 98 controls)

---

### `compare_controls`

Searches the same keyword query across 2-4 frameworks simultaneously and shows the top 5 matching controls per framework side by side. Use this to compare how different Swedish standards treat the same topic.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | string | Yes | Topic to compare, e.g. `"informationssakerhet"`, `"incident"`, `"riskanalys"` |
| `framework_ids` | string[] | Yes | 2 to 4 framework IDs, e.g. `["msb-metodstod", "msbfs-2020"]` or `["msb-metodstod", "msb-grundlaggande", "digg-digital-sakerhet", "cert-se-rekommendationer"]` |

**Returns:** A Markdown section per framework showing the control number, title, and a 150-character snippet of the Swedish description for up to 5 matching controls.

**Example:**
```
"How do MSB Metodstod and MSBFS 2020 differ in their approach to information security?"
-> compare_controls({ query: "informationssakerhet", framework_ids: ["msb-metodstod", "msbfs-2020"] })

"Compare incident response requirements across MSB, CERT-SE, and SAPO"
-> compare_controls({ query: "incident", framework_ids: ["msb-metodstod", "cert-se-rekommendationer", "sapo-sakerhetsskydd"] })
```

**Data sources:** FTS5 on `controls` filtered by `framework_id`

**Limitations:**
- Returns at most 5 controls per framework -- not a full comparison of all matching controls
- Snippets are truncated at 150 characters; use `get_control` for full text
- Both frameworks must be in the database; passing an unknown ID silently returns zero results for that framework

---

### `get_iso_mapping`

Returns all Swedish controls that map to a specific ISO 27002:2022 control number. Use this to find which Swedish standards implement a given ISO requirement, or to check Swedish compliance coverage for an ISO audit.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `iso_control` | string | Yes | ISO 27002:2022 control reference, e.g. `"5.1"`, `"8.8"`, `"8.22"` |

**Returns:** A Markdown table grouped by framework, listing each Swedish control mapped to that ISO reference (ID, control number, title).

**Example:**
```
"Which Swedish controls implement ISO 27002 control 5.1 (Policies for information security)?"
-> get_iso_mapping({ iso_control: "5.1" })

"Show me all Swedish framework controls that map to ISO 27002 8.8"
-> get_iso_mapping({ iso_control: "8.8" })
```

**Data sources:** `controls.iso_mapping` field

**Limitations:**
- Only returns controls with an exact `iso_mapping` match -- controls without ISO mapping are not included
- ISO mapping coverage varies by framework: MSB Metodstod has extensive mapping; SAPO and CERT-SE mapping is partial
- Does not support partial matches or range queries (e.g. `"5.x"` will not match)

---

## Meta Tools

### `list_frameworks`

Returns a summary table of all frameworks in the database. No parameters required. Use this to discover which frameworks are available before calling `get_framework` or `list_controls`.

**Parameters:** None

**Returns:** A Markdown table listing framework ID, name, issuing body, version, control count, language, and sectors for each framework in the database.

**Example:**
```
"What Swedish cybersecurity frameworks does this MCP cover?"
-> list_frameworks()
```

**Data sources:** `frameworks` table joined to control counts

**Limitations:**
- Lists only frameworks loaded in the current database build -- reflects ingestion coverage
- Sector data may be empty for frameworks ingested without sector metadata

---

### `about`

Returns server metadata: version, category, schema version, database build date, and coverage statistics (framework count, control count, database size). Use this to check the current version and data state of the MCP.

**Parameters:** None

**Returns:** A Markdown document with server name, version, category, schema version, database build date, and a coverage metrics table (frameworks, controls, database size in MB).

**Example:**
```
"What version of the Swedish Standards MCP is running and when was it last updated?"
-> about()
```

**Data sources:** `db_metadata` table

**Limitations:**
- Database build date reflects when the SQLite database was compiled, not the publication date of the source standards
- Call `check_data_freshness` for per-source freshness status

---

### `list_sources`

Returns the data provenance table: for each source, the authority, standard name, retrieval method, and license. Use this to understand where the data comes from before relying on it in a compliance decision.

**Parameters:** None

**Returns:** A Markdown table with columns `ID`, `Authority`, `Standard / Document`, `Retrieval method`, `License`. Includes a disclaimer note about verifying against authoritative sources.

**Example:**
```
"Where does this MCP get its data from, and what are the licenses?"
-> list_sources()
```

**Data sources:** Hardcoded provenance list (sourced from `sources.yml`)

**Limitations:**
- The fallback list is hardcoded; full YAML parsing requires an optional dependency not included in the default build
- Does not show per-source item counts or last-refresh dates -- use `check_data_freshness` for that

---

### `check_data_freshness`

Reports how current each data source is against its expected refresh schedule. Returns a per-source status: `Current`, `Due in N days`, or `OVERDUE (N days)`. Use this to verify the database is not stale before using it for compliance decisions.

**Parameters:** None

**Returns:** A Markdown table with columns `Source`, `Last fetched`, `Refresh window`, `Status`. Includes a summary of any overdue or due-soon sources and instructions to trigger a data update.

**Example:**
```
"Is the Swedish Standards MCP data up to date?"
-> check_data_freshness()
```

**Data sources:** `data/coverage.json` (generated by `npm run coverage:update`)

**Limitations:**
- Returns a "no coverage data" message if `coverage.json` has not been generated yet -- run `npm run coverage:update` after first build
- Status is based on the `last_fetched` date in `coverage.json`, not a live check of upstream sources
- `OVERDUE` status means the data is past its scheduled refresh window, not necessarily that the data has changed

---

## Swedish Cybersecurity Glossary

This glossary covers terms used in Swedish government cybersecurity standards that appear as parameters, category names, or framework identifiers in the tools above.

| Term | Expansion | Meaning |
|------|-----------|---------|
| **MSB** | Myndigheten for samhallsskydd och beredskap | The Swedish Civil Contingencies Agency. Responsible for civil protection, public safety, and emergency management. Issues the Metodstod, Grundlaggande sakerhetesatgarder, and MSBFS regulations. |
| **DIGG** | Myndigheten for digital forvaltning | The Agency for Digital Government. Responsible for digitalization of the public sector. Issues digital security guidelines. |
| **SAPO** | Sakerhetspolisen | The Swedish Security Service. Responsible for protective security (sakerhetsskydd) including security screening, physical protection, and information security for classified operations. |
| **CERT-SE** | Computer Emergency Response Team Sweden | The national CSIRT, operated by MSB. Publishes security advisories and technical recommendations for Swedish organizations. |
| **MSBFS** | MSB:s forfattningssamling | MSB's regulatory publication series. MSBFS 2020:6 covers systematic information security for government agencies; MSBFS 2020:7 covers IT incident reporting obligations. |
| **Metodstod** | -- | Methodology support. Refers to MSB's comprehensive methodology for systematic information security work, structured around ISO 27001 management system principles. |
| **Sakerhetsskydd** | -- | Protective security. The Swedish regime for protecting national security interests, governed by the Protective Security Act (Sakerhetsskyddslagen 2018:585). Covers information security, physical security, and personnel security for classified activities. |
| **Informationssakerhet** | -- | Information security. The Swedish term used across all frameworks for the discipline of protecting information assets through confidentiality, integrity, and availability controls. |
| **Ledningssystem** | -- | Management system. Refers to the ISO 27001-based information security management system (ISMS) approach adopted by MSB Metodstod and required by MSBFS 2020:6. |
| **PTS** | Post- och telestyrelsen | The Swedish Post and Telecom Authority. Regulates electronic communications and postal services. Not yet included in this MCP (planned for v0.2). |
| **FI** | Finansinspektionen | The Swedish Financial Supervisory Authority. Supervises banks, insurers, and other financial institutions. IT security requirements not yet included (planned for v0.2). |
| **SIS** | Svenska institutet for standarder | The Swedish Institute for Standards. Publishes Swedish adoptions of ISO/IEC standards (SS-EN ISO series). |
