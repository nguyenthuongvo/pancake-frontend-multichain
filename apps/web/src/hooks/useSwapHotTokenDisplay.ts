import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { atom, useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const isSwapHotTokenDisplayETH = atomWithStorageWithErrorCatch<boolean>('pcs:isHotTokensDisplayETH', true)
const isHotTokensDisplayMobile = atom(false)

export const useSwapHotTokenDisplay = () => {
  const { isMobile } = useMatchBreakpoints()
  return useAtom(isMobile ? isHotTokensDisplayMobile : isSwapHotTokenDisplayETH)
}
