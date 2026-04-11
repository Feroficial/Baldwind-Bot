import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { smsg } from '../lib/simple.js';
import { format } from 'util';
import { fileURLToPath } from 'url';
import path, { join } from 'path';
import { unwatchFile, watchFile } from 'fs';
import fs from 'fs';
import chalk from 'chalk';
import ws from 'ws';

const { proto } = (await import('@whiskeysockets/baileys')).default;
const isNumber = x => typeof x === 'number' && !isNaN(x);
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(() => resolve(), ms));

const clockString = (ms) => {
  if (!ms || isNaN(ms)) return '00:00:00';
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor(ms / 60000) % 60;
  const seconds = Math.floor(ms / 1000) % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export async function handler(chatUpdate) {
  this.msgqueque ||= [];
  this.uptime ||= Date.now();
  if (!chatUpdate) return;
  this.pushMessage(chatUpdate.messages).catch(console.error);

  let m = chatUpdate.messages[chatUpdate.messages.length - 1];
  if (!m) return;
  if (!global.db.data) await global.loadDatabase();

  try {
    m = smsg(this, m) || m;
    if (!m) return;
    global.mconn = m;
    m.exp = 0;
    m.monedas = false;

    // ========== INICIALIZAR DATOS DEL USUARIO ==========
    try {
      let user = global.db.data.users[m.sender];
      if (!user || typeof user !== 'object') global.db.data.users[m.sender] = user = {};

      Object.assign(user, {
        exp: isNumber(user.exp) ? user.exp : 0,
        monedas: isNumber(user.monedas) ? user.monedas : 100,
        bank: isNumber(user.bank) ? user.bank : 0,
        level: isNumber(user.level) ? user.level : 1,
        registered: 'registered' in user ? user.registered : false,
        name: user.name || m.pushName || 'Anónimo',
        age: isNumber(user.age) ? user.age : -1,
        regTime: isNumber(user.regTime) ? user.regTime : -1,
      });

      let chat = global.db.data.chats[m.chat];
      if (!chat || typeof chat !== 'object') global.db.data.chats[m.chat] = chat = {};
      Object.assign(chat, {
        isBanned: 'isBanned' in chat ? chat.isBanned : false,
        welcome: 'welcome' in chat ? chat.welcome : true,
      });

    } catch (e) { console.error(e); }

    if (typeof m.text !== "string") m.text = "";
    if (m.isBaileys) return;

    // ========== BIENVENIDA Y DESPEDIDA (MEJORADO) ==========
    try {
      // Verificar que sea un evento de grupo (entrada o salida)
      if (m.messageStubType && m.isGroup) {
        
        // BIENVENIDA - Alguien entra al grupo (stubType = 1)
        if (m.messageStubType === 1) {
          const participants = m.messageStubParameters || []
          if (participants.length > 0) {
            const groupMetadata = await this.groupMetadata(m.chat).catch(() => null)
            if (groupMetadata) {
              for (let participant of participants) {
                const userName = await this.getName(participant).catch(() => 'Guerrero')
                const userNumber = participant.split('@')[0]
                const totalMembers = groupMetadata.participants.length
                
                let welcomeText = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
                welcomeText += `> 🌿 *BIENVENIDO AL REINO* 🌿\n`
                welcomeText += `> ⚔️ @${userNumber}\n`
                welcomeText += `> 📛 *Nombre:* ${userName}\n`
                welcomeText += `> 👥 *Miembros:* ${totalMembers}\n\n`
                welcomeText += `✦ 𝗥𝗘𝗚𝗟𝗔𝗦 𝗗𝗘𝗟 𝗥𝗘𝗜𝗡𝗢 ✦\n`
                welcomeText += `> 1️⃣ Respeta a todos\n`
                welcomeText += `> 2️⃣ No enviar spam\n`
                welcomeText += `> 3️⃣ Prohibido +18\n\n`
                welcomeText += `✦ 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦 ✦\n`
                welcomeText += `> 🔖 #menu - Ver menú\n`
                welcomeText += `> 🔖 #perfil - Ver stats\n`
                welcomeText += `> 🔖 #daily - Recompensa diaria\n\n`
                welcomeText += `⧼⋆꙳•〔 🛸 𝗕𝗔𝗟𝗗𝗪𝗜𝗡𝗗 𝗜𝗩 〕⋆꙳•⧽\n`
                welcomeText += `> 👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*\n`
                welcomeText += `╰⋆꙳•❅‧*₊⋆꙳︎‧*❆₊⋆╯\n`
                welcomeText += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
                
                await this.sendMessage(m.chat, { text: welcomeText, mentions: [participant] })
              }
            }
          }
        }
        
        // DESPEDIDA - Alguien sale del grupo (stubType = 2)
        if (m.messageStubType === 2) {
          const participants = m.messageStubParameters || []
          if (participants.length > 0) {
            const groupMetadata = await this.groupMetadata(m.chat).catch(() => null)
            if (groupMetadata) {
              for (let participant of participants) {
                const userName = await this.getName(participant).catch(() => 'Guerrero')
                const userNumber = participant.split('@')[0]
                
                let goodbyeText = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
                goodbyeText += `> 🕯️ *UN GUERRERO HA PARTIDO* 🕯️\n`
                goodbyeText += `> ⚔️ @${userNumber}\n`
                goodbyeText += `> 📛 *Nombre:* ${userName}\n\n`
                goodbyeText += `> 🌿 *Que el maná te guíe en tu camino...*\n\n`
                goodbyeText += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
                
                await this.sendMessage(m.chat, { text: goodbyeText, mentions: [participant] })
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Error en welcome/goodbye:', err)
    }
// ========== PROCESAR COMANDOS (SIN PREFIJO) ==========
m.exp += Math.ceil(Math.random() * 10);
let usedPrefix;
let _user = global.db.data.users[m.sender];

// Definir prefijo vacío (acepta cualquier texto como comando)
global.prefix = /^/;

const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins');
for (let name in global.plugins) {
  let plugin = global.plugins[name];
  if (!plugin || plugin.disabled) continue;
  const __filename = join(___dirname, name);

  if (typeof plugin.all === 'function') await plugin.all.call(this, m, { chatUpdate, __dirname: ___dirname, __filename }).catch(console.error);

  const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  let _prefix = plugin.customPrefix || this.prefix || global.prefix;
  let match = (_prefix instanceof RegExp ? [[_prefix.exec(m.text), _prefix]] :
    Array.isArray(_prefix) ? _prefix.map(p => [p instanceof RegExp ? p.exec(m.text) : new RegExp(str2Regex(p)).exec(m.text), p instanceof RegExp ? p : new RegExp(str2Regex(p))]) :
    [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]]
  ).find(p => p[1]);

  if (typeof plugin.before === 'function' && await plugin.before.call(this, m, { match, conn: this, chatUpdate, __dirname: ___dirname, __filename })) continue;
  if (typeof plugin !== 'function') continue;

  if ((usedPrefix = (match[0] || '')[0]) || true) { // <-- MODIFICADO: siempre entra
    let noPrefix = m.text;
    let [command, ...args] = noPrefix.trim().split` `.filter(Boolean);
    args = args || [];
    let _args = noPrefix.trim().split` `.slice(1);
    let text = _args.join` `;
    command = (command || '').toLowerCase();
    let isAccept = plugin.command instanceof RegExp ? plugin.command.test(command) :
      Array.isArray(plugin.command) ? plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(command) : cmd === command) :
      plugin.command === command;

    if (!isAccept) continue;
    if (plugin.register && !_user.registered) {
      m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 📜 *NO REGISTRADO*\n\n> 📌 Usa *#registrar Nombre.Edad*\n> 🎯 *Ejemplo:* #registrar Lyonn.17\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`);
      continue;
    }

    m.isCommand = true;
    let extra = { match, usedPrefix, noPrefix, _args, args, command, text, conn: this, chatUpdate, __dirname: ___dirname, __filename };
    try {
      await plugin.call(this, m, extra);
    } catch (e) {
      m.error = e;
      m.reply(format(e));
    }
    break;
  }
}


  } catch (e) { console.error(e); } finally {
    if (m && global.db.data.users[m.sender]) {
      let utente = global.db.data.users[m.sender];
      utente.exp += m.exp || 0;
      utente.monedas -= m.monedas || 0;
    }
    if (opts['autoread']) await this.readMessages([m.key]);
  }
}

// ========== MENSAJES DE ERROR ==========
global.dfail = (type, m, conn, usedPrefix) => {
  const msg = {
    rowner: `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🛑 *ACCESO RESTRINGIDO*\n\n> 👑 Solo el *Creador Supremo* puede ejecutar este comando.\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`,
    owner: `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ⚙️🔒 *MÓDULO BLOQUEADO*\n\n> 📌 Solo el *Dueño del Bot* puede usar este comando.\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`,
    premium: `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 💎 *REQUIERE PREMIUM*\n\n> 📌 Este comando es exclusivo para usuarios *Premium*.\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`,
    private: `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🔒 *SOLO CHAT PRIVADO*\n\n> 📌 Este comando solo funciona en chats privados.\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`,
    group: `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 👥 *SOLO GRUPOS*\n\n> 📌 Este comando solo funciona en grupos.\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`,
    admin: `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🛡️ *FUNCIÓN RESTRINGIDA*\n\n> 📌 Solo los *Administradores del Grupo* pueden usar este comando.\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`,
    botAdmin: `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🤖 *BOT NO ES ADMIN*\n\n> 📌 El bot necesita ser *Administrador del Grupo* para usar este comando.\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`,
    unreg: `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 📜 *NO REGISTRADO*\n\n> 📌 Usa *#registrar Nombre.Edad* para registrarte.\n> 🎯 *Ejemplo:* #registrar Lyonn.17\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`,
    mods: `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🛡️ *ACCESO RESTRINGIDO*\n\n> 📌 Solo los *Moderadores* pueden usar este comando.\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`
  };
  if (msg[type]) return m.reply(msg[type]).then(() => m.react('❌'));
};

let file = global.__filename(import.meta.url, true);
watchFile(file, async () => {
  unwatchFile(file);
  console.log(chalk.magenta("🔄 Se actualizó 'handler.js'"));
  if (global.conns && global.conns.length > 0) {
    const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
    for (const userr of users) {
      userr.subreloadHandler(false);
    }
  }
});