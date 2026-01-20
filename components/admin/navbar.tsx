'use client'

import { Button } from '@/components/ui/button'
import { Menu, LogOut, User, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface AdminNavbarProps {
  onMenuClick: () => void
}

export function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('admin@lobar.go.id')

  useEffect(() => {
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
        router.push('/auth/login')
        router.refresh()
      } else {
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-100 font-poppins">
      <div className="px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick} 
            className="p-2.5 hover:bg-slate-50 rounded-xl md:hidden transition-all text-slate-600 border border-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200 shrink-0">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">Admin Panel</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Management System</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* GREETING & USER INFO */}
          <div className="flex items-center gap-4 border-r border-slate-100 pr-6 hidden sm:flex text-right">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                Selamat Datang,
              </p>
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                {userEmail.split('@')[0]}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          
          <Button 
            onClick={handleLogout}
            disabled={loading}
            variant="outline" 
            className="h-11 px-5 rounded-xl border-2 border-slate-100 bg-white text-slate-900 font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm flex gap-3 group"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
            ) : (
              <>
                <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                Logout
              </>
            )}
          </Button>
        </div>
      </div>
    </nav>
  )
}