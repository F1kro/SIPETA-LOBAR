import type React from "react"
import { MapPin } from "lucide-react"

interface HeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
}

export function Header({ title, subtitle, icon }: HeaderProps) {
  return (
    <div className="border-b border-border bg-white sticky top-16 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            {icon || <MapPin className="w-6 h-6 text-primary-foreground" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
