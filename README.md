# `env42`: Type-Safe Configuration for life, the Universe and Everything

Welcome to `env42`, the closest thing to a Towel when trying to achieve type-safe, validated configurations from environment variables in TypeScript projects.

`env42` is designed to be your loyal companion, ensuring that your configurations remain save. It's perfectly tailored to keep you safe while you navigate the vast universe of Typescript, both in the browser and in Node.js.

Built o top of `Zod`, `env42` inherits a wealth of features and benefits that enhance the validation and type-checking capabilities of your configuration setup, ultimately making your coding experience more robust and reliable.

> `env42` ❤️ `Zod`: A powerful alliance that unlocks the full potential of type-safe configurations!

## Free Perks

✨ Type Safety: Ensure your configurations are type-safe, preventing runtime errors and improving code reliability.

🌐 Browser and Node.js Compatibility: Seamlessly handle configurations in both browser and Node.js environments.

🌈 Automatic Templates: Keep your configurations in sync with your codebase by automatically generating deterministic configuration templates. 

🔒 Secure Validation: Leverage the power of the Zod validation library to enforce strict validation rules and ensure the integrity of your configurations.

🔧 Easy Configuration Setup: Define your configuration schema using Zod's simple and intuitive Api, making it a breeze to set up and manage your environment variables..

🚀 Efficient Development: Boost productivity by eliminating guesswork. Generate automatic configuration template files and have the confidence of Typescript and even Unit Tests to have mathematical certainty that you're not breaking things/

📚 Efficient Communication: Your configuration declaratin becomes a statement of intentions that can be used to clearly communicate with everyone in the team. `env42` makes it impossible to get Config wrong.

🔁 Seamless Integration: Easily integrate `env42` into existing or new TypeScript projects without disrupting your workflow.

Remember, with `Env42e, you'll have all the answers to the universe type-safe configurations, making your coding journey through the universe a delightful and reliable experience!

## 🌟 Installing `env42`: Preparing for an Interstellar Configuration Adventure 🚀

To install `env42` and embark on your adventure, simply use your favorite package manager:

```shell
pnpm install @env42/core
```

> Or perhaps, if you like throwing away hard-drive money and don't give two sh*ts about sustainability or the environment, then yeah, you can very well use `yarn` or `npm`. Go ahead, footguns are both legal and a fundamental right in every single country in the world 😜.

## 🚀📚 Grab Your Towel! Getting Started with the `env42` Configuration Guide

`env42` is like your own personal guide through the cosmic labyrinth of environment configurations. Here's how we get started.

### 1. Declare your Configuration Schema

First, you declare your Configuration as a Zod Schema. Take your chance and infer it's Type from it:

```typescript
export const ExpressConfigSchema = z.object({
  hostName: z.coerce.string(),
  port: z.coerce.number(),
  config: z.object({
    autoStart: z.coerce
      .boolean()
      .nullish()
      .default(true),
    }),
});

// Take your chance and infer a Type from it
export type ExpressConfig = z.infer<
  typeof ExpressConfigSchema
>;
```

### 2. Link your Environment Variables

Once that is out of the way, declare a Zod Enum for all the environment variables want to have in your system and a Map that links them both. Notice how we leverage Typescript to ensure no typos are ever possible:

  ```typescript
  export const ExpressEnvVarNames = z.enum([
    'EXPRESS_HOST',
    'EXPRESS_PORT',
    'EXPRESS_AUTO_START',
  ]);

  // Also infer the type of the Enum
  export type ExpressEnvVarNames = z.infer<
    typeof MockedConfigEnvVarsSchema
  >;

  export const expressConfigEnvVarsMap: Record<
    FieldPath<MockedConfig>,
    MockedEnvVarNames
  > = {
    hostName: MockedEnvVarsEnum.EXPRESS_HOST,
    port: MockedEnvVarsEnum.EXPRESS_PORT,
    // Red squigly lines here if any of the keys are missing or have a typo.
    'config.autoStart': MockedEnvVarsEnum.EXPRESS_AUTO_START,
  };
  ```

  > 🥰 Notice how we can map deep paths using dot notation and still be type-safe by using `FieldPaths`. Kudos to `react-hook-forms` for the inspiration and for the permissive license that allows us to just copy the types over and not need to depend on the entire library. You can also import that type from here and use it for your own purposes. Perhaps down the line those types can be migrated into their own general purpose package. One can dream.
  
### 3. Create the Config Singleton

Once that's in place, we can create a single helper function that can load and validate the entire Configuration from the Environment Variables available at the current runtime .

  ```typescript
  // Loading configs is not cheap. Let's use a module Singleton
  let expressConfig: ExpressConfig | null = null;

  export const getExpressConfig = (env: EnvKeys<ExpressEnvVarNames> = process.env) => {
    // we only load it if we already have it
    if (!expressConfig) {
      expressConfig = ConfigHelpers.loadValidatedSchema(
        ExpressConfigSchema,
        expressConfigEnvVarsMap,
        env,
      );
    }

    return expressConfig;
  }
  ```

### 4. Use it Anywhere!

Now, wherever we want to use the configuration, we just import that `getExpressConfig` function we created and use it as if it's no big deal. Just call it and use it as any other function. 
  
```typescript
import { getExpressConfig } from './config';

const config = getExpressConfig();

// Now we can use it as any other object
const app = express();

if (config.autoStart) {
  app.listen(config.port, config.hostName);
}
```

  > 🛈 Notice how we don't need to pass any parameters to the function. That's because we're using the default `process.env` object. If you want to use a different environment, you can pass it as a parameter. That's useful for testing, for example.

## 🌌 Advanced Usage: Unravelling the Config Galaxy with Precision

Just like any other Towel, `env42` is designed to be a simple, yet powerful tool to help you manage your app configurations. And we know that in real life configuration is much better described by a tree of objects, not just a single object. So, let's see how we can use `env42` to manage a more complex configuration. 

In the example below, we also add a CORS configuration section to our Configuration:

```typescript
export const CorsConfigSchema = z.object({
  origin: z.coerce.string(),
  headers: z.coerce.string()
    .optional()
    .default('*'),
});

export type CorsConfig = z.infer<typeof CorsConfigSchema>;

export const CorsEnvVarsSchema = z.enum([
  'CORS_ORIGIN',
  'CORS_HEADERS',
]);

export type CorsConfigEnvVarNames = z.infer<
  typeof CorsEnvVarsSchema
>;

export const corsConfigEnvVarsMap: Record<
  FieldPath<CorsConfig>,
  CorsConfigEnvVarNames
> = {
  origin: CorsEnvVarsSchema.Enum.CORS_ORIGIN,
  headers: CorsEnvVarsSchema.Enum.CORS_HEADERS,
};

let corsConfig: CorsConfig | null = null;

export const loadCorsConfig = (
  env: EnvKeys<CorsConfigEnvVarNames>,
) => {
  if (!corsConfig) {
    corsConfig = ConfigHelpers.loadValidatedSchema(
      CorsConfigSchema,
      corsConfigEnvVarsMap,
      env,
    );
  }

  return corsConfig;
}
```

Now, we can create a separate configuration declaration to merge all the leaves of our tree into a single object:

```typescript
export const AppConfigSchema = z.object({
  express: ExpressConfigSchema,
  cors: CorsConfigSchema,
});

// I know for a fact I will never get over how neat `z.infer` is
export type AppConfig = z.infer<typeof AppConfigSchema>;
```

Once we have that in place, we create a merged enum of all the environment variables we need to load:

```typescript
export const AppConfigEnvVarsSchema = z.enum([
  ...ExpressEnvVarsSchema.options,
  ...CorsEnvVarsSchema.options,
]);

export type AppConfigEnvVarNames = z.infer<
  typeof AppConfigEnvVarsSchema
>;
```

And finally, create a function that can get the entire configuration for us:

```typescript
let appConfig: AppConfig | null = null;

export const getAppConfig = (
  env: EnvKeys<AppConfigEnvVarNames> = process.env as any,
): AppConfig => {
  if (!appConfig) {
    appConfig = {
      api: loadApiConfig(env),
      cors: loadCorsConfig(env),
    };
  }

  return appConfig;
};
```

Now, whenever we want to use it, we can just import the `getAppConfig` function and use it as usual:

```typescript
import { getAppConfig } from './config';

const config = getAppConfig();

// Now we can use it as any other object
const app = express();

if (config.express.autoStart) {
  app.listen(
    config.express.port, 
    config.express.hostName
  );
}

app.use(
  cors({
    origin: config.cors.origin,
    headers: config.cors.headers,
  })
);
```

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

# config.cors.origin
CORS_ORIGIN="http://localhost:3000"

# config.cors.headers
CORS_HEADERS="*"
```
