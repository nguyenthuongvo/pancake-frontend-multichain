import { NextApiResponse, NextApiRequest } from 'next'
import solc from "solc"
import fs from "fs"
import path from 'path';

export default async function  handler(
    _req: NextApiRequest,
    res: NextApiResponse
  ) {

    const contractAddress = _req.query.contractAddress.toString();

    if (contractAddress && contractAddress.length > 10) {
        const jsonDirectory = path.join(process.cwd(), 'src/contract/');
        //Read the json data file data.json
        // const fileContents = await fs.readFile(jsonDirectory + '/data.sol', 'utf8');
        const contractFileContent = fs.readFileSync(jsonDirectory + "ERC20Token.sol").toString();
    
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
        var urlencoded = new URLSearchParams();
        urlencoded.append("apikey", "C8TBM2P8Y3ZM254NV4K5IE7CTZUW8P7672");
        urlencoded.append("module", "contract");
        urlencoded.append("action", "verifysourcecode");
        urlencoded.append("sourceCode", contractFileContent);
        urlencoded.append("contractaddress", contractAddress);
        urlencoded.append("codeformat", "solidity-single-file");
        urlencoded.append("contractname", "ERC20Token");
        urlencoded.append("compilerversion", "v0.8.17+commit.8df45f5f");
        urlencoded.append("optimizationused", "0");
        urlencoded.append("runs", "200");
        urlencoded.append("evmversion", "");
        urlencoded.append("licenseType", "3");
    
        var requestOptions : RequestInit = {
          method: 'POST',
          headers: myHeaders,
          body: urlencoded,
          redirect: 'follow'
        };
    
        const result = await fetch("https://api-testnet.bscscan.com/api", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
        return res.status(200).json(result)
    }

    

    return res.status(200).json({})
  }