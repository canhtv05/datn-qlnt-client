export const queryFilter = (searchParams: URLSearchParams, ...params: string[]): Record<string, string> => {
  const result: Record<string, string> = {};
  params.forEach((key) => {
    result[key] = searchParams.get(key) ?? "";
  });
  return result;
};
