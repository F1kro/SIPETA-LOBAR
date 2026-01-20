"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, CheckCircle2, ArrowRight, Phone, Map, ShieldCheck } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] font-poppins text-slate-900">

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 py-16 md:py-32">
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Portal Resmi DPMPTSP Lombok Barat
          </div>

          <h2 className="text-3xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
            PANDUAN INVESTASI <br className="hidden md:block" />
            <span className="text-blue-500 italic">WILAYAH DIGITAL</span>
          </h2>

          <p className="text-sm md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Portal informasi resmi untuk memahami potensi ekonomi dan persyaratan perizinan di Kabupaten Lombok Barat secara transparan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cek-wilayah" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-7 rounded-2xl text-base font-black flex gap-3 shadow-xl shadow-blue-900/20 transition-all active:scale-95">
                CEK POTENSI <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/peta-usaha" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full bg-slate-900 border-slate-700 hover:bg-blue-600 text-white px-8 py-7 rounded-2xl text-base font-black transition-all">
                LIHAT PETA USAHA
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. 3-STEP GUIDE - PERBAIKAN ANGKA (KONTRAST) */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Cara Menggunakan Portal</h3>
          <div className="w-20 h-2 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { step: "01", title: "Pilih Lokasi", desc: "Pilih kecamatan atau desa yang ingin Anda jadikan tempat berinvestasi.", icon: <MapPin className="text-blue-600" size={32} /> },
            { step: "02", title: "Lihat Analisis", desc: "Sistem akan memberikan rekomendasi jenis usaha yang sesuai dengan aturan wilayah.", icon: <ShieldCheck className="text-blue-600" size={32} /> },
            { step: "03", title: "Konsultasi", desc: "Hubungi petugas kami untuk validasi data dan proses perizinan lebih lanjut.", icon: <Phone className="text-blue-600" size={32} /> },
          ].map((item, idx) => (
            <Card key={idx} className="relative p-10 rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all group bg-white overflow-hidden">
              {/* PERBAIKAN: Angka dibuat lebih kontras (opacity-20 saat diam, opacity-40 saat hover) */}
              <div className="absolute -top-4 -right-4 p-8 text-8xl font-black text-slate-200 opacity-80 group-hover:text-blue-500 group-hover:opacity-100 transition-all duration-500 pointer-events-none select-none">
                {item.step}
              </div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                  {item.icon}
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">{item.title}</h4>
                <p className="text-slate-500 text-lg leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. FEATURES - PERBAIKAN VECTOR MAP */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-4xl font-black text-slate-900 uppercase leading-none tracking-tighter">KEUNGGULAN <br /><span className="text-blue-600">SISTEM KAMI</span></h3>

            <div className="space-y-6">
              {[
                { t: "Akses Peta Interaktif", d: "Visualisasi tata ruang yang mudah dipahami orang awam." },
                { t: "Informasi Indikatif", d: "Kepastian awal mengenai jenis usaha yang diizinkan." },
                { t: "Kontak Langsung", d: "Terhubung langsung dengan tim ahli perizinan kami." },
              ].map((f, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className="bg-white p-2 rounded-lg shadow-md shrink-0">
                    <CheckCircle2 className="text-green-500" size={24} />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 uppercase text-lg leading-none mb-1">{f.t}</h5>
                    <p className="text-slate-500 font-medium">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
            {/* Dekorasi belakang */}
            <div className="absolute -inset-4 bg-blue-500/10 rounded-[3.5rem] blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
            
            <div className="relative bg-white rounded-[3rem] p-4 shadow-2xl border border-slate-100 rotate-3 transition-transform hover:rotate-0 duration-500">
              <div className="bg-slate-950 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center text-white overflow-hidden relative">
                
                {/* VECTOR MAP SIMULATION */}
                <div className="absolute inset-0 opacity-30">
                  <svg className="w-full h-full" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
                    <path d="M150 100 L250 80 L350 120 L450 100 L550 150 L400 300 L200 280 Z" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="10 5" />
                    <circle cx="350" cy="120" r="8" fill="#3b82f6" className="animate-ping" />
                    <circle cx="350" cy="120" r="5" fill="#3b82f6" />
                    <circle cx="450" cy="250" r="5" fill="#ef4444" />
                  </svg>
                </div>

                <div className="relative z-10 text-center space-y-4">
                  <div className="bg-blue-600/20 p-4 rounded-full inline-block border border-blue-500/30">
                    <Map size={48} className="text-blue-500" />
                  </div>
                  <p className="text-blue-400 font-bold tracking-[0.2em] text-xs uppercase">Peta Interaktif</p>
                </div>

                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-20 w-full animate-[scan_3s_linear_infinite] pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tailwind Custom Keyframes for scan animation */}
      <style jsx global>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(400%); }
        }
      `}</style>
    </main>
  )
}