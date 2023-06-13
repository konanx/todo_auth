require("dotenv").config();
import { Server } from "socket.io";
import { CreateTestAccount } from "./modules/CreateTestAccount";
import { CreateNewAccount } from "./modules/CreateNewAccount";
import { inputLoginIE } from "./interfaces";
import { LoginToExist } from "./modules/LoginToExist";

const io = new Server(3010, {
  cors: {},
});

io.on("connection", (socket) => {
  const alert = (data: { type: string; message: string | undefined }) => {
    socket.emit("alert", { type: data.type, message: data.message ?? "" });
  };

  socket.on("createTestAccount", async () => {
    const id = await CreateTestAccount();
    socket.emit("createTestAccountResponse", id);
  });
  socket.on("createNewAccount", async (data: inputLoginIE) => {
    const result = await CreateNewAccount(data);

    if (!result?.error) {
      const { login = "", id = null } = result;
      socket.emit("createNewAccountResponse", { login, id });
    } else {
      alert({ type: "error", message: result.message });
    }
  });
  socket.on("loginToExist", async (data: inputLoginIE) => {
    let account = await LoginToExist(data);
    if (!account) {
      alert({ type: "error", message: "Nieprawidłowe dane" });
      return;
    }
    if (!account._id) {
      alert({ type: "error", message: "Coś poszło nie tak (ERROR: 0042)" });
      return;
    }
    socket.emit("loginToExistResponse", {
      id: account._id.toString(),
      login: account.login ?? "",
    });
  });
});
