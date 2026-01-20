"use client"

import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LeafletMapUpdated } from "@/components/leaflet-map-updated"
import { BusinessAccordion } from "@/components/business-accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, FileText, ShieldCheck, Search, Info, MapPin } from "lucide-react"
import Link from "next/link"

// Data Wilayah Kabupaten Lombok Barat
const DISTRICTS = {
  Sekotong: ["Gili Meno", "Gili Air", "Sekotong Timur", "Sekotong Tengah", "Sekotong Barat"],
  Lembar: ["Lembar", "Perbuahan", "Kuripan"],
  Lingsar: ["Lingsar", "Menuran", "Dasan Anyar"],
  Bayan: ["Bayan", "Senaru", "Aik Berik"],
  Tanjung: ["Tanjung", "Dasan Baru", "Pengadol"],
  Narmada: ["Narmada", "Dasan Tereng", "Dasan Lekong"],
}

// Data Potensi Investasi Indikatif
const REGIONAL_DATA: any = {
  "Sekotong-Gili Meno": {
    district: "Sekotong",
    village: "Gili Meno",
    rdtrStatus: "available",
    suitableBusinesses: ["Pariwisata dan perhotelan", "Restoran dan kafe", "Jasa penyelam"],
    needsFurtherStudy: ["Industri ringan", "Gudang logistik"],
    riskNotes: ["Zona pariwisata utama", "Area konservasi laut", "Infrastruktur terbatas"],
  },
  "Lembar-Lembar": {
    district: "Lembar",
    village: "Lembar",
    rdtrStatus: "available",
    suitableBusinesses: ["Pelabuhan dan logistik", "Industri maritim", "Warehouse"],
    needsFurtherStudy: ["Industri manufaktur", "Perumahan besar"],
    riskNotes: ["Kawasan strategis pelabuhan", "Lalu lintas tinggi"],
  },
}

export default function CekWilayahPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [selectedVillage, setSelectedVillage] = useState<string>("")
  const [showDetails, setShowDetails] = useState(false)

  const villages = useMemo(() => {
    return selectedDistrict ? (DISTRICTS as any)[selectedDistrict] : []
  }, [selectedDistrict])

  const currentSelection = selectedVillage ? `${selectedDistrict}-${selectedVillage}` : ""
  const data = currentSelection ? REGIONAL_DATA[currentSelection] : null

  const handleMapSelect = useCallback((districtVillage: string) => {
    const [district, village] = districtVillage.split("-")
    setSelectedDistrict(district)
    setSelectedVillage(village)
    setShowDetails(true)
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 font-poppins text-slate-900 pb-24 text-left">
      
      {/* HEADER SECTION - Lebar max-w-6xl sejajar Navbar */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-[100] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                Cek Potensi Wilayah
              </h1>
              <p className="text-sm md:text-base text-slate-500 font-bold uppercase tracking-widest mt-2">
                Analisis Indikatif Investasi Lombok Barat
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BODY CONTENT - Lebar max-w-6xl sejajar Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* PANEL KIRI: Pemilihan (Span 4) */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <Card className="p-8 rounded-2xl border-none shadow-xl bg-white overflow-visible">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                   <h3 className="font-black text-slate-900 uppercase tracking-wider text-lg">Pilih Lokasi</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Kecamatan</label>
                    <Select value={selectedDistrict} onValueChange={(val) => { setSelectedDistrict(val); setSelectedVillage(""); }}>
                      <SelectTrigger className="rounded-xl border-slate-200 h-14 font-bold focus:ring-blue-500 text-base">
                        <SelectValue placeholder="Pilih kecamatan..." />
                      </SelectTrigger>
                      <SelectContent className="z-[10001]">
                        {Object.keys(DISTRICTS).map((d) => (
                          <SelectItem key={d} value={d} className="font-medium py-3 text-base">{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Desa / Kelurahan</label>
                    <Select value={selectedVillage} onValueChange={setSelectedVillage} disabled={!selectedDistrict}>
                      <SelectTrigger className="rounded-xl border-slate-200 h-14 font-bold focus:ring-blue-500 text-base">
                        <SelectValue placeholder="Pilih desa..." />
                      </SelectTrigger>
                      <SelectContent className="z-[10001]">
                        {villages.map((v: string) => (
                          <SelectItem key={v} value={v} className="font-medium py-3 text-base">{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() => selectedVillage && setShowDetails(true)}
                    disabled={!selectedVillage}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-16 font-black shadow-lg shadow-blue-200 transition-all active:scale-95 uppercase tracking-widest text-sm mt-4"
                  >
                    Mulai Analisis <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </Card>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4 shadow-sm">
                <Info className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                <p className="text-sm text-blue-800 leading-relaxed font-semibold">
                  <strong>Tips:</strong> Klik langsung area pada peta untuk mendeteksi potensi secara instan.
                </p>
              </div>
            </div>
          </div>

          {/* PANEL KANAN: Map & Hasil (Span 8) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Kartu Peta */}
            <Card className="rounded-2xl border-none shadow-2xl overflow-hidden bg-white relative z-0">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl">Peta Lokasi Indikatif</h3>
                <span className="flex items-center gap-2 text-xs font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full uppercase">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div> OpenStreetMap Live
                </span>
              </div>
              
              <div className="p-4 bg-white">
                <div className="h-[500px] relative z-0 rounded-xl overflow-hidden border border-slate-100">
                  <LeafletMapUpdated
                    onSelectRegion={handleMapSelect}
                    selectedDistrict={selectedDistrict}
                    selectedVillage={selectedVillage}
                  />
                </div>
              </div>
              
              <div className="p-10 bg-slate-50 border-t border-slate-100">
                <h4 className="font-black text-lg uppercase tracking-widest text-slate-900 mb-3">CARA PENGGUNAAN:</h4>
                <p className="text-base text-slate-600 font-medium leading-relaxed">
                  Pilih wilayah melalui dropdown atau klik pada peta. Klik tombol <span className="text-blue-600 font-bold">"Mulai Analisis"</span> untuk memunculkan detail investasi.
                </p>
              </div>
            </Card>

            {/* Hasil Analisis */}
            {showDetails && data ? (
              <Card className="rounded-2xl border-none shadow-2xl overflow-hidden bg-white animate-in fade-in slide-in-from-bottom-8 duration-500 p-0">
                <div className="bg-slate-900 p-10 text-white m-0 rounded-t-2xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <span className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">Wilayah Terpilih</span>
                      <h2 className="text-4xl font-black uppercase tracking-tighter mt-2 leading-none">{data.village}</h2>
                      <p className="font-bold text-slate-400 text-lg mt-2">Kecamatan {data.district}</p>
                    </div>
                    <div className={`px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg ${
                      data.rdtrStatus === "available" ? "bg-green-500 text-white" : "bg-amber-500 text-white"
                    }`}>
                      {data.rdtrStatus === "available" ? "✓ RDTR Tersedia" : "! RDTR Proses"}
                    </div>
                  </div>
                </div>

                <div className="p-10 space-y-12">
                  <section>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 font-bold shadow-sm text-xl">✓</div>
                      <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Usaha Prioritas</h4>
                    </div>
                    <BusinessAccordion
                      items={data.suitableBusinesses.map((b: string) => ({
                        category: b,
                        description: "Sesuai dengan arahan tata ruang wilayah setempat.",
                      }))}
                      type="suitable"
                    />
                  </section>

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
                    <div className="flex gap-4">
                      <ShieldCheck className="w-8 h-8 text-amber-600 shrink-0" />
                      <div>
                        <h5 className="font-black text-amber-900 uppercase mb-2">Informasi Penting</h5>
                        <p className="text-sm text-amber-800 font-medium leading-relaxed italic">
                          Data ini bersifat indikatif. Kepastian pemanfaatan ruang mengacu pada dokumen RDTR resmi Kabupaten Lombok Barat.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="bg-white rounded-2xl p-24 text-center border-2 border-dashed border-slate-200 shadow-sm">
                <MapPin className="w-24 h-24 text-slate-200 mx-auto mb-8" />
                <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tighter">Lokasi Belum Dipilih</h3>
                <p className="text-slate-400 font-bold max-w-sm mx-auto mt-4 italic text-lg leading-relaxed">
                  Gunakan panel samping atau klik peta untuk memulai analisis wilayah.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}