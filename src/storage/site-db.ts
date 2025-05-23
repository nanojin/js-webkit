type StoreValue = any;
type Key = string;

function getSiteDBName(): string {
	const hostname = location.hostname
    .replace(/^www\./, '')
	.replace(/^x/, 'twitter')
    .replace(/pinterest\\.[a-z.]+$/, 'pinterest')
    .replace(/[^a-z0-9]+/gi, '_')
    .toLowerCase();
  return `webkitdb-${hostname}`;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(getSiteDBName(), 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("data")) {
        db.createObjectStore("data");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const SiteScopedDB = {
  async get<T = StoreValue>(key: Key): Promise<T | null> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("data", "readonly");
      const store = tx.objectStore("data");
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  },

  async set(key: Key, value: StoreValue): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("data", "readwrite");
      const store = tx.objectStore("data");
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async delete(key: Key): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("data", "readwrite");
      const store = tx.objectStore("data");
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async keys(): Promise<string[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("data", "readonly");
      const store = tx.objectStore("data");
      const req = store.getAllKeys();
      req.onsuccess = () => resolve(req.result as string[]);
      req.onerror = () => reject(req.error);
    });
  }
};
