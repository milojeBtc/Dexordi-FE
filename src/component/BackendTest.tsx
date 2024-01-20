import React, { useEffect, useState } from "react";

import { GetInscribeId, GetUtxoId, TransferInscrioption } from "../middleware/dexordi";
import { CreatingEscrow } from "../middleware/dexordi";
import { Broadcasting } from "../middleware/dexordi";
import { Staking } from "../middleware/db";

import { checkPotentialReward } from "../middleware/db";

interface StakingProcess {
  stakingAmount: number,
  lockTime: number,
  ticker: string
}

const BackendTest = () => {
  // const [unisat, setUnisat] = useState<any>(null);

  const unisat = (window as any).unisat;

  const utxoFrominscribe = async (orderId:string) => {
    const [address] = await unisat.getAccounts();
    const pubKey: string = await unisat.getPublicKey();

    console.log('orderId ==> ', orderId);

    const inscribePayload = await GetInscribeId(orderId);
    console.log("inscribePayload ==> ", inscribePayload);
    
    const utxoPayload = await GetUtxoId(inscribePayload);
    console.log('utxo ==> ', utxoPayload.txId);
    return utxoPayload.txId;
  };

  const connectWallet = () => {
    console.log("unisat ==> ", unisat);
    if (unisat) {
      unisat.requestAccounts();
    }
  };

  const StakingProcess = async ({
    stakingAmount,
    lockTime,
    ticker
  }:StakingProcess) => {
    const [address] = await unisat.getAccounts();
    const pubKey: string = await unisat.getPublicKey();
    const StakingAmount = stakingAmount;

    let tempTime = new Date();
    tempTime.setMonth(tempTime.getMonth() + lockTime);
    console.log('tempTime ==> ', (tempTime.toISOString()).toString());

    const LockTime = tempTime.toString();

    try {
      // tranfer
      const payload = await TransferInscrioption({
        receiveAddress: address,
        feeRate: 10,
        ticker: ticker,
        amount: StakingAmount.toString(),
      });

      console.log("Transfer ==> ", (payload as any).data);

      const payAddress = await (payload as any).data.payAddress;
      const amount = await (payload as any).data.amount;
      const orderId = await (payload as any).data.orderId

      console.log('orderId ==> ', orderId);

      const txid = await unisat.sendBitcoin(payAddress, amount);
      console.log("txid ==> ", txid);

      // const inscribeId = await GetInscribeId(orderId);
      // console.log('inscribeId ==> ', inscribeId);
      const inscribeId = await utxoFrominscribe(orderId);

      // Creating Escrow
      const creatingEscrowInput = {
        where: {},
        data: {
          fee: 200,
          staker: {
            utxo: {
              id: inscribeId,
              sequence: 0,
            },
            ordinal: {
              value: address,
              publicKey: pubKey,
            },
            cardinal: {
              value: address,
              publicKey: pubKey,
            },
          },
          product: { id: 14 },
          expiry: LockTime.toString(),
        },
      };

      const creatingEscrowPayload = await CreatingEscrow(creatingEscrowInput);

      const escrowParamsHex: string = creatingEscrowPayload.flowEscrows[0].escrow.transactions[0].hex;
      const escrowId: number = creatingEscrowPayload.id;

      console.log("creatingEscrowPayload ==> ", escrowParamsHex);
      console.log("escrowId ==> ", escrowId);

      // SignPsgt
      const signPsbtPayload: string = await unisat.signPsbt(escrowParamsHex, {
        autoFinalized: false,
        toSignInputs: [
          {
            index: 0,
            address: address,
          },
          {
            index: 1,
            publicKey: pubKey,
          },
        ],
      });

      console.log("signPsbtPayload ==> ", signPsbtPayload);

      // Broadcasting
      const broadcastingPayload = Broadcasting({
        escrowId,
        signedHex: signPsbtPayload,
      });

      console.log("broadcastingPayload ==> ", broadcastingPayload);

      // DB
      const stakingPayload = Staking({
        wallet: address,
        tokenType: "brc",
        amount: StakingAmount,
        lockTime: lockTime * 30,
        escrowId: escrowId,
      });

      console.log("stakingPayload ==> ", stakingPayload);
    } catch (error: any) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    if ((window as any).unisat !== "undefined") {
      console.log("UniSat Wallet is installed!");
      console.log("window.unisat ==> ", (window as any).unisat);
      // setUnisat((window as any).unisat);
    }
  }, []);

  return (
    <div className="flex flex-col p-20 m-10 bg-slate-600">
      <p className="text-center text-[30px] mb-5">Backend Testing</p>
      <div className="flex flex-col gap-2 mx-auto">
        <div
          className="p-5 text-center text-red-600 bg-white border border-red-600 cursor-pointer"
          onClick={() => connectWallet()}
        >
          Connect Wallet
        </div>
        <div
          className="p-5 text-center text-white bg-purple-900 cursor-pointer"
          onClick={() => checkPotentialReward({
            tokenType: "brc"
          })}
        >
          checkPotentialReward
        </div>
        <div
          className="p-5 text-center text-white bg-purple-900 cursor-pointer"
          // onClick={() => StakingProcess()}
        >
          Sign with wallet
        </div>
        <div
          className="p-5 text-center text-white bg-purple-900 cursor-pointer"
          onClick={() => utxoFrominscribe("f7ab068c4888e54bffbc24c20fd879bad0e8d6a8")}
        >
          TransferInscAndsendBtc
        </div>
      </div>
    </div>
  );
};

export default BackendTest;
