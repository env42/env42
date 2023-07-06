import { describe, it, expect } from 'vitest';

import { z } from 'zod';

import { extractPropShape, objectToPropList } from './ZodHelpers';
import {
  MockedComplexSchema,
  MockedRefinedSchema,
} from './__mocks__';

describe('ZodHelpers', () => {
  describe('objectToPropList', () => {
    it('can convert a zod object to a prop list', () => {
      const propList = objectToPropList(MockedComplexSchema);

      expect(propList).toEqual([
        'a.b',
        'a.c',
        'b.c',
        'b.d',
        'b.e.f',
        'b.e.g',
      ]);
    });

    it('should return empty array for objects without a shape', () => {
      const propList = objectToPropList({} as any);

      expect(propList).toEqual([]);
    });

    it('for objects without a shape that get a parent key, return the parent key in an array', () => {
      const propList = objectToPropList({} as any, 'parentKey');

      expect(propList).toEqual(['parentKey']);
    });
  });

  describe('extractPropShape', () => {
    it("returns the same schema if it's not optional, nullable or ZodEffects", () => {
      const result = extractPropShape(MockedComplexSchema);

      expect(result).toBe(MockedComplexSchema);
    });

    it("returns the unwrapped schema if it's nullable or optional", () => {
      const result = extractPropShape(
        z.optional(z.nullable(MockedComplexSchema)) as any,
      );

      expect(result).toBe(MockedComplexSchema);
    });

    it('returns the underlying schema for refined schemas (ZodEffects)', () => {
      const result = extractPropShape(MockedRefinedSchema as any);

      expect(result).toBe(MockedComplexSchema);
    });
  });
});
