export type ConstructorOf<T> = { new (...args: never[]): T; prototype: T };
export type Nullable<T> = T | NullLike;
export type NullLike = null | undefined;

