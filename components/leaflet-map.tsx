"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

interface LeafletMapProps {
  onSelectRegion: (region: string) => void
}

const REGIONS = [
  { id: "Sekotong-Gili Meno", label: "Gili Meno", lat: -8.361, lng: 116.078 },
  { id: "Sekotong-Gili Air", label: "Gili Air", lat: -8.358, lng: 116.088 },
  { id: "Lembar-Lembar", label: "Lembar", lat: -8.653, lng: 116.045 },
  { id: "Lingsar-Lingsar", label: "Lingsar", lat: -8.517, lng: 116.272 },
  { id: "Bayan-Senaru", label: "Senaru", lat: -8.187, lng: 116.395 },
]

export function LeafletMap({ onSelectRegion }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return

      // Dynamically import Leaflet modules
      const L = (await import("leaflet")).default
      const { icon } = await import("leaflet")

      // Import Leaflet CSS
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      document.head.appendChild(link)

      // Create map instance
      const map = L.map(mapRef.current).setView([-8.4, 116.2], 10)

      // Add OpenStreetMap tiles (free, no API key needed)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map)

      mapInstanceRef.current = map

      // Clear existing markers
      markersRef.current.forEach((marker) => {
        map.removeLayer(marker)
      })
      markersRef.current = []

      // Custom icon
      const customIcon = icon({
        iconUrl:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230891b2'%3E%3Cpath d='M12 2C7.03 2 3 6.03 3 11c0 5.25 9 13 9 13s9-7.75 9-13c0-4.97-4.03-9-9-9zm0 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      })

      // Add markers
      REGIONS.forEach((region) => {
        const marker = L.marker([region.lat, region.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(
            `<div style="text-align: center; font-weight: 500; padding: 8px; min-width: 120px;">${region.label}</div>`,
          )

        marker.on("click", () => {
          onSelectRegion(region.id)
        })

        markersRef.current.push(marker)
      })
    }

    initMap().catch(console.error)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }
    }
  }, [onSelectRegion])

  return (
    <div className="space-y-4">
      <Card className="border border-border overflow-hidden">
        <div
          ref={mapRef}
          className="w-full h-96 bg-gradient-to-br from-blue-50 to-blue-100"
          style={{ minHeight: "400px" }}
        />
      </Card>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-foreground mb-1">Cara Penggunaan:</p>
        <p className="text-muted-foreground">
          Klik marker pada peta untuk memilih wilayah investasi yang ingin Anda cek
        </p>
      </div>
    </div>
  )
}
