import { useERC20Factory } from "hooks/useContract"
import { useCallback, useState } from "react"
import { useActiveChainId } from "hooks/useActiveChainId";
import { useToast } from "@pancakeswap/uikit";
import { ToastDescriptionWithTx } from "components/Toast";

export function useDeployContract(abi: string, bytecode: string, tokenName: string, tokenSymbol: string, tokenSupply: number)  {
    
    const { toastSuccess, toastError } = useToast()
    const [isDeploy, setDeploy] = useState(false)
    const [address, setAddress] = useState('')
    const { chainId } = useActiveChainId()

    console.log(abi)
    console.log(bytecode)
    
    const contractFactory = useERC20Factory(abi, bytecode, chainId)

    const deploy = useCallback(async (): Promise<void> => {

        try {
            
            setDeploy(true)
            const result = await contractFactory.deploy(tokenName, tokenSymbol, tokenSupply)
            console.log(result);
            toastSuccess("Success", <ToastDescriptionWithTx txHash={result.deployTransaction.hash} />)
            setDeploy(false)

        } catch (error) {
            console.log(error)
            setDeploy(false)
            toastError("Error", "Deploy smart contract error")
        }

    },[])

    return  {address, isDeploy, deploy}
}

export default useDeployContract