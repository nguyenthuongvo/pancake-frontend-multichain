import { NextApiResponse, NextApiRequest } from 'next'
import solc from "solc"
import fs from "fs"
import path from 'path';

export default async function  handler(
    _req: NextApiRequest,
    res: NextApiResponse
  ) {
    
    const tokenName = _req.body.tokenName;
    const tokenSymbol = _req.body.tokenSymbol;
    const totalSupply = _req.body.totalSupply;

    if (tokenName && tokenSymbol && totalSupply) {
        const jsonDirectory = path.join(process.cwd(), 'src/contract/');
        //Read the json data file data.json
        // const fileContents = await fs.readFile(jsonDirectory + '/data.sol', 'utf8');
        const contractFileContent = fs.readFileSync(jsonDirectory + "ERC20Token.sol").toString();
    
        const input = {
            language: "Solidity",
            sources: {
                "ERC20Token.sol": {
                    content: contractFileContent,
                },
            },
        
            settings: {
                outputSelection: {
                    "*": {
                        "*": ["*"],
                    },
                },
            },
        };
    
        solc.loadRemoteVersion('v0.8.17+commit.8df45f5f', function(err, solcSnapshot) {
            console.log(err);
            console.log(solcSnapshot)
            
         });
    
    
        const output = JSON.parse(solc.compile(JSON.stringify(input)))
        let ContractMapping = {}
    
        for (let contractName in output.contracts['ERC20Token.sol']) {
            ContractMapping[contractName] = output.contracts['ERC20Token.sol'][contractName].evm.bytecode.object
            ContractMapping[contractName+'abi'] = output.contracts['ERC20Token.sol'][contractName].abi
          }
    
        return res.status(200).json(ContractMapping)
    }

    return res.status(200).json({status: 'Not Found'})
  }