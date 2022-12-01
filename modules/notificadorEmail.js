const nodemailer = require("nodemailer");
const {
    getRoommate,

} = require("./roommateGestion");
const {
    leerGastos,
    encontrarId,
} = require('./gastosGestion');


const notificadorEmail = async (motivo, roommates, ultimoGasto) => {
    try {
        const to = []
        const nuevoCalculo = await imprimirCuerpoMail()
        let ultimRoommi = roommates.length - 1
        for (let index = 0; index < roommates.length; index++) {
            const element = roommates[index];
            to.push(element)
        }
        let htmlSt = '';
        let textSt = '';
        let subject = '';
        if (motivo == "nuevoRoommi") {
            subject = `Recalculo de gastos`;
            htmlSt = `<h2>${roommates[ultimRoommi].nombre} ha llegado a casa</h2>
        <h3>Nuevo calculo</h3>
        <br>${nuevoCalculo}`;
            textSt = `${roommates[ultimRoommi].nombre} ha llegado a casa`;
        } else if (motivo = 'gastoEditado') {
            subject = `Recalculo de gastos`;
            htmlSt = `<h2>Se ha editado el gasto: ${ultimoGasto.id} ${ultimoGasto.descripcion} ${ultimoGasto.monto} pagado por ${ultimoGasto.roommate}</h2>
        <h3>Nuevo calculo</h3>
        <br>${nuevoCalculo}`;
            textSt = `Se ha editado el gasto: ${ultimoGasto.id} ${ultimoGasto.descripcion} ${ultimoGasto.monto} pagado por ${ultimoGasto.roommate}`;
        } else if (motivo = 'gastoBorrado') {
            subject = `Recalculo de gastos`;
            htmlSt = `<h2>Eliminado el gasto: ${ultimoGasto.id} ${ultimoGasto.descripcion} ${ultimoGasto.monto} pagado por ${ultimoGasto.roommate}</h2>
        <h3>Nuevo calculo</h3>
        <br>${nuevoCalculo}`;
            textSt = `Eliminado el gasto: ${ultimoGasto.id} ${ultimoGasto.descripcion} ${ultimoGasto.monto} pagado por ${ultimoGasto.roommate}`;
        }
        const mailConfig = {
            service: "hotmail",
            auth: {
                user: "djadfhsdfsdlfas4852@outlook.com",
                pass: "12345poi..",
            },
        };

        const transporter = nodemailer.createTransport(mailConfig);

        let mailOptions = {
            from,
            to,
            subject,
            html: htmlSt,
            text: textSt,
        }

        transporter.sendMail(mailOptions, (err, data) => {
            if (err) console.log('err:', err);
            if (data) console.log('data:', data);
        });
    } catch (error) {
        console.log('error :>> ', error);
        console.log('error.message :>> ', error.message);
    }

}
const imprimirCuerpoMail = async () => {
    try {
        let roommates = await getRoommate();
        let gastos = await leerGastos();
        let tablaRo = ' ';
        let tableGa = ' '
        for (let index = 0; index < roommates.length; index++) {
            const r = roommates[index];
            `<option value="${r.nombre}">${r.nombre}</option>
                <option value="${r.nombre}">${r.nombre}</option>
                        <tr>
                          <td>${r.nombre}</td>
                          <td class="text-danger">${r.debe ? r.debe : "-"}</td>
                          <td class="text-success">${r.recibe ? r.recibe : "-"}</td>
                        </tr>`
            tablaRo = tablaRo + r
        }
        for (let index = 0; index < gastos.length; index++) {
            const g = gastos[index];
            `<tr>
                    <td>${g.roommate}</td>
                    <td>${g.descripcion}</td>
                    <td>${g.monto}</td>
                    <td class="d-flex align-items-center justify-content-between">
                      <i class="fas fa-edit text-warning" onclick="editGasto('${g.id}')" data-toggle="modal" data-target="#exampleModal"></i>
                      <i class="fas fa-trash-alt text-danger" onclick="deleteGasto('${g.id}')" ></i>
                    </td>
                  </tr>`
            tableGa = tableGa + g
        }
        let bodyMail = roommates + gastos
        return bodyMail;
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    notificadorEmail
}