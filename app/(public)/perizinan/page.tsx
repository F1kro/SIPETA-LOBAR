"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ChevronRight, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight 
} from "lucide-react"
import { useState } from "react"

export default function PerizinanPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-poppins text-slate-900 pb-20 text-left">
      
      {/* 1. HEADER SECTION - Lebar max-w-6xl sinkron dengan Navbar */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-[100] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                Informasi Perizinan
              </h1>
              <p className="text-sm md:text-base text-slate-500 font-bold uppercase tracking-widest mt-2">
                Panduan Resmi Proses Perizinan DPMPTSP Lombok Barat
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT - Container Identik dengan Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Introduction Card */}
        <Card className="rounded-2xl border-none shadow-xl mb-16 p-8 md:p-12 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
             <ShieldCheck size={180} />
          </div>
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6 text-blue-500">
              Apa itu Perizinan?
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8 font-medium">
              Perizinan adalah proses resmi untuk mendapatkan izin dari pemerintah sebelum memulai usaha atau investasi di
              suatu wilayah. DPMPTSP Kabupaten Lombok Barat bertanggung jawab penuh dalam fasilitasi perizinan.
            </p>
            <div className="space-y-4">
              {[
                "Memastikan investasi sesuai dengan RDTR",
                "Melindungi lingkungan dan kepentingan masyarakat lokal",
                "Menciptakan iklim bisnis yang teratur dan transparan"
              ].map((text, i) => (
                <div key={i} className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <span className="text-base font-bold uppercase tracking-wide">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Types of Licensing */}
        <div className="mb-24">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-10 border-l-8 border-blue-600 pl-6">
            Jenis-Jenis Perizinan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* OSS */}
            <Card className="rounded-2xl border-none shadow-xl bg-white p-10 hover:shadow-2xl transition-all group">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors duration-300">
                  <Clock className="w-8 h-8 text-blue-600 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">OSS (Online Single Submission)</h3>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest mt-1">Sistem Elektronik Terintegrasi</p>
                </div>
              </div>
              <p className="text-slate-500 font-semibold mb-8 leading-relaxed text-lg">
                Sistem perizinan modern yang terintegrasi secara elektronik untuk mempercepat proses permohonan izin tanpa tatap muka.
              </p>
              <ul className="space-y-4 text-base font-bold text-slate-700 mb-10">
                <li className="flex gap-3 items-center font-black"><CheckCircle2 size={20} className="text-green-500" /> Pengajuan Online 24 Jam</li>
                <li className="flex gap-3 items-center font-black"><CheckCircle2 size={20} className="text-green-500" /> Proses Cepat (7-14 Hari Kerja)</li>
              </ul>
              <a href="https://oss.go.id" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-16 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg">
                  Kunjungi Portal OSS <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </Card>

            {/* Non-OSS */}
            <Card className="rounded-2xl border-none shadow-xl bg-white p-10 hover:shadow-2xl transition-all group border-t-4 border-slate-900 text-left">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-slate-900 transition-colors duration-300">
                  <FileText className="w-8 h-8 text-slate-900 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Perizinan Non-OSS</h3>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Layanan Konvensional Khusus</p>
                </div>
              </div>
              <p className="text-slate-500 font-semibold mb-8 leading-relaxed text-lg">
                Layanan tatap muka untuk jenis usaha atau keadaan khusus yang memerlukan evaluasi teknis mendalam.
              </p>
              <ul className="space-y-4 text-base font-bold text-slate-700 mb-10">
                <li className="flex gap-3 items-center font-black"><CheckCircle2 size={20} className="text-blue-500" /> Konsultasi Langsung Ahli</li>
                <li className="flex gap-3 items-center font-black"><CheckCircle2 size={20} className="text-blue-500" /> Pendampingan Dokumen</li>
              </ul>
              <Link href="/konsultasi">
                <Button variant="outline" className="w-full border-2 border-slate-900 hover:bg-slate-900 hover:text-white h-16 rounded-xl font-black uppercase tracking-widest text-xs transition-all">
                  Jadwalkan Konsultasi <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* 4. PROCESS FLOW */}
        <div className="mb-28">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-16 text-center">Alur Proses Perizinan</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {[
              { step: 1, title: "Persiapan", desc: "Dokumen Bisnis" },
              { step: 2, title: "Konsultasi", desc: "Verifikasi RDTR" },
              { step: 3, title: "Pengajuan", desc: "Input Sistem" },
              { step: 4, title: "Verifikasi", desc: "Evaluasi Tim" },
              { step: 5, title: "Terbit", desc: "Izin Resmi" },
            ].map((item, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center text-3xl font-black text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 border border-slate-100">
                  {item.step}
                </div>
                <h4 className="font-black text-slate-900 uppercase text-sm mb-2 tracking-tight">{item.title}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase">{item.desc}</p>
                {idx < 4 && (
                  <div className="hidden md:block absolute top-10 left-[65%] w-full h-0.5 bg-slate-200 -z-10" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 5. EDUKASI SECTION */}
        <Card className="rounded-2xl border-none shadow-xl p-10 md:p-14 bg-blue-600 text-white mb-24 overflow-hidden relative">
          <div className="absolute -bottom-10 -left-10 opacity-10 rotate-12">
            <HelpCircle size={250} />
          </div>
          <div className="relative z-10 text-left">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-10">5 Poin Penting Sebelum Mengajukan</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                "Lokasi wajib sesuai RDTR (Cek di Menu Cek Wilayah)",
                "Gunakan sertifikat tanah asli dan identitas legal",
                "Konsultasi GRATIS di kantor DPMPTSP",
                "Pahami perbedaan izin OSS dan Konvensional",
                "Hindari penggunaan calo atau perantara ilegal"
              ].map((point, idx) => (
                <div key={idx} className="flex gap-5 p-6 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
                  <span className="text-2xl font-black text-blue-200 opacity-50">{idx + 1}</span>
                  <p className="text-lg font-bold leading-tight uppercase italic">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 6. BUSINESS DETAILS ACCORDION */}
        <div className="mb-12">
          <div className="text-left mb-10">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Syarat Per Jenis Usaha</h2>
            <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-sm italic">
              Klik pada baris untuk melihat detail dokumen wajib
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              "Pariwisata dan perhotelan",
              "Resort & Akomodasi Wisata",
              "Diving Center & Olahraga Air",
              "Restoran & Kafe Tepi Pantai",
              "Spa & Wellness Center",
              "Agribisnis",
              "Pertanian organik",
              "Ekowisata",
              "Cottage dan penginapan",
              "Kafe dan rumah makan",
            ].map((business) => (
              <BusinessDetailCard key={business} businessName={business} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

function BusinessDetailCard({ businessName }: { businessName: string }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const businessDetails: any = {
    "Resort & Akomodasi Wisata": {
      requirements: [
        "AMDAL (Analisis Mengenai Dampak Lingkungan)",
        "Izin Mendirikan Bangunan (IMB/PBG)",
        "Sertifikat Tanah & Bukti Kepemilikan",
        "NPWP & KTP Pemilik Usaha",
        "Rencana Arsitektur & Master Plan",
        "Rekomendasi Pemerintah Desa",
        "Izin Lingkungan Hidup (SPPL)"
      ],
      considerations: [
        "Lahan memenuhi standar minimum resort",
        "Evaluasi aksesibilitas air & listrik",
        "Sistem pengelolaan limbah ramah lingkungan"
      ],
      estimatedCost: "Rp 500 Juta - Rp 2 Miliar",
      estimatedTimeframe: "3-6 Bulan",
    },
    // Tambahkan data detail lainnya sesuai kebutuhan konten Anda
  }

  const details = businessDetails[businessName] || {
    requirements: ["Silakan hubungi DPMPTSP untuk detail dokumen spesifik."],
    considerations: ["Pastikan lokasi sesuai dengan RDTR Wilayah."],
    estimatedCost: "Menyesuaikan Skala",
    estimatedTimeframe: "Bervariasi",
  }

  return (
    <Card className={`rounded-xl border-none shadow-md overflow-hidden transition-all duration-300 ${
      isExpanded ? 'ring-2 ring-blue-600 shadow-2xl scale-[1.01]' : 'hover:shadow-lg bg-white'
    }`}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="p-6 flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-5">
          <div className={`w-2 h-10 rounded-full transition-all duration-500 ${
            isExpanded ? 'bg-blue-600' : 'bg-slate-200 group-hover:bg-blue-400'
          }`} />
          <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{businessName}</h4>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
          isExpanded ? 'bg-blue-600 text-white rotate-180 shadow-lg' : 'bg-slate-50 text-slate-400'
        }`}>
          <ChevronDown size={28} />
        </div>
      </div>

      {isExpanded && (
        <div className="p-8 md:p-10 bg-slate-50/50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="text-left">
            <h5 className="font-black text-blue-600 uppercase text-xs tracking-[0.2em] mb-8 flex items-center gap-2">
              <FileText size={18} /> Dokumen Wajib
            </h5>
            <ul className="space-y-5">
              {details.requirements.map((req: any, idx: number) => (
                <li key={idx} className="flex gap-4 text-sm font-bold text-slate-700 uppercase leading-tight">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-10 text-left">
             <div>
                <h5 className="font-black text-amber-600 uppercase text-xs tracking-[0.2em] mb-8 flex items-center gap-2">
                  <ShieldCheck size={18} /> Hal Penting
                </h5>
                <ul className="space-y-5">
                  {details.considerations.map((item: any, idx: number) => (
                    <li key={idx} className="flex gap-4 text-sm font-bold text-slate-600 italic leading-snug">
                      <ArrowRight size={18} className="text-amber-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-600">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estimasi Biaya</p>
                   <p className="text-base font-black text-blue-600">{details.estimatedCost}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-green-500">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estimasi Waktu</p>
                   <p className="text-base font-black text-green-600">{details.estimatedTimeframe}</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </Card>
  )
}