import { z } from 'zod';

export const MockedComplexSchema = z.object({
  a: z.object({
    b: z.string(),
    c: z.number(),
  }),
  b: z.object({
    c: z.boolean(),
    d: z.string(),
    e: z.object({
      f: z.number(),
      g: z.boolean(),
    }),
  }),
});

export const MockedRefinedSchema = MockedComplexSchema.refine(
  data => data.a.b === 'useless-value',
  {
    message: 'something wrong is not right',
  },
);

export type MockedComplextType = z.infer<typeof MockedComplexSchema>;

export const mockedComplexObject: MockedComplextType = {
  a: {
    b: 'test',
    c: 123,
  },
  b: {
    c: true,
    d: 'test',
    e: {
      f: 123,
      g: false,
    },
  },
};
