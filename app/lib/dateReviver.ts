export function dateReviver(key: string, value: unknown) {
  if (
    [
      "createdAt",
      "updatedAt",
      "expiresAt",
      "accessTokenExpiresAt",
      "refreshTokenExpiresAt",
    ].includes(key) &&
    typeof value === "string"
  ) {
    return new Date(value);
  }
  return value;
}
