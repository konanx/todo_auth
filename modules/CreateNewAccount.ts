import { inputLoginIE } from "../interfaces";
import { client } from "../mongo";

export const CreateNewAccount = async (data: inputLoginIE) => {
  if (!data?.login || !data?.password) {
    return {
      error: true,
      message: "Wpisz login i hasło!",
    };
  }
  let { login, password } = data;
  const istnieje = await client
    .db()
    .collection("users")
    .find({ login })
    .toArray();
  if (istnieje.length)
    return {
      error: true,
      message: "Konto o podanym adresie email już istnieje",
    };
  let result = await client
    .db()
    .collection("users")
    .insertOne({ login, password, createdAt: new Date() });
  if (result.insertedId) return { id: result.insertedId, login, error: false };
  return {
    error: true,
    message: "Wystąpił błąd, skontaktuj się z administratorem!",
  };
};
