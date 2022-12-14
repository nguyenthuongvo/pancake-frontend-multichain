import { useERC20Factory } from "hooks/useContract"
import { useState } from "react"
import { useActiveChainId } from "hooks/useActiveChainId";
import { useToast } from "@pancakeswap/uikit";
import { ToastDescriptionWithTx } from "components/Toast";

export function useDeployContract(abi: string, bytecode: string, tokenName: string, tokenSymbol: string, tokenSupply: number)  {
    
    const { toastSuccess, toastError } = useToast()
    const [isDeploy, setDeploy] = useState(false)
    const [address, setAddress] = useState('')
    const { chainId } = useActiveChainId()

    const contractFactory = useERC20Factory(abi, bytecode, chainId);
    const deploy = () => {
        setDeploy(true)

        try {
            contractFactory.deploy(tokenName, tokenSymbol, tokenSupply).then((value) => {
                setAddress(value.address)
                setDeploy(false)
                console.log(value.deployTransaction);
                toastSuccess("Success", <ToastDescriptionWithTx txHash={value.deployTransaction.hash} />)
            }).then((error) => {
                console.log(error)
                setDeploy(false)
                toastError("Error", "Deploy smart contract error")
            })
        } catch (error) {
            setDeploy(false)
            toastError("Error", "Deploy smart contract error")
        } finally {
            setDeploy(false)
        }

        
    }

    return [address, isDeploy, deploy]
}

export default useDeployContract