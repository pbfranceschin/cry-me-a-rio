import { PublicClient, WalletClient } from "viem"
import { getBettingContractAddress, getBettingContractAbi } from "~~/utils/app/utils";

export const requestResult = async (
    client: PublicClient | undefined,
    signer: WalletClient | undefined,
) => {
    if(!client)
        throw new Error('client undefined')
    if(!signer)
        throw new Error('signer undefined');
    const account = signer.account;
    const { request } = await client.simulateContract({
        account,
        address: getBettingContractAddress(),
        abi: getBettingContractAbi(),
        functionName: 'requestResult'
    });
    const hash = await signer.writeContract(request);
    await client.waitForTransactionReceipt({ hash });
    return hash;
}