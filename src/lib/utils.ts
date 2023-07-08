export function toPusherKey(key: string) {
  return key.replace(/:/g, "__");
}
