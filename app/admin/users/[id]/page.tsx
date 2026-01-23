'use client'

import React from "react"
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Save, 
  XCircle, 
  Loader2, 
  Calendar, 
  UserCog 
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner' // Import library Sonner

interface Admin {
  id: string
  email: string
  role: string 
  createdAt: string
}

export default function EditAdminPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: '', 
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      fetchAdmin()
    }
  }, [id])

  const fetchAdmin = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/${id}`)
      
      if (!res.ok) throw new Error('Gagal mengambil data')
      
      const data = await res.json()
      
      setAdmin(data)
      setFormData(prev => ({ 
        ...prev, 
        email: data.email || '',
        role: data.role || 'PEGAWAI' 
      }))
      
    } catch (error) {
      console.error('Error fetching admin:', error)
      toast.error("Gagal Memuat Data", {
        description: "Akun admin tidak ditemukan atau terjadi gangguan koneksi."
      })
      setError('Gagal memuat data admin')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validasi Password sebelum kirim
    if (formData.password && formData.password !== formData.confirmPassword) {
      const msg = 'Konfirmasi password tidak cocok!'
      setError(msg)
      toast.error(msg)
      return
    }

    if (formData.password && formData.password.length < 6) {
      const msg = 'Password baru minimal 6 karakter!'
      setError(msg)
      toast.error(msg)
      return
    }

    setSaving(true)

    const promise = async () => {
        const res = await fetch(`/api/admin/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              role: formData.role,
              password: formData.password || undefined,
            }),
        })

        if (!res.ok) {
            const data = await res.json()
            throw new Error(data.error || 'Gagal mengubah data admin')
        }

        return res.json()
    }

    toast.promise(promise(), {
        loading: 'Memperbarui data akun...',
        success: () => {
            router.push('/admin/users')
            router.refresh()
            return `Akun ${formData.email} Berhasil Diperbarui`
        },
        error: (err) => {
            setSaving(false)
            setError(err.message)
            return `Kesalahan: ${err.message}`
        }
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sinkronisasi Akun...</p>
      </div>
    )
  }

  const inputClassName = "w-full px-5 py-3.5 border-2 border-slate-200 rounded-2xl bg-slate-50 text-slate-900 font-bold text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm placeholder:text-slate-300"

  return (
    <div className="space-y-6 font-poppins pb-10 animate-in fade-in duration-500 text-left">
      
      {/* 1. HEADER SECTION */}
      <div className="flex items-center justify-between px-2 text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200 shrink-0">
            <UserCog className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              Edit Akun Admin
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
              Perbarui kredensial dan otoritas akses pengelola
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

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 animate-in fade-in mx-2">
          <XCircle className="text-red-500 shrink-0" size={18} />
          <p className="text-red-700 text-[11px] font-black uppercase tracking-tight">{error}</p>
        </div>
      )}

      {/* 2. FORM CONTAINER */}
      <form onSubmit={handleSubmit}>
        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white p-0 text-left">
          
          <div className="bg-slate-900 px-8 py-5 flex items-center justify-between relative overflow-hidden text-left">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
             <div className="flex items-center gap-3 relative z-10 text-left">
                <ShieldCheck className="text-blue-500" size={18} />
                <h2 className="text-white font-black uppercase tracking-widest text-[10px]">Keamanan & Otoritas Akun</h2>
             </div>
             
             {admin?.createdAt && (
               <div className="relative z-10 hidden md:flex items-center gap-2 text-slate-400 text-[9px] font-black uppercase">
                 <Calendar size={12} /> Terdaftar: {new Date(admin.createdAt).toLocaleDateString('id-ID', {
                   day: '2-digit',
                   month: 'long',
                   year: 'numeric'
                 })}
               </div>
             )}
          </div>

          <div className="p-8 md:p-10 text-left">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start text-left">
              
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Mail size={12} className="text-blue-600" /> Email Admin
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClassName}
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

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Lock size={12} className="text-blue-600" /> Password Baru
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={inputClassName}
                  placeholder="ISI JIKA INGIN GANTI"
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Lock size={12} className="text-blue-600" /> Konfirmasi Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={inputClassName}
                  placeholder="ULANGI PASSWORD"
                  disabled={!formData.password}
                />
              </div>

            </div>

            <div className="mt-10 flex flex-col md:flex-row gap-4 justify-end border-t border-slate-50 pt-8">
               <Button 
                type="submit" 
                disabled={saving} 
                className="md:w-60 h-14 bg-blue-600 hover:bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-200 flex gap-3 transition-all active:scale-95"
               >
                 {saving ? (
                   <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
                 ) : (
                   <>Simpan Perubahan <Save size={16} /></>
                 )}
               </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  )
}