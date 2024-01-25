import React, { useState, useRef, useEffect } from "react";

import { useUserContext } from "../context/loadingContext";

import {
  StakingCBRCProcess,
  cbrcUnstakingProcess,
} from "../middleware/process";

import { cbrcClaimReward, checkCbrcPotentialReward, checkCbrcPotentialStakingAmount, claimReward } from "../middleware/db";

import { toast } from "react-toastify";

const proxyCatagory = {
  xODI: "brc",
  MEME: "odi",
  LIGO: "a",
};

const proxyCatagoryFunc = (cata: string) => {

  if (cata == "BORD-xODI")
    return {
      stakingType: "BORD",
      rewardType: "xODI"
    }
  else if (cata == "xODI-BORD")
    return {
      stakingType: "xODI",
      rewardType: "BORD"
    }
  else if (cata == "xODI-CBRC")
    return {
      stakingType: "xODI",
      rewardType: "CBRC"
    }

};

interface StakeFormPanel {
  catagory: string;
}

export default function StakeFormPanel2({ catagory }: StakeFormPanel) {
  const stakingRef = useRef(null);

  const [LockTime, setLockTime] = useState(-1);

  const { loading, setLoading, connected } = useUserContext();

  const [potentialBrcReward, setPotentialBrcReward] = useState(0);
  const [potentialBrcAmount, setPotnetialBrcAmount] = useState(0)
  // const [potentialBordReward, setPotentialBordReward] = useState(0);
  // const [potentialAReward, setPotentialAReward] = useState(0);

  const [stakingType, setStakingType] = useState("");
  const [rewardType, setRewardType] = useState("");

  const stakingCatagory = () => {
    if (catagory == "xODI") return "BORD";
    else if (catagory == "BORD") return "xODI";
    else if (catagory == "CBRC") return "xODI";
  }

  const stakingBrcHandler = async () => {

    // console.log("connected ==> ", connected);
    // if(connected == false){
    //   toast.warn("Please connect wallet first");
    //   return
    // }

    console.log("refer value ==> ", stakingRef.current);
    console.log(
      "refer value ==> ",
      stakingRef.current ? stakingRef.current["value"] : ""
    );
    const stakingAmount = stakingRef.current ? stakingRef.current["value"] : "";
    if (stakingAmount == "") {
      toast.error("Please insert staking Amount");
      console.log("Please insert staking Amount");
      return;
    } else if (LockTime == -1) {
      toast.error("Please insert lockTime Amount");
      console.log("Please insert lockTime Amount");
      return;
    }
    setLoading(true);
    toast.info('Please wait for staking')

    const result = await StakingCBRCProcess({
      stakingAmount: stakingAmount,
      lockTime: LockTime,
      ticker: stakingType,
      rewardType: catagory
    });
    setLoading(false)
    if (result) {
      toast.success("Staking successfully!");
    } else {
      toast.error("Something is wrong!!");
    }

  };

  const claimRewardFunc = async () => {

    // if(connected == false){
    //   toast.warn("Please connect wallet first");
    //   return
    // }

    if (potentialBrcReward == 0) {
      toast.warn("There is no Reward!!");
    } else {
      setLoading(true);
      await cbrcClaimReward({
        tokenType: catagory,
      });
      setLoading(false);
      toast.success("Claim Reward Successfully!!");
      setPotentialBrcReward(0);
    }
  };

  const unstakingFunc = async () => {
    if (potentialBrcAmount) {
      toast.info("Unstaknig is started!!")
      setLoading(true);
      const flag = await cbrcUnstakingProcess({
        tokenType: catagory,
      });

      setLoading(false);
      if (flag == false) {
        toast.error("Network is busy now. Try again after 10m")
      } else {
        toast.success("Unstaking Successfully!!");
        setPotentialBrcReward(0);
        setPotnetialBrcAmount(0)
      }
    } else {
      toast.error("Not found staking escrow!!");
    }

  };


  const xODICheck = async () => {
    let temp = await checkCbrcPotentialReward({
      tokenType: "xODI",
    });
    setPotentialBrcReward(temp);

    let stakingAmount = await checkCbrcPotentialStakingAmount({
      tokenType: "xODI",
    })
    setPotnetialBrcAmount(stakingAmount)

  };

  const bordheck = async () => {
    let temp = await checkCbrcPotentialReward({
      tokenType: "BORD",
    });
    // setPotentialBordReward(temp);
    setPotentialBrcReward(temp);

    let stakingAmount = await checkCbrcPotentialStakingAmount({
      tokenType: "BORD",
    })
    setPotnetialBrcAmount(stakingAmount)
  };

  const cbrcCheck = async () => {
    let temp = await checkCbrcPotentialReward({
      tokenType: "CBRC",
    });
    // setPotentialBordReward(temp);
    setPotentialBrcReward(temp);

    let stakingAmount = await checkCbrcPotentialStakingAmount({
      tokenType: "CBRC",
    })
    setPotnetialBrcAmount(stakingAmount)
  };

  useEffect(() => {
    if (catagory == "xODI") xODICheck();
    if (catagory == "BORD") bordheck();
    if (catagory == "CBRC") cbrcCheck();

    if (catagory == "xODI") setStakingType("BORD");
    if (catagory == "BORD") setStakingType("xODI");
    if (catagory == "CBRC") setStakingType("xODI");
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
              {stakingCatagory()}
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
            className={`flex items-center justify-center w-1/4 h-[60px] ${LockTime == 1 ? "bg-[#45108A]" : "bg-[#9747FF]"
              } cursor-pointer rounded-[30px]`}
            onClick={() => setLockTime(1)}
          >
            <p className="text-white text-center font-DM-Sans text-[15px] font-bold">
              1 month
            </p>
          </div>
          <div
            className={`flex items-center justify-center w-1/4 h-[60px] ${LockTime == 3 ? "bg-[#45108A]" : "bg-[#9747FF]"
              } cursor-pointer rounded-[30px]`}
            onClick={() => setLockTime(3)}
          >
            <p className="text-white text-center font-DM-Sans text-[15px] font-bold">
              3 months
            </p>
          </div>
          <div
            className={`flex items-center justify-center w-1/4 h-[60px] ${LockTime == 5 ? "bg-[#45108A]" : "bg-[#9747FF]"
              } cursor-pointer rounded-[30px]`}
            onClick={() => setLockTime(5)}
          >
            <p className="text-white text-center font-DM-Sans text-[15px] font-bold">
              6 months
            </p>
          </div>
          <div
            className={`flex items-center justify-center w-1/4 h-[60px] ${LockTime == 12 ? "bg-[#45108A]" : "bg-[#9747FF]"
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
              value={potentialBrcAmount}
              disabled={true}
            />
            <p className="w-5/12 text-[#C3C3C3] text-right font-DM-sans text-[18px] font-bold">
              MAX
            </p>
          </div>
        </div>
        {/* Button */}
        <div
          className="w-full mt-auto mx-auto py-[14px] px-[53px] rounded-[55px] my-6 cursor-pointer bg-[#1a754f]"
          onClick={() => unstakingFunc()}
        >
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
