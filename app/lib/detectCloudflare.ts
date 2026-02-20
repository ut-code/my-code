export function isCloudflare() {
  return (
    typeof navigator === "undefined" &&
    // @ts-expect-error userAgent is defined in cloudflare worker
    navigator.userAgent === "Cloudflare-Worker"
  );
}
