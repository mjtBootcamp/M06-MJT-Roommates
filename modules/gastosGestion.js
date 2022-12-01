const { v4: uuidv4 } = require("uuid");
const fsPromise = require("fs/promises");

const creaGasto = async (payloadBuffer) => {
    console.log("creaGasto()")
    try {
        let { roommate, descripcion, monto } = JSON.parse(
            Buffer.concat(payloadBuffer)
        );
        const gasto = {
            id: uuidv4(),
            roommate,
            descripcion,
            monto,
        };
        const gastos = await fsPromise.readFile("./registros/gastos.json");
        const objetoGastos = JSON.parse(gastos);
        objetoGastos?.gastos.push(gasto);

        await fsPromise.writeFile(
            "./registros/gastos.json",
            JSON.stringify(objetoGastos)
        );
        return gasto;
    } catch (error) {
        console.log("error createUser", error);
    }
};

const actulizarGastos = async (gastos, id, body) => {
    console.log("saveUser =>>>>");
    try {
        gastos = gastos.map((b) => {
            if (b.id == id) {
                return body;
            }
            return b;
        });
        await fsPromise.writeFile(
            "./registros/gastos.json",
            JSON.stringify({ gastos })
        );
    } catch (error) {
        console.log(error)
    }

};
const eliminarGasto = async (gastos, id) => {
    try {
        gastos = gastos.filter((b) => b.id !== id);
        await fsPromise.writeFile(
            "./registros/gastos.json",
            JSON.stringify({ gastos })
        );
    } catch (error) {
        console.log(error)
    }
}
const leerGastos = async () => {
    console.log("getUser =>>>>");
    const gastos = await fsPromise.readFile("./registros/gastos.json", {
        encoding: "utf-8",
    });
    return gastos;
};
const encontrarId = (urlParams) => {
    let urlStLenght = urlParams.indexOf('=') + 1;
    let id = urlParams.slice(urlStLenght)
    return id
}
module.exports = {
    creaGasto,
    actulizarGastos,
    eliminarGasto,
    leerGastos,
    encontrarId,
};
