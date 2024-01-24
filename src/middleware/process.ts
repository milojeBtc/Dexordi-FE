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
import { Staking, StakingCBRC, UnstakingDB, getEscrowId } from "./db";

import {
  xODI_TREASURE_WALLET,
  MEME_TREASURE_WALLET,
  LIGO_TREASURE_WALLET,
  TREASURE_WALLET,
  CBRC_STAKING_WALLET,
} from "../config/treasureWallet";
import { cbrc20Transfer, getInscribeId } from "./cbrc20";
import { delay } from "../utils/delay";

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

interface UnstakingProcess {
  tokenType: string;
}

interface UnstakingSignBroad {
  params: number[];
}

interface StakingCBRCProcessProps {
  stakingAmount: string,
  lockTime: number,
  ticker: string,
  rewardType: string
}


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

  // if (prevId != null) {
  //   console.log("Saved Inscribe ID ==>", prevId);
  //   inscribeId = prevId;
  // } else {
  //   const prevOrderId = localStorage.getItem("orderId");

  //   if (prevOrderId != null) {
  //     const newInscribeId = await utxoFrominscribe(prevOrderId);
  //     localStorage.setItem("inscribeId", newInscribeId);

  //     inscribeId = newInscribeId;
  //     console.log("New Inscribe ID by prev OrderID==>", inscribeId);
  //   } else {
  //     let payload = {};
  //     try {
  //       payload = await TransferInscrioption({
  //         receiveAddress: address,
  //         feeRate: 10,
  //         ticker: ticker,
  //         amount: StakingAmount.toString(),
  //       });
  //     } catch (error) {
  //       return "Here";
  //     }

  //     console.log("Transfer ==> ", (payload as any).data);

  //     const payAddress = await (payload as any).data.payAddress;
  //     const amount = await (payload as any).data.amount;
  //     const orderId = await (payload as any).data.orderId;

  //     console.log("orderId ==> ", orderId);
  //     localStorage.setItem("orderId", orderId);

  //     const txid = await unisat.sendBitcoin(payAddress, amount);
  //     console.log("txid ==> ", txid);

  //     const newInscribeId = await utxoFrominscribe(orderId);
  //     localStorage.setItem("inscribeId", newInscribeId);

  //     inscribeId = newInscribeId;
  //     console.log("New Inscribe ID ==>", inscribeId);
  //   }
  // }
  const inscribeIdPayload = await unisat.inscribeTransfer(ticker, stakingAmount);

  const inscribeId = inscribeIdPayload.inscriptionId;

  const utxo = inscribeId.substring(0, inscribeId.length - 2);

  console.log("inscribe payload ==> ", inscribeId);

  try {
    let escrowParamsHex: string = "70736274ff0100b202000000025bc6615001d2840d5dbb4f02cbd14d48e571857943a96870f27132f2054a69820000000000ffffffffe59c759fd4c09370b09acf31a5d6b3e715d2aef77987865cb7e874424e383e4d0000000000ffffffff022202000000000000225120fb1bd66f3444a880b5b0f6d54d9431c3ccc1bd4d93ab26197044c40e774343cfdd00000000000000225120815c79489d17d6f3e8ca54a5aa9318fe89a70ec188999126033d7d669f38971f000000000001012b2202000000000000225120815c79489d17d6f3e8ca54a5aa9318fe89a70ec188999126033d7d669f38971f011340b34a06196e916775decfada1c15ad7c367b197091c81d017d23e2e2fc0a7de6f81ae05724755967591b46dcc60cf3d5c9435d3bb3c7b7761c97733863c031d8f011720316c7c23e4c96a5e07187bcde49889126e955982100d7acb383ac92821aafc8e0001012b2202000000000000225120815c79489d17d6f3e8ca54a5aa9318fe89a70ec188999126033d7d669f38971f011340aba03ba0f678b403865e48f4450dddd6b4ef8418e5c5b46db18504eaeceaa84df6c5019949b8cd3d35c03d3772ec48bad5944a1296cc029c7fae7bf49bef1f8d011720316c7c23e4c96a5e07187bcde49889126e955982100d7acb383ac92821aafc8e000000";
    let escrowId = 0;

    console.log("==========================start")
    while (escrowParamsHex.length > 850) {
      // Creating Escrow
      await delay(3000);
      const creatingEscrowInput = {
        where: {},
        data: {
          fee: 200,
          staker: {
            utxo: {
              id: utxo,
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

      const transactionList = CreatingEscrowPayload.flowEscrows[0].escrow.transactions;
      transactionList.map((value: any) => {
        if (value.module == "btc") {
          escrowParamsHex = value.hex;
        }
      });

      escrowId = CreatingEscrowPayload.id;

      await delay(4000);
    }

    console.log("==========================valid hex")

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
    // setTimeout(
    //   () =>
    // await delay(4000);
    // await StakingProcess({
    //   stakingAmount,
    //   lockTime,
    //   ticker,
    //   catagory,
    // })
    // 2000
    // );
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

export const UnstakingProcess = async ({ tokenType }: UnstakingProcess) => {
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
    const flag = await UnstakingSignBroad(escrowArr);

    if (flag == false) {
      return false;
    }

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

      // send inscription user address

      // setTimeout(async () => {
      await delay(5000);
      const inscribeId = cbrcPayload.data + "i0";
      console.log("delay is started!!")
      await delay(10000);
      console.log("delay is ended!!")
      console.log("inscribeId in cbrc20 transfer ==> ", inscribeId)
      await sendInscription({
        targetAddress: address,
        inscriptionId: inscribeId,
        feeRate: 10
      })
      console.log("cbrc20 sendInscription is finished!!");

      return true;
    } else if (tokenType == "MEME") {
      console.log("MEME token claiming...");
      console.log("Payload in here ==> ", payload);
      let amount = Math.floor(payload.rewardAmount);
      if (amount > 0) {


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
        await delay(10000);

        const sendPayload = await sendInscription({
          targetAddress: address,
          inscriptionId: inscribeId,
          feeRate: 10,
        });

        console.log("sendPayload ==> ", sendPayload);
      } else {
        await delay(5000);
      }

      // Transfer token into user address
    } else if (tokenType == "LIGO") {
      console.log("LIGO token claiming...");
      let amount = Math.floor(payload.rewardAmount);
      if (amount > 0) {
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

        await delay(6000);

        const inscribeId = await GetInscribeId(payloadTransfer.data.orderId);

        console.log("get InscribeId ==> ", inscribeId);

        const sendPayload = await sendInscription({
          targetAddress: address,
          inscriptionId: inscribeId,
          feeRate: 10,
        });

        console.log("sendPayload ==> ", sendPayload);
      } else {
        await delay(5000);
      }

    }

    return true;

  } catch (error) {
    console.log("error in unstaking ==> ", error);
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

    if (txHex == "") {
      return false;
    }

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


export const StakingCBRCProcess = async ({
  stakingAmount,
  lockTime,
  ticker,
  rewardType
}: StakingCBRCProcessProps) => {
  const unisat = (window as any).unisat;
  const [address] = await unisat.getAccounts();
  const pubKey: string = await unisat.getPublicKey();

  console.log("tickerName ==> ", ticker)
  const cbrcInscribeId = localStorage.getItem('cbrcInscribeId')

  try {
    let inscribeId = '';
    if (cbrcInscribeId == null) {
      const inscribeInfo = await unisat.inscribeTransfer(ticker, stakingAmount);
      // const inscribeId = inscribeInfo.inscribeId;
      console.log("inscribeInfo ==> ", inscribeInfo);
      inscribeId = inscribeInfo.inscriptionId;
      localStorage.setItem("cbrcInscribeId", inscribeId);
    } else {
      inscribeId = cbrcInscribeId;
    }

    const result = await unisat.sendInscription(TREASURE_WALLET, inscribeId)

    // DB
    const stakingPayload = StakingCBRC({
      wallet: address,
      tokenType: ticker,
      amount: parseInt(stakingAmount),
      lockTime: lockTime * 30,
      //   lockTime: lockTime,
      inscribeId: inscribeId,
    });

    console.log("cbrcInscribeId ==> ", stakingPayload);
    localStorage.removeItem("cbrcInscribeId");
    return true
  } catch (error) {
    console.log('error ==> ', error);
    return false;
  }

}


