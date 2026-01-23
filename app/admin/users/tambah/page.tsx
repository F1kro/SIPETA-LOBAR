'use client'

import React from "react"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  UserPlus, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Save, 
  XCircle, 
  Loader2, 
  UserCog 
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner' // Import library Sonner

export default function TambahAdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'PEGAWAI',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validasi Sederhana Sebelum Kirim
    if (formData.password !== formData.confirmPassword) {
      const msg = 'Konfirmasi password tidak cocok!'
      setError(msg)
      toast.error(msg)
      return
    }

    if (formData.password.length < 6) {
      const msg = 'Password minimal 6 karakter!'
      setError(msg)
      toast.error(msg)
      return
    }

    setLoading(true)

    const promise = async () => {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat admin')
      }

      return data
    }

    toast.promise(promise(), {
      loading: 'Mendaftarkan akun admin baru...',
      success: () => {
        router.push('/admin/users')
        return `Akun ${formData.email} berhasil didaftarkan`
      },
      error: (err) => {
        setLoading(false)
        setError(err.message)
        return `Registrasi Gagal: ${err.message}`
      }
    })
  }

  const inputClassName = "w-full px-5 py-3.5 border-2 border-slate-200 rounded-2xl bg-slate-50 text-slate-900 font-bold text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm placeholder:text-slate-300"

  return (
    <div className="space-y-6 font-poppins pb-10 animate-in fade-in duration-500 text-left">
      
      {/* 1. HEADER SECTION */}
      <div className="flex items-center justify-between px-2 text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              Tambah Admin Baru
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
              Registrasi hak akses pengelola sistem DPMPTSP
            </p>
          </div>
        </div>

        <Link href="/admin/users">
          <Button 
            variant="outline" 
            className="border-2 border-slate-200 rounded-xl px-5 py-5 font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition-all flex gap-2 shadow-sm"
          >
            <ArrowLeft size={16} /> Kembali
          </Button>
        </Link>
      </div>

      {/* Error Alert (Fallback UI) */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 mx-2">
          <XCircle className="text-red-500 shrink-0" size={18} />
          <p className="text-red-700 text-[11px] font-black uppercase tracking-tight">{error}</p>
        </div>
      )}

      {/* 2. FORM CONTAINER */}
      <form onSubmit={handleSubmit}>
        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white p-0">
          
          <div className="bg-slate-900 px-8 py-5 flex items-center justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
             <div className="flex items-center gap-3 relative z-10 text-left">
                <ShieldCheck className="text-blue-500" size={18} />
                <h2 className="text-white font-black uppercase tracking-widest text-[10px]">Kredensial & Otoritas Akun</h2>
             </div>
          </div>

          <div className="p-8 md:p-10 text-left">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Mail size={12} className="text-blue-600" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClassName}
                  placeholder="admin@lobar.go.id"
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Lock size={12} className="text-blue-600" /> Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={inputClassName}
                  placeholder="MIN. 6 KARAKTER"
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Lock size={12} className="text-blue-600" /> Konfirmasi Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={inputClassName}
                  placeholder="ULANGI PASSWORD"
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <UserCog size={12} className="text-blue-600" /> Otoritas Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={`${inputClassName} font-bold`}
                >
                  <option value="PEGAWAI">PEGAWAI / STAFF</option>
                  <option value="SUPERADMIN">SUPERADMIN</option>
                </select>
              </div>

            </div>

            <div className="mt-10 flex flex-col md:flex-row gap-4 justify-end border-t border-slate-50 pt-8">
               <Link href="/admin/users" className="md:w-40">
                  <Button type="button" variant="outline" className="w-full h-14 rounded-2xl border-2 border-slate-200 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50">
                    Batal
                  </Button>
               </Link>
               <Button 
                type="submit" 
                disabled={loading} 
                className="md:w-60 h-14 bg-blue-600 hover:bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-200 flex gap-3 transition-all active:scale-95"
               >
                 {loading ? (
                   <><Loader2 className="w-4 h-4 animate-spin" /> Proses...</>
                 ) : (
                   <>Simpan Akun <Save size={16} /></>
                 )}
               </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  )
}