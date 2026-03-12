// __tests__/unit/meta-tools.test.ts
import { describe, it, expect } from 'vitest';
import { handleAbout } from '../../src/tools/about.js';
import { handleListSources } from '../../src/tools/list-sources.js';
import { handleCheckDataFreshness } from '../../src/tools/check-data-freshness.js';

describe('meta-tools', () => {
  it('about returns server metadata with _meta', () => {
    const result = handleAbout();
    const text = result.content[0].text;
    expect(text).toContain('Swedish Standards MCP');
    expect(text).toContain('domain_intelligence');
    expect(text).toContain('Ansvar MCP Network');
    expect(result._meta).toBeDefined();
  });

  it('list_sources returns all 16 sources', () => {
    const result = handleListSources();
    const text = result.content[0].text;
    // Original sources
    expect(text).toContain('MSB-Metodstod');
    expect(text).toContain('MSB-Grundlaggande');
    expect(text).toContain('MSBFS-2020');
    expect(text).toContain('SAPO');
    expect(text).toContain('CERT-SE');
    // New sources
    expect(text).toContain('MSB-Riskanalys');
    expect(text).toContain('MSB-Klassificering');
    expect(text).toContain('MSB-Incidenthantering');
    expect(text).toContain('PTS');
    expect(text).toContain('FI');
    expect(text).toContain('IMY');
    expect(text).toContain('HSLF-FS');
    expect(text).toContain('NIS2');
    expect(text).toContain('Energi-Transport');
    expect(text).toContain('DIGG-SDK');
    expect(result._meta).toBeDefined();
  });

  it('check_data_freshness returns a freshness report', () => {
    const result = handleCheckDataFreshness();
    const text = result.content[0].text;
    expect(text).toContain('Data Freshness Report');
    expect(result._meta).toBeDefined();
  });
});
