"use client"
import React from 'react'
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ThemeProvider } from '@/contexts/theme.context';

function Providers({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default Providers