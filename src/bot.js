const Telegraf = require('telegraf');
const Preguntas = require('./preguntas')
const bot = new Telegraf('1581097343:AAGnz93Kk_NOO_k6rt6Nphtvk0wFxb3Psz4')
const axios = require('axios');



bot.start((ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, `Hola ${ctx.from.first_name}. ¿Cómo podemos ayudarte? Escribe /help para saber más.`);
})

bot.help(ctx => bot.telegram.sendMessage(ctx.chat.id,'*Comandos*\n/imagen <pokemon> Devuelve la imagen de un pokemon.\n/resultados <año> <tipo> <Nó General> <Clave Paciente>\n/start Inicia el Bot.\n/settings Comando de configuraciones\n/teclado Abre el teclado de opciones.\n\n*Preguntas frecuentes*\n1. ¿Cómo se puede realizar un convenio con Lapi?',{ parse_mode: "Markdown" }))

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

bot.command(['imagen','Imagen'],(ctx)=>{
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
})
bot.command(['teclado', 'keyboard', 'Teclado','Keyboard','ayuda','Ayuda'], (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id,'Selecciona una opción',{
    reply_markup:{
      inline_keyboard:[
        [{text:'Preguntas Frecuentes',callback_data:'PF'}],
        [{text:'Resultados', url:'https://www.lapiweb.com.mx/webnew/login.php'},{text:'Facturación',url:'https://lapiweb.com.mx/Facturacion/login.php'}]
      ]
    }
  });
})

bot.action('PF',(ctx)=>{
  ctx.deleteMessage()
  ctx.telegram.sendMessage(ctx.chat.id,'Selecciona una opción',{
    reply_markup:{
      inline_keyboard:[
        [{text:'¿CÓMO SE PUEDE REALIZAR UN CONVENIO CON LAPI?',callback_data:'P1'}],
        [{text:'Regresar al menu', callback_data:'regresarAlMenu'}]
      ]
    }
  });
})

bot.action('P1',(ctx)=>{
  ctx.deleteMessage()
  ctx.telegram.sendMessage(ctx.chat.id,'Si te interesa adicionar beneficios para la salud de los colaboradores de tu empresa, envía un mensaje a la dirección de e-mail *convenios@lapi.com.mx* y se te brindará asesoría al respecto.',{parse_mode:'Markdown'});
})

bot.action('regresarAlMenu',(ctx)=>{
  ctx.deleteMessage()
  ctx.telegram.sendMessage(ctx.chat.id,'Selecciona una opción',{
    reply_markup:{
      inline_keyboard:[
        [{text:'¿CÓMO SE PUEDE REALIZAR UN CONVENIO CON LAPI?',callback_data:'P1'}],
        [{text:'Resultados', url:'https://www.lapiweb.com.mx/webnew/login.php'},{text:'Facturación',url:'https://lapiweb.com.mx/Facturacion/login.php'}]
      ]
    }
  });
})
// hears
bot.hears('computer', ctx => {
  ctx.reply('Computadora')
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
  }else{
    ctx.reply('No entiendo tu mensjae. Escribe /help para saber más.')
  }
});

bot.on('sticker', (ctx) => ctx.reply('👍'))

// this methods can be recognized inside a long text
bot.mention('BotFather', (ctx) => {
  ctx.reply('Menciones')
})

bot.phone('5527624009', (ctx) => {
  ctx.reply('Un numero de teléfono')
});

bot.hashtag('#Resultados', (ctx) => {
  ctx.reply("hashtag! Let's go!")
})

bot.launch()
