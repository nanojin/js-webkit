function getSiteKeyPrefix(): string {
	const hostname = location.hostname
    .replace(/^www\./, '')
	.replace(/^x/, 'twitter')
    .replace(/pinterest\\.[a-z.]+$/, 'pinterest')
    .replace(/[^a-z0-9]+/gi, '_')
    .toLowerCase();
  return `__webkitdb__${hostname}__`;
}

export const SiteScopedDB = {
  set(key: string, value: any) {
    const prefix = getSiteKeyPrefix();
    localStorage.setItem(`${prefix}${key}`, JSON.stringify(value));
  },

  get<T = any>(key: string): T | null {
    const prefix = getSiteKeyPrefix();
    const raw = localStorage.getItem(`${prefix}${key}`);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  delete(key: string) {
    const prefix = getSiteKeyPrefix();
    localStorage.removeItem(`${prefix}${key}`);
  },

  keys(): string[] {
    const prefix = getSiteKeyPrefix();
    return Object.keys(localStorage)
      .filter(k => k.startsWith(prefix))
      .map(k => k.slice(prefix.length));
  }
};
