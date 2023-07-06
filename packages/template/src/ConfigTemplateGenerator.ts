import * as fs from 'fs';
import { AnyZodObject, TypeOf } from 'zod';

import { EnvKeys, wrapConfigVariableInQuotes } from '@env42/core';
import { FieldPath } from '@env42/field-paths';
import { objectToPropList } from '@env42/zod-helpers';

export type ExampleConfigFileGeneratorOptions<
  TSchema extends AnyZodObject,
  TEnvKeys extends string,
> = {
  ConfigSchema: TSchema;
  configMap: Record<FieldPath<TypeOf<TSchema>>, TEnvKeys>;
  example: EnvKeys<TEnvKeys>;
  filePath: string;
};

export const generateString = <
  TSchema extends AnyZodObject,
  TEnvKeys extends string,
>({
  ConfigSchema,
  configMap,
  example,
}: Omit<
  ExampleConfigFileGeneratorOptions<TSchema, TEnvKeys>,
  'filePath'
>) =>
  objectToPropList<TSchema>(ConfigSchema)
    .map(configFieldPath => {
      const envVarName = configMap[configFieldPath];

      const exampleValue = wrapConfigVariableInQuotes(
        example[envVarName as TEnvKeys],
      );

      return [
        `#config.${configFieldPath}`,
        `${envVarName}=${exampleValue}`,
      ].join('\n');
    })
    .join('\n\n') + '\n';

export const generateConfigFile = <
  TSchema extends AnyZodObject,
  TEnvKeys extends string,
>(
  {
    filePath,
    ...params
  }: ExampleConfigFileGeneratorOptions<TSchema, TEnvKeys>,
  writeFile = fs.writeFileSync,
) => {
  const fileContents = generateString(params);

  writeFile(filePath, fileContents);

  return fileContents;
};
