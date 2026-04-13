let handler = async (m, { conn, text, isAdmin, isROwner, isOwner }) => {
    if (!m.isGroup) return m.reply('❌ Solo en grupos');
    if (!isAdmin && !isROwner && !isOwner) return m.reply('❌ Solo administradores');
    
    if (!text) return m.reply('📌 *Uso:* #setgroupicon <URL de la imagen>\n\nEjemplo:\n#setgroupicon https://files.catbox.moe/xdpxey.jpg');
    
    await m.reply('⏳ *Cambiando foto del grupo...*');
    
    try {
        const imgRes = await fetch(text);
        if (imgRes.ok) {
            const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
            await conn.updateProfilePicture(m.chat, imgBuffer);
            m.reply('✅ *FOTO DEL GRUPO ACTUALIZADA*');
        } else {
            m.reply('❌ *Error al descargar la imagen*');
        }
    } catch (e) {
        m.reply(`❌ *Error:* ${e.message}`);
    }
}

handler.command = /^(setgroupicon|setfotogrupo|cambiarfoto)$/i;
handler.group = true;
export default handler;