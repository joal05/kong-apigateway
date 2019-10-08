const jwt = require('jsonwebtoken');
const moment = require('moment');
const inquirer = require('inquirer');
const colors = require('colors');
const gradient = require('gradient-string');

inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'))
console.log(gradient.mind('===================================='))
console.log (gradient.mind('generando el token'));
console.log(gradient.mind('===================================='))

function generarToken(respuestas) {
  const result = {};
  const secs = calcSecs(respuestas.dt);
  const token = jwt.sign({
    "iss": respuestas.key,
    "user": respuestas.usuario,
    "exp": moment().add(secs, 'seconds').unix(),
  },
  respuestas.secret,
  {
    "noTimestamp": true
  });
  result.token = token;
  result.expDate = moment(respuestas.dt, 'DD/MM/YYYY').format('DD/MM/YYYY');
  return result;
};

function calcSecs(time){
  const dateExp = moment(time);
  const dateNow = moment().format();
  const dateReturn = dateExp.diff(dateNow, 'seconds');
  return dateReturn;
}

const questions = [
  {
    type: 'input',
    name: 'usuario',
    message: 'Introduzca el usuario:',
  },
  {
    type: 'input',
    name: 'key',
    message: 'Introduzca el valor de Key:',
  },
  {
    type: 'input',
    name: 'secret',
    message: 'Introduzca el valor de secret:',
  },
  {
    type: 'datetime',
    name: 'dt',
    message: 'fecha de expiración (dd/mm/yyyy):',
    format: ['dd', '/', 'mm', '/', 'yyyy', ' '],
    initial:new Date(moment().locale("en").add(3, 'years').format("MMM DD, YYYY HH:MM")),
  }
]

inquirer.prompt(questions)
  .then((respuestas) => {
    return (generarToken(respuestas));
  })
  .then((result) => {
    console.log(gradient.mind('============================='));
    console.log('Token generado:'.bold.cyan);
    console.log(gradient.cristal('Bearer ' + result.token));
    console.log('Fecha generación:'.bold.cyan);
    console.log(moment().format('DD/MM/YYYY'));
    console.log('Fecha expiración:'.bold.cyan);
    console.log(result.expDate) ;
    console.log('Token generado.'.bold.yellow);
    console.log(gradient.mind('============================='));
  })
  .catch((err) => {
    console.log('no se pudo generar el token'.bgRed);
    console.log(err);
  });
