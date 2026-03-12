// __tests__/unit/list-controls.test.ts
import { describe, it, expect } from 'vitest';
import { handleListControls } from '../../src/tools/list-controls.js';

describe('handleListControls', () => {
  it('lists all controls for msb-metodstod with total_results count', () => {
    const result = handleListControls({ framework_id: 'msb-metodstod' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Header with total count (98 controls)
    expect(text).toContain('total_results: 98');

    // First control present
    expect(text).toContain('msb-metodstod:L1');

    // Markdown table structure
    expect(text).toContain('| ID |');
    expect(text).toContain('|');
  });

  it('filters controls by category', () => {
    const result = handleListControls({ framework_id: 'msb-metodstod', category: 'Ledning och styrning' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // Leadership controls present
    expect(text).toContain('msb-metodstod:L1');
    // Technical controls should not appear
    expect(text).not.toContain('msb-metodstod:T1');
  });

  it('filters controls by level', () => {
    const result = handleListControls({ framework_id: 'msb-grundlaggande', level: 'Grundläggande' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    expect(text).toContain('msb-grundlaggande:GT1');
  });

  it('returns INVALID_INPUT for missing framework_id', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleListControls({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('returns NO_MATCH for unknown framework', () => {
    const result = handleListControls({ framework_id: 'nonexistent-framework' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('NO_MATCH');
    expect(result._meta).toBeDefined();
  });

  it('paginates results via limit and offset', () => {
    const page1 = handleListControls({ framework_id: 'msb-metodstod', limit: 1, offset: 0 });
    const page2 = handleListControls({ framework_id: 'msb-metodstod', limit: 1, offset: 1 });

    expect(page1.isError).toBeFalsy();
    expect(page2.isError).toBeFalsy();

    const text1 = page1.content[0].text;
    const text2 = page2.content[0].text;

    // Both pages report the full total_results
    expect(text1).toContain('total_results: 98');
    expect(text2).toContain('total_results: 98');

    // The two pages return different controls
    expect(text1).not.toBe(text2);
  });

  it('prefers English title when language is en', () => {
    const result = handleListControls({ framework_id: 'msb-metodstod', language: 'en' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // English title present
    expect(text).toContain('Management commitment');
  });

  it('defaults to Swedish titles', () => {
    const result = handleListControls({ framework_id: 'msb-metodstod' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // Swedish title_nl present
    expect(text).toContain('Ledningens engagemang');
  });
});
