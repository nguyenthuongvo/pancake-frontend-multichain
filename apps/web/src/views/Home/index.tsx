import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Input,
  Text,
  useToast,
} from '@pancakeswap/uikit'
import { ChangeEvent, FormEvent, useState, useMemo } from 'react'
import { useWeb3LibraryContext, useWeb3React } from '@pancakeswap/wagmi'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import snapshot from '@snapshot-labs/snapshot.js'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import ReactMarkdown from 'components/ReactMarkdown'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const hub = 'https://hub.snapshot.org'
const client = new snapshot.Client712(hub)

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
    grid-template-columns: 1fr 332px;
  }
`

export interface Choice {
  id: string
  value: string
}

export interface FormState {
  name: string
  body: string
  choices: Choice[]
  startDate: Date
  startTime: Date
  endDate: Date
  endTime: Date
  snapshot: number
}


const EasyMde = dynamic(() => import('components/EasyMde'), {
  ssr: false,
})

const Home = () => {

  const [state, setState] = useState<FormState>(() => ({
    name: '',
    body: '',
    choices: [],
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    snapshot: 0,
  }))

  const [isLoading, setIsLoading] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { toastSuccess, toastError } = useToast()
  const { name, body, choices, startDate, startTime, endDate, endTime, snapshot } = state

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const library = useWeb3LibraryContext()

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    setState((prevState) => ({
      ...prevState,
      [inputName]: value,
    }))
  }

  const handleEasyMdeChange = (value: string) => {
    setState((prevState) => ({
      ...prevState,
      ['body']: value,
    }))
  }

  const options = useMemo(() => {
    return {
      hideIcons: ['guide', 'fullscreen', 'preview', 'side-by-side', 'image']
    }
  }, [account])

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    
    const { push } = useRouter()

    try {

      const data: any = await client.proposal(library as any, account, {
        space: 'cakevote.eth',
        type: 'single-choice',
        title: name,
        body,
        start: 124,
        end: 124,
        choices: choices
          .filter((choice) => choice.value)
          .map((choice) => {
            return choice.value
          }),
        snapshot,
        discussion: '',
        plugins: JSON.stringify({}),
        app: 'snapshot',
      })

      // Redirect user to newly created proposal page
      push(`/voting/proposal/${data.id}`)

      setIsLoading(true)
      // Redirect user to newly created proposal page
      toastSuccess(t('Proposal created!'))
    } catch (error) {
      toastError(t('Error'), (error as Error)?.message)
      console.error(error)
      setIsLoading(false)
    }
  }


  return (
    <Container py="40px">
      <PageMeta />
      <form onSubmit={handleSubmit}>
        <Layout>
          <Box>
            <Box mb="24px">
              <Label htmlFor="name">{t('Title')}</Label>
              <Input id="name" name="name" value={name} scale="lg" onChange={handleChange} required />
            </Box>
            <Box mb="24px">
              <Label htmlFor="body">{t('Content')}</Label>
              <Text color="textSubtle" mb="8px">
                {t('Tip: write in Markdown!')}
              </Text>
              <EasyMde
                id="body"
                name="body"
                onTextChange={handleEasyMdeChange}
                value={body}
                options={options}
                required
              />
            </Box>
            {body && (
              <Box mb="24px">
                <Card>
                  <CardHeader>
                    <Heading as="h3" scale="md">
                      {t('Preview')}
                    </Heading>
                  </CardHeader>
                  <CardBody p="0" px="24px">
                    <ReactMarkdown>{body}</ReactMarkdown>
                  </CardBody>
                </Card>
              </Box>
            )}
          </Box>
          
          <Box>
            <Card>
              <CardHeader>
                <Heading as="h3" scale="md">
                  {t('Actions')}
                </Heading>
              </CardHeader>
              <CardBody>
                <Box mb="24px">
                  <SecondaryLabel>{t('Start Date')}</SecondaryLabel>
                  <Input id="name" name="name" value={name} scale="lg" onChange={handleChange} required />
                </Box>
                </CardBody>
            </Card>
          </Box>

        </Layout>
      </form>
    </Container>
  )
}

export default Home