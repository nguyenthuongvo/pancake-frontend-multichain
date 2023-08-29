import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'
import { logGTMClickStakeFarmEvent } from 'utils/customGTMEventTracking'
import { getMasterChefContract } from 'utils/contractHelpers'

type MasterChefContract = ReturnType<typeof getMasterChefContract>

export const stakeFarm = async (masterChefContract: MasterChefContract, pid, amount, gasPrice, gasLimit?: bigint) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  logGTMClickStakeFarmEvent()
  return masterChefContract.write.deposit([pid, BigInt(value)], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
    account: masterChefContract.account,
    chain: masterChefContract.chain,
  })
}

export const unstakeFarm = async (masterChefContract: MasterChefContract, pid, amount, gasPrice, gasLimit?: bigint) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  return masterChefContract.write.withdraw([pid, BigInt(value)], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
    account: masterChefContract.account,
    chain: masterChefContract.chain,
  })
}

export const harvestFarm = async (masterChefContract: MasterChefContract, pid, gasPrice, gasLimit?: bigint) => {
  return masterChefContract.write.deposit([pid, 0n], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
    account: masterChefContract.account,
    chain: masterChefContract.chain,
  })
}
