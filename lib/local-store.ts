import { useEffect, useState } from "react";

// Helper عام لتخزين بيانات في localStorage مع مزامنة بين التابات (mock فقط
// لحد ما يتحط backend حقيقي — كل التابات المفتوحة على نفس المتصفح بتتزامن،
// لكن مفيش مزامنة بين أجهزة مختلفة).

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(`local-store:${key}`));
}

export function useLocalStore<T>(key: string, seed: T) {
  const [value, setValue] = useState<T>(seed);

  useEffect(() => {
    const existing = window.localStorage.getItem(key);
    if (existing === null) {
      writeJson(key, seed);
      setValue(seed);
    } else {
      setValue(readJson(key, seed));
    }

    function sync() {
      setValue(readJson(key, seed));
    }
    window.addEventListener("storage", sync);
    window.addEventListener(`local-store:${key}`, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(`local-store:${key}`, sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  function update(updater: (current: T) => T) {
    setValue((current) => {
      const next = updater(current);
      writeJson(key, next);
      return next;
    });
  }

  return { value, update };
}
