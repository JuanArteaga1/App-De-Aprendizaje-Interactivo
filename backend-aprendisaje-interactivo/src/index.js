const app = require('./app.js')
const db =require('./db.js')
const PORT =  3000;

db.connectdb()
app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor corriendo en http://0.0.0.0:3000');
});
console.log('server on port',3000)