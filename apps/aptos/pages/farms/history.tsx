import { useContext } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { FarmsPageLayout, FarmsContext } from 'components/Farms/components/index'
import BigNumber from 'bignumber.js'
import FarmCard from 'components/Farms/components/FarmCard/FarmCard'
// import { getDisplayApr } from 'components/Farms/components/getDisplayApr'
// import { usePriceCakeBusd } from 'state/farms/hooks'

const FarmsHistoryPage = () => {
  const { account } = useActiveWeb3React()
  const { chosenFarmsMemoized } = useContext(FarmsContext)
  const cakePrice = new BigNumber(20)
  // const cakePrice = usePriceCakeBusd()

  return (
    <>
      {chosenFarmsMemoized.map((farm: any) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          displayApr="3"
          // displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
          cakePrice={cakePrice}
          account={account}
          removed
        />
      ))}
    </>
  )
}

FarmsHistoryPage.Layout = FarmsPageLayout

export default FarmsHistoryPage
