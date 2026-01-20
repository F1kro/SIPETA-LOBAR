"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Mail, MapPin, Shield } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Login gagal")
        setLoading(false)
        return
      }

      router.push("/admin")
      router.refresh()
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.")
      setLoading(false)
    }
  }

  return (
    // Menggunakan h-screen dan overflow-hidden agar fix tidak bisa scroll
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10 w-full max-w-[380px] px-4">
        {/* Logo Section - Ukuran diperkecil */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-3 shadow-lg shadow-blue-500/40">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter">
            SIPETA Lombok Barat
          </h1>
          <p className="text-[10px] text-blue-300 font-bold uppercase tracking-[0.2em] opacity-80">
            Sistem Informasi Peta Investasi
          </p>
        </div>

        {/* Form Card - Sangat Compact */}
        <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-md rounded-2xl">
          <CardHeader className="pt-6 pb-4 space-y-0 text-center">
            <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight">
              Login Admin
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Masukkan kredensial akses Anda
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="py-2 px-3 rounded-lg border-red-100 bg-red-50">
                  <AlertDescription className="text-[11px] font-bold text-red-600 leading-none">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[11px] font-black text-slate-500 uppercase ml-1">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@lobar.go.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-9 h-11 rounded-xl border-slate-200 text-sm focus:ring-blue-600 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[11px] font-black text-slate-500 uppercase ml-1">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-9 pr-10 h-11 rounded-xl border-slate-200 text-sm focus:ring-blue-600 bg-slate-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Masuk Sekarang"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Copyright - Ukuran Kecil */}
        <div className="mt-6 text-center">
            <p className="text-[10px] text-blue-300/60 font-medium uppercase tracking-widest">
                © 2026 Pemerintah Kab. Lombok Barat
            </p>
        </div>
      </div>
    </div>
  )
}