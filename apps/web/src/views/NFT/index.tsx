import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Input,
  useToast,
  Button,
  Image,
  AutoRenewIcon
} from '@pancakeswap/uikit'
import Link from 'next/link'
import { ChangeEvent, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import useDeployContract from './hook/contractController'
import {EXPLORER_LINK} from '../../config'
import { useActiveChainId } from 'hooks/useActiveChainId'

const spinnerIcon = <AutoRenewIcon spin color="currentColor" />

const BaseLabel = styled.label`
  color: ${({ theme }) => theme.colors.text};
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
`

export const SecondaryLabel = styled(BaseLabel)`
  font-size: 12px;
  text-transform: uppercase;
`

export const Label = styled(BaseLabel)`
  font-size: 20px;
`

const Layout = styled.div`
  align-items: start;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: minmax(0, 1fr);
  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: auto;
  }
`
export interface FormState {
  tokenName: string
  tokenSymbol: string
  baseUri: string
}

const Home = () => {

  const [state, setState] = useState<FormState>(() => ({
    tokenName: 'My Spirit',
    tokenSymbol: 'MSP',
    baseUri: 'https://dev-960406489632890.api.raw-labs.com/nft?id=',
  }))

  const { chainId } = useActiveChainId();
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()
  const { toastSuccess, toastError, toastInfo } = useToast()
  const { tokenName, tokenSymbol, baseUri } = state
  const [data, setData] = useState({abi:'[]', bytecode: ''})

  useEffect(() => {

    toastInfo('Starting compiling server')
    
  }, [])

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    console.log(inputName, value);
    
    setState((prevState) => ({
      ...prevState,
      [inputName]: value,
    }))
  }

  const {address, isDeploy, deploy } = useDeployContract(data.abi, data.bytecode, tokenName, tokenSymbol, baseUri)

  const compileContract = () => {

    setIsLoading(true)

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "tokenName": tokenName,
      "tokenSymbol": tokenSymbol,
      "baseUri": baseUri
    });

    const requestOptions : RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("/api/createERC721Contract", requestOptions)
      .then(response => response.json())
      .then(result => {        
        setData({abi: result["ERC721Tokenabi"], bytecode: result["ERC721Token"]})
        setIsLoading(false)
        toastSuccess("Success", "Compile contract success")
      })
      .catch(error => {
        setIsLoading(false)
        console.log(error);
        toastError("Error", "Compile contract failed")
      });
  }


  const verifyContract = () => {
    
    var requestOptions : RequestInit = { method: 'GET', redirect: 'follow'};

    fetch("/api/verifyContract?contractAddress=" + address, requestOptions)
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  console.log(EXPLORER_LINK[chainId]);
  

  return (
    <Container py="40px">
      <PageMeta />
      {/* <form> */}
        <Layout>
          <Box>
            <Card>
              <CardHeader>
                <Heading as="h3" scale="md">
                  {t('Create NFT (ERC721 token)')}
                </Heading>
              </CardHeader>
              <CardBody>
                <Box mb="24px">
                  <SecondaryLabel>{t('Token name')}</SecondaryLabel>
                  <Input id="tokenName" name="tokenName" value={tokenName} scale="lg" onChange={handleChange} required />
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('Token Symbol')}</SecondaryLabel>
                  <Input id="tokenSymbol" name="tokenSymbol" value={tokenSymbol} scale="lg" onChange={handleChange} required />
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('Base URI')}</SecondaryLabel>
                  <Input id="baseUri" name="baseUri" value={baseUri} scale="lg" onChange={handleChange} required />
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('NFT(ERC721) review')}</SecondaryLabel>
                  <SecondaryLabel>{tokenName + ' (' + tokenSymbol + ')'}</SecondaryLabel>
                  <SecondaryLabel>{'Base Uri: ' + baseUri}</SecondaryLabel>
                  <Image src="https://cdn.pancakeswap.com/wallets/wallet_intro.png" width={198} height={178} />
                  {
                    address && <Link href={EXPLORER_LINK[chainId] + address}>
                    Contract address
                  </Link>
                  }
                </Box>
                <Box mb="24px">
                  <Button  
                    onClick={compileContract}
                    endIcon={isLoading ? spinnerIcon : undefined}
                    isLoading={isLoading}>Compile smart contract</Button>
                  {
                    data.bytecode.length > 10 && 
                      <Button 
                      onClick={deploy}
                      endIcon={isDeploy ? spinnerIcon : undefined}
                      isLoading={isDeploy}>Deploy token</Button>
                  
                  }
                  {/* {
                    address && <Button onClick={verifyContract}>Verify contract</Button>
                  } */}
                </Box>
                </CardBody>
            </Card>
          </Box>
          
        </Layout>
      {/* </form> */}
    </Container>
  )
}

export default Home