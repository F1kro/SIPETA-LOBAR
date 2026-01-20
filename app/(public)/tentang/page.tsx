"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Target, Lightbulb, Shield, Users, MapPin } from "lucide-react"

export default function TentangPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Tentang Sistem Portal</h1>
          </div>
          <p className="text-muted-foreground ml-13">Memahami latar belakang dan tujuan portal informasi kami</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Background */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">Latar Belakang Pengembangan Sistem</h2>
          <Card className="border border-border p-8 space-y-4">
            <p className="text-lg text-foreground leading-relaxed">
              Portal Informasi Investasi Wilayah DPMPTSP Kabupaten Lombok Barat dikembangkan dengan tujuan untuk
              mempermudah masyarakat dan calon investor dalam memahami potensi investasi dan persyaratan perizinan di
              berbagai wilayah Kabupaten Lombok Barat.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              Sebelumnya, masyarakat yang ingin berinvestasi harus membaca dokumen RDTR (Rencana Detail Tata Ruang)
              secara langsung atau berkonsultasi langsung dengan DPMPTSP tanpa informasi awal. Hal ini memerlukan waktu
              dan effort yang cukup besar, terutama untuk calon investor yang kurang familier dengan proses perizinan.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              Dengan portal ini, kami ingin menyederhanakan proses pemahaman informasi RDTR menjadi bentuk visual dan
              naratif yang mudah dipahami oleh masyarakat umum, tanpa perlu membaca dokumen teknis yang kompleks.
            </p>
          </Card>
        </div>

        {/* Goals */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">Tujuan & Manfaat Sistem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Lightbulb,
                title: "Panduan Investasi Berbasis Wilayah",
                description:
                  "Memberikan panduan awal tentang potensi investasi di setiap wilayah Kabupaten Lombok Barat berdasarkan RDTR yang berlaku.",
              },
              {
                icon: Target,
                title: "Penyederhanaan Informasi RDTR",
                description:
                  "Mengubah informasi RDTR yang teknis menjadi bentuk visual, peta interaktif, dan penjelasan yang mudah dipahami masyarakat umum.",
              },
              {
                icon: Users,
                title: "Dukungan Pelayanan Publik",
                description:
                  "Mendukung tugas DPMPTSP dalam memberikan pelayanan, edukasi, dan pengawasan perizinan yang lebih baik kepada masyarakat.",
              },
              {
                icon: Shield,
                title: "Transparansi & Kepatuhan",
                description:
                  "Meningkatkan transparansi regulasi dan mendorong kepatuhan investor terhadap RDTR sebelum melakukan investasi.",
              },
            ].map((goal, idx) => {
              const Icon = goal.icon
              return (
                <Card key={idx} className="border border-border p-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* How It Supports DPMPTSP */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">Dukungan Terhadap Visi & Misi DPMPTSP</h2>
          <Card className="border border-border p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">Visi DPMPTSP:</h3>
                <p className="text-lg text-foreground leading-relaxed italic">
                  "Menjadi lembaga yang melayani dengan sepenuh hati, transparan, dan responsif dalam mendukung
                  investasi dan pengembangan di Kabupaten Lombok Barat."
                </p>
              </div>
              <div className="border-l-4 border-primary pl-6 py-4">
                <p className="text-foreground leading-relaxed">
                  <strong>Bagaimana portal ini mendukung:</strong> Dengan menyediakan informasi yang transparan, mudah
                  dipahami, dan dapat diakses kapan saja, portal ini membantu DPMPTSP dalam melaksanakan komitmennya
                  untuk melayani masyarakat dengan lebih baik dan responsif terhadap kebutuhan calon investor.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">Misi DPMPTSP:</h3>
                <ul className="space-y-3 text-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">1.</span>
                    <span>Mempercepat dan mempermudah proses perizinan investasi</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">2.</span>
                    <span>Meningkatkan transparansi dan akuntabilitas dalam perizinan</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">3.</span>
                    <span>Memberikan edukasi kepada investor tentang regulasi dan RDTR</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">4.</span>
                    <span>Memastikan investasi sesuai dengan rencana tata ruang dan lingkungan</span>
                  </li>
                </ul>
              </div>
              <div className="border-l-4 border-accent pl-6 py-4">
                <p className="text-foreground leading-relaxed">
                  <strong>Bagaimana portal ini mendukung:</strong> Portal ini secara langsung mendukung semua misi di
                  atas dengan menyediakan informasi awal yang jelas, edukasi mengenai perizinan, dan transparansi
                  tentang kesesuaian wilayah. Dengan pemahaman awal yang baik, calon investor dapat mempersiapkan
                  dokumen dengan lebih baik, yang mempercepat proses perizinan secara keseluruhan.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Regulatory Foundation */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">Dasar Regulasi Umum</h2>
          <Card className="border border-border p-8">
            <p className="text-foreground mb-6 leading-relaxed">
              Portal ini dikembangkan berdasarkan peraturan perundang-undangan yang berlaku terkait investasi dan tata
              ruang di Indonesia:
            </p>
            <ul className="space-y-4">
              {[
                "Undang-Undang Nomor 25 Tahun 2007 tentang Penanaman Modal",
                "Undang-Undang Nomor 26 Tahun 2007 tentang Penataan Ruang",
                "Peraturan Pemerintah Nomor 24 Tahun 2021 tentang Penyelenggaraan Perizinan Berusaha Terintegrasi Secara Elektronik",
                "Rencana Detail Tata Ruang (RDTR) Kabupaten Lombok Barat",
                "Peraturan Bupati tentang Perizinan dan Retribusi Usaha di Kabupaten Lombok Barat",
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3 text-foreground">
                  <span className="text-primary font-bold flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">Pernyataan Disclaimer Resmi</h2>
          <Card className="border border-amber-200 bg-amber-50/50 p-8">
            <div className="space-y-4">
              <p className="text-lg font-semibold text-amber-900">
                Informasi yang ditampilkan di portal ini bersifat indikatif dan edukatif semata.
              </p>
              <div className="space-y-3 text-foreground leading-relaxed">
                <p>
                  <strong>1. Informasi Indikatif:</strong> Rekomendasi jenis usaha dan analisis wilayah yang ditampilkan
                  di portal ini adalah panduan awal berdasarkan RDTR dan data sekunder. Informasi ini bukan merupakan
                  kepastian hukum mengenai kelayakan usaha atau kesesuaian perizinan.
                </p>
                <p>
                  <strong>2. Kepastian Hukum:</strong> Kepastian tentang pemanfaatan ruang, kesesuaian jenis usaha, dan
                  perizinan tetap mengacu pada RDTR asli, peraturan perundang-undangan yang berlaku, dan keputusan resmi
                  dari DPMPTSP Kabupaten Lombok Barat.
                </p>
                <p>
                  <strong>3. Konsultasi Diperlukan:</strong> Sebelum melakukan investasi, investor wajib melakukan
                  konsultasi resmi dengan DPMPTSP untuk mendapatkan kepastian dan rekomendasi yang mengikat secara
                  administratif.
                </p>
                <p>
                  <strong>4. Tidak Menggantikan RDTR:</strong> Portal ini tidak menggantikan dokumen RDTR asli dan
                  dokumen-dokumen regulasi yang berlaku. Untuk informasi yang paling akurat dan terbaru, selalu rujuk
                  pada dokumen-dokumen resmi yang disediakan oleh DPMPTSP dan pemerintah daerah.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* About DPMPTSP */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">Tentang DPMPTSP Kabupaten Lombok Barat</h2>
          <Card className="border border-border p-8 bg-primary/5">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">DPMPTSP Kabupaten Lombok Barat</h3>
                <p className="text-muted-foreground">Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu</p>
              </div>
            </div>
            <p className="text-foreground mb-6 leading-relaxed">
              DPMPTSP Kabupaten Lombok Barat adalah lembaga pemerintah yang bertanggung jawab dalam memberikan pelayanan
              perizinan terpadu kepada masyarakat dan investor yang ingin melakukan investasi di Kabupaten Lombok Barat.
              Lembaga ini melayani berbagai jenis perizinan, dari perizinan sederhana hingga perizinan kompleks yang
              memerlukan koordinasi lintas sektor.
            </p>
            <div className="space-y-3 text-foreground">
              <div>
                <p className="font-semibold mb-1">Alamat:</p>
                <p className="text-muted-foreground">Jl. Raya Gerung No. 42, Kabupaten Lombok Barat, NTB 83353</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Telepon:</p>
                <p className="text-muted-foreground">(0370) 6789-100</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Jam Pelayanan:</p>
                <p className="text-muted-foreground">Senin - Jumat, 08:00 - 16:00 WIT</p>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <Card className="border border-border p-8 bg-primary/5 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ingin Memulai Investasi Anda?</h3>
          <p className="text-foreground mb-6 leading-relaxed">
            Gunakan portal ini untuk memahami potensi investasi wilayah Anda, kemudian lakukan konsultasi dengan DPMPTSP
            untuk mendapatkan rekomendasi dan bimbingan perizinan yang tepat.
          </p>
          <Link href="/cek-wilayah">
            <Button className="mx-auto bg-primary hover:bg-primary/90">
              Mulai Cek Wilayah
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </Card>
      </div>
    </main>
  )
}
