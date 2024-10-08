import { ChainId } from '../../../chain/index.js'
import type { BentoBoxChainId } from '../../features/bentobox.js'
import {
  DECENTRALIZED_HOST_BY_DEPLOYMENT_ID,
  SUSHI_DEDICATED_GOLDSKY_HOST,
} from '../hosts.js'

export const BENTOBOX_SUBGRAPH_URL: Partial<Record<BentoBoxChainId, string>> = {
  [ChainId.ETHEREUM]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmRLTuSKgS8GbioD9vfAmn9dUUm5uVPptUdFMS5LG4yzAA`,
  [ChainId.POLYGON]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmYyjZXjfUaqe359vzGgxe2ju1qJPiQM68pG2ipfNL8F7F`,
  [ChainId.AVALANCHE]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmY9S4TVSMX6bcjVnvRhntMUS6ppdv23ktNhLQkWm5PaVn`,
  [ChainId.BSC]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmdnkNhFRuDcshaD6RXTf4zSqHntUtnHGr2krUtbzfF9F7`,
  [ChainId.FANTOM]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmRqdvBLBWVw2JtnDj2JAtZnVkTt4DvGBuiFtphvVYAe9U`,
  [ChainId.GNOSIS]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmT3VpmrGD7bbPGT6aKqaK4yg3u73ryhgp5kEM2BVTEWFj`,
  [ChainId.ARBITRUM]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmdCukF6WX46K2Lgy4QJR8AyKQByc2NCRAUAyRxm9uA4uZ`,
  [ChainId.CELO]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmZC9vYPNAdew2U4qAYXCjBGwfrpwvxKRm3RE2njwzwgxE`,
  [ChainId.MOONRIVER]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmXU45n3iB7AKQWLwAMs2MaGkkMjqF7sF8QW32NxQKFLx9`,
  [ChainId.MOONBEAM]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmZG6wYBro1aU5Sg2V3J3n6omQcJCAZsmnMoJNp68Em4s2`,
  [ChainId.OPTIMISM]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmbQQsmYqNoVdWG9fpffvcqeg6zvwDjUxE3T65AB1Lmmha`,
  [ChainId.HARMONY]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmcHkq534QMFaGWsPqkeKeuGLwZwVKK7KRqZE3cKxaEojH`,
  [ChainId.BTTC]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushiswap/bentobox-bttc/gn`,
}
