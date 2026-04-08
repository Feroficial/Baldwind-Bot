// ⚔️ Código creado por DEVLYONN 👑
// 🛡️ BALDWIND IV - YOUTUBE DOWNLOADER

import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 📜 *YOUTUBE DOWNLOADER*\n> 📌 *Ejemplo:* ${usedPrefix + command} Bad Bunny\n> 👑 *Creador:* DEVLYONN`)

    await m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🔍 *BUSCANDO VIDEO*\n> 📝 *Consulta:* ${text}\n> ⏳ *Esto puede tomar unos segundos...*`)

    try {
        // 1. BUSCAR VIDEO (solo 1)
        const searchUrl = `https://dv-yer-api.online/ytsearch?q=${encodeURIComponent(text)}&limit=1`
        const searchRes = await fetch(searchUrl)
        const searchData = await searchRes.json()

        if (!searchData.ok || !searchData.results || searchData.results.length === 0) {
            return m.reply(`❌ *No se encontraron resultados para:* ${text}`)
        }

        const video = searchData.results[0]
        
        let info = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
        info += `> 🎬 *VIDEO ENCONTRADO*\n`
        info += `> 📝 *Título:* ${video.title.substring(0, 50)}...\n`
        info += `> 📺 *Canal:* ${video.channel}\n`
        info += `> ⏱️ *Duración:* ${formatDuration(video.duration_seconds)}\n\n`
        info += `> 📥 *Descargando...*`
        
        await conn.sendMessage(m.chat, { text: info }, { quoted: m })

        // 2. OBTENER ENLACE DE DESCARGA
        const downloadApi = `https://dv-yer-api.online/ytdlmp4?mode=link&url=${encodeURIComponent(video.url)}&quality=360p&fast=false`
        const downloadRes = await fetch(downloadApi)
        const downloadData = await downloadRes.json()

        if (!downloadData.ok) {
            return m.reply(`❌ *Error en la API:* ${downloadData.message || 'No se pudo obtener el video'}`)
        }

        let videoUrl = downloadData.download_url_full
        if (!videoUrl) {
            return m.reply(`❌ *Error:* No se encontró enlace de descarga`)
        }

        // 3. DESCARGAR VIDEO
        const videoBuffer = await downloadWithRedirect(videoUrl)
        
        if (!videoBuffer || videoBuffer.length < 10000) {
            return m.reply(`❌ *Error:* Archivo descargado inválido`)
        }
        
        const MAX_SIZE = 200 * 1024 * 1024
        const isOverSize = videoBuffer.length > MAX_SIZE
        const sizeMB = (videoBuffer.length / (1024 * 1024)).toFixed(2)
        
        let thumbnailBuffer = null
        try {
            if (video.thumbnail) {
                const thumbRes = await fetch(video.thumbnail)
                if (thumbRes.ok) thumbnailBuffer = Buffer.from(await thumbRes.arrayBuffer())
            }
        } catch (e) {}
        
        const duration = formatDuration(video.duration_seconds)
        const quality = downloadData.quality || '360p'
        
        let caption = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
        caption += `> 🎬 *${(downloadData.title || video.title).substring(0, 45)}*\n\n`
        caption += `✦ 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗜𝗢́𝗡 ✦\n`
        caption += `> ⏱️ *Duración:* ${downloadData.duration || duration}\n`
        caption += `> 📺 *Calidad:* ${quality}\n`
        caption += `> 📦 *Tamaño:* ${sizeMB} MB\n`
        caption += `> 📺 *Canal:* ${video.channel}\n`
        caption += `> 📅 *Publicado:* ${video.upload_date}\n\n`
        caption += `✦ 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔 ✦\n`
        caption += `> 👑 *DEVLYONN*\n`
        caption += `> 🛸 *BALDWIND IV*\n\n`
        caption += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
        
        // SIN contextInfo - NO hay botón "Ver canal"
        if (isOverSize) {
            await conn.sendMessage(m.chat, {
                document: videoBuffer,
                mimetype: 'video/mp4',
                fileName: downloadData.filename || `video.mp4`,
                caption: caption + `\n\n📌 *Enviado como documento (supera 200MB)*`
            }, { quoted: m })
        } else {
            await conn.sendMessage(m.chat, {
                video: videoBuffer,
                caption: caption,
                mimetype: 'video/mp4'
            }, { quoted: m })
        }
        
        await m.reply(`✅ *Descarga completada!*`)

    } catch (error) {
        console.error('Error:', error)
        m.reply(`⚠️ *Error:* ${error.message || "Error al buscar video"}\n\n🛸 *BALDWIND IV*`)
    }
}

async function downloadWithRedirect(url, maxRedirects = 5) {
    let currentUrl = url
    for (let i = 0; i < maxRedirects; i++) {
        const res = await fetch(currentUrl, {
            method: 'GET',
            redirect: 'manual',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        })
        
        if (res.status === 301 || res.status === 302 || res.status === 307 || res.status === 308) {
            const location = res.headers.get('location')
            if (!location) throw new Error('Redirección sin ubicación')
            currentUrl = location.startsWith('http') ? location : new URL(location, currentUrl).href
            continue
        }
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return Buffer.from(await res.arrayBuffer())
    }
    throw new Error('Demasiadas redirecciones')
}

handler.help = ['yt <búsqueda>']
handler.tags = ['downloader']
handler.command = ['yt', 'youtube', 'ytdl']
handler.register = false

export default handler

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