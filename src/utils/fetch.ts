export const fetchData = async (
  url: string
): Promise<Record<string, string>> => {
  const response = await fetch(url);

  return response.json();
};
