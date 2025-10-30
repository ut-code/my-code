const cacheData: Map<string, ArrayBuffer> = new Map();
/**
 * nodejsにcache apiがないので、web標準のcache APIに相当するものの自前実装
 */
export const inMemoryCache = {
  async put(key: string, response: Response): Promise<void> {
    const arrayBuffer = await response.arrayBuffer();
    cacheData.set(key, arrayBuffer);
  },
  async match(key: string): Promise<Response | undefined> {
    const arrayBuffer = cacheData.get(key);
    if (arrayBuffer) {
      return new Response(arrayBuffer);
    }
    return undefined;
  },
  async delete(key: string): Promise<boolean> {
    return cacheData.delete(key);
  },
} as const;
