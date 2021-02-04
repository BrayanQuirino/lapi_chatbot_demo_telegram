const Telegraf = require('telegraf');
const Preguntas = require('./preguntas')
const bot = new Telegraf('1581097343:AAGnz93Kk_NOO_k6rt6Nphtvk0wFxb3Psz4')
const axios = require('axios');

let dics=[{'servicio':'VIH','url':'http://adn.adn.seccionamarilla.com/image.ashx?i=3589056.jpg&fn=LAPI_CUPON-JUNTOS.jpg'},
{'servicio':'covid','url':'https://lapi.com.mx/img/3836/247.jpg'}]


bot.start((ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, `Hola ${ctx.from.first_name}. ¿Cómo podemos ayudarte? Escribe /help para saber más.`);
})

bot.help(ctx => ctx.telegram.sendMessage(ctx.chat.id,'*Comandos*\n/imagen <servicio> Devuelve la imagen de un servicio.\n/resultados <año> <tipo> <Nó General> <Clave Paciente>\n/start Inicia el Bot.\n/teclado Abre el teclado de opciones.\n\n*Preguntas frecuentes*\n1. ¿Cómo se puede realizar un convenio con Lapi?\n2. ¿Cualés son los horarios de atención?',{parse_mode: "Markdown"}))

bot.settings(ctx => ctx.reply('Comando de configuraciones'))

// Custom Command
bot.command(['mytest', 'Mytest', 'test'], (ctx) => {
  ctx.reply('Prueba de comando personalizado');
})

bot.command(['resultados','Resultados'],(ctx)=>{
  datos=ctx.update.message.text.split(' ')
  if(datos.length==5){
    ctx.telegram.sendMessage(ctx.chat.id,`*Año*:${datos[1]}\n*Tipo*:${datos[2]}\n*Nó. General*:${datos[3]}\n*Clave Paciente*:${datos[4]}\n`,{parse_mode:'Markdown'})
    ctx.telegram.sendDocument(ctx.chat.id,'https://github.com/BrayanQuirino/ElasticSearch/raw/master/Elasticsearch.pdf')
  }else{
    ctx.telegram.sendMessage(ctx.chat.id,'Parece que no enviaste todos loas datos.\nINtenta escribir:\n/resultados <año> <tipo> <Nó. General> <Clave paciente>\nTambien puede contactarnos por *atencionconcalidad@lapi.com.mx* para más información',{parse_mode:'Markdown'})
  }
})

/*bot.command(['imagen','Imagen'],(ctx)=>{
  let imagen=''
  pokemon=ctx.update.message.text.split(' ')[1]
  if(pokemon){
    axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    .then(function (response) {
      // handle success
      imagen=response.data.sprites.front_default
      //console.log(imagen)
      ctx.telegram.sendPhoto(ctx.chat.id,imagen)
      //console.log(response);
    })
    .catch(function (error) {
      // handle error
      //console.log(error);
      ctx.reply('Ocurrio un problema con la API pokemon')
    })
  }else{
      ctx.reply('Intenta escribir /imagen <pokemon>')
  }
})*/

bot.command(['imagen','Imagen'],(ctx)=>{
  let imagen=''
  pokemon=ctx.update.message.text.split(' ')[1]
  if(pokemon){
    if(pokemon=='VIH'){
      ctx.telegram.sendPhoto(ctx.chat.id,dics[0].url)
    }else if(pokemon=='covid'){
      ctx.telegram.sendPhoto(ctx.chat.id,dics[1].url)
    }else{
      ctx.reply('Lo sentimos, no contaos con ese servicio.')
    }
  }else{
      ctx.reply('Intenta escribir /imagen <pokemon>')
  }
})
bot.command(['teclado', 'keyboard', 'Teclado','Keyboard','ayuda','Ayuda'], (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id,'Selecciona una opción',{
    reply_markup:{
      inline_keyboard:[
        [{text:'Preguntas Frecuentes',callback_data:'PF'}],
        [{text:'Resultados', url:'https://www.lapiweb.com.mx/webnew/login.php'},{text:'Facturación',url:'https://lapiweb.com.mx/Facturacion/login.php'}],
        [{text:'Resultados chat',callback_data:'RC'}]
      ]
    }
  });
})

bot.action(['RC','ATRASANO'],(ctx)=>{
  ctx.deleteMessage()
  ctx.telegram.sendMessage(ctx.chat.id,'¿De que año?',{
    reply_markup:{
      inline_keyboard:[
        [{text:'2020', callback_data:'2020'},{text:'2021', callback_data:'2021'}],
        [{text:'Regresar al menu', callback_data:'MENUPRINCIPAL'}]
      ]
    }
  });
})

bot.action(['2021','2020'],(ctx)=>{
  ctx.deleteMessage()
  ctx.telegram.sendMessage(ctx.chat.id,'¿De que tipo?',{
    reply_markup:{
      inline_keyboard:[
        [{text:'Paciente', callback_data:'PACIENTE'},{text:'Médico', callback_data:'MEDICO'},{text:'Empresa', callback_data:'EMPRESA'}],
        [{text:'Atras', callback_data:'ATRASANO'},{text:'Regresar al menu', callback_data:'MENUPRINCIPAL'}]
      ]
    }
  });
})

bot.action(['PACIENTE','MEDICO','EMPRESA'],(ctx)=>{
  ctx.reply('Ingresa tu Nó General')
  ctx.telegram.sendPhoto(ctx.chat.id,'https://github.com/BrayanQuirino/lapi_chatbot_demo_telegram/raw/master/src/utilidades/NoOrden.jpg')

  //https://github.com/BrayanQuirino/lapi_chatbot_demo_telegram/raw/master/src/utilidades/ClavePaciente.jpg
})

bot.action('PF',(ctx)=>{
  ctx.deleteMessage()
  ctx.telegram.sendMessage(ctx.chat.id,'Selecciona una opción',{
    reply_markup:{
      inline_keyboard:[
        [{text:'¿CÓMO SE PUEDE REALIZAR UN CONVENIO CON LAPI?',callback_data:'P1'}],
        [{text:'¿Cualés son los horarios de atención?',callback_data:'P2'}],
        [{text:'Regresar al menu', callback_data:'MENUPRINCIPAL'}]
      ]
    }
  });
})

bot.action('P1',(ctx)=>{
  ctx.deleteMessage()
  ctx.telegram.sendMessage(ctx.chat.id,'Si te interesa adicionar beneficios para la salud de los colaboradores de tu empresa, envía un mensaje a la dirección de e-mail *convenios@lapi.com.mx* y se te brindará asesoría al respecto.',{parse_mode:'Markdown'});
})

bot.action('P2',(ctx)=>{
  ctx.deleteMessage()
  ctx.reply('Los horarios de atención en sucural son de *Lunes a Viernes* de *9:00 a.m. - 6:00 p.m.*',{parse_mode:'Markdown'})
})

bot.action('MENUPRINCIPAL',(ctx)=>{
  ctx.deleteMessage()
  ctx.telegram.sendMessage(ctx.chat.id,'Selecciona una opción',{
    reply_markup:{
      inline_keyboard:[
        [{text:'Preguntas Frecuetes',callback_data:'PF'}],
        [{text:'Resultados', url:'https://www.lapiweb.com.mx/webnew/login.php'},{text:'Facturación',url:'https://lapiweb.com.mx/Facturacion/login.php'}],
        [{text:'Resultados chat',callback_data:'RC'}]
      ]
    }
  });
})
// hears
bot.hears('computer', ctx => {
  ctx.reply('Computadora')
})

bot.on('sticker', (ctx) => ctx.reply('👍'))

// this methods can be recognized inside a long text
bot.mention('BotFather', (ctx) => {
  ctx.reply('Menciones')
})

bot.phone('5527624009', (ctx) => {
  ctx.reply('Un numero de teléfono')
});

bot.hashtag('#resultadosLapi', (ctx) => {
  ctx.reply("hashtag! Let's go!")
})

bot.on('text', ctx => {
  let pre=false;
  //console.log(ctx.update.message.text)
  Preguntas.forEach((p)=>{
    if(ctx.update.message.text==p){
      pre= true;
    }
  });
  if (pre){
    bot.telegram.sendMessage(ctx.chat.id,'Si te interesa adicionar beneficios para la salud de los colaboradores de tu empresa, envía un mensaje a la dirección de e-mail *convenios@lapi.com.mx* y se te brindará asesoría al respecto.',{parse_mode:'Markdown'});
  }
  if(ctx.update.message.text=='12345'){
    ctx.deleteMessage()
    ctx.reply('Ingresa tu Clave Paciente')
    ctx.telegram.sendPhoto(ctx.chat.id,'https://github.com/BrayanQuirino/lapi_chatbot_demo_telegram/raw/master/src/utilidades/ClavePaciente.jpg')
  }
  if(ctx.update.message.text=='ABCD12345'){
    ctx.reply('Tus resultados')
    ctx.telegram.sendDocument(ctx.chat.id,'https://github.com/BrayanQuirino/lapi_chatbot_demo_telegram/raw/master/src/utilidades/Resultados.pdf')
  }
  if(ctx.update.message.text=='¿Cualés son los horarios de atención?'){
    ctx.reply('Los horarios de atención en sucural son de *Lunes a Viernes* de *9:00 a.m. - 6:00 p.m.*',{parse_mode:'Markdown'})
  }
});

bot.launch()
