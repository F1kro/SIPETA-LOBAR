"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown, CheckCircle2, AlertCircle } from "lucide-react"

interface BusinessItem {
  category: string
  description: string
}

interface BusinessAccordionProps {
  items: BusinessItem[]
  type: "suitable" | "study"
}

// Business detail database
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
    requirements: [
      "AMDAL (Analisis Mengenai Dampak Lingkungan) untuk skala tertentu",
      "Izin Mendirikan Bangunan (IMB) dari Dinas PUPR",
      "Sertifikat tanah dan bukti kepemilikan/hak",
      "NPWP dan KTP pemiliki",
      "Rencana arsitektur dan tata letak bangunan",
      "Surat rekomendasi dari pemerintah desa/kelurahan",
      "Izin lingkungan hidup atau SPPL",
    ],
    considerations: [
      "Pastikan lahan memenuhi standar minimum untuk resort bintang 3-5",
      "Pertimbangkan aksesibilitas dan infrastruktur listrik/air",
      "Penuhi standar konservasi laut dan perlindungan ekosistem terumbu karang",
      "Libatkan masyarakat lokal dalam perencanaan dan operasional",
      "Siapkan sistem pengelolaan limbah yang ramah lingkungan",
      "Pertimbangkan dampak musim dan cuaca ekstrem",
    ],
    estimatedCost: "Rp 500 juta - Rp 2 miliar (untuk persiapan dokumen)",
    estimatedTimeframe: "3-6 bulan untuk pengurusan perizinan lengkap",
  },
  "Diving Center & Olahraga Air": {
    requirements: [
      "Izin operasional dari Dinas Pariwisata",
      "Sertifikat keselamatan dari badan internasional (PADI, SSI untuk diving)",
      "Surat izin dari Dinas Kelautan untuk penggunaan area laut",
      "Asuransi pertanggungjawaban publik",
      "NPWP dan dokumen identitas pemilik",
      "Rencana operasional dan standar keselamatan",
      "Surat persetujuan dari pemerintah desa/kelurahan",
    ],
    considerations: [
      "Pastikan semua instruktur memiliki sertifikasi internasional yang valid",
      "Lakukan briefing keselamatan komprehensif sebelum aktivitas",
      "Sediakan peralatan keselamatan berkualitas tinggi dan dirawat dengan baik",
      "Jaga kondisi spot diving melalui praktik pariwisata berkelanjutan",
      "Patuhi aturan konservasi laut dan tidak mengganggu ekosistem",
      "Punya rencana evakuasi medis darurat yang jelas",
    ],
    estimatedCost: "Rp 100 juta - Rp 500 juta (tergantung skala)",
    estimatedTimeframe: "2-4 bulan untuk perizinan operasional",
  },
  "Restoran & Kafe Tepi Pantai": {
    requirements: [
      "Izin Mendirikan Bangunan (IMB)",
      "Sertifikat Usaha Mikro, Kecil, Menengah (UMKM) atau izin usaha lainnya",
      "Surat Izin Usaha Perdagangan (SIUP)",
      "Tanda Daftar Perusahaan (TDP)",
      "Izin dari Dinas Kesehatan untuk restoran/kafe",
      "Bukti kepemilikan atau hak atas lahan",
      "NPWP dan KTP pemilik",
      "Surat izin dari kelurahan/desa",
    ],
    considerations: [
      "Perhatikan tren pasar dan preferensi wisatawan internasional",
      "Siapkan sistem pengelolaan sampah dan limbah cair yang baik",
      "Terapkan standar kebersihan dan keamanan pangan tinggi",
      "Perhitungkan fluktuasi musim dalam perencanaan operasional",
      "Miliki izin khusus jika menjual alkohol",
      "Pastikan air bersih tersedia untuk operasional",
    ],
    estimatedCost: "Rp 50 juta - Rp 300 juta (tergantung konsep)",
    estimatedTimeframe: "1-3 bulan untuk perizinan dasar",
  },
  "Spa & Wellness Center": {
    requirements: [
      "Surat Izin Usaha Perdagangan (SIUP)",
      "Izin Mendirikan Bangunan (IMB)",
      "Sertifikat kesehatan dari Dinas Kesehatan",
      "Izin lingkungan (SPPL atau AMDAL jika diperlukan)",
      "Bukti kepemilikan/hak atas lahan",
      "NPWP dan KTP pemilik",
      "Standar operasional dan protokol kesehatan",
      "Surat persetujuan pemerintah desa/kelurahan",
    ],
    considerations: [
      "Pastikan semua terapis memiliki sertifikat kesehatan dari dinas terkait",
      "Terapkan protokol kebersihan dan sterilisasi yang ketat",
      "Gunakan produk kecantikan dan wellness yang aman dan terdaftar",
      "Miliki prosedur penanganan data pribadi dan privasi klien",
      "Persiapkan sistem manajemen limbah khususnya dari perawatan kesehatan",
      "Konsultasikan jenis treatment yang sesuai dengan regulasi lokal",
    ],
    estimatedCost: "Rp 100 juta - Rp 500 juta (tergantung fasilitas)",
    estimatedTimeframe: "2-3 bulan untuk perizinan lengkap",
  },
  "Penyewaan Perahu & Transportasi": {
    requirements: [
      "Izin operasional dari Dinas Kelautan dan Perikanan",
      "Sertifikat kapal/perahu dari Badan Klasifikasi Indonesia",
      "Asuransi pertanggungjawaban publik",
      "Surat Izin Usaha Perdagangan (SIUP)",
      "NPWP dan dokumen identitas pemilik",
      "Rencana operasional dan standar keselamatan",
      "Surat persetujuan dari pemerintah desa/kelurahan",
      "Dokumen pemeliharaan kapal yang teratur",
    ],
    considerations: [
      "Pastikan semua kapal/perahu layak operasi dan rutin dipelihara",
      "Sediakan peralatan keselamatan lengkap (life jacket, lifeboat, dll)",
      "Miliki crew yang terlatih dan bersertifikat",
      "Lakukan pemeriksaan kapal berkala sesuai standar internasional",
      "Perhatikan kondisi cuaca dan musim dalam operasional",
      "Implementasikan protokol keselamatan yang ketat untuk penumpang",
    ],
    estimatedCost: "Rp 200 juta - Rp 1 miliar (tergantung jumlah dan jenis kapal)",
    estimatedTimeframe: "2-4 bulan untuk perizinan awal",
  },
  "Pariwisata dan perhotelan": {
    requirements: [
      "AMDAL atau SPPL (Surat Pernyataan Pengelolaan Lingkungan)",
      "Izin Mendirikan Bangunan (IMB)",
      "Sertifikat kepemilikan tanah",
      "NPWP dan KTP pemilik/pengurus",
      "Rencana arsitektur dan master plan",
      "Rekomendasi dari pemerintah desa/kelurahan",
      "Izin dari Dinas Pariwisata",
    ],
    considerations: [
      "Koordinasi dengan Dinas Pariwisata untuk pengembangan yang sesuai",
      "Pertimbangkan dampak terhadap komunitas lokal",
      "Siapkan rencana manajemen lingkungan yang komprehensif",
      "Jaga keberlanjutan dan konservasi area wisata",
      "Libatkan masyarakat dalam manfaat ekonomi pariwisata",
      "Pastikan fasilitas memenuhi standar pariwisata internasional",
    ],
    estimatedCost: "Rp 500 juta - Rp 3 miliar",
    estimatedTimeframe: "3-6 bulan",
  },
  "Rental perlengkapan wisata": {
    requirements: [
      "Izin Usaha dari Dinas Kelautan/Pariwisata",
      "Sertifikat peralatan dari produsen/verifikasi kelayakan",
      "Asuransi perlengkapan dan pertanggungjawaban publik",
      "NPWP dan KTP pemilik",
      "Bukti kepemilikan/sewa lokasi",
      "Rencana operasional dan standar keselamatan",
      "Izin dari desa/kelurahan",
    ],
    considerations: [
      "Pastikan semua perlengkapan dalam kondisi baik dan aman",
      "Sediakan asuransi untuk pelanggan",
      "Lakukan pemeriksaan rutin dan perawatan berkala",
      "Terapkan protokol keselamatan penggunaan peralatan",
      "Miliki staf yang terlatih dalam penggunaan peralatan",
      "Dokumentasikan kondisi dan riwayat peralatan",
    ],
    estimatedCost: "Rp 50 juta - Rp 200 juta",
    estimatedTimeframe: "1-2 bulan",
  },
  "Toko souvenir": {
    requirements: [
      "Surat Izin Usaha Perdagangan (SIUP)",
      "Izin Mendirikan Bangunan (IMB)",
      "NPWP dan KTP pemilik",
      "Sertifikat tanah atau bukti hak tempat usaha",
      "Tanda Daftar Perusahaan (TDP) jika berbentuk CV/PT",
      "Izin dari kelurahan/desa",
      "Rekomendasi dari Dinas Pariwisata",
    ],
    considerations: [
      "Pastikan produk lokal dan kreatifitas lokal terwakili",
      "Bantu pengrajin lokal dalam pemasaran",
      "Jaga kualitas dan autentisitas produk souvenir",
      "Miliki sistem pembayaran yang memudahkan wisatawan",
      "Pertimbangkan desain toko yang menarik bagi wisatawan",
      "Dokumentasikan asal dan nilai produk lokal",
    ],
    estimatedCost: "Rp 30 juta - Rp 100 juta",
    estimatedTimeframe: "1-2 bulan",
  },
  "Jasa penyelam dan olahraga air": {
    requirements: [
      "Izin dari Dinas Kelautan dan Pariwisata",
      "Sertifikasi internasional (PADI, SSI, ANDI, dll)",
      "Sertifikat kesehatan dari dokter",
      "Asuransi pertanggungjawaban (minimal Rp 1 miliar)",
      "NPWP dan KTP pemilik",
      "Rencana operasional dan protokol keselamatan",
      "Surat izin dari pemerintah setempat",
    ],
    considerations: [
      "Semua instruktur harus bersertifikat dan terupdate",
      "Lakukan asuransi jiwa untuk setiap peserta aktivitas",
      "Miliki standar keselamatan internasional",
      "Briefing keselamatan komprehensif sebelum aktivitas",
      "Equipment berkualitas tinggi dan rutin maintenance",
      "Tim rescue dan first aid yang terlatih",
    ],
    estimatedCost: "Rp 100 juta - Rp 500 juta",
    estimatedTimeframe: "2-3 bulan",
  },
  Agribisnis: {
    requirements: [
      "Sertifikat tanah/lahan produktif",
      "NPWP dan KTP pemilik",
      "Surat Rekomendasi dari Dinas Pertanian",
      "Izin lingkungan jika skala besar",
      "Rencana pengembangan pertanian",
      "Rekomendasi dari pemerintah desa",
      "Izin Usaha dari Dinas Perindustrian",
    ],
    considerations: [
      "Jaga kelestarian lahan pertanian yang produktif",
      "Terapkan praktik pertanian berkelanjutan",
      "Koordinasi dengan petani lokal untuk peluang kolaborasi",
      "Pertimbangkan sistem irigasi dan manajemen air",
      "Diversifikasi jenis komoditas pertanian",
      "Pilih bibit dan teknologi pertanian yang tepat",
    ],
    estimatedCost: "Rp 100 juta - Rp 500 juta",
    estimatedTimeframe: "2-3 bulan",
  },
  "Pertanian organik": {
    requirements: [
      "Sertifikat lahan organik (dari LSM sertifikasi)",
      "Sertifikat tanah",
      "NPWP dan KTP pemilik",
      "Rekomendasi dari Dinas Pertanian",
      "Rencana konversi ke pertanian organik",
      "Izin lingkungan jika diperlukan",
      "Rekomendasi dari pemerintah desa",
    ],
    considerations: [
      "Proses sertifikasi organik membutuhkan waktu 2-3 tahun",
      "Dokumentasi lengkap tentang metode pertanian",
      "Tidak boleh menggunakan pestisida/pupuk sintetis",
      "Manajemen kesuburan tanah yang alami",
      "Edukasi petani tentang praktik organik",
      "Pasar dan sertifikasi internasional yang diakui",
    ],
    estimatedCost: "Rp 50 juta - Rp 200 juta",
    estimatedTimeframe: "2-3 tahun untuk sertifikasi penuh",
  },
  "Agro-wisata": {
    requirements: [
      "Izin dari Dinas Pertanian dan Dinas Pariwisata",
      "AMDAL atau SPPL",
      "Sertifikat tanah",
      "IMB untuk fasilitas pendukung",
      "NPWP dan KTP pemilik",
      "Rencana agro-wisata dan infrastruktur",
      "Rekomendasi desa/kelurahan",
    ],
    considerations: [
      "Edukasi wisatawan tentang proses pertanian",
      "Fasilitas yang aman dan nyaman untuk pengunjung",
      "Program interaktif yang edukatif dan menyenangkan",
      "Manajemen limbah dari aktivitas wisata",
      "Libatkan petani lokal sebagai mitra",
      "Jaga keberlanjutan sumber daya alam",
    ],
    estimatedCost: "Rp 200 juta - Rp 1 miliar",
    estimatedTimeframe: "3-4 bulan",
  },
  "Kerajinan tradisional": {
    requirements: [
      "Surat Izin Usaha Perdagangan (SIUP)",
      "Sertifikat legalitas produk (jika diperlukan)",
      "NPWP dan KTP pemilik",
      "Bukti kepemilikan/sewa tempat usaha",
      "Rencana operasional",
      "Izin dari kelurahan/desa",
      "Sertifikat dari Dinas Perindustrian (opsional)",
    ],
    considerations: [
      "Jaga autentisitas dan tradisi pembuatan kerajinan",
      "Dokumentasi teknik dan warisan budaya",
      "Pelatihan dan transfer pengetahuan ke generasi muda",
      "Kualitas bahan baku dan hasil akhir",
      "Sertifikasi dan penghargaan kerajinan tradisional",
      "Strategi pemasaran yang tepat untuk pasar lokal/internasional",
    ],
    estimatedCost: "Rp 20 juta - Rp 100 juta",
    estimatedTimeframe: "1-2 bulan",
  },
  "Peternakan organik": {
    requirements: [
      "Sertifikat lahan untuk peternakan",
      "Sertifikat sumber pakan organik",
      "NPWP dan KTP pemilik",
      "Rencana peternakan organik",
      "Izin dari Dinas Peternakan",
      "Rekomendasi desa/kelurahan",
      "Sertifikat kesehatan hewan",
    ],
    considerations: [
      "Manajemen kesehatan hewan tanpa antibiotik sintetis",
      "Pakan organik bersertifikat",
      "Sistem pemberian minum dan pakan yang higienis",
      "Manajemen limbah peternakan yang ramah lingkungan",
      "Pemeliharaan standar kesejahteraan hewan",
      "Pemasaran produk organik dengan sertifikasi",
    ],
    estimatedCost: "Rp 100 juta - Rp 500 juta",
    estimatedTimeframe: "2-3 bulan",
  },
  Ekowisata: {
    requirements: [
      "Izin dari Dinas Lingkungan dan Dinas Pariwisata",
      "AMDAL atau SPPL komprehensif",
      "Sertifikat tanah/kawasan",
      "IMB untuk fasilitas pendukung",
      "Rencana pengelolaan lingkungan",
      "NPWP dan KTP pemilik",
      "Rekomendasi desa/kelurahan dan/atau camat",
    ],
    considerations: [
      "Perlindungan ekosistem adalah prioritas utama",
      "Batasi jumlah pengunjung untuk menjaga kelestarian",
      "Edukasi lingkungan untuk setiap pengunjung",
      "Infrastruktur yang minim invasif terhadap alam",
      "Keterlibatan komunitas lokal dalam manajemen",
      "Sertifikasi ekowisata internasional yang diakui",
    ],
    estimatedCost: "Rp 300 juta - Rp 2 miliar",
    estimatedTimeframe: "3-5 bulan",
  },
  "Cottage dan penginapan": {
    requirements: [
      "Izin Mendirikan Bangunan (IMB)",
      "Sertifikat tanah/kepemilikan lahan",
      "Surat Izin Usaha Perdagangan (SIUP)",
      "NPWP dan KTP pemilik",
      "Rencana arsitektur dan tata letak",
      "Sertifikat Usaha dari Dinas Pariwisata",
      "Rekomendasi desa/kelurahan",
    ],
    considerations: [
      "Standar kebersihan dan fasilitas kamar yang baik",
      "Sistem keamanan dan keselamatan pengguna",
      "Manajemen limbah dan air yang ramah lingkungan",
      "Sumber daya air bersih yang cukup",
      "Staf terlatih dalam hospitality",
      "Komunikasi dengan wisatawan internasional jika perlu",
    ],
    estimatedCost: "Rp 300 juta - Rp 1 miliar",
    estimatedTimeframe: "2-4 bulan",
  },
  "Petualangan alam": {
    requirements: [
      "Izin dari Dinas Pariwisata dan Lingkungan",
      "Sertifikasi keselamatan dari badan terkait",
      "NPWP dan KTP pemilik",
      "Asuransi pertanggungjawaban publik",
      "Rencana operasional dan protokol keselamatan",
      "Sertifikat instruktur petualangan",
      "Rekomendasi desa/kelurahan",
    ],
    considerations: [
      "Standar keselamatan petualangan internasional",
      "Equipment dan gear berkualitas tinggi dan terawat",
      "Instruktur bersertifikat dan berpengalaman",
      "Evaluasi risiko untuk setiap aktivitas",
      "Asuransi untuk setiap peserta",
      "Tim rescue dan first aid siap",
    ],
    estimatedCost: "Rp 100 juta - Rp 500 juta",
    estimatedTimeframe: "2-3 bulan",
  },
  "Kafe dan rumah makan": {
    requirements: [
      "Izin Mendirikan Bangunan (IMB)",
      "Surat Izin Usaha Perdagangan (SIUP)",
      "Sertifikat Usaha Restoran dari Dinas Kesehatan",
      "NPWP dan KTP pemilik",
      "Bukti kepemilikan/sewa tempat",
      "Izin dari kelurahan/desa",
      "Tanda Daftar Perusahaan (TDP)",
    ],
    considerations: [
      "Standar kebersihan dapur dan peralatan masak",
      "Sumber air bersih dan sistem pembuangan limbah",
      "Izin khusus untuk menjual alkohol jika ada",
      "Pelatihan food handling untuk semua staff",
      "Dokumentasi menu dan bahan makanan",
      "Kenyamanan dan estetika tempat makan",
    ],
    estimatedCost: "Rp 50 juta - Rp 300 juta",
    estimatedTimeframe: "1-3 bulan",
  },
  "Craft dan kerajinan lokal": {
    requirements: [
      "Surat Izin Usaha Perdagangan (SIUP)",
      "Sertifikat produk jika diperlukan",
      "NPWP dan KTP pemilik",
      "Bukti kepemilikan/sewa tempat usaha",
      "Rencana produksi dan desain",
      "Izin dari kelurahan/desa",
      "Rekomendasi Dinas Perindustrian (opsional)",
    ],
    considerations: [
      "Jaga keunikan dan karakter lokal produk",
      "Kualitas bahan dan hasil kerajinan",
      "Sertifikasi atau penghargaan kerajinan",
      "Strategi pemasaran lokal dan wisatawan",
      "Pelatihan keterampilan untuk pengrajin",
      "Dokumentasi proses dan cerita produk",
    ],
    estimatedCost: "Rp 20 juta - Rp 100 juta",
    estimatedTimeframe: "1-2 bulan",
  },
}

export function BusinessAccordion({ items, type }: BusinessAccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const icon = type === "suitable" ? CheckCircle2 : AlertCircle
  const iconBgColor = type === "suitable" ? "bg-green-500" : "bg-blue-500"
  const cardBgColor = type === "suitable" ? "border-green-200 bg-green-50/50" : "border-blue-200 bg-blue-50/50"

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isExpanded = expandedIndex === idx
        const details = BUSINESS_DETAILS[item.category] || {
          requirements: ["Informasi detail tidak tersedia"],
          considerations: ["Silakan konsultasi dengan DPMPTSP"],
          estimatedCost: "Bervariasi",
          estimatedTimeframe: "Bervariasi",
        }

        return (
          <Card key={idx} className={`border ${cardBgColor} overflow-hidden cursor-pointer transition-all`}>
            {/* Header - Always visible */}
            <div onClick={() => toggleExpanded(idx)} className="p-4 hover:bg-black/5 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-foreground mb-1">{item.category}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <div className={`flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Expandable Content */}
            {isExpanded && (
              <div className="border-t border-current/10 p-6 bg-white/50 space-y-6">
                {/* Requirements */}
                <div>
                  <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span className="text-sm font-medium">Syarat Pembuatan Izin</span>
                  </h5>
                  <div className="space-y-2 ml-2">
                    {details.requirements.map((req, idx) => (
                      <div key={idx} className="flex gap-3">
                        <span className="text-primary font-semibold flex-shrink-0 mt-0.5">✓</span>
                        <p className="text-sm text-foreground leading-relaxed">{req}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Considerations */}
                <div>
                  <h5 className="font-semibold text-foreground mb-3">Hal-hal yang Perlu Diperhatikan</h5>
                  <div className="space-y-2 ml-2">
                    {details.considerations.map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        <span className="text-amber-600 font-bold flex-shrink-0 mt-0.5">•</span>
                        <p className="text-sm text-foreground leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost & Timeline */}
                <div className="grid grid-cols-2 gap-4 bg-white rounded-lg p-4 border border-current/10">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Estimasi Biaya</p>
                    <p className="text-sm font-semibold text-foreground">{details.estimatedCost}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Estimasi Waktu</p>
                    <p className="text-sm font-semibold text-foreground">{details.estimatedTimeframe}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
