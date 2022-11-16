import styled from 'styled-components'
import PageSection from 'components/PageSection'
import { useWeb3React } from '@pancakeswap/wagmi'
import useTheme from 'hooks/useTheme'
import Container from 'components/Layout/Container'
import { useTranslation } from '@pancakeswap/localization'
import { Heading } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { useAllTokenDataSWR } from 'state/info/hooks'
import orderBy from 'lodash/orderBy'
import Page from 'components/Layout/Page'
import PageLoader from 'components/Loader/PageLoader'
import { FetchStatus } from 'config/constants/types'
import { useGetCollections, useGetFreeCollections } from 'state/nftMarket/hooks'
import Project from 'views/Nft/market/Home/Project'


const Home: React.FC<React.PropsWithChildren> = () => {

  const { t } = useTranslation()

  const { data: collections, status } = useGetFreeCollections()

  const newestCollections = orderBy(
    collections,
    (collection) => (collection.createdAt ? Date.parse(collection.createdAt) : 0),
    'desc',
  )

  return (
    <Page>
      {status !== FetchStatus.Fetched ? (
        <PageLoader />
      ) : (
          <Project
            key="newest-collections"
            title={t('Mint free NFTs')}
            testId="nfts-newest-collections"
            collections={newestCollections}
          />
      )}

    </Page>
  )
}

export default Home
