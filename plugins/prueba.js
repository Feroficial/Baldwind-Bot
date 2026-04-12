let handler = async (m, { conn }) => {
  const chat = global.db.data.chats[m.chat];
  m.reply(`*ESTADO DEL WELCOME*\n\n> Activado: ${chat?.welcome ? '✅ SI' : '❌ NO'}\n> Grupo: ${m.isGroup ? 'SI' : 'NO'}\n> Evento detectado: ${m.message?.groupParticipantUpdate ? 'SI ✅' : 'NO ❌'}`);
}

handler.command = /^(testwelcome|checkwelcome)$/i;
export default handler;