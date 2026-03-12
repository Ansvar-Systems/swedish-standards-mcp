// scripts/ingest-fetch.ts
// Orchestrates all Swedish standards ingestion scripts.
// Each script writes its output to data/extracted/<framework>.json.
// All data is embedded in the scripts (no external API or GitHub fetching required).

import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface FetchResult {
  script: string;
  source: string;
  success: boolean;
  error?: string;
  durationMs: number;
}

const SOURCES: { script: string; source: string }[] = [
  { script: join(__dirname, 'ingest-msb-metodstod.ts'), source: 'MSB Metodstod (Systematic Information Security)' },
  { script: join(__dirname, 'ingest-msb-grundlaggande.ts'), source: 'MSB Grundlaggande (Basic Security Measures)' },
  { script: join(__dirname, 'ingest-digg.ts'), source: 'DIGG Digital Sakerhet (Digital Security Guidance)' },
  { script: join(__dirname, 'ingest-msbfs.ts'), source: 'MSBFS 2020:6 and 2020:7 (MSB Regulations)' },
  { script: join(__dirname, 'ingest-sapo.ts'), source: 'SAPO Sakerhetsskydd (Security Protection)' },
  { script: join(__dirname, 'ingest-cert-se.ts'), source: 'CERT-SE Rekommendationer (Technical Recommendations)' },
];

function runScript(scriptPath: string): { success: boolean; error?: string; durationMs: number } {
  const start = Date.now();
  try {
    execFileSync(
      process.execPath,
      ['--import', 'tsx', scriptPath],
      {
        stdio: 'inherit',
        timeout: 120_000,
      }
    );
    return { success: true, durationMs: Date.now() - start };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg, durationMs: Date.now() - start };
  }
}

async function main(): Promise<void> {
  console.log('Ingest Fetch — Swedish Standards MCP');
  console.log('======================================');
  console.log(`Running ${SOURCES.length} ingestion scripts`);
  console.log('');

  const results: FetchResult[] = [];

  for (const { script, source } of SOURCES) {
    console.log(`--- Ingesting: ${source} ---`);
    const result = runScript(script);
    results.push({ script, source, ...result });
    console.log('');
  }

  // Summary
  console.log('==============================');
  console.log('Ingestion Summary');
  console.log('==============================');

  const succeeded = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  for (const r of results) {
    const status = r.success ? 'OK' : 'FAILED';
    const duration = (r.durationMs / 1000).toFixed(1);
    console.log(`  [${status}] ${r.source} (${duration}s)`);
    if (!r.success && r.error) {
      console.log(`         ${r.error.split('\n')[0]}`);
    }
  }

  console.log('');
  console.log(`Result: ${succeeded.length}/${SOURCES.length} sources ingested successfully`);

  if (failed.length > 0) {
    console.error(`\n${failed.length} source(s) failed. Check output above.`);
    process.exit(1);
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
