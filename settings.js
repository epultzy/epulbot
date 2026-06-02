import fs from 'fs';
import chalk from 'chalk';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

/*
	* Created By Naze
	* Follow https://github.com/nazedev
	* WhatsApp : https://whatsapp.com/channel/0029VaWOkNm7DAWtkvkJBK43
*/

//~~~~~~~~~~~~< GLOBAL SETTINGS >~~~~~~~~~~~~\\

global.owner = ["60107814527"] // ['601xxxxxx', '601xxxxxx'] for 2 or more owners
global.author = 'EpulTzy'
global.botname = 'Epul Bot'
global.packname = 'WhatsApp Bot'
global.timezone = 'Asia/Kuala_Lumpur' // Change using command .settimezone
global.locale = 'en' // Change using command .setlocale
global.listprefix = ["+","!","."]
global.defaultAdminKey = crypto.randomBytes(5).toString("hex");

global.listv = ['•','●','■','✿','▲','➩','➢','➣','➤','✦','✧','△','❀','○','□','♤','♡','◇','♧','々','〆']
global.databasePath = 'database.json' // Enter mongodb url here if using mongodb. Format : 'mongodb+srv://...'
global.storePath = 'baileys_store.json' // Enter mongodb url here if using mongodb. Format : 'mongodb+srv://...'
global.pairingCode = true
global.botNumber = '' // If using panel, enter number here if session not yet obtained. Format : '601xxxxxx'

global.fake = {
	anonymous: 'https://telegra.ph/file/95670d63378f7f4210f03.png',
	thumbnailUrl: 'https://epulxyz.wordpress.com/wp-content/uploads/2026/06/file_000000004bb07208a7ec9ea616bcc34c.png',
	thumbnail: fs.readFileSync('./src/media/naze.png'),
	document: fs.readFileSync('./src/media/fake.pdf'),
	documentTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/pdf'],
}

global.my = {
	youtube: "https://youtube.com/c/EpulTzy",
	github: "https://github.com/epultzy",
	groupChat: "https://chat.whatsapp.com/DzZXH5it4i7LbvGVgj2KSn",
	tiktok: "https://www.tiktok.com/@xyzcjui?_r=1&_t=ZS-96rUvIisvCu"
}

global.limit = {
	free: 20,
	premium: 999,
	vip: 900
}

global.currency = {
	free: 10000,
	premium: 1000000,
	vip: 10000000
}

global.mess = {
	apiKey: "API Key limit reached! Please Upgrade: https://naze.biz.id",
	ownerOnly: "Owner Only!",
	adminOnly: "Admin Only!",
	botMustBeAdmin: "Bot must be Admin!",
	numberNotRegistered: "This number is not registered on WhatsApp!",
	groupOnly: "Group Chat Only!",
	privateOnly: "Private Chat Only!",
	replyToMessage: "Please reply to the message!",
	limitReached: "Limit reached!",
	premiumOnly: "Premium User Only!",
	provideText: "Please enter the text!",
	provideMedia: "Please send the media!",
	processing: "Processing...",
	failed: "Failed!",
	error: "An error occurred!",
	success: "Success!"
}

global.APIs = {
	naze: 'https://api.naze.biz.id',
	neosantara: 'https://api.neosantara.xyz/v1',
}
global.APIKeys = {
	'https://api.naze.biz.id': 'nz-298327ff62',
	'https://api.neosantara.xyz/v1': 'API_KEY_NEOSANTARA_AI',
}

// Others
global.prayerSchedule = {
	Fajr: '04:30',
	Dhuhr: '12:06',
	Asr: '15:21',
	Maghrib: '18:08',
	Isha: '19:00'
}

global.badWords = ["dongo","konsol"] // add other bad words here. example: ['badword1','badword2']
global.maxChatLength = 1000

fs.watchFile(__filename, async () => {
	console.log(chalk.yellowBright(`[UPDATE] ${__filename}`))
});
