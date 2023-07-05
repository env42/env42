import fs from 'fs';
import { AnyZodObject, TypeOf } from 'zod';
import { EnvKeys, FieldPath } from '@/util';
import { ConfigHelpers, ZodHelpers } from '@/helpers';

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
  ZodHelpers.objectToPropList<TSchema>(ConfigSchema)
    .map(configFieldPath => {
      const envVarName = configMap[configFieldPath];

      const exampleValue = ConfigHelpers.wrapConfigVariableInQuotes(
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
