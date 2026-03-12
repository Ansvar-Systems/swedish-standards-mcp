// __tests__/unit/list-frameworks.test.ts
import { describe, it, expect } from 'vitest';
import { handleListFrameworks } from '../../src/tools/list-frameworks.js';

describe('handleListFrameworks', () => {
  it('returns a Markdown table containing all frameworks with control counts', () => {
    const result = handleListFrameworks();

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Core framework IDs present (original 6)
    expect(text).toContain('msb-metodstod');
    expect(text).toContain('msb-grundlaggande');
    expect(text).toContain('digg-digital-sakerhet');
    expect(text).toContain('msbfs-2020');
    expect(text).toContain('sapo-sakerhetsskydd');
    expect(text).toContain('cert-se-rekommendationer');

    // New framework IDs present
    expect(text).toContain('msb-riskanalys');
    expect(text).toContain('msb-klassificering');
    expect(text).toContain('msb-incidenthantering');
    expect(text).toContain('pts-driftsakerhet');
    expect(text).toContain('fi-it-verksamhet');
    expect(text).toContain('imy-tekniska-atgarder');
    expect(text).toContain('hslf-fs-informationshantering');
    expect(text).toContain('nis2-cybersakerhetslagen');
    expect(text).toContain('digg-sdk');
    expect(text).toContain('energi-transport-sakerhet');

    // Issuing bodies present
    expect(text).toContain('MSB');
    expect(text).toContain('PTS');
    expect(text).toContain('FI');

    // Sectors present
    expect(text).toContain('government');

    // Markdown table structure
    expect(text).toContain('| ID |');
    expect(text).toContain('|');

    // 16 frameworks
    expect(text).toContain('16 frameworks');
  });
});
