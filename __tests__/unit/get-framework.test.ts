// __tests__/unit/get-framework.test.ts
import { describe, it, expect } from 'vitest';
import { handleGetFramework } from '../../src/tools/get-framework.js';

describe('handleGetFramework', () => {
  it('returns framework details for msb-metodstod including control count and categories', () => {
    const result = handleGetFramework({ framework_id: 'msb-metodstod' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Framework name
    expect(text).toContain('Systematiskt informations');

    // Issuing body
    expect(text).toContain('MSB');

    // Sectors
    expect(text).toContain('government');

    // Control count -- msb-metodstod has 98 controls
    expect(text).toContain('98');

    // Categories table -- real categories
    expect(text).toContain('Ledning och styrning');
    expect(text).toContain('Tekniska');

    // Source URL
    expect(text).toContain('informationssakerhet.se');
  });

  it('returns NO_MATCH for unknown framework', () => {
    const result = handleGetFramework({ framework_id: 'nonexistent-fw' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('NO_MATCH');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT for missing framework_id', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleGetFramework({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });
});
