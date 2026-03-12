// scripts/seed-test-db.ts
// Builds a minimal test database at data/standards.db for development and testing.
// Uses @ansvar/mcp-sqlite (WASM-based, CommonJS loaded via createRequire).

import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'standards.db');

// Ensure the data directory exists
mkdirSync(join(__dirname, '..', 'data'), { recursive: true });

const require = createRequire(import.meta.url);
const { Database } = require('@ansvar/mcp-sqlite');
const db = new Database(DB_PATH);

db.exec(`
CREATE TABLE IF NOT EXISTS frameworks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_nl TEXT,
  issuing_body TEXT NOT NULL,
  version TEXT NOT NULL,
  effective_date TEXT,
  scope TEXT,
  scope_sectors TEXT,
  structure_description TEXT,
  source_url TEXT,
  license TEXT,
  language TEXT NOT NULL DEFAULT 'sv'
);

CREATE TABLE IF NOT EXISTS controls (
  id TEXT PRIMARY KEY,
  framework_id TEXT NOT NULL REFERENCES frameworks(id),
  control_number TEXT NOT NULL,
  title TEXT,
  title_nl TEXT NOT NULL,
  description TEXT,
  description_nl TEXT NOT NULL,
  category TEXT,
  subcategory TEXT,
  level TEXT,
  iso_mapping TEXT,
  implementation_guidance TEXT,
  verification_guidance TEXT,
  source_url TEXT
);

CREATE VIRTUAL TABLE IF NOT EXISTS controls_fts USING fts5(
  id,
  title,
  title_nl,
  description,
  description_nl,
  category,
  content='controls',
  content_rowid='rowid'
);

CREATE TABLE IF NOT EXISTS db_metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`);

const insertFramework = db.prepare(
  'INSERT OR REPLACE INTO frameworks (id, name, name_nl, issuing_body, version, effective_date, scope, scope_sectors, structure_description, source_url, license, language) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

insertFramework.run('msb-metodstod', 'Systematic Information Security Work', 'Systematiskt informationssakerhetsarbete', 'Myndigheten for samhallsskydd och beredskap (MSB)', '2024', '2024-01-01', 'Methodology for systematic information security work based on ISO 27001', '["government"]', 'Organized by 10 areas: management, organization, risk management, classification, technical, administrative, incident, continuity, monitoring, physical.', 'https://www.informationssakerhet.se/metodstod/', 'Public sector publication', 'sv');

insertFramework.run('msb-grundlaggande', 'Basic Security Measures', 'Grundlaggande sakerhetesatgarder', 'Myndigheten for samhallsskydd och beredskap (MSB)', '2024', '2024-01-01', 'Fundamental security measures for Swedish organizations', '["government","digital_infrastructure"]', 'Organized by type: technical (GT), administrative (GA), and physical (GF) measures.', 'https://www.informationssakerhet.se/metodstod/', 'Public sector publication', 'sv');

insertFramework.run('msbfs-2020', 'MSB Regulations on Information Security', 'MSB:s foreskrifter om informationssakerhet (MSBFS 2020:6 och 2020:7)', 'Myndigheten for samhallsskydd och beredskap (MSB)', '2020', '2020-10-01', 'Mandatory requirements for Swedish government agencies on information security and incident reporting', '["government"]', 'Two regulations: MSBFS 2020:6 (systematic security) and 2020:7 (incident reporting).', 'https://www.msb.se/sv/regler/gallande-regler/krisberedskap-och-civilt-forsvar/msbfs-20206/', 'Swedish government regulation (public)', 'sv');

insertFramework.run('msb-riskanalys', 'Risk Analysis Methodology Guidance', 'Vagledning for riskanalys', 'Myndigheten for samhallsskydd och beredskap (MSB)', '2024', '2024-01-01', 'Methodology guidance for conducting risk analyses of information assets', '["government","digital_infrastructure"]', 'Organized by risk analysis phase: preparation, identification, evaluation, treatment, and follow-up.', 'https://www.informationssakerhet.se/metodstod/riskanalys/', 'Public sector publication', 'sv');

insertFramework.run('msb-klassificering', 'Information Classification Guidance', 'Vagledning for klassificering av information', 'Myndigheten for samhallsskydd och beredskap (MSB)', '2024', '2024-01-01', 'Guidance for classifying information assets by confidentiality, integrity, and availability', '["government","digital_infrastructure"]', 'Organized by phase: classification model, execution, handling rules, and governance.', 'https://www.informationssakerhet.se/metodstod/klassificering/', 'Public sector publication', 'sv');

insertFramework.run('msb-incidenthantering', 'Incident Management Guidance', 'Vagledning for incidenthantering', 'Myndigheten for samhallsskydd och beredskap (MSB)', '2024', '2024-01-01', 'Guidance for establishing and operating incident management capabilities', '["government","digital_infrastructure"]', 'Organized by phase: preparation, response, communication, and follow-up.', 'https://www.informationssakerhet.se/metodstod/incidenthantering/', 'Public sector publication', 'sv');

insertFramework.run('digg-digital-sakerhet', 'Digital Security Guidance', 'Vagledning for digital sakerhet', 'Myndigheten for digital forvaltning (DIGG)', '2024', '2024-01-01', 'Security guidance for Swedish government digital services', '["government","digital_infrastructure"]', 'Organized by topic: digital services, identity management, data protection, and cloud services.', 'https://www.digg.se/digitala-tjanster/digital-sakerhet', 'Public sector publication', 'sv');

insertFramework.run('digg-sdk', 'Secure Digital Communication and Digital Government Infrastructure', 'Saker digital kommunikation och digital samverkan', 'Myndigheten for digital forvaltning (DIGG)', '2024', '2024-01-01', 'DIGG requirements for SDK, API management, digital collaboration, and e-ID', '["government","digital_infrastructure"]', 'Organized by area: SDK, API management, digital collaboration, and e-ID.', 'https://www.digg.se/digitala-tjanster/sdk', 'Public sector publication', 'sv');

insertFramework.run('sapo-sakerhetsskydd', 'Security Protection Guidance', 'Vagledning for sakerhetsskydd', 'Sakerhetspolisen (SAPO)', '2024', '2021-12-01', 'Security protection guidance under the Security Protection Act (2018:585)', '["government"]', 'Organized by protection area: information security, physical security, and personnel security.', 'https://sakerhetspolisen.se/verksamheten/sakerhetsskydd.html', 'Public sector guidance', 'sv');

insertFramework.run('cert-se-rekommendationer', 'CERT-SE Technical Recommendations', 'CERT-SE tekniska rekommendationer', 'CERT-SE (Myndigheten for samhallsskydd och beredskap)', '2024', '2024-01-01', 'Technical security recommendations for Swedish organizations', '["government","digital_infrastructure"]', 'Organized by technical domain: network, email, DNS, web, authentication, vulnerability management, and cloud security.', 'https://www.cert.se/rekommendationer/', 'Public sector publication', 'sv');

insertFramework.run('pts-driftsakerhet', 'Telecom Operational Security Requirements (PTSFS)', 'Foreskrifter om driftsakerhet for elektronisk kommunikation', 'Post- och telestyrelsen (PTS)', '2024', '2015-01-01', 'Security and operational requirements for electronic communications providers', '["telecom","digital_infrastructure"]', 'Covers general requirements, incident reporting, communication protection, and operational security.', 'https://pts.se/sv/bransch/regler/foreskrifter/ptsfs-20151/', 'Swedish government regulation (public)', 'sv');

insertFramework.run('fi-it-verksamhet', 'Financial Sector IT Requirements (FFFS)', 'Finansinspektionens foreskrifter om IT-verksamhet', 'Finansinspektionen (FI)', '2024', '2014-12-01', 'IT governance, security, and operational requirements for financial institutions', '["finance"]', 'Covers governance, systems development, operations, outsourcing, incident management, and DORA.', 'https://www.fi.se/sv/vara-register/sok-fffs/2014/20145/', 'Swedish government regulation (public)', 'sv');

insertFramework.run('imy-tekniska-atgarder', 'Data Protection Technical and Organizational Measures', 'Vagledning om tekniska och organisatoriska atgarder', 'Integritetsskyddsmyndigheten (IMY)', '2024', '2018-05-25', 'IMY guidance on technical and organizational security measures for GDPR compliance', '["government","finance","healthcare","digital_infrastructure"]', 'Technical measures (encryption, access control, logging) and organizational measures (policy, DPO, DPIA, training).', 'https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/tekniska-och-organisatoriska-atgarder/', 'Public sector guidance', 'sv');

insertFramework.run('hslf-fs-informationshantering', 'Healthcare Information Handling Requirements', 'Foreskrifter om informationshantering i halso- och sjukvarden', 'Socialstyrelsen / E-halsomyndigheten / Inera', '2024', '2016-01-01', 'Information security requirements for Swedish healthcare', '["healthcare"]', 'Patient Data Act, HSLF-FS regulations, Inera services (SITHS, HSA, NPO), and E-halsomyndigheten.', 'https://www.socialstyrelsen.se/regler-och-riktlinjer/foreskrifter-och-allmanna-rad/', 'Swedish government regulation (public)', 'sv');

insertFramework.run('nis2-cybersakerhetslagen', 'Swedish NIS2 Transposition (Cybersakerhetslagen)', 'Cybersakerhetslagen (svensk NIS2-implementation)', 'Riksdagen / MSB / PTS / FI', '2025', '2025-01-01', 'Swedish transposition of the EU NIS2 Directive into national law', '["government","digital_infrastructure","telecom","finance","healthcare","energy","transport","water"]', 'Governance, risk management measures (Article 21), incident reporting (Article 23), and supervision.', 'https://www.msb.se/sv/amnesomraden/cybersakerhet-och-informationssakerhet/nis-direktivet/', 'Swedish law (public)', 'sv');

insertFramework.run('energi-transport-sakerhet', 'Energy and Transport Sector Cybersecurity Requirements', 'Cybersakerhetskrav for energi- och transportsektorn', 'Energimyndigheten / Transportstyrelsen', '2025', '2025-01-01', 'Cybersecurity requirements for Swedish energy and transport sectors', '["energy","transport"]', 'Energy (SCADA/OT) and transport (maritime, aviation, railway, road) cybersecurity.', 'https://www.energimyndigheten.se/', 'Swedish government requirements (public)', 'sv');

const insertControl = db.prepare(
  'INSERT OR REPLACE INTO controls (id, framework_id, control_number, title, title_nl, description, description_nl, category, subcategory, level, iso_mapping, implementation_guidance, verification_guidance, source_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

insertControl.run('msb-metodstod:L1', 'msb-metodstod', 'L1', 'Management commitment to information security', 'Ledningens engagemang for informationssakerhet', 'Top management shall demonstrate leadership and commitment to information security by establishing an information security policy, ensuring information security objectives are set, and providing necessary resources.', 'Hogsta ledningen ska visa ledarskap och engagemang for informationssakerhet genom att uppractta en informationssakerhetspolicy, sakerstalla att informationssakerhetsmal sacts, och tillhandahalla nodvandiga resurser.', 'Ledning och styrning', 'Engagemang', null, '5.1', 'Uppractta informationssakerhetspolicy undertecknad av ledningen. Sakerstall att resurser allokeras.', 'Kontrollera att policy finns och ar undertecknad av ledningen.', 'https://www.informationssakerhet.se/metodstod/');

insertControl.run('msb-metodstod:T1', 'msb-metodstod', 'T1', 'Network segmentation and filtering', 'Natverkssegmentering och filtrering', 'Networks shall be segmented into zones with appropriate filtering between them to control traffic flows and limit the impact of security incidents.', 'Natverk ska segmenteras i zoner med lamplig filtrering mellan dem for att kontrollera trafikfloden och begracnsa konsekvenser av sakerhetshacndelser.', 'Tekniska atgarder', 'Natverk', null, '8.22', 'Implementera brandvaggar mellan sakerhetszonerna. Dokumentera tillatna trafikfloden.', 'Granska brandvaggsregler och verifiera att segmenteringen ar korrekt.', 'https://www.informationssakerhet.se/metodstod/');

insertControl.run('msb-grundlaggande:GT1', 'msb-grundlaggande', 'GT1', 'Patch management', 'Patchhantering', 'All systems shall have security patches applied within defined timeframes based on severity.', 'Alla system ska ha sakerhetsuppdateringar applicerade inom definierade tidsramar baserat pa allvarlighetsgrad.', 'Tekniska atgarder', 'Uppdatering', 'Grundlaggande', '8.8', 'Uppractta en process for patchhantering. Kritiska patchar bor appliceras inom 72 timmar.', 'Granska patchstatus och kontrollera att tidsramar foljs.', 'https://www.informationssakerhet.se/metodstod/');

insertControl.run('msbfs-2020:2020:6-1', 'msbfs-2020', '2020:6-1', 'Obligation for systematic information security work', 'Krav pa systematiskt informationssakerhetsarbete', 'Government agencies covered by the regulation shall conduct systematic and risk-based information security work.', 'Myndigheter som omfattas av foreskriften ska bedriva systematiskt och riskbaserat informationssakerhetsarbete.', 'MSBFS 2020:6', 'Allmanna krav', 'Bindande', '5.1', 'Uppractta ett ledningssystem for informationssakerhet baserat pa ISO 27001.', 'Kontrollera att ledningssystem finns och att det omfattar alla krav i foreskriften.', 'https://www.msb.se/sv/regler/gallande-regler/krisberedskap-och-civilt-forsvar/msbfs-20206/');

db.exec("INSERT INTO controls_fts(controls_fts) VALUES('rebuild')");

const insertMeta = db.prepare('INSERT OR REPLACE INTO db_metadata (key, value) VALUES (?, ?)');
insertMeta.run('schema_version', '1.0');
insertMeta.run('category', 'domain_intelligence');
insertMeta.run('mcp_name', 'Swedish Standards MCP');
insertMeta.run('database_built', new Date().toISOString().split('T')[0]);
insertMeta.run('database_version', '0.1.0');

db.pragma('journal_mode=DELETE');
db.exec('VACUUM');
db.close();

console.log('Test database seeded at data/standards.db');
