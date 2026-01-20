'use client'

import { Button } from '@/components/ui/button'
import { Menu, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface AdminNavbarProps {
  onMenuClick: () => void
}

export function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('Admin')

  useEffect(() => {
    // Ambil email dari cookie untuk display
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)
    
    if (cookies['userEmail']) {
      setUserEmail(decodeURIComponent(cookies['userEmail']))
    }
  }, [])

  const handleLogout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      })
      
      if (response.ok) {
        // Redirect ke login
        router.push('/auth/login')
        router.refresh()
      } else {
        console.error('Logout failed')
        setLoading(false)
      }
    } catch (error) {
      console.error('Logout error:', error)
      setLoading(false)
    }
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick} 
            className="p-2 hover:bg-gray-100 rounded-lg md:hidden transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800">Admin</p>
            <p className="text-xs text-gray-500">{userEmail}</p>
          </div>
          
          <Button 
            onClick={handleLogout}
            disabled={loading}
            variant="outline" 
            size="sm" 
            className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {loading ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </div>
    </nav>
  )
}