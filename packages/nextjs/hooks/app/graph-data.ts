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

  console.log('data in useGraphData', data)

  return { data, isLoading: contractData?.isLoading, error: contractData?.error }
}

const parseContractData = (data: any[]) => {
    let yes: number[] = [];
    let no: number[] = [];
    let labels: string[] = [];
    for(let checkpoint of data) {
        yes.push(Number(checkpoint.totalNumYes));
        no.push(Number(checkpoint.totalNumNo));
        const date = new Date(1000*Number(checkpoint.timestamp))
        console.log('date', date)
        labels.push(`${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
    }
    return { yes, no, labels }
}