const autocannon = require('autocannon')
const ora = require('ora-classic')
const { writeToPath } = require('@fast-csv/format')

const loading = ora()

const connections = 100
const pipelining = 10
const duration = 30

function writeCsv(data, fileName) {
  return new Promise((resolve, reject) => {
    writeToPath(path.join(__dirname, '../output', fileName), data)
      .on('error', reject)
      .on('finish', resolve)
  })
}

function mapRow(object) {
  return Object.entries(object)
}

const providers = [
  { title: 'Express', port: '3001' },
  { title: 'Fastify', port: '3002' },
  { title: 'NuxtH3', port: '3003' },
  { title: 'NuxtExpress', port: '3004' },
  { title: 'NuxtFastify', port: '3005' }
]

async function run() {
  loading.start()
  for (const provider of providers) {
    loading.text = `Testing ${provider.title}`
    const result = await autocannon({
      url: `http://localhost:${provider.port}/api/ping`,
      connections,
      pipelining,
      duration
    })
    console.log(`[${provider.title}]`, result.latency)
    await writeCsv(mapRow(result.latency), `${provider.title}.csv`)
  }
  loading.succeed()
}

run()