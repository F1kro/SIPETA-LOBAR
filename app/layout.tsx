"use client" // Wajib Client Component karena ada script Google di head

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Poppins } from 'next/font/google'
import { Footer } from "@/components/footer"
import { Toaster } from "sonner"
import type { Metadata } from "next";


// KONFIGURASI FONT ASLI KAMU - TIDAK DIUBAH
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins'
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={poppins.variable}>
      <head>
        {/* Tag Meta Verifikasi Google Search Console */}
        <meta name="google-site-verification" content="0mDp3t5GQ4oUVUZwu5v71wNY0ZEFe3qNA4eaJtYCbBc" />
        
        <style dangerouslySetInnerHTML={{ __html: `
          /* Sembunyikan Widget Google */
          .goog-te-banner-frame.skiptranslate, .goog-te-gadget { display: none !important; }
          body { top: 0px !important; }
          .goog-te-menu-value { display: none !important; }
          #google_translate_element { display: none; }
         
          /* PAKSA PAKAI POPPINS DI SEMUA ELEMEN */
          html, body, * {
            font-family: var(--font-poppins), sans-serif !important;
          }
        `}} />
      </head>
      <body
        className="antialiased"
        suppressHydrationWarning
        style={{ marginTop: 0, paddingTop: 0 }}
      >
        {children}
        <Analytics />
        <Footer />
        <Toaster/>
      </body>
    </html>
  )
}