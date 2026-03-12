# Coverage -- Swedish Standards MCP

> Last verified: 2026-03-12 | Database version: 0.2.0

This document declares exactly what data the Swedish Standards MCP contains, what it does not contain, and the limitations of each source. It is the contract with users.

---

## What's Included

| Source | Authority | Items | Version / Date | Completeness | Refresh |
|--------|-----------|-------|----------------|-------------|---------|
| MSB Metodstod (Systematiskt informationssakerhetsarbete) | MSB | 98 controls | 2024 | Full | Annual |
| MSB Grundlaggande sakerhetesatgarder | MSB | 53 controls | 2024 | Full | Annual |
| MSBFS 2020:6 / 2020:7 | MSB | 25 controls | 2020 | Full | Annual |
| MSB Riskanalys (Vagledning for riskanalys) | MSB | 21 controls | 2024 | Full | Annual |
| MSB Klassificering (Vagledning for klassificering) | MSB | 20 controls | 2024 | Full | Annual |
| MSB Incidenthantering (Vagledning for incidenthantering) | MSB | 25 controls | 2024 | Full | Annual |
| DIGG Digital Sakerhet | DIGG | 25 controls | 2024 | Full | Annual |
| DIGG SDK / API / eID | DIGG | 25 controls | 2024 | Full | Annual |
| SAPO Sakerhetsskydd | Sakerhetspolisen (SAPO) | 35 controls | 2024 | Full | Manual |
| CERT-SE Rekommendationer | CERT-SE (MSB) | 25 controls | 2024 | Full | Annual |
| PTS Driftsakerhet (PTSFS) | Post- och telestyrelsen (PTS) | 25 controls | 2024 | Full | Manual |
| FI IT-verksamhet (FFFS + DORA) | Finansinspektionen (FI) | 25 controls | 2024 | Full | Annual |
| IMY Tekniska och organisatoriska atgarder | Integritetsskyddsmyndigheten (IMY) | 25 controls | 2024 | Full | Annual |
| HSLF-FS Informationshantering | Socialstyrelsen / E-halsomyndigheten / Inera | 25 controls | 2024 | Full | Manual |
| Cybersakerhetslagen (NIS2) | Riksdagen / MSB / PTS / FI | 25 controls | 2025 | Full | Annual |
| Energi- och transportsektorns cybersakerhetskrav | Energimyndigheten / Transportstyrelsen | 25 controls | 2025 | Full | Annual |

**Total:** 11 tools, 502 controls/requirements, database built from 16 authoritative Swedish sources.

---

## Authorities Covered

| Authority | Swedish Name | Frameworks |
|-----------|-------------|------------|
| MSB | Myndigheten for samhallsskydd och beredskap | Metodstod, Grundlaggande, MSBFS, Riskanalys, Klassificering, Incidenthantering |
| DIGG | Myndigheten for digital forvaltning | Digital Sakerhet, SDK/API/eID |
| SAPO | Sakerhetspolisen | Sakerhetsskydd |
| CERT-SE | CERT-SE (under MSB) | Tekniska rekommendationer |
| PTS | Post- och telestyrelsen | Driftsakerhet (PTSFS) |
| FI | Finansinspektionen | IT-verksamhet (FFFS + DORA) |
| IMY | Integritetsskyddsmyndigheten | Tekniska och organisatoriska atgarder |
| Socialstyrelsen | Socialstyrelsen | HSLF-FS informationshantering |
| E-halsomyndigheten | E-halsomyndigheten | Healthcare IT (in HSLF-FS) |
| Energimyndigheten | Energimyndigheten | Energy sector cybersecurity |
| Transportstyrelsen | Transportstyrelsen | Transport sector cybersecurity |

---

## What's NOT Included

| Gap | Reason | Planned? |
|-----|--------|----------|
| SS-ISO/IEC 27001:2023 (Swedish adoption, full text) | Commercial SIS standard -- reference mappings included via `iso_mapping` field, full text excluded | No |
| Forsvarsmaktens sakerhetsinstruktioner | Military security instructions -- classified, not publicly available | No |
| SKR (Sveriges Kommuner och Regioner) guidance | Municipal-specific guidance, complementary to MSB frameworks | Maybe |
| Riksbanken financial infrastructure requirements | Narrow scope, central bank specific | No |
| FRA (Forsvarets radioanstalt) requirements | Classified signal intelligence requirements | No |
| CIS Controls v8 / NIST CSF | International frameworks -- out of scope for Sweden-specific MCP | No |
| IVO (Inspektionen for vard och omsorg) | Healthcare inspection authority -- operational guidance, not framework controls | No |

---

## Limitations

- **Snapshot data, not live.** The database is a point-in-time extract. Standards may be updated between database rebuilds. The `check_data_freshness` tool reports the last-fetched date for each source.
- **Swedish as primary language.** All controls have Swedish titles and descriptions (`title_nl`, `description_nl`). English translations are provided for all 16 frameworks. Some controls may have Swedish-only content.
- **ISO mapping is partial.** Not all controls have `iso_mapping` populated. MSB Metodstod has the most complete ISO 27002:2022 mapping; other frameworks have varying coverage. `get_iso_mapping` only returns controls with an explicit mapping.
- **No case law or guidance letters.** The database contains normative controls only, not interpretive guidance, enforcement decisions, or agency correspondence.
- **Sector metadata may be incomplete.** Frameworks are tagged with `scope_sectors` values during ingestion. If a framework's sector coverage is broader than what's tagged, `search_by_sector` may not surface it.
- **Not a legal opinion.** Compliance with these standards is not verified by this tool. The tool provides structured access to control text -- whether a specific system or process meets a control is a judgment that requires qualified assessment.

---

## Data Freshness Schedule

| Source | Refresh Schedule | Last Refresh | Next Expected |
|--------|-----------------|-------------|---------------|
| MSB Metodstod | Annual | 2026-03-12 | 2027-01-01 |
| MSB Grundlaggande | Annual | 2026-03-12 | 2027-01-01 |
| MSBFS 2020:6/2020:7 | Annual | 2026-03-12 | 2027-01-01 |
| MSB Riskanalys | Annual | 2026-03-12 | 2027-01-01 |
| MSB Klassificering | Annual | 2026-03-12 | 2027-01-01 |
| MSB Incidenthantering | Annual | 2026-03-12 | 2027-01-01 |
| DIGG Digital Sakerhet | Annual | 2026-03-12 | 2027-01-01 |
| DIGG SDK/API/eID | Annual | 2026-03-12 | 2027-01-01 |
| SAPO Sakerhetsskydd | Manual | 2026-03-12 | On update |
| CERT-SE Rekommendationer | Annual | 2026-03-12 | 2027-01-01 |
| PTS Driftsakerhet | Manual | 2026-03-12 | On update |
| FI IT-verksamhet | Annual | 2026-03-12 | 2027-01-01 |
| IMY Tekniska atgarder | Annual | 2026-03-12 | 2027-01-01 |
| HSLF-FS Informationshantering | Manual | 2026-03-12 | On update |
| NIS2 Cybersakerhetslagen | Annual | 2026-03-12 | 2027-01-01 |
| Energi-Transport Sakerhet | Annual | 2026-03-12 | 2027-01-01 |

To check current freshness status programmatically, call the `check_data_freshness` tool.

---

## Regulatory Mapping

| Regulation / Law | Relevant Frameworks | Notes |
|-----------------|---------------------|-------|
| Sakerhetsskyddslagen (2018:585) | SAPO Sakerhetsskydd | Mandatory for activities of importance to Sweden's security |
| Sakerhetsskyddsforordningen (2021:955) | SAPO Sakerhetsskydd | Implementing regulation for the Protective Security Act |
| MSBFS 2020:6 | MSB Metodstod, MSBFS 2020 | Mandatory for Swedish government agencies |
| MSBFS 2020:7 | MSBFS 2020 | IT incident reporting obligation for government agencies |
| Cybersakerhetslagen (NIS2) | NIS2 Cybersakerhetslagen, MSB Metodstod | Swedish NIS2 transposition -- mandatory for essential and important entities |
| Dataskyddsforordningen (GDPR) | IMY Tekniska atgarder, MSB Metodstod, DIGG Digital Sakerhet | Security of personal data -- Article 32 technical measures |
| Patientdatalagen (2008:355) | HSLF-FS Informationshantering | Patient data security for healthcare |
| FFFS 2014:5 | FI IT-verksamhet | IT governance for financial institutions |
| DORA (Regulation (EU) 2022/2554) | FI IT-verksamhet | Digital operational resilience for financial sector |
| LEK (Lag om elektronisk kommunikation) | PTS Driftsakerhet | Telecom operational security requirements |
| Forvaltningslagen (2017:900) | DIGG Digital Sakerhet, DIGG SDK | Administrative Procedure Act -- digitalization requirements |
| PSD2 | FI IT-verksamhet | Payment services security |
| eIDAS | DIGG SDK | Electronic identification and trust services |

---

## Sector Coverage

### Government (Riksdag, government agencies, municipalities)

- **Included:** MSB Metodstod (98 controls), MSB Grundlaggande (53), MSBFS 2020 (25), MSB Riskanalys (21), MSB Klassificering (20), MSB Incidenthantering (25), DIGG Digital Sakerhet (25), DIGG SDK (25), SAPO (35), CERT-SE (25), NIS2 (25), IMY (25)
- **Gap:** Municipal-specific guidance from SKR (Sveriges Kommuner och Regioner) not included

### Defense and National Security

- **Included:** SAPO Sakerhetsskydd (35 controls -- information security, physical security, personnel security)
- **Gap:** Forsvarsmaktens sakerhetsinstruktioner (classified, not available)
- **Gap:** FRA (Forsvarets radioanstalt) signal intelligence requirements not included

### Telecom

- **Included:** PTS Driftsakerhet (25 controls -- operational security, redundancy, incident reporting, 5G security), NIS2 (25)
- **Coverage:** PTSFS requirements, signaling security, roaming, SIM swap protection, supply chain

### Financial Services

- **Included:** FI IT-verksamhet (25 controls -- governance, DORA, outsourcing, PSD2, AML/KYC), NIS2 (25), IMY (25)
- **Gap:** Riksbanken financial infrastructure requirements not included

### Healthcare

- **Included:** HSLF-FS Informationshantering (25 controls -- PDL, HSLF-FS, Inera services, E-halsomyndigheten), NIS2 (25), IMY (25)
- **Coverage:** Patient data logging, consent, SITHS, telemedicine, medical device security

### Energy

- **Included:** Energi-Transport Sakerhet (12 energy controls -- SCADA/OT, access control, remote access, incident reporting), NIS2 (25)
- **Coverage:** OT/SCADA segmentation, protocol security, backup power, vulnerability scanning

### Transport

- **Included:** Energi-Transport Sakerhet (13 transport controls -- maritime, aviation, railway, road, vehicles), NIS2 (25)
- **Coverage:** IMO/ISM maritime, ERTMS railway, GNSS spoofing, UNECE vehicle cybersecurity

### Data Protection (cross-sector)

- **Included:** IMY Tekniska atgarder (25 controls -- encryption, pseudonymization, DPIA, consent, breach notification)
- **Coverage:** GDPR Art. 25 (privacy by design), Art. 28 (processor agreements), Art. 30 (records), Art. 33 (breach notification), Art. 35 (DPIA)
