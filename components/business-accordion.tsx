"use client"

import { useState, ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown, CheckCircle2, AlertCircle, Wallet, Clock } from "lucide-react"

interface BusinessItem {
  category: string
  description: ReactNode
  biaya?: string
  waktu?: string
}

interface BusinessAccordionProps {
  items: BusinessItem[]
  type: "suitable" | "study"
}

const BUSINESS_DETAILS: Record<
  string,
  {
    requirements: string[]
    considerations: string[]
    estimatedCost: string
    estimatedTimeframe: string
  }
> = {
  "Resort & Akomodasi Wisata": {
    requirements: ["AMDAL untuk skala tertentu", "Izin Mendirikan Bangunan (IMB)", "Sertifikat tanah", "NPWP dan KTP pemilik", "Izin lingkungan hidup atau SPPL"],
    considerations: ["Lahan memenuhi standar resort", "Aksesibilitas infrastruktur", "Sistem pengelolaan limbah"],
    estimatedCost: "Rp 500 juta - Rp 2 miliar",
    estimatedTimeframe: "3-6 bulan",
  },
  "Diving Center & Olahraga Air": {
    requirements: ["Izin operasional Pariwisata", "Sertifikat keselamatan PADI/SSI", "Izin Dinas Kelautan", "Asuransi publik"],
    considerations: ["Instruktur bersertifikasi", "Konservasi laut", "Rencana evakuasi medis"],
    estimatedCost: "Rp 100 juta - Rp 500 juta",
    estimatedTimeframe: "2-4 bulan",
  },
  "Restoran & Kafe Tepi Pantai": {
    requirements: ["IMB", "Sertifikat UMKM", "SIUP & TDP", "Izin Dinas Kesehatan"],
    considerations: ["Pengelolaan sampah & limbah cair", "Standar kebersihan pangan", "Izin alkohol jika ada"],
    estimatedCost: "Rp 50 juta - Rp 300 juta",
    estimatedTimeframe: "1-3 bulan",
  },
  "Spa & Wellness Center": {
    requirements: ["SIUP", "IMB", "Sertifikat kesehatan", "Izin lingkungan"],
    considerations: ["Terapis bersertifikat", "Protokol sterilisasi", "Manajemen limbah medis"],
    estimatedCost: "Rp 100 juta - Rp 500 juta",
    estimatedTimeframe: "2-3 bulan",
  },
  "Penyewaan Perahu & Transportasi": {
    requirements: ["Izin Dinas Kelautan", "Sertifikat kapal BKI", "Asuransi publik", "SIUP"],
    considerations: ["Kelayakan operasi kapal", "Alat keselamatan lengkap", "Crew terlatih"],
    estimatedCost: "Rp 200 juta - Rp 1 miliar",
    estimatedTimeframe: "2-4 bulan",
  },
  "Pariwisata dan perhotelan": {
    requirements: ["AMDAL atau SPPL", "IMB", "Sertifikat tanah", "Izin Dinas Pariwisata"],
    considerations: ["Koordinasi instansi terkait", "Dampak komunitas lokal", "Keberlanjutan area"],
    estimatedCost: "Rp 500 juta - Rp 3 miliar",
    estimatedTimeframe: "3-6 bulan",
  },
  "Rental perlengkapan wisata": {
    requirements: ["Izin Usaha", "Sertifikat peralatan", "Asuransi publik"],
    considerations: ["Kondisi perlengkapan baik", "Protokol keselamatan", "Staff terlatih"],
    estimatedCost: "Rp 50 juta - Rp 200 juta",
    estimatedTimeframe: "1-2 bulan",
  },
  "Toko souvenir": {
    requirements: ["SIUP", "IMB", "NPWP", "Izin desa/kelurahan"],
    considerations: ["Produk lokal autentik", "Sistem pembayaran mudah", "Desain toko menarik"],
    estimatedCost: "Rp 30 juta - Rp 100 juta",
    estimatedTimeframe: "1-2 bulan",
  },
  "Jasa penyelam dan olahraga air": {
    requirements: ["Izin Kelautan & Pariwisata", "Sertifikasi PADI/SSI", "Asuransi"],
    considerations: ["Maintenance alat rutin", "Tim rescue siap", "Briefing keselamatan"],
    estimatedCost: "Rp 100 juta - Rp 500 juta",
    estimatedTimeframe: "2-3 bulan",
  },
  "Agribisnis": {
    requirements: ["Sertifikat tanah", "Rekomendasi Dinas Pertanian", "Izin industri"],
    considerations: ["Praktik berkelanjutan", "Sistem irigasi", "Teknologi pertanian tepat"],
    estimatedCost: "Rp 100 juta - Rp 500 juta",
    estimatedTimeframe: "2-3 bulan",
  },
  "Pertanian organik": {
    requirements: ["Sertifikat lahan organik", "Rekomendasi Pertanian", "Izin lingkungan"],
    considerations: ["Tanpa pestisida sintetis", "Manajemen kesuburan alami", "Edukasi petani"],
    estimatedCost: "Rp 50 juta - Rp 200 juta",
    estimatedTimeframe: "2-3 tahun",
  },
  "Agro-wisata": {
    requirements: ["Izin Pertanian & Pariwisata", "AMDAL/SPPL", "IMB fasilitas"],
    considerations: ["Edukasi proses pertanian", "Fasilitas pengunjung nyaman", "Manajemen limbah"],
    estimatedCost: "Rp 200 juta - Rp 1 miliar",
    estimatedTimeframe: "3-4 bulan",
  },
  "Kerajinan tradisional": {
    requirements: ["SIUP", "Sertifikat legalitas", "Izin desa/kelurahan"],
    considerations: ["Autentisitas tradisi", "Pelatihan generasi muda", "Strategi pemasaran"],
    estimatedCost: "Rp 20 juta - Rp 100 juta",
    estimatedTimeframe: "1-2 bulan",
  },
  "Peternakan organik": {
    requirements: ["Sertifikat lahan", "Izin Dinas Peternakan", "Sertifikat kesehatan hewan"],
    considerations: ["Pakan organik", "Kesejahteraan hewan", "Manajemen limbah"],
    estimatedCost: "Rp 100 juta - Rp 500 juta",
    estimatedTimeframe: "2-3 bulan",
  },
  "Ekowisata": {
    requirements: ["Izin Lingkungan & Pariwisata", "AMDAL komprehensif", "IMB"],
    considerations: ["Perlindungan ekosistem", "Edukasi lingkungan", "Komunitas lokal"],
    estimatedCost: "Rp 300 juta - Rp 2 miliar",
    estimatedTimeframe: "3-5 bulan",
  },
  "Cottage dan penginapan": {
    requirements: ["IMB", "SIUP", "Sertifikat Usaha Pariwisata", "Izin desa"],
    considerations: ["Standar hospitality", "Keamanan pengguna", "Sumber air bersih"],
    estimatedCost: "Rp 300 juta - Rp 1 miliar",
    estimatedTimeframe: "2-4 bulan",
  },
  "Petualangan alam": {
    requirements: ["Izin Pariwisata", "Sertifikasi keselamatan", "Asuransi"],
    considerations: ["Gear berkualitas", "Evaluasi risiko", "Tim rescue terlatih"],
    estimatedCost: "Rp 100 juta - Rp 500 juta",
    estimatedTimeframe: "2-3 bulan",
  },
  "Kafe dan rumah makan": {
    requirements: ["IMB", "SIUP", "Sertifikat Laik Sehat", "Izin lingkungan"],
    considerations: ["Kebersihan dapur", "Pembuangan limbah", "Kenyamanan estetika"],
    estimatedCost: "Rp 50 juta - Rp 300 juta",
    estimatedTimeframe: "1-3 bulan",
  },
  "Craft dan kerajinan lokal": {
    requirements: ["SIUP", "NPWP", "Izin desa/kelurahan", "Sertifikat produk"],
    considerations: ["Karakter lokal unik", "Pelatihan pengrajin", "Dokumentasikan cerita produk"],
    estimatedCost: "Rp 20 juta - Rp 100 juta",
    estimatedTimeframe: "1-2 bulan",
  },
}

export function BusinessAccordion({ items, type }: BusinessAccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const cardBgColor = type === "suitable" ? "border-green-200 bg-green-50/50" : "border-blue-200 bg-blue-50/50"

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isExpanded = expandedIndex === idx
        const details = BUSINESS_DETAILS[item.category] || {
          requirements: ["Informasi detail tidak tersedia untuk kategori ini"],
          considerations: ["Silakan konsultasi lebih lanjut dengan dinas terkait"],
          estimatedCost: "Bervariasi",
          estimatedTimeframe: "Bervariasi",
        }

        return (
          <Card key={idx} className={`border ${cardBgColor} overflow-hidden transition-all shadow-sm`}>
            <div onClick={() => toggleExpanded(idx)} className="p-4 hover:bg-black/5 cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 text-left">
                  <h4 className="text-base font-black text-slate-900 uppercase tracking-tight mb-1">
                    {item.category}
                  </h4>
                  <div className="text-sm text-slate-600 leading-relaxed font-medium">
                    {item.description}
                  </div>
                </div>
                <div className={`mt-1 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-slate-200 p-6 bg-white space-y-7 animate-in fade-in slide-in-from-top-1 duration-300">
                <div className="text-left">
                  <h5 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> Syarat Pembuatan Izin
                  </h5>
                  <div className="space-y-3 ml-2">
                    {details.requirements.map((req, rIdx) => (
                      <div key={rIdx} className="flex gap-3">
                        <span className="text-green-500 font-black flex-shrink-0 text-xs">✓</span>
                        <span className="text-sm text-slate-700 leading-relaxed font-bold">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-left border-t border-slate-100 pt-6">
                  <h5 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> Hal yang Perlu Diperhatikan
                  </h5>
                  <div className="space-y-3 ml-2">
                    {details.considerations.map((c, cIdx) => (
                      <div key={cIdx} className="flex gap-3">
                        <span className="text-amber-600 font-black flex-shrink-0 text-xs">•</span>
                        <span className="text-sm text-slate-700 leading-relaxed font-bold">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MODIFIKASI: Hanya muncul jika tipe adalah "suitable" (Usaha Prioritas) */}
                {type === "suitable" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <Wallet className="w-5 h-5 text-green-700" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 leading-none mb-1.5">Estimasi Biaya</p>
                        <p className="text-sm font-black text-slate-900">{item.biaya || details.estimatedCost}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-left border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Clock className="w-5 h-5 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 leading-none mb-1.5">Estimasi Waktu</p>
                        <p className="text-sm font-black text-slate-900">{item.waktu || details.estimatedTimeframe}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}