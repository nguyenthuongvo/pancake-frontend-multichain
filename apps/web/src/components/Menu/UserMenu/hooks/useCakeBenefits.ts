import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import useSWR from 'swr'
import { useIfoCreditAddressContract } from 'hooks/useContract'
import { ChainId } from '@pancakeswap/sdk'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { useChainCurrentBlock } from 'state/block/hooks'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import { getCakeVaultAddress } from 'utils/addressHelpers'
import { cakeVaultV2ABI } from '@pancakeswap/pools'
import { publicClient } from 'utils/wagmi'

const bscClient = publicClient({ chainId: ChainId.BSC })

const useCakeBenefits = () => {
  const { address: account } = useAccount()
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const ifoCreditAddressContract = useIfoCreditAddressContract()
  const cakeVaultAddress = getCakeVaultAddress()
  const currentBscBlock = useChainCurrentBlock(ChainId.BSC)

  const { data, status } = useSWR(account && currentBscBlock && ['cakeBenefits', account], async () => {
    const [userInfo] = await bscClient.multicall({
      contracts: [
        {
          address: cakeVaultAddress,
          abi: cakeVaultV2ABI,
          functionName: 'userInfo',
          args: [account],
        },
        {
          address: cakeVaultAddress,
          abi: cakeVaultV2ABI,
          functionName: 'calculatePerformanceFee',
          args: [account],
        },
        {
          address: cakeVaultAddress,
          abi: cakeVaultV2ABI,
          functionName: 'calculateOverdueFee',
          args: [account],
        },
        {
          address: cakeVaultAddress,
          abi: cakeVaultV2ABI,
          functionName: 'getPricePerFullShare',
        },
      ],
      allowFailure: false,
    })

    const userContractResponse = {
      shares: userInfo[0],
      lastDepositedTime: userInfo[1],
      cakeAtLastUserAction: userInfo[2],
      lastUserActionTime: userInfo[3],
      lockStartTime: userInfo[4],
      lockEndTime: userInfo[5],
      userBoostedShare: userInfo[6],
      locked: userInfo[7],
      lockedAmount: userInfo[8],
    }

    const userSharesAsBignumber = new BigNumber(userContractResponse.shares.toString())
    const lockPosition = getVaultPosition({
      userShares: userSharesAsBignumber,
      locked: userContractResponse.locked,
      lockEndTime: userContractResponse.lockEndTime.toString(),
    })
    const lockedCake = [VaultPosition.None, VaultPosition.Flexible].includes(lockPosition) ? '0.00' : '0.00'

    let iCake = ''
    const vCake = { vaultScore: '0', totalScore: '0' }
    if (lockPosition === VaultPosition.Locked) {
      const credit = await ifoCreditAddressContract.read.getUserCredit([account])
      iCake = getBalanceNumber(new BigNumber(credit.toString())).toLocaleString('en', { maximumFractionDigits: 3 })
    }

    return {
      lockedCake,
      lockPosition,
      lockedEndTime: new Date(parseInt(userContractResponse.lockEndTime.toString()) * 1000).toLocaleString(locale, {
        month: 'short',
        year: 'numeric',
        day: 'numeric',
      }),
      iCake,
      vCake,
    }
  })

  return { data, status }
}

export default useCakeBenefits
