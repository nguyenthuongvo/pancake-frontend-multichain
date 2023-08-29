import { ChainId } from '@pancakeswap/sdk'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
import { useMemo } from 'react'
import { useChainCurrentBlock } from 'state/block/hooks'

export const useMenuItemsStatus = (): Record<string, string> => {
  const currentBlock = useChainCurrentBlock(ChainId.BSC)
  const activeIfo = useActiveIfoWithBlocks()

  const ifoStatus = currentBlock && activeIfo && activeIfo.endBlock > currentBlock ? null : null

  return useMemo(() => {
    return {
      '/ifo': ifoStatus === 'coming_soon' ? 'soon' : ifoStatus,
    }
  }, [ifoStatus])
}
