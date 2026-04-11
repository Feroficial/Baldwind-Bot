import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import fs from 'fs'; 
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import axios from 'axios';
import moment from 'moment-timezone';

//*─✞─ CONFIGURACIÓN GLOBAL ─✞─*

global.botNumber = '';

global.owner = [
  ['59177474230', '🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸', true]
];

global.mods = ['59177474230'];
global.suittag = ['59177474230'];
global.prems = ['59177474230'];

global.libreria = 'Baileys';
global.baileys = 'V 6.7.9';
global.languaje = 'Español';
global.vs = '2.2.0';
global.vsJB = '5.0';
global.nameqr = 'BALDWIND IV - Bot';
global.sessions = 'baldwindSession';
global.jadi = 'baldwindJadiBot';
global.blackJadibts = true;

global.packsticker = '🜸 BALDWIND IV 🛸 ᚲ DEVLYONN';
global.packname = '🜸 BALDWIND IV 🛸';
global.author = '♾━━━━━━━━━━━━━━━♾';

global.wm = '🜸 BALDWIND IV 🛸';
global.titulowm = '🜸 BALDWIND IV 🛸';
global.igfg = '🜸 DEVLYONN';
global.botname = '🜸 BALDWIND IV 🛸';
global.dev = '© ᴘᴏᴡᴇʀᴇᴅ ʙʏ DEVLYONN ⚔️';
global.textbot = '🜸 BALDWIND IV : DEVLYONN';
global.gt = '͟͞🜸 BALDWIND IV 🛸͟͞';
global.namechannel = '🜸 BALDWIND IV / DEVLYONN';

global.monedas = 'monedas';

global.gp1 = 'https://chat.whatsapp.com/LPHJXnuklWy62oyHB3FJoQ';
global.gp2 = 'https://chat.whatsapp.com/LPHJXnuklWy62oyHB3FJoQ';
global.comunidad1 = 'https://chat.whatsapp.com/LPHJXnuklWy62oyHB3FJoQ';
global.channel = '';
global.cn = global.channel;
global.yt = 'https://youtube.com/@DevLyonn';
global.md = 'https://github.com/Feroficial/Baldwind-IV-Bot';
global.correo = 'devlyonn@baldwind.com';

global.catalogo = fs.readFileSync(new URL('../src/catalogo.jpg', import.meta.url));
global.photoSity = [global.catalogo];

global.estilo = { 
  key: {  
    fromMe: false, 
    participant: '0@s.whatsapp.net', 
  }, 
  message: { 
    orderMessage: { 
      itemCount : -999999, 
      status: 1, 
      surface : 1, 
      message: global.packname, 
      orderTitle: 'BALDWIND IV', 
      thumbnail: global.catalogo, 
      sellerJid: '0@s.whatsapp.net'
    }
  }
};

global.ch = { ch1: "" };
global.rcanal = global.ch.ch1;

global.cheerio = cheerio;
global.fs = fs;
global.fetch = fetch;
global.axios = axios;
global.moment = moment;

global.multiplier = 69;
global.maxwarn = 3;

const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright('Update \'núcleo•clover/config.js\''));
  import(`${file}?update=${Date.now()}`);
});