"use client"

import type React from "react"
import { useState, useRef } from "react" // Tambahkan useRef
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Clock, Send, CheckCircle2, Phone, MessageSquare, ArrowLeft } from "lucide-react"
import Link from "next/link"
import emailjs from "@emailjs/browser" // Import EmailJS

export default function HubungiKamiPage() {
  const formRef = useRef<HTMLFormElement>(null) // Ref untuk form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // INTEGRASI EMAILJS
    // Ganti 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', dan 'YOUR_PUBLIC_KEY' 
    // dengan ID yang Anda dapatkan setelah daftar di emailjs.com
    emailjs.sendForm(
      'service_j8zdoy4', 
      'template_ipjulsj', 
      formRef.current!, 
      '0PhlxMUbsa51aPZGu'
    )
    .then((result) => {
        console.log("Email berhasil dikirim!", result.text)
        setSubmitted(true)
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
        setLoading(false)
        setTimeout(() => setSubmitted(false), 8000)
    }, (error) => {
        console.log("Gagal mengirim email...", error.text)
        alert("Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi.")
        setLoading(false)
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 font-poppins text-slate-900 pb-20">
      
      {/* 1. HEADER SECTION - Tetap sama */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-[100] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                Hubungi Kami
              </h1>
              <p className="text-sm md:text-base text-slate-500 font-bold uppercase tracking-widest mt-2 text-left">
                Layanan Aduan & Konsultasi Investasi
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* 2. TOP CONTACT CARDS - Tetap sama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: MapPin,
              title: "Lokasi Kantor",
              items: ["Jl. Raya Gerung No. 42", "Lombok Barat, NTB 83353"],
              color: "bg-blue-600"
            },
            {
              icon: Clock,
              title: "Jam Operasional",
              items: ["Senin - Jumat", "08:00 - 16:00 WITA"],
              color: "bg-slate-900"
            },
            {
              icon: MessageSquare,
              title: "Email Resmi",
              items: ["dpmptsp@gmail.com", "Respon: 1-2 Hari Kerja"],
              color: "bg-blue-500"
            },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <Card key={idx} className="border-none shadow-xl p-8 rounded-2xl bg-white group hover:scale-[1.02] transition-transform">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-black text-slate-900 uppercase tracking-tight mb-3">{item.title}</h3>
                  <div className="space-y-1 text-left w-full flex flex-col items-center">
                    {item.items.map((line, i) => (
                      <p key={i} className="text-sm text-slate-500 font-bold uppercase text-center leading-tight">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          {/* 3. FORM SECTION */}
          <div className="lg:col-span-3">
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-8 border-l-8 border-blue-600 pl-6">
                  Kirim Pesan Digital
                </h2>

                {submitted ? (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-10 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-blue-900 uppercase tracking-tight mb-2">Pesan Terkirim!</h3>
                    <p className="text-blue-700 font-medium">
                      Terima kasih. Pesan Anda telah dikirim ke email dpmptsp@gmail.com. Tim kami akan segera meninjau permohonan Anda.
                    </p>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                      <input
                        type="text"
                        name="name" // Pastikan name atribut sesuai dengan template EmailJS
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-bold focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                        placeholder="NAMA SESUAI KTP/PERUSAHAAN"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Aktif</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-bold focus:border-blue-600 focus:bg-white outline-none transition-all"
                          placeholder="EMAIL@KANTOR.COM"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">No. Telepon</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-bold focus:border-blue-600 focus:bg-white outline-none transition-all"
                          placeholder="0812-XXXX-XXXX"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subjek Informasi</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-bold focus:border-blue-600 focus:bg-white outline-none transition-all appearance-none"
                      >
                        <option value="">PILIH TOPIK KONSULTASI</option>
                        <option value="Informasi Perizinan">INFORMASI PERIZINAN</option>
                        <option value="Cek Kelayakan Wilayah">CEK KELAYAKAN WILAYAH</option>
                        <option value="Konsultasi Investasi">KONSULTASI INVESTASI</option>
                        <option value="Lainnya">LAINNYA</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Detail Pesan</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-bold focus:border-blue-600 focus:bg-white outline-none transition-all resize-none"
                        placeholder="JELASKAN KEBUTUHAN ANDA SECARA DETAIL..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-slate-900 text-white h-16 rounded-2xl font-black uppercase tracking-widest text-base shadow-xl shadow-blue-200 transition-all flex gap-3"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Kirim Pesan Sekarang <Send size={20} />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </Card>
          </div>

          {/* 4. SIDEBAR INFO - Tetap sama */}
          <div className="lg:col-span-2 space-y-6">
             {/* ... (Konten Sidebar tetap sama seperti kode awal Anda) ... */}
             <Card className="border-none shadow-xl p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />
                <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                   <CheckCircle2 className="text-blue-500" /> Kami Membantu:
                </h3>
                <ul className="space-y-4">
                  {["KLASIFIKASI IZIN BERUSAHA", "KONFIRMASI RDTR WILAYAH", "PANDUAN PROSES PERIZINAN", "DOKUMEN PERSYARATAN INVESTASI", "SARAN & KRITIK LAYANAN"].map((item, idx) => (
                    <li key={idx} className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      <span className="text-xs font-black tracking-widest">{item}</span>
                    </li>
                  ))}
                </ul>
            </Card>
            {/* ... dst */}
          </div>
        </div>
      </div>
    </main>
  )
}