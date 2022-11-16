import { StaticJsonRpcProvider } from '@ethersproject/providers'

export const BSC_PROD_NODE = process.env.NEXT_PUBLIC_NODE_PRODUCTION || 'https://bsc.nodereal.io'

export const BSC_DEV_NODE = 'https://bsc-testnet.nodereal.io'

export const bscRpcProvider = new StaticJsonRpcProvider(BSC_PROD_NODE)

export const bscTestnetRpcProvider = new StaticJsonRpcProvider(BSC_DEV_NODE)

export default null
