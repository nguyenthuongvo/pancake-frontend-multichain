import { Card, CardBody, Flex, Heading, ProfileAvatar, NextLinkFromReactRouter, Button, useToast } from '@pancakeswap/uikit'
import { useERC721 } from 'hooks/useContract'
import { useAppDispatch } from 'state'
import useMintNft from './hook/useApproveNft'
import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/image'
import styled, { css } from 'styled-components'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallWithMarketGasPrice } from 'hooks/useCallWithMarketGasPrice'
import { useCallback, useState } from 'react'

interface HotCollectionCardProps {
  bgSrc: string
  avatarSrc?: string
  collectionName: string
  url?: string
  disabled?: boolean
  nftContract?: string
}

export const CollectionAvatar = styled(ProfileAvatar)`
  left: 0;
  position: absolute;
  top: -32px;
  border: 4px white solid;
`

const StyledHotCollectionCard = styled(Card)<{ disabled?: boolean }>`
  border-radius: 8px;
  border-bottom-left-radius: 56px;
  transition: opacity 200ms;

  & > div {
    border-radius: 8px;
    border-bottom-left-radius: 56px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    ${({ disabled }) =>
      disabled
        ? ''
        : css`
            &:hover {
              cursor: pointer;
              opacity: 0.6;
            }
          `}
  }
`

const StyledImage = styled(Image)`
  border-radius: 4px;
`

const CollectionCard: React.FC<React.PropsWithChildren<HotCollectionCardProps>> = ({
  bgSrc,
  avatarSrc,
  collectionName,
  url,
  disabled,
  children,
  nftContract
}) => {

  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const lpContract = useERC721(nftContract)
  const dispatch = useAppDispatch()
  const { onApprove } = useMintNft(lpContract, account)

  const handleApprove = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    handlePoolApprove()
  }

  const handlePoolApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onApprove()
    })
    if (receipt?.status) {
      toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
    }
  }, [onApprove, dispatch, chainId, account, t, toastSuccess, fetchWithCatchTxError])

  const renderBody = () => (

    <CardBody p="8px">
      <StyledImage src={bgSrc} height={125} width={375} />
      <Flex
        position="relative"
        height="65px"
        justifyContent="center"
        alignItems="flex-end"
        py="8px"
        flexDirection="column"
      >
        <CollectionAvatar src={avatarSrc} width={96} height={96} />
        <Heading color={disabled ? 'textDisabled' : 'body'} as="h3" mb={children ? '8px' : '0'}>
          {collectionName}
        </Heading>
        {children}
        <Button onClick={handleApprove}>Mint</Button>
      </Flex>
    </CardBody>
  )

  return (
    <StyledHotCollectionCard disabled={disabled} data-test="hot-collection-card">
      {url ? (
        <NextLinkFromReactRouter to={url}>{renderBody()}</NextLinkFromReactRouter>
      ) : (
        <div style={{ cursor: 'default' }}>{renderBody()}</div>
      )}
    </StyledHotCollectionCard>
  )
}

export default CollectionCard