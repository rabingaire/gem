import { Deta } from "deta";
import { update } from "./index";

export class Storage {
  constructor() {
    const gem = this.getCookieValue("gem");
    const db = Deta(gem).Base("gem");

    // hydrate local storage
    if (this.getLocalStorageKeys().length == 0) {
      db.fetch().then(({ items }) => {
        items.forEach((item: { [key: string]: any }) => {
          localStorage.setItem(item.key, item.value);
        });
        update({ type: "LOAD_BUFFER", payload: 0 });
      });
    }

    setInterval(() => {
      const values = this.getLocalStorageValues();
      if (values.length > 0) {
        db.putMany(values);
      }
    }, 3000);
  }

  private getCookieValue(key: string): string {
    return (
      document.cookie.match(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`)?.pop() || ""
    );
  }

  private getLocalStorageKeys(): string[] {
    return Object.keys(localStorage).filter((key: string) => {
      return key.startsWith("gem-");
    });
  }

  private getLocalStorageValues(): { [key: string]: any }[] {
    return this.getLocalStorageKeys().map((key) => {
      return {
        key,
        value: localStorage.getItem(key),
      };
    });
  }

  public get(key: string): { [key: string]: any } | null {
    const value = localStorage.getItem(`gem-${key}`);
    if (value) {
      return JSON.parse(value);
    }

    return null;
  }

  public set(key: string, newData: any): void {
    const newValue = JSON.stringify(newData);
    localStorage.setItem(`gem-${key}`, newValue);
  }
}
