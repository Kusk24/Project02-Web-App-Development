export function getEnv(key, defaultValue = "") {
  if (typeof window !== "undefined") {
    return process.env[`NEXT_PUBLIC_${key}`] || defaultValue;
  }
  return process.env[key] || defaultValue;
}

export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}
