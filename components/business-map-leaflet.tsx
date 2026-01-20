'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Business {
  id: string
  name: string
  latitude: number
  longitude: number
  sector: string
  status: string
  badge?: string
  investment_amount?: number
  image_url?: string
  address?: string
}

interface BusinessMapProps {
  businesses: Business[]
  onSelectBusiness: (business: Business) => void
  selectedBusiness?: Business | null
}

export default function BusinessMapLeaflet({
  businesses,
  onSelectBusiness,
  selectedBusiness,
}: BusinessMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize map only once
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([-8.7833, 116.2333], 10)

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current)
    }

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => {
      map.current?.removeLayer(marker)
    })
    markersRef.current = {}

    // Add markers for businesses
    businesses.forEach((business) => {
      const icon = L.divIcon({
        html: `
          <div class="w-8 h-8 bg-emerald-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-emerald-600">
            <span class="text-white font-bold text-xs">📍</span>
          </div>
        `,
        iconSize: [32, 32],
        className: 'business-marker',
      })

      const marker = L.marker([business.latitude, business.longitude], {
        icon,
      }).addTo(map.current!)

      marker.on('click', () => {
        console.log('[v0] Marker clicked:', business.name)
        onSelectBusiness(business)
      })

      markersRef.current[business.id] = marker
    })

    console.log('[v0] Map markers updated:', Object.keys(markersRef.current).length)
  }, [businesses, onSelectBusiness])

  // Update marker color when selected
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const isSelected = selectedBusiness?.id === id
      const iconColor = isSelected ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'

      const icon = L.divIcon({
        html: `
          <div class="w-8 h-8 ${iconColor} border-2 border-white rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-colors">
            <span class="text-white font-bold text-xs">📍</span>
          </div>
        `,
        iconSize: [32, 32],
        className: 'business-marker',
      })

      marker.setIcon(icon)

      // Center map on selected business
      if (isSelected && map.current) {
        map.current.setView([selectedBusiness.latitude, selectedBusiness.longitude], 14)
      }
    })
  }, [selectedBusiness])

  return <div ref={mapContainer} className="w-full h-96 rounded-lg shadow-lg" />
}
