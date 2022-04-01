export const copyObjectPropertiesToObject = <T>(
  src: T,
  target: T,
  excluded: string[]
) => {
  Object.getOwnPropertyNames(src)
    .filter((property) => !excluded.includes(property))
    .forEach((key) =>
      Object.defineProperty(
        target,
        key,
        Object.getOwnPropertyDescriptor(src, key)!
      )
    );
};
