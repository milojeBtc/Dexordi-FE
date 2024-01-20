import React, { useState, useEffect } from 'react'
import TotalWalletConnectedIcon from '../Icon/TotalWalletConnectedIcon'
import LocketAmountIcon from '../Icon/LockAmountIcon'
import CoinIcon from '../Icon/CoinIcon'
import { checkPotentialReward } from '../middleware/db';

// interface SummaryComp {
//    potentialAmount: any
// }

export default function SummaryComp() {

   const [potentialReward, setPotentialReward]:any = useState(0);

   const initCheck = async () => {
      // const pubKey: string = unisat.getPublicKey();
      let temp = await checkPotentialReward({
        tokenType: "brc"
      });
  
      console.log('check Reward ==> ', temp);
      setPotentialReward(temp);
      // setPotentialReward(temp)
    }

    useEffect(() => {
      initCheck();
    }, [])

  return (
    <div className='flex flex-col min-[1280px]:w-full max-[1280px]:w-2/3 max-[768px]:w-full mx-auto'>
         <div className='bg-[#3D4047] border border-[#6D4E9B] rounded-t-[20px] py-5 pl-10 font-League-Spartan text-white text-[30px]'>
            Your Reward Summary
         </div>
         <div className='flex min-[1280px]:flex-row max-[1280px]:flex-col summary-custom-bg'>
            {/* Element */}
            <div className='flex flex-row min-[1280px]:w-1/4 max-[1280px]:w-full h-[180px] justify-center items-center gap-8 py-6 border border-[#6D3AB6]'>
                {/* Text */}
                <div className='flex flex-col items-center'>
                    <p className='text-white font-DM-Sans text-[20px]'>
                        $ODI Earned
                    </p>
                    <p className='text-[#FFBC2A] font-DM-Sans text-[50px]'>
                        {potentialReward}
                    </p>
                </div>
                {/* Image */}
                <img 
                    src='/img/Body/SummaryEarned.png'
                    alt='Coin'
                    className='w-[100px] h-[102px]'
                >
                </img>
            </div>
            {/* Element */}
            <div className='flex flex-col min-[1280px]:w-1/4 max-[1280px]:w-full h-[180px] justify-center border border-[#6D3AB6]'>
                 <div className='flex flex-row items-center justify-center gap-4'>
                    <TotalWalletConnectedIcon />
                    <p className='text-white text-[20px] font-DM-Sans'>Total Wallet Connected:</p>
                 </div>
                 <p className='text-[#B882FF] font-DM-sans text-[35px] text-center font-bold'>
                    4324.68
                 </p>
            </div>
            {/* Element */}
            <div className='flex flex-col min-[1280px]:w-1/4 max-[1280px]:w-full h-[180px] justify-center border border-[#6D3AB6]'>
                 <div className='flex flex-row items-center justify-center gap-4'>
                    <LocketAmountIcon />
                    <p className='text-white text-[20px] font-DM-Sans'>Staked Locket Amount:</p>
                 </div>
                 <p className='text-white font-DM-sans text-[35px] text-center font-bold'>
                    12399.00
                 </p>
            </div>
            {/* Element */}
            <div className='flex flex-col min-[1280px]:w-1/4 max-[1280px]:w-full h-[180px] justify-center border border-[#6D3AB6]'>
                 <div className='flex flex-row items-center justify-center gap-4'>
                    <CoinIcon />
                    <p className='text-white text-[20px] font-DM-Sans'>Total Staked Value</p>
                 </div>
                 <p className='text-white font-DM-sans text-[35px] text-center font-bold'>
                    $10,123,990.00
                 </p>
            </div>
         </div>
    </div>
  )
}
