import set from 'lodash.set';
import { AnyZodObject, z, TypeOf } from 'zod';

import { EnvKeys, FieldPath } from '@/util';
import { ZodHelpers } from '@/helpers/zod';

export class ConfigHelpers {
  static loadValidatedSchema = <
    TSchema extends AnyZodObject,
    TEnvKeys extends string,
  >(
    Schema: TSchema,
    map: Record<FieldPath<z.infer<TSchema>>, TEnvKeys>,
    env: EnvKeys<TEnvKeys>,
  ): z.infer<TSchema> => {
    const rawConfig = ConfigHelpers.loadConfigFromEnvironment<
      TSchema,
      TEnvKeys
    >(Schema, map, env);

    const result = Schema.parse(rawConfig);

    return result;
  };

  static loadConfigFromEnvironment = <
    TSchema extends AnyZodObject,
    TEnvKeys extends string,
  >(
    Schema: TSchema,
    map: Record<FieldPath<TypeOf<TSchema>>, TEnvKeys>,
    env: EnvKeys<TEnvKeys>,
  ): z.infer<TSchema> =>
    ZodHelpers.objectToPropList<TSchema>(Schema).reduce(
      (result, configPath) => {
        const envKey = map[configPath];

        const envValue = env[envKey];

        set(result, configPath, envValue);

        return result;
      },
      {} as z.infer<TSchema>,
    );

  static mergeConfigMap = <TKeys extends string>(
    mapsToMerge: Record<TKeys, Record<string, any>>,
  ): Record<FieldPath<typeof mapsToMerge>, string> =>
    Object.entries(mapsToMerge).reduce(
      (result, [key, map]) => ({
        ...result,
        ...Object.fromEntries(
          Object.entries(map as any).map(([innerKey, value]) => [
            `${key}.${innerKey}`,
            value,
          ]),
        ),
      }),
      {},
    ) as any;

  static wrapConfigVariableInQuotes = (exampleValue: unknown) => {
    let output = exampleValue;

    if (typeof exampleValue === 'string') {
      output = `"${exampleValue}"`;
    } else if (typeof exampleValue === 'boolean') {
      /* c8 ignore next */
      output = exampleValue ? 'true' : '';
    } else if (exampleValue === null) {
      output = '';
    }

    return output;
  };
}
