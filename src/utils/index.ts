import { twMerge } from "tailwind-merge";
import { clsx, ClassValue as ClsxValue } from "clsx";

export const cn: typeof clsx = (...inputs) => twMerge(clsx(...inputs));
export type ClassValue = ClsxValue;
export const getValue = <T>(origin: MaybeRef<T>) => {
  if (isRef(origin)) return origin.value;
  return origin;
};
