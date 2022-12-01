const http = require("http");
const fs = require("fs/promises");

http
  .createServer(async (req, res) => {
    // Inicio de disponibilización de rutas a archivos
    if (req.url == "/" && req.method == "GET") {
      // disponibiliza HTML
      res.writeHead(200, { "Content-Type": "text/html ; charset-utf8" });
      console.log("Home");
      try {
        const dashboard = await fsPromise.readFile("index.html");
        res.write(dashboard);
        res.end();
      } catch (error) {
        console.log("Error al cargar el recurso HTML", error);
        console.log(
          "mensaje de error",
          error.message ?? "sin mensaje de error"
        );
      }
    } else if (req.url == "/js") {
      //// disponibiliza js
      res.writeHead(200, { "Content-Type": "text/js" });
      try {
        await fs.readFile("http://localhost:3000/js");
        res.end(js);
      } catch (error) {
        console.log("Error al cargar el recurso js", error);
        console.log(
          "mensaje de error",
          error.message ?? "sin mensaje de error"
        );
      }
    } else if (req.url == "/css") {
      //// disponibiliza css
      res.writeHead(200, { "Content-Type": "text/css" });
      try {
        await fs.readFile("http://localhost:3000/css");
        res.end(css);
      } catch (error) {
        console.log("Error al cargar el recurso js", error);
        console.log(
          "mensaje de error",
          error.message ?? "sin mensaje de error"
        );
      }
      //Fin disponibilizacion de links
    }
  })
  .listen(3000, () => console.log("Servidor encendido"));
