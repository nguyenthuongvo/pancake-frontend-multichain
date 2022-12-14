import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Input,
  useToast,
  Button,
  AutoRenewIcon,
  IconButton
} from '@pancakeswap/uikit'
import Link from 'next/link'
import { ChangeEvent, FormEvent, useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import useDeployContract from './hook/contractController'

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
  tokenSupply: number
}

const Home = () => {

  const [state, setState] = useState<FormState>(() => ({
    tokenName: 'Baby Doge',
    tokenSymbol: 'BBD',
    tokenSupply: 10000000
  }))

  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()
  const { toastSuccess, toastError, toastInfo } = useToast()
  const { tokenName, tokenSymbol, tokenSupply } = state
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

  const {address, isDeploy, deploy } = useDeployContract(data.abi, data.bytecode, tokenName, tokenSymbol, tokenSupply)

  const compileContract = () => {

    setIsLoading(true)

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "tokenName": tokenName,
      "tokenSymbol": tokenSymbol,
      "totalSupply": tokenSupply
    });

    const requestOptions : RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("/api/createContract", requestOptions)
      .then(response => response.json())
      .then(result => {        
        setData({abi: result["ERC20Tokenabi"], bytecode: result["ERC20Token"]})
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

  return (
    <Container py="40px">
      <PageMeta />
      {/* <form> */}
        <Layout>
          <Box>
            <Card>
              <CardHeader>
                <Heading as="h3" scale="md">
                  {t('Create ERC20 token')}
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
                  <SecondaryLabel>{t('Total supply')}</SecondaryLabel>
                  <Input id="tokenSupply" name="tokenSupply" value={tokenSupply} scale="lg" onChange={handleChange} required />
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('ERC20 token review')}</SecondaryLabel>
                  <SecondaryLabel>{tokenName + ' (' + tokenSymbol + '): ' + tokenSupply.toLocaleString()}</SecondaryLabel>
                  {
                    address && <Link href={'https://testnet.bscscan.com/address/' + address}>
                    Contract address
                  </Link>
                  }
                </Box>
                <Box mb="24px">
                  <Button  
                    onClick={compileContract}
                    endIcon={isLoading ? spinnerIcon : undefined}
                    isLoading={isLoading}
                  >Compile smart contract</Button>
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