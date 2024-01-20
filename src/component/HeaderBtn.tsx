import React from 'react'

import HomeIcon from '../Icon/HomeIcon'
import ExchangeIcon from '../Icon/ExchangeIcon'
import LaunchpadIcon from '../Icon/LaunchpadIcon'
import CybordPool from '../Icon/CybordPoolIcon'

interface HeaderBtnProps {
    content: string,
    active: boolean
}

export default function HeaderBtn({ content, active }:HeaderBtnProps) {
  return (
    <div className={`flex flex-row py-[8px] px-[16px] items-center text-white text-[23px] gap-2 cursor-pointer hover:animate-pulse hover:bg-[#3d2161] ${active ? 'rounded-md bg-[#9747FF]' : ''}`}>
        <div className='-mt-2'>
            { content === 'Home' ? <HomeIcon /> : <></> }
            { content === 'Exchange' ? <ExchangeIcon /> : <></> }
            { content === 'Launchpad' ? <LaunchpadIcon /> : <></> }
            { content === 'CybordPool' ? <CybordPool /> : <></> }
        </div>
        <div className='font-League-Spartan'>
            { content }
        </div>
    </div>
  )
}
