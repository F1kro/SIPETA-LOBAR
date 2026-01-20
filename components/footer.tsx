"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function Footer() {
  const pathname = usePathname()

  // Sembunyikan footer jika berada di rute admin
  if (pathname.startsWith('/admin')) return null
  if (pathname.startsWith('/auth')) return null

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 font-poppins text-left">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-left">

          {/* Kolom 1: Brand & Deskripsi (Span 5) */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-4 justify-start">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 shrink-0">
                <MapPin className="text-white w-7 h-7" />
              </div>
              <div className="text-left">
                <h5 className="font-black text-slate-900 leading-none text-2xl tracking-tighter uppercase">
                  DPMPTSP
                </h5>
                <p className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mt-1">
                  Lombok Barat
                </p>
              </div>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed text-lg max-w-md">
              Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu berkomitmen memberikan kemudahan bagi para investor melalui data yang transparan dan akurat.
            </p>
          </div>

          {/* Kolom 2: Menu Navigasi (Span 3) */}
          <div className="md:col-span-3 text-left">
            <h6 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-8 border-l-4 border-blue-600 pl-4">
              Menu Utama
            </h6>
            <ul className="space-y-4 font-bold text-slate-500 text-base">
              <li>
                <Link href="/cek-wilayah" className="hover:text-blue-600 transition-all hover:pl-2 flex items-center gap-2 uppercase tracking-tight">
                  Cek Potensi Wilayah
                </Link>
              </li>
              <li>
                <Link href="/peta-usaha" className="hover:text-blue-600 transition-all hover:pl-2 flex items-center gap-2 uppercase tracking-tight">
                  Peta Lokasi Usaha
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-600 transition-all hover:pl-2 flex items-center gap-2 uppercase tracking-tight">
                  Tanya Jawab (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-blue-600 transition-all hover:pl-2 flex items-center gap-2 uppercase tracking-tight">
                  Tentang Sistem
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Layanan & Jam Operasional (Span 4) */}
          <div className="md:col-span-4 text-left">
            <h6 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-8 border-l-4 border-blue-600 pl-4">
              Informasi Kontak
            </h6>

            <div className="space-y-4">
              {/* BAGIAN ALAMAT - Style disamakan dengan Jam Pelayanan */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4 shadow-inner">
                <div className="flex items-start gap-4">
                  <MapPin className="text-blue-600 w-6 h-6 shrink-0 mt-1" />
                  <div>
                    <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Alamat Kantor</p>
                    <p className="text-base font-black text-slate-900 leading-snug mt-1 uppercase">
                      Jl. Raya Gerung Utama No. 42, <br />
                      Gerung, Kabupaten Lombok Barat, <br />
                      Nusa Tenggara Barat 83311
                    </p>
                  </div>
                </div>
                <div className="h-px bg-slate-200 w-full" />
                <p className="text-[11px] font-bold text-slate-400 italic leading-tight">
                  *Terletak di pusat pemerintahan Kabupaten Lombok Barat.
                </p>
              </div>

              {/* BAGIAN JAM PELAYANAN */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4 shadow-inner">
                <div className="flex items-center gap-4">
                  <Clock className="text-blue-600 w-6 h-6 shrink-0" />
                  <div>
                    <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Jam Pelayanan</p>
                    <p className="text-2xl font-black text-slate-900 leading-none mt-1">08:00 - 16:00</p>
                    <p className="text-slate-500 font-bold text-[11px] mt-1 uppercase tracking-tighter">Senin - Jumat</p>
                  </div>
                </div>
                <div className="h-px bg-slate-200 w-full" />
                <p className="text-[11px] font-bold text-slate-400 italic leading-tight">
                  *Waktu Indonesia Tengah (WITA). Kantor tutup pada hari Sabtu, Minggu, dan Libur Nasional.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Garis Pembatas */}
        <div className="h-px bg-slate-100 w-full mt-16 mb-10" />

        {/* Footer Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">
              © 2026 DPMPTSP KABUPATEN LOMBOK BARAT
            </p>
            <div className="flex gap-4 text-[10px] font-bold text-blue-600/50 uppercase tracking-widest">
              <span>Keamanan Data</span>
              <span>Syarat & Ketentuan</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}