const path = require('path')
const autocannon = require('autocannon')
const ora = require('ora-classic')
const dayjs = require('dayjs')
const { Workbook } = require('exceljs')

const loading = ora()

const connections = 100
const pipelining = 10
const duration = 30

const providers = [
  { title: 'Express', port: '3001' },
  { title: 'Fastify', port: '3002' },
  { title: 'NuxtH3', port: '3003' },
  { title: 'NuxtExpress', port: '3004' },
  { title: 'NuxtFastify', port: '3005' }
]

const fields = [
  'average',
  'mean',
  'stddev',
  'min',
  'max',
  'p0_001',
  'p0_01',
  'p0_1',
  'p1',
  'p2_5',
  'p10',
  'p25',
  'p50',
  'p75',
  'p90',
  'p97_5',
  'p99',
  'p99_9',
  'p99_99',
  'p99_999',
  'totalCount'
]

async function run() {
  loading.start()
  
  const results = []
  for (const provider of providers) {
    loading.text = `Testing ${provider.title}...`
    const result = await autocannon({
      url: `http://localhost:${provider.port}/api/ping`,
      connections,
      pipelining,
      duration
    })
    console.log(result.latency)
    results.push({ provider: provider.title, ...result.latency })
  }

  loading.text = 'Writing csv file...'
  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet()
  worksheet.columns = [{ header: 'provider', key: 'provider' }, ...fields.map(field => ({ header: field, key: field }))]
  worksheet.addRows(results)
  const filePath = path.join(__dirname, './output/', dayjs().format('YYYYMMDD_HHmmss') + '.csv')
  await workbook.csv.writeFile(filePath)

  loading.succeed(filePath)
}

run()