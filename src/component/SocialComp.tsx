import React from "react";

import TwitterIcon from "../Icon/TwitterIcon";
import TelegramIcon from "../Icon/TelegramIcon";
import DiscordIcon from "../Icon/DiscordIcon";
import GitBookIcon from "../Icon/GitBookIcon";
import MIcon from "../Icon/MIcon";

export default function SocialComp() {
  return (
    <div className="flex flex-row items-center gap-2 max-[500px]:justify-center">
      <div className="cursor-pointer hover:animate-pulse">
        <TwitterIcon />
      </div>
      <div className="cursor-pointer hover:animate-pulse">
        <TelegramIcon />
      </div>
      <div className="cursor-pointer hover:animate-pulse">
        <DiscordIcon />
      </div>
      <div className="cursor-pointer hover:animate-pulse">
        <GitBookIcon />
      </div>
      <div className="cursor-pointer hover:animate-pulse">
        <MIcon />
      </div>
    </div>
  );
}
