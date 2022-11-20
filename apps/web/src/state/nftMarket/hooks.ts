import { useMemo } from 'react'
import { isAddress } from 'utils'
import { useAtom } from 'jotai'
import { FetchStatus } from 'config/constants/types'
import erc721Abi from 'config/abi/erc721.json'
import { useSWRMulticall } from 'hooks/useSWRContract'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import isEmpty from 'lodash/isEmpty'
import shuffle from 'lodash/shuffle'

import fromPairs from 'lodash/fromPairs'
import { ApiCollections, NftToken, Collection, NftAttribute, MarketEvent } from './types'
import { getCollection, getCollections } from './helpers'
import { nftMarketActivityFiltersAtom, tryVideoNftMediaAtom, nftMarketFiltersAtom } from './atoms'

const DEFAULT_NFT_ORDERING = { field: 'currentAskPrice', direction: 'asc' as 'asc' | 'desc' }
const DEFAULT_NFT_ACTIVITY_FILTER = { typeFilters: [], collectionFilters: [] }
const EMPTY_OBJECT = {}

export const useGetCollections = (): { data: ApiCollections; status: FetchStatus } => {
  const { data, status } = useSWR(['nftMarket', 'collections'], async () => getCollections())
  const collections = data ?? ({} as ApiCollections)
  return { data: collections, status }
}

export const useGetFreeCollections = (): { data: any; status: FetchStatus } => {
  const status = FetchStatus.Fetched
  const collections = [
      {
        "address": "0x27f10c63c03eac2d196198163a04b31d78c5c20a",
        "owner": "0x3202CC2451CC07F80Ce9BAbD77E23a0916d837b7",
        "name": "Newbies",
        "description": "Newbies join the metaverse",
        "symbol": "MPNFT",
        "totalSupply": "5565",
        "verified": true,
        "createdAt": "2022-11-07T19:28:54.565Z",
        "updatedAt": "2022-11-07T19:28:54.565Z",
        "avatar": "https://tjto.xyz/images/nft_newbies/0x27f10c63c03eac2d196198163a04b31d78c5c20a/avatar.png",
        "banner": {
          "large": "https://tjto.xyz/images/nft_newbies/0x27f10c63c03eac2d196198163a04b31d78c5c20a/banner-lg.png",
          "small": "https://tjto.xyz/images/nft_newbies/0x27f10c63c03eac2d196198163a04b31d78c5c20a/banner-sm.png"
        },
        "totalVolumeBNB" : 12000
      },
      {
        "address": "0x27f10c63c03eac2d196198163a04b31d78c5c20a",
        "owner": "0x8A0A1622D29CEa6574632a5b8C016DB953694822",
        "name": "Gooodfellas Binions",
        "description": "The Binions are a mixed tribe of adorably creepy monsters indigenous to BNB Chain. After centuries of war, the Binion tribes have united as one, combining their forces to protect their native BNB Chain land from evil forces wishing them harm. Binions are calling for every able bodied Binion to unite, one army under CZ! ",
        "symbol": "OOO-BIN",
        "totalSupply": "4000",
        "verified": true,
        "createdAt": "2022-08-30T17:14:45.392Z",
        "updatedAt": "2022-08-30T17:14:45.392Z",
        "avatar": "https://static-nft.pancakeswap.com/mainnet/0x59b39a2092cda9C590B1576EE5AA204a487e46e6/avatar.png",
        "banner": {
          "large": "https://static-nft.pancakeswap.com/mainnet/0x59b39a2092cda9C590B1576EE5AA204a487e46e6/banner-lg.png",
          "small": "https://static-nft.pancakeswap.com/mainnet/0x59b39a2092cda9C590B1576EE5AA204a487e46e6/banner-sm.png"
        },
        "totalVolumeBNB" : 16421
      },
      {
        "address": "0x27f10c63c03eac2d196198163a04b31d78c5c20a",
        "owner": "0x8A0A1622D29CEa6574632a5b8C016DB953694822",
        "name": "Gooodfellas Binions",
        "description": "The Binions are a mixed tribe of adorably creepy monsters indigenous to BNB Chain. After centuries of war, the Binion tribes have united as one, combining their forces to protect their native BNB Chain land from evil forces wishing them harm. Binions are calling for every able bodied Binion to unite, one army under CZ! ",
        "symbol": "OOO-BIN",
        "totalSupply": "4000",
        "verified": true,
        "createdAt": "2022-08-30T17:14:45.392Z",
        "updatedAt": "2022-08-30T17:14:45.392Z",
        "avatar": "https://static-nft.pancakeswap.com/mainnet/0x59b39a2092cda9C590B1576EE5AA204a487e46e6/avatar.png",
        "banner": {
          "large": "https://static-nft.pancakeswap.com/mainnet/0x59b39a2092cda9C590B1576EE5AA204a487e46e6/banner-lg.png",
          "small": "https://static-nft.pancakeswap.com/mainnet/0x59b39a2092cda9C590B1576EE5AA204a487e46e6/banner-sm.png"
        },
        "totalVolumeBNB" : 1333
      }
    ]

  // const collections = data ?? ({} as ApiCollections)
  
  return { data: collections, status }
}

export const useGetCollection = (collectionAddress: string): Collection | undefined => {
  const checksummedCollectionAddress = isAddress(collectionAddress) || ''
  const { data } = useSWR(
    checksummedCollectionAddress ? ['nftMarket', 'collections', checksummedCollectionAddress.toLowerCase()] : null,
    async () => getCollection(checksummedCollectionAddress),
  )
  const collectionObject = data ?? {}
  return collectionObject[checksummedCollectionAddress]
}

export const useGetShuffledCollections = (): { data: Collection[]; status: FetchStatus } => {
  const { data } = useSWRImmutable(['nftMarket', 'collections'], async () => getCollections())
  const collections = data ?? ({} as ApiCollections)
  const { data: shuffledCollections, status } = useSWRImmutable(
    !isEmpty(collections) ? ['nftMarket', 'shuffledCollections'] : null,
    () => {
      return shuffle(collections)
    },
  )

  return { data: shuffledCollections, status }
}

export const useApprovalNfts = (nftsInWallet: NftToken[]) => {
  const nftApprovalCalls = useMemo(
    () =>
      nftsInWallet.map((nft: NftToken) => {
        const { tokenId, collectionAddress } = nft

        return {
          address: collectionAddress,
          name: 'getApproved',
          params: [tokenId],
        }
      }),
    [nftsInWallet],
  )

  const { data } = useSWRMulticall(erc721Abi, nftApprovalCalls)
  const profileAddress = getPancakeProfileAddress()

  const approvedTokenIds = Array.isArray(data)
    ? fromPairs(data.flat().map((address, index) => [nftsInWallet[index].tokenId, profileAddress === address]))
    : null

  return { data: approvedTokenIds }
}

export const useGetNftFilters = (collectionAddress: string): Readonly<Record<string, NftAttribute>> => {
  const [nftMarketFilters] = useAtom(nftMarketFiltersAtom)
  return nftMarketFilters[collectionAddress]?.activeFilters ?? EMPTY_OBJECT
}

export const useGetNftOrdering = (collectionAddress: string) => {
  const [nftMarketFilters] = useAtom(nftMarketFiltersAtom)
  return nftMarketFilters[collectionAddress]?.ordering ?? DEFAULT_NFT_ORDERING
}

export const useGetNftShowOnlyOnSale = (collectionAddress: string) => {
  const [nftMarketFilters] = useAtom(nftMarketFiltersAtom)
  return nftMarketFilters[collectionAddress]?.showOnlyOnSale ?? true
}

export const useTryVideoNftMedia = () => {
  const [tryVideoNftMedia] = useAtom(tryVideoNftMediaAtom)
  return tryVideoNftMedia ?? true
}

export const useGetNftActivityFilters = (
  collectionAddress: string,
): { typeFilters: MarketEvent[]; collectionFilters: string[] } => {
  const [nftMarketActivityFilters] = useAtom(nftMarketActivityFiltersAtom)
  return nftMarketActivityFilters[collectionAddress] ?? DEFAULT_NFT_ACTIVITY_FILTER
}
