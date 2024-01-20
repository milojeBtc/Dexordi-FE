import React, { useState, useRef, useEffect } from "react";

import { useUserContext } from "../context/loadingContext";

import { StakingProcess, StakingCbrcProcess, UnstakingProcess } from "../middleware/process";

import { checkPotentialReward, claimReward } from "../middleware/db";

import { toast } from 'react-toastify';

interface StakeFormPanel {
  catagory: string;
}

export default function StakeFormPanel({ catagory }: StakeFormPanel) {
  const stakingRef = useRef(null);

  const [LockTime, setLockTime] = useState(-1);

  const { loading, setLoading } = useUserContext();

  const [potentialBrcReward, setPotentialBrcReward] = useState(0);
  const [potentialBordReward, setPotentialBordReward] = useState(0);
  const [potentialAReward, setPotentialAReward] = useState(0);

  const stakingBrcHandler = async () => {

    console.log("refer value ==> ", stakingRef.current);
    console.log(
      "refer value ==> ",
      stakingRef.current ? stakingRef.current["value"] : ""
    );
    const stakingAmount = stakingRef.current ? stakingRef.current["value"] : "";
    if (stakingAmount == "") {
        toast.error('Please insert staking Amount')
      console.log("Please insert staking Amount");
      return;
    } else if (LockTime == -1) {
        toast.error('Please insert lockTime Amount')
      console.log("Please insert lockTime Amount");
      return;
    }
    setLoading(true);
    toast.loading('Please wait for staking')

    const result = await StakingProcess({
      stakingAmount: stakingAmount,
      lockTime: LockTime,
      ticker: "DDDF",
    });

    console.log("staking is ended!!! ===========>");
    console.log("result ===========>", result);

    setLoading(false);
    toast.pause();
    toast.success('Successfully staked!!')
  };

  const claimRewardFunc = async () => {
    await claimReward({
        tokenType: catagory
    });
    toast.success('Claim Reward Successfully!!')
    setPotentialBrcReward(0);
  }

  const unstakingFunc = async () => {
    UnstakingProcess({
        tokenType: catagory
    });
  }

  const brcCheck = async () => {
    let temp = await checkPotentialReward({
      tokenType: "brc",
    });
    setPotentialBrcReward(temp);
  };

  const bordCheck = async () => {
    let temp = await checkPotentialReward({
      tokenType: "odi",
    });
    // setPotentialBordReward(temp);
    setPotentialBrcReward(temp);
  };

  const aCheck = async () => {
    let temp = await checkPotentialReward({
      tokenType: "a",
    });
    // setPotentialBordReward(temp);
    setPotentialBrcReward(temp);
  };

  useEffect(() => {
    if(catagory == 'BRC') brcCheck();
    if(catagory == 'ODI') bordCheck();
    if(catagory == 'A') aCheck();
  }, []);

  return (
    <div className="flex min-[1050px]:flex-row max-[1050px]:flex-col max-[1050px]:w-2/3 max-[768px]:w-full mx-auto mt-8 py-8 px-4 rounded-[20px] border border-[#583490] bg-[#1F212B] gap-4">
      {/* Staking Part */}
      <div className="flex flex-col min-[1050px]:w-1/3 max-[1050px]:w-full max-[1050px]:mx-auto px-4">
        {/* Title */}
        <p className="text-white text-center font-DM-Sans text-[24px] font-bold leading-[26px] mb-10">
          Staking
        </p>
        {/* Input */}
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
              ref={stakingRef}
            />
            <p className="w-5/12 text-[#C3C3C3] text-right font-DM-sans text-[18px] font-bold">
              MAX
            </p>
          </div>
        </div>
        {/* Period */}
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
        {/* Button */}
        <div
          className="w-full mt-10 mx-auto py-[14px] px-[53px] rounded-[55px] my-6 cursor-pointer bg-[#9747FF]"
          onClick={() => stakingBrcHandler()}
        >
          <p className="text-white text-center font-DM-Sans text-[20px] font-bold">
            Stake
          </p>
        </div>
      </div>
      {/* Unstaking Part */}
      <div className="flex flex-col min-[1050px]:w-1/3 max-[1050px]:w-full max-[1050px]:mx-auto max-[1050px]:h-[280px] max-[1050px]:mt-10 px-4">
        {/* Title */}
        <p className="text-white text-center font-DM-Sans text-[24px] font-bold leading-[26px] mb-10">
          Unstaking
        </p>
        {/* Input */}
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
              className="w-7/12 text-black text-[18px] font-bold leading-[27px]"
              value={potentialBrcReward}
              disabled={true}
            />
            <p className="w-5/12 text-[#C3C3C3] text-right font-DM-sans text-[18px] font-bold">
              MAX
            </p>
          </div>
        </div>
        {/* Button */}
        <div className="w-full mt-auto mx-auto py-[14px] px-[53px] rounded-[55px] my-6 cursor-pointer bg-[#1a754f]" onClick={() => unstakingFunc()}>
          <p className="text-white text-center font-DM-Sans text-[20px] font-bold">
            Unstaking
          </p>
        </div>
      </div>
      {/* Claim Part */}
      <div className="flex flex-col min-[1050px]:w-1/3 max-[1050px]:w-full max-[1050px]:mx-auto max-[1050px]:h-[280px] max-[1050px]:mt-10 px-4">
        {/* Title */}
        <p className="text-white text-center font-DM-Sans text-[24px] font-bold leading-[26px] mb-10">
          Claim
        </p>
        {/* Input */}
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
              className="w-7/12 text-black text-[18px] font-bold leading-[27px]"
              value={potentialBrcReward}
              disabled={true}
            />
            <p className="w-5/12 text-[#C3C3C3] text-right font-DM-sans text-[18px] font-bold">
              MAX
            </p>
          </div>
        </div>
        {/* Button */}
        <div
          className="w-full mt-auto mx-auto py-[14px] px-[53px] rounded-[55px] my-6 cursor-pointer bg-[#6e7719]"
            onClick={() => claimRewardFunc()}
        >
          <p className="text-white text-center font-DM-Sans text-[20px] font-bold">
            Claim
          </p>
        </div>
      </div>
    </div>
  );
}
