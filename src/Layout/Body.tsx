import React, { useState, useEffect } from "react";
import { ThreeCircles } from "react-loader-spinner";
import Select from "react-dropdown-select";

import { useUserContext } from "../context/loadingContext";

import SummaryComp from "../component/SummaryComp";
import StakeFormComp from "../component/StakeFormComp";
import BlankComp from "../component/BlankComp";
import LocketStakeComp from "../component/LockedStateComp";

import { TransferInscrioption, Unstaking } from "../middleware/dexordi";
import { checkPotentialReward } from "../middleware/db";
import StakeFormPanel from "../component/StakeFormPanel";
import StakeFormPanel2 from "../component/StakeFormPanel2";
import { cbrc20Test, cbrc20Transfer, cbrc20TransferTest } from "../middleware/cbrc20";
import { UnstakingSignBroad } from "../middleware/process";
import { toast } from "react-toastify";

export default function Body() {
  const [catagory, setCataqgory] = useState(0);

  const { loading, setLoading } = useUserContext();

  const [stage, setStage] = useState(false);

  const [values, setValues] = useState({
    value: "xODI",
    label: "xODI",
  });

  const options = [
    {
      value: "xODI",
      label: "xODI",
    },
    {
      value: "MEME",
      label: "MEME",
    },
    {
      value: "LIGO",
      label: "LIGO",
    },
  ];

  const changeStage = async () => {
    toast.info("Switching successfully");
    setStage(flag => !flag);
  };

  useEffect(() => {
    console.log("dropdown value ==> ", values);
  }, [values]);

  return (
    <div className="flex flex-col mt-20">
      <SummaryComp />
      {/* <div className="flex flex-row items-center min-[1050px]:w-full max-[1050px]:w-2/3 max-[768px]:w-full gap-4 mt-20 ml-auto "> */}
      {/* <p className="font-bold text-white">Staking Type: </p> */}
      {/* <Select
          options={options}
          onChange={(value) =>
            console.log("changed!  ==> ", setValues(value[0]))
          }
          values={[]}
          className="text-blue-600 min-w-[200px]"
        /> */}
      {/* </div> */}

      {catagory == 0 ? (
        <div className="animate-fade">
          <div
            className="w-[380px] rounded-[55px] bg-[#9747FF] py-[21px] px-[53px] mx-auto my-10 cursor-pointer"
            onClick={() => changeStage()}
          >
            <p className="font-DM-sans text-[20px] font-bold text-white text-center">
              {stage ? 'STAKING POOL (CBRC20)' : 'STAKING POOL (BRC20)'}
            </p>
          </div> 
          {stage ?
            (
              <><StakeFormPanel catagory="xODI" />

                <StakeFormPanel catagory="MEME" />

                <StakeFormPanel catagory="LIGO" /></>)

            : (
              <><StakeFormPanel2 catagory="xODI" />

                <StakeFormPanel2 catagory="BORD" />

                <StakeFormPanel2 catagory="CBRC" /></>)}
          <div className="mt-10 mb-20">
            <BlankComp />
          </div>
        </div>
      ) : (
        <div className="animate-fade">
          {/* <div
            className="w-[380px] rounded-[55px] bg-[#9747FF] py-[21px] px-[53px] mx-auto my-10 cursor-pointer"
            onClick={() => testUnstaking()}
          >
            <p className="font-DM-sans text-[20px] font-bold text-white text-center">
              STAKE OTHER (CBRC20)
            </p>
          </div> */}
          <div className="flex flex-row w-full mt-10">
            {/* <StakeFormComp catagory="ODI" /> */}
            <StakeFormPanel catagory="ODI" />
          </div>
          <div className="mt-10 mb-20">
            <LocketStakeComp />
          </div>
        </div>
      )}
      {loading ? (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-10 bg-purple-800 bg-opacity-70">
          <div className="flex flex-col items-center justify-center w-full h-screen gap-5 bg-bgColor">
            <ThreeCircles
              height="120"
              width="120"
              color="#fff"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="three-circles-rotating"
            />
          </div>
          <p className="text-white text-[20px] mt-4">Staking ...</p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
