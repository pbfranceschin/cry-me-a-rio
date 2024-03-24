"use client";
// import Title from "~~/components/title/Title"; 
// import styles from "./home.module.css";
import styles from "./betting.module.css";
import { homedir } from "os";
import React from 'react';
// import Chart from './Chart'; // Assuming you have a chart component

const BettingInterface = () => {
  // You would have state and functions to handle betting logic

  return (
    <div >
      <Title />
      <Description />
      {/* <Chart /> */}
      <BetOptions />
      <ClaimButton />
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
         IS GON' RAIN {'>'}=10MM <span >MARCH 25 15:00 AT CEP 22793-310</span>.
      </div>
  </div>
 )
}

const BetOptions = () => (
  <div className="bet-options">
    <button className={styles.yesButton}>YES (0.01 ETH)</button>
    <button className={styles.noButton}>NO (0.01 ETH)</button>
  </div>
);

const ClaimButton = () => (
  <button className={styles.claimButton}>CLAIM</button>
);

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
