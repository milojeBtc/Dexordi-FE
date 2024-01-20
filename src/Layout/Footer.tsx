import React from 'react'
import SocialComp from '../component/SocialComp'

export default function Footer() {
  return (
    <div className='flex min-[500px]:flex-row max-[500px]:flex-col mx-auto justify-between w-full my-10'>
        <p className='text-[#A25BFF] font-League-Spartan text-[23px] font-bold max-[500px]:text-center'>
             Copyright © 2024 DexOrdi
        </p>
        <SocialComp />
    </div>
  )
}
