# `env42`: Type-Safe Configuration for life, the Universe and Everything

> `pnpm add -D @env42/template`

## 📄✨ Config Template Magic: Creating a Hitchhiker's Guide to Your Configuration Universe

Now that we have our configuration in place, we can use it to generate a template for our configuration. That way, we can easily generate up to date documentation about our configuration and make it easy for other developers to know what they need to do to get the app running.

If your configuration is simple and has no child sections, you already have everything in place, so let's begin:

### 1. Create a Config Template scripts
You'll need to create a ts file somewhere in your project. In our example, we'll put it at `scripts/generateConfigTemplate.ts`. In that script file, you can use `ConfigTemplateGenerator.generateConfigFile`.

```typescript
ConfigTemplateGenerator.generateConfigFile<
  typeof CorsConfigSchema,
  CorsConfigEnvVarNames
>({
  filePath: `${__dirname}/../.env.example`,
  ConfigSchema: CorsConfigSchema,
  configMap: corsConfigEnvVarsMap,
  example: {
    CORS_ORIGIN: 'http://localhost:3000',
    CORS_HEADERS: '*',
  },
});
```

### 2. Add the Script to your package.json scripts
Now, you can add the script to your `package.json` scripts.

```json
{
  "scripts": {
    "generate:config-template": "tsx scripts/generateConfigTemplate",
    "postinstall": "pnpm generate:config-example"
  }
}
```
> ℹ️ Notice how we add the template generating command to the `postinstall` hook. That should give any new developers an nice, up to date template to start with when they install the project, even if we manage to to somehow get the template outdate.
> 💡 And yes, you can use whatever script runner you want. But using `tsx` over `ts-node` is highly recommended

### 3. Run the Script
Now, you can run the script and it will generate a template for you. For our last example, it would generate a `.env.example` file at the root of the project with the following contents:

```
# config.origin
CORS_ORIGIN="http://localhost:3000"

# config.headers
CORS_HEADERS="*"
```

### Generating a Config Template for a Complex Configuration
In case we have a complx configuration, the only extra step necessary is to export a merged map. The good thing is that we don't need to do that by hand as `env42` provides a helper function for precisely that reason: `ConfigHelpers.mergeConfigMap

```typescript
// config.ts

export const appConfigEnvVarsMap = ConfigHelpers.mergeConfigMap({
  express: expressConfigEnvVarsMap,
  cors: corsConfigEnvVarsMap,
});
```

And that's it! Now, you can use the `appConfigEnvVarsMap` to generate a template for your entire configuration.

```typescript
// scripts/generateConfigTemplate.ts

ConfigTemplateGenerator.generateConfigFile<
  typeof AppConfigSchema,
  AppConfigEnvVarNames
>({
  filePath: `${__dirname}/../.env.example`,
  ConfigSchema: AppConfigSchema,
  configMap: appConfigEnvVarsMap,
  example: {
    API_HOST_NAME: 'localhost',
    API_PORT: '4000',
    API_AUTO_START: 'true',
    CORS_ORIGIN: 'http://localhost:3000',
    CORS_HEADERS: '*',
  },
});
```

Now, whenever you install anything it will create a `.env.example` at the project root with the following contents:

```
# config.express.hostName
API_HOST_NAME="localhost"

# config.express.port
API_PORT=4000

# config.express.options.autoStart
API_AUTO_START=true

# config.cors.origin
CORS_ORIGIN="http://localhost:3000"

# config.cors.headers
CORS_HEADERS="*"
```

## 🌐🚀 Navigating the Front-End Galaxy: Unleashing `env42` in the Browser Universe

`env42` is not only useful for Node.js projects. You can also use it in the browser, with just a small caveat: In the browser, you can't use environment variables because a server environment is not present at runtime in front-end Projects. However, you can use the same configuration schema to generate a configuration object that you can use in your production front-end code. 

Most Meta-Frameworks like Next.js DO load environment variables while running in development mode and statically replace them in the output during build time. However, that's not always the case. In Next.js `export` mode, for example, the framework will only replace environment variables that have been statically called in the code, like in `process.env.NEXT_PUBLIC_SOME_VAR`. If you have a dynamic environment variable, you'll need to use a different approach. The sad part is that at `env42` all we do is dynamic access. 

To circumvent this problem, we can have a script that extracts the configuration at build time and saves it to a file that we can import at runtime. That way, all the configuration we need will be persisted into an external module that can be imported at runtime. There's no much point in providing it from `env42` because of how easy it is to implement yourself and how you might want to customize it to your needs. Take a look at the following example:

```typescript
// scripts/lockConfig.ts

import fs from 'fs';
import { getAppConfig } from '../config';

/**
 * Generates a .env.json file from the current environment variables.
 *
 * https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
 */
const config = getAppConfig();

const formatttedContent = JSON.stringify(config, null, 2);

fs.writeFileSync(
  `${__dirname}/../.env.json`,
  `${formatttedContent}\n`,
);
```

Now, you can run this script before building your project. For better usability, we recommend creating an exclusive script to be ran in CI before building your project. That way, you can ensure that the configuration is always up to date. For example, in Next.js, you can add the following script to your `package.json`:

```json
{
  "scripts": {
    "config:lock": "rm -f .env.json && tsx scripts/lockConfig",
    "build": "...",
    "build:ci": "pnpm config:lock && pnpm build",
  }
}
```

Now we're generating the static config file. Only thing remaining is to make some changes in our `getAppConfig` to take the presence of that file into account:

```typescript
let appConfig: AppConfig | null = null;

export const getAppConfig = (
  env: EnvKeys<AppConfigEnvVarNames> = process.env as any,
): AppConfig => {
  if (!appConfig) {
    appConfig = loadAppConfig(env) as any;
  }

  return appConfig as any;
};

const loadAppConfig = (env: EnvKeys<AppConfigEnvVarNames>) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const result = require('@/../.env.json') as any;

    return result;
  } catch (err) {}

  return loadAppConfigFromEnvironment(env);
};

export const loadAppConfigFromEnvironment = (
  env: EnvKeys<AppConfigEnvVarNames> = process.env as any,
): AppConfig => ({
  express: loadExpressConfig(env),
  cors: loadCorsConfig(env),
});
```
