import * as argon2 from "argon2";

// Les options de l'argon2 permettent de définir le type de hashage, la mémoire, le temps, le parallélisme et la longueur du hash
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

// La fonction verifyPassword permet de vérifier si le mot de passe est correct
export async function verifyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  return argon2.verify(hash, password);
}
