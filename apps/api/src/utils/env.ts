function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) throw new Error(`missing env variable ${name}`);

  return value;
}

export const env = {
  port: requiredEnv("PORT"),
  jwtSecret: requiredEnv("JWT_SECRET")
};
