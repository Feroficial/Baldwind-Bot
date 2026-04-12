let handler = async (m, { text, usedPrefix, isAdmin, isROwner, isOwner }) => {
  if (!m.isGroup) return m.reply('❌ Solo en grupos');
  if (!isAdmin && !isROwner && !isOwner) return m.reply('❌ Solo administradores');

  const chat = global.db.data.chats[m.chat];
  
  if (!text) {
    return m.reply(`*SET WELCOME*\n\nUso: ${usedPrefix}setwelcome <mensaje>\n\nVariables: @user, @level, @role, @count, @group`);
  }

  if (text.toLowerCase() === 'default') {
    chat.welcomeMessage = null;
    m.reply('✅ Mensaje restablecido');
  } else {
    chat.welcomeMessage = text;
    m.reply(`✅ Mensaje guardado`);
  }
};

handler.command = /^(setwelcome|setbienvenida)$/i;
handler.group = true;
export default handler;