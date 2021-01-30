export function isApple() {
  const devices = /iPhone|mac|iPod|iPad|iOS/i;

  return devices.test(navigator.userAgent);
}
