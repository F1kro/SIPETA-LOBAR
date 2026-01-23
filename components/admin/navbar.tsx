'use client'

import { Button } from '@/components/ui/button'
import { Menu, LogOut, User, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

    const logoutPromise = async () => {
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Gagal logout dari server')
      }
      
      localStorage.clear()
      return response
    }

    toast.promise(logoutPromise(), {
      loading: 'Mengakhiri sesi admin...',
      success: () => {
        router.push('/auth/login')
        router.refresh()
        return 'Logout Berhasil! Sampai jumpa kembali.'
      },
      error: (err) => {
        setLoading(false)
        return `Kesalahan: ${err.message}`
      }
    })
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-100 font-poppins">
      <div className="px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 text-left">
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
            <div className="hidden md:block text-left">
              <h1 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">Admin Panel</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Sistem informasi peta investasi - Lombok Barat</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-slate-100 pr-6 hidden sm:flex text-right">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 text-right">
                Selamat Datang,
              </p>
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight text-right">
                {userEmail.split('@')[0]}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          
          {/* KONFIRMASI LOGOUT MENGGUNAKAN ALERT DIALOG */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                disabled={loading}
                variant="outline" 
                className="h-11 px-5 rounded-xl border-2 border-slate-100 bg-white text-slate-900 font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm flex gap-3 group active:scale-95"
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
            </AlertDialogTrigger>
            
            <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl p-8 font-poppins">
              <AlertDialogHeader className="text-left">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4">
                  <LogOut size={28} />
                </div>
                <AlertDialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                  Konfirmasi Logout
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-500 font-medium text-sm leading-relaxed mt-2">
                  Apakah Anda yakin ingin mengakhiri sesi admin saat ini? Anda perlu login kembali untuk mengakses panel SIPETA.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-8 gap-3">
                <AlertDialogCancel className="h-12 px-6 rounded-xl border-2 border-slate-100 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleLogout}
                  className="h-12 px-8 rounded-xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-slate-200"
                >
                  Ya, Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </nav>
  )
}