import './settings.js';
import fs from 'fs';
import os from 'os';
import util from 'util';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import yts from 'yt-search';
import fetch from 'node-fetch';
import { Chess } from 'chess.js';
import { fileURLToPath } from 'url';
import FormData from 'form-data';
import webp from 'node-webpmux';
import { createRequire } from 'module';
import speed from 'performance-now';
import moment from 'moment-timezone';
import { performance } from 'perf_hooks';
import { parsePhoneNumber } from 'awesome-phonenumber';
import { exec, spawn, execSync } from 'child_process';
import { generateWAMessageContent, jidNormalizedUser, getContentType } from 'baileys';

import 'moment/min/locales.js';
import { UguuSe } from './lib/uploader.js';
import TicTacToe from './lib/tictactoe.js';
import { antiSpam } from './src/antispam.js';
import { ytMp4, ytMp3 } from './lib/scraper.js';
import templateMenu from './lib/template_menu.js';
import { toAudio, toPTT } from './lib/converter.js';
import { GroupUpdate, LoadDataBase } from './src/message.js';
import { JadiBot, StopJadiBot, ListJadiBot } from './src/jadibot.js';
import { cmdAdd, cmdAddHit, addExpired, getPosition, getExpired, getStatus, checkStatus } from './src/database.js';
import { rdGame, iGame, gameSlot, gameCasinoSolo, gameSamgongSolo, gameMerampok, gameBegal, daily, buy, setLimit, addLimit, addMoney, setMoney, transfer, Blackjack, SnakeLadder } from './lib/game.js';
import { getRandom, getBuffer, fetchJson, runtime, clockString, sleep, isUrl, formatDate, formatp, generateProfilePicture, errorCache, normalize, runUpdate, updateSettings, parseMention, fixBytes, similarity, pickRandom, encodeToLetters, tarBackup } from './lib/function.js';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const locales = moment.locales();
const timez = moment.tz.names();
const menfesTimeouts = new Map();
const settingsPath = path.join(__dirname, 'settings.js');
let canvasModule = null;

/*
	* Create By Naze
	* Follow https://github.com/nazedev
	* Whatsapp : https://whatsapp.com/channel/0029VaWOkNm7DAWtkvkJBK43
*/

try {
	canvasModule = await import('@napi-rs/canvas');
	canvasModule.GlobalFonts.registerFromPath('./src/nulis/font/Indie-Flower.ttf', 'Indie Flower');
	console.log(chalk.yellowBright('[SYSTEM] Fast Mode (Canvas) Active 🚀'));
} catch (error) {
	console.log(chalk.yellowBright('[SYSTEM] Canvas not found. Fallback Imagemagick Active 🐢'));
}

const fileContent = fs.readFileSync(__filename, 'utf-8');
const casesArray = [...fileContent.matchAll(/case\s+['"]([^'"]+)['"]/g)].map(match => match[1]);

const naze = async (naze, m, msg, store) => {
	if (!global.db) global.db = {};
	global.db.cases = global.db.cases || casesArray;
	const cases = global.db.cases;

	await LoadDataBase(naze, m);
	
	const botNumber = naze.decodeJid(naze.user.id);
	
	// Read Database
	const sewa = db.sewa
	const premium = db.premium
	const set = db.set[botNumber]
	
	// Database Game
	let suit = db.game.suit
	let chess = db.game.chess
	let chat_ai = db.game.chat_ai
	let menfes = db.game.menfes
	let tekateki = db.game.tekateki
	let tictactoe = db.game.tictactoe
	let tebaklirik = db.game.tebaklirik
	let kuismath = db.game.kuismath
	let blackjack = db.game.blackjack
	let tebaklagu = db.game.tebaklagu
	let tebakkata = db.game.tebakkata
	let family100 = db.game.family100
	let susunkata = db.game.susunkata
	let tebakbom = db.game.tebakbom
	let ulartangga = db.game.ulartangga
	let tebakkimia = db.game.tebakkimia
	let caklontong = db.game.caklontong
	let tebakangka = db.game.tebakangka
	let tebaknegara = db.game.tebaknegara
	let tebakgambar = db.game.tebakgambar
	let tebakbendera = db.game.tebakbendera
	
	const ownerNumber = set.owner = [...new Set([...global.owner, botNumber.split('@')[0], ...set?.owner || []])];
	
	try {
		await GroupUpdate(naze, m, store);
		
		const body = ((m.type === 'conversation') ? m.message.conversation :
		(m.type == 'imageMessage') ? m.message.imageMessage.caption :
		(m.type == 'videoMessage') ? m.message.videoMessage.caption :
		(m.type == 'extendedTextMessage') ? m.message.extendedTextMessage.text :
		(m.type == 'reactionMessage') ? m.message.reactionMessage.text :
		(m.type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId :
		(m.type == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
		(m.type == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId :
		(m.type == 'interactiveResponseMessage'  && m.quoted) ? (m.message.interactiveResponseMessage?.nativeFlowResponseMessage ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : '') :
		(m.type == 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || '') :
		(m.type == 'editedMessage') ? (m.message.editedMessage?.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text || m.message.editedMessage?.message?.protocolMessage?.editedMessage?.conversation || '') :
		(m.type == 'protocolMessage') ? (m.message.protocolMessage?.editedMessage?.extendedTextMessage?.text || m.message.protocolMessage?.editedMessage?.conversation || m.message.protocolMessage?.editedMessage?.imageMessage?.caption || m.message.protocolMessage?.editedMessage?.videoMessage?.caption || '') : '') || '';
		
		const budy = (typeof m.text == 'string' ? m.text : '')
		const isCreator = global.isOwner = ownerNumber.some(owner => {
			const ownerJid = owner.includes('@') ? owner : owner + '@s.whatsapp.net';
			const findJid = naze.findJidByLid(jidNormalizedUser(ownerJid), store, true);
			if (!findJid) return false
			return findJid === m.sender
		});
		const symbolMatch = body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@()#,'"*+÷/\%^&.©^]/gi);
		const emojiMatch = body.match(/^[\uD800-\uDBFF][\uDC00-\uDFFF]/gi); 
		const listMatch = global.listprefix.find(a => body?.startsWith(a));
		const detectedPrefix = symbolMatch ? symbolMatch[0] : (emojiMatch ? emojiMatch[0] : listMatch);
		const prefix = isCreator ? (detectedPrefix || set.authorPrefix) : set.multiprefix ? (detectedPrefix || '¿') : (listMatch || '¿');
		const isCmd = body.startsWith(prefix)
		const args = body.trim().split(/ +/).slice(1)
		const quoted = m.quoted ? m.quoted : m
		const command = isCmd ? body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() : '';
		const text = global.q = args.join(' ');
		const mime = (quoted.msg || quoted).mimetype || ''
		const qmsg = (quoted.msg || quoted)
		const author = set.author = global.author || 'Nazedev';
		const packname = set.packname = global.packname || 'Bot WhatsApp';
		const botname = set.botname = global.botname || 'Hitori Bot';
		const badWordsLower = global.badWords.map(v => v.toLowerCase());
		const locale_day = moment.tz(global.timezone).locale(global.locale).format('dddd');
		const date = moment.tz(global.timezone).locale(global.locale).format('DD/MM/YYYY');
		const date_time = moment.tz(global.timezone).locale(global.locale).format('HH:mm:ss');
		const ucapanWaktu = date_time < '05:00:00' ? 'Selamat Pagi 🌉' : date_time < '11:00:00' ? 'Selamat Pagi 🌄' : date_time < '15:00:00' ? 'Selamat Siang 🏙' : date_time < '18:00:00' ? 'Selamat Sore 🌅' : date_time < '19:00:00' ? 'Selamat Sore 🌃' : date_time < '23:59:00' ? 'Selamat Malam 🌌' : 'Selamat Malam 🌌';
		const almost = 0.66
		const time = Date.now()
		const time_now = new Date()
		const time_end = 60000 - (time_now.getSeconds() * 1000 + time_now.getMilliseconds());
		const readmore = String.fromCharCode(8206).repeat(999)
		const setv = pickRandom(global.listv)
		
		const isVip = isCreator || (db.users[m.sender] ? db.users[m.sender].vip : false)
		const isBan = isCreator || (db.users[m.sender] ? db.users[m.sender].ban : false)
		const isLimit = isCreator || (db.users[m.sender] ? (db.users[m.sender].limit > 0) : false)
		const isPremium = isCreator || checkStatus(m.sender, premium) || false
		const isNsfw = m.isGroup ? db.groups[m.chat].nsfw : false
		
		// Fake
		const fkontak = {
			key: {
				remoteJid: '0@s.whatsapp.net',
				participant: '0@s.whatsapp.net',
				fromMe: false,
				id: 'Naze'
			},
			message: {
				contactMessage: {
					displayName: (m.pushName || author),
					vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${m.pushName || author},;;;\nFN:${m.pushName || author}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
					sendEphemeral: true
				}
			}
		}
		
		// Auto Set Bio
		if (set.autobio) {
			if (new Date() * 1 - set.status > 60000) {
				await naze.updateProfileStatus(`${naze.user.name} | 🎯 Runtime : ${runtime(process.uptime())}`).catch(e => {})
				set.status = new Date() * 1
			}
		}
		
		// Set Mode
		if (!isCreator) {
			if ((set.grouponly === set.privateonly)) {
				if (!naze.public && !m.key.fromMe) return
			} else if (set.grouponly) {
				if (!m.isGroup) return
			} else if (set.privateonly) {
				if (m.isGroup) return
			}

			// Whitelist Chats
			if (set.whitelistonly && naze.public && set.whitelist.length > 0 && !set.whitelist.includes(m.chat)) return
		}
		
		// Auto Read
		if (m.message && m.key.remoteJid !== 'status@broadcast') {
			if ((set.autoread && naze.public) || isCreator) {
				naze.readMessages([m.key]);
				if (set.log) console.log(chalk.black(chalk.whiteBright('[CHAT]:'), chalk.greenBright(`${locale_day} ${date} (${date_time})`), chalk.hex('#AF26EB')(m.key.id) + '\n' + chalk.hex('#00EAD3')(budy || m.type) + '\n' + chalk.cyanBright('[FROM]:'), chalk.yellowBright(m.pushName || (isCreator ? 'Bot' : 'Anonim')), chalk.hex('#FF449F')(m.sender.split('@')[0]), chalk.hex('#FF5700')(m.isGroup ? m.metadata.subject : m.chat.endsWith('@newsletter') ? 'Newsletter' : 'Private Chat'), chalk.blueBright('(' + m.chat + ')')));
				else console.log(chalk.black(chalk.bgWhite('[CHAT]:'), chalk.bgGreen(`${locale_day} ${date} (${date_time})`), chalk.bgHex('#AF26EB')(m.key.id) + '\n' + chalk.bgHex('#00EAD3')(budy || m.type) + '\n' + chalk.bgCyanBright('[FROM]:'), chalk.bgYellow(m.pushName || (isCreator ? 'Bot' : 'Anonim')), chalk.bgHex('#FF449F')(m.sender), chalk.bgHex('#FF5700')(m.isGroup ? m.metadata.subject : m.chat.endsWith('@newsletter') ? 'Newsletter' : 'Private Chat'), chalk.bgBlue('(' + m.chat + ')')));
			}
		}
		
		// Group Settings
		if (m.isGroup) {
			// Mute
			if (db.groups[m.chat].mute && !isCreator) {
				return
			}
			
			// Anti Hidetag
			if (!m.key.fromMe && m.mentionedJid?.length === m.metadata.participants?.length && db.groups[m.chat].antihidetag && !isCreator && m.isBotAdmin && !m.isAdmin) {
				await naze.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
				await m.reply('*Anti Hidetag Sedang Aktif❗*')
			}
			
	
		// Salam
		if (/^a(s|ss)alamu('|)alaikum(| )(wr|)( |)(wb|)$/.test(budy?.toLowerCase())) {
			const jwb_salam = ['Wa\'alaikumusalam','Wa\'alaikumusalam wr wb','Wa\'alaikumusalam Warohmatulahi Wabarokatuh']
			m.reply(pickRandom(jwb_salam))
		}
		
		
			case 'addprefix': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text
					await updateSettings({
						filePath: settingsPath,
						addPrefix: teksnya.trim()
					});
					m.reply(global.mess.done)
				} else m.reply(`Example: ${prefix + command} textnya`)
			}
			break
			case 'delprefix': case 'removeprefix': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text
					await updateSettings({
						filePath: settingsPath,
						removePrefix: teksnya.trim()
					});
					m.reply(global.mess.done)
				} else m.reply(`Example: ${prefix + command} textnya`)
			}
			break
			case 'listprefix': {
				if (!isCreator) return m.reply(global.mess.owner)
				m.reply('List Prefix :\n' + global.listprefix.map(a => '- ' + a).join('\n'));
			}
			break

			case 'join': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (!text) return m.reply('Masukkan Link Group!')
				if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) return m.reply('Link Invalid!')
				const result = args[0].match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/)
				if (!result) return m.reply('Link Invalid❗')
				m.reply(global.mess.wait)
				await naze.groupAcceptInvite(result[1]).catch((res) => {
					if (res.data == 400) return m.reply('Grup Tidak Di Temukan❗');
					if (res.data == 401) return m.reply('Bot Di Kick Dari Grup Tersebut❗');
					if (res.data == 409) return m.reply('Bot Sudah Join Di Grup Tersebut❗');
					if (res.data == 410) return m.reply('Url Grup Telah Di Setel Ulang❗');
					if (res.data == 500) return m.reply('Grup Penuh❗');
				})
			}
			break
			case 'leave': {
				if (!isCreator) return m.reply(global.mess.owner)
				await naze.groupLeave(m.chat).then(() => naze.sendFromOwner(ownerNumber, 'Sukses Keluar Dari Grup', m, { contextInfo: { isForwarded: true }})).catch(e => {});
			}
			break
						case 'blokir': case 'block': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (text || m.quoted) {
					const numbersOnly = m.isGroup ? (text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender) : m.chat
					await naze.updateBlockStatus(numbersOnly, 'block').then((a) => m.reply(global.mess.done)).catch((err) => m.reply(global.mess.fail))
				} else m.reply(`Example: ${prefix + command} 62xxx`)
			}
			break
			case 'listblock': {
				let anu = await naze.fetchBlocklist()
				m.reply(`Total Block : ${anu.length}\n` + anu.map(v => '• ' + v.replace(/@.+/, '')).join`\n`)
			}
			break
			case 'openblokir': case 'unblokir': case 'openblock': case 'unblock': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (text || m.quoted) {
					const numbersOnly = m.isGroup ? (text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender) : m.chat
					await naze.updateBlockStatus(numbersOnly, 'unblock').then((a) => m.reply(global.mess.done)).catch((err) => m.reply(global.mess.fail))
				} else m.reply(`Example: ${prefix + command} 62xxx`)
			}
			break
			case 'ban': case 'banned': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (!text) return m.reply(`Kirim/tag Nomernya!\nExample:\n${prefix + command} 62xxx`)
				const findJid = naze.findJidByLid(text.replace(/[^0-9]/g, '') + '@lid', store);
				const klss = text.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
				const nmrnya = naze.findJidByLid(klss, store, true)
				if (db.users[nmrnya] && !db.users[nmrnya].ban) {
					db.users[nmrnya].ban = true
					m.reply(global.mess.done)
				} else m.reply('User tidak terdaftar di database!')
			}
			break
			case 'unban': case 'unbanned': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (!text) return m.reply(`Kirim/tag Nomernya!\nExample:\n${prefix + command} 62xxx`)
				const findJid = naze.findJidByLid(text.replace(/[^0-9]/g, '') + '@lid', store);
				const klss = text.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
				const nmrnya = naze.findJidByLid(klss, store, true)
				if (db.users[nmrnya] && db.users[nmrnya].ban) {
					db.users[nmrnya].ban = false
					m.reply(global.mess.done)
				} else m.reply('User tidak terdaftar di database!')
			}
			break
			case 'mute': case 'unmute': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (!m.isGroup) return m.reply(global.mess.group)
				if (command == 'mute') {
					db.groups[m.chat].mute = true
					m.reply('Bot Telah Di Mute Di Grup Ini!')
				} else if (command == 'unmute') {
					db.groups[m.chat].mute = false
					m.reply(global.mess.done + ' Unmute')
				}
			}
			break
			case 'whitelist': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!text) return m.reply(`*Format Salah!*\n\nContoh penggunaan:\n- ${prefix + command} user list\n- ${prefix + command} user add 1,3\n- ${prefix + command} user del 1\n- ${prefix + command} group add 1,2\n- ${prefix + command} clear`);
				const botNumber = await naze.decodeJid(naze.user.id);
				if (!global.db.set[botNumber].whitelist) global.db.set[botNumber].whitelist = [];
				let whitelistArray = global.db.set[botNumber].whitelist;
				let type = args[0] ? args[0].toLowerCase() : '';
				let action = args[1] ? args[1].toLowerCase() : '';
				let targetNumbers = args[2];
				if (type === 'user' || type === 'group' || ['gc', 'group','grup'].includes(type)) {
					let dbTarget = type === 'user' ? global.db.users : global.db.groups;
					let keys = Object.keys(dbTarget);
					if (keys.length === 0) return m.reply(`Belum ada data ${type} di database.`);
					if (action === 'list') {
						let listText = `*Daftar ${type === 'user' ? 'User' : 'Group'}:*\n\n`;
						keys.forEach((jid, index) => {
							let status = whitelistArray.includes(jid) ? '✅' : '❌';
							listText += `${index + 1}. ${type === 'user' ? global.store?.contacts?.[jid]?.name || '-' : global.store?.groupMetadata?.[jid]?.subject || '-'} [${status}]\n- (${jid})\n`;
						});
						listText += `\n*Cara Penggunaan:*\nTambah: ${prefix + command} ${type} add 1,2,3\nHapus: ${prefix + command} ${type} del 1,2`;
						return m.reply(listText);
					} else if (action === 'add' || action === 'del' || action === 'delete') {
						if (!targetNumbers) return m.reply(`Masukkan nomor urutnya!\nContoh: ${prefix + command} ${type} ${action} 1,2`);
						let processed = [];
						let inputNumbers = targetNumbers.split(',');
						for (let num of inputNumbers) {
							let index = parseInt(num.trim()) - 1;
							if (!isNaN(index) && keys[index]) {
								let targetJid = keys[index];
								if (action === 'add') {
									if (!whitelistArray.includes(targetJid)) {
										whitelistArray.push(targetJid);
										processed.push(targetJid);
									}
								} else {
									let wlIndex = whitelistArray.indexOf(targetJid);
									if (wlIndex !== -1) {
										whitelistArray.splice(wlIndex, 1);
										processed.push(targetJid);
									}
								}
							}
						}
						if (processed.length > 0) {
							let statusText = action === 'add' ? 'menambahkan ke' : 'menghapus dari';
							m.reply(`Sukses ${statusText} whitelist!\n\n*Total: ${processed.length} ${type}*\n- ${processed.join('\n- ')}`);
						} else {
							let failText = action === 'add' ? 'sudah ada di whitelist' : 'tidak ada di whitelist';
							m.reply(`Gagal diproses. Pastikan angka sesuai di *${prefix + command} ${type} list* dan data target ${failText}.`);
						}
					} else m.reply(`Kirim dengan format yang benar.\nContoh:\n- ${prefix + command} ${type} add 1,2,3\n- ${prefix + command} ${type} del 1,2\n- ${prefix + command} ${type} list`);
				} else if (type === 'clear') {
					global.db.set[botNumber].whitelist = [];
					m.reply('Semua data whitelist berhasil dihapus secara permanen!');
				} else m.reply(`Tipe tidak valid! Gunakan 'user', 'group', atau 'clear'.\nContoh: ${prefix + command} user list`);
			}
			break
			case 'addowner': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (!text) return m.reply(`Kirim/tag Nomernya!\nExample:\n${prefix + command} 62xxx`)
				const nmrnya = naze.findJidByLid(text.replace(/[^0-9]/g, ''), store, true)
				const onWa = await naze.onWhatsApp(nmrnya)
				if (!onWa.length > 0) return m.reply(global.mess.onWa)
				if (set?.owner) {
					if (set.owner.find(a => nmrnya.includes(a))) return m.reply('Nomer Tersebut Sudah Ada Di Owner!')
					set.owner.push(nmrnya.split('@')[0]);
					await updateSettings({
						filePath: settingsPath,
						owner: set.owner
					});
				}
				m.reply(global.mess.done)
			}
			break
			case 'delowner': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (!text) return m.reply(`Kirim/tag Nomernya!\nExample:\n${prefix + command} 62xxx`)
				const nmrnya = naze.findJidByLid(text.replace(/[^0-9]/g, ''), store, true)
				const onWa = await naze.onWhatsApp(nmrnya)
				if (!onWa.length > 0) return m.reply(global.mess.onWa)
				if (botNumber === nmrnya) return m.reply('Nomer Bot Tidak Boleh dihapus dari owner!')
				let list = set.owner
				const index = list.findIndex(o => o === nmrnya.split('@')[0]);
				if (index === -1) return m.reply('Owner tidak ditemukan di daftar!')
				list.splice(index, 1)
				await updateSettings({
					filePath: settingsPath,
					owner: set.owner
				});
				m.reply(global.mess.done)
			}
			break
	
			case 'upsw': {
				if (!isCreator) return m.reply(global.mess.owner)
				const statusJidList = Object.keys(db.users)
				const backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
				try {
					if (quoted.isMedia) {
						let media = await naze.downloadAndSaveMediaMessage(qmsg);
						try {
							if (/image|video/.test(quoted.mime)) {
								await naze.sendMessage('status@broadcast', {
									[`${quoted.mime.split('/')[0]}`]: { url: media },
									caption: text || m.quoted?.body || ''
								}, { statusJidList, broadcast: true })
								m.react('✅')
							} else if (/audio/.test(quoted.mime)) {
								await naze.sendMessage('status@broadcast', {
									audio: { url: media },
									mimetype: 'audio/mp4',
									ptt: true
								}, { backgroundColor, statusJidList, broadcast: true })
								m.react('✅')
							} else m.reply('Only Support video/audio/image/text')
						} finally {
							if (fs.existsSync(media)) fs.unlinkSync(media);
						}
					} else if (quoted.text) {
						await naze.sendMessage('status@broadcast', { text: text || m.quoted?.body || '' }, {
							textArgb: 0xffffffff,
							font: Math.floor(Math.random() * 9),
							backgroundColor, statusJidList,
							broadcast: true
						})
						m.react('✅')
					} else m.reply('Only Support video/audio/image/text')
				} catch (e) {
					m.reply(global.mess.fail)
				}
			}
			break
			case 'addcase': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (!text && !text.startsWith('case')) return m.reply('Masukkan Casenya!')
				fs.readFile(__filename, 'utf8', (err, data) => {
					if (err) {
						console.error('Terjadi kesalahan saat membaca file:', err);
						return;
					}
					const posisi = data.indexOf("case '19rujxl1e':");
					if (posisi !== -1) {
						const codeBaru = data.slice(0, posisi) + '\n' + `${text}` + '\n' + data.slice(posisi);
						fs.writeFile(__filename, codeBaru, 'utf8', (err) => {
							if (err) {
								m.reply('Terjadi kesalahan saat menulis file: ', err);
							} else m.reply(global.mess.done);
						});
					} else m.reply(global.mess.fail);
				});
			}
			break
			case 'getcase': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (!text) return m.reply('Masukkan Nama Casenya!')
				try {
					const getCase = (cases) => {
						return "case"+`'${cases}'`+fs.readFileSync(__filename).toString().split('case \''+cases+'\'')[1].split("break")[0]+"break"
					}
					m.reply(`${getCase(text)}`)
				} catch (e) {
					m.reply(`case ${text} tidak ditemukan!`)
				}
			}
			break
			case 'delcase': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (!text) return m.reply('Masukkan Nama Casenya!')
				fs.readFile(__filename, 'utf8', (err, data) => {
					if (err) {
						console.error('Terjadi kesalahan saat membaca file:', err);
						return;
					}
					const regex = new RegExp(`case\\s+'${text.toLowerCase()}':[\\s\\S]*?break`, 'g');
					const modifiedData = data.replace(regex, '');
					fs.writeFile(__filename, modifiedData, 'utf8', (err) => {
						if (err) {
							console.log(err);
							m.reply(global.mess.fail);
						} else m.reply(global.mess.done);
					});
				});
			}
			break
			case 'backup': {
				if (!isCreator) return m.reply(global.mess.owner)
				switch (args[0]) {
					case 'all':
					let bekup = './database/backup_all.tar.gz';
					tarBackup('./', bekup).then(() => {
						return m.reply({
							document: fs.readFileSync(bekup),
							mimetype: 'application/gzip',
							fileName: 'backup_all.tar.gz'
						})
					}).catch(e => m.reply('Gagal backup: ', + e))
					break
					case 'auto':
					if (set.autobackup) return m.reply('Sudah Aktif Sebelumnya!')
					set.autobackup = true
					m.reply('Sukses Mengaktifkan Auto Backup')
					break
					case 'session':
					await m.reply({
						document: fs.readFileSync('./nazedev/creds.json'),
						mimetype: 'application/json',
						fileName: 'creds.json'
					});
					break
					case 'database':
					let tglnya = new Date().toISOString().replace(/[:.]/g, '-');
					let datanya = './database/' + global.tempatDB;
					if (global.tempatDB.startsWith('mongodb')) {
						datanya = './database/backup_database.json';
						fs.writeFileSync(datanya, JSON.stringify(global.db, null, 2), 'utf-8');
					}
					await m.reply({
						document: fs.readFileSync(datanya),
						mimetype: 'application/json',
						fileName: tglnya + '_database.json'
					})
					break
					default:
					m.reply('Gunakan perintah:\n- backup all\n- backup auto\n- backup session\n- backup database');
				}
			}
			break
			case 'getsession': {
				if (!isCreator) return m.reply(global.mess.owner)
				await m.reply({
					document: fs.readFileSync('./nazedev/creds.json'),
					mimetype: 'application/json',
					fileName: 'creds.json'
				});
			}
			break
	
			case 'setmessbot': case 'setbotmessages': {
				if (!isCreator) return m.reply(global.mess.owner)
				const res = await fetchJson('https://raw.githubusercontent.com/nazedev/database/refs/heads/master/bot/lang.json');
				if (res.some(a => a.lang === text)) {
					const selectedLang = res.find(a => a.lang === text);
					await updateSettings({
						filePath: settingsPath,
						newMess: selectedLang.messages
					});
					m.reply(global.mess.done)
				} else m.reply(`Example: ${prefix + command} en\n*List Lang :*\n${res.map(a => '- ' + a.lang).join('\n')}`)
			}
			break
			case 'setlimitbot': case 'setbotlimit': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (['free','premium','vip'].includes(args[0]) && !isNaN(args[1])) {
					await updateSettings({
						filePath: settingsPath,
						setLimitRole: { role: args[0], value: Number(args[1]) }
					});
					m.reply(global.mess.done)
				} else m.reply(`Example: ${prefix + command} premium 10000\n*List Membership :*\n- free ${global.limit.free}\n- premium ${global.limit.premium}\n- vip ${global.limit.vip}`)
			}
			break
			case 'setmoneybot': case 'setbotmoney': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (['free','premium','vip'].includes(args[0]) && !isNaN(args[1])) {
					await updateSettings({
						filePath: settingsPath,
						setMoneyRole: { role: args[0], value: Number(args[1]) }
					});
					m.reply(global.mess.done)
				} else m.reply(`Example: ${prefix + command} premium 10000\n*List Membership :*\n- free ${global.money.free}\n- premium ${global.money.premium}\n- vip ${global.money.vip}`)
			}
			break
			case 'setnamebot': case 'setbotname': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text
					await updateSettings({
						filePath: settingsPath,
						botname: teksnya.trim()
					});
					m.reply(global.mess.done)
				} else m.reply(`Example: ${prefix + command} Hitori bot`)
			}
			break
			case 'setpacknamebot': case 'setbotpackname': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text
					await updateSettings({
						filePath: settingsPath,
						packname: teksnya.trim()
					});
					m.reply(global.mess.done)
				} else m.reply(`Example: ${prefix + command} By Hitori bot`)
			}
			break

			case 'setapikey': case 'setbotapikey': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (!text) return m.reply('Mana apikey nya?')
				if (args[0]?.toLowerCase() == 'neo') {
					if (!args[1]?.startsWith('nsk_')) return m.reply('Apikey Tidak Valid!\nAmbil Apikey di : https://app.neosantara.xyz/api-keys');
					let old_key = global.APIKeys[global.APIs.neosantara];
					await updateSettings({
						filePath: settingsPath,
						neosantara: args[1].trim()
					});
					m.reply(`*Apikey telah di ganti dari ${old_key} menjadi ${q}*`)
				} else {
					if (!text.startsWith('nz-')) return m.reply('Apikey Tidak Valid!\nAmbil Apikey di : https://naze.biz.id/profile');
					let old_key = global.APIKeys[global.APIs.naze];
					await updateSettings({
						filePath: settingsPath,
						apikey: text.trim()
					});
					m.reply(`*Apikey telah di ganti dari ${old_key} menjadi ${q}*`)
				}
			}
			break
	
			
			// Group Menu
			case 'add': {
				if (!m.isGroup) return m.reply(global.mess.group)
				if (!m.isAdmin) return m.reply(global.mess.admin)
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin)
				if (text || m.quoted) {
					const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender
					const findJid = naze.findJidByLid(numbersOnly.replace(/[^0-9]/g, '') + '@lid', store);
					const klss = numbersOnly.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
					const nmrnya = naze.findJidByLid(klss, store, true)
					try {
						await naze.groupParticipantsUpdate(m.chat, [nmrnya], 'add').then(async (res) => {
							for (let i of res) {
								let invv = await naze.groupInviteCode(m.chat)
								const statusMessages = {
									200: `Berhasil menambahkan @${nmrnya.split('@')[0]} ke grup!`,
									401: 'Dia Memblokir Bot!',
									409: 'Dia Sudah Join!',
									500: 'Grup Penuh!'
								};
								if (statusMessages[i.status]) {
									return m.reply(statusMessages[i.status]);
								} else if (i.status == 408) {
									await m.reply(`@${nmrnya.split('@')[0]} Baru-Baru Saja Keluar Dari Grub Ini!\n\nKarena Target Private\n\nUndangan Akan Dikirimkan Ke\n-> wa.me/${nmrnya.replace(/\D/g, '')}\nMelalui Jalur Pribadi`)
									await m.reply(`${'https://chat.whatsapp.com/' + invv}\n------------------------------------------------------\n\nAdmin: @${m.sender.split('@')[0]}\nMengundang anda ke group ini\nSilahkan masuk jika berkehendak🙇`, { detectLink: true, chat: nmrnya, quoted: fkontak }).catch((err) => m.reply('Gagal Mengirim Undangan!'))
								} else if (i.status == 403) {
									let a = i.content.content[0].attrs
									await naze.sendGroupInviteV4(m.chat, nmrnya, a.code, a.expiration, m.metadata.subject, `Admin: @${m.sender.split('@')[0]}\nMengundang anda ke group ini\nSilahkan masuk jika berkehendak🙇`, null, { mentions: [m.sender] })
									await m.reply(`@${nmrnya.split('@')[0]} Tidak Dapat Ditambahkan\n\nKarena Target Private\n\nUndangan Akan Dikirimkan Ke\n-> wa.me/${nmrnya.replace(/\D/g, '')}\nMelalui Jalur Pribadi`)
								} else m.reply('Gagal Add User\nStatus : ' + i.status)
							}
						})
					} catch (e) {
						m.reply(global.mess.fail)
					}
				} else m.reply(`Example: ${prefix + command} 62xxx`)
			}
			break
			case 'kick': case 'dor': {
				if (!m.isGroup) return m.reply(global.mess.group)
				if (!m.isAdmin) return m.reply(global.mess.admin)
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin)
				if (text || m.quoted) {
					const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender
					const findJid = naze.findJidByLid(numbersOnly.replace(/[^0-9]/g, '') + '@lid', store);
					const klss = numbersOnly.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
					const nmrnya = naze.findJidByLid(klss, store, true)
					await naze.groupParticipantsUpdate(m.chat, [nmrnya], 'remove').catch((err) => m.reply(global.mess.fail))
				} else m.reply(`Example: ${prefix + command} 62xxx`)
			}
			break
			case 'promote': {
				if (!m.isGroup) return m.reply(global.mess.group)
				if (!m.isAdmin) return m.reply(global.mess.admin)
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin)
				if (text || m.quoted) {
					const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender
					const findJid = naze.findJidByLid(numbersOnly.replace(/[^0-9]/g, '') + '@lid', store);
					const klss = numbersOnly.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
					const nmrnya = naze.findJidByLid(klss, store, true)
					await naze.groupParticipantsUpdate(m.chat, [nmrnya], 'promote').catch((err) => m.reply(global.mess.fail))
				} else m.reply(`Example: ${prefix + command} 62xxx`)
			}
			break
			case 'demote': {
				if (!m.isGroup) return m.reply(global.mess.group)
				if (!m.isAdmin) return m.reply(global.mess.admin)
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin)
				if (text || m.quoted) {
					const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender
					const findJid = naze.findJidByLid(numbersOnly.replace(/[^0-9]/g, '') + '@lid', store);
					const klss = numbersOnly.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
					const nmrnya = naze.findJidByLid(klss, store, true)
					await naze.groupParticipantsUpdate(m.chat, [nmrnya], 'demote').catch((err) => m.reply(global.mess.fail))
				} else m.reply(`Example: ${prefix + command} 62xxx`)
			}
			break
		
								// Bot Menu
			case 'owner': case 'listowner': {
				await naze.sendContact(m.chat, ownerNumber, m);
			}
			break			
			case 'totalfitur': {
				const total = ((fs.readFileSync(__filename).toString()).match(/case '/g) || []).length
				m.reply(`Total Fitur : ${total}`);
			}

			case 'tagme': {
				m.reply(`@${m.sender.split('@')[0]}`, { mentions: [m.sender] })
			}
			break
			case 'runtime': case 'tes': case 'bot': {
				if (!args[0] && !args[1]) return m.reply(`*Bot Telah Online Selama*\n*${runtime(process.uptime())}*`);
				switch(args[0]) {
					case 'mode': case 'public': case 'self':
					if (!isCreator) return m.reply(global.mess.owner)
					if (args[1] == 'public' || args[1] == 'all') {
						if (naze.public && set.grouponly && set.privateonly) return m.reply('*Sudah Aktif Sebelumnya*')
						naze.public = set.public = true
						set.grouponly = true
						set.privateonly = true
						m.reply('*Sukses Change To Public Usage*')
					} else if (args[1] == 'self') {
						set.grouponly = false
						set.privateonly = false
						naze.public = set.public = false
						m.reply('*Sukses Change To Self Usage*')
					} else if (args[1] == 'group') {
						set.grouponly = true
						set.privateonly = false
						m.reply('*Sukses Change To Group Only*')
					} else if (args[1] == 'private') {
						set.grouponly = false
						set.privateonly = true
						m.reply('*Sukses Change To Private Only*')
					} else m.reply('Mode self/public/group/private/all')
					break
					case 'log': case 'anticall': case 'autobio': case 'autoread': case 'autotyping': case 'readsw': case 'multiprefix': case 'antispam': case 'didyoumean':
					if (!isCreator) return m.reply(global.mess.owner)
					if (args[1] == 'on') {
						if (set[args[0]]) return m.reply('*Sudah Aktif Sebelumnya*')
						set[args[0]] = true
						m.reply('*Sukses Change To On*')
					} else if (args[1] == 'off') {
						set[args[0]] = false
						m.reply('*Sukses Change To Off*')
					} else m.reply(`${args[0].charAt(0).toUpperCase() + args[0].slice(1)} on/off`)
					break
					case 'set': case 'settings':
					let settingsBot = Object.entries(set).map(([key, value]) => {
						let list = key == 'status' ? new Date(value).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : (typeof value === 'boolean') ? (value ? 'on🟢' : 'off🔴') : (typeof value === 'object') ? `\n${value.map(a => '- ' + a).join('\n')}` : value;
						return `- ${key.charAt(0).toUpperCase() + key.slice(1)} : ${list}`;
					}).join('\n');
					m.reply(`Settings Bot @${botNumber.split('@')[0]}\n${settingsBot}\n\nExample: ${prefix + command} mode`);
					break
					case 'author': case 'authorprefix':
					if (!isCreator) return m.reply(global.mess.owner)
					if (args[1] == 'on') {
						set.authorPrefix = '.';
						m.reply(global.mess.done)
					} else if (args[1] == 'off') {
						set.authorPrefix = '';
						m.reply(global.mess.done)
					} else m.reply(`${args[0].charAt(0).toUpperCase() + args[0].slice(1)} on/off`)
					break
					case 'whitelist': case 'whitelistmode':
					if (!isCreator) return m.reply(global.mess.owner)
					if (args[1] == 'on') {
						set.whitelistonly = true
						m.reply('*Sukses Change To Whitelist Mode*')
					} else if (args[1] == 'off') {
						set.whitelistonly = false
						m.reply('*Sukses Change To Normal Mode*')
					} else m.reply('Whitelist on/off')
					break
					default: {
						let menuList = `*⚙️ SETTINGS BOT ⚙️*
					
Select Bot Settings:

*👥 Mode Penggunaan:*
- Mode Bot : *${prefix + command} mode [public/self/group/private]*
- Whitelist Mode : *${prefix + command} whitelist [on/off]*

*🎛️ Fitur Otomatis (on/off):*
- Anti Call : *${prefix + command} anticall [on/off]*
- Anti Spam : *${prefix + command} antispam [on/off]*
- Auto Bio : *${prefix + command} autobio [on/off]*
- Auto Read : *${prefix + command} autoread [on/off]*
- Auto Typing : *${prefix + command} autotyping [on/off]*
- Read Status/SW : *${prefix + command} readsw [on/off]*

*🛠️ System Settings:*
- Multi Prefix : *${prefix + command} multiprefix [on/off]*
- Did You Mean : *${prefix + command} didyoumean [on/off]*
- Log Console : *${prefix + command} log [on/off]*
- Author Prefix : *${prefix + command} author [on/off]*

*📊 Info & Status:*
- Cek Semua Setting : *${prefix + command} set*
- Cek Runtime Bot : *${prefix + command}*`;
						if (args[0] || args[1]) m.reply(menuList);
					}
				}
			}
			break
			case 'ping': case 'botstatus': case 'statusbot': {
				const used = process.memoryUsage()
				const cpus = os.cpus().map(cpu => {
					cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
					return cpu
				})
				const cpu = cpus.reduce((last, cpu, _, { length }) => {
					last.total += cpu.total
					last.speed += cpu.speed / length
					last.times.user += cpu.times.user
					last.times.nice += cpu.times.nice
					last.times.sys += cpu.times.sys
					last.times.idle += cpu.times.idle
					last.times.irq += cpu.times.irq
					return last
				}, {
					speed: 0,
					total: 0,
					times: {
						user: 0,
						nice: 0,
						sys: 0,
						idle: 0,
						irq: 0
					}
				})
				let timestamp = speed()
				let latensi = speed() - timestamp
				let neww = performance.now()
				let oldd = performance.now()
				let respon = `Kecepatan Respon ${latensi.toFixed(4)} _Second_ \n ${oldd - neww} _miliseconds_\n\nRuntime : ${runtime(process.uptime())}\n\n💻 Info Server\nRAM: ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}\n\n_NodeJS Memory Usaage_\n${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v=>v.length)),' ')}: ${formatp(used[key])}`).join('\n')}\n\n${cpus[0] ? `_Total CPU Usage_\n${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}\n_CPU Core(s) Usage (${cpus.length} Core CPU)_\n${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}`.trim()
				m.reply(respon)
			}
			break
			case 'speedtest': case 'speed': {
				m.reply('Testing Speed...')
				let cp = require('child_process')
				let { promisify } = require('util')
				let exec = promisify(cp.exec).bind(cp)
				let o
				try {
					o = await exec('python3 speed.py --share')
				} catch (e) {
					o = e
				} finally {
					let { stdout, stderr } = o
					if (stdout.trim()) m.reply(stdout)
					if (stderr.trim()) m.reply(stderr)
				}
			}
			break
			case 'setcmd': case 'addcmd': {
				if (!m.quoted) return m.reply(global.mess.quoted)
				if (!m.quoted.fileSha256) return m.reply('SHA256 Hash Missing!')
				if (!text) return m.reply(`Example : ${prefix + command} CMD Name`)
				let hash = m.quoted.fileSha256.toString('base64')
				if (global.db.cmd[hash] && global.db.cmd[hash].locked) return m.reply('You have no permission to change this sticker command')
				global.db.cmd[hash] = {
					creator: m.sender,
					locked: false,
					at: + new Date,
					text
				}
				m.reply(global.mess.done)
			}
			break
			case 'delcmd': {
				if (!m.quoted) return m.reply(global.mess.quoted)
				if (!m.quoted.fileSha256) return m.reply('SHA256 Hash Missing!')
				let hash = m.quoted.fileSha256.toString('base64')
				if (global.db.cmd[hash] && global.db.cmd[hash].locked) return m.reply('You have no permission to change this sticker command')
				delete global.db.cmd[hash];
				m.reply(global.mess.done)
			}
			break
			case 'listcmd': {
				let teks = `*List Hash*\nInfo: *bold* hash is Locked\n${Object.entries(global.db.cmd).map(([key, value], index) => `${index + 1}. ${value.locked ? `*${key}*` : key} : ${value.text}`).join('\n')}`.trim()
				naze.sendText(m.chat, teks, m);
			}
			break
			case 'lockcmd': case 'unlockcmd': {
				if (!isCreator) return m.reply(global.mess.owner)
				if (!m.quoted) return m.reply(global.mess.quoted)
				if (!m.quoted.fileSha256) return m.reply('SHA256 Hash Missing!')
				let hash = m.quoted.fileSha256.toString('base64')
				if (!(hash in global.db.cmd)) return m.reply('You have no permission to change this sticker command')
				global.db.cmd[hash].locked = !/^un/i.test(command)
			}
			break

			
			// Tools Menu
			case 'fetch': case 'get': {
				if (!isPremium) return m.reply(global.mess.prem)
				if (!isLimit) return m.reply(global.mess.limit)
				if (!/^https?:\/\//.test(text)) return m.reply('Awali dengan http:// atau https://');
				try {
					const res = await axios.get(isUrl(text) ? isUrl(text)[0] : text)
					if (!/text|json|html|plain/.test(res.headers['content-type'])) {
						await m.reply(text)
					} else m.reply(util.format(res.data))
					setLimit(m, db)
				} catch (e) {
					m.reply(String(e))
				}
			}
			break
			case 'toaud': case 'toaudio': {
				if (!/video|audio/.test(mime)) return m.reply(`Kirim/Reply Video/Audio Yang Ingin Dijadikan Audio Dengan Caption ${prefix + command}`)
				m.react('⏳')
				let media = await naze.downloadAndSaveMediaMessage(qmsg)
				try {
					let audio = await toAudio(media, 'mp4')
					await m.reply({ audio: { url: audio }, mimetype: 'audio/mpeg'})
					if (fs.existsSync(audio)) fs.unlinkSync(audio)
				} finally {
					if (fs.existsSync(media)) fs.unlinkSync(media)
				}
			}
			break
			case 'tomp3': {
				if (!/video|audio/.test(mime)) return m.reply(`Kirim/Reply Video/Audio Yang Ingin Dijadikan Audio Dengan Caption ${prefix + command}`)
				m.react('⏳')
				let media = await naze.downloadAndSaveMediaMessage(qmsg)
				try {
					let audio = await toAudio(media, 'mp4')
					await m.reply({ document: { url: audio }, mimetype: 'audio/mpeg', fileName: `Convert By Naze Bot.mp3`})
					if (fs.existsSync(audio)) fs.unlinkSync(audio)
				} finally {
					if (fs.existsSync(media)) fs.unlinkSync(media)
				}
			}
			break
			case 'tovn': case 'toptt': case 'tovoice': {
				if (!/video|audio/.test(mime)) return m.reply(`Kirim/Reply Video/Audio Yang Ingin Dijadikan Audio Dengan Caption ${prefix + command}`)
				m.react('⏳')
				let media = await naze.downloadAndSaveMediaMessage(qmsg)
				try {
					let audioBuffer = await toPTT(media, 'mp4')
					await m.reply({ audio: audioBuffer, mimetype: 'audio/ogg; codecs=opus', ptt: true });
				} finally {
					if (fs.existsSync(media)) fs.unlinkSync(media)
				}
			}
			break
			case 'togif': {
				if (!/webp|video/.test(mime)) return m.reply(`Reply Video/Stiker dengan caption *${prefix + command}*`)
				m.react('⏳')
				let media = await naze.downloadAndSaveMediaMessage(qmsg)
				let ran = `./database/temp/${getRandom('.mp4')}`;
				exec(`ffmpeg -y -i "${media}" -an -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -pix_fmt yuv420p -c:v libx264 -preset veryfast "${ran}"`, async (err) => {
					try {
						if (err) return m.reply(global.mess.fail);
						await m.reply({ video: { url: ran }, gifPlayback: true, caption: global.mess.done, gifAttribution: pickRandom(['TENOR','GIPHY']) })
					} finally {
						if (fs.existsSync(media)) fs.unlinkSync(media)
						if (fs.existsSync(ran)) fs.unlinkSync(ran)
					}
				})
			}
			break
			case 'toimage': case 'toimg': {
				if (!/webp|video|image/.test(mime)) return m.reply(`Reply Video/Stiker dengan caption *${prefix + command}*`)
				m.react('⏳')
				let media = await naze.downloadAndSaveMediaMessage(qmsg)
				let ran = `./database/temp/${getRandom('.png')}`;
				exec(`ffmpeg -y -i "${media}" -vframes 1 "${ran}"`, async (err) => {
					try {
						if (err) return m.reply(global.mess.fail);
						await m.reply({ image: { url: ran }, caption: global.mess.done })
					} finally {
						if (fs.existsSync(media)) fs.unlinkSync(media)
						if (fs.existsSync(ran)) fs.unlinkSync(ran)
					}
				})
			}
			break
			
			case 'tourl': {
				if (/webp|video|sticker|audio|jpg|jpeg|png/.test(mime)) {
					m.react('⏳')
					let media = await naze.downloadAndSaveMediaMessage(qmsg);
					try {
						let anu = await UguuSe(media);
						m.reply('Url : ' + anu.url)
					} finally {
						if (fs.existsSync(media)) fs.unlinkSync(media)
					}
				} else m.reply(global.mess.media)
			}
			break
			case 'texttospech': case 'tts': case 'tospech': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text) return m.reply('Mana text yg mau diubah menjadi audio?')
				let anu
				try {
					anu = await fetchApi('/tools/tts', { text }, { stream: true });
					m.reply({ audio: { url: anu }, ptt: true, mimetype: 'audio/mpeg' });
					setLimit(m, db)
				} finally {
					if (anu && fs.existsSync(anu)) fs.unlinkSync(anu);
				}
			}
			break
			
			case 'toqr': case 'qr': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text) return m.reply(`Ubah Text ke Qr dengan *${prefix + command}* textnya`)
				m.react('⏳')
				let anu;
				try {
					anu = await fetchApi('/tools/to-qr', { data: text }, { stream: true });
					await m.reply({ image: { url: anu }, caption: 'Nih Bro' });
					setLimit(m, db)
				} finally {
					if (anu && fs.existsSync(anu)) fs.unlinkSync(anu);
				}
			}
			break
			case 'tohd': case 'remini': case 'hd': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (/image/.test(mime)) {
					m.react('⏳')
					let hasil;
					let media = await naze.downloadAndSaveMediaMessage(qmsg);
					try {
						const form = new FormData();
						form.append('buffer', fs.createReadStream(media), {
							filename: 'image.jpg',
							contentType: 'image/jpeg'
						});
						hasil = await fetchApi('/tools/remini', form, { stream: true });
						await m.reply({ image: { url: hasil }, caption: global.mess.done })
						setLimit(m, db)
						if (media && fs.existsSync(media)) fs.unlinkSync(media);
						if (hasil && fs.existsSync(hasil)) fs.unlinkSync(hasil);
					} catch (e) {
						if (hasil && fs.existsSync(hasil)) fs.unlinkSync(hasil);
						let ran = `./database/temp/${getRandom('.jpg')}`;
						const scaleFactor = isNaN(parseInt(text)) ? 4 : parseInt(text) < 10 ? parseInt(text) : 4;
						exec(`ffmpeg -i "${media}" -vf "scale=iw*${scaleFactor}:ih*${scaleFactor}:flags=lanczos" -q:v 1 "${ran}"`, async (err, stderr, stdout) => {
							try {
								if (err) return m.reply(global.mess.fail)
								await naze.sendMessage(m.chat, { image: { url: ran }, caption: global.mess.done }, { quoted: m });
								setLimit(m, db)
							} catch (e) {
								console.log(e);
							} finally {
								if (ran && fs.existsSync(ran)) fs.unlinkSync(ran)
								if (media && fs.existsSync(media)) fs.unlinkSync(media) 
							}
						});
					}
				} else m.reply(`Kirim/Reply Gambar dengan format\nExample: ${prefix + command}`)
			}
			break
			
			
			case 'ssweb': {
				if (!isPremium) return m.reply(global.mess.prem)
				if (!text) return m.reply(`Example: ${prefix + command} https://github.com/epultzy`)
				let anu = 'https://' + text.replace(/^https?:\/\//, '')
				let hasil;
				try {
					hasil = await fetchApi('/tools/ss', { url: anu }, { stream: true });
					await m.reply({ image: { url: hasil }, caption: global.mess.done });
					setLimit(m, db)
				} finally {
					if (hasil && fs.existsSync(hasil)) fs.unlinkSync(hasil);
				}
			}
			break
			case 'readmore': {
				let teks1 = text.split`|`[0] ? text.split`|`[0] : ''
				let teks2 = text.split`|`[1] ? text.split`|`[1] : ''
				m.reply(teks1 + readmore + teks2)
			}
			break
			case 'getexif': {
				if (!m.quoted) return m.reply(`Reply sticker\nDengan caption ${prefix + command}`)
				if (!/sticker|webp/.test(quoted.type)) return m.reply(`Reply sticker\nDengan caption ${prefix + command}`)
				const img = new webp.Image()
				await img.load(await m.quoted.download())
				if (!img.exif) return m.reply('Stiker ini tidak memiliki metadata/EXIF sama sekali.');
				try {
					const exifData = JSON.parse(img.exif.slice(22).toString());
					m.reply(util.format(exifData))
				} catch (e) {
					m.reply(`Stiker memiliki EXIF, tapi formatnya bukan JSON yang valid:\n\n${img.exif.toString()}`);
				}
			}
			break

			case 'sticker': case 'stiker': case 's': case 'stickergif': case 'stikergif': case 'sgif': case 'stickerwm': case 'swm': case 'curi': case 'colong': case 'take': case 'stickergifwm': case 'sgifwm': {
				if (!/image|video|sticker/.test(quoted.type)) return m.reply(`Kirim/reply gambar/video/gif dengan caption ${prefix + command}\nDurasi Image/Video/Gif 1-9 Detik`)
				let media = await naze.downloadAndSaveMediaMessage(qmsg);
				let teks1 = text.split`|`[0] ? text.split`|`[0] : packname
				let teks2 = text.split`|`[1] ? text.split`|`[1] : author
				if (/image|webp/.test(mime)) {
					m.react('⏳')
					await naze.sendAsSticker(m.chat, media, m, { packname: teks1, author: teks2 })
				} else if (/video/.test(mime)) {
					if ((qmsg).seconds > 11) return m.reply('Maksimal 10 detik!')
					m.react('⏳')
					await naze.sendAsSticker(m.chat, media, m, { packname: teks1, author: teks2 })
				} else m.reply(`Kirim/reply gambar/video/gif dengan caption ${prefix + command}\nDurasi Video/Gif 1-9 Detik`)
			}
			break
			case 'smeme': case 'stickmeme': case 'stikmeme': case 'stickermeme': case 'stikermeme': {
				//if (!isPremium) return m.reply(global.mess.prem)
				if (!isLimit) return m.reply(global.mess.limit)
				if (!/image|webp/.test(mime)) return m.reply(`Kirim/reply image/sticker\nDengan caption ${prefix + command} atas|bawah`)
				if (!text) return m.reply(`Kirim/reply image/sticker dengan caption ${prefix + command} atas|bawah`)
				m.react('⏳')
				let atas = text.split`|`[0] ? text.split`|`[0] : '-'
				let bawah = text.split`|`[1] ? text.split`|`[1] : '-'
				let media = await naze.downloadAndSaveMediaMessage(qmsg)
				try {
					let mem = await UguuSe(media);
					let smeme = await fetchApi('/create/meme2', { url: mem.url, text: atas, text2: bawah }, { stream: true });
					await naze.sendAsSticker(m.chat, smeme, m, { packname, author })
					setLimit(m, db)
				} catch (e) {
					console.log(e)
					m.reply(global.mess.fail)
				} finally {
					if (media && fs.existsSync(media)) fs.unlinkSync(media)
				}
			}
			break
			case 'emojimix': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text) return m.reply(`Example: ${prefix + command} 😅+🤔`)
				let [emoji1, emoji2] = text.split`+`
				if (!emoji1 && !emoji2) return m.reply(`Example: ${prefix + command} 😅+🤔`)
				let { result } = await fetchApi('/tools/emojimix', { emoji1, emoji2 });
				if (result.length < 1) return m.reply(`Mix Emoji ${text} Tidak Ditemukan!`)
				for (let res of result) {
					await naze.sendAsSticker(m.chat, res.url, m, { packname, author })
				}
				setLimit(m, db)
			}
			break
			case 'iqc': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text && (!m.quoted || !m.quoted.text)) return m.reply(`Kirim/reply pesan *${prefix + command}* Teksnya`)
				m.react('⏳')
				let queryText = text ? text : m.quoted.text;
				if (queryText.length >= 200) return m.reply('Max 200 Length!')
				let res;
				try {
					res = await fetchApi('/create/iqc', { text: queryText }, { stream: true });
					await m.reply({ image: { url: res }, caption: global.mess.done })
					setLimit(m, db)
				} finally {
					if (res && fs.existsSync(res)) fs.unlinkSync(res);
				}
			}
			break
			case 'qc':
			case 'quote':
			case 'fakechat': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text && !m.quoted) return m.reply(`Kirim / reply pesan untuk *${prefix + command}*`)
				try {
					let medianya;
					let quotedMedianya;
					let mediaPath;
					let quotedMediaPath;
					let ppUrl = await naze.profilePictureUrl(m.sender, 'image').catch(() => 'https://i.pinimg.com/564x/8a/e9/e9/8ae9e92fa4e69967aa61bf2bda967b7b.jpg');
					const senderName = m.pushName || store.contacts?.[m.sender]?.name || '+' + m.sender.split('@')[0]
					const quotedName = store.contacts?.[m.quoted?.sender]?.name || '+' + (m.quoted?.sender || '').split('@')[0]
					try {
						if (m.isMedia) {
							mediaPath = await naze.downloadAndSaveMediaMessage(m);
							medianya = await UguuSe(mediaPath); 
						}
						if (m.quoted?.isMedia) {
							quotedMediaPath = await naze.downloadAndSaveMediaMessage(m.quoted);
							quotedMedianya = await UguuSe(quotedMediaPath);
						}
						const payload = {
							type: 'quote',
							format: 'png',
							backgroundColor: '#FFFFFF',
							width: 512,
							height: 768,
							scale: 2,
							messages: [{
								entities: [],
								...(medianya?.url ? { media: { url: medianya.url }} : {}),
								avatar: true,
								from: {
									id: 1,
									name: senderName,
									photo: {
										url: ppUrl
									}
								},
								text,
								replyMessage: m.quoted ? {
									name: quotedName || '',
									text: m.quoted.text || '',
									...(quotedMedianya?.url ? { media: { url: quotedMedianya.url }} : {}),
									chatId: Math.floor(Math.random() * 9999999)
								} : {},
							}]
						};
						let res = await fetchApi('/create/qc', payload, { method: 'POST', buffer: true });
						await naze.sendAsSticker(m.chat, Buffer.from(res, 'base64'), m, { packname, author });
						setLimit(m, db);
					} finally {
						if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
						if (quotedMediaPath && fs.existsSync(quotedMediaPath)) fs.unlinkSync(quotedMediaPath);
					}
				} catch (e) {
					console.log(e)
					m.reply(global.mess.fail)
				}
			}
			break
			case 'brat': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text && (!m.quoted || !m.quoted.text)) return m.reply(`Kirim/reply pesan *${prefix + command}* Teksnya`)
				let queryText = text ? text : m.quoted.text;
				if (queryText.length >= 200) return m.reply('Max 200 Length!')
				try {
					let res = await fetchApi('/create/brat', { text: queryText }, { stream: true });
					await naze.sendAsSticker(m.chat, res, m)
					setLimit(m, db)
				} catch (e) {
					try {
						let res = await fetchApi('/create/brat3', { text: queryText }, { stream: true });
						await naze.sendAsSticker(m.chat, res, m)
						setLimit(m, db)
					} catch (e) {
						console.log(e)
						m.reply(global.mess.fail)
					}
				}
			}
			break
			case 'bratvid': case 'bratvideo': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text && (!m.quoted || !m.quoted.text)) return m.reply(`Kirim/reply pesan *${prefix + command}* Teksnya`)
				m.react('⏳')
				const teks = (m.quoted ? m.quoted.text : text).split(' ');
				if (teks.length >= 200) return m.reply('Max 200 Length!')
				const tempDir = path.join(process.cwd(), 'database/temp');
				const framePaths = []; 
				const fileListPath = path.join(tempDir, `${time + '-' + m.sender}.txt`);
				const outputVideoPath = path.join(tempDir, `${time + '-' + m.sender}-output.mp4`);
				try {
					for (let i = 0; i < teks.length; i++) {
						const currentText = teks.slice(0, i + 1).join(' ');
						const framePath = path.join(tempDir, `${time + '-' + m.sender + i}.mp4`);
						try {
							let res = await fetchApi('/create/brat2', { text: currentText }, { stream: framePath });
							framePaths.push(res);
						} catch (e) {
							let res = await fetchApi('/create/brat4', { text: currentText }, { stream: framePath });
							framePaths.push(res);
						}
					}
					let fileListContent = '';
					for (let i = 0; i < framePaths.length; i++) {
						fileListContent += `file '${framePaths[i]}'\n`;
						fileListContent += `duration 0.5\n`;
					}
					fileListContent += `file '${framePaths[framePaths.length - 1]}'\n`;
					fileListContent += `duration 3\n`;
					fs.writeFileSync(fileListPath, fileListContent);
					execSync(`ffmpeg -y -f concat -safe 0 -i "${fileListPath}" -vf 'fps=30' -c:v libx264 -preset veryfast -pix_fmt yuv420p -t 00:00:10 "${outputVideoPath}"`);
					await naze.sendAsSticker(m.chat, outputVideoPath, m, { packname, author });
					setLimit(m, db)
				} catch (e) {
					console.log(e)
					m.reply(global.mess.fail)
				} finally {
					framePaths.forEach((filePath) => {
						if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
					});
					if (fs.existsSync(fileListPath)) fs.unlinkSync(fileListPath);
					if (fs.existsSync(outputVideoPath)) fs.unlinkSync(outputVideoPath);
				}
			}
			break
			case 'wasted': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (/jpg|jpeg|png/.test(mime)) {
					m.react('⏳')
					let hasil;
					let media = await naze.downloadAndSaveMediaMessage(qmsg);
					try {
						const form = new FormData();
					    form.append('buffer', fs.createReadStream(media), {
							filename: 'image.jpg',
							contentType: 'image/jpeg'
						});
						hasil = await fetchApi('/create/wasted', form, { stream: true });
						await naze.sendMedia(m.chat, hasil, '', 'Nih Bro', m);
						setLimit(m, db)
					} finally {
						if (hasil && fs.existsSync(hasil)) fs.unlinkSync(hasil);
						if (media && fs.existsSync(media)) fs.unlinkSync(media);
					}
				} else m.reply(global.mess.media)
			}
			break
			case 'trigger': case 'triggered': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (/jpg|jpeg|png/.test(mime)) {
					m.react('⏳')
					let hasil;
					let media = await naze.downloadAndSaveMediaMessage(qmsg);
					try {
						const form = new FormData();
					    form.append('buffer', fs.createReadStream(media), {
							filename: 'image.jpg',
							contentType: 'image/jpeg'
						});
						hasil = await fetchApi('/create/triggered', form, { stream: true });
						await naze.sendMedia(m.chat, hasil, '', global.mess.done, m);
						setLimit(m, db)
					} finally {
						if (hasil && fs.existsSync(hasil)) fs.unlinkSync(hasil);
						if (media && fs.existsSync(media)) fs.unlinkSync(media);
					}
				} else m.reply(global.mess.media)
			}
			break
			case 'nulis': {
				m.reply(`*Example*\n${prefix}nuliskiri\n${prefix}nuliskanan\n${prefix}foliokiri\n${prefix}foliokanan`)
			}
			break
			case 'nuliskanan': case 'nuliskiri': case 'foliokanan': case 'foliokiri': {
				if (!isLimit) return m.reply(mess.limit);
				if (!text) return m.reply(`Kirim perintah *${prefix + command}* Teksnya`);
				m.react('⏳');
				if (canvasModule) {
					const { createCanvas, loadImage } = canvasModule;
					const isFolio = command.includes('folio');
					const isKanan = command.includes('kanan');
					const folder = isFolio ? 'folio' : 'buku';
					const posisi = isKanan ? 'kanan' : 'kiri';
					const inputFile = `./src/nulis/images/${folder}/sebelum${posisi}.jpg`;
					const maxLines = isFolio ? 38 : 31;
					const maxWordsPerLine = isFolio ? 12 : 8;
					const regexWords = new RegExp(`(\\S+\\s*){1,${maxWordsPerLine}}`, 'g');
					const splitText = text.replace(regexWords, '$&\n');
					const lines = splitText.split('\n').slice(0, maxLines);
					let startX = 140, startY = 156, lineHeight = 8.7;
					if (command === 'nuliskanan') { startX = 128; startY = 136, lineHeight = 10.5; }
					if (command === 'foliokiri') { startX = 48; startY = 200, lineHeight = 12; }
					if (command === 'foliokanan') { startX = 89; startY = 168, lineHeight = 11; }
					let image = null, canvas = null, ctx = null, buffer = null;
					try {
						image = await loadImage(inputFile);
						canvas = createCanvas(image.width, image.height);
						ctx = canvas.getContext('2d');
						ctx.drawImage(image, 0, 0, image.width, image.height);
						ctx.font = '27px "Indie Flower"';
						ctx.fillStyle = '#1e1e1e';
						ctx.textBaseline = 'top';
						const baseLineHeight = 27 + lineHeight;
						let currentY = startY;
						for (const line of lines) {
							ctx.fillText(line, startX, currentY);
							currentY += baseLineHeight;
						}
						buffer = await canvas.encode('png');
						await m.reply({ image: buffer, caption: 'Jangan Malas Lord. Jadilah siswa yang rajin ರ_ರ' });
						setLimit(m, db);
					} catch (err) {
						console.error('Error saat membuat gambar nulis:', err);
						m.reply('Terjadi kesalahan pada sistem saat memproses gambar.');
					} finally {
						if (canvas) {
							canvas.width = 0;
							canvas.height = 0;
						}
						image = null, canvas = null, ctx = null, buffer = null;
					}
				} else {
					const config = {
						'nuliskiri':  { lines: 31, path: 'buku/sebelumkiri.jpg',   out: `buku_setelahkiri_${Date.now()}.jpg`,   size: '960x1280',  space: '2', coord: '+140+153' },
						'nuliskanan': { lines: 31, path: 'buku/sebelumkanan.jpg',  out: `buku_setelahkanan_${Date.now()}.jpg`,  size: '960x1280',  space: '2', coord: '+128+129' },
						'foliokiri':  { lines: 38, path: 'folio/sebelumkiri.jpg',  out: `folio_setelahkiri_${Date.now()}.jpg`,  size: '1720x1280', space: '4', coord: '+48+185' },
						'foliokanan': { lines: 38, path: 'folio/sebelumkanan.jpg', out: `folio_setelahkanan_${Date.now()}.jpg`, size: '1720x1280', space: '4', coord: '+89+190' }
					}[command]
					const splitText = text.replace(/(\S+\s*){1,9}/g, '$&\n')
					const fixHeight = splitText.split('\n').slice(0, config.lines).join('\n')
					const inputImg = `./src/nulis/images/${config.path}`
					const outputImg = `./database/temp/${config.out}`
					try {
						await new Promise((resolve, reject) => {
							spawn('convert', [
								inputImg,
								'-font', './src/nulis/font/Indie-Flower.ttf',
								'-size', config.size,
								'-pointsize', '23',
								'-interline-spacing', config.space,
								'-annotate', config.coord,
								fixHeight,
								outputImg
							])
							.on('error', reject)
							.on('exit', (code) => {
								if (code === 0) resolve()
								else reject(new Error(`Proses convert gagal dengan kode: ${code}`))
							})
						});
						const imageBuffer = fs.readFileSync(outputImg)
						await m.reply({ image: imageBuffer, caption: 'Jangan Malas Lord. Jadilah siswa yang rajin ಠ_ಠ' })
						setLimit(m, db)
					} catch (error) {
						console.error(error)
						m.reply(mess.error)
					} finally {
						if (fs.existsSync(outputImg)) fs.unlinkSync(outputImg);
					}
				}
			}
			break
			
			case 'tinyurl': case 'shorturl': case 'shortlink': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text || !isUrl(text)) return m.reply(`Example: ${prefix + command} https://github.com/nazedev/hitori`)
				let hasil = await fetchApi('/other/tinyurl', { url: text });
				m.reply('Url : ' + hasil.result)
				setLimit(m, db)
			}
			break
			case 'git': case 'gitclone': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!args[0]) return m.reply(`Example: ${prefix + command} https://github.com/nazedev/hitori`)
				if (!isUrl(args[0]) && !args[0].includes('github.com')) return m.reply('Gunakan Url Github!')
				let [, user, repo] = args[0].match(/(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i) || []
				try {
					m.reply({ document: { url: `https://api.github.com/repos/${user}/${repo}/zipball` }, fileName: repo + '.zip', mimetype: 'application/zip' }).catch((e) => m.reply(global.mess.error))
					setLimit(m, db)
				} catch (e) {
					m.reply(global.mess.fail)
				}
			}
			break
			
			// Ai Menu
			case 'ai': case 'google': case 'bard': case 'gemini': {
				if (!text) return m.reply(`Example: ${prefix + command} query`)
				try {
					let hasil = await fetchApi('/ai/gemini-flash-lite', { query: text });
					m.reply(hasil.result.text)
				} catch (e) {
					m.reply(pickRandom(['Fitur Ai sedang bermasalah!','Tidak dapat terhubung ke ai!','Sistem Ai sedang sibuk sekarang!','Fitur sedang tidak dapat digunakan!']))
				}
			}
			break
			
						// Search Menu
		
			case 'play': case 'ytplay': case 'yts': case 'ytsearch': case 'youtubesearch': {
				if (!text) return m.reply(`Example: ${prefix + command} dj komang`)
				m.react('⏳')
				try {
					const res = await yts.search(text);
					const hasil = pickRandom(res.all)
					const teksnya = `*📍Title:* ${hasil.title || 'Tidak tersedia'}\n*✏Description:* ${hasil.description || 'Tidak tersedia'}\n*🌟Channel:* ${hasil.author?.name || 'Tidak tersedia'}\n*⏳Duration:* ${hasil.seconds || 'Tidak tersedia'} second (${hasil.timestamp || 'Tidak tersedia'})\n*🔎Source:* ${hasil.url || 'Tidak tersedia'}\n\n_note : jika ingin mendownload silahkan_\n_pilih ${prefix}ytmp3 url_video atau ${prefix}ytmp4 url_video_`;
					await m.reply({ image: { url: hasil.thumbnail }, caption: teksnya })
				} catch (e) {
					try {
						const res = await fetchApi('/search/youtube', { query: text });
						const hasil = pickRandom(res.result.items)
						const teksnya = `*📍Title:* ${hasil.snippet.title || 'Tidak tersedia'}\n*✏Description:* ${hasil.snippet.description || 'Tidak tersedia'}\n*🌟Channel:* ${hasil.snippet.channelTitle || 'Tidak tersedia'}\n*⏳Duration:* ${hasil.duration || 'Tidak tersedia'}\n*🔎Source:* https://youtu.be/${hasil.id.videoId || 'Tidak tersedia'}\n\n_note : jika ingin mendownload silahkan_\n_pilih ${prefix}ytmp3 url_video atau ${prefix}ytmp4 url_video_`;
						await m.reply({ image: { url: hasil.snippet.thumbnails.medium.url }, caption: teksnya })
					} catch (e) {
						m.reply('Post not available!')
					}
				}
			}
			break

			case 'pinterest': case 'pint': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text) return m.reply(`Example: ${prefix + command} hu tao`)
				try {
					const res = await fetchApi('/search/pinterest', { query: text });
					const hasil = pickRandom(res.result)
					const image = await getBuffer(hasil);
					await m.reply({ image, caption: 'Hasil dari: ' + text })
					setLimit(m, db)
				} catch (e) {
					m.reply('Pencarian tidak ditemukan!');
				}
			}
			break

			case 'spotify': case 'spotifysearch': {
				if (!text) return m.reply(`Example: ${prefix + command} alan walker alone`)
				try {
					let hasil = await fetchApi('/search/spotify', { query: text });
					let txt = hasil.result.map(a => {
						return `*Title : ${a.title}*\n- Artist : ${a.artist}\n- Url : ${a.url}`
					}).join`\n\n`
					m.reply(txt)
				} catch (e) {
					m.reply('Hasil Tidak Ditemukan!')
				}
			}
			break

			
			// Stalker Menu
			case 'wastalk': case 'whatsappstalk': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text) return m.reply(`Example: ${prefix + command} @tag / 628xxx`)
				try {
					let num = m.quoted?.sender || m.mentionedJid?.[0] || text
					if (!num) return m.reply(`Example : ${prefix + command} @tag / 628xxx`)
					num = num.replace(/\D/g, '') + '@s.whatsapp.net'
					if (!(await naze.onWhatsApp(num))[0]?.exists) return m.reply('Nomer tidak terdaftar di WhatsApp!')
					let img = await naze.profilePictureUrl(num, 'image').catch(_ => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60')
					let bio = await naze.fetchStatus(num).catch(_ => { })
					let name = await naze.getName(num)
					let business = await naze.getBusinessProfile(num)
					let parsed = parsePhoneNumber(`+${num.split('@')[0]}`)
					let format = parsed.number ? parsed.number.international : num.split('@')[0];
					let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
					let country = parsed.regionCode ? regionNames.of(parsed.regionCode) : 'Unknown';
					let wea = `WhatsApp Stalk\n\n*° Country :* ${country.toUpperCase()}\n*° Name :* ${name ? name : '-'}\n*° Format Number :* ${format}\n*° Url Api :* wa.me/${num.split('@')[0]}\n*° Mentions :* @${num.split('@')[0]}\n*° Status :* ${bio?.status || '-'}\n*° Date Status :* ${bio?.setAt ? moment(bio.setAt.toDateString()).locale(global.locale).format('LL') : '-'}\n\n${business ? `*WhatsApp Business Stalk*\n\n*° BusinessId :* ${business.wid}\n*° Website :* ${business.website ? business.website : '-'}\n*° Email :* ${business.email ? business.email : '-'}\n*° Category :* ${business.category}\n*° Address :* ${business.address ? business.address : '-'}\n*° Timeone :* ${business.business_hours.timezone ? business.business_hours.timezone : '-'}\n*° Description* : ${business.description ? business.description : '-'}` : '*Standard WhatsApp Account*'}`
					img ? await naze.sendMessage(m.chat, { image: { url: img }, caption: wea, mentions: [num] }, { quoted: m }) : m.reply(wea)
				} catch (e) {
					console.error(e)
					m.reply('Nomer Tidak ditemukan!')
				}
			}
			break
			case 'ghstalk': case 'githubstalk': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text) return m.reply(`Example: ${prefix + command} usernamenya`)
				try {
					const res = await fetchJson('https://api.github.com/users/' + text)
					m.reply({ image: { url: res.avatar_url }, caption: `*Username :* ${res.login}\n*Nickname :* ${res.name || 'Tidak ada'}\n*Bio :* ${res.bio || 'Tidak ada'}\n*ID :* ${res.id}\n*Node ID :* ${res.node_id}\n*Type :* ${res.type}\n*Admin :* ${res.admin ? 'Ya' : 'Tidak'}\n*Company :* ${res.company || 'Tidak ada'}\n*Blog :* ${res.blog || 'Tidak ada'}\n*Location :* ${res.location || 'Tidak ada'}\n*Email :* ${res.email || 'Tidak ada'}\n*Public Repo :* ${res.public_repos}\n*Public Gists :* ${res.public_gists}\n*Followers :* ${res.followers}\n*Following :* ${res.following}\n*Created At :* ${res.created_at} *Updated At :* ${res.updated_at}` })
				} catch (e) {
					m.reply('Username Tidak ditemukan!')
				}
			}
			break
			
			// Downloader Menu
			case 'ytmp3': case 'ytaudio': case 'ytplayaudio': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text) return m.reply(`Example: ${prefix + command} url_youtube`)
				if (!text.includes('youtu')) return m.reply('Url Tidak Mengandung Result Dari Youtube!')
				m.react('⏳')
				try {
					const hasil = await ytMp3(text);
					await m.reply({ audio: { url: hasil.result }, mimetype: 'audio/mpeg' })
					setLimit(m, db)
				} catch (e) {
					try {
						const { result: hasil } = await fetchApi('/download/youtube', { url: text });
						await m.reply({ audio: { url: hasil.download }, mimetype: 'audio/mpeg' })
						setLimit(m, db)
					} catch (e) {
						m.reply(global.mess.fail);
					}
				}
			}
			break
			case 'ytmp4': case 'ytvideo': case 'ytplayvideo': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text) return m.reply(`Example: ${prefix + command} url_youtube`)
				if (!text.includes('youtu')) return m.reply('Url Tidak Mengandung Result Dari Youtube!')
				m.react('⏳')
				let videoPath = null;
				try {
					const hasil = await ytMp4(text);
					videoPath = hasil.result;
					await m.reply({ video: { url: videoPath }, caption: `*📍Title:* ${hasil.title}\n*✏Description:* ${hasil.desc ? hasil.desc : ''}\n*🚀Channel:* ${hasil.channel}\n*🗓Upload at:* ${hasil.uploadDate}`});
					setLimit(m, db)
				} catch (e) {
					try {
						const { result: hasil } = await fetchApi('/download/youtube', { url: text, format: '1080' });
						await m.reply({ document: { url: hasil.download }, mimetype: 'video/mp4', fileName: `${hasil.title || Date.now()}.mp4`, caption: `*📍Title:* ${hasil.title}\n*✏Quality:* ${hasil.quality ? hasil.quality : ''}\n*⏳Duration:* ${hasil.duration}` })
						setLimit(m, db)
					} catch (e) {
						m.reply(global.mess.fail);
					}
				} finally {
					if (videoPath && fs.existsSync(videoPath)) {
						try {
							fs.unlinkSync(videoPath);
						} catch (e) {
							console.error(e);
						}
					}
				}
			}
			break
			case 'ig': case 'instagram': case 'instadl': case 'igdown': case 'igdl': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text) return m.reply(`Example: ${prefix + command} url_instagram`)
				if (!text.includes('instagram.com')) return m.reply('Url Tidak Mengandung Result Dari Instagram!')
				m.react('⏳')
				try {
					let hasil = await fetchApi('/download/instagram2', { url: text })
					if(hasil.result?.urls?.length > 1) {
						await naze.sendAlbumMessage(m.chat, {
							album: hasil.result.urls.map(a => (a.is_video ? { video: { url: a.url }} : { image: { url: a.url }})),
							caption: hasil.result.caption
						}, { quoted: m });
					} else if(hasil.result?.urls?.length == 1) {
						m.reply({ image: { url: hasil.result.urls[0].url }, caption: hasil.result.caption });
					} else m.reply('Postingan Tidak Tersedia atau Privat!')
					setLimit(m, db)
				} catch (e) {
					console.log(e)
					m.reply(global.mess.fail)
				}
			}
			break
			case 'tiktok': case 'tiktokdown': case 'ttdown': case 'ttdl': case 'tt': case 'ttmp4': case 'ttvideo': case 'tiktokmp4': case 'tiktokvideo': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text) return m.reply(`Example: ${prefix + command} url_tiktok`)
				if (!text.includes('tiktok.com')) return m.reply('Url Tidak Mengandung Result Dari Tiktok!')
				try {
					const hasil = await fetchApi('/download/tiktok', { url: text })
					m.react('⏳')
					if (hasil.result.download.type == "video") {
						await m.reply({ video: { url: hasil.result.download?.video?.nowm_hd || hasil.result.download?.video?.nowm }, caption: `*📍Title:* ${hasil.result.desc || '-'}\n*🕓Create At:* ${hasil.result.create_time}\n*🎃Author:* ${hasil.result.author.nickname} (@${hasil.result.author.unique_id})` });
					} else if (hasil.result.download.type == "images") {
						await naze.sendAlbumMessage(m.chat, {
							album: hasil.result.download.images.map(a => ({ image: { url: a.url }})),
							caption: `*📍Title:* ${hasil.result.desc || '-'}\n*🕓Create At:* ${hasil.result.create_time}\n*🎃Author:* ${hasil.result.author.nickname} (@${hasil.result.author.unique_id})`
						}, { quoted: m });
					} else {
						return m.reply('Url Tidak Valid!')
					}
					setLimit(m, db)
				} catch (e) {
					console.log(e)
					m.reply(global.mess.fail)
				}
			}
			break
			case 'ttmp3': case 'tiktokmp3': case 'ttaudio': case 'tiktokaudio': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text) return m.reply(`Example: ${prefix + command} url_tiktok`)
				if (!text.includes('tiktok.com')) return m.reply('Url Tidak Mengandung Result Dari Tiktok!')
				try {
					const hasil = await fetchApi('/download/tiktok', { url: text });
					m.react('⏳')
					await m.reply({ audio: { url: hasil.result.download.music }, mimetype: 'audio/mpeg' })
					setLimit(m, db)
				} catch (e) {
					m.reply(global.mess.fail)
				}
			}
			break
			case 'fb': case 'fbdl': case 'fbdown': case 'facebook': case 'facebookdl': case 'facebookdown': case 'fbdownload': case 'fbmp4': case 'fbvideo': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text) return m.reply(`Example: ${prefix + command} url_facebook`)
				if (!text.includes('facebook.com')) return m.reply('Url Tidak Mengandung Result Dari Facebook!')
				try {
					const hasil = await fetchApi('/download/facebook', { url: text });
					if (!hasil.result.hd && !hasil.result.sd) {
						m.reply('Video Tidak ditemukan!')
					} else {
						m.react('⏳')
						await naze.sendFileUrl(m.chat, hasil.result.hd || hasil.result.sd, `*🎐Title:* ${hasil.result.title}`, m);
					}
					setLimit(m, db)
				} catch (e) {
					m.reply(global.mess.fail)
				}
			}
			break
			case 'mediafire': case 'mf': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text) return m.reply(`Example: ${prefix + command} https://www.mediafire.com/file/xxxxxxxxx/xxxxx.zip/file`)
				if (!isUrl(args[0]) && !args[0].includes('mediafire.com')) return m.reply('Url Invalid!')
				try {
					let { result: res } = await fetchApi('/download/mediafire', { url: text })
					await naze.sendMedia(m.chat, res.link, res.filename, `*MEDIAFIRE DOWNLOADER*\n\n*${setv} Name* : ${res.filename}\n*${setv} Size* : ${res.size}`, m)
					setLimit(m, db)
				} catch (e) {
					m.reply(global.mess.fail)
				}
			}
			break
			case 'spotifydl': {
				if (!isLimit) return m.reply(global.mess.limit)
				if (!text) return m.reply(`Example: ${prefix + command} https://open.spotify.com/track/0JiVRyTJcJnmlwCZ854K4p`)
				if (!isUrl(args[0]) && !args[0].includes('open.spotify.com/track')) return m.reply('Url Invalid!')
				try {
					const { result: hasil } = await fetchApi('/download/spotify', { url: text });
					m.react('⏳')
					await m.reply({ audio: { url: hasil.url }, mimetype: 'audio/mpeg' })
					setLimit(m, db)
				} catch (e) {
					console.log(e)
					m.reply(global.mess.fail)
				}
			}
			break
			
	
			// Menu
			case 'menu': {
				if (args[0] == 'set') {
					if (!isCreator) return m.reply(mess.owner)
					if (['1','2','3'].includes(args[1])) {
						set.template = parseInt(Number(args[1]))
						m.reply('Sukses Mengubah Template Menu')
					} else m.reply(`Template Menu:\n- 1 (Button Menu)\n- 2 (List Menu)\n- 3 (Document Menu)\n\nExample: ${prefix + command} set 1`)
				} else await templateMenu(naze, set.template, m, prefix, setv, db, { locale_day, date, date_time, botNumber, author, packname, isVip, isPremium, ucapanWaktu })
			}
			break
			case 'allmenu': {
				let profile
				try {
					profile = await naze.profilePictureUrl(m.sender, 'image');
				} catch (e) {
					profile = fake.anonim
				}
				const menunya = `
╭──❍「 *USER INFO* 」❍
├ *Nama* : ${m.pushName ? m.pushName : 'Tanpa Nama'}
├ *Id* : @${m.sender.split('@')[0]}
├ *User* : ${isVip ? 'VIP' : isPremium ? 'PREMIUM' : 'FREE'}
├ *Limit* : ${isVip ? 'VIP' : db.users[m.sender].limit }
├ *Money* : ${db.users[m.sender] ? db.users[m.sender].money.toLocaleString('id-ID') : '0'}
╰─┬────❍
╭─┴─❍「 *BOT INFO* 」❍
├ *Nama Bot* : ${set?.botname || 'Naze Bot'}
├ *Powered* : @${'0@s.whatsapp.net'.split('@')[0]}
├ *Owner* : @${ownerNumber[0].split('@')[0]}
├ *Mode* : ${naze.public ? 'Public' : 'Self'}
├ *Prefix* :${set.multiprefix ? '「 MULTI-PREFIX 」' : ' *'+prefix+'*' }
├ *Premium Feature* : 🔸️
╰─┬────❍
╭─┴─❍「 *ABOUT* 」❍
├ *Date* : ${date}
├ *Day* : ${locale_day}
├ *Time* : ${date_time}
╰──────❍
╭──❍「 *BOT* 」❍
│${setv} ${prefix}profile
│${setv} ${prefix}claim
│${setv} ${prefix}buy [item] (nominal)
│${setv} ${prefix}transfer
│${setv} ${prefix}leaderboard
│${setv} ${prefix}request (text)
│${setv} ${prefix}react (emoji)
│${setv} ${prefix}tagme
│${setv} ${prefix}runtime
│${setv} ${prefix}totalfitur
│${setv} ${prefix}speed
│${setv} ${prefix}ping
│${setv} ${prefix}afk
│${setv} ${prefix}rvo (reply pesan viewone)
│${setv} ${prefix}inspect (url gc)
│${setv} ${prefix}addmsg
│${setv} ${prefix}delmsg
│${setv} ${prefix}getmsg
│${setv} ${prefix}listmsg
│${setv} ${prefix}setcmd
│${setv} ${prefix}delcmd
│${setv} ${prefix}listcmd
│${setv} ${prefix}lockcmd
│${setv} ${prefix}q (reply pesan)
│${setv} ${prefix}menfes (62xxx|fake name)
│${setv} ${prefix}confes (62xxx|fake name)
│${setv} ${prefix}roomai
│${setv} ${prefix}jadibot 🔸️
│${setv} ${prefix}stopjadibot
│${setv} ${prefix}listjadibot
│${setv} ${prefix}donasi
│${setv} ${prefix}addsewa
│${setv} ${prefix}delsewa
│${setv} ${prefix}listsewa
╰─┬────❍
╭─┴❍「 *GROUP* 」❍
│${setv} ${prefix}add (62xxx)
│${setv} ${prefix}kick (@tag/62xxx)
│${setv} ${prefix}promote (@tag/62xxx)
│${setv} ${prefix}demote (@tag/62xxx)
│${setv} ${prefix}warn (@tag/62xxx)
│${setv} ${prefix}unwarn (@tag/62xxx)
│${setv} ${prefix}setname (nama baru gc)
│${setv} ${prefix}setdesc (desk)
│${setv} ${prefix}setppgc (reply imgnya)
│${setv} ${prefix}delete (reply pesan)
│${setv} ${prefix}linkgrup
│${setv} ${prefix}revoke
│${setv} ${prefix}tagall
│${setv} ${prefix}pin
│${setv} ${prefix}unpin
│${setv} ${prefix}hidetag
│${setv} ${prefix}totag (reply pesan)
│${setv} ${prefix}listonline
│${setv} ${prefix}group set
│${setv} ${prefix}group (khusus admin)
╰─┬────❍
╭─┴❍「 *SEARCH* 」❍
│${setv} ${prefix}ytsearch (query)
│${setv} ${prefix}spotify (query)
│${setv} ${prefix}pixiv (query)
│${setv} ${prefix}pinterest (query)
│${setv} ${prefix}wallpaper (query)
│${setv} ${prefix}ringtone (query)
│${setv} ${prefix}google (query)
│${setv} ${prefix}gimage (query)
│${setv} ${prefix}npm (query)
│${setv} ${prefix}style (query)
│${setv} ${prefix}cuaca (kota)
│${setv} ${prefix}tenor (query)
│${setv} ${prefix}urban (query)
╰─┬────❍
╭─┴❍「 *DOWNLOAD* 」❍
│${setv} ${prefix}ytmp3 (url)
│${setv} ${prefix}ytmp4 (url)
│${setv} ${prefix}instagram (url)
│${setv} ${prefix}tiktok (url)
│${setv} ${prefix}tiktokmp3 (url)
│${setv} ${prefix}facebook (url)
│${setv} ${prefix}spotifydl (url)
│${setv} ${prefix}mediafire (url)
╰─┬────❍
╭─┴❍「 *QUOTES* 」❍
│${setv} ${prefix}motivasi
│${setv} ${prefix}quotes
│${setv} ${prefix}truth
│${setv} ${prefix}bijak
│${setv} ${prefix}dare
│${setv} ${prefix}bucin
│${setv} ${prefix}renungan
╰─┬────❍
╭─┴❍「 *TOOLS* 」❍
│${setv} ${prefix}get (url) 🔸️
│${setv} ${prefix}hd (reply pesan)
│${setv} ${prefix}toaudio (reply pesan)
│${setv} ${prefix}tomp3 (reply pesan)
│${setv} ${prefix}tovn (reply pesan)
│${setv} ${prefix}toimage (reply pesan)
│${setv} ${prefix}toptv (reply pesan)
│${setv} ${prefix}tourl (reply pesan)
│${setv} ${prefix}tts (textnya)
│${setv} ${prefix}toqr (textnya)
│${setv} ${prefix}brat (textnya)
│${setv} ${prefix}bratvid (textnya)
│${setv} ${prefix}ssweb (url) 🔸️
│${setv} ${prefix}sticker (send/reply img)
│${setv} ${prefix}colong (reply stiker)
│${setv} ${prefix}smeme (send/reply img)
│${setv} ${prefix}dehaze (send/reply img)
│${setv} ${prefix}colorize (send/reply img)
│${setv} ${prefix}hitamkan (send/reply img)
│${setv} ${prefix}emojimix 🙃+💀
│${setv} ${prefix}nulis
│${setv} ${prefix}readmore text1|text2
│${setv} ${prefix}qc (pesannya)
│${setv} ${prefix}translate
│${setv} ${prefix}wasted (send/reply img)
│${setv} ${prefix}triggered (send/reply img)
│${setv} ${prefix}shorturl (urlnya)
│${setv} ${prefix}gitclone (urlnya)
│${setv} ${prefix}fat (reply audio)
│${setv} ${prefix}fast (reply audio)
│${setv} ${prefix}bass (reply audio)
│${setv} ${prefix}slow (reply audio)
│${setv} ${prefix}tupai (reply audio)
│${setv} ${prefix}deep (reply audio)
│${setv} ${prefix}robot (reply audio)
│${setv} ${prefix}blown (reply audio)
│${setv} ${prefix}reverse (reply audio)
│${setv} ${prefix}smooth (reply audio)
│${setv} ${prefix}earrape (reply audio)
│${setv} ${prefix}nightcore (reply audio)
│${setv} ${prefix}getexif (reply sticker)
╰─┬────❍
╭─┴❍「 *AI* 」❍
│${setv} ${prefix}ai (query)
│${setv} ${prefix}gemini (query)
│${setv} ${prefix}glm (query)
│${setv} ${prefix}grok (query)
│${setv} ${prefix}claude (query)
│${setv} ${prefix}archipelago (query)
│${setv} ${prefix}deepseek (query)
│${setv} ${prefix}txt2img (query)
╰─┬────❍
╭─┴❍「 *ANIME* 」❍
│${setv} ${prefix}waifu
│${setv} ${prefix}neko
╰─┬────❍
╭─┴❍「 *GAME* 」❍
│${setv} ${prefix}tictactoe
│${setv} ${prefix}suit
│${setv} ${prefix}slot
│${setv} ${prefix}math (level)
│${setv} ${prefix}begal
│${setv} ${prefix}ulartangga
│${setv} ${prefix}blackjack
│${setv} ${prefix}catur
│${setv} ${prefix}casino (nominal)
│${setv} ${prefix}samgong (nominal)
│${setv} ${prefix}rampok (@tag)
│${setv} ${prefix}tekateki
│${setv} ${prefix}tebaklirik
│${setv} ${prefix}tebakkata
│${setv} ${prefix}tebakbom
│${setv} ${prefix}susunkata
│${setv} ${prefix}colorblind
│${setv} ${prefix}tebakkimia
│${setv} ${prefix}caklontong
│${setv} ${prefix}tebakangka
│${setv} ${prefix}tebaknegara
│${setv} ${prefix}tebakgambar
│${setv} ${prefix}tebakbendera
╰─┬────❍
╭─┴❍「 *FUN* 」❍
│${setv} ${prefix}coba
│${setv} ${prefix}dadu
│${setv} ${prefix}bisakah (text)
│${setv} ${prefix}apakah (text)
│${setv} ${prefix}kapan (text)
│${setv} ${prefix}siapa (text)
│${setv} ${prefix}kerangajaib (text)
│${setv} ${prefix}cekmati (nama lu)
│${setv} ${prefix}ceksifat
│${setv} ${prefix}cekkhodam (nama lu)
│${setv} ${prefix}rate (reply pesan)
│${setv} ${prefix}jodohku
│${setv} ${prefix}jadian
│${setv} ${prefix}fitnah
│${setv} ${prefix}halah (text)
│${setv} ${prefix}hilih (text)
│${setv} ${prefix}huluh (text)
│${setv} ${prefix}heleh (text)
│${setv} ${prefix}holoh (text)
╰─┬────❍
╭─┴❍「 *RANDOM* 」❍
│${setv} ${prefix}coffe
╰─┬────❍
╭─┴❍「 *STALKER* 」❍
│${setv} ${prefix}wastalk
│${setv} ${prefix}githubstalk
╰─┬────❍
╭─┴❍「 *OWNER* 」❍
│${setv} ${prefix}bot [set]
│${setv} ${prefix}setbio
│${setv} ${prefix}setppbot
│${setv} ${prefix}join
│${setv} ${prefix}leave
│${setv} ${prefix}block
│${setv} ${prefix}listblock
│${setv} ${prefix}openblock
│${setv} ${prefix}listpc
│${setv} ${prefix}listgc
│${setv} ${prefix}ban
│${setv} ${prefix}unban
│${setv} ${prefix}mute
│${setv} ${prefix}unmute
│${setv} ${prefix}creategc
│${setv} ${prefix}clearchat
│${setv} ${prefix}addprem
│${setv} ${prefix}delprem
│${setv} ${prefix}listprem
│${setv} ${prefix}addlimit
│${setv} ${prefix}adduang
│${setv} ${prefix}setbotmessages
│${setv} ${prefix}setbotauthor
│${setv} ${prefix}setbotname
│${setv} ${prefix}setbotpackname
│${setv} ${prefix}setapikey
│${setv} ${prefix}setbotlimit
│${setv} ${prefix}setbotmoney
│${setv} ${prefix}setlocale
│${setv} ${prefix}settimezone
│${setv} ${prefix}addprefix
│${setv} ${prefix}delprefix
│${setv} ${prefix}addbadword
│${setv} ${prefix}delbadword
│${setv} ${prefix}addowner
│${setv} ${prefix}delowner
│${setv} ${prefix}whitelist
│${setv} ${prefix}getmsgstore
│${setv} ${prefix}bot --settings
│${setv} ${prefix}bot settings
│${setv} ${prefix}getsession
│${setv} ${prefix}delsession
│${setv} ${prefix}delsampah
│${setv} ${prefix}upsw
│${setv} ${prefix}backup
│${setv} $
│${setv} >
│${setv} <
╰──────❍`
				await naze.sendMessageV3(m.chat, {
					text: menunya,
					title: ucapanWaktu,
					description: packname,
					thumbnailUrl: profile,
					sourceUrl: my.gh,
					mentions: [m.sender, '0@s.whatsapp.net', ownerNumber[0] + '@s.whatsapp.net'],
					contextInfo: {
						forwardingScore: 1,
						isForwarded: true,
						forwardedNewsletterMessageInfo: {
							newsletterJid: my.ch,
							serverMessageId: null,
							newsletterName: 'Join For More Info'
						}
					}
				})
			}
			break
			case 'botmenu': {
				m.reply(`
╭──❍「 *BOT* 」❍
│${setv} ${prefix}profile
│${setv} ${prefix}claim
│${setv} ${prefix}buy [item] (nominal)
│${setv} ${prefix}transfer
│${setv} ${prefix}leaderboard
│${setv} ${prefix}request (text)
│${setv} ${prefix}react (emoji)
│${setv} ${prefix}tagme
│${setv} ${prefix}runtime
│${setv} ${prefix}totalfitur
│${setv} ${prefix}speed
│${setv} ${prefix}ping
│${setv} ${prefix}afk
│${setv} ${prefix}rvo (reply pesan viewone)
│${setv} ${prefix}inspect (url gc)
│${setv} ${prefix}addmsg
│${setv} ${prefix}delmsg
│${setv} ${prefix}getmsg
│${setv} ${prefix}listmsg
│${setv} ${prefix}setcmd
│${setv} ${prefix}delcmd
│${setv} ${prefix}listcmd
│${setv} ${prefix}lockcmd
│${setv} ${prefix}q (reply pesan)
│${setv} ${prefix}menfes (62xxx|fake name)
│${setv} ${prefix}confes (62xxx|fake name)
│${setv} ${prefix}roomai
│${setv} ${prefix}jadibot 🔸️
│${setv} ${prefix}stopjadibot
│${setv} ${prefix}listjadibot
│${setv} ${prefix}donasi
│${setv} ${prefix}addsewa
│${setv} ${prefix}delsewa
│${setv} ${prefix}listsewa
╰──────❍`)
			}
			break
			case 'groupmenu': {
				m.reply(`
╭──❍「 *GROUP* 」❍
│${setv} ${prefix}add (62xxx)
│${setv} ${prefix}kick (@tag/62xxx)
│${setv} ${prefix}promote (@tag/62xxx)
│${setv} ${prefix}demote (@tag/62xxx)
│${setv} ${prefix}warn (@tag/62xxx)
│${setv} ${prefix}unwarn (@tag/62xxx)
│${setv} ${prefix}setname (nama baru gc)
│${setv} ${prefix}setdesc (desk)
│${setv} ${prefix}setppgc (reply imgnya)
│${setv} ${prefix}delete (reply pesan)
│${setv} ${prefix}linkgrup
│${setv} ${prefix}revoke
│${setv} ${prefix}tagall
│${setv} ${prefix}pin
│${setv} ${prefix}unpin
│${setv} ${prefix}hidetag
│${setv} ${prefix}totag (reply pesan)
│${setv} ${prefix}listonline
│${setv} ${prefix}group set
│${setv} ${prefix}group (khusus admin)
╰──────❍`)
			}
			break
			case 'searchmenu': {
				m.reply(`
╭──❍「 *SEARCH* 」❍
│${setv} ${prefix}ytsearch (query)
│${setv} ${prefix}spotify (query)
│${setv} ${prefix}pixiv (query)
│${setv} ${prefix}pinterest (query)
│${setv} ${prefix}wallpaper (query)
│${setv} ${prefix}ringtone (query)
│${setv} ${prefix}google (query)
│${setv} ${prefix}gimage (query)
│${setv} ${prefix}npm (query)
│${setv} ${prefix}style (query)
│${setv} ${prefix}cuaca (kota)
│${setv} ${prefix}tenor (query)
│${setv} ${prefix}urban (query)
╰──────❍`)
			}
			break
			case 'downloadmenu': {
				m.reply(`
╭──❍「 *DOWNLOAD* 」❍
│${setv} ${prefix}ytmp3 (url)
│${setv} ${prefix}ytmp4 (url)
│${setv} ${prefix}instagram (url)
│${setv} ${prefix}tiktok (url)
│${setv} ${prefix}tiktokmp3 (url)
│${setv} ${prefix}facebook (url)
│${setv} ${prefix}spotifydl (url)
│${setv} ${prefix}mediafire (url)
╰──────❍`)
			}
			break
			case 'quotesmenu': {
				m.reply(`
╭──❍「 *QUOTES* 」❍
│${setv} ${prefix}motivasi
│${setv} ${prefix}quotes
│${setv} ${prefix}truth
│${setv} ${prefix}bijak
│${setv} ${prefix}dare
│${setv} ${prefix}bucin
│${setv} ${prefix}renungan
╰──────❍`)
			}
			break
			case 'toolsmenu': {
				m.reply(`
╭──❍「 *TOOLS* 」❍
│${setv} ${prefix}get (url) 🔸️
│${setv} ${prefix}hd (reply pesan)
│${setv} ${prefix}toaudio (reply pesan)
│${setv} ${prefix}tomp3 (reply pesan)
│${setv} ${prefix}tovn (reply pesan)
│${setv} ${prefix}toimage (reply pesan)
│${setv} ${prefix}toptv (reply pesan)
│${setv} ${prefix}tourl (reply pesan)
│${setv} ${prefix}tts (textnya)
│${setv} ${prefix}toqr (textnya)
│${setv} ${prefix}brat (textnya)
│${setv} ${prefix}bratvid (textnya)
│${setv} ${prefix}ssweb (url) 🔸️
│${setv} ${prefix}sticker (send/reply img)
│${setv} ${prefix}colong (reply stiker)
│${setv} ${prefix}smeme (send/reply img)
│${setv} ${prefix}dehaze (send/reply img)
│${setv} ${prefix}colorize (send/reply img)
│${setv} ${prefix}hitamkan (send/reply img)
│${setv} ${prefix}emojimix 😂+💀
│${setv} ${prefix}nulis
│${setv} ${prefix}readmore text1|text2
│${setv} ${prefix}qc (pesannya)
│${setv} ${prefix}translate
│${setv} ${prefix}wasted (send/reply img)
│${setv} ${prefix}triggered (send/reply img)
│${setv} ${prefix}shorturl (urlnya)
│${setv} ${prefix}gitclone (urlnya)
│${setv} ${prefix}fat (reply audio)
│${setv} ${prefix}fast (reply audio)
│${setv} ${prefix}bass (reply audio)
│${setv} ${prefix}slow (reply audio)
│${setv} ${prefix}tupai (reply audio)
│${setv} ${prefix}deep (reply audio)
│${setv} ${prefix}robot (reply audio)
│${setv} ${prefix}blown (reply audio)
│${setv} ${prefix}reverse (reply audio)
│${setv} ${prefix}smooth (reply audio)
│${setv} ${prefix}earrape (reply audio)
│${setv} ${prefix}nightcore (reply audio)
│${setv} ${prefix}getexif (reply sticker)
╰──────❍`)
			}
			break
			case 'aimenu': {
				m.reply(`
╭──❍「 *AI* 」❍
│${setv} ${prefix}ai (query)
│${setv} ${prefix}gemini (query)
│${setv} ${prefix}glm (query)
│${setv} ${prefix}grok (query)
│${setv} ${prefix}claude (query)
│${setv} ${prefix}archipelago (query)
│${setv} ${prefix}deepseek (query)
│${setv} ${prefix}txt2img (query)
╰──────❍`)
			}
			break
			case 'randommenu': {
				m.reply(`
╭──❍「 *RANDOM* 」❍
│${setv} ${prefix}coffe
╰──────❍`)
			}
			break
			case 'stalkermenu': {
				m.reply(`
╭──❍「 *STALKER* 」❍
│${setv} ${prefix}wastalk
│${setv} ${prefix}githubstalk
╰──────❍`)
			}
			break
			case 'animemenu': {
				m.reply(`
╭──❍「 *ANIME* 」❍
│${setv} ${prefix}waifu
│${setv} ${prefix}neko
╰──────❍`)
			}
			break
			case 'gamemenu': {
				m.reply(`
╭──❍「 *GAME* 」❍
│${setv} ${prefix}tictactoe
│${setv} ${prefix}suit
│${setv} ${prefix}slot
│${setv} ${prefix}math (level)
│${setv} ${prefix}begal
│${setv} ${prefix}ulartangga
│${setv} ${prefix}blackjack
│${setv} ${prefix}catur
│${setv} ${prefix}casino (nominal)
│${setv} ${prefix}samgong (nominal)
│${setv} ${prefix}rampok (@tag)
│${setv} ${prefix}tekateki
│${setv} ${prefix}tebaklirik
│${setv} ${prefix}tebakkata
│${setv} ${prefix}tebakbom
│${setv} ${prefix}susunkata
│${setv} ${prefix}colorblind
│${setv} ${prefix}tebakkimia
│${setv} ${prefix}caklontong
│${setv} ${prefix}tebakangka
│${setv} ${prefix}tebaknegara
│${setv} ${prefix}tebakgambar
│${setv} ${prefix}tebakbendera
╰──────❍`)
			}
			break
			case 'funmenu': {
				m.reply(`
╭──❍「 *FUN* 」❍
│${setv} ${prefix}coba
│${setv} ${prefix}dadu
│${setv} ${prefix}bisakah (text)
│${setv} ${prefix}apakah (text)
│${setv} ${prefix}kapan (text)
│${setv} ${prefix}siapa (text)
│${setv} ${prefix}kerangajaib (text)
│${setv} ${prefix}cekmati (nama lu)
│${setv} ${prefix}ceksifat
│${setv} ${prefix}cekkhodam (nama lu)
│${setv} ${prefix}rate (reply pesan)
│${setv} ${prefix}jodohku
│${setv} ${prefix}jadian
│${setv} ${prefix}fitnah
│${setv} ${prefix}halah (text)
│${setv} ${prefix}hilih (text)
│${setv} ${prefix}huluh (text)
│${setv} ${prefix}heleh (text)
│${setv} ${prefix}holoh (text)
╰──────❍`)
			}
			break
			case 'ownermenu': {
				m.reply(`
╭──❍「 *OWNER* 」❍
│${setv} ${prefix}bot [set]
│${setv} ${prefix}setbio
│${setv} ${prefix}setppbot
│${setv} ${prefix}join
│${setv} ${prefix}leave
│${setv} ${prefix}block
│${setv} ${prefix}listblock
│${setv} ${prefix}openblock
│${setv} ${prefix}listpc
│${setv} ${prefix}listgc
│${setv} ${prefix}ban
│${setv} ${prefix}unban
│${setv} ${prefix}mute
│${setv} ${prefix}unmute
│${setv} ${prefix}creategc
│${setv} ${prefix}clearchat
│${setv} ${prefix}addprem
│${setv} ${prefix}delprem
│${setv} ${prefix}listprem
│${setv} ${prefix}addlimit
│${setv} ${prefix}adduang
│${setv} ${prefix}setbotmessages
│${setv} ${prefix}setbotauthor
│${setv} ${prefix}setbotname
│${setv} ${prefix}setbotpackname
│${setv} ${prefix}setapikey
│${setv} ${prefix}setbotlimit
│${setv} ${prefix}setbotmoney
│${setv} ${prefix}setlocale
│${setv} ${prefix}settimezone
│${setv} ${prefix}addprefix
│${setv} ${prefix}delprefix
│${setv} ${prefix}addbadword
│${setv} ${prefix}delbadword
│${setv} ${prefix}addowner
│${setv} ${prefix}delowner
│${setv} ${prefix}whitelist
│${setv} ${prefix}getmsgstore
│${setv} ${prefix}bot --settings
│${setv} ${prefix}bot settings
│${setv} ${prefix}getsession
│${setv} ${prefix}delsession
│${setv} ${prefix}delsampah
│${setv} ${prefix}upsw
│${setv} ${prefix}backup
│${setv} $
│${setv} >
│${setv} <
╰──────❍`)
			}
			break

			default:
			if (budy.startsWith('>')) {
				if (!isCreator) return
				try {
					let evaled = await eval(budy.slice(2))
					if (typeof evaled !== 'string') evaled = util.inspect(evaled)
					await m.reply(evaled)
				} catch (err) {
					await m.reply(String(err))
				}
			}
			if (budy.startsWith('<')) {
				if (!isCreator) return
				try {
					let evaled = await eval(`(async () => { ${budy.slice(2)} })()`)
					if (typeof evaled !== 'string') evaled = util.inspect(evaled)
					await m.reply(evaled)
				} catch (err) {
					await m.reply(String(err))
				}
			}
			if (budy.startsWith('$')) {
				if (!isCreator) return
				if (!text) return
				exec(budy.slice(2), (err, stdout) => {
					if (err) return m.reply(`${err}`)
					if (stdout) return m.reply(stdout)
				})
			}
			if ((!isCmd || isCreator) && budy.toLowerCase() != undefined) {
				if (m.chat.endsWith('broadcast')) return
				if (!(budy.toLowerCase() in db.database)) return
				await naze.relayMessage(m.chat, db.database[budy.toLowerCase()], {})
			}
		}
	} catch (e) {
		console.log(e);
		if (e?.message?.includes('No sessions') || e?.message?.includes('ffmpeg exited with code') || e?.code === 'ERR_FR_MAX_BODY_LENGTH_EXCEEDED' || e?.message?.includes('maxBodyLength limit') || e?.message?.includes('rate-overlimit')) return;
		const errorKey = e?.code || e?.name || e?.message?.slice(0, 100) || 'unknown_error';
		const now = Date.now();
		if (!errorCache[errorKey]) errorCache[errorKey] = [];
		errorCache[errorKey] = errorCache[errorKey].filter(ts => now - ts < 600000);
		if (errorCache[errorKey].length >= 3) return;
		errorCache[errorKey].push(now);
		const isAxiosError = e?.isAxiosError || !!e?.response; 
		const statusCode = e?.response?.status || e?.statusCode || e?.data;
		const errorUrl = e?.config?.url || e?.request?.host || '';
		if (statusCode === 500) {
			m.reply('Server API Error: Terjadi gangguan pada server tujuan.');
		} else if (statusCode === 429) {
			if (errorUrl.includes('api.naze.biz.id')) {
				return m.reply('Limit Reached: ' + mess.key);
			} else m.reply('Limit Reached (Sistem/WA): Terlalu banyak permintaan.\nLog Error Telah dikirim ke Owner');
		} else if (statusCode === 403) {
			if (isAxiosError) {
				if (errorUrl.includes('api.naze.biz.id')) {
					return m.reply('Akses Khusus Premium!');
				} else m.reply('API Error: Akses ke server API ditolak (403 Forbidden).');
			} else console.log(chalk.yellowBright('[SYSTEM] Akses grup ditolak (Baileys 403 / Forbidden).'));
		} else if (statusCode === 401) {
			if (isAxiosError) {
				if (errorUrl.includes('api.naze.biz.id')) {
					return m.reply('Invalid Apikey!');
				} else m.reply('API Error: Akses ke server API ditolak (401 Unauthorized).');
			} else console.log(chalk.yellowBright('[SYSTEM] Akses ditolak (401 Unauthorized).'));
		} else m.reply('Error: ' + (e?.name || e?.code || e?.message || 'Terjadi kesalahan tidak diketahui') + '\nLog Error Telah dikirim ke Owner\n\n');
		return naze.sendFromOwner(ownerNumber, `Halo sayang, sepertinya ada yang error nih, jangan lupa diperbaiki ya\n\nVersion : *${require('./package.json').version}*\nType : *${m.type || errorKey}*\n\n*Log error:*\n\n` + util.format(e), m, { contextInfo: { isForwarded: true }})
	}
}

export default naze;