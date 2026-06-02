import fs from 'fs';
import chalk from 'chalk';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

/*
	* Create By Naze
	* Follow https://github.com/nazedev
	* Whatsapp : https://whatsapp.com/channel/0029VaWOkNm7DAWtkvkJBK43
*/

//~~~~~~~~~~~~< GLOBAL SETTINGS >~~~~~~~~~~~~\\

global.owner = ["60107814527"] // ['628','628'] 2 owner atau lebih
global.author = 'EpulTzy'
global.botname = 'Epul Bot'
global.packname = 'Bot WhatsApp'
global.timezone = 'Asia/Jakarta' // Ganti pakai command .settimezone
global.locale = 'en' // Ganti pakai command .setlocale
global.listprefix = ["+","!","."]
global.defaultAdminKey = crypto.randomBytes(5).toString("hex");

global.listv = ['•','●','■','✿','▲','➩','➢','➣','➤','✦','✧','△','❀','○','□','♤','♡','◇','♧','々','〆']
global.tempatDB = 'database.json' // Taruh url mongodb di sini jika menggunakan mongodb. Format : 'mongodb+srv://...'
global.tempatStore = 'baileys_store.json' // Taruh url mongodb di sini jika menggunakan mongodb. Format : 'mongodb+srv://...'
global.pairing_code = true
global.number_bot = '' // Kalo pake panel bisa masukin nomer di sini, jika belum ambil session. Format : '628xx'

global.fake = {
	anonim: 'https://telegra.ph/file/95670d63378f7f4210f03.png',
	thumbnailUrl: 'https://epulxyz.wordpress.com/wp-content/uploads/2026/06/file_000000004bb07208a7ec9ea616bcc34c.png',
	thumbnail: fs.readFileSync('./src/media/naze.png'),
	docs: fs.readFileSync('./src/media/fake.pdf'),
	listfakedocs: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/pdf'],
}

global.my = {
	yt: "https://youtube.com/c/EpulTzy",
	gh: "https://github.com/epultzy",
	gc: "hhttps://chat.whatsapp.com/DzZXH5it4i7LbvGVgj2KSn",
	ch: "12@newsletter"
}

global.limit = {
	free: 20,
	premium: 999,
	vip: 900
}

global.money = {
	free: 10000,
	premium: 1000000,
	vip: 10000000
}

global.mess = {
	key: "API key limit reached! Please upgrade: https://naze.biz.id",
owner: "Owner only!",
admin: "Admin only!",
botAdmin: "Bot must be an admin!",
onWa: "This number is not registered on WhatsApp!",
group: "Group chat only!",
private: "Private chat only!",
quoted: "Please reply to the message!",
limit: "Limit reached!",
prem: "Premium users only!",
text: "Please enter the text!",
media: "Please send the media!",
wait: "Processing...",
fail: "Failed!",
error: "Error!",
done: "Success!"
}

global.APIs = {
	naze: 'https://api.naze.biz.id',
	neosantara: 'https://api.neosantara.xyz/v1',
}
global.APIKeys = {
	'https://api.naze.biz.id': 'nz-298327ff62',
	'https://api.neosantara.xyz/v1': 'API_KEY_NEOSANTARA_AI',
}

// Lainnya
global.jadwalSholat = {
	Subuh: '04:30',
	Dzuhur: '12:06',
	Ashar: '15:21',
	Maghrib: '18:08',
	Isya: '19:00'
}

global.badWords = ["dongo","konsol"] // input kata-kata toxic yg lain. ex: ['dongo','dongonya']
global.chatLength = 1000

fs.watchFile(__filename, async () => {
	console.log(chalk.yellowBright(`[UPDATE] ${__filename}`))
});