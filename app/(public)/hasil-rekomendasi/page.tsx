"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BusinessDetailModal } from "@/components/business-detail-modal"
import { BusinessAccordion } from "@/components/business-accordion"
import { ChevronRight, MapPin, AlertCircle, CheckCircle2, HelpCircle, FileText } from "lucide-react"

interface RecommendationData {
  village: string
  district: string
  summary: string
  businessCategories: {
    suitable: {
      category: string
      description: string
    }[]
    needsStudy: {
      category: string
      description: string
    }[]
  }
  riskAndObligation: {
    title: string
    items: string[]
  }
  consultationPrompt: string
}

const SAMPLE_RECOMMENDATIONS: RecommendationData = {
  village: "Gili Air",
  district: "Sekotong",
  summary:
    "Wilayah Gili Air memiliki potensi tinggi untuk pengembangan industri pariwisata bahari. Dengan status RDTR yang tersedia, wilayah ini sangat sesuai untuk investasi di sektor pariwisata, perhotelan, dan olahraga air.",
  businessCategories: {
    suitable: [
      {
        category: "Resort & Akomodasi Wisata",
        description:
          "Pembangunan resort bintang 3-5, villa, dan penginapan wisata. Potensi pasar tinggi dari wisatawan internasional.",
      },
      {
        category: "Diving Center & Olahraga Air",
        description:
          "Pusat selam, sekolah selancar, rental jet ski. Area ini memiliki spot diving kelas dunia dengan biodiversity tinggi.",
      },
      {
        category: "Restoran & Kafe Tepi Pantai",
        description:
          "Usaha kuliner dengan pemandangan laut, seafood restaurant, beach club. Lokasi strategis menghadap laut.",
      },
      {
        category: "Spa & Wellness Center",
        description: "Pusat perawatan kesehatan dan kecantikan, wellness retreat, yoga studio dengan konsep natural.",
      },
      {
        category: "Penyewaan Perahu & Transportasi",
        description: "Jasa rental perahu, speedboat, snorkeling tour. Permintaan tinggi dari wisatawan.",
      },
    ],
    needsStudy: [
      {
        category: "Pertanian Intensif",
        description: "Memerlukan kajian mendalam tentang ketersediaan air tawar dan dampak terhadap ekosistem laut.",
      },
      {
        category: "Peternakan Skala Besar",
        description: "Perlu evaluasi terhadap manajemen limbah dan dampak lingkungan area konservasi.",
      },
      {
        category: "Manufaktur & Industri",
        description: "Harus melalui studi lingkungan komprehensif, terutama untuk area dengan perlindungan ketat.",
      },
    ],
  },
  riskAndObligation: {
    title: "Catatan Risiko & Kewajiban Perizinan",
    items: [
      "Zona Konservasi Laut: Area ini termasuk zona konservasi - wajib memenuhi peraturan pemerintah tentang perlindungan lingkungan laut dan tidak boleh merusak ekosistem terumbu karang.",
      "Koordinasi Lintas Sektor: Perizinan memerlukan koordinasi dengan Dinas Kelautan, Dinas Pariwisata, dan instansi lingkungan.",
      "Infrastruktur Terbatas: Pulau dengan akses terbatas memerlukan evaluasi ketersediaan listrik, air bersih, dan sistem pembuangan limbah.",
      "Kepedulian Sosial: Investasi besar wajib melibatkan masyarakat lokal dan memberikan dampak ekonomi positif bagi penduduk setempat.",
      "Perizinan Internasional: Beberapa aktivitas pariwisata mungkin memerlukan sertifikasi internasional (diving, resort).",
    ],
  },
  consultationPrompt:
    "Informasi di atas bersifat indikatif. Untuk mendapatkan kepastian tentang kesesuaian usaha Anda dengan RDTR dan persyaratan perizinan yang tepat, lakukan konsultasi resmi dengan DPMPTSP Kabupaten Lombok Barat.",
}

export default function HasilRekomendasiPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDescription, setSelectedDescription] = useState<string>("")
  const data = SAMPLE_RECOMMENDATIONS

  const handleOpenDetail = (category: string, description: string) => {
    setSelectedCategory(category)
    setSelectedDescription(description)
  }

  const handleCloseDetail = () => {
    setSelectedCategory(null)
    setSelectedDescription("")
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Hasil Rekomendasi Investasi</h1>
          </div>
          <p className="text-muted-foreground ml-13">Analisis indikatif wilayah pilihan Anda</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Region Summary */}
        <Card className="border border-border mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-foreground">{data.village}</h2>
                <p className="text-lg text-muted-foreground">Kecamatan {data.district}</p>
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap">
                RDTR Tersedia
              </div>
            </div>
            <p className="text-lg text-foreground leading-relaxed">{data.summary}</p>
          </div>
        </Card>

        {/* Business Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Suitable Businesses */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Kategori Usaha yang Sesuai</h3>
              </div>
              <p className="text-muted-foreground">
                Jenis usaha berikut umumnya sesuai dengan kondisi RDTR wilayah ini. Klik untuk melihat detail
                persyaratan.
              </p>
            </div>

            <BusinessAccordion
              items={data.businessCategories.suitable.map((item) => ({
                category: item.category,
                description: item.description,
              }))}
              type="suitable"
            />
          </div>

          {/* Sidebar - Needs Study */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Perlu Kajian Lanjutan</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Kategori usaha yang memerlukan studi lebih mendalam</p>

              <BusinessAccordion
                items={data.businessCategories.needsStudy.map((item) => ({
                  category: item.category,
                  description: item.description,
                }))}
                type="study"
              />
            </div>
          </div>
        </div>

        {/* Risk and Obligation */}
        <Card className="border border-amber-200 bg-amber-50/50 mb-12">
          <div className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground mb-2">{data.riskAndObligation.title}</h3>
                <p className="text-muted-foreground">Poin-poin penting yang harus diperhatikan sebelum berinvestasi</p>
              </div>
            </div>

            <div className="space-y-4">
              {data.riskAndObligation.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-white rounded-lg border border-amber-100">
                  <span className="text-amber-600 font-bold flex-shrink-0">{idx + 1}.</span>
                  <p className="text-foreground leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Information Box */}
        <Card className="border border-primary/30 bg-primary/5 mb-8">
          <div className="p-8">
            <h3 className="text-lg font-bold text-foreground mb-3">Informasi Penting</h3>
            <p className="text-foreground leading-relaxed mb-4">{data.consultationPrompt}</p>
            <p className="text-sm text-muted-foreground">
              DPMPTSP Kabupaten Lombok Barat siap memberikan konsultasi gratis dan membantu proses perizinan investasi
              Anda.
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link href="/cek-wilayah">
            <Button variant="outline" className="w-full h-12 font-semibold bg-transparent">
              Cek Wilayah Lain
            </Button>
          </Link>
          <Link href="/konsultasi">
            <Button className="w-full bg-primary hover:bg-primary/90 h-12 font-semibold">
              Lanjut ke Konsultasi
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Additional Resources */}
        <Card className="border border-border p-8 bg-muted/30">
          <h3 className="text-xl font-bold text-foreground mb-6">Sumber Daya Tambahan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/perizinan">
              <Button variant="outline" className="w-full justify-start h-auto py-4 bg-transparent">
                <div className="text-left">
                  <p className="font-semibold text-foreground">Pelajari Proses Perizinan</p>
                  <p className="text-xs text-muted-foreground">Pahami alur lengkap perizinan</p>
                </div>
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline" className="w-full justify-start h-auto py-4 bg-transparent">
                <div className="text-left">
                  <p className="font-semibold text-foreground">Tanya Jawab Umum</p>
                  <p className="text-xs text-muted-foreground">Jawab pertanyaan Anda</p>
                </div>
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {selectedCategory && (
        <BusinessDetailModal
          category={selectedCategory}
          description={selectedDescription}
          isOpen={true}
          onClose={handleCloseDetail}
        />
      )}
    </main>
  )
}
