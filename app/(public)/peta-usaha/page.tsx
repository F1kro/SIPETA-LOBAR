'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import {
  MapPin,
  Search,
  Coins,
  Landmark,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const BusinessMap = dynamic(() => import('@/components/public/business-map'), {
  ssr: false,
  loading: () => <div className="h-[650px] w-full bg-gray-100 animate-pulse" />
})

const formatRupiah = (angka: any) => {
  if (!angka) return "0";
  const val = typeof angka === 'string' ? angka.replace(/[^0-9]/g, '') : angka;
  return new Intl.NumberFormat('id-ID').format(val);
}

export default function PetaUsahaPage() {
  const router = useRouter()
  const [usahas, setUsahas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)

  // State untuk filter aktif (digunakan untuk filtering dan map)
  const [filterSektor, setFilterSektor] = useState('Pariwisata')
  const [filterKecamatan, setFilterKecamatan] = useState('Semua')

  // State sementara untuk dropdown UI (belum diproses)
  const [tempSektor, setTempSektor] = useState('Pariwisata')
  const [tempKecamatan, setTempKecamatan] = useState('Semua')

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)

  // Deteksi Screen Size untuk Pagination
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 3 : 6)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    fetchUsahas()
  }, [])

  const fetchUsahas = async () => {
    try {
      const res = await fetch('/api/usaha')
      const data = await res.json()
      setUsahas(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const daftarKecamatan = useMemo(() => {
    return ['Semua', ...new Set(usahas.map(u => u.kecamatan))]
  }, [usahas])

  // ✅ OPTIMALISASI: Filter hanya jalan saat filterSektor/filterKecamatan berubah (Klik Cari)
  const filteredUsahas = useMemo(() => {
    console.log('Filtering data dengan:', { filterSektor, filterKecamatan })
    return usahas.filter(u => {
      const matchSektor = u.sektor === filterSektor || filterSektor === 'Semua'
      const matchKecamatan = u.kecamatan === filterKecamatan || filterKecamatan === 'Semua'
      return matchSektor && matchKecamatan
    })
  }, [usahas, filterSektor, filterKecamatan])

  // ✅ OPTIMALISASI: Slicing data halaman juga di-memoize
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return filteredUsahas.slice(indexOfFirstItem, indexOfLastItem)
  }, [filteredUsahas, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredUsahas.length / itemsPerPage)

  // Fungsi Trigger Pencarian
  const handleSearch = useCallback(() => {
    setSearching(true)

    // Gunakan setTimeout untuk memberi feedback visual (bisa dihapus jika tidak perlu)
    setTimeout(() => {
      setFilterSektor(tempSektor)
      setFilterKecamatan(tempKecamatan)
      setCurrentPage(1) // Reset ke halaman 1
      setSearching(false)
    }, 100)
  }, [tempSektor, tempKecamatan])

  // Handler untuk dropdown yang ringan (hanya update state lokal)
  const handleSektorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTempSektor(e.target.value)
  }

  const handleKecamatanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTempKecamatan(e.target.value)
  }

  // Handler untuk Enter key di dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  // Reset ke filter awal
  const handleReset = () => {
    setTempSektor('Pariwisata')
    setTempKecamatan('Semua')
    setFilterSektor('Pariwisata')
    setFilterKecamatan('Semua')
    setCurrentPage(1)
  }

  return (
    <main className="min-h-screen bg-gray-50 font-poppins text-gray-800">

      {/* SECTION 1: MAP */}
      <section className="relative h-[650px] w-full border-b bg-gray-200">
        <BusinessMap
          businesses={filteredUsahas}
          onShowDetail={(id: string) => router.push(`/peta-usaha/${id}`)}
        />

        {/* Floating Filter Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-5xl px-4">
          <div className="bg-white p-3 md:p-4 rounded-3xl shadow-xl border border-gray-100 flex flex-col md:flex-row items-center gap-3">

            {/* Filter Sektor */}
            <div className="flex items-center gap-3 flex-1 w-full md:border-r border-gray-100 md:pr-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl text-blue-600 shrink-0 flex items-center justify-center">
                <Search size={20} />
              </div>
              <div className="flex-1 flex flex-col justify-center min-h-[40px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Sektor</p>
                <div className="relative">
                  <select
                    className="w-full outline-none text-sm font-bold text-gray-800 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-lg border border-transparent focus:border-blue-200 focus:bg-white appearance-none transition-none"
                    value={tempSektor}
                    onChange={handleSektorChange}
                    onKeyDown={handleKeyDown}
                  >
                    <option value="Semua">Semua Sektor</option>
                    <option value="Pariwisata">Pariwisata</option>
                    <option value="Pertanian">Pertanian</option>
                    <option value="Industri">Industri</option>
                    <option value="Perdagangan">Perdagangan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filter Kecamatan */}
            <div className="flex items-center gap-3 flex-1 w-full md:pl-2">
              <div className="w-10 h-10 bg-blue-50 rounded-xl text-blue-600 shrink-0 flex items-center justify-center">
                <Landmark size={20} />
              </div>
              <div className="flex-1 flex flex-col justify-center min-h-[40px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Kecamatan</p>
                <div className="relative">
                  <select
                    className="w-full outline-none text-sm font-bold text-gray-800 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-lg border border-transparent focus:border-blue-200 focus:bg-white appearance-none transition-none"
                    value={tempKecamatan}
                    onChange={handleKecamatanChange}
                    onKeyDown={handleKeyDown}
                  >
                    {daftarKecamatan.map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={handleReset}
                className="bg-gray-200 text-gray-700 px-4 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest flex-1 md:flex-none flex items-center justify-center gap-2 hover:bg-gray-300 active:scale-95 transition-all"
              >
                Reset
              </button>
              <button
                onClick={handleSearch}
                disabled={searching}
                className={`bg-blue-600 text-white px-6 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest flex-1 md:flex-none flex items-center justify-center gap-2 shadow-md hover:bg-blue-700 active:scale-95 transition-all ${searching ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {searching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    MEMUAT...
                  </>
                ) : (
                  'CARI'
                )}
              </button>
            </div>
          </div>

          {/* Info Filter Aktif */}
          <div className="mt-2 text-center text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg p-2">
            Filter aktif: <span className="font-bold">{filterSektor === 'Semua' ? 'Semua Sektor' : filterSektor}</span> •
            <span className="font-bold ml-1">{filterKecamatan === 'Semua' ? 'Semua Kecamatan' : filterKecamatan}</span>
            {searching && (
              <span className="ml-2 text-blue-600 animate-pulse">Memperbarui peta...</span>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: GRID DAFTAR USAHA */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter border-l-8 border-blue-600 pl-5 mb-4 md:mb-0">
            Potensi Investasi
          </h2>

          <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
            Menampilkan <span className="font-bold text-blue-600">{filteredUsahas.length}</span> dari <span className="font-bold">{usahas.length}</span> usaha
            {filterSektor !== 'Semua' && (
              <span className="ml-2">• Sektor: <span className="font-bold">{filterSektor}</span></span>
            )}
            {filterKecamatan !== 'Semua' && (
              <span className="ml-2">• Wilayah: <span className="font-bold">{filterKecamatan}</span></span>
            )}
          </div>
        </div>

        {filteredUsahas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border">
            <div className="text-gray-400 mb-4">Tidak ada usaha yang ditemukan dengan filter saat ini</div>
            <button
              onClick={handleReset}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {currentItems.map(u => (
                /* PERBAIKAN: Tambahkan p-0 dan pastikan overflow-hidden benar-benar memotong gambar */
                <Card key={u.id} className="group overflow-hidden rounded-[2.1rem] p-0 border-none shadow-md hover:shadow-2xl transition-all duration-500 bg-white">

                  {/* Kontainer Gambar - Pastikan h-64 dan p-0 */}
                  <div className="relative h-64 w-full overflow-hidden p-0 m-0">
                    <img
                      src={u.gambar || "/placeholder.jpg"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 block"
                      alt={u.nama}
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-blue-600 text-[12px] text-white font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-lg">
                      {u.sektor}
                    </div>
                  </div>

                  {/* Konten Teks tetap menggunakan padding p-7 */}
                  <div className="p-7 space-y-5">
                    <h3 className="font-bold text-gray-900 text-xl h-14 line-clamp-2 uppercase leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
                      {u.nama}
                    </h3>
                    <div className="flex items-start gap-2 text-base text-gray-600">
                      <MapPin size={20} className="text-red-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{u.desa}, {u.kecamatan}</span>
                    </div>

                    <div className="pt-5 border-t flex justify-between items-center">
                      <div className="flex items-center gap-2 text-base font-black text-gray-800">
                        <Coins size={20} className="text-amber-500" /> Rp {formatRupiah(u.investasi)}
                      </div>
                      <button
                        onClick={() => router.push(`/peta-usaha/${u.id}`)}
                        className="text-sm font-black text-blue-600 hover:text-blue-800 transition-all uppercase tracking-widest"
                      >
                        Detail
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-16 flex flex-col items-center gap-8">
                <div className="text-sm text-gray-600">
                  Halaman {currentPage} dari {totalPages} •
                  <span className="font-bold ml-1">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredUsahas.length)}</span> dari {filteredUsahas.length} usaha
                </div>

                <div className="flex items-center justify-center gap-2 md:gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-10 h-10 md:w-12 md:h-12 border-2"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </Button>

                  <div className="flex items-center gap-1 md:gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full font-bold border-2 transition-none ${currentPage === page ? 'bg-blue-600 border-blue-600' : ''
                          }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-10 h-10 md:w-12 md:h-12 border-2"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}