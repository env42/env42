import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@/*': 'src/*',
      '$/mocks/*': 'mocks/*',
      '$/mocks': 'mocks/index',
    },
  },
  test: {
    globals: true,
    environment: 'node',
    coverage: (() => {
      const args = process.argv;

      const coverageArgPosition = args.indexOf('--coverage');

      const isCoverageEnabled = coverageArgPosition !== -1;

      const singleFileTestPath = args.find(arg =>
        arg.endsWith('.test.ts'),
      );

      const shouldRunSingleFileCoverage =
        isCoverageEnabled && singleFileTestPath;

      const exclude = [
        'src/**/index.ts',
        'src/**/__mocks__.ts',
        `src/EnvKeys.ts`,
      ];

      console.warn(
        'Intentionally excluding the files listed below. Please review this list periodically and make sure nothing is here by accident.',
        exclude,
      );

      const include = (() => {
        if (!shouldRunSingleFileCoverage) {
          return ['src/**/*.ts'];
        }

        const overridenIncludePath = singleFileTestPath.replace(
          '.test.ts',
          '.ts',
        );

        console.warn(
          `Running coverage for single file: ${singleFileTestPath}. Showing coverage only for ${overridenIncludePath}.`,
        );

        return [overridenIncludePath];
      })();

      return {
        provider: 'v8',
        reporter: ['text'],
        exclude,
        include,
        all: true,
        extension: ['.ts'],
        lines: 100,
        statements: 100,
        functions: 100,
        branches: 100,
      };
    })(),
  },
});
