import { NextApiResponse, NextApiRequest } from 'next'

export default function handler(
    _req: NextApiRequest,
    res: NextApiResponse
  ) {
    const metadata = {"name":"Newbies Nft - Level 1","image":"https://tjto.xyz/images/nft_newbies/0x27f10c63c03eac2d196198163a04b31d78c5c20a/newbies.png","attributes":[{"value":"Level","trait_type":"1"}],"description":"NewBies is Generative Dynamic NFT Collection which is taking your certificate off their leash and putting them on-chain","img_box":"https://tjto.xyz/images/nft_newbies/0x27f10c63c03eac2d196198163a04b31d78c5c20a/newbies.png"}
    return res.status(200).json(metadata)
  }