import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export const cn: typeof clsx = (...inputs) => twMerge(clsx(...inputs));

export const getValue = <T>(origin: MaybeRef<T>) => {
  if (isRef(origin)) return origin.value;
  return origin;
};
