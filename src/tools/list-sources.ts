// src/tools/list-sources.ts
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { successResponse } from '../response-meta.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface SourceEntry {
  id: string;
  authority: string;
  name: string;
  retrieval_method: string;
  license: string;
  url?: string;
}

const FALLBACK_SOURCES: SourceEntry[] = [
  {
    id: 'MSB-Metodstod',
    authority: 'Myndigheten for samhallsskydd och beredskap (MSB)',
    name: 'Systematiskt informationssakerhetsarbete',
    retrieval_method: 'Embedded data (structured extraction)',
    license: 'Public sector publication',
    url: 'https://www.informationssakerhet.se/metodstod/',
  },
  {
    id: 'MSB-Grundlaggande',
    authority: 'Myndigheten for samhallsskydd och beredskap (MSB)',
    name: 'Grundlaggande sakerhetesatgarder',
    retrieval_method: 'Embedded data (structured extraction)',
    license: 'Public sector publication',
    url: 'https://www.informationssakerhet.se/metodstod/',
  },
  {
    id: 'MSB-Riskanalys',
    authority: 'Myndigheten for samhallsskydd och beredskap (MSB)',
    name: 'Vagledning for riskanalys',
    retrieval_method: 'Embedded data (structured extraction)',
    license: 'Public sector publication',
    url: 'https://www.informationssakerhet.se/metodstod/riskanalys/',
  },
  {
    id: 'MSB-Klassificering',
    authority: 'Myndigheten for samhallsskydd och beredskap (MSB)',
    name: 'Vagledning for klassificering av information',
    retrieval_method: 'Embedded data (structured extraction)',
    license: 'Public sector publication',
    url: 'https://www.informationssakerhet.se/metodstod/klassificering/',
  },
  {
    id: 'MSB-Incidenthantering',
    authority: 'Myndigheten for samhallsskydd och beredskap (MSB)',
    name: 'Vagledning for incidenthantering',
    retrieval_method: 'Embedded data (structured extraction)',
    license: 'Public sector publication',
    url: 'https://www.informationssakerhet.se/metodstod/incidenthantering/',
  },
  {
    id: 'DIGG-Digital-Sakerhet',
    authority: 'Myndigheten for digital forvaltning (DIGG)',
    name: 'Vagledning for digital sakerhet',
    retrieval_method: 'Embedded data (structured extraction)',
    license: 'Public sector publication',
    url: 'https://www.digg.se/digitala-tjanster/digital-sakerhet',
  },
  {
    id: 'DIGG-SDK',
    authority: 'Myndigheten for digital forvaltning (DIGG)',
    name: 'Saker digital kommunikation, API-hantering och e-legitimering',
    retrieval_method: 'Embedded data (structured extraction)',
    license: 'Public sector publication',
    url: 'https://www.digg.se/digitala-tjanster/sdk',
  },
  {
    id: 'MSBFS-2020',
    authority: 'Myndigheten for samhallsskydd och beredskap (MSB)',
    name: 'MSBFS 2020:6 and 2020:7',
    retrieval_method: 'Embedded data (structured extraction)',
    license: 'Swedish government regulation (public)',
    url: 'https://www.msb.se/sv/regler/gallande-regler/krisberedskap-och-civilt-forsvar/msbfs-20206/',
  },
  {
    id: 'SAPO',
    authority: 'Sakerhetspolisen (SAPO)',
    name: 'Vagledning for sakerhetsskydd',
    retrieval_method: 'Embedded data (structured extraction)',
    license: 'Public sector guidance',
    url: 'https://sakerhetspolisen.se/verksamheten/sakerhetsskydd.html',
  },
  {
    id: 'CERT-SE',
    authority: 'CERT-SE (under MSB)',
    name: 'Tekniska rekommendationer',
    retrieval_method: 'Embedded data (structured extraction)',
    license: 'Public sector publication',
    url: 'https://www.cert.se/rekommendationer/',
  },
  {
    id: 'PTS',
    authority: 'Post- och telestyrelsen (PTS)',
    name: 'Foreskrifter om driftsakerhet for elektronisk kommunikation',
    retrieval_method: 'Embedded data (structured extraction)',
    license: 'Swedish government regulation (public)',
    url: 'https://pts.se/sv/bransch/regler/foreskrifter/ptsfs-20151/',
  },
  {
    id: 'FI',
    authority: 'Finansinspektionen (FI)',
    name: 'Foreskrifter om IT-verksamhet (FFFS) och DORA',
    retrieval_method: 'Embedded data (structured extraction)',
    license: 'Swedish government regulation (public)',
    url: 'https://www.fi.se/sv/vara-register/sok-fffs/2014/20145/',
  },
  {
    id: 'IMY',
    authority: 'Integritetsskyddsmyndigheten (IMY)',
    name: 'Vagledning om tekniska och organisatoriska atgarder',
    retrieval_method: 'Embedded data (structured extraction)',
    license: 'Public sector guidance',
    url: 'https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/tekniska-och-organisatoriska-atgarder/',
  },
  {
    id: 'HSLF-FS',
    authority: 'Socialstyrelsen / E-halsomyndigheten / Inera',
    name: 'Informationshantering i halso- och sjukvarden (PDL, SITHS, NPO)',
    retrieval_method: 'Embedded data (structured extraction)',
    license: 'Swedish government regulation (public)',
    url: 'https://www.socialstyrelsen.se/regler-och-riktlinjer/foreskrifter-och-allmanna-rad/',
  },
  {
    id: 'NIS2',
    authority: 'Riksdagen / MSB / PTS / FI',
    name: 'Cybersakerhetslagen (svensk NIS2-implementation)',
    retrieval_method: 'Embedded data (structured extraction)',
    license: 'Swedish law (public)',
    url: 'https://www.msb.se/sv/amnesomraden/cybersakerhet-och-informationssakerhet/nis-direktivet/',
  },
  {
    id: 'Energi-Transport',
    authority: 'Energimyndigheten / Transportstyrelsen',
    name: 'Cybersakerhetskrav for energi- och transportsektorn',
    retrieval_method: 'Embedded data (structured extraction)',
    license: 'Swedish government requirements (public)',
    url: 'https://www.energimyndigheten.se/',
  },
];

export function handleListSources() {
  const sources: SourceEntry[] = FALLBACK_SOURCES;

  const lines: string[] = [];

  lines.push('## Data Sources');
  lines.push('');
  lines.push(
    'This MCP server aggregates Swedish cybersecurity standards from the following authoritative sources:'
  );
  lines.push('');
  lines.push('| ID | Authority | Standard / Document | Retrieval method | License |');
  lines.push('|----|-----------|---------------------|-----------------|---------|');

  for (const src of sources) {
    const nameCell = src.url ? `[${src.name}](${src.url})` : src.name;
    lines.push(`| ${src.id} | ${src.authority} | ${nameCell} | ${src.retrieval_method} | ${src.license} |`);
  }

  lines.push('');
  lines.push(`**Total sources:** ${sources.length}`);
  lines.push('');
  lines.push(
    '> All data is extracted from public authoritative Swedish government publications. ' +
    'This tool is a reference aid — verify critical compliance decisions against the originals.'
  );

  return successResponse(lines.join('\n'));
}
