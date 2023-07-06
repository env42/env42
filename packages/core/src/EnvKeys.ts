export type EnvKeys<TEnvKeys extends string = string> = Record<
  TEnvKeys,
  string | number | boolean | null | undefined
>;
