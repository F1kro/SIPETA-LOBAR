"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Clock } from "lucide-react"
import Link from "next/link"

export default function HubungiKamiPage() {
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate sending email (dalam praktik, ini akan call API endpoint)
    setTimeout(() => {
      console.log("Form submitted:", formData)
      setSubmitted(true)
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      setLoading(false)

      // Reset after 3 seconds
      setTimeout(() => setSubmitted(false), 3000)
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Hubungi Kami</h1>
          </div>
          <p className="text-muted-foreground ml-13">Kami siap membantu menjawab pertanyaan dan kebutuhan Anda</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Information */}
          {[
            {
              icon: MapPin,
              title: "Lokasi Kantor",
              items: ["Jl. Raya Gerung No. 42", "Kabupaten Lombok Barat", "Provinsi NTB 83353"],
            },
            {
              icon: Clock,
              title: "Jam Operasional",
              items: ["Senin - Jumat", "Pukul 08:00 - 16:00 WIT", "Istirahat: 12:00 - 13:00 WIT"],
            },
            {
              icon: Mail,
              title: "Email",
              items: [
                "info@dpmptsp.lombokbarat.go.id",
                "perizinan@dpmptsp.lombokbarat.go.id",
                "Respons dalam 1-2 hari kerja",
              ],
            },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <Card key={idx} className="border border-border p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">{item.title}</h3>
                    <div className="space-y-1">
                      {item.items.map((line, i) => (
                        <p key={i} className="text-sm text-muted-foreground">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="border border-border p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Kirim Pesan</h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Pesan Terkirim!</h3>
                <p className="text-green-800 mb-4">
                  Terima kasih telah menghubungi kami. Tim DPMPTSP akan merespons dalam 1-2 hari kerja.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Masukkan nama Anda"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Nomor Telepon (Opsional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+62 xxx xxxx xxxx"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subjek
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Pilih topik pertanyaan...</option>
                    <option value="Informasi Perizinan">Informasi Perizinan</option>
                    <option value="Cek Kelayakan Wilayah">Cek Kelayakan Wilayah</option>
                    <option value="Konsultasi Investasi">Konsultasi Investasi</option>
                    <option value="Pertanyaan Teknis">Pertanyaan Teknis</option>
                    <option value="Keluhan dan Saran">Keluhan dan Saran</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tuliskan pertanyaan atau pesan Anda di sini..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 h-11 font-semibold"
                >
                  {loading ? "Mengirim..." : "Kirim Pesan"}
                </Button>
              </form>
            )}
          </Card>

          {/* Info Section */}
          <div className="space-y-6">
            <Card className="border border-border p-6 bg-primary/5">
              <h3 className="text-lg font-semibold text-foreground mb-4">Bagaimana Kami Bisa Membantu?</h3>
              <ul className="space-y-3">
                {[
                  "Pertanyaan tentang jenis izin yang Anda butuhkan",
                  "Konfirmasi kelayakan lokasi investasi Anda",
                  "Panduan lengkap proses perizinan",
                  "Informasi dokumen yang diperlukan",
                  "Keluhan atau saran untuk layanan kami",
                  "Pertanyaan teknis tentang portal ini",
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-foreground">
                    <span className="text-primary font-bold flex-shrink-0">✓</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="border border-amber-200 bg-amber-50/50 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Catatan Penting</h3>
              <p className="text-sm text-foreground mb-3">
                Semua pertanyaan akan ditangani oleh tim profesional DPMPTSP Kabupaten Lombok Barat. Kami berkomitmen
                untuk memberikan respons yang cepat dan akurat.
              </p>
              <p className="text-sm text-foreground">
                Untuk urgensi tinggi, silakan hubungi kantor kami secara langsung pada jam kerja yang tertera di atas.
              </p>
            </Card>

            <Link href="/cek-wilayah">
              <Button variant="outline" className="w-full bg-transparent">
                Kembali ke Cek Wilayah
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
