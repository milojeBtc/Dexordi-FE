import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

import { IoReorderThree } from "react-icons/io5";
// import Image from 'next/image'

import HeaderBtn from "../component/HeaderBtn";

import TwitterIcon from "../Icon/TwitterIcon";
import TelegramIcon from "../Icon/TelegramIcon";
import DiscordIcon from "../Icon/DiscordIcon";
import GitBookIcon from "../Icon/GitBookIcon";
import MIcon from "../Icon/MIcon";

import ConnectWalletBtn from "../component/ConnectWalletBtn";
import SocialComp from "../component/SocialComp";

export default function Header() {

  const [sidebar, setSidebar] = useState(false);
  return (
    <>
      <div className="flex flex-row items-center justify-between w-full gap-2">
        <div className="flex flex-row w-full gap-6">
          {/* Logo */}
          <img
            src={"/img/Header/Logo.png"}
            alt="Logo"
            className="w-[120px] h-[120px]"
          />
          {/* Button List */}
          <div className="flex flex-row items-center gap-2 ml-10 font-League-Spartan max-[1024px]:hidden">
            <HeaderBtn content="Home" active={false} />
            <HeaderBtn content="Exchange" active={false} />
            <HeaderBtn content="Launchpad" active={false} />
            <HeaderBtn content="CybordPool" active={true} />
          </div>
          <div className="flex flex-row items-center justify-center min-[1280px]:hidden ml-auto cursor-pointer hover:animate-pulse" onClick={() => setSidebar(flag => !flag)}>
            <IoReorderThree size={'50px'} color="white" />
          </div>
        </div>
        {/* Social */}
        <div className="flex flex-row items-center gap-4  max-[1280px]:hidden">
          <SocialComp />
          {/* Connect Wallet */}
          <ConnectWalletBtn />
        </div>
      </div>
      {sidebar ?
        <div className="fixed top-0 left-0 flex px-4 pt-[80px] flex-col w-[300px] h-screen z-10 bg-slate-800 min-[1280px]:hidden">
          {/* Button List */}
          <div className="flex flex-col gap-2 font-League-Spartan">
            <HeaderBtn content="Home" active={false} />
            <HeaderBtn content="Exchange" active={false} />
            <HeaderBtn content="Launchpad" active={false} />
            <HeaderBtn content="CybordPool" active={true} />
          </div>
          <div className="flex justify-center mt-auto mb-10">
            <ConnectWalletBtn />
          </div>
          <div className="flex justify-center mb-10">
            <SocialComp />
          </div>
        </div> : <></>
      }
    </>
  );
}
