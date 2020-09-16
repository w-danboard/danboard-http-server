const config = {
  // 配置端口号
  port: {
    option: '-p, --port <val>',
    description: 'set your server port',
    usage: 3000
  },
  // 配置主机名
  host: {
    option: '-h, --host <val>',
    description: 'set your hostname',
    usage: '127.0.0.1'
  },
  // 配置目录
  directory: {
    option: '-d, --directory <val>',
    description: 'set your start directory',
    usage: process.cwd()
  },
  // 配置是否支持GZIP压缩
  gzip: {
    option: '-g, --gzip <val>',
    description: 'set whether your support gzip',
    usage: true
  },
  // 配置是否支持缓存
  cache: {
    option: '-c, --cache <val>',
    description: 'set whether your support cache',
    usage: true
  }
}

module.exports = config