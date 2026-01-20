'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    ArrowLeft,
    MapPin,
    Coins,
    Phone,
    MessageCircle,
    Calendar,
    ChevronRight
} from 'lucide-react'
import { Card } from '@/components/ui/card'

const SECTOR_ICONS: { [key: string]: string } = {
    'Pariwisata': '🌴',
    'Pertanian': '🌾',
    'Perikanan': '🐟',
    'Perdagangan': '🏪',
    'Industri': '🏭',
    'Jasa': '💼',
    'Lainnya': '📍',
};

const getSectorIcon = (sektor: string): string => {
    return SECTOR_ICONS[sektor] || SECTOR_ICONS['Lainnya'];
};

export default function DetailUsahaPage() {
    const { id } = useParams()
    const router = useRouter()
    const [usaha, setUsaha] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Fungsi Helper untuk format Rupiah
    const formatRupiah = (angka: any) => {
        if (!angka) return "0";
        const val = typeof angka === 'string' ? angka.replace(/[^0-9]/g, '') : angka;
        return new Intl.NumberFormat('id-ID').format(val);
    }

    useEffect(() => {
        fetch('/api/usaha')
            .then(res => res.json())
            .then(data => {
                const found = data.find((u: any) => u.id === id)
                setUsaha(found)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [id])

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white font-poppins">
            <div className="animate-pulse text-blue-600 font-black tracking-widest uppercase">MEMUAT DETAIL USAHA...</div>
        </div>
    )

    if (!usaha) return (
        <div className="h-screen flex items-center justify-center bg-white font-poppins text-center px-4">
            <div>
                <p className="text-gray-500 font-bold mb-4 uppercase tracking-tight">Waduh, data usaha tidak ditemukan.</p>
                <button onClick={() => router.push('/peta-usaha')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-200">Kembali ke Peta</button>
            </div>
        </div>
    )

    return (
        <main className="min-h-screen bg-slate-50 font-poppins text-slate-900 pb-20 text-left">
            
            {/* 1. TOP NAVIGATION - Sinkron Lebar dengan Navbar */}
            <nav className="bg-white border-b sticky top-0 z-[100]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => router.push('/peta-usaha')}
                        className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-black text-[10px] md:text-xs uppercase tracking-[0.2em]"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Kembali Ke Peta
                    </button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

                {/* 2. HERO IMAGE SECTION */}
                <section className="relative w-full h-[250px] md:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl mb-8 md:mb-12 border-none">
                    <img
                        src={usaha.gambar || "/placeholder.jpg"}
                        className="w-full h-full object-cover"
                        alt={usaha.nama}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 right-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-xl">
                                {usaha.sektor}
                            </span>
                            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest border border-white/10">
                                {usaha.tahunBerdiri || 'Baru'}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-6xl font-black text-white uppercase leading-none tracking-tighter">
                            {usaha.nama}
                        </h1>
                    </div>
                </section>

                {/* 3. INFO HIGHLIGHTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 md:mb-12">

                    {/* Card Investasi */}
                    <Card className="flex items-center bg-white p-6 md:p-10 rounded-2xl border-none shadow-xl gap-6 hover:scale-[1.01] transition-transform">
                        <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
                            <Coins size={32} className="md:w-10 md:h-10" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] md:text-xs text-amber-600 font-black uppercase tracking-widest mb-1">
                                Nilai Investasi
                            </p>
                            <p className="text-xl md:text-4xl font-black text-slate-900 truncate tracking-tight">
                                <span className="text-sm md:text-lg mr-1 text-slate-400 font-bold tracking-normal">Rp</span>
                                {formatRupiah(usaha.investasi)}
                            </p>
                        </div>
                    </Card>

                    {/* Card Lokasi */}
                    <Card className="flex items-center bg-white p-6 md:p-10 rounded-2xl border-none shadow-xl gap-6 hover:scale-[1.01] transition-transform">
                        <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <MapPin size={32} className="md:w-10 md:h-10" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] md:text-xs text-blue-600 font-black uppercase tracking-widest mb-1">
                                Lokasi Wilayah
                            </p>
                            <p className="text-lg md:text-2xl font-black text-slate-900 leading-tight uppercase truncate tracking-tight">
                                {usaha.desa}, {usaha.kecamatan}
                            </p>
                        </div>
                    </Card>
                </div>

                {/* 4. DESKRIPSI (BLOG STYLE) */}
                <Card className="bg-white rounded-2xl md:rounded-3xl p-8 md:p-16 shadow-xl border-none mb-8 md:mb-12">
                    <div className="flex items-center gap-4 mb-10 border-l-8 border-blue-600 pl-6">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl md:text-4xl shadow-inner border border-blue-100">
                            {getSectorIcon(usaha.sektor)}
                        </div>
                        <h3 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">
                            Tentang Potensi Usaha
                        </h3>
                    </div>

                    <div className="text-slate-600 text-base md:text-xl leading-relaxed md:leading-[1.8] text-justify font-medium">
                        {usaha.deskripsi || "Informasi detail mengenai potensi usaha ini sedang dalam tahap verifikasi lebih lanjut untuk memastikan keakuratan data investasi wilayah Kabupaten Lombok Barat."}
                    </div>

                    {/* 5. KONTAK PERSON SECTION */}
                    <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-5 w-full md:w-auto">
                            <div className="p-4 md:p-6 bg-slate-100 rounded-2xl text-slate-400 group hover:bg-blue-600 hover:text-white transition-all">
                                <Phone size={28} className="md:w-8 md:h-8" />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1 text-left">Hubungi Pengelola</p>
                                <p className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter">{usaha.nomerTelp}</p>
                            </div>
                        </div>

                        {/* ACTION BUTTON */}
                        <a
                            href={`https://wa.me/${usaha.nomerTelp?.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            className="w-full md:w-auto bg-green-500 text-white px-8 md:px-12 py-5 md:py-6 rounded-2xl font-black text-xs md:text-sm hover:bg-green-600 transition-all shadow-2xl shadow-green-200 flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
                        >
                            <MessageCircle size={24} /> Hubungi via WhatsApp
                        </a>
                    </div>
                </Card>

                {/* Footer Informasi Tambahan */}
                <div className="text-center md:text-left px-4">
                    <p className="text-xs font-bold text-slate-400 italic">
                        * Data ini bersifat indikatif sebagai panduan awal investasi di Kabupaten Lombok Barat.
                    </p>
                </div>

            </div>
        </main>
    )
}