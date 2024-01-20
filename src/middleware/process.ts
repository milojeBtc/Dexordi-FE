import React from "react";

import { GetInscribeId, GetUtxoId, TransferInscrioption, CreatingEscrow, Broadcasting, Unstaking } from "./dexordi";
import { Staking, getEscrowId } from "./db";

import {
  BORD_TREASURE_WALLET,
  CBRC_TREASURE_WALLET,
  FREN_TREASURE_WALLET,
} from "../config/treasureWallet";

interface StakingProcess {
  stakingAmount: number;
  lockTime: number;
  ticker: string;
}

interface StakingCbrcProcess {
  stakingAmount: number;
  lockTime: number;
  ticker: string;
}

interface UnstakingProcess {
  tokenType: string;
}

export const StakingProcess = async ({
  stakingAmount,
  lockTime,
  ticker,
}: StakingProcess) => {
  const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));
  console.log("stakingAmount ==> ", stakingAmount);
  console.log("lockTime ==> ", lockTime);
  console.log("ticker ==> ", ticker);

  const unisat = (window as any).unisat;

  const utxoFrominscribe = async (orderId: string) => {
    const inscribePayload = await GetInscribeId(orderId);
    const utxoPayload = await GetUtxoId(inscribePayload);
    console.log("utxo ==> ", utxoPayload.txId);
    return utxoPayload.txId;
  };

  const [address] = await unisat.getAccounts();
  const pubKey: string = await unisat.getPublicKey();
  const StakingAmount = stakingAmount;

  let tempTime = new Date();
  tempTime.setMonth(tempTime.getMonth() + lockTime);
  //   tempTime.setMinutes(tempTime.getMinutes() + lockTime);
  console.log("tempTime ==> ", tempTime.toISOString().toString());

  const LockTime = tempTime.toString();

  // tranfer

  const remainArr = await unisat.getInscriptions();
  const remainInscription = remainArr.list[0];

  const prevId = localStorage.getItem("inscribeId");

  let inscribeId = "";

  if (prevId != null) {
    console.log("Saved Inscribe ID ==>", prevId);
    inscribeId = prevId;
  } else {
    const prevOrderId = localStorage.getItem("orderId");
    if (prevOrderId != null) {
      const newInscribeId = await utxoFrominscribe(prevOrderId);
      localStorage.setItem("inscribeId", newInscribeId);

      inscribeId = newInscribeId;
      console.log("New Inscribe ID by prev OrderID==>", inscribeId);
    } else {
      const payload = await TransferInscrioption({
        receiveAddress: address,
        feeRate: 10,
        ticker: ticker,
        amount: StakingAmount.toString(),
      });

      console.log("Transfer ==> ", (payload as any).data);

      const payAddress = await (payload as any).data.payAddress;
      const amount = await (payload as any).data.amount;
      const orderId = await (payload as any).data.orderId;

      console.log("orderId ==> ", orderId);
      localStorage.setItem("orderId", orderId);

      const txid = await unisat.sendBitcoin(payAddress, amount);
      console.log("txid ==> ", txid);

      const newInscribeId = await utxoFrominscribe(orderId);
      localStorage.setItem("inscribeId", newInscribeId);

      inscribeId = newInscribeId;
      console.log("New Inscribe ID ==>", inscribeId);
    }
  }

  try {
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

    console.log("creating escrow input ==> ", creatingEscrowInput);
    const CreatingEscrowPayload = await CreatingEscrow(creatingEscrowInput);
    console.log("creatingEscrowPayload Result ==> ", CreatingEscrowPayload);

    const transactionList =
      CreatingEscrowPayload.flowEscrows[0].escrow.transactions;

    let escrowParamsHex: string = "";

    transactionList.map((value: any) => {
      if (value.module == "btc") {
        escrowParamsHex = value.hex;
      }
    });

    const escrowId: number = CreatingEscrowPayload.id;

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
      //   lockTime: lockTime,
      escrowId: escrowId,
    });

    console.log("stakingPayload ==> ", stakingPayload);
    localStorage.removeItem("inscribeId");
    localStorage.removeItem("orderId");
    return {
      msg: "Staking Successfully!!",
    };
    // }, 3000);
    // setLoading(false);
  } catch (error: any) {
    // setLoading(false);
    console.log(error);
    // return {
    //   msg: error,
    // };
    setTimeout(
      () =>
        StakingProcess({
          stakingAmount,
          lockTime,
          ticker,
        }),
      2000
    );
  }
};

export const StakingCbrcProcess = async ({
  stakingAmount,
  lockTime,
  ticker,
}: StakingCbrcProcess) => {
  const unisat = (window as any).unisat;
  // if(typeof unisat == undefined){
  unisat.requestAccounts();
  // }
  const [address] = await unisat.getAccounts();

  const list = await unisat.getInscriptions();
  console.log("list ==> ", list.list[0]);

  const sendingInscriptionId = list.list[0].inscriptionId;

  let targetAddress = "";
  let tickerName = "";

  console.log("inscription iD ==> ", sendingInscriptionId);

  switch (ticker) {
    case "BORD":
      targetAddress = BORD_TREASURE_WALLET;
      tickerName = "odi";
      break;
    case "CBRC ":
      targetAddress = CBRC_TREASURE_WALLET;
      tickerName = "a";
      break;
    case "FREN":
      targetAddress = FREN_TREASURE_WALLET;
      tickerName = "a";
      break;

    default:
      break;
  }

  try {
    // const flag = unisat.sendInscription(targetAddress, sendingInscriptionId);
  } catch (error) {
    console.log(error);
  }

  const stakingPayload = Staking({
    wallet: address,
    tokenType: tickerName,
    amount: stakingAmount,
    lockTime: lockTime * 30,
    // lockTime: lockTime,
    escrowId: 0,
  });

  console.log("stakingPayload ==> ", stakingPayload);
};

export const UnstakingProcess = async ({
  tokenType
}: UnstakingProcess) => {
  //   Set env.
  const unisat = (window as any).unisat;
  unisat.requestAccounts();
  const [address] = await unisat.getAccounts();

  // Get availale escrow Id
  const params = {
    wallet: address,
    tokenType
  }

  const escrowArr = await getEscrowId(params);

  console.log('payload in UnstakingProcess ==> ', escrowArr);

  const unstakingArr = await Unstaking({params: escrowArr});

  return
};

export const getWalletAddress = async () => {
  const unisat = (window as any).unisat;
  const [address] = await unisat.getAccounts();

  const temp: string = address;

  return temp;
};
