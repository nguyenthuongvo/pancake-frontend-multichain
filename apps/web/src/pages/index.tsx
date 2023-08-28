import PredictionConfigProviders from '../views/Predictions/context/PredictionConfigProviders'
import Predictions from '../views/Predictions'

const IndexPage = () => {
  return (
    <PredictionConfigProviders>
      <Predictions />
    </PredictionConfigProviders>
  )
}

IndexPage.chains = []

export default IndexPage
