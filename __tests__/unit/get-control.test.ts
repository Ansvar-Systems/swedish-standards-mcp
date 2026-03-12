// __tests__/unit/get-control.test.ts
import { describe, it, expect } from 'vitest';
import { handleGetControl } from '../../src/tools/get-control.js';

describe('handleGetControl', () => {
  it('returns full control detail for msb-metodstod:L1', () => {
    const result = handleGetControl({ control_id: 'msb-metodstod:L1' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Heading: control number
    expect(text).toContain('L1');

    // Swedish title present
    expect(text).toContain('Ledningens engagemang');

    // Framework name
    expect(text).toContain('Systematiskt informations');

    // Category
    expect(text).toContain('Ledning och styrning');

    // ISO mapping
    expect(text).toContain('5.1');

    // Swedish description present
    expect(text).toContain('Beskrivning (SV)');
  });

  it('returns NO_MATCH for msb-metodstod:Z99', () => {
    const result = handleGetControl({ control_id: 'msb-metodstod:Z99' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('NO_MATCH');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT for missing control_id', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleGetControl({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });
});
