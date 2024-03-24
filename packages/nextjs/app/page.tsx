"use client";
// import Title from "~~/components/title/Title"; 
// import styles from "./home.module.css";
import styles from "./betting.module.css";
import { homedir } from "os";
import React, { useEffect, useMemo, useState } from 'react';
// import Chart from './Chart'; // Assuming you have a chart component
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePrices, useStrikeTimestamp } from "~~/hooks/app/betting-data";
import { useGraphData } from "~~/hooks/app/graph-data";
import 'chart.js/auto';
import { Line } from "react-chartjs-2";
import { placeNoBet, placeYesBet } from "~~/calls/bet";
import { usePublicClient, useWalletClient } from "wagmi";
import { requestResult } from "~~/calls/claim";
import { formatEther } from "viem";


const BettingInterface = () => {
  const [loadingPage, setLoadingPage] = useState(true);
  const graphData = useGraphData();
  const prices = usePrices();
  const memoizedPrices = useMemo(() => prices, [prices?.data]);
  const memoizedGraphData = useMemo(() => graphData, [graphData?.data]);

  const client = usePublicClient();
  const { data: signer } = useWalletClient();
  const strikeTimestamp = useStrikeTimestamp();

  console.log('striketime', strikeTimestamp ? new Date(1000*Number(strikeTimestamp.data)) : "")

  console.log('prices', prices);


  useEffect(() => {
    console.log('render')
    if(!graphData?.isLoading) {
      setTimeout(() => {
        setLoadingPage(false)
      }, 2000);
    }
  }, [memoizedGraphData, memoizedPrices]);

  const onBet = async (option: 'yes' | 'no') => {
    if(!signer){
      alert('connect a wallet');
      return
    }
    if(!prices) {
      alert('no price data found');
      return
    }
    if(option === 'yes') {
      try {
        await placeYesBet(client, signer, prices.data[0]);
      } catch(err) {
        console.error(err);
      }
    } else if(option === 'no') {
      try {
        await placeNoBet(client, signer, prices.data[1])
      } catch(err) {
        console.error(err);
      }
    }
  }

  const onClaim = async () => {
    if(!signer)
      return
    try {
      await requestResult(client, signer);
    } catch (error:any) {
      console.error(error);
      console.log('errror message', typeof error.message)
      if(error.message.includes('Betting period has not expired.'))
        alert('Betting period has not expired.')
    }
  }

  if(loadingPage)
    return <div>Loading...</div>

  if(graphData.error || prices.error)
    return <div>{graphData.error ? graphData.error.message : prices.error?.message}</div>

  return (
    <div className={styles.main} >
      <ConnectButton />
      <Title />
      <Description />
      <div className={styles.bettingInfo}>
        <div className={styles.flexContainer}>
          <BetChart />
          <BetOptions 
          onYes={() => onBet('yes')} 
          onNo={() => onBet('no')} 
          onClaim={onClaim}
          yesPrice={prices?.data? prices?.data[0] : undefined}
          noPrice={prices?.data? prices?.data[1] : undefined}
          />
        </div>
      </div>
    </div>
  );
}

const Title = () => (
  <header className={styles.header}>
    <h1 className={styles.title}>$CRY ME A RIO</h1>
    
    <div className={styles.subtitle}>
        FUND FLOOD RELIEF BY BETTING ON IF IT'S GON' RAIN
    </div>
  </header>
);

const Description = () => {
 return (
  <div className={styles.descriptionContainer}>
    <div className={styles.description}>
         IS GON' RAIN  <span className={styles.selection}> {'>'}=10MM</span> <span className={styles.selection}>MARCH 25 15:00 AT CEP 22793-310</span>.
      </div>
  </div>
 )
}

const BetOptions = ({onClaim, onYes, onNo, noPrice, yesPrice} : {onYes: any, onNo: any, onClaim: any, noPrice?: bigint, yesPrice?: bigint}) => (
  <div className={styles.optionsContainer}>
    <div className={styles.bettingOptions}>
      <button className={styles.yesButton} onClick={onYes}><span className={styles.yes}>YES</span> <span className={styles.yesPrice}>{yesPrice? `(${formatEther(yesPrice)} ETH)` : "NA"}</span></button>
      <button className={styles.noButton} onClick={onNo}><span className={styles.no}>NO</span> <span className={styles.noPrice}>{noPrice? `(${formatEther(noPrice)} ETH)` : "NA"}</span></button>
      <button className={styles.claimButton} onClick={onClaim}><span className={styles.claim}>CLAIM</span> </button>
    </div>
  </div>
);


const BetChart = () => {
  const data = useGraphData();
  const memoizedGraphData = useMemo(() => data, [data.data]);
  const [chart, setChart] = useState<any>();

  return (
    <div className={styles.chartContainer}>
      {data.isLoading
       ? "Loading..."
       : data.error
        ? data.error.message
        : data.data
         ? <Line datasetIdKey="id" data={data.data} width={590}   options={{ maintainAspectRatio: false }}/>
         : "no data"
        }
    </div>
  )}

export default BettingInterface;
// const Home = () => {
//   return (
//     // <head>
//     // <meta charset="UTF-8">
//     // <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     // <title>Flood Relief Betting</title>
//     // </head>
//     <body className={styles.frame1}>

//     <div className={styles.title}>
//       $CRY ME A RIO
//     </div>

//     <div >
//       <div className={styles.subtitle}>
//         FUND FLOOD RELIEF BY BETTING ON IF IT'S GON' RAIN
//       </div>
//       <div className={styles.description}>
//         IS GON' RAIN {'>'}=10MM <span >MARCH 25 15:00 AT CEP 22793-310</span>.
//       </div>

//       {/* <div className={styles.graph}>
        
//       </div> */}

//       <button className={styles.buttonYes}><span className={styles.yes}>YES</span> <span className={styles.price}>(0.01 ETH)</span></button>
//       <button className={styles.buttonNo}><span className={styles.no}>NO</span> <span className={styles.price}>(0.01 ETH)</span></button>

//       <button className={styles.buttonClaim}>CLAIM</button>
//     </div>

//     </body>
//   );
// };

// export default Home;

// import Link from "next/link";
// import type { NextPage } from "next";
// import { useAccount } from "wagmi";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";

// const Home: NextPage = () => {
//   const { address: connectedAddress } = useAccount();

//   return (
//     <>
//       <div className="flex items-center flex-col flex-grow pt-10">
//         <div className="px-5">
//           <h1 className="text-center">
//             <span className="block text-2xl mb-2">Welcome to</span>
//             <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
//           </h1>
//           <div className="flex justify-center items-center space-x-2">
//             <p className="my-2 font-medium">Connected Address:</p>
//             <Address address={connectedAddress} />
//           </div>
//           <p className="text-center text-lg">
//             Get started by editing{" "}
//             <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
//               packages/nextjs/app/page.tsx
//             </code>
//           </p>
//           <p className="text-center text-lg">
//             Edit your smart contract{" "}
//             <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
//               YourContract.sol
//             </code>{" "}
//             in{" "}
//             <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
//               packages/hardhat/contracts
//             </code>
//           </p>
//         </div>

//         <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
//           <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
//             <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
//               <BugAntIcon className="h-8 w-8 fill-secondary" />
//               <p>
//                 Tinker with your smart contract using the{" "}
//                 <Link href="/debug" passHref className="link">
//                   Debug Contracts
//                 </Link>{" "}
//                 tab.
//               </p>
//             </div>
//             <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
//               <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
//               <p>
//                 Explore your local transactions with the{" "}
//                 <Link href="/blockexplorer" passHref className="link">
//                   Block Explorer
//                 </Link>{" "}
//                 tab.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Home;
