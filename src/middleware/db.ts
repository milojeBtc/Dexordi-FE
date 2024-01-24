import axios from "axios";
import { cbrc20Transfer, getInscribeId } from "./cbrc20";
import {
  GetInscribeId,
  SendBTC,
  TransferInscrioption,
  sendInscription,
} from "./dexordi";
import {
  LIGO_TREASURE_WALLET,
  MEME_TREASURE_WALLET,
  TREASURE_WALLET,
} from "../config/treasureWallet";
import { delay } from "../utils/delay";

interface stakingProps {
  wallet: string;
  tokenType: string;
  amount: number;
  lockTime: number;
  escrowId: number;
}

interface stakingCBRCProps {
  wallet: string;
  tokenType: string;
  amount: number;
  lockTime: number;
  inscribeId: string;
}

interface checkPotentialRewardProps {
  tokenType: string;
}

interface getEscrowId {
  wallet: string;
  tokenType: string;
}

interface UnstakingDBProps {
  id: string;
  removeIndex: string;
  tokenType: string;
}

const proxyCatagoryFunc = (cata: string) => {
  if (cata == "xODI") return "brc";
  else if (cata == "MEME") return "odi";
  else if (cata == "LIGO") return "a";
};

export const Staking = ({
  wallet,
  tokenType,
  amount,
  lockTime,
  escrowId,
}: stakingProps) => {
  const params = {
    wallet,
    tokenType,
    stakingData: {
      amount,
      lockTime,
    },
    escrowId,
  };

  const stakingPayload = axios.post(
    "http://146.19.215.121:8080/api/cbrc/staking",
    params
  );

  console.log("staking Result ==> ", stakingPayload);
  return stakingPayload;
};

export const checkPotentialReward = async ({
  tokenType,
}: checkPotentialRewardProps) => {
  try {
    const unisat = await (window as any).unisat;
    const [address] = await unisat.getAccounts();
    console.log("checkPotentialReward ==> ", address);

    // let temp = proxyCatagoryFunc(tokenType);

    const params = {
      wallet: address,
      tokenType: tokenType,
    };

    console.log("params in chechPotential ==>", params);
    if (tokenType == "xODI" || tokenType == "bord" || tokenType == "cbrc") {
      const payload = await axios.post(
        "http://146.19.215.121:8080/api/cbrc/cbrcCheckPotentialReward",
        params
      );

      console.log("checkPotentialReward payload ==> ", payload.data);

      return payload.data.rewardAmount;
    } else {
      const payload = await axios.post(
        "http://146.19.215.121:8080/api/cbrc/CheckPotentialReward",
        params
      );

      console.log("checkPotentialReward payload ==> ", payload.data);

      return payload.data.rewardAmount;
    }

  } catch (error) {
    console.log("new user!!");
    return 0;
  }
};

export const checkPotentialStakingAmount = async ({
  tokenType,
}: checkPotentialRewardProps) => {
  try {
    const unisat = await (window as any).unisat;
    const [address] = await unisat.getAccounts();
    console.log("checkPotentialReward ==> ", address);

    // let temp = proxyCatagoryFunc(tokenType);

    const params = {
      wallet: address,
      tokenType: tokenType,
    };

    if (tokenType == "xODI" || tokenType == "bord" || tokenType == "cbrc") {
      const payload = await axios.post(
        "http://146.19.215.121:8080/api/cbrc/cbrcCheckPotentialReward",
        params
      );

      console.log("checkPotentialReward payload ==> ", payload.data);

      return payload.data.stakingAmount;
    } else {
      const payload = await axios.post(
        "http://146.19.215.121:8080/api/cbrc/CheckPotentialReward",
        params
      );

      console.log("checkPotentialReward payload ==> ", payload.data);

      return payload.data.stakingAmount;
    }
  } catch (error) {
    console.log("new user!!");
    return 0;
  }
};

export const claimReward = async ({ tokenType }: checkPotentialRewardProps) => {
  const unisat = await (window as any).unisat;
  const [address] = await unisat.getAccounts();
  console.log("claimReward ==> ", address);
  let temp = proxyCatagoryFunc(tokenType);
  const params = {
    wallet: address,
    tokenType: temp,
  };

  console.log('claim Reward ==> ', params);

  const payload = await axios.post(
    "http://146.19.215.121:8080/api/cbrc/ClaimReward",
    params
  );

  console.log("claimReward payload ==> ", payload.data);

  if (tokenType == "xODI") {
    const cbrcPayload = await cbrc20Transfer({
      tick: tokenType,
      transferAmount: payload.data.rewardAmount,
    });

    console.log("cbrcPayload ==> ", cbrcPayload);

    const inscribeId = cbrcPayload.data + "i0"
    console.log('cbrc20 inscription Id ==> ', inscribeId);

    console.log("delay is started!!")
    await delay(10000);
    console.log("delay is ended!!")
    // setTimeout(async () => {
    await sendInscription({
      targetAddress: address,
      inscriptionId: inscribeId,
      feeRate: 10
    });

    console.log("cbrc20 sendInscription is finished!!");

    return payload.data.rewardAmount;
  } else {
    console.log("MEME token claiming...");
    let amount = Math.floor(payload.data.rewardAmount);
    let rewardType = '';

    if (tokenType == "MEME") rewardType = "MEMQ";
    else if (tokenType == "LIGO") rewardType = "LIGO";

    const payloadTransfer = await TransferInscrioption({
      receiveAddress: TREASURE_WALLET,
      feeRate: 10,
      ticker: rewardType,
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
    console.log("delay is started!!")
    await delay(10000);
    console.log("delay is ended!!")
    const sendPayload = await sendInscription({
      targetAddress: address,
      inscriptionId: inscribeId,
      feeRate: 10,
    });

    console.log("sendPayload ==> ", sendPayload);
    return payload.data.rewardAmount;
  }
  // }, 10000)
};

export const getEscrowId = async (params: getEscrowId) => {
  const payload = await axios.post(
    "http://146.19.215.121:8080/api/cbrc/unstaking",
    params
  );
  console.log("unstaking available esocrow id ==> ", payload.data.escrowId);

  return payload.data;
};

export const UnstakingDB = async (params: UnstakingDBProps) => {
  console.log("UnstakingDB ==> ", params);

  const payload = await axios.post(
    "http://146.19.215.121:8080/api/cbrc/unstakingDB",
    params
  );

  return payload;
};

export const StakingCBRC = ({
  wallet,
  tokenType,
  amount,
  lockTime,
  inscribeId,
}: stakingCBRCProps) => {
  const params = {
    wallet,
    tokenType,
    stakingData: {
      amount,
      lockTime,
    },
    inscribeId,
  };

  const stakingPayload = axios.post(
    "http://146.19.215.121:8080/api/cbrc/cbrcStaking",
    params
  );

  console.log("staking Result ==> ", stakingPayload);
  return stakingPayload;
};
