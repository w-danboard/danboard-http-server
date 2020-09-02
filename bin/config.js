const config = {
  // 设置端口号
  port: {
    option: '-p, --port <val>',
    description: 'set your server port',
    usage: 3000
  },
  // 可以配置目录
  directory: {
    option: '-d, --directory <val>',
    description: 'set your start directory',
    usage: process.cwd()
  },
  // 可以配置主机名
  host: {
    option: '-h, --host <val>',
    description: 'set your hostname',
    usage: '127.0.0.1'
  }
}

module.exports = config