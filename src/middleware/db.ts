import axios from "axios";
import { cbrc20Transfer } from "./cbrc20";
import { SendBTC, TransferInscrioption } from "./dexordi";
import { LIGO_TREASURE_WALLET, MEME_TREASURE_WALLET } from "../config/treasureWallet";

interface stakingProps {
  wallet: string;
  tokenType: string;
  amount: number;
  lockTime: number;
  escrowId: number;
}

interface checkPotentialRewardProps {
  tokenType: string
}

interface getEscrowId {
  wallet: string;
  tokenType: string;
}

interface UnstakingDBProps {
  id: string,
  removeIndex: string
  tokenType: string,
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

  const stakingPayload = axios.post("http://localhost:8080/api/cbrc/staking", params);

  console.log('staking Result ==> ', stakingPayload);
  return stakingPayload;
};

export const checkPotentialReward = async ({
  tokenType
}:checkPotentialRewardProps) => {

  try {
  const unisat = await (window as any).unisat;
  const [address] = await unisat.getAccounts();
  console.log("checkPotentialReward ==> ", address);

  // let temp = proxyCatagoryFunc(tokenType);

  const params = {
    wallet:address,
    tokenType:tokenType
  }

  console.log("params in chechPotential ==>", params);
    const payload = await axios.post("http://localhost:8080/api/cbrc/checkPotentialReward", params);

    console.log('checkPotentialReward payload ==> ', payload.data.rewardAmount);

    return payload.data.rewardAmount;
  } catch (error) {
    console.log('new user!!')
    return 0;
  }
  
}

export const claimReward = async ({
  tokenType
}:checkPotentialRewardProps) => {

  const unisat = await (window as any).unisat;
  const [address] = await unisat.getAccounts();
  console.log("claimReward ==> ", address);
  let temp = proxyCatagoryFunc(tokenType);
  const params = {
    wallet:address, 
    tokenType:temp
  }

  const payload = await axios.post("http://localhost:8080/api/cbrc/claimReward", params);

  console.log('claimReward payload ==> ', payload.data.rewardAmount);

  // TODO: tick name should be changed to tokenTYpe
  if(tokenType == 'xODI'){
    const cbrcPayload = await cbrc20Transfer({
      tick: "QWER",
      // tick:tokenType, TODO active this
      transferAmount: payload.data.rewardAmount
    });

    // send inscription user address
  
    console.log('cbrcPayload ==> ', cbrcPayload);
  
    return payload.data.rewardAmount;
  } else if(tokenType == 'MEME'){
    
    console.log("MEME token claiming...")
    let amount = Math.floor(payload.data.rewardAmount);
    const payloadTransfer = await TransferInscrioption({
      // TODO change address into treasure
      receiveAddress: address,
      feeRate: 10,
      ticker: 'MEMQ',
      amount: amount.toString(),
    });

    console.log("MEMQ Tx ==> ", payloadTransfer);

    const btcPayload = await SendBTC({
      amount: amount,
      targetAddress: payloadTransfer.data.payAddress,
      feeRate: 10
    })

    console.log('Sent BTC ==>', btcPayload)

    // Transfer token into user address

  } else if (tokenType == 'LIGO'){
    console.log("LIGO token claiming...")
    let amount = Math.floor(payload.data.rewardAmount);
    const payloadTransfer = await TransferInscrioption({
      // TODO change address into treasure
      receiveAddress: address,
      feeRate: 10,
      ticker: 'LIGO',
      amount: amount.toString(),
    });

    console.log("LIGO Tx ==> ", payloadTransfer);

    const btcPayload = await SendBTC({
      amount: amount,
      targetAddress: payloadTransfer.data.payAddress,
      feeRate: 10
    })

    console.log('Sent BTC ==>', btcPayload)

    // Transfer token into user address
  }
  
}

// export const cbrc20Test = async ({
//   address,
//   tokenType,
  
// }) => {
//   const params = {
//     wallet:address,
//     tokenType:tokenType
//   }

//   const payload = await axios.post("http://localhost:8080/api/cbrc/claimReward", params);
// }

export const getEscrowId = async (params:getEscrowId) => {
  const payload = await axios.post("http://localhost:8080/api/cbrc/unstaking", params);
  console.log('unstaking available esocrow id ==> ', payload.data.escrowId);

  return payload.data;
}

export const UnstakingDB = async(params:UnstakingDBProps) => {
  console.log("UnstakingDB ==> ", params);

  const payload = await axios.post("http://localhost:8080/api/cbrc/unstakingDB", params);

  return payload
}
