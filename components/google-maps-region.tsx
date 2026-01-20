"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import type { google } from "google-maps"

interface GoogleMapsRegionProps {
  onSelectRegion: (region: string) => void
}

const REGIONS = [
  { id: "Sekotong-Gili Meno", label: "Gili Meno", lat: -8.361, lng: 116.078 },
  { id: "Sekotong-Gili Air", label: "Gili Air", lat: -8.358, lng: 116.088 },
  { id: "Lembar-Lembar", label: "Lembar", lat: -8.653, lng: 116.045 },
  { id: "Lingsar-Lingsar", label: "Lingsar", lat: -8.517, lng: 116.272 },
  { id: "Bayan-Senaru", label: "Senaru", lat: -8.187, lng: 116.395 },
]

export function GoogleMapsRegion({ onSelectRegion }: GoogleMapsRegionProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])

  useEffect(() => {
    // Check if google maps is loaded
    if (typeof window.google === "undefined" || !mapRef.current) {
      console.log("[v0] Google Maps API not yet loaded, showing fallback")
      return
    }

    const newMap = new window.google.maps.Map(mapRef.current, {
      zoom: 10,
      center: { lat: -8.4, lng: 116.2 },
      mapTypeId: "roadmap",
      styles: [
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#e0f2fe" }],
        },
        {
          featureType: "land",
          elementType: "geometry",
          stylers: [{ color: "#f5f5f4" }],
        },
      ],
    })

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    // Add markers for each region
    REGIONS.forEach((region) => {
      const marker = new window.google.maps.Marker({
        position: { lat: region.lat, lng: region.lng },
        map: newMap,
        title: region.label,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#0891b2",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="padding: 8px; font-size: 14px; font-weight: 500;">${region.label}</div>`,
      })

      marker.addListener("click", () => {
        // Close all info windows
        markersRef.current.forEach((m) => {
          const iw = m.get("infoWindow")
          if (iw) iw.close()
        })
        infoWindow.open(newMap, marker)
        onSelectRegion(region.id)
      })

      marker.set("infoWindow", infoWindow)
      markersRef.current.push(marker)
    })

    setMap(newMap)
  }, [onSelectRegion])

  return (
    <div className="space-y-4">
      <Card className="border border-border overflow-hidden">
        <div ref={mapRef} className="w-full h-96 bg-gradient-to-br from-blue-50 to-blue-100 relative">
          {typeof window.google === "undefined" && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Peta sedang dimuat...</p>
                <p className="text-sm text-muted-foreground">Pastikan Google Maps API key sudah dikonfigurasi</p>
              </div>
            </div>
          )}
        </div>
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
