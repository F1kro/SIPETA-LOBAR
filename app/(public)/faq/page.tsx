"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, ChevronRight, MessageCircle, ArrowRight } from "lucide-react"

interface FAQItem {
  id: string
  question: string
  answer: string[]
}

const faqItems: FAQItem[] = [
  {
    id: "q1",
    question: "Apakah website ini menggantikan RDTR asli?",
    answer: [
      "Tidak. Website ini hanya menampilkan informasi indikatif dan edukatif berdasarkan RDTR untuk membantu masyarakat memahami potensi wilayah secara awal.",
      "RDTR yang resmi dan mengikat secara hukum tetap berpedoman pada dokumen RDTR asli yang diterbitkan oleh pemerintah.",
      "Untuk kepastian hukum, selalu konsultasikan dengan DPMPTSP sebelum melakukan investasi.",
    ],
  },
  {
    id: "q2",
    question: "Apakah rekomendasi investasi di website ini bersifat pasti?",
    answer: [
      "Tidak. Rekomendasi yang ditampilkan bersifat indikatif saja, yang berarti sebagai panduan awal untuk memahami potensi wilayah.",
      "Kepastian tentang kesesuaian jenis usaha, persyaratan perizinan, dan berbagai ketentuan lainnya harus diperoleh melalui konsultasi resmi dengan DPMPTSP.",
    ],
  },
  {
    id: "q3",
    question: "Bagaimana jika RDTR wilayah saya belum tersedia?",
    answer: [
      "Jika RDTR wilayah Anda masih dalam tahap penyusunan atau belum tersedia, Anda tetap dapat berkonsultasi dengan DPMPTSP untuk mendapatkan informasi awal.",
      "Tim DPMPTSP dapat memberikan bimbingan berdasarkan rencana tata ruang yang sudah ada atau rencana pengembangan wilayah yang sedang berlangsung.",
    ],
  },
  {
    id: "q4",
    question: "Apakah semua wilayah di Lombok Barat bisa dibangun usaha?",
    answer: [
      "Tidak semua wilayah cocok untuk semua jenis usaha. Ada wilayah yang memiliki batasan atau larangan untuk jenis usaha tertentu.",
      "Batasan ini biasanya untuk melindungi lingkungan, pertanian produktif, zona pariwisata, area konservasi, dan kepentingan masyarakat lokal.",
    ],
  },
  {
    id: "q5",
    question: "Apakah wajib berkonsultasi dengan DPMPTSP sebelum mengajukan izin?",
    answer: [
      "Tidak wajib, namun sangat disarankan. Konsultasi sebelumnya dapat menghemat waktu, biaya, dan menghindari penolakan permohonan.",
      "Konsultasi dengan DPMPTSP adalah gratis dan dapat dilakukan melalui telepon, email, atau kunjungan langsung ke kantor.",
    ],
  },
  {
    id: "q6",
    question: "Berapa lama proses perizinan biasanya berlangsung?",
    answer: [
      "Untuk perizinan melalui sistem OSS (Online Single Submission), proses biasanya berlangsung 7-14 hari kerja dari pengajuan hingga persetujuan.",
      "Untuk perizinan non-OSS atau kasus khusus, waktu dapat bervariasi (14-30 hari kerja atau lebih).",
    ],
  },
  {
    id: "q7",
    question: "Apa saja biaya yang harus saya keluarkan untuk perizinan?",
    answer: [
      "Konsultasi dengan DPMPTSP sama sekali GRATIS - tidak ada biaya apapun.",
      "Untuk pengajuan izin, ada biaya administrasi resmi yang diatur dalam peraturan daerah (sesuai skala usaha).",
      "Jangan percaya dengan perantara atau broker yang meminta biaya tambahan. Lakukan pengajuan langsung.",
    ],
  },
]

export default function FAQPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-slate-50 font-poppins text-slate-900 pb-20 text-left">
      
      {/* 1. HEADER SECTION - Lebar max-w-6xl sinkron dengan Navbar */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-[100] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                Tanya Jawab (FAQ)
              </h1>
              <p className="text-sm md:text-base text-slate-500 font-bold uppercase tracking-widest mt-2">
                Informasi Umum Portal & Prosedur Perizinan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT - Container Identik dengan Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Introduction */}
        <Card className="rounded-2xl border-none shadow-xl mb-12 p-8 md:p-12 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
             <MessageCircle size={180} />
          </div>
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-6 text-blue-500">Pusat Bantuan</h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
              Temukan jawaban atas pertanyaan yang paling sering diajukan mengenai portal investasi DPMPTSP Kabupaten Lombok Barat dan proses pengurusan izin usaha Anda.
            </p>
          </div>
        </Card>

        {/* FAQ Accordion */}
        <div className="space-y-6">
          <Accordion type="single" collapsible className="w-full space-y-4" value={expandedId || ""}>
            {faqItems.map((item, idx) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-none bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <AccordionTrigger className="hover:no-underline px-8 py-6 group">
                  <div className="flex gap-5 items-center text-left">
                    <span className={`text-xl font-black transition-colors duration-300 ${expandedId === item.id ? 'text-blue-600' : 'text-slate-300'}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="font-black text-slate-900 text-lg uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                      {item.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-8 pt-2">
                  <div className="space-y-4 text-slate-600 border-l-4 border-blue-600 pl-6 ml-10">
                    {item.answer.map((paragraph, i) => (
                      <p key={i} className="text-base md:text-lg font-medium leading-relaxed italic">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Section */}
        <Card className="rounded-2xl border-none shadow-xl mt-16 p-10 bg-blue-600 text-white text-left relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 opacity-20 rotate-12">
            <MessageCircle size={200} />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4">Masih Ada Pertanyaan?</h2>
            <p className="text-lg font-bold text-blue-100 mb-8 max-w-2xl uppercase italic">
              Jika pertanyaan Anda belum terjawab, tim ahli DPMPTSP siap membantu Anda melalui layanan konsultasi gratis.
            </p>
            <Link href="/konsultasi">
              <Button className="bg-white text-blue-600 hover:bg-slate-100 font-black px-10 py-7 rounded-xl text-sm uppercase tracking-widest shadow-2xl">
                Hubungi DPMPTSP <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </Card>

      </div>
    </main>
  )
}