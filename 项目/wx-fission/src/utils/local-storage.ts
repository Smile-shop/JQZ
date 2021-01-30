export function getItem(key: string) {
  const item = window.sessionStorage.getItem(key);

  if (!item) {
    return null;
  }

  return JSON.parse(item);
}

export function setItem(key: string, value: any) {
  const stringify = JSON.stringify(value);

  window.sessionStorage.setItem(key, stringify);
}
