// --------------核心模块--------------
const http = require('http')
const fs = require('fs').promises
const { createReadStream, readFileSync } = require('fs')
const path = require('path')
const url = require('url')

// --------------第三方模块--------------
const ejs = require('ejs')
const debug = require('debug')('server')
const mime = require('mime')
const chalk = require('chalk')

const template = readFileSync(path.resolve(__dirname, 'template.ejs'), 'utf8')

debug(chalk.blackBright('-----------------------hello'))

class Server {
  constructor (config) {
    this.port = config.port
    this.directory = config.directory
    this.host = config.host
    this.isSupportGzip = config.gzip
    this.template = template
  }
  async handleRequest (req, res) {
    // 让this指向server实例
    let { pathname } = url.parse(req.url)
    pathname = decodeURIComponent(pathname)

    // 通过路径找到这个文件返回
    const filePath = path.join(this.directory, pathname)
    
    // 判断文件是否存在
    try {
      let statObj = await fs.stat(filePath)
      if (statObj.isFile()) {
        // 如果是文件
        this.sendFile(req, res, filePath, statObj)
      } else {
        // 如果是文件夹，文件夹会先尝试找index.html
        let concatFilePath = path.join(filePath, 'index.html')
        // 再次判断文件是否存在
        try {
          // 如果存在html
          await fs.stat(concatFilePath)
          this.sendFile(req, res, concatFilePath, statObj) 
        } catch (e) {
          // 不存在html 需列出目录结构
          this.showList(req, res, filePath, pathname)
        }
      }
    } catch (e) {
      this.sendError(res, e)
    }

  }
  async showList (req, res, filePath, pathname) {
    // 读取目录包含的信息
    let dirs = await fs.readdir(filePath)
    debug(chalk.red(dirs, '需要渲染的列表'))
    // 渲染列表 [异步渲染]
    try {
      const parseObj = dirs.map(item => {
        return {
          dir: item,
          href: path.join(pathname, item)
        }
      })
      const r = await ejs.render(this.template, { dirs: parseObj }, { async: true })
      res.setHeader('Content-Type', 'text/html;charset=utf-8')
      res.end(r)
    } catch (e) {
      this.sendError(res, e)
    }
  }
  gzip (req, res, filePath, statObj) {
    if (req.headers['accept-encoding'] && req.headers['accept-encoding'].includes('gzip')) {
      res.setHeader('content-encoding', 'gzip')
      return require('zlib').createGzip() // 创建转换流
    }
    return false
  }
  sendFile (req, res, filePath, statObj) {
    // 读取文件 进行响应
    res.setHeader('Content-Type', mime.getType(filePath)+';charset=utf-8')
    // 使用gzip压缩之前 需要看下浏览器是否支持
    const gzip = this.gzip(req, res, filePath, statObj)
    if (gzip && this.isSupportGzip !== 'false') { // 终端设置的值false会被当成字符串，所以此处这样判断
      createReadStream(filePath).pipe(gzip).pipe(res)
    } else {
      createReadStream(filePath).pipe(res)
    }
  }
  // 用来处理错误信息
  sendError (res, e) {
    debug(e)
    res.statusCode = 404
    res.end('Not Foud')
  }
  start () {
    const server = http.createServer(this.handleRequest.bind(this))
    server.listen(this.port, this.host, () => {
      console.log(chalk.yellow(`Starting up danboard-http-server, serving ${this.directory}\r\n`))
      console.log(chalk.green(`http://${this.host}:${this.port}`))
    })
  }
}

module.exports = Server

