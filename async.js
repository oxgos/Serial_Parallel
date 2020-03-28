/**
 * 社区控制流程工具
 * Async、Step、Seq
 * PS: Windows里没有tar和curl命令,例子在Windows里没法使用
 */

const async = require('async')
const exec  = require('child_process').exec

function downloadNodeVersion(version, destination, callback) {
	const url = `http://nodejs.org/dist/v${version}/node-v${version}.tar.gz`
	const filepath = `${destination}/${version}.tgz`
	exec(`curl ${url} > ${filepath}`, callback)
}

async.series([
	callback => {
		// 并行下载
		async.parallel([
			callback => {
				console.log('Dowdloading Node v4.4.7...')
				downloadNodeVersion('4.4.7', '/tmp', callback)
			},
			callback => {
				console.log('Dowdloading Node v6.3.0...')
				downloadNodeVersion('6.3.0', '/tmp', callback)
			}
		], callback)
	},
	callback => {
		console.log('Creating archive of downloaded files...')
		exec(
			'tar cvf node_distros.tar /tmp/4.4.7.tgz /tmp/6.3.0.tgz',
			err => {
				if (err) throw err
				console.log('All done')
				callback()
			}
		)
	}
], (err, results) => {
	if (err) throw err
	console.log(results)
})
