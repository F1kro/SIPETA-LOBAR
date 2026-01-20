"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Target,
  Lightbulb,
  Shield,
  Users,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Info,
  Globe
} from "lucide-react"

export default function TentangPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-poppins text-slate-900 pb-20 text-left">

      {/* 1. HEADER SECTION */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-[100] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex items-center gap-4 md:gap-5">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
              <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
                Tentang Sistem Portal
              </h1>
              <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">
                Latar Belakang & Visi Digitalisasi Investasi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Latar Belakang */}
        <div className="mb-16 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter mb-6 md:mb-8 border-l-8 border-blue-600 pl-4 md:pl-6">
            Latar Belakang
          </h2>
          <Card className="rounded-2xl border-none shadow-xl p-6 md:p-12 bg-white space-y-6">
            <p className="text-base md:text-xl text-slate-600 leading-relaxed font-medium">
              Portal Informasi Investasi Wilayah DPMPTSP Kabupaten Lombok Barat dikembangkan untuk
              <span className="text-blue-600 font-bold"> mempermudah masyarakat dan calon investor </span>
              dalam memahami potensi investasi.
            </p>
            <p className="text-md md:text-lg text-slate-500 leading-relaxed">
              Sebelumnya, masyarakat harus menelaah dokumen RDTR yang teknis secara manual.
              Hal ini memerlukan waktu dan upaya besar bagi mereka yang kurang familiar dengan istilah tata ruang.
            </p>
            <div className="bg-blue-50 p-5 md:p-6 rounded-2xl border border-blue-100 flex gap-4 items-center">
              <Info className="text-blue-600 shrink-0 hidden sm:block" size={32} />
              <p className="text-blue-900 font-bold text-sm md:text-lg uppercase tracking-tight leading-snug">
                Kami menyederhanakan RDTR menjadi bentuk visual & naratif yang mudah dipahami.
              </p>
            </div>
          </Card>
        </div>

        {/* Tujuan & Manfaat */}
        <div className="mb-20 md:mb-24">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter mb-8 md:mb-10 text-center">Tujuan & Manfaat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {[
              { icon: Lightbulb, title: "Panduan Wilayah", desc: "Memberikan panduan awal tentang potensi investasi sesuai aturan tata ruang." },
              { icon: Target, title: "Penyederhanaan", desc: "Mengubah data teknis RDTR menjadi peta interaktif yang lugas dan transparan." },
              { icon: Users, title: "Dukungan Publik", desc: "Mendukung tugas DPMPTSP dalam memberikan pelayanan edukasi perizinan." },
              { icon: Shield, title: "Kepatuhan", desc: "Meningkatkan kepatuhan investor terhadap regulasi sejak tahap perencanaan." },
            ].map((goal, idx) => {
              const Icon = goal.icon
              return (
                <Card key={idx} className="border-none shadow-lg p-6 md:p-8 rounded-2xl bg-white hover:shadow-2xl transition-all group">
                  <div className="flex gap-4 md:gap-6 items-start">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-blue-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 mb-1 uppercase text-base md:text-lg tracking-tight">{goal.title}</h3>
                      <p className="text-xs md:text-base text-slate-500 font-medium leading-relaxed">{goal.desc}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="mb-20 md:mb-24">
          <Card className="rounded-3xl border-none shadow-2xl overflow-hidden bg-slate-900 text-white relative">
            {/* Vector-like Decoration (Aksen Background) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-3 relative z-10">
              <div className="p-8 md:p-14 lg:col-span-2 space-y-8 border-b lg:border-b-0 lg:border-r border-white/10 text-left">
                <section>
                  <h3 className="text-blue-500 font-black uppercase tracking-widest text-[10px] mb-3">Visi Layanan</h3>
                  <p className="text-xl md:text-3xl font-black leading-tight tracking-tight italic">
                    "Menjadi lembaga yang melayani dengan sepenuh hati, transparan, dan responsif."
                  </p>
                </section>

                <section>
                  <h3 className="text-blue-500 font-black uppercase tracking-widest text-[10px] mb-5">Misi Strategis</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["Mempercepat Perizinan", "Transparansi Publik", "Edukasi RDTR", "Kepatuhan Ruang"].map((misi, i) => (
                      <div key={i} className="flex gap-3 items-center bg-white/5 p-3 rounded-xl border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="font-bold text-slate-300 uppercase text-[10px] md:text-xs">{misi}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
              <div className="p-8 md:p-14 bg-blue-600  flex flex-col  justify-center">
                <ShieldCheck size={60} className="text-blue-200 mb-6 hidden md:block" />
                <h4 className="text-lg md:text-xl font-black uppercase tracking-tight mb-3">Dukungan Portal</h4>
                <p className="text-blue-100 font-medium leading-relaxed text-xs md:text-sm">
                  Menyediakan data awal akurat agar investor dapat mempersiapkan dokumen dengan lebih baik.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Dasar Regulasi - Perbaikan Mobile Numbering */}
        <div className="mb-20 md:mb-24">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter mb-8 border-l-8 border-slate-900 pl-4">Dasar Regulasi</h2>
          <Card className="rounded-2xl border-none shadow-xl bg-white p-6 md:p-12 overflow-hidden">
            <ul className="space-y-4 md:space-y-6">
              {[
                "UU No. 25 Tahun 2007 tentang Penanaman Modal",
                "UU No. 26 Tahun 2007 tentang Penataan Ruang",
                "PP No. 24 Tahun 2021 tentang Perizinan Elektronik",
                "RDTR Kabupaten Lombok Barat",
                "Peraturan Bupati tentang Retribusi Usaha",
              ].map((reg, i) => (
                <li key={i} className="flex gap-4 items-start md:items-center group">
                  {/* Fixed Size Circle untuk penomoran agar tidak gepeng */}
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-50 rounded-lg flex items-center justify-center font-black text-blue-600 border border-slate-100 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all text-sm md:text-base">
                    {i + 1}
                  </div>
                  <span className="text-sm md:text-lg font-bold text-slate-700 tracking-tight uppercase pt-1 md:pt-0">{reg}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="rounded-2xl border-none shadow-xl p-6 md:p-12 bg-amber-50 border-l-8 border-amber-500 mb-20 text-left">
          <h2 className="text-xl md:text-2xl font-black text-amber-900 uppercase tracking-tight mb-6">Disclaimer Resmi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 text-xs md:text-sm">
            {[
              { t: "Informasi Indikatif", d: "Analisis wilayah bersifat panduan awal, bukan kepastian hukum final." },
              { t: "Kepastian Hukum", d: "Kesesuaian perizinan tetap mengacu pada RDTR asli dan pejabat berwenang." },
              { t: "Konsultasi Wajib", d: "Investor wajib konsultasi resmi di kantor DPMPTSP untuk validasi rencana." },
              { t: "Verifikasi Data", d: "Selalu rujuk pada dokumen fisik resmi untuk data paling mutakhir." },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <p className="font-black text-amber-800 uppercase leading-none">{i + 1}. {item.t}</p>
                <p className="text-amber-900/70 font-medium leading-normal">{item.d}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Profile Kantor */}
        <div className="mb-20">
          <Card className="rounded-2xl border-none shadow-xl overflow-hidden bg-white">
            <div className="p-6 md:p-12 bg-slate-900 text-white flex flex-col md:flex-row gap-6 items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <MapPin size={32} className="text-white" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">DPMPTSP LOMBOK BARAT</h3>
                <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] md:text-xs">Dinas Penanaman Modal Pelayanan Terpadu Satu Pintu</p>
              </div>
            </div>
            <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <p className="text-slate-600 text-md md:text-lg leading-relaxed font-medium">
                Lembaga pemerintah yang bertanggung jawab dalam memberikan pelayanan perizinan terpadu kepada masyarakat dan investor di Kabupaten Lombok Barat.
              </p>
              <div className="grid grid-cols-1 gap-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Alamat</span>
                  <span className="text-slate-800 font-bold text-md md:text-sm">Jl. Raya Gerung No. 42, NTB</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Kontak</span>
                  <span className="text-slate-800 font-bold text-md md:text-sm">(0370) 6789-100</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Final CTA - Dengan Animasi Vector Map & Radar */}
        <div className="relative group mt-20">
          {/* Layer 1: Base Background dengan Shadow */}
          <div className="absolute inset-0 bg-blue-700 rounded-[2.5rem] -rotate-1 group-hover:rotate-0 transition-transform duration-500 shadow-2xl" />
          <Card className="rounded-[2.5rem] border-none p-10 md:p-20 bg-blue-600 text-white text-center relative z-10 overflow-hidden">
            {/* --- ELEMEN VECTOR & ANIMASI BACKGROUND --- */}

            {/* 1. Efek Radar/Pulse (Lingkaran menyebar) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full animate-ping pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full animate-pulse pointer-events-none" />

            {/* 2. Grid Pattern (Mirip peta digital) */}
            <div className="absolute inset-0 opacity-70 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

            {/* 3. Aksen Dot-Map Vector (Manual CSS) */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-400/20 blur-3xl rounded-full" />
            <div className="absolute -left-20 -top-20 w-80 h-80 bg-black/20 blur-3xl rounded-full" />

            {/* 4. Icon Floating Animasi (Opsional) */}
            <div className="absolute top-10 right-10 animate-bounce opacity-70">
              <MapPin size={48} className="text-white" />
            </div>
            <div className="absolute bottom-10 left-10 animate-bounce delay-700 opacity-70">
              <Globe size={40} className="text-white" />
            </div>

            {/* --- KONTEN UTAMA --- */}
            <div className="relative z-20 flex flex-col items-center">
              <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-none">
                Mulai Investasi <br className="md:hidden" /> Sekarang
              </h3>
              <p className="text-blue-100 text-base md:text-2xl font-bold mb-10 md:mb-16 max-w-2xl mx-auto uppercase italic opacity-90 leading-tight">
                Identifikasi potensi wilayah Anda secara digital sebelum konsultasi tatap muka.
              </p>

              {/* Container Button */}
              <div className="w-full flex justify-center px-4">
                <Link href="/cek-wilayah" className="w-full md:w-auto">
                  <Button className="w-full md:w-auto bg-white text-blue-600 hover:bg-slate-100 font-black px-10 md:px-16 py-8 md:py-10 rounded-2xl text-lg md:text-2xl uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all active:scale-95 flex items-center justify-center gap-4 group/btn">
                    Cek Wilayah
                    <ArrowRight className="w-6 h-6 md:w-8 md:h-8 shrink-0 group-hover/btn:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </main>
  )
}