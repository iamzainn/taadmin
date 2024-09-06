// Header.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Auth from './AdminAuth'
import { ModeToggle } from './ToggleMode'

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ?'shadow-lg py-2 bg-white dark:bg-gray-900' : 'py-4 bg-transparent dark:bg-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="hidden md:flex text-xl font-bold text-primary dark:text-white">
                Bahaar Journey
              </span>
            </Link>
          </div>

         
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Auth />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
