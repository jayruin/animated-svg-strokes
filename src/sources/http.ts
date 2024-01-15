export const strictFetch = async (url: string): Promise<Response> => {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Unexpected HTTP response status code ${response.status}.`);
    return response;
};
