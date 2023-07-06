import { FieldPath } from '@env42/field-paths';
import {
  z,
  AnyZodObject,
  ZodEffects,
  ZodNullable,
  ZodObject,
  ZodOptional,
} from 'zod';

export const objectToPropList = <
  TSchema extends AnyZodObject,
  TOutput extends FieldPath<z.infer<TSchema>> = FieldPath<
    z.infer<TSchema>
  >,
>(
  obj: TSchema,
  parentKey?: TOutput,
): TOutput[] => {
  if (!obj.shape) {
    return parentKey ? [parentKey] : [];
  }

  const usableParentKey = parentKey ? `${parentKey}.` : '';

  const props = Object.entries(obj.shape).map(([key, prop]) => {
    const innerPropShape = extractPropShape(prop as any);

    if (innerPropShape instanceof ZodObject) {
      return objectToPropList(
        innerPropShape,
        `${usableParentKey}${key}`,
      );
    }

    return [`${usableParentKey}${key}`];
  });

  return props.flat() as TOutput[];
};

export const extractPropShape = (obj: AnyZodObject): AnyZodObject => {
  if (
    (obj instanceof ZodOptional || obj instanceof ZodNullable) &&
    !!obj.unwrap
  ) {
    return extractPropShape(obj.unwrap());
  }

  if (obj instanceof ZodEffects) {
    return extractPropShape((obj._def as any).schema);
  }

  return obj;
};
