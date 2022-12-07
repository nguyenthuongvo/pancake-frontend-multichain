import { useTranslation } from '@pancakeswap/localization'
import Page from 'components/Layout/Page'

const Home: React.FC<React.PropsWithChildren> = () => {

  const { t } = useTranslation()

  return (
    <Page>
      Hello world
    </Page>
  )
}

export default Home
