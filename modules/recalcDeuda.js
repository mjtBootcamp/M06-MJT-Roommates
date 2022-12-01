const fsPromises = require('fs/promises');
const { notificadorEmail } = require('./notificadorEmail');



const recalcularDeudas = async (motivo, ultimoGasto) => {
  let { roommates } = JSON.parse(await fsPromises.readFile("./registros/roommates.json", "utf8"));
  const { gastos } = JSON.parse(await fsPromises.readFile("./registros/gastos.json", "utf8"));

  roommates = roommates.map((r) => {
    r.debe = 0;
    r.recibe = 0;
    r.total = 0;
    return r;
  });

  gastos.forEach((g) => {
    roommates = roommates.map((r) => {
      const dividendo = Number((g.monto / roommates.length).toFixed(2));
      if (g.roommate == r.nombre) {
        console.log('Number(g.monto)', Number(g.monto))
        console.log('Number(roommates.length)', Number(roommates.length))
        console.log('Number(g.monto /roommates.length)', Number(g.monto / roommates.length))
        console.log('dividendo', dividendo)
        console.log('r.recibe', r.recibe)
        r.recibe += dividendo;
        console.log('aumentado r.recibe', r.recibe)
      } else {
        console.log('r.debe', r.debe)
        r.debe -= dividendo;
        console.log('disminuido r.debe', r.debe)
      }
      r.total = r.recibe - r.debe;
      //redondear todo
      return r;
    });
  });
  //console.log('roommates dentro de notificadorEmail', roommates)
  await notificadorEmail(motivo, roommates, ultimoGasto)
  await fsPromises.writeFile("./registros/roommates.json", JSON.stringify({ roommates }));
};
module.exports = {
  recalcularDeudas
}