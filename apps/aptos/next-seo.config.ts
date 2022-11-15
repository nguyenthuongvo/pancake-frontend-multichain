import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | Tjto Playground',
  defaultTitle: 'Tjto Playground',
  description:
    'Cheaper and faster than Superswap, the leading DEX on multi-chain with the best playground in DeFi.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@tjto',
    site: '@tjto',
  },
  openGraph: {
    title: 'Tjto - The most playground DeFi',
    description:
      'Cheaper and faster than Superswap, the leading DEX on multi-chain with the best playground in DeFi.',
    images: [{ url: 'https://pancakeswap.finance/images/hero.png' }],
  },
}
