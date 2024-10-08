import { ChainId } from '../../../chain/index.js'
import type { SushiSwapV3ChainId } from '../../features/sushiswap-v3.js'
import {
  CORE_HOST,
  DECENTRALIZED_HOST_BY_DEPLOYMENT_ID,
  FILECOIN_HOST,
  HAQQ_HOST,
  METIS_0XGRAPH_HOST,
  SKALE_HOST,
  SUSHI_DEDICATED_GOLDSKY_HOST,
  SUSHI_GOLDSKY_HOST,
  THUNDERCORE_HOST,
} from '../hosts.js'

export const SUSHISWAP_V3_SUBGRAPH_URL: Record<SushiSwapV3ChainId, string> = {
  [ChainId.ARBITRUM]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmS9GKBA49mDpWchU2Us1PJ7kmu4S7tWa4gAmRvE3HK42w`,
  [ChainId.AVALANCHE]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/Qmcdd4SGVwG9VY4itrXBnBPWBVsQvsxfzaib9bVny9C8jT`,
  [ChainId.BSC]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmXsPN4TD4PUhT1ZWd5d1mdQPePFNMdJwUr6guSh1z9ZzA`,
  [ChainId.BOBA]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmVbYM6wz7XnH32QzQLNBwyzx7r1HNsFP6jfUi22NRvvJu`,
  [ChainId.ETHEREUM]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmSDPnHzyW8yfnuhB423ssVY5r4bQrr5C1rXT8qMroNgmv`,
  [ChainId.FANTOM]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmQXFxg4dCxMqcobGQAtsNe4ufnG1KmjSVgtEdtxvYo4Lf`,
  [ChainId.FUSE]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmakqW3KCpEXJGTSuyfXHGg6C8ppbrPdSqVXWj3Guor9zA`,
  [ChainId.GNOSIS]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmS9uxga2rzpWyHKFATGYas6ntdHLpX7w45EKAatBTZJ25`,
  [ChainId.MOONRIVER]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmStbnz4sErrK1jzaU5iKAutA1Q2w47EsgAoFbdCiequtZ`,
  [ChainId.OPTIMISM]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmbT6ZsxJEZKUrbzLrAWV5EnQfSKZeYtZ265mQUaB552vK`,
  [ChainId.POLYGON]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmPbbjK9vtY69kSxMJRVLVz1dRzUBNwYbWTRYMiFzp9Tzm`,
  [ChainId.POLYGON_ZKEVM]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmWH5ChjmF4Yp5Yhiaxczh5QwbG6HFSEi8bRwbKaUrJA6C`,
  [ChainId.BASE]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmZ2R9ABG9ienaZdGyPLcDWDNDkG187RhXmh6fFuEtUaaS`,
  [ChainId.LINEA]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmNZ9ePvxGRDHAEhb7cLsb3AvtCCPJ3qAwh1CDvDn39RMa`,
  [ChainId.SCROLL]: `${DECENTRALIZED_HOST_BY_DEPLOYMENT_ID}/QmR6VP1qoF8nxhtMaGEg9VMmkaTDFqyeM8nJWkakP6nHes`,
  [ChainId.ARBITRUM_NOVA]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushi-v3/v3-arbitrum-nova/gn`,
  [ChainId.THUNDERCORE]: `${THUNDERCORE_HOST}/sushi-v3/v3-thundercore-2`,
  [ChainId.CORE]: `${CORE_HOST}/sushi-v3/v3-core-tvl-fix`,
  [ChainId.KAVA]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushi-v3/v3-kava/gn`,
  [ChainId.METIS]: `${METIS_0XGRAPH_HOST}/sushi-v3/v3-metis/v0.0.1/gn`,
  [ChainId.BTTC]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushi-v3/v3-bttc/gn`,
  [ChainId.FILECOIN]: `${FILECOIN_HOST}/sushiswap/v3-filecoin`,
  [ChainId.HAQQ]: `${HAQQ_HOST}/sushi/v3-haqq-2`,
  [ChainId.ZETACHAIN]: `${SUSHI_GOLDSKY_HOST}/v3-zetachain/1.0.0/gn`,
  [ChainId.BLAST]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushiswap/v3-blast/gn`,
  [ChainId.SKALE_EUROPA]: `${SKALE_HOST}/sushi/v3-skale-europa`,
  [ChainId.ROOTSTOCK]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushiswap/v3-rootstock/gn`,
}
