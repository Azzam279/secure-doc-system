export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  returnRawResponse = false
): Promise<T> {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + endpoint,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      }
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    return returnRawResponse ? (res as unknown as T) : res.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}
