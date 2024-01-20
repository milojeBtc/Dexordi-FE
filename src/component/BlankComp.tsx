import React from 'react'

export default function BlankComp() {
  return (
    <div className="flex flex-col w-full bg-[rgb(32,33,44)] rounded-[20px] border border-[#55328B] p-4">
        <p className='text-white font-League-Spartan text-[30px] font-normal'>
            Cybord Pool Staking APR
        </p>
        <p className='text-[#9747FF] font-DM-Sans text-[20px] font-normal font-bold'>
            APR will depend on how much token you have for each staking period, divided by how much holders have staked.
        </p>
    </div>
  )
}
