import React, { useRef, useState } from "react";
import { TransferInscrioption } from "../middleware/dexordi";

import { useUserContext } from "../context/loadingContext";

import { StakingProcess, StakingCbrcProcess } from "../middleware/process";

interface StakeFormProps {
  catagory: string;
}

export default function StakeFormComp({ catagory }: StakeFormProps) {
  const [LockTime, setLockTime] = useState(-1);
  const { loading, setLoading } = useUserContext();

  const stakingRef = useRef(null);

  const stakingBrcHandler = async () => {
    console.log('refer value ==> ', stakingRef.current ? stakingRef.current["value"] : '');
    const stakingAmount = stakingRef.current ? stakingRef.current["value"] : '';
    if(stakingAmount == ''){
      console.log('Please insert staking Amount');
      return;
    } else if(LockTime == -1) {
      console.log('Please insert lockTime Amount');
      return;
    }
    
    const result = await StakingProcess({
      stakingAmount: stakingAmount,
      lockTime: LockTime,
      ticker: "DDDF"
    });

    console.log('staking is ended!!! ===========>');
    console.log('result ===========>', result);

    setLoading(false);

  }

  const stakingCbrcHandler = async () => {
    console.log('refer value ==> ', stakingRef.current ? stakingRef.current["value"] : '');
    const stakingAmount = stakingRef.current ? stakingRef.current["value"] : '';
    if(stakingAmount == ''){
      console.log('Please insert staking Amount');
      return;
    } else if(LockTime == -1) {
      console.log('Please insert lockTime Amount');
      return;
    }

    const result = await StakingCbrcProcess({
      stakingAmount: stakingAmount,
      lockTime: LockTime * 30,
      ticker: catagory 
    });



    setLoading(false);
  }

  const stakingHandler = () => {
    setLoading(true);
    if (catagory == 'ODI'){
      stakingBrcHandler();
    } else {
      stakingCbrcHandler();
    }
  }

  return (
    <div
      className={`flex flex-col ${
        catagory == "ODI" ? "w-full" : " max-[1130px]:w-10/12 mx-auto min-[1130px]:w-1/3"
      } bg-[#20212C] rounded-[20px] border border-[#55328B] px-4`}
    >
      <p className="my-8 font-bold text-center text-white font-DM-Sans text-[24px]">
        {catagory != "ODI" ? "Stake" : "Staking Amount"}
      </p>
      <div className="flex flex-row items-center justify-between mx-auto bg-[#393A46] rounded-[20px] max-w-[500px] p-2 h-[82px] px-4">
        <div className="flex flex-row items-center gap-2">
          <img
            className="w-[29px] h-[29px]"
            src="/img/Body/cbrcMark.png"
            alt="CBRC MARK"
          ></img>
          <p className="text-white font-DM-Sans text-[18px] font-bold leading-[26px]">
            {catagory}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between w-7/12 h-[62px] rounded-[20px] px-4 ml-auto bg-white">
          <input
            name="stakeAmount"
            className="w-7/12 text-black text-[18px] font-bold leading-[27px]"
            // ref={stakingRef}
          />
          <p className="w-5/12 text-[#C3C3C3] text-right font-DM-sans text-[18px] font-bold">
            MAX
          </p>
        </div>
      </div>
      {/* Plan */}
      {catagory == "ODI" ? (
        <p className="text-white text-center font-DM-Sans text-[24px] font-bold my-10">Select Staking Plan</p>
      ) : <></>}
      {/* Lock Time */}
      {catagory != "ODI" ? (
        <div className="flex flex-row gap-2 mt-12">
          <div
            className={`flex items-center justify-center w-1/4 h-[60px] ${
              LockTime == 1 ? "bg-[#45108A]" : "bg-[#9747FF]"
            } cursor-pointer rounded-[30px]`}
            onClick={() => setLockTime(1)}
          >
            <p className="text-white text-center font-DM-Sans text-[15px] font-bold">
              1 month
            </p>
          </div>
          <div
            className={`flex items-center justify-center w-1/4 h-[60px] ${
              LockTime == 3 ? "bg-[#45108A]" : "bg-[#9747FF]"
            } cursor-pointer rounded-[30px]`}
            onClick={() => setLockTime(3)}
          >
            <p className="text-white text-center font-DM-Sans text-[15px] font-bold">
              3 months
            </p>
          </div>
          <div
            className={`flex items-center justify-center w-1/4 h-[60px] ${
              LockTime == 5 ? "bg-[#45108A]" : "bg-[#9747FF]"
            } cursor-pointer rounded-[30px]`}
            onClick={() => setLockTime(5)}
          >
            <p className="text-white text-center font-DM-Sans text-[15px] font-bold">
              6 months
            </p>
          </div>
          <div
            className={`flex items-center justify-center w-1/4 h-[60px] ${
              LockTime == 12 ? "bg-[#45108A]" : "bg-[#9747FF]"
            } cursor-pointer rounded-[30px]`}
            onClick={() => setLockTime(12)}
          >
            <p className="text-white text-center font-DM-Sans text-[15px] font-bold">
              12 months
            </p>
          </div>
        </div>
      ) : (
        <div className="flex min-[900px]:flex-row max-[900px]:flex-col w-11/12 justify-center mx-auto gap-2 mt-12]">
          <div
            className={`flex flex-col justify-center rounded-lg ${
              LockTime == 1 ? "bg-[#45108A]" : "bg-[#9747FF]"
            } cursor-pointer min-[900px]:w-1/4 max-[900px]:w-10/12 mx-auto h-[140px] py-4`}
            onClick={() => setLockTime(1)}
          >
            <p className="text-white text-center font-DM-Sans text-[70px] font-bold leading-none">
              5%
            </p>
            <p className="text-white text-center font-DM-Sans text-[27px] font-bold">
              1 month
            </p>
          </div>
          <div
            className={`flex flex-col justify-center rounded-lg ${
              LockTime == 3 ? "bg-[#45108A]" : "bg-[#9747FF]"
            } cursor-pointer min-[900px]:w-1/4 max-[900px]:w-10/12 mx-auto h-[140px] py-4`}
            onClick={() => setLockTime(3)}
          >
            <p className="text-white text-center font-DM-Sans text-[70px] font-bold leading-none">
              10%
            </p>
            <p className="text-white text-center font-DM-Sans text-[27px] font-bold">
              3 month
            </p>
          </div>
          <div
            className={`flex flex-col justify-center rounded-lg ${
              LockTime == 5 ? "bg-[#45108A]" : "bg-[#9747FF]"
            } cursor-pointer min-[900px]:w-1/4 max-[900px]:w-10/12 mx-auto h-[140px] py-4`}
            onClick={() => setLockTime(5)}
          >
            <p className="text-white text-center font-DM-Sans text-[70px] font-bold leading-none">
              30%
            </p>
            <p className="text-white text-center font-DM-Sans text-[27px] font-bold">
              5 month
            </p>
          </div>
          <div
            className={`flex flex-col justify-center rounded-lg ${
              LockTime == 12 ? "bg-[#45108A]" : "bg-[#9747FF]"
            } cursor-pointer min-[900px]:w-1/4 max-[900px]:w-10/12 mx-auto h-[140px] py-4`}
            onClick={() => setLockTime(12)}
          >
            <p className="text-white text-center font-DM-Sans text-[70px] font-bold leading-none">
              90%
            </p>
            <p className="text-white text-center font-DM-Sans text-[27px] font-bold">
              12 month
            </p>
          </div>
        </div>
      )}
      {/* Stake Button */}
      <div className="w-[300px] mt-10 mx-auto py-[21px] px-[53px] rounded-[55px] my-6 cursor-pointer bg-[#9747FF]" onClick={() => stakingHandler()}>
        <p className="text-white text-center font-DM-Sans text-[20px] font-bold">
          Stake
        </p>
      </div>
      <p className="text-[#666666] text-center mb-5 font-DM-Sans text-[18px] font-bold">
        0.5% fee for staking
      </p>
    </div>
  );
}
