// __tests__/unit/search-by-sector.test.ts
import { describe, it, expect } from 'vitest';
import { handleSearchBySector } from '../../src/tools/search-by-sector.js';

describe('handleSearchBySector', () => {
  it('government sector returns msb-metodstod and msbfs-2020', () => {
    const result = handleSearchBySector({ sector: 'government' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    expect(text).toContain('msb-metodstod');
    expect(text).toContain('msbfs-2020');
  });

  it('digital_infrastructure sector returns msb-grundlaggande', () => {
    const result = handleSearchBySector({ sector: 'digital_infrastructure' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    expect(text).toContain('msb-grundlaggande');
  });

  it('with query param returns matching controls within sector frameworks', () => {
    const result = handleSearchBySector({ sector: 'government', query: 'riskanalys' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // Framework section must be present
    expect(text).toContain('msb-metodstod');

    // Controls section should have results
    expect(text).toContain('Controls matching');
  });

  it('unknown sector returns INVALID_INPUT', () => {
    const result = handleSearchBySector({ sector: 'unknown-sector-xyz' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('missing/empty sector returns INVALID_INPUT', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleSearchBySector({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
  });

  it('empty string sector returns INVALID_INPUT', () => {
    const result = handleSearchBySector({ sector: '' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
  });

  it('energy sector returns energy-transport framework', () => {
    const result = handleSearchBySector({ sector: 'energy' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;
    expect(text).toContain('energi-transport-sakerhet');
  });

  it('returns NO_MATCH when sector has no frameworks', () => {
    // 'education' is a valid sector name but no frameworks are seeded for it
    const result = handleSearchBySector({ sector: 'education' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('NO_MATCH');
  });
});
