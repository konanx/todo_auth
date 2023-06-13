import { client } from "../mongo";
export const CreateTestAccount = async () => {
  const { insertedId } = await client
    .db()
    .collection("users")
    .insertOne({ testowe: true, createdAt: new Date() });
  return insertedId.toString();
};
