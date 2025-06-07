import { STORE_KEY_PREFIX } from '@/utils/constants';

export class LocalStorage {
  private static prefixKey(key: string): string {
    return `${STORE_KEY_PREFIX}${key}`;
  }

  static setItem(key: string, value: unknown): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LocalStorage.prefixKey(key), JSON.stringify(value));
    }
  }

  static getItem<T>(key: string): T | null {
    if (typeof window !== 'undefined') {
      const value = localStorage.getItem(LocalStorage.prefixKey(key));
      return value ? (JSON.parse(value) as T) : null;
    }
    return null;
  }

  static removeItem(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LocalStorage.prefixKey(key));
    }
  }

  static reset(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
}
