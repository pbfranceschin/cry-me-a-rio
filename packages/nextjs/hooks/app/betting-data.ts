import { useEffect, useMemo, useState } from "react";
import { useContractRead } from "wagmi";
import { BetCheckPoint, PriceOfBet } from "~~/types/betting-types";
import { getBettingContractAbi, getBettingContractAddress } from "~~/utils/app/utils";
import { networkID } from "~~/app/config";

export function usePrices() {
    // const [data, setData] = useState<PriceOfBet>();
    const checkpoint = useLastCheckpoint();
    // const memoizedCheckpoint = useMemo(() => checkpoint, [checkpoint]);
    console.log('checkpoint in usePrices', checkpoint);
            const contractData = useContractRead({
                address: getBettingContractAddress(),
                abi: getBettingContractAbi(),
                functionName: 'priceOfBet',
                args: [
                    checkpoint ? checkpoint.totalNumYes : 0, 
                    checkpoint ? checkpoint.totalNumNo : 0
                ],
                watch: true,
                chainId: networkID 
            });
            console.log('contractData in usePrices', contractData)

    return { data: contractData.data as bigint[], isLoading: contractData.isLoading, error: contractData.error }
}

export function useLastCheckpoint() {
    const contractData =  useContractRead({
        address: getBettingContractAddress(),
        abi: getBettingContractAbi(),
        functionName: 'betCheckpoints',
        watch: true,
        chainId: networkID
    });
    console.log('contractData in useLasrCheckPoint', contractData)
    const checkpoints = contractData.data as BetCheckPoint[]
    console.log('checkpoints in useLasrCheckPoint', checkpoints);
    return checkpoints.length > 0
         ? checkpoints[checkpoints.length - 1]
         : null
}