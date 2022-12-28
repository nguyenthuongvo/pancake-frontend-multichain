import { useERC721Factory } from "hooks/useContract"
import { useState } from "react"
import { useToast } from "@pancakeswap/uikit";
import { ToastDescriptionWithTx } from "components/Toast";

export function useDeployContract(abi: string, bytecode: string, tokenName: string, tokenSymbol: string, baseUri: string)  {
    
    const { toastSuccess, toastError } = useToast()
    const [isDeploy, setDeploy] = useState(false)
    const [address, setAddress] = useState('')

    const contractFactory = useERC721Factory(abi, bytecode)

    const deploy = () => {
        try {
            setDeploy(true)
            contractFactory.deploy(tokenName, tokenSymbol, baseUri).then((result) => {
                setAddress(result.address);
                toastSuccess("Success", <ToastDescriptionWithTx txHash={result.deployTransaction.hash} />)
                setDeploy(false)
            }).catch((reason) => {
                console.log(reason.message);
                setDeploy(false)
                toastError("Error", reason.message)
            }).finally(() => {
                setDeploy(false)
            })

        } catch (error) {
            console.log(error)
            setDeploy(false)
            toastError("Error", "Deploy smart contract error")
        }
    }

    return  {address, isDeploy, deploy}
}

export default useDeployContract