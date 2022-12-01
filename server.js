const http = require("http");
const fsPromise = require("fs/promises");
const {
    createRoommate,
    saveRoommate,
    getRoommate,
} = require("./modules/roommateGestion");
const {
    creaGasto,
    actulizarGastos,
    leerGastos,
    eliminarGasto,
    encontrarId,
} = require('./modules/gastosGestion');
const { recalcularDeudas } = require("./modules/recalcDeuda");
const PORT = 3000;

const server = http.createServer(async (req, res) => {
    let { gastos } = JSON.parse(
        await fsPromise.readFile("./registros/gastos.json", "utf8")
    );
    if (req.url == "/" && req.method == "GET") {
        res.writeHead(200, { "Content-Type": "text/html ; charset-utf8" });
        try {
            const dashboard = await fsPromise.readFile("index.html");
            res.write(dashboard);
            res.end();
        } catch (error) {
            console.log("Error al cargar el recurso HTML", error);
        }
        //Disponiilización de archivos css, js y ico (type="image/x-icon")
    } else if (req.url == "/style") {
        res.writeHead(200, { "Content-Type": "text/css" });
        const css = await fsPromise.readFile("web/assets/css/style.css");
        res.end(css);
    } else if (req.url == "/script") {
        res.writeHead(200, { "Content-Type": "text/js" });
        const js = await fsPromise.readFile("web/assets/js/script.js");
        res.end(js);
    } else if (req.url == "/favicon.ico") {
        const ico = await fsPromise.readFile("web/assets/img/favicon.ico");
        res.end(ico);
        //Gestion de roommates. Nuev@ roommi
    }
    else if (req.url.startsWith("/roommate") && req.method == "POST") {
        res.writeHead(200, { "Content-Type": "text/html ; charset-utf8" });
        try {
            const roommi = await createRoommate();
            if (roommi) {
                await saveRoommate(roommi);
                recalcularDeudas("nuevoRoommi");
                res.end(JSON.stringify(roommi));
            }

        } catch (error) {
            console.log("Error al crear Nuevo Roommate mensaje de error");
        }
        //Gestion de roommates. Leer roommis
    } else if (req.url.startsWith("/roommates") && req.method == "GET") {
        res.writeHead(200, { "Content-Type": "text/html ; charset-utf8" });
        try {
            const roommis = await getRoommate();
            res.end(roommis);
        } catch (error) { console.log(error) }

        //Gestion de gastos. Nuevo gasto
    } else if (req.url.startsWith("/gasto") && req.method == "POST") {
        try {
            let payloadBuffer = [];
            req.on("data", (payload) => {
                payloadBuffer.push(payload);
            });
            req.on("end", async () => {
                const nuevoGasto = await creaGasto(payloadBuffer);
                if (nuevoGasto) {
                    recalcularDeudas("nuevoGasto", nuevoGasto);
                    res.writeHead(201).end();///End(gasto)????? No se por qué lo puse
                }
            })

        } catch (error) {
            console.log(
                "Error al crear Nuevo GASTO mensaje de error",
                error.message ?? "sin mensaje de error"
            );
        }
        //Gestion de gastos. Leer gasto
    } else if (req.url.startsWith("/gastos") && req.method == "GET") {
        const gastos = await leerGastos()
        res.end(gastos);
        //Gestion de gastos. Borrar gasto
    } else if (req.url.startsWith("/gasto") && req.method == "DELETE") {
        try {
            let urlStLenght = req.url.indexOf('=') + 1;
            let id = req.url.slice(urlStLenght)
            await eliminarGasto(gastos, id);
            let gastoBorrado = gastos.filter((b) => b.id == id);
            recalcularDeudas("gastoBorrado", gastoBorrado);
            res.writeHead(201).end();
        } catch (error) {
            console.log("error :>> ", error);
            res
                .writeHead(500, { "Content-Type": "application/json" })
                .end(JSON.stringify({ status: "Error" }));
        }
        //Gestion de gastos. Editar gasto
    } else if (req.url.startsWith("/gasto") && req.method == "PUT") {
        try {
            let payloadBuffer = [];
            req.on("data", (payload) => {
                payloadBuffer.push(payload);
            });
            req.on("end", async () => {
                let body = JSON.parse(Buffer.concat(payloadBuffer));
                //Recupera parametro id de la url
                let id = encontrarId(req.url,);
                await actulizarGastos(gastos, id, body);
                let gastoEditado = gastos.filter((b) => b.id == id);
                recalcularDeudas("gastoEditado", gastoEditado);
                res.writeHead(201).end();
            });
        } catch (error) {
            console.log("error :>> ", error);
            res
                .writeHead(500, { "Content-Type": "application/json" })
                .end(JSON.stringify({ status: "Error" }));
        }
    }
    //Fin createServer
});
server.listen(PORT, () => console.log(`Corriendo en el puerto ${PORT}`));
