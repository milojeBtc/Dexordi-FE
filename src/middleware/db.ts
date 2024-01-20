import axios from "axios";

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
  const params = {
    wallet:address,
    tokenType:tokenType
  }

  
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
  const params = {
    wallet:address,
    tokenType:tokenType
  }

  const payload = await axios.post("http://localhost:8080/api/cbrc/claimReward", params);

  console.log('claimReward payload ==> ', payload.data.rewardAmount);

  return payload.data.rewardAmount;
}

export const getEscrowId = async (params:getEscrowId) => {
  const payload = await axios.post("http://localhost:8080/api/cbrc/unstaking", params);
  console.log('unstaking available esocrow id ==> ', payload.data.escrowId);

  return payload.data.escrowId;
}
