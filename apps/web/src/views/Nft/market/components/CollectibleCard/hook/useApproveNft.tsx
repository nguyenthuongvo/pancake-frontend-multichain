import { useCallback } from 'react'
import { MaxUint256 } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { getMasterChefAddress, getNonBscVaultAddress } from 'utils/addressHelpers'
import { useCallWithMarketGasPrice } from 'hooks/useCallWithMarketGasPrice'
import { verifyBscNetwork } from 'utils/verifyBscNetwork'

const useMintNft = (lpContract: Contract, address: string) => {
  console.log(lpContract);
  
  const { callWithMarketGasPrice } = useCallWithMarketGasPrice()
  const handleApprove = useCallback(async () => {
    return callWithMarketGasPrice(lpContract, 'safeMint', [address,])
  }, [lpContract, callWithMarketGasPrice])

  return { onApprove: handleApprove }
}

export default useMintNft