"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, CheckCircle2, AlertCircle } from "lucide-react"

interface BusinessDetailModalProps {
  category: string
  description: string
  isOpen: boolean
  onClose: () => void
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
}

export function BusinessDetailModal({ category, description, isOpen, onClose }: BusinessDetailModalProps) {
  if (!isOpen) return null

  const details = BUSINESS_DETAILS[category] || {
    requirements: ["Informasi detail tidak tersedia"],
    considerations: ["Silakan konsultasi dengan DPMPTSP untuk informasi lengkap"],
    estimatedCost: "Bervariasi",
    estimatedTimeframe: "Bervariasi",
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{category}</h2>
            <p className="text-muted-foreground text-sm mt-2">{description}</p>
          </div>
          <button onClick={onClose} className="flex-shrink-0 ml-4 p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Syarat Pembuatan Izin */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Syarat Pembuatan Izin</h3>
            </div>
            <div className="space-y-2 ml-11">
              {details.requirements.map((req, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="text-primary font-semibold flex-shrink-0">✓</span>
                  <p className="text-foreground text-sm">{req}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hal-hal yang Perlu Diperhatikan */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Hal-hal yang Perlu Diperhatikan</h3>
            </div>
            <div className="space-y-2 ml-11">
              {details.considerations.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="text-amber-600 font-bold flex-shrink-0">•</span>
                  <p className="text-foreground text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Estimasi Biaya & Waktu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">Estimasi Biaya Perizinan</p>
              <p className="text-foreground font-semibold">{details.estimatedCost}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">Estimasi Waktu Perizinan</p>
              <p className="text-foreground font-semibold">{details.estimatedTimeframe}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <p className="text-sm text-foreground mb-3">
              Informasi di atas bersifat umum. Untuk konsultasi lebih detail dan rekomendasi spesifik sesuai kondisi
              Anda, silakan hubungi tim ahli DPMPTSP.
            </p>
            <Button className="w-full bg-primary hover:bg-primary/90">Hubungi DPMPTSP untuk Konsultasi</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
