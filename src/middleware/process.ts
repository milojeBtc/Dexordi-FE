import React from "react";

import {
  GetInscribeId,
  GetUtxoId,
  TransferInscrioption,
  CreatingEscrow,
  Broadcasting,
  Unstaking,
  UnstakeBroadcasting,
  SendBTC,
  sendInscription,
} from "./dexordi";
import { Staking, UnstakingDB, getEscrowId } from "./db";

import {
  xODI_TREASURE_WALLET,
  MEME_TREASURE_WALLET,
  LIGO_TREASURE_WALLET,
  TREASURE_WALLET,
} from "../config/treasureWallet";
import { cbrc20Transfer, getInscribeId } from "./cbrc20";

const proxyCatagoryFunc = (cata: string) => {
  if (cata == "xODI") return "brc";
  else if (cata == "MEME") return "odi";
  else if (cata == "LIGO") return "a";
  else return "";
};

interface StakingProcess {
  stakingAmount: number;
  lockTime: number;
  ticker: string;
  catagory: string;
}

interface StakingCbrcProcess {
  stakingAmount: number;
  lockTime: number;
  ticker: string;
}

interface UnstakingProcessProps {
  tokenType: string;
}

interface UnstakingSignBroad {
  params: number[];
}

const timer = (ms: number) => new Promise(res => setTimeout(res, ms))


export const StakingProcess = async ({
  stakingAmount,
  lockTime,
  ticker,
  catagory,
}: StakingProcess) => {
  // const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));
  console.log("stakingAmount ==> ", stakingAmount);
  console.log("lockTime ==> ", lockTime);
  console.log("ticker ==> ", ticker);

  const unisat = (window as any).unisat;

  const utxoFrominscribe = async (orderId: string) => {
    const inscribePayload = await GetInscribeId(orderId);
    // const utxoPayload = await GetUtxoId(inscribePayload);
    // console.log("utxo ==> ", utxoPayload.txId);
    // return utxoPayload.txId;
    const utxoPayload = inscribePayload.substring(0, inscribePayload.length - 2);
    console.log("utxoPayload ==> ", utxoPayload);
    return utxoPayload
  };

  const [address] = await unisat.getAccounts();
  const pubKey: string = await unisat.getPublicKey();
  const StakingAmount = stakingAmount;

  let tempTime = new Date();
  // tempTime.setMonth(tempTime.getMonth() + lockTime);
  tempTime.setMinutes(tempTime.getMinutes() + lockTime);
  // tempTime.setHours(tempTime.getHours() - 1);
  console.log("tempTime ==> ", tempTime.toISOString().toString());

  const LockTime = tempTime.toISOString().toString();

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
      let payload = {};
      try {
        payload = await TransferInscrioption({
          receiveAddress: address,
          feeRate: 10,
          ticker: ticker,
          amount: StakingAmount.toString(),
        });
      } catch (error) {
        console.log("User Reject the wallet!!");
        return 
      }

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
    console.log("================Delay Start==================")
    timer(2000);
    console.log("================Delay  Stop==================")
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

    console.log("signPsbtPayload in staking ==> ", signPsbtPayload);

    // Broadcasting
    const broadcastingPayload = Broadcasting({
      escrowId,
      signedHex: signPsbtPayload,
    });

    console.log("broadcastingPayload ==> ", broadcastingPayload);

    let tokenType = proxyCatagoryFunc(catagory);

    if (tokenType) {
      // DB
      const stakingPayload = Staking({
        wallet: address,
        tokenType: tokenType,
        amount: StakingAmount,
        lockTime: lockTime * 30,
        //   lockTime: lockTime,
        escrowId: escrowId,
      });

      console.log("stakingPayload ==> ", stakingPayload);
      localStorage.removeItem("inscribeId");
      localStorage.removeItem("orderId");
    }

    return true;
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
          catagory,
        }),
      2000
    );
  }
};

// export const StakingCbrcProcess = async ({
//   stakingAmount,
//   lockTime,
//   ticker,
// }: StakingCbrcProcess) => {
//   const unisat = (window as any).unisat;
//   // if(typeof unisat == undefined){
//   unisat.requestAccounts();
//   // }
//   const [address] = await unisat.getAccounts();

//   const list = await unisat.getInscriptions();
//   console.log("list ==> ", list.list[0]);

//   const sendingInscriptionId = list.list[0].inscriptionId;

//   let targetAddress = "";
//   let tickerName = "";

//   console.log("inscription iD ==> ", sendingInscriptionId);

//   switch (ticker) {
//     case "BORD":
//       targetAddress = BORD_TREASURE_WALLET;
//       tickerName = "odi";
//       break;
//     case "CBRC ":
//       targetAddress = CBRC_TREASURE_WALLET;
//       tickerName = "a";
//       break;
//     case "FREN":
//       targetAddress = FREN_TREASURE_WALLET;
//       tickerName = "a";
//       break;

//     default:
//       break;
//   }

//   try {
//     // const flag = unisat.sendInscription(targetAddress, sendingInscriptionId);
//   } catch (error) {
//     console.log(error);
//   }

//   const stakingPayload = Staking({
//     wallet: address,
//     tokenType: tickerName,
//     amount: stakingAmount,
//     lockTime: lockTime * 30,
//     // lockTime: lockTime,
//     escrowId: 0,
//   });

//   console.log("stakingPayload ==> ", stakingPayload);
// };

export const UnstakingProcess = async ({ tokenType }: UnstakingProcessProps) => {
  console.log("============= start UnstakingSignBroad ============= ");
  console.log("============= start UnstakingSignBroad ============= ");


  console.log("============= start UnstakingSignBroad ============= ");
  //   Set env.
  const unisat = (window as any).unisat;
  unisat.requestAccounts();
  const [address] = await unisat.getAccounts();

  let temp = proxyCatagoryFunc(tokenType);

  // 1. Get availale escrow Id
  const params = {
    wallet: address,
    tokenType: temp,
  };

  const payload = await getEscrowId(params);
  const escrowArr = payload.escrowId;

  console.log("payload in UnstakingProcess ==> ", escrowArr);

  // 2.escrow unstaking
  try {
    // TODO
    // await UnstakingSignBroad(escrowArr);

    // 3. managet DB
    const unstakingDB = await UnstakingDB({
      id: payload.brcId,
      removeIndex: payload.removeIndex,
      // tokenType: payload.tokenType TODO
      tokenType: temp,
    });

    console.log("unstaking cbrc20 Transfer ==> ", {
      tick: payload.tokenType,
      // tick: "QWER",
      transferAmount: payload.rewardAmount,
    });

    // 4. send Inscription
    // TODO tokenType
    // const cbrcPayload = await cbrc20Transfer({
    //   // tick: payload.tokenType,
    //   tick: "QWER",
    //   transferAmount: payload.rewardAmount,
    // });

    console.log('payload before send Reward ==>', payload);

    if (tokenType == "xODI") {
      console.log("xODI token claiming...");
      const cbrcPayload = await cbrc20Transfer({
        tick: "QWER",
        // tick:tokenType, TODO active this
        transferAmount: payload.rewardAmount,
      });

      setTimeout(async () => {
        const inscribeId = await getInscribeId({ address: TREASURE_WALLET });
        console.log('cbrc20 inscription Id ==> ', inscribeId);
        await sendInscription({
          targetAddress: address,
          inscriptionId: inscribeId,
          feeRate: 10
        })
        console.log("cbrc20 sendInscription is finished!!");

        return true;
      }, 5000);

      // send inscription user address

      console.log("cbrcPayload ==> ", cbrcPayload);

      return payload.rewardAmount;
    } else if (tokenType == "MEME") {
      console.log("MEME token claiming...");
      console.log("Payload in here ==> ", payload);
      let amount = Math.floor(payload.rewardAmount);
      const payloadTransfer = await TransferInscrioption({
        // TODO change address into treasure
        receiveAddress: TREASURE_WALLET,
        feeRate: 10,
        ticker: "MEMQ",
        amount: amount.toString(),
      });

      console.log("MEMQ Tx ==> ", payloadTransfer);
      const payAmount = await payloadTransfer.data.amount;

      const btcPayload = await SendBTC({
        amount: payAmount,
        targetAddress: payloadTransfer.data.payAddress,
        feeRate: 10,
      });

      console.log("Sent BTC ==>", btcPayload);

      const inscribeId = await GetInscribeId(payloadTransfer.data.orderId);

      console.log("get InscribeId ==> ", inscribeId);

      const sendPayload = await sendInscription({
        targetAddress: address,
        inscriptionId: inscribeId,
        feeRate: 10,
      });

      console.log("sendPayload ==> ", sendPayload);

      // Transfer token into user address
    } else if (tokenType == "LIGO") {
      console.log("LIGO token claiming...");
      let amount = Math.floor(payload.rewardAmount);
      const payloadTransfer = await TransferInscrioption({
        // TODO change address into treasure
        receiveAddress: TREASURE_WALLET,
        feeRate: 10,
        ticker: "LIGO",
        amount: amount.toString(),
      });

      console.log("LIGO Tx ==> ", payloadTransfer);
      const payAmount = await payloadTransfer.data.amount;

      const btcPayload = await SendBTC({
        amount: payAmount,
        targetAddress: payloadTransfer.data.payAddress,
        feeRate: 10,
      });

      console.log("Sent BTC ==>", btcPayload);

      const inscribeId = await GetInscribeId(payloadTransfer.data.orderId);

      console.log("get InscribeId ==> ", inscribeId);

      const sendPayload = await sendInscription({
        targetAddress: address,
        inscriptionId: inscribeId,
        feeRate: 10,
      });

      console.log("sendPayload ==> ", sendPayload);
    }

    return unstakingDB;

  } catch (error) {
    await UnstakingProcess({
      tokenType
    });
  }
};

export const getWalletAddress = async () => {
  const unisat = (window as any).unisat;
  const [address] = await unisat.getAccounts();

  const temp: string = address;

  return temp;
};

// Assist
export const UnstakingSignBroad = async (params: any) => {
  const unisat = (window as any).unisat;
  const [address] = await unisat.getAccounts();
  const pubKey: string = await unisat.getPublicKey();
  const temp: string = address;

  // const params = [462];

  console.log("============= start UnstakingSignBroad ============= ");

  console.log("params ==> ", params);

  for (let i = 0; i < params.length; i++) {
    console.log(`${params[i]}th escrow is being unstaking...`);
    const txHex = await Unstaking({
      params: params[i],
    });

    console.log("txHex ==> ", txHex);

    console.log(`${params[i]}th escrow SignPsgt!!!`);

    // SignPsgt
    const signPsbtPayload: string = await unisat.signPsbt(txHex, {
      autoFinalized: false,
      toSignInputs: [
        {
          index: 1,
          publicKey: pubKey,
        },
      ],
    });

    console.log("signPsbtPayload in unstaking ==> ", signPsbtPayload);

    console.log(`${params[i]}th escrow UnstakeBroadcasting!!!`);

    // Broadcasting
    await UnstakeBroadcasting({
      escrowId: params[i],
      signedHex: signPsbtPayload,
    });
    console.log(`${params[i]}th escrow unstaking End!!!`);
  }
};


