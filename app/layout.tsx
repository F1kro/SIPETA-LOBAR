import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Poppins } from 'next/font/google'
import { Footer } from "@/components/footer"
// import './globals.css'

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins' 
})

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DPMPTSP Kabupaten Lombok Barat - Panduan Investasi Wilayah",
  description:
    "Portal layanan informasi investasi dan perizinan DPMPTSP Kabupaten Lombok Barat. Cek potensi investasi wilayah Anda secara indikatif.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <head></head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      <Footer />
      </body>
    </html>
  )
}
