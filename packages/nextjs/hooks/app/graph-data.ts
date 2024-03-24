import { useState, useEffect, useMemo } from "react";
import { useContractRead } from "wagmi";
import { BetCheckPoint } from "~~/types/betting-types";
import { getBettingContractAbi, getBettingContractAddress } from "~~/utils/app/utils";
import { networkID } from "~~/app/config";

export function useGraphData () {
  const [data, setData] = useState<any>();
  const contractData = useContractRead({
    address: getBettingContractAddress(),
    abi: getBettingContractAbi(),
    functionName: 'betCheckpoints',
    watch: true,
    chainId: networkID
  });
  const memoizedContractData = useMemo(() => contractData, [contractData.data]);
  console.log('contractData', contractData)

  useEffect(() => {
    console.log('useGraphData effect')
    if(contractData.data) {
        const __data = contractData.data as any[]
        const { yes, no , labels } = parseContractData(__data);
        const _data = {
            datasets: [{
                id: 1,
                label: 'Yes',
                data: yes
            }, {
                id: 2,
                label: 'No',
                data: no,
            }],
            labels
        }
        console.log('graphData', _data);
        setData(_data)
    }
  }, [memoizedContractData])


  return { data, isLoading: contractData?.isLoading, error: contractData?.error }
}

const parseContractData = (data: any[]) => {
    let yes: number[] = [];
    let no: number[] = [];
    let labels: number[] = [];
    for(let checkpoint of data) {
        yes.push(Number(checkpoint.totalNumYes));
        no.push(Number(checkpoint.totalNumNo));
        labels.push(Number(checkpoint.timestamp))
    }
    return { yes, no, labels }
}