process.env.NODE_ENV = 'development'

const chalk = require('chalk')
const electron = require('electron')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const kill = require('tree-kill')

const path = require('path')
const { spawn } = require('child_process')

const mainConfig = require('./webpack.main.config')
const rendererConfig = require('./webpack.renderer.config')
const workersConfig = require('./webpack.workers.config')

let electronProcess = null
let manualRestart = null
const remoteDebugging = process.argv.includes('--remote-debug')

if (remoteDebugging) {
  process.env.RENDERER_REMOTE_DEBUGGING = true
}

async function killElectron(pid) {
  return new Promise((resolve, reject) => {
    if (pid) {
      kill(pid, 'SIGKILL', (err) => {
        if (err) reject(err)
        resolve()
      })
    } else {
      resolve()
    }
  })
}

async function restartElectron() {
  console.log(chalk.gray('\nStarting electron...'))

  const { pid } = electronProcess || {}
  await killElectron(pid)

  const args = [
    path.join(__dirname, '../dist/main.js'),
  ]

  if (remoteDebugging) {
    args.push('--inspect=9222')
    args.push('--remote-debugging-port=9223')
  }

  electronProcess = spawn(electron, args.filter(Boolean))

  electronProcess.stdout.on('data', (data) => {
    console.log(chalk.white(data.toString()))
  })

  electronProcess.stderr.on('data', (data) => {
    console.error(chalk.red(data.toString()))
  })

  electronProcess.on('exit', (code, signal) => {
    if (!manualRestart) process.exit(0)
  })
}

function startMain() {
  const webpackSetup = webpack([mainConfig, workersConfig])

  webpackSetup.compilers.forEach((compiler) => {
    const { name } = compiler

    switch (name) {
      case 'workers':
        compiler.hooks.afterEmit.tap('afterEmit', async () => {
          console.log(chalk.gray(`\nCompiled ${name} script!`))
          console.log(
            chalk.gray(`\nWatching file changes for ${name} script...`)
          )
        })
        break
      case 'main':
      default:
        compiler.hooks.afterEmit.tap('afterEmit', async () => {
          console.log(chalk.gray(`\nCompiled ${name} script!`))

          manualRestart = true
          await restartElectron()

          setTimeout(() => {
            manualRestart = false
          }, 2500)

          console.log(
            chalk.gray(`\nWatching file changes for ${name} script...`)
          )
        })
        break
    }
  })

  webpackSetup.watch(
    {
      aggregateTimeout: 500,
    },
    (err) => {
      if (err) console.error(chalk.red(err))
    }
  )
}

async function startRenderer(callback) {
  const compiler = webpack(rendererConfig)
  const { name } = compiler

  compiler.hooks.afterEmit.tap('afterEmit', () => {
    console.log(chalk.gray(`\nCompiled ${name} script!`))
    console.log(chalk.gray(`\nWatching file changes for ${name} script...`))
  })

  // webpack-dev-server v4 configuration
  const server = new WebpackDevServer({
    static: {
      directory: path.join(__dirname, '../'),
    },
    hot: true,
    client: {
      logging: 'warn',
      overlay: true,
    },
    historyApiFallback: {
      disableDotRule: true,
    },
    port: 9080,
    host: 'localhost',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  }, compiler)

  try {
    await server.start()
    console.log(chalk.green('\nRenderer dev server running on http://localhost:9080'))
    callback()
  } catch (err) {
    console.error(chalk.red('Failed to start renderer dev server:'), err)
  }
}

startRenderer(startMain)
