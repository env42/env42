import { EnvKeys } from '@env42/core';
import { FieldPath } from '@env42/field-paths';
import { z } from 'zod';

export const MockedConfigSchema = z.object({
  hostName: z.coerce.string(),
  port: z.coerce.number(),
  autoStart: z.coerce.boolean(),
});

export type MockedConfig = z.infer<typeof MockedConfigSchema>;

export const MockedConfigEnvVarsSchema = z.enum([
  'API_HOST',
  'API_PORT',
  'API_AUTO_START',
]);

export type MockedEnvVarNames = z.infer<
  typeof MockedConfigEnvVarsSchema
>;

export const MockedEnvVarsEnum = MockedConfigEnvVarsSchema.enum;

export const mockedConfigEnvVarsMap: Record<
  FieldPath<MockedConfig>,
  MockedEnvVarNames
> = {
  hostName: MockedEnvVarsEnum.API_HOST,
  port: MockedEnvVarsEnum.API_PORT,
  autoStart: MockedEnvVarsEnum.API_AUTO_START,
};

export const mockedConfigEnv: EnvKeys<MockedEnvVarNames> = {
  API_HOST: 'test-env-var',
  API_PORT: 123,
  API_AUTO_START: false,
};
