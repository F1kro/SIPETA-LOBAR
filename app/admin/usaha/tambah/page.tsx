'use client'

import React from "react"
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Building2, X, PlusCircle, Database } from 'lucide-react'
import Link from 'next/link'
import BusinessForm from "@/components/business-form"

export default function TambahUsahaPage() {
  const router = useRouter()

  return (
    <div className="font-poppins pb-10 w-full max-w-[1400px] mx-auto animate-in fade-in duration-500 space-y-6">
      
      {/* 1. HEADER SECTION - Identik dengan Tambah Admin */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
            <PlusCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              Tambah Usaha Baru
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
              Input data potensi & unit usaha baru ke database investasi
            </p>
          </div>
        </div>

        <Link href="/admin/usaha">
          <Button 
            variant="outline" 
            className="border-2 border-slate-200 rounded-xl px-5 py-5 font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition-all flex gap-2 shadow-sm"
          >
            <ArrowLeft size={16} /> Kembali
          </Button>
        </Link>
      </div>

      {/* 2. FORM CONTAINER - Desain Melebar (Wide) */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white p-0">
        
        {/* Decorative Header Terpadu di Dalam Card */}
        <div className="bg-slate-900 px-8 py-6 flex items-center justify-between relative overflow-hidden">
          {/* Aksen Biru di Background Header */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Building2 size={20} />
            </div>
            <div className="text-left">
              <h2 className="text-white font-black uppercase tracking-widest text-[10px] md:text-xs leading-none">
                Formulir Registrasi Unit
              </h2>
              <p className="text-slate-400 text-[15px] font-bold  tracking-tighter mt-1">
                Lengkapi seluruh field mandatori untuk validasi sistem
              </p>
            </div>
          </div>
        </div>

        {/* Konten Form */}
        <div className="p-4 md:p-8 bg-slate-50/30">
          <div className="w-full bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="w-full">
                <BusinessForm onSuccess={() => router.push('/admin/usaha')} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}