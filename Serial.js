/**
 * 串行实现
 * RSS预订数据: http://blog.nodejs.org/feed/
 */
const request    = require('request')
const fs         = require('fs')
const htmlparser = require('htmlparser')
const fileUrl   = './serial.txt'

// 确保rss文件存在
function checkForRSSFile() {
	fs.exists(fileUrl, (exists) => {
		if(!exists)
			return next(new Error(`Missing RSS file: ${fileUrl}`))
		next(null, fileUrl)
	})
}

// 读取并解析文件
function readRSSFile(fileUrl) {
	fs.readFile(fileUrl, (err, feedList) => {
		if(err) return next(err)
		feedList = feedList
			.toString()
			.replace(/^\s+|\s+$/g, '')
			.split('\n')

		const random = Math.floor(Math.random() * feedList.length)
		next(null, feedList[random])
	})
}

// 向预订源url获取数据
function downloadRSSFeed(feedUrl) {
	request({ uri: feedUrl }, (err, res, body) => {
		if(err) return next(err)
		if(res.statusCode !== 200)
			return next(new Error('Abnormal response status code'))
		next(null, body)
	})
}

// 将预订源数据解析到数据中
function parseRSSFeed(rss) {
	const handler = new htmlparser.RssHandler()
	const parser  = new htmlparser.Parse(handler)
	parser.parseComplete(rss)
	if(!handler.dom.items.length)
		return next(new Error('No RSS items found'))
	const item = handler.dom.items.shift()
	console.log(item.title)
	console.log(item.link)
}

const tasks = [
	checkForRSSFile,
	readRSSFile,
	downloadRSSFeed,
	parseRSSFeed
]

function next(err, result) {
	if (err) throw err
	const currentTask = tasks.shift()
	if (currentTask) {
		currentTask(result)
	}
}

next()
