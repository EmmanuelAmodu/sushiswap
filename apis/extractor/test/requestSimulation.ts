import fs from 'fs'
import path from 'path'

const CACHE_DIR = '../cache'
const TOKEN_FILES_PREFIX = 'tokens-'
const SERVER_ADDRESS = 'http://localhost:1337'
const USER_ADDRESS = '0xBa8656A5D95087ab4d015f1B68D72cD246FcC6C3' // random address with no contract
const REQUEST_PER_SEC = 2
const MS_PER_REQUEST = Math.round(1000 / REQUEST_PER_SEC)

interface Token {
  address: string
  name: string
  symbol: string
  decimals: number
}

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

function loadAllTokens(): Record<number, Token[]> {
  const res: Record<number, Token[]> = {}
  const fullDirName = path.resolve(__dirname, CACHE_DIR)
  fs.readdirSync(fullDirName).forEach((fileName) => {
    if (!fileName.startsWith(TOKEN_FILES_PREFIX)) return
    const fullFileName = path.resolve(fullDirName, fileName)
    const chainId = parseInt(fileName.substring(TOKEN_FILES_PREFIX.length))
    const file = fs.readFileSync(fullFileName, 'utf8')
    res[chainId] = file
      .split('\n')
      .map((s) => (s === '' ? undefined : (JSON.parse(s) as Token)))
      .filter((t) => t !== undefined) as Token[]
  })
  return res
}

function getRandomNetwork(
  totalTokens: number,
  tokenNumber: [number, number][],
): number {
  const num = Math.floor(Math.random() * totalTokens)
  let total = 0
  for (let i = 0; i < tokenNumber.length; ++i) {
    total += tokenNumber[i][1]
    if (total >= num) return tokenNumber[i][0]
  }
  console.assert(false, 'Should not be reached')
  return 0
}

// Arbitrary 2 tokens
// function getRandomPair(num: number): [number, number] {
//   const first = Math.floor(Math.random() * num)
//   let second = Math.floor(Math.random() * (num - 1))
//   if (second >= first) ++second
//   return [first, second]
// }

// arbitrary token against arbitrary first 5 tokens
function getRandomPair2(num: number): [number, number] {
  const best = Math.min(num - 1, 5)
  const first = Math.floor(Math.random() * best)
  let second = Math.floor(Math.random() * (num - 1))
  if (second >= first) ++second
  return Math.random() < 0.5 ? [first, second] : [second, first]
}

async function makeRequest(
  chainId: number,
  from: Token,
  amount: bigint,
  to: Token,
  recipient: string,
) {
  const requestUrl =
    `${SERVER_ADDRESS}/?chainId=${chainId}` +
    `&tokenIn=${from.address}&tokenOut=${to.address}&amount=${amount}&to=${recipient}`
  try {
    const resp = await fetch(requestUrl)
    const json = (await resp.json()) as string
    const respObj = JSON.parse(json)
    return respObj.route.status
  } catch (_e) {
    console.log('Failed request:', requestUrl)
    return 'Failed'
  }
}

async function simulate() {
  const tokens = loadAllTokens()
  const tokenNumber: [number, number][] = Object.entries(tokens).map(
    ([id, tokens]) => [Number(id), tokens.length],
  )
  const totalTokens = tokenNumber.reduce((a, b) => a + b[1], 0)
  for (;;) {
    const delayPromise = delay(MS_PER_REQUEST)
    const chainId = getRandomNetwork(totalTokens, tokenNumber)
    const chainTokens = tokens[chainId]
    const [from, to] = getRandomPair2(chainTokens.length)
    const amount = BigInt(10 ** (chainTokens[from].decimals + 1))
    const startTime = performance.now()
    const res = await makeRequest(
      chainId,
      chainTokens[from],
      amount,
      chainTokens[to],
      USER_ADDRESS,
    )
    const timing = performance.now() - startTime
    console.log(
      `Request: ${chainId} 1e${chainTokens[from].decimals + 1} ${
        chainTokens[from].symbol
      }->${chainTokens[to].symbol} ${res} ${Math.round(timing)}ms`,
    )
    await delayPromise
  }
}

simulate()
