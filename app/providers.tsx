"use client"
import React from 'react'
import { TooltipProvider } from '@radix-ui/react-tooltip';

function Providers({children}: {children: React.ReactNode}) {
  return (
    <TooltipProvider>
        {children}
    </TooltipProvider>
  )
}

export default Providers