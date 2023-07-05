import {
  generateConfigFile,
  generateString,
} from './ConfigTemplateGenerator';

import {
  MockedConfigSchema,
  mockedConfigEnv,
  mockedConfigEnvVarsMap,
} from '@/helpers/config/__mocks__';

const expectedOutput = `#config.hostName
API_HOST="test-env-var"

#config.port
API_PORT=123

#config.autoStart
API_AUTO_START=
`;

describe('ConfigTemplateGenerator', () => {
  describe('generateString', () => {
    it('can generate an example configuration', () => {
      const result = generateString({
        ConfigSchema: MockedConfigSchema,
        configMap: mockedConfigEnvVarsMap,
        example: mockedConfigEnv,
      });

      expect(result).toEqual(expectedOutput);
    });
  });

  describe('generateConfigFile', () => {
    it('can generate an example configuration file', () => {
      const filePath = '.env.example';

      const writeFile = vi.fn();

      const result = generateConfigFile(
        {
          ConfigSchema: MockedConfigSchema,
          configMap: mockedConfigEnvVarsMap,
          example: mockedConfigEnv,
          filePath,
        },
        writeFile,
      );

      expect(result).toEqual(expectedOutput);

      expect(writeFile).toHaveBeenCalledWith(filePath, result);
    });
  });
});
