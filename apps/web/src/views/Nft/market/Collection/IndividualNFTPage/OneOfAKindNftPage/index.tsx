import { Flex } from '@pancakeswap/uikit'
import noop from 'lodash/noop'
import Page from 'components/Layout/Page'
import { useGetCollection } from 'state/nftMarket/hooks'
import PageLoader from 'components/Loader/PageLoader'
import MainNFTCard from './MainNFTCard'
import { TwoColumnsContainer } from '../shared/styles'
import DetailsCard from '../shared/DetailsCard'
import { useCompleteNft } from '../../../hooks/useCompleteNft'
import ManageNFTsCard from '../shared/ManageNFTsCard'

interface IndividualNFTPageProps {
  collectionAddress: string
  tokenId: string
}

const IndividualNFTPage: React.FC<React.PropsWithChildren<IndividualNFTPageProps>> = ({
  collectionAddress,
  tokenId,
}) => {
  const collection = useGetCollection(collectionAddress)
  const { combinedNft: nft, isOwn: isOwnNft, isProfilePic, refetch } = useCompleteNft(collectionAddress, tokenId)

  if (!nft || !collection) {
    // Normally we already show a 404 page here if no nft, just put this checking here for safety.

    // For now this if is used to show loading spinner while we're getting the data
    return <PageLoader />
  }

  return (
    <Page>
      <MainNFTCard nft={nft} isOwnNft={isOwnNft} nftIsProfilePic={isProfilePic} onSuccess={refetch} />
      <TwoColumnsContainer flexDirection={['column', 'column', 'column', 'column', 'row']}>
        <Flex flexDirection="column" width="100%">
          <ManageNFTsCard collection={collection} tokenId={tokenId} onSuccess={isOwnNft ? refetch : noop} />
          <DetailsCard contractAddress={collectionAddress} ipfsJson={nft?.marketData?.metadataUrl} />
        </Flex>
      </TwoColumnsContainer>
    </Page>
  )
}

export default IndividualNFTPage
