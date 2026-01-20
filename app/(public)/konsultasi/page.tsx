"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ChevronRight, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Mail,
  ShieldCheck,
  MessageSquare
} from "lucide-react"

export default function KonsultasiPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-poppins text-slate-900 pb-20 text-left">
      
      {/* 1. HEADER SECTION - Lebar max-w-6xl sinkron dengan Navbar */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-[100] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                Konsultasi Perizinan
              </h1>
              <p className="text-sm md:text-base text-slate-500 font-bold uppercase tracking-widest mt-2">
                Bimbingan Teknis Langsung dari Ahli DPMPTSP
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT - Container Identik dengan Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Importance of Consultation */}
        <Card className="rounded-2xl border-none shadow-xl mb-12 p-8 md:p-12 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
             <MessageSquare size={180} />
          </div>
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-6 text-blue-500">
              Mengapa Konsultasi Itu Penting?
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8 font-medium">
              Konsultasi sebelum mengajukan izin memastikan rencana investasi Anda sesuai regulasi (RDTR) dan dokumen lengkap. 
              Ini menghemat waktu, biaya, serta menghindari penolakan permohonan.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Validasi kesesuaian RDTR",
                "Kelengkapan dokumen awal",
                "Identifikasi risiko dini",
                "Gratis tanpa biaya"
              ].map((text, i) => (
                <div key={i} className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm font-bold uppercase tracking-wide">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Consultation Flow */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-10 border-l-8 border-blue-600 pl-6">
            Alur Konsultasi
          </h2>
          <div className="space-y-6">
            {[
              { step: 1, title: "Hubungi Kami", desc: "Hubungi via telepon atau kunjungi kantor langsung." },
              { step: 2, title: "Jadwalkan Pertemuan", desc: "Penentuan jadwal (biasanya 1-3 hari kerja)." },
              { step: 3, title: "Siapkan Dokumen", desc: "Identitas, rencana bisnis, dan bukti lahan." },
              { step: 4, title: "Konsultasi Langsung", desc: "Diskusi mendalam dengan konsultan ahli." },
              { step: 5, title: "Rekomendasi", desc: "Terima rencana aksi dan daftar syarat izin." },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-xl font-black text-blue-600 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {item.step}
                  </div>
                  {idx < 4 && <div className="w-1 h-12 bg-slate-200 my-2 rounded-full" />}
                </div>
                <div className="pt-2">
                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{item.title}</h4>
                  <p className="text-slate-500 font-semibold mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents Needed */}
        <Card className="rounded-2xl border-none shadow-xl mb-16 p-10 bg-white">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-8">Dokumen Awal Persiapan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              { cat: "Legalitas", items: ["KTP / Akta Perusahaan", "NPWP Valid", "Rekomendasi Desa"] },
              { cat: "Lokasi", items: ["Sertifikat Tanah", "Peta Google Maps", "Draft IMB / PBG"] },
              { cat: "Rencana", items: ["Jenis Usaha & Skala", "Tata Letak Bangunan", "Estimasi Investasi"] },
              { cat: "Khusus", items: ["Draft AMDAL", "Izin Lingkungan", "Rekomendasi Sektor"] },
            ].map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="font-black text-blue-600 uppercase text-xs tracking-widest">{section.cat}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-600 font-bold text-sm uppercase">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: MapPin, title: "Lokasi Kantor", text: "Jl. Raya Gerung No. 42, Lombok Barat" },
            { icon: Clock, title: "Jam Kerja", text: "Senin - Jumat | 08:00 - 16:00 WITA" },
            { icon: Mail, title: "Layanan Email", text: "Gunakan form hubungi kami untuk respon cepat." },
          ].map((item, idx) => (
            <Card key={idx} className="p-8 rounded-2xl border-none shadow-lg bg-white hover:scale-[1.02] transition-transform">
              <item.icon className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-black text-slate-900 uppercase text-sm mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm font-bold">{item.text}</p>
            </Card>
          ))}
        </div>

        {/* Important Notes */}
        <Card className="rounded-2xl border-none shadow-xl p-8 bg-amber-50 border-l-8 border-amber-500 mb-12">
          <div className="flex items-start gap-5">
            <AlertCircle className="w-8 h-8 text-amber-600 shrink-0" />
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase mb-4 tracking-tight">Peringatan Penting</h3>
              <ul className="space-y-4">
                {[
                  "Konsultasi DPMPTSP 100% GRATIS. Hindari perantara/calo.",
                  "Wajib membawa dokumen asli untuk proses validasi data.",
                  "Rencana investasi harus jelas dan layak dilaksanakan.",
                  "Hasil konsultasi menjadi dasar pengajuan izin di sistem OSS."
                ].map((note, i) => (
                  <li key={i} className="flex gap-3 text-amber-900 font-bold text-sm leading-relaxed uppercase">
                    <span className="text-amber-600">•</span> {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/cek-wilayah">
            <Button variant="outline" className="w-full h-16 border-2 border-slate-900 font-black rounded-xl uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-all">
              Kembali Cek Wilayah
            </Button>
          </Link>
          <Link href="/hubungi-kami">
            <Button className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-blue-100">
              Hubungi Kami Sekarang <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}