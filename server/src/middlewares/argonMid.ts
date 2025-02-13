import * as argon2 from "argon2";

const options = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 4,
  parallelism: 1,
  hashLength: 64,
};

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, options);
}

export async function verifyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  return argon2.verify(hash, password);
}
