let handler = async (m, { conn, text, usedPrefix, isAdmin, isROwner, isOwner }) => {
  if (!m.isGroup) return m.reply('❌ Solo en grupos');
  if (!isAdmin && !isROwner && !isOwner) return m.reply('❌ Solo administradores');

  const chat = global.db.data.chats[m.chat];
  
  if (!text) {
    return m.reply(`—͟͟͞͞   *🜸 SET WELCOME 🜸* —͟͟͞͞

> 📌 *Uso:* ${usedPrefix}setwelcome <mensaje>

> 📝 *Variables disponibles:*
> @user - Nombre del usuario
> @level - Nivel del usuario
> @role - Rol del usuario
> @count - Total de miembros
> @group - Nombre del grupo

> 📌 *Ejemplo:*
${usedPrefix}setwelcome 👋 Bienvenido @user al grupo @group

> 📌 *Restablecer a mensaje por defecto:*
${usedPrefix}setwelcome default`);
  }

  if (text.toLowerCase() === 'default') {
    chat.welcomeMessage = null;
    m.reply('✅ *Mensaje de bienvenida restablecido al predeterminado*');
  } else {
    chat.welcomeMessage = text;
    m.reply(`✅ *Mensaje de bienvenida actualizado*\n\n> Nuevo mensaje:\n${text}`);
  }
};

handler.help = ['setwelcome'];
handler.tags = ['group'];
handler.command = /^(setwelcome|setbienvenida)$/i;
handler.group = true;

export default handler;