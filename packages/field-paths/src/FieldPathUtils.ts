// These types below have been shamelessly copied from the execellent `react-hook-form` library.
// As we are using this for a concept completely unrelated to React, Hooks or Forms,
// it's not worthy to add the entire library as a dependency.
// Yay OSS! =)
// https://github.com/react-hook-form/react-hook-form/blob/master/LICENSE

export type DeepPartial<T> = T extends Date
  ? T
  : { [K in keyof T]?: DeepPartial<T[K]> };

export type FieldValues = Record<string, any>;

export type TupleKeys<T extends ReadonlyArray<any>> = Exclude<
  keyof T,
  keyof any[]
>;

export type IsTuple<T extends ReadonlyArray<any>> =
  number extends T['length'] ? false : true;

export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

export type IsEqual<T1, T2> = T1 extends T2
  ? (<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2
      ? 1
      : 2
    ? true
    : false
  : false;

export type AnyIsEqual<T1, T2> = T1 extends T2
  ? IsEqual<T1, T2> extends true
    ? true
    : never
  : never;

export type PathImpl<
  K extends string | number,
  V,
  TraversedTypes,
> = V extends Primitive
  ? `${K}`
  : true extends AnyIsEqual<TraversedTypes, V>
  ? `${K}`
  : `${K}.${PathInternal<V, TraversedTypes | V>}`;

export type ArrayKey = number;

export type PathInternal<
  T,
  TraversedTypes = T,
> = T extends ReadonlyArray<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKeys<T>]-?: PathImpl<
          K & string,
          T[K],
          TraversedTypes
        >;
      }[TupleKeys<T>]
    : PathImpl<ArrayKey, V, TraversedTypes>
  : {
      [K in keyof T]-?: PathImpl<K & string, T[K], TraversedTypes>;
    }[keyof T];

export type Path<T> = T extends any ? PathInternal<T> : never;

export type FieldPath<TFieldValues extends FieldValues> =
  Path<TFieldValues>;

export type IsAny<T> = 0 extends 1 & T ? true : false;

export type ArrayPathImpl<
  K extends string | number,
  V,
  TraversedTypes,
> = V extends Primitive
  ? IsAny<V> extends true
    ? string
    : never
  : V extends ReadonlyArray<infer U>
  ? U extends Primitive
    ? IsAny<V> extends true
      ? string
      : never
    : true extends AnyIsEqual<TraversedTypes, V>
    ? never
    : `${K}` | `${K}.${ArrayPathInternal<V, TraversedTypes | V>}`
  : true extends AnyIsEqual<TraversedTypes, V>
  ? never
  : `${K}.${ArrayPathInternal<V, TraversedTypes | V>}`;

export type ArrayPathInternal<
  T,
  TraversedTypes = T,
> = T extends ReadonlyArray<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKeys<T>]-?: ArrayPathImpl<
          K & string,
          T[K],
          TraversedTypes
        >;
      }[TupleKeys<T>]
    : ArrayPathImpl<ArrayKey, V, TraversedTypes>
  : {
      [K in keyof T]-?: ArrayPathImpl<
        K & string,
        T[K],
        TraversedTypes
      >;
    }[keyof T];

export type ArrayPath<T> = T extends any
  ? ArrayPathInternal<T>
  : never;

export type PathValue<
  T,
  P extends Path<T> | ArrayPath<T>,
> = T extends any
  ? P extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? R extends Path<T[K]>
        ? PathValue<T[K], R>
        : never
      : K extends `${ArrayKey}`
      ? T extends ReadonlyArray<infer V>
        ? PathValue<V, R & Path<V>>
        : never
      : never
    : P extends keyof T
    ? T[P]
    : P extends `${ArrayKey}`
    ? T extends ReadonlyArray<infer V>
      ? V
      : never
    : never
  : never;

export type FieldPathValue<
  TFieldValues extends FieldValues,
  TFieldPath extends FieldPath<TFieldValues>,
> = PathValue<TFieldValues, TFieldPath>;
