"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { Info, X } from "lucide-react"

type MenuInfo = {
  title: string
  description: string
  steps: string[]
}

const DEFAULT_INFO: MenuInfo = {
  title: "Panduan Menu",
  description: "Halaman ini menyajikan informasi layanan investasi Lombok Barat.",
  steps: [
    "Baca informasi utama di halaman ini.",
    "Gunakan tombol atau filter yang tersedia.",
    "Lanjutkan ke menu lain sesuai kebutuhan Anda.",
  ],
}

const getMenuInfo = (pathname: string): MenuInfo => {
  if (pathname === "/") {
    return {
      title: "Beranda",
      description: "Halaman pengantar portal investasi dan layanan utama.",
      steps: [
        "Klik Cek Potensi untuk analisis wilayah.",
        "Klik Peta Usaha untuk melihat sebaran usaha aktual.",
        "Lanjutkan ke Konsultasi jika butuh pendampingan.",
      ],
    }
  }

  if (pathname.startsWith("/cek-wilayah")) {
    return {
      title: "Cek Wilayah",
      description: "Menu ini menampilkan analisis indikatif usaha per desa/kelurahan.",
      steps: [
        "Pilih kecamatan lalu desa/kelurahan.",
        "Klik Mulai Analisis atau klik area di peta.",
        "Baca status RDTR, usaha sesuai, dan catatan risiko.",
      ],
    }
  }

  if (pathname.startsWith("/peta-usaha")) {
    return {
      title: "Peta Usaha",
      description: "Menu ini menampilkan visualisasi usaha berbasis wilayah geolokasi.",
      steps: [
        "Gunakan filter sektor, kecamatan, dan desa.",
        "Klik Cari untuk menampilkan area aktif di peta.",
        "Klik titik/hasil wilayah untuk melihat detail usaha.",
      ],
    }
  }

  if (pathname.startsWith("/perizinan")) {
    return {
      title: "Info Perizinan",
      description: "Panduan alur, jenis izin, dan dokumen awal perizinan usaha.",
      steps: [
        "Pelajari jenis perizinan OSS/non-OSS.",
        "Cek daftar dokumen yang perlu disiapkan.",
        "Lanjutkan ke menu konsultasi untuk validasi rencana.",
      ],
    }
  }

  if (pathname.startsWith("/konsultasi") || pathname.startsWith("/hubungi-kami")) {
    return {
      title: "Konsultasi",
      description: "Layanan komunikasi langsung dengan tim DPMPTSP.",
      steps: [
        "Isi form kontak dengan data yang valid.",
        "Jelaskan rencana usaha dan lokasi target Anda.",
        "Tunggu respon tim untuk arahan teknis lanjutan.",
      ],
    }
  }

  if (pathname.startsWith("/faq")) {
    return {
      title: "FAQ",
      description: "Kumpulan pertanyaan umum seputar RDTR dan perizinan.",
      steps: [
        "Pilih pertanyaan yang relevan dengan kebutuhan Anda.",
        "Baca jawaban sebagai panduan awal.",
        "Jika belum cukup, lanjut ke menu konsultasi.",
      ],
    }
  }

  if (pathname.startsWith("/tentang")) {
    return {
      title: "Tentang",
      description: "Informasi latar belakang sistem, regulasi, dan profil pengembang.",
      steps: [
        "Baca tujuan dan manfaat portal.",
        "Pahami dasar regulasi yang dirujuk.",
        "Lihat profil pengembang dan informasi institusi.",
      ],
    }
  }

  return DEFAULT_INFO
}

const getSeenScope = (pathname: string) => {
  if (pathname.startsWith("/peta-usaha")) return "/peta-usaha"
  if (pathname.startsWith("/cek-wilayah")) return "/cek-wilayah"
  if (pathname.startsWith("/perizinan")) return "/perizinan"
  if (pathname.startsWith("/konsultasi") || pathname.startsWith("/hubungi-kami")) return "/konsultasi"
  if (pathname.startsWith("/faq")) return "/faq"
  if (pathname.startsWith("/tentang")) return "/tentang"
  if (pathname === "/") return "/"
  return pathname
}

export function FloatingMenuInfo() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const info = useMemo(() => getMenuInfo(pathname), [pathname])
  const seenScope = useMemo(() => getSeenScope(pathname), [pathname])
  const seenKey = useMemo(() => `menu_info_seen:${seenScope}`, [seenScope])

  useEffect(() => {
    try {
      const seen = window.localStorage.getItem(seenKey)
      const hasLegacyPetaUsahaSeen =
        seenScope === "/peta-usaha" &&
        Object.keys(window.localStorage).some((key) => key.startsWith("menu_info_seen:/peta-usaha/"))

      if (!seen && hasLegacyPetaUsahaSeen) {
        window.localStorage.setItem(seenKey, "1")
        setOpen(false)
        return
      }

      if (!seen) {
        setOpen(true)
        window.localStorage.setItem(seenKey, "1")
      } else {
        setOpen(false)
      }
    } catch {
      setOpen(false)
    }
  }, [seenKey, seenScope])

  return (
    <>
      {open && (
        <button
          aria-label="Tutup informasi menu"
          className="fixed inset-0 bg-slate-900/40 z-[1200]"
          onClick={() => setOpen(false)}
        />
      )}

      {open && (
        <div className="fixed bottom-24 right-5 z-[1201] w-[min(92vw,380px)] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
            <div className="px-4 py-3 bg-blue-600 text-white flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Informasi Menu</p>
                <h3 className="text-base font-black tracking-tight">{info.title}</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center"
                aria-label="Tutup"
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-4 py-4 space-y-4">
              <p className="text-sm text-slate-600 font-semibold leading-relaxed">{info.description}</p>
              <div className="space-y-2">
                {info.steps.map((step, idx) => (
                  <div key={`${step}-${idx}`} className="flex items-start gap-3">
                    <div className="w-6 h-6 mt-0.5 rounded-md bg-blue-50 text-blue-600 text-[11px] font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-700 font-semibold leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
      )}

      <div className="fixed bottom-5 right-5 z-[1202]">
        <button
            onClick={() => setOpen((prev) => !prev)}
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-300 flex items-center justify-center"
            aria-label="Buka informasi menu"
            title="Info menu"
          >
            <Info size={22} />
          </button>
      </div>
    </>
  )
}
