'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { MapPin, Search, Landmark, Home, X } from 'lucide-react'

const BusinessMap = dynamic(() => import('@/components/public/business-map'), {
  ssr: false,
  loading: () => <div className="h-[520px] md:h-[650px] w-full bg-gray-100 animate-pulse rounded-2xl" />,
})

const formatRupiah = (angka: any) => {
  if (!angka) return '0'
  const val = typeof angka === 'string' ? angka.replace(/[^0-9]/g, '') : angka
  return new Intl.NumberFormat('id-ID').format(val)
}

const toRegionKey = (kecamatan?: string, desa?: string) =>
  `${(kecamatan || '').trim()}::${(desa || '').trim()}`

const parseRegionKey = (regionKey: string) => {
  const [kecamatan, desa] = regionKey.split('::')
  return {
    kecamatan: kecamatan || 'Semua',
    desa: desa || 'Semua',
  }
}

interface WilayahItem {
  id: string
  kecamatan: string
  desa: string
}

export default function PetaUsahaPage() {
  const router = useRouter()
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [searching, setSearching] = useState(false)
  const [usahas, setUsahas] = useState<any[]>([])
  const [wilayahs, setWilayahs] = useState<WilayahItem[]>([])
  const [sectors, setSectors] = useState<string[]>([])

  const [filterSektor, setFilterSektor] = useState('Semua')
  const [filterKecamatan, setFilterKecamatan] = useState('Semua')
  const [filterDesa, setFilterDesa] = useState('Semua')

  const [tempSektor, setTempSektor] = useState('Semua')
  const [tempKecamatan, setTempKecamatan] = useState('Semua')
  const [tempDesa, setTempDesa] = useState('Semua')

  const [selectedRegionKey, setSelectedRegionKey] = useState<string>('')

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [wilayahRes, metaRes] = await Promise.all([fetch('/api/wilayah'), fetch('/api/usaha/meta')])
        const wilayahData = await wilayahRes.json()
        const metaData = await metaRes.json()
        setWilayahs(Array.isArray(wilayahData) ? wilayahData : [])
        setSectors(Array.isArray(metaData?.sectors) ? metaData.sectors : [])
      } catch (e) {
        console.error('Failed loading meta:', e)
      } finally {
        setLoadingMeta(false)
      }
    }

    loadMeta()
  }, [])

  const daftarKecamatan = useMemo(() => {
    return ['Semua', ...new Set(wilayahs.map((w) => w.kecamatan).filter(Boolean))]
  }, [wilayahs])

  const daftarSektor = useMemo(() => {
    return ['Semua', ...sectors]
  }, [sectors])

  const daftarDesa = useMemo(() => {
    const source = tempKecamatan === 'Semua' ? wilayahs : wilayahs.filter((w) => w.kecamatan === tempKecamatan)
    return ['Semua', ...new Set(source.map((w) => w.desa).filter(Boolean))]
  }, [wilayahs, tempKecamatan])

  const hasLocationFilter = useMemo(() => {
    return filterKecamatan !== 'Semua' || filterDesa !== 'Semua' || selectedRegionKey !== ''
  }, [filterKecamatan, filterDesa, selectedRegionKey])

  const fetchUsahaFiltered = async (kecamatan: string, desa: string, sektor: string) => {
    const params = new URLSearchParams()
    if (sektor !== 'Semua') params.set('sektor', sektor)
    if (kecamatan !== 'Semua') params.set('kecamatan', kecamatan)
    if (desa !== 'Semua') params.set('desa', desa)

    const res = await fetch(`/api/usaha?${params.toString()}`)
    const data = await res.json()
    setUsahas(Array.isArray(data) ? data : [])
  }

  const handleSearch = async () => {
    setSearching(true)
    try {
      setFilterSektor(tempSektor)
      setFilterKecamatan(tempKecamatan)
      setFilterDesa(tempDesa)

      if (tempKecamatan !== 'Semua' && tempDesa !== 'Semua') {
        setSelectedRegionKey(toRegionKey(tempKecamatan, tempDesa))
      } else {
        setSelectedRegionKey('')
      }

      if (tempKecamatan === 'Semua' && tempDesa === 'Semua') {
        setUsahas([])
      } else {
        await fetchUsahaFiltered(tempKecamatan, tempDesa, tempSektor)
      }
    } catch (error) {
      console.error('Search error:', error)
      setUsahas([])
    } finally {
      setSearching(false)
    }
  }

  const handleKecamatanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setTempKecamatan(value)
    setTempDesa('Semua')
  }

  const handleReset = () => {
    setTempSektor('Semua')
    setTempKecamatan('Semua')
    setTempDesa('Semua')
    setFilterSektor('Semua')
    setFilterKecamatan('Semua')
    setFilterDesa('Semua')
    setSelectedRegionKey('')
    setUsahas([])
  }

  const handleSelectRegionFromMap = async (regionKey: string) => {
    const parsed = parseRegionKey(regionKey)
    setSelectedRegionKey(regionKey)
    setTempKecamatan(parsed.kecamatan)
    setTempDesa(parsed.desa)
    setFilterKecamatan(parsed.kecamatan)
    setFilterDesa(parsed.desa)

    setSearching(true)
    try {
      await fetchUsahaFiltered(parsed.kecamatan, parsed.desa, tempSektor)
    } finally {
      setSearching(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 font-poppins text-gray-800">
      <section className="w-full border-b bg-gray-100 px-3 md:px-6 py-4 md:py-6">
        <div className="max-w-7xl mx-auto relative">
          <div className="relative h-[520px] md:h-[650px] w-full rounded-2xl md:rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm">
            <BusinessMap
              businesses={usahas}
              selectedRegionKey={selectedRegionKey}
              activeDistrict={filterKecamatan}
              activeVillage={filterDesa}
              onSelectRegion={handleSelectRegionFromMap}
            />

            {hasLocationFilter && (
              <div className="absolute top-3 right-3 left-3 md:left-auto md:w-[430px] z-[1000]">
                <div className="bg-white/97 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl overflow-hidden max-h-[58vh] flex flex-col">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Daftar Usaha Terfilter</p>
                      <p className="text-sm font-black text-slate-900">{usahas.length} usaha ditemukan</p>
                    </div>
                    <button
                      onClick={handleReset}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
                      title="Tutup hasil"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="overflow-y-auto p-3 space-y-2">
                    {usahas.length === 0 ? (
                      <div className="text-xs text-slate-500 font-bold p-4 text-center">Tidak ada usaha di wilayah filter ini.</div>
                    ) : (
                      usahas.slice(0, 40).map((u) => (
                        <button
                          key={u.id}
                          onClick={() => router.push(`/peta-usaha/${u.id}`)}
                          className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                        >
                          <div className="text-[10px] font-black uppercase tracking-wider text-blue-600 mb-1">{u.sektor}</div>
                          <div className="text-sm font-black text-slate-900 line-clamp-2 leading-tight">{u.nama}</div>
                          <div className="text-[11px] text-slate-500 mt-1">{u.desa}, {u.kecamatan}</div>
                          <div className="text-[11px] font-black text-emerald-700 mt-1">Rp {formatRupiah(u.investasi)}</div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 md:mt-5 bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-3 w-full md:border-r border-gray-100 md:pr-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl text-blue-600 shrink-0 flex items-center justify-center">
                <Search size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Sektor</p>
                <select
                  className="w-full outline-none text-sm font-bold text-gray-800 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg border border-transparent focus:border-blue-200 focus:bg-white appearance-none"
                  value={tempSektor}
                  onChange={(e) => setTempSektor(e.target.value)}
                >
                  {daftarSektor.map((s) => (
                    <option key={s} value={s}>{s === 'Semua' ? 'Semua Sektor' : s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:border-r border-gray-100 md:pr-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl text-blue-600 shrink-0 flex items-center justify-center">
                <Landmark size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Kecamatan</p>
                <select
                  className="w-full outline-none text-sm font-bold text-gray-800 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg border border-transparent focus:border-blue-200 focus:bg-white appearance-none"
                  value={tempKecamatan}
                  onChange={handleKecamatanChange}
                >
                  {daftarKecamatan.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 bg-blue-50 rounded-xl text-blue-600 shrink-0 flex items-center justify-center">
                <Home size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Desa / Kelurahan</p>
                <select
                  className="w-full outline-none text-sm font-bold text-gray-800 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg border border-transparent focus:border-blue-200 focus:bg-white appearance-none"
                  value={tempDesa}
                  onChange={(e) => setTempDesa(e.target.value)}
                >
                  {daftarDesa.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={handleReset}
                className="bg-gray-200 text-gray-700 px-4 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest flex-1 hover:bg-gray-300"
              >
                Reset
              </button>
              <button
                onClick={handleSearch}
                disabled={searching || loadingMeta}
                className={`bg-blue-600 text-white px-6 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest flex-1 shadow-md hover:bg-blue-700 ${(searching || loadingMeta) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {searching ? 'Memuat...' : 'Cari'}
              </button>
            </div>
          </div>

          <div className="mt-2 text-center text-xs md:text-sm text-gray-600 bg-white/90 rounded-lg p-2 border border-slate-100">
            Filter aktif: <span className="font-bold">{filterSektor === 'Semua' ? 'Semua Sektor' : filterSektor}</span> -
            <span className="font-bold ml-1">{filterKecamatan === 'Semua' ? 'Semua Kecamatan' : filterKecamatan}</span> -
            <span className="font-bold ml-1">{filterDesa === 'Semua' ? 'Semua Desa/Kelurahan' : filterDesa}</span>
            {loadingMeta && <span className="ml-2 text-blue-600">Memuat metadata...</span>}
          </div>
        </div>
      </section>

      {!hasLocationFilter && (
        <section className="max-w-6xl mx-auto px-4 py-10 text-center">
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8">
            <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-bold">Pilih kecamatan/desa atau klik wilayah di peta untuk menampilkan daftar usaha.</p>
          </div>
        </section>
      )}
    </main>
  )
}
