"use client" // Wajib Client Component karena ada script Google di head

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Poppins } from 'next/font/google'
import { Footer } from "@/components/footer"

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
        {/* Google Translate Init */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'id',
                  includedLanguages: 'id,en',
                  autoDisplay: false
                }, 'google_translate_element');
              }
            `,
          }}
        />
        {/* <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" /> */}
        
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
        <div id="google_translate_element"></div>
      </body>
    </html>
  )
}