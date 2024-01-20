import React, { useEffect, useState, useRef } from 'react'

import ConnectWalletIcon from '../Icon/ConnectWalletIcon'

import { getWalletAddress } from '../middleware/process';

export default function  ConnectWalletBtn() {

  const [unisatInstalled, setUnisatInstalled] = useState(false);
  const [address, setAddress] = useState('');
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [publicKey, setPublicKey] = useState("");
  const [balance, setBalance] = useState({
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  });
  const [network, setNetwork] = useState("livenet");

  const unisat = (window as any).unisat;

  const selfRef = useRef<{ accounts: string[] }>({
    accounts: [],
  });

  const getBasicInfo = async () => {
    const unisat = (window as any).unisat;
    const [address] = await unisat.getAccounts();
    setAddress(address);

    const publicKey = await unisat.getPublicKey();
    setPublicKey(publicKey);

    const balance = await unisat.getBalance();
    setBalance(balance);

    const network = await unisat.getNetwork();
    setNetwork(network);
  };

  const self = selfRef.current;
  const handleAccountsChanged = (_accounts: string[]) => {
    if (self.accounts[0] === _accounts[0]) {
      // prevent from triggering twice
      return;
    }
    self.accounts = _accounts;
    if (_accounts.length > 0) {
      setAccounts(_accounts);
      setConnected(true);

      setAddress(_accounts[0]);

      getBasicInfo();
    } else {
      setConnected(false);
    }
  };

  useEffect(() => {
  }, [])

  const connectWalletPart = () => { 
    (window as any).unisat.requestAccounts();
    (window as any).unisat.getAccounts();
  }

  return (
    <div className='flex justify-center items-center w-[220px] px-[15px] pt-[18px] pb-[18px] rounded-[15px] border border-[#494459] gap-2 cursor-pointer'>
        <ConnectWalletIcon />  
        <p className='text-white font-League-Spartan text-[23px] cursor-pointer mt-2' onClick={async () => {
                const result = await (window as any).unisat.requestAccounts();
                handleAccountsChanged(result);
              }}> 
            {connected ? address.toString().slice(0,10) + '...' : 'Connect Wallet' }
        </p>
    </div>
  )
} 
