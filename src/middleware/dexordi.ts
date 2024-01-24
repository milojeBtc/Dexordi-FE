import axios from "axios";
import { BEARER_TOKEN } from "../config/authkeys";
import { OPENAPI_UNISAT } from "../config/url";

import { MY_COMPANY_API_KEY } from "../config/authkeys";

import { DEEP_LAKE_REST_API_URL } from "../config/url";
import { delay } from "../utils/delay";

// interface StakingDataProps {
//   amount: number;
//   lockTime: number;
// }
// interface StakingProps {
//   wallet: string;
//   tokenType: string;
//   stakingData: StakingDataProps;
//   escrowId: number;
// }
interface TransferInscriptionProps {
  receiveAddress: string;
  feeRate: number;
  ticker: string;
  amount: string;
}
interface SendBTCProps {
  amount: number;
  targetAddress: string;
  feeRate: number;
}

interface CreatingEscrowProps {
  where: object;
  data: {
    fee: number;
    staker: {
      utxo: {
        id: string;
        sequence: number;
      };
      ordinal: {
        value: string;
        publicKey: string;
      };
      cardinal: {
        value: string;
        publicKey: string;
      };
    };
    product: {
      id: number;
    };
    expiry: string;
  };
}

interface SignPsbtProps {
  hex: string;
  address: string;
  publicKey: string;
}

interface BroadcastingProps {
  escrowId: number;
  signedHex: string;
}

interface UnstakingArr {
  params: number;
}

interface sendInscriptionProps {
  targetAddress: string,
  inscriptionId: string,
  feeRate: number
}

export const GetInscribeId = async (orderId: string) => {
  const payload = await axios.post(
    "http://146.19.215.121:8080/api/cbrc/getInscribeId",
    {
      orderId: orderId,
    }
  );

  console.log("payload.data in getInscribeId ==> ", payload.data);
  return payload.data;
};

export const GetUtxoId = async (inscribeId: string) => {
  console.log("inscribeId in GetUxoId ==> ", inscribeId)
  const payload = await axios.post(`http://146.19.215.121:8080/api/cbrc/getUtxoId`, {
    inscribeId,
  });
  console.log("Fianl Result in GetUtxoId ==> ", payload);
  return payload.data.result;
};

export const Testing = async () => {
  const payload = await axios.post("http://146.19.215.121:8080/api/test", {});
  return payload.data;
};
//Staking 1
export const TransferInscrioption = async ({
  receiveAddress,
  feeRate,
  ticker,
  amount,
}: TransferInscriptionProps) => {
  const params = {
    receiveAddress: receiveAddress,
    feeRate: feeRate,
    outputValue: 546,
    devAddress: receiveAddress,
    devFee: 0,
    brc20Ticker: ticker,
    brc20Amount: amount.toString(),
  };

  console.log('params in transfer ==> ', params);

  const headers = { Authorization: BEARER_TOKEN };
  console.log("headers ==> ", headers);
  const payload = await axios.post(`${OPENAPI_UNISAT}/brc20-transfer`, params, {
    headers: {
      Authorization: BEARER_TOKEN,
    },
  });

  console.log("payaddress ==> ", payload.data);

  console.log("transferInscription ==> ", payload.data);

  return payload.data
};
//Staking 2
export const SendBTC = async ({
  amount,
  targetAddress,
  feeRate,
}: SendBTCProps) => {
  const params = {
    amount,
    targetAddress,
    feeRate,
  };
  const payload = await axios.post(
    "http://146.19.215.121:8080/api/cbrc/sendBTC",
    params
  );
  console.log("payload ==> ", payload);
  return payload;
};
//Staking 3
export const CreatingEscrow = async (params: CreatingEscrowProps) => {
  console.log("params ==> ", params);

  const headers = { Authorization: MY_COMPANY_API_KEY };
  console.log("headers ==> ", headers);
  const payload = await axios.post(
    `${DEEP_LAKE_REST_API_URL}/flows/execute`,
    params,
    { headers }
  );
  console.log(payload.data);
  return payload.data;
};
//Staking 4
export const SignPsbt = async ({ hex, address, publicKey }: SignPsbtProps) => {
  const payload = await (window as any).unisat.signPsbt(hex, {
    autoFinalized: false,
    toSignInputs: [
      {
        index: 0,
        address: address,
      },
      {
        index: 1,
        publicKey: publicKey,
      },
    ],
  });

  return payload.data;
};

export const Broadcasting = async ({
  escrowId,
  signedHex,
}: BroadcastingProps) => {
  const qs = require("qs");
  const headers = { Authorization: MY_COMPANY_API_KEY };
  const data = {
    state: "broadcast-stake",
    transactions: [
      {
        hex: signedHex,
      },
    ],
    product: {
      id: 14,
    },
  };
  const where = qs.stringify({ where: { id: escrowId } });
  const payload = await axios.post(
    `${DEEP_LAKE_REST_API_URL}/flows/execute?${where}`,
    { data },
    { headers }
  );

  return payload.data;
};

// Unstaking 2
export const Unstaking = async ({ params }: UnstakingArr) => {

  let txHex = '70736274ff0100db0200000003d26851a5fc08408ed2ffe9d9247afd1bd441adc6de30fc8fb726c5f8c5e00368000000000001000000d26851a5fc08408ed2ffe9d9247afd1bd441adc6de30fc8fb726c5f8c5e003680100000000ffffffff05ab647547736066d63619fb8a9233e68e92c36d7dbb3a367a269f58e66c5cc30100000000ffffffff022202000000000000225120815c79489d17d6f3e8ca54a5aa9318fe89a70ec188999126033d7d669f38971f0400000000000000225120815c79489d17d6f3e8ca54a5aa9318fe89a70ec188999126033d7d669f38971f9de1af650001012b2202000000000000225120c4c1db137e5b7f0210b79120a86e4b1fc1794053706062ecbcd0cc2d67020d8b2215c093674766caa3db9c0f63c4b74f302510c509d6d0ffac9d67214d8f03cb2ed27a2a049de1af65b17520559ad6902ae6f93103038078c0c01934fe1a551273d433c303e03658b117daa6acc00001012bdd00000000000000225120815c79489d17d6f3e8ca54a5aa9318fe89a70ec188999126033d7d669f38971f011720316c7c23e4c96a5e07187bcde49889126e955982100d7acb383ac92821aafc8e0001012bdd00000000000000225120815c79489d17d6f3e8ca54a5aa9318fe89a70ec188999126033d7d669f38971f011720316c7c23e4c96a5e07187bcde49889126e955982100d7acb383ac92821aafc8e000000';

  let tryTime = 0;
  let MAX_TRY_TIME = 3

  while (txHex.length > 850 && tryTime < MAX_TRY_TIME) {

    console.log("==============Retry delay1=============")
    await delay(5000);
    tryTime++;
    console.log("==============Retry delay2=============")
    const headers = { Authorization: MY_COMPANY_API_KEY };
    const data = {
      state: "unstake",
      fee: 200,
      index: 0,
      product: {
        id: 14,
      },
    };

    console.log('ready to unstake!!!!!!!!!!!!!!!!!!!!!!')
    const qs = require("qs");
    const where = qs.stringify({ where: { id: params } });

    console.log("URL ==> ", where);
    console.log("payload ==> ", data);

    const payload = await axios.post(
      `${DEEP_LAKE_REST_API_URL}/flows/execute?${where}`,
      { data },
      { headers }
    );

    const wholeContent = payload.data;

    console.log("wholeContent ==> ", wholeContent);

    const txArr = payload.data.flowEscrows[0].escrow.transactions;

    console.log('txArr in unstaking ==> ', txArr);



    txArr.map((value: any) => {
      if (value.module == 'btc' && value.type == "partially-signed") {
        console.log("FInd the txHex !!!!!!!!!!!!!! ")
        txHex = value.hex;
      }
    })

    console.log('payload in unstaking ==> ', txHex);

    console.log(" Unstaking ID !!!!!!!!!!! ==> ", params);

  }

  if(tryTime == MAX_TRY_TIME){
    return ""
  }

  return txHex;

};

export const UnstakeBroadcasting = async ({
  escrowId,
  signedHex,
}: BroadcastingProps) => {
  const qs = require("qs");
  const headers = { Authorization: MY_COMPANY_API_KEY };
  const data = {
    state: "broadcast-unstake",
    transactions: [
      {
        hex: signedHex,
      },
    ],
    product: {
      id: 14,
    },
  };
  const where = qs.stringify({ where: { id: escrowId } });
  const payload = await axios.post(
    `${DEEP_LAKE_REST_API_URL}/flows/execute?${where}`,
    { data },
    { headers }
  );

  return payload.data;
};

// export const Staking = async (params: StakingProps) => {
//   console.log("params ==> ", params);
//   const payload = await axios.post(
//     "http://146.19.215.121:8080/api/cbrc/staking",
//     params
//   );
//   console.log("Staking Test ==> ", payload.data);
//   return payload.data;
// };

export const sendInscription = async ({
  targetAddress,
  inscriptionId,
  feeRate
}: sendInscriptionProps) => {
  console.log("Ready to enter into sendInscription ==========> ")
  const payload = await axios.post("http://146.19.215.121:8080/api/cbrc/sendInscription", {
    targetAddress,
    inscriptionId,
    feeRate
  })

  return payload;
}
