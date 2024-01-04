import React, { useEffect, useState } from "react";
import { databases } from "./appwrite";
import { auth } from "./firebase";

const UserGet = () => {
  const [account, setAccount] = useState(null);

  let idAccount;
  if (auth.currentUser) {
    idAccount = auth.currentUser.uid;
  }

  const getUserAtual = async () => {
    try {
      const response = await databases.getDocument(
        "64f9329a26b6d59ade09",
        "64f93be88eee8bb83ec3",
        idAccount
      );
      setAccount(response);
    } catch (e) {
      console.log("Error ao pegar usuário atual: " + e)
    }
  };

  useEffect(() => {
    getUserAtual();
  }, [auth.currentUser]);

  return account;
};

export default UserGet;