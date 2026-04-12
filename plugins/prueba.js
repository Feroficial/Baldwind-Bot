// plugins/debugfinal.js
let handler = async (m, { conn }) => {
  let text = `📊 *DEBUG FINAL - CORRE ESTO CUANDO ALGUIEN ENTRE*\n\n`;
  
  // Mostrar TODAS las keys del mensaje
  text += `📦 *TODAS LAS KEYS:*\n`;
  if (m.message) {
    const todasLasKeys = Object.keys(m.message);
    text += `${todasLasKeys.join(', ')}\n\n`;
  }
  
  // Mostrar el mensaje completo (formateado)
  text += `📄 *MENSAJE COMPLETO:*\n`;
  text += `\`\`\`${JSON.stringify(m.message, null, 2).slice(0, 1000)}\`\`\`\n\n`;
  
  // Verificar específicamente groupParticipantUpdate
  if (m.message?.groupParticipantUpdate) {
    text += `✅ *groupParticipantUpdate DETECTADO!*\n`;
    text += `Action: ${m.message.groupParticipantUpdate.action}\n`;
    text += `Participants: ${JSON.stringify(m.message.groupParticipantUpdate.participants)}\n`;
  } else {
    text += `❌ No hay groupParticipantUpdate\n`;
  }
  
  // Verificar protocolMessage
  if (m.message?.protocolMessage) {
    text += `✅ *protocolMessage DETECTADO!*\n`;
    text += `Type: ${m.message.protocolMessage.type}\n`;
  }
  
  await m.reply(text);
}

handler.command = /^(debugfinal|df)$/i;
export default handler;