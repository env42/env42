import { FieldPath } from '@/util';
import {
  z,
  AnyZodObject,
  ZodEffects,
  ZodNullable,
  ZodObject,
  ZodOptional,
} from 'zod';

export class ZodHelpers {
  static objectToPropList = <
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
      const innerPropShape = this.extractPropShape(prop as any);

      if (innerPropShape instanceof ZodObject) {
        return this.objectToPropList(
          innerPropShape,
          `${usableParentKey}${key}`,
        );
      }

      return [`${usableParentKey}${key}`];
    });

    return props.flat() as TOutput[];
  };

  static extractPropShape = (obj: AnyZodObject): AnyZodObject => {
    if (
      (obj instanceof ZodOptional || obj instanceof ZodNullable) &&
      !!obj.unwrap
    ) {
      return this.extractPropShape(obj.unwrap());
    }

    if (obj instanceof ZodEffects) {
      return this.extractPropShape((obj._def as any).schema);
    }

    return obj;
  };
}
