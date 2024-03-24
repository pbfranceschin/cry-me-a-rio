import { PublicClient, WalletClient } from "viem";
import { getBettingContractAbi, getBettingContractAddress } from "~~/utils/app/utils";

export const placeYesBet = async (
    client: PublicClient | undefined,
    signer: WalletClient | undefined,
    price: bigint
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
        functionName: 'placeBet',
        args: [1,0],
        value: price
    });
    const hash = await signer.writeContract(request);
    await client.waitForTransactionReceipt({ hash });
    return hash;
}


export const placeNoBet = async (
    client: PublicClient | undefined,
    signer: WalletClient | undefined,
    price: bigint
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
        functionName: 'placeBet',
        args: [0,1],
        value: price
    });
    const hash = await signer.writeContract(request);
    await client.waitForTransactionReceipt({ hash });
    return hash;
}