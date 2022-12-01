const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const fsPromise = require("fs/promises");

const createRoommate = async () => {
  console.log("createUser =>>>>");
  try {
    const { data } = await axios.get("https://randomuser.me/api");
    const userData = data.results[0];
    let { first, last } = userData.name;
    let user = {
      id: uuidv4(),
      correo: userData.email,
      nombre: `${first} ${last}`,
      debe: 0,
      recibe: 0,
    };
    return user;
  } catch (error) {
    console.log("error createUser", error);
  }
};

const saveRoommate = async (user) => {
  console.log("saveUser =>>>>");
  try {
    const roommates = await fsPromise.readFile("./registros/roommates.json");
    const objetoUsuario = JSON.parse(roommates);

    objetoUsuario?.roommates.push(user);

    await fsPromise.writeFile(
      "./registros/roommates.json",
      JSON.stringify(objetoUsuario)
    );
  } catch (error) {
    console.log("saveUser", error);
  }
};
const getRoommate = async () => {
  console.log("getUser =>>>>");
  const users = await fsPromise.readFile("./registros/roommates.json", {
    encoding: "utf-8",
  });
  return users;
};

module.exports = {
  createRoommate,
  saveRoommate,
  getRoommate,
};
