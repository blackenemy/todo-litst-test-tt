const BASE_URL = "https://69bc323d0915748735bb828e.mockapi.io/api/v1";

interface CustomFetchOptions extends RequestInit {
  baseUrl?: string;
}

export async function customFetch(
  endpoint: string,
  options: CustomFetchOptions = {},
): Promise<Response> {
  const { baseUrl = BASE_URL, ...fetchOptions } = options;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  return response;
}

export default customFetch;
