import { inputLoginIE } from "../interfaces";
import { client } from "../mongo";

export const LoginToExist = async (data: inputLoginIE) => {
  let { login, password } = data;
  let account = await client
    .db()
    .collection("users")
    .findOne({ login, password });
  return account;
};
