#! /usr/bin/env node

const { program } = require('commander')
const chalk = require('chalk'); // 粉笔模块 终端输出带有颜色的文字
const { version } = require('../package.json')
const config = require('./config.js')
const Server = require('../src/server.js')

program.name(chalk.redBright('danboard-http-server'))
program.usage(chalk.redBright('[args]'))
program.version(version)

Object.values(config).forEach(val => {
  if (val.option) {
    program.option(val.option, chalk.gray(val.description))
  }
})

// 监听--help
program.on('--help', () => {
  console.log(chalk.yellowBright('Examples'))
  Object.values(config).forEach(val => {
    if (val.usage) {
      console.log(chalk.blueBright('danboard-http-server ' + val.option.match(/(--[a-z]+)/)[0] + ' ' + val.usage))
    }
  })
})

// 解析参数 console.log(program.parse(process.argv))

const parserObj = program.parse(process.argv)

const keys = Object.keys(config)

let resultConfig = {}
keys.forEach(key => {
  resultConfig[key] = parserObj[key] || config[key].usage
})

// console.log(resultConfig, '===>')

const server = new Server(resultConfig)
server.start()
