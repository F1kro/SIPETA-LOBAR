"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LeafletMapUpdated } from "@/components/leaflet-map-updated"
import { BusinessAccordion } from "@/components/business-accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, FileText, ShieldCheck, Search, Info, MapPin, Loader2, ExternalLink } from "lucide-react"

interface Wilayah {
  id: string
  kecamatan: string
  desa: string
  latitude: number
  longitude: number
  statusRdtr: string
  usahaSesuai: string // Disimpan sebagai string JSON di DB
  perluKajian: string // Disimpan sebagai string JSON di DB
  catatanRisiko?: string
  estimasiBiaya?: string
  estimasiWaktu?: string
  gambarRdtr?: string
}

export default function CekWilayahPage() {
  const [wilayahData, setWilayahData] = useState<Wilayah[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [selectedVillage, setSelectedVillage] = useState<string>("")
  const [showDetails, setShowDetails] = useState(false)

  // 1. FETCH DATA DARI API
  useEffect(() => {
    const fetchWilayah = async () => {
      try {
        const res = await fetch('/api/wilayah')
        if (res.ok) {
          const data = await res.json()
          setWilayahData(data)
        }
      } catch (error) {
        console.error("Gagal mengambil data wilayah:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchWilayah()
  }, [])

  // 2. GENERATE DAFTAR KECAMATAN DARI DATA DB
  const districts = useMemo(() => {
    const uniqueDistricts = Array.from(new Set(wilayahData.map(w => w.kecamatan)))
    return uniqueDistricts.sort()
  }, [wilayahData])

  // 3. GENERATE DAFTAR DESA BERDASARKAN KECAMATAN YANG DIPILIH
  const villages = useMemo(() => {
    return wilayahData
      .filter(w => w.kecamatan === selectedDistrict)
      .map(w => w.desa)
      .sort()
  }, [selectedDistrict, wilayahData])

  // 4. AMBIL DETAIL DATA WILAYAH YANG DIPILIH
  const selectedData = useMemo(() => {
    const found = wilayahData.find(
      w => w.kecamatan === selectedDistrict && w.desa === selectedVillage
    )
    if (!found) return null

    // Parse string JSON dari database menjadi array
    return {
      ...found,
      usahaSesuaiParsed: JSON.parse(found.usahaSesuai || '[]'),
      perluKajianParsed: JSON.parse(found.perluKajian || '[]')
    }
  }, [selectedDistrict, selectedVillage, wilayahData])

  const handleMapSelect = useCallback((districtVillage: string) => {
    const [district, village] = districtVillage.split("-")
    setSelectedDistrict(district)
    setSelectedVillage(village)
    setShowDetails(true)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Sinkronisasi Peta Wilayah...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 font-poppins text-slate-900 pb-24 text-left">

      {/* HEADER SECTION */}
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

      {/* BODY CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* PANEL KIRI */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <Card className="p-8 rounded-2xl border-none shadow-xl bg-white overflow-visible">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                  <h3 className="font-black text-slate-900 uppercase tracking-wider text-lg">Pilih Lokasi</h3>
                </div>

                <div className="space-y-6">
                  {/* Dropdown Kecamatan */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Kecamatan</label>
                    <Select value={selectedDistrict} onValueChange={(val) => { setSelectedDistrict(val); setSelectedVillage(""); }}>
                      {/* TAMBAHKAN w-full DI SINI */}
                      <SelectTrigger className="w-full rounded-xl border-slate-200 h-14 font-bold focus:ring-blue-500 text-base">
                        <SelectValue placeholder="Pilih kecamatan..." />
                      </SelectTrigger>
                      <SelectContent className="z-[10001]">
                        {districts.map((d) => (
                          <SelectItem key={d} value={d} className="font-medium py-3 text-base">{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dropdown Desa */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Desa / Kelurahan</label>
                    <Select value={selectedVillage} onValueChange={setSelectedVillage} disabled={!selectedDistrict}>
                      {/* TAMBAHKAN w-full DI SINI */}
                      <SelectTrigger className="w-full rounded-xl border-slate-200 h-14 font-bold focus:ring-blue-500 text-base">
                        <SelectValue placeholder="Pilih desa..." />
                      </SelectTrigger>
                      <SelectContent className="z-[10001]">
                        {villages.map((v: string) => (
                          <SelectItem key={v} value={v} className="font-medium py-3 text-base">{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <button
                    onClick={() => selectedVillage && setShowDetails(true)}
                    disabled={!selectedVillage}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl h-16 font-black shadow-lg shadow-blue-200 transition-all active:scale-95 uppercase tracking-widest text-sm mt-4 flex items-center justify-center gap-2"
                  >
                    Mulai Analisis <ChevronRight className="w-5 h-5" />
                  </button>
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

          {/* PANEL KANAN */}
          <div className="lg:col-span-8 space-y-10">
            <Card className="rounded-2xl border-none shadow-2xl overflow-hidden bg-white relative z-0">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl">Peta Lokasi Indikatif</h3>
                <span className="flex items-center gap-2 text-xs font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full uppercase">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div> Live Database
                </span>
              </div>

              <div className="p-4 px-7 bg-white">
                <div className="h-[500px] relative z-0 rounded-xl overflow-hidden border border-slate-100">
                  <LeafletMapUpdated
                    onSelectRegion={handleMapSelect}
                    selectedDistrict={selectedDistrict}
                    selectedVillage={selectedVillage}
                  />
                </div>
              </div>
            </Card>

            {/* HASIL ANALISIS DARI DATABASE */}
            {showDetails && selectedData ? (
              <Card className="rounded-2xl border-none shadow-2xl overflow-hidden bg-white animate-in fade-in slide-in-from-bottom-8 duration-500 p-0">
                <div className="bg-slate-900 p-10 text-white m-0 rounded-t-2xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <span className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">Wilayah Terpilih</span>
                      <h2 className="text-4xl font-black uppercase tracking-tighter mt-2 leading-none">{selectedData.desa}</h2>
                      <p className="font-bold text-slate-400 text-lg mt-2">Kecamatan {selectedData.kecamatan}</p>
                    </div>
                    <div className={`px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg ${selectedData.statusRdtr === "Tersedia" ? "bg-green-500 text-white" : "bg-amber-500 text-white"
                      }`}>
                      {selectedData.statusRdtr === "Tersedia" ? "✓ RDTR Tersedia" : "! RDTR Proses"}
                    </div>
                  </div>
                </div>

                <div className="p-10 space-y-12">
                  {/* Bagian Usaha Prioritas */}
                  <section>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 font-bold shadow-sm text-xl">✓</div>
                      <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Usaha Prioritas</h4>
                    </div>
                    <BusinessAccordion
                      items={selectedData.usahaSesuaiParsed.map((b: string) => ({
                        category: b,
                        description: "Sesuai dengan arahan tata ruang wilayah setempat.",
                      }))}
                      type="suitable"
                    />
                  </section>

                  {/* Bagian Perlu Kajian */}
                  {selectedData.perluKajianParsed.length > 0 && (
                    <section>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 font-bold shadow-sm text-xl">!</div>
                        <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Perlu Kajian Khusus</h4>
                      </div>
                      <BusinessAccordion
                        items={selectedData.perluKajianParsed.map((b: string) => ({
                          category: b,
                          description: "Pemanfaatan ruang diizinkan dengan syarat/kajian teknis.",
                        }))}
                        type="study"
                      />
                    </section>
                  )}

                  {/* Link Gambar RDTR jika ada */}
                  {selectedData.gambarRdtr && (
                    <a
                      href={selectedData.gambarRdtr}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border-2 border-slate-100 hover:border-blue-600 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="font-black text-slate-900 uppercase text-sm">Dokumen RDTR Resmi</p>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Klik untuk melihat detail peta digital</p>
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-blue-600" />
                    </a>
                  )}

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
                    <div className="flex gap-4">
                      <ShieldCheck className="w-8 h-8 text-amber-600 shrink-0" />
                      <div>
                        <h5 className="font-black text-amber-900 uppercase mb-2">Informasi Penting</h5>
                        <p className="text-sm text-amber-800 font-medium leading-relaxed italic">
                          {selectedData.catatanRisiko || "Data ini bersifat indikatif. Kepastian pemanfaatan ruang mengacu pada dokumen RDTR resmi Kabupaten Lombok Barat."}
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