// ⚔️ Código creado por DEVLYONN 👑
// 🛡️ BALDWIND IV - YOUTUBE AUDIO DOWNLOADER

import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🎵 *YOUTUBE AUDIO*\n> 📌 *Ejemplo:* ${usedPrefix + command} Bad Bunny\n> 👑 *Creador:* DEVLYONN`)

    await m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🔍 *BUSCANDO AUDIO*\n> 📝 *Consulta:* ${text}\n> ⏳ *Esto puede tomar unos segundos...*`)

    try {
        // 1. BUSCAR AUDIO (solo 1)
        const searchUrl = `https://dv-yer-api.online/ytsearch?q=${encodeURIComponent(text)}&limit=1`
        const searchRes = await fetch(searchUrl)
        const searchData = await searchRes.json()

        if (!searchData.ok || !searchData.results || searchData.results.length === 0) {
            return m.reply(`❌ *No se encontraron resultados para:* ${text}`)
        }

        const video = searchData.results[0]
        
        let info = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
        info += `> 🎵 *AUDIO ENCONTRADO*\n`
        info += `> 📝 *Título:* ${video.title.substring(0, 50)}...\n`
        info += `> 📺 *Canal:* ${video.channel}\n`
        info += `> ⏱️ *Duración:* ${formatDuration(video.duration_seconds)}\n\n`
        info += `> 📥 *Descargando...*`
        
        await conn.sendMessage(m.chat, { text: info }, { quoted: m })

        // 2. DESCARGAR AUDIO
        const downloadApi = `https://dv-yer-api.online/ytmp3?mode=link&url=${encodeURIComponent(video.url)}&quality=128k`
        const downloadRes = await fetch(downloadApi)
        const downloadData = await downloadRes.json()
        
        if (!downloadData.ok || !downloadData.url) {
            return m.reply(`❌ *Error al descargar:* ${video.title}`)
        }
        
        // Construir URL completa
        const audioUrl = `https://dv-yer-api.online${downloadData.url}`
        let audioBuffer = await fetchBuffer(audioUrl)
        
        // Verificar tamaño (200MB)
        const MAX_SIZE = 200 * 1024 * 1024
        const isOverSize = audioBuffer.length > MAX_SIZE
        const sizeMB = (audioBuffer.length / (1024 * 1024)).toFixed(2)
        
        // Descargar miniatura
        let thumbnailBuffer = null
        try {
            thumbnailBuffer = await fetchBuffer(video.thumbnail)
        } catch (e) {}
        
        const duration = formatDuration(video.duration_seconds)
        const quality = downloadData.quality || '128k'
        
        let caption = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
        caption += `> 🎵 *${(downloadData.title || video.title).substring(0, 45)}*\n\n`
        caption += `✦ 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗜𝗢́𝗡 ✦\n`
        caption += `> ⏱️ *Duración:* ${downloadData.duration || duration}\n`
        caption += `> 🎧 *Calidad:* ${quality}\n`
        caption += `> 📦 *Tamaño:* ${sizeMB} MB\n`
        caption += `> 📺 *Canal:* ${video.channel}\n`
        caption += `> 📅 *Publicado:* ${video.upload_date}\n\n`
        caption += `✦ 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔 ✦\n`
        caption += `> 👑 *DEVLYONN*\n`
        caption += `> 🛸 *BALDWIND IV*\n\n`
        caption += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
        
        if (isOverSize) {
            await conn.sendMessage(m.chat, {
                document: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: downloadData.filename || `${video.title}.mp3`,
                caption: caption + `\n\n📌 *Enviado como documento (supera 200MB)*`
            }, { quoted: m })
        } else {
            await conn.sendMessage(m.chat, {
                audio: audioBuffer,
                caption: caption,
                mimetype: 'audio/mpeg',
                fileName: downloadData.filename || `${video.title}.mp3`,
                contextInfo: {
                    externalAdReply: {
                        title: (video.title || "Audio").substring(0, 45),
                        body: `🎧 ${video.channel} • ${duration}`,
                        thumbnail: thumbnailBuffer,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: m })
        }
        
        await m.reply(`✅ *Descarga completada!*`)

    } catch (error) {
        console.error('Error:', error)
        m.reply(`⚠️ *Error:* ${error.message || "Error al buscar audio"}\n\n🛸 *BALDWIND IV*`)
    }
}

handler.help = ['play <búsqueda>']
handler.tags = ['downloader']
handler.command = ['play', 'ytmp3', 'ytaudio', 'mp3', 'audio']
handler.register = false

export default handler

async function fetchBuffer(url) {
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return Buffer.from(await res.arrayBuffer())
}

function formatDuration(seconds) {
    if (!seconds) return 'Desconocido'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
}