const BASE_URL = "https://69bc323d0915748735bb828e.mockapi.io/api/v1";

interface CustomFetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function customFetch<T>(
  endpoint: string,
  options: CustomFetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}
