let handler = async (m, { conn, args, isROwner, isAdmin, isOwner }) => {
  // Solo admins y el owner pueden usar este comando
  if (!isAdmin && !isROwner && !isOwner) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🛡️ *ACCESO RESTRINGIDO*\n\n> 📌 Solo los *Administradores del Grupo* pueden usar este comando.\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`);
  }
  
  if (!m.isGroup) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 👥 *SOLO GRUPOS*\n\n> 📌 Este comando solo funciona en grupos.\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`);
  }
  
  const chat = global.db.data.chats[m.chat];
  
  // Si no hay argumentos, mostrar estado actual
  if (args.length === 0) {
    const estado = chat.welcome ? '✅ ACTIVADO' : '❌ DESACTIVADO';
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n\n> 🎉 *SISTEMA DE BIENVENIDA*\n\n> 📊 *Estado actual:* ${estado}\n\n> 📌 *Comandos disponibles:*\n> • *${usedPrefix}welcome on* - Activar bienvenidas\n> • *${usedPrefix}welcome off* - Desactivar bienvenidas\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`);
  }
  
  const action = args[0].toLowerCase();
  
  if (action === 'on') {
    chat.welcome = true;
    m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n\n> ✅ *BIENVENIDA ACTIVADA*\n\n> 🎉 Los nuevos miembros recibirán un mensaje de bienvenida personalizado.\n> 💰 *Bonus:* +50 monedas y +100 EXP al unirse.\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`);
  } 
  else if (action === 'off') {
    chat.welcome = false;
    m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n\n> ❌ *BIENVENIDA DESACTIVADA*\n\n> 📌 Los nuevos miembros ya no recibirán mensajes de bienvenida.\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`);
  }
  else {
    m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n\n> ⚠️ *OPCIÓN INVÁLIDA*\n\n> 📌 Usa *on* o *off*\n> • *${usedPrefix}welcome on* - Activar\n> • *${usedPrefix}welcome off* - Desactivar\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`);
  }
};

handler.help = ['welcome <on/off>'];
handler.tags = ['group'];
handler.command = /^(welcome|bienvenida)$/i;
handler.group = true;
handler.admin = true;

export default handler;