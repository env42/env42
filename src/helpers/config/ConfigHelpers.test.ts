import { ZodError } from 'zod';
import { ConfigHelpers } from './ConfigHelpers';
import { EnvKeys } from '@/util';

import {
  MockedConfigSchema,
  MockedEnvVarNames,
  mockedConfigEnv,
  mockedConfigEnvVarsMap,
} from './__mocks__';

describe('ConfigHelpers', () => {
  describe('loadValidateSchemas', () => {
    it('can load and validate configuration from environment variables', () => {
      const config = ConfigHelpers.loadValidatedSchema<
        typeof MockedConfigSchema,
        MockedEnvVarNames
      >(MockedConfigSchema, mockedConfigEnvVarsMap, mockedConfigEnv);

      expect(config!.hostName).toEqual(mockedConfigEnv.API_HOST);
      expect(config!.port).toEqual(mockedConfigEnv.API_PORT);
      expect(config!.autoStart).toEqual(
        mockedConfigEnv.API_AUTO_START,
      );
    });

    it('can convert numbers to strings and strings to numbers and booleans correctly', () => {
      const env: EnvKeys<MockedEnvVarNames> = {
        API_HOST: 123,
        API_PORT: '456',
        API_AUTO_START: '',
      };

      const config = ConfigHelpers.loadValidatedSchema<
        typeof MockedConfigSchema,
        MockedEnvVarNames
      >(MockedConfigSchema, mockedConfigEnvVarsMap, env);

      expect(config!.hostName).toEqual('123');
      expect(config!.port).toEqual(456);
      expect(config!.autoStart).toEqual(false);
    });

    it('BE AWARE: the "false" string resolves to true, and that\'s just a caveat of JS', () => {
      const env: EnvKeys<MockedEnvVarNames> = {
        API_HOST: 123,
        API_PORT: '456',
        API_AUTO_START: 'false',
      };

      const config = ConfigHelpers.loadValidatedSchema<
        typeof MockedConfigSchema,
        MockedEnvVarNames
      >(MockedConfigSchema, mockedConfigEnvVarsMap, env);

      expect(config!.hostName).toEqual('123');
      expect(config!.port).toEqual(456);
      expect(config!.autoStart).toEqual(true);
    });

    it("BE AWARE: ommitting a key resolves to `false` if that's a boolean", () => {
      const env: Partial<EnvKeys<MockedEnvVarNames>> = {
        API_HOST: 123,
        API_PORT: '456',
      };

      const config = ConfigHelpers.loadValidatedSchema<
        typeof MockedConfigSchema,
        MockedEnvVarNames
      >(MockedConfigSchema, mockedConfigEnvVarsMap, env as any);

      expect(config!.hostName).toEqual('123');
      expect(config!.port).toEqual(456);
      expect(config!.autoStart).toEqual(false);
    });

    it('can throw an error if the config is invalid', () => {
      const env = {
        API_HOST: 123,
        API_AUTO_START: 'false',
      };

      const fn = () =>
        ConfigHelpers.loadValidatedSchema<
          typeof MockedConfigSchema,
          MockedEnvVarNames
        >(MockedConfigSchema, mockedConfigEnvVarsMap, env as any);

      expect(fn).toThrow(ZodError);
    });
  });

  describe('mergeConfigMap', () => {
    it('should be able to merge config maps', () => {
      const exampleMap = {
        a: {
          'b.c': 'd',
          'b.e': 'f',
        },
        g: {
          'h.i': 'j',
        },
      };

      const expected = {
        'a.b.c': 'd',
        'a.b.e': 'f',
        'g.h.i': 'j',
      };

      const result = ConfigHelpers.mergeConfigMap(exampleMap);

      expect(result).toEqual(expected);
    });
  });

  describe('wrapConfigVariableInQuotes', () => {
    it('works for strings, wrapping them in double quotes', () => {
      const result = ConfigHelpers.wrapConfigVariableInQuotes('test');

      expect(result).toEqual('"test"');
    });

    it('works for numbers, NOT wrapping them in double quotes', () => {
      const result = ConfigHelpers.wrapConfigVariableInQuotes(123);

      expect(result).toEqual(123);
    });

    it('works for booleans, encoding true correctly', () => {
      const result = ConfigHelpers.wrapConfigVariableInQuotes(true);

      expect(result).toEqual('true');
    });

    it('works for booleans, encoding false correctly', () => {
      const result = ConfigHelpers.wrapConfigVariableInQuotes(false);

      expect(result).toEqual('');
    });

    it('works for null, encoding it correctly', () => {
      const result = ConfigHelpers.wrapConfigVariableInQuotes(null);

      expect(result).toEqual('');
    });
  });
});
