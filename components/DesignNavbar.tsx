"use client"
import React from 'react'
import Link from "next/link"
import { Package2 } from "lucide-react"
import { Separator } from './ui/separator'
import { useDesignPageContext } from '@/contexts/designPage.context'
import Cards from '@/app/design/components/assets'
import { NavigationItem, navigationItems, collectionsItem } from './DesignNavbarItems'
import { DesignPageAssetsType } from '@/contexts/designPage.context'

type NavItemProps = {
  item: NavigationItem
  isActive: boolean
  onClick: (category: string) => void
}

const NavItem = ({ item, isActive, onClick }: NavItemProps) => (
  <div 
    className="flex w-full flex-col items-center hover:cursor-pointer" 
    onClick={() => onClick(item.category)}
  >
    <item.icon className="h-8 w-8" />
    <span className='pt-2 text-center text-sm select-none'>{item.label}</span>
  </div>
)

function DesignNavbar() {
  const {
    isDesignPageAssetsDisplayed, 
    setIsDesignPageAssetsDisplayed,
    currentDesignPageAssetsDisplayed, 
    setCurrentDesignPageAssetsDisplayed
  } = useDesignPageContext()

  const handleNavClick = (category: DesignPageAssetsType) => {
    if (currentDesignPageAssetsDisplayed === category && isDesignPageAssetsDisplayed) {
      setIsDesignPageAssetsDisplayed(false)
      setCurrentDesignPageAssetsDisplayed("")
    } else if (currentDesignPageAssetsDisplayed !== category && isDesignPageAssetsDisplayed) {
      setCurrentDesignPageAssetsDisplayed(category)
    } else {
      setCurrentDesignPageAssetsDisplayed(category)
      setIsDesignPageAssetsDisplayed(true)
    }
  }

  return (
    <aside 
      onClick={(e) => e.stopPropagation()} 
      className="fixed inset-y-0 left-0 z-50 hidden flex-row justify-center border-r bg-background sm:flex"
    >
      <div className={`flex-col w-28 ${isDesignPageAssetsDisplayed && "border-r"}`}>
        <nav className="flex flex-col items-center gap-4 sm:py-4">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Omnicity</span>
          </Link>

          <Separator />

          {navigationItems.map((item) => (
            <NavItem
              key={item.category}
              item={item}
              isActive={currentDesignPageAssetsDisplayed === item.category}
              onClick={() => handleNavClick(item.category as DesignPageAssetsType)}
            />
          ))}
        </nav>

        <nav className="mt-auto mb-4 flex flex-col items-center gap-4 sm:py-4">
          <Separator className='mb-2'/>
          <NavItem
            item={collectionsItem}
            isActive={currentDesignPageAssetsDisplayed === collectionsItem.category}
            onClick={() => handleNavClick(collectionsItem.category as DesignPageAssetsType)}
          />
        </nav>
      </div>
      
      {(currentDesignPageAssetsDisplayed && isDesignPageAssetsDisplayed) && (
        <Cards room={currentDesignPageAssetsDisplayed} />
      )}
    </aside>
  )
}

export default DesignNavbar