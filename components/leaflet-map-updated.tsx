"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import "leaflet/dist/leaflet.css"

interface LeafletMapUpdatedProps {
  onSelectRegion: (region: string) => void
  selectedDistrict?: string
  selectedVillage?: string
  preferredDistricts?: string[]
}

interface WilayahDB {
  id: string
  kecamatan: string
  desa: string
  latitude: number
  longitude: number
  statusRdtr: string
}

interface GeoFeature {
  type: "Feature"
  properties: {
    desa?: string
    kecamatan?: string
  }
  geometry: {
    type: "Polygon" | "MultiPolygon"
    coordinates: number[][][] | number[][][][]
  }
}

interface GeoFeatureCollection {
  type: "FeatureCollection"
  features: GeoFeature[]
}

const normalize = (v: string) =>
  String(v || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim()

const colorFromKey = (key: string) => {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }
  const hue = hash % 360
  return {
    fill: `hsl(${hue}, 65%, 56%)`,
    border: `hsl(${hue}, 70%, 36%)`,
  }
}

export function LeafletMapUpdated({
  onSelectRegion,
  selectedDistrict,
  selectedVillage,
  preferredDistricts = [],
}: LeafletMapUpdatedProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const polygonLayerRef = useRef<any>(null)
  const markerLayerRef = useRef<any>(null)
  const isInitializingRef = useRef(false)
  const [L, setL] = useState<any>(null)

  const [regions, setRegions] = useState<WilayahDB[]>([])
  const [geojson, setGeojson] = useState<GeoFeatureCollection | null>(null)

  const regionMap = useMemo(() => {
    const m = new Map<string, WilayahDB>()
    regions.forEach((r) => {
      m.set(`${normalize(r.kecamatan)}::${normalize(r.desa)}`, r)
    })
    return m
  }, [regions])

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const [wilayahRes, geoRes] = await Promise.all([fetch("/api/wilayah"), fetch("/ADMINISTRASIDESA_AR.geojson")])
        if (!wilayahRes.ok || !geoRes.ok) return

        const [wilayahData, geoData] = await Promise.all([wilayahRes.json(), geoRes.json()])
        if (!mounted) return

        setRegions(Array.isArray(wilayahData) ? wilayahData : [])
        setGeojson(geoData && Array.isArray(geoData.features) ? geoData : null)
      } catch (e) {
        console.error("Error fetching map layers:", e)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const initMap = async () => {
      if (typeof window === "undefined" || !mapRef.current || mapInstanceRef.current) return
      if (isInitializingRef.current) return
      if ((mapRef.current as any)._leaflet_id) return
      isInitializingRef.current = true

      // @ts-expect-error local project does not ship @types/leaflet
      const leaflet = await import("leaflet")
      if (cancelled) {
        isInitializingRef.current = false
        return
      }
      const LeafletLib = leaflet.default
      setL(LeafletLib)

      const instance = LeafletLib.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false,
      }).setView([-8.68, 116.12], 11)

      LeafletLib.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(instance)

      polygonLayerRef.current = LeafletLib.layerGroup().addTo(instance)
      markerLayerRef.current = LeafletLib.layerGroup().addTo(instance)
      mapInstanceRef.current = instance
      isInitializingRef.current = false
    }

    initMap().catch(console.error)

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off()
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        polygonLayerRef.current = null
        markerLayerRef.current = null
      }
      isInitializingRef.current = false
      if (mapRef.current) {
        ;(mapRef.current as any)._leaflet_id = undefined
      }
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    const layerGroup = polygonLayerRef.current
    const markerLayer = markerLayerRef.current
    if (!map || !layerGroup || !markerLayer || !geojson || !L) return

    layerGroup.clearLayers()
    markerLayer.clearLayers()

    const districtLayers = new Map<string, any[]>()
    const villageLayers = new Map<string, any[]>()

    const addLayer = (target: Map<string, any[]>, key: string, layer: any) => {
      const existing = target.get(key) || []
      existing.push(layer)
      target.set(key, existing)
    }

    const createPinIcon = (focus = false) =>
      L.divIcon({
        className: "",
        html: `
          <div style="width:${focus ? 34 : 30}px;height:${focus ? 34 : 30}px;filter:drop-shadow(0 8px 12px rgba(0,0,0,.25));">
            <svg viewBox="0 0 24 24" width="${focus ? 34 : 30}" height="${focus ? 34 : 30}" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" fill="${focus ? "#ef4444" : "#2563eb"}"/>
              <circle cx="12" cy="10" r="2.8" fill="#ffffff"/>
            </svg>
          </div>
        `,
        iconSize: [focus ? 34 : 30, focus ? 34 : 30],
        iconAnchor: [focus ? 17 : 15, focus ? 30 : 26],
      })

    geojson.features.forEach((feature) => {
      const desa = String(feature.properties?.desa || "").trim()
      const kecamatan = String(feature.properties?.kecamatan || "").trim()
      const key = `${normalize(kecamatan)}::${normalize(desa)}`
      const region = regionMap.get(key)

      const rdtrReady = (region?.statusRdtr || "").toLowerCase() === "tersedia"
      const palette = colorFromKey(`${kecamatan}::${desa}`)

      const isSelectedVillage = !!selectedDistrict && !!selectedVillage && kecamatan === selectedDistrict && desa === selectedVillage
      const isSelectedDistrict = !!selectedDistrict && !selectedVillage && kecamatan === selectedDistrict
      const inFocus = isSelectedVillage || isSelectedDistrict

      const layer = L.geoJSON(feature as any, {
        style: {
          color: rdtrReady ? (inFocus ? "#0f172a" : palette.border) : "#9ca3af",
          weight: inFocus ? 2.8 : 1.2,
          fillColor: rdtrReady ? palette.fill : "#d1d5db",
          fillOpacity: rdtrReady ? (inFocus ? 0.68 : 0.42) : 0.6,
        },
        onEachFeature: (_: any, polygon: any) => {
          const statusLabel = rdtrReady ? "RDTR Tersedia" : "RDTR Belum Tersedia"
          polygon.bindTooltip(`${desa}, ${kecamatan}`, { direction: "top", opacity: 0.95 })
          polygon.bindPopup(`
            <div style="text-align:center;font-family:'Poppins',sans-serif;min-width:210px;">
              <div style="font-weight:900;text-transform:uppercase;font-size:12px;color:#0f172a;">${desa}</div>
              <div style="color:#64748b;font-size:10px;font-weight:700;margin-top:2px;">KEC. ${kecamatan}</div>
              <div style="margin-top:8px;font-size:10px;font-weight:800;color:${rdtrReady ? "#059669" : "#475569"};text-transform:uppercase;">${statusLabel}</div>
            </div>
          `)

          polygon.on("click", () => onSelectRegion(`${kecamatan}-${desa}`))

          addLayer(districtLayers, kecamatan, polygon)
          addLayer(villageLayers, `${kecamatan}::${desa}`, polygon)
        },
      })

      layer.addTo(layerGroup)
    })

    const markerCandidates = regions.filter((r) => {
      const rdtrReady = (r.statusRdtr || "").toLowerCase() === "tersedia"
      if (selectedDistrict && selectedVillage) {
        return r.kecamatan === selectedDistrict && r.desa === selectedVillage
      }
      if (selectedDistrict) {
        return r.kecamatan === selectedDistrict
      }
      return rdtrReady
    })

    markerCandidates.forEach((r) => {
      const focus = !!selectedDistrict && !!selectedVillage && r.kecamatan === selectedDistrict && r.desa === selectedVillage
      L.marker([r.latitude, r.longitude], { icon: createPinIcon(focus), zIndexOffset: focus ? 1000 : 0 })
        .bindTooltip(`${r.desa}, ${r.kecamatan}`, { direction: "top", opacity: 0.95 })
        .addTo(markerLayer)
    })

    if (selectedDistrict && selectedVillage) {
      const bounds = L.featureGroup(villageLayers.get(`${selectedDistrict}::${selectedVillage}`) || []).getBounds()
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 })
        return
      }
    }

    if (selectedDistrict) {
      const bounds = L.featureGroup(districtLayers.get(selectedDistrict) || []).getBounds()
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [35, 35], maxZoom: 12 })
        return
      }
    }

    if (!selectedDistrict && preferredDistricts.length > 0) {
      const preferredLayers: any[] = []
      preferredDistricts.forEach((district) => {
        const layers = districtLayers.get(district) || []
        preferredLayers.push(...layers)
      })
      const preferredBounds = L.featureGroup(preferredLayers).getBounds()
      if (preferredBounds.isValid()) {
        map.fitBounds(preferredBounds, { padding: [35, 35], maxZoom: 11 })
        return
      }
    }

    const allLayers: any[] = []
    layerGroup.eachLayer((l: any) => allLayers.push(l))
    const allBounds = L.featureGroup(allLayers).getBounds()
    if (allBounds.isValid()) {
      map.fitBounds(allBounds, { padding: [35, 35], maxZoom: 11 })
    }
  }, [geojson, regionMap, selectedDistrict, selectedVillage, onSelectRegion, preferredDistricts, L])

  return (
    <div className="w-full h-full relative group">
      <style jsx global>{`
        .leaflet-container {
          font-family: 'Poppins', sans-serif !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 14px !important;
          box-shadow: 0 16px 28px -8px rgb(0 0 0 / 0.18) !important;
        }
        .leaflet-popup-tip-container {
          display: none !important;
        }
      `}</style>

      <div ref={mapRef} className="w-full h-full z-0" style={{ minHeight: "100%", background: "#f1f5f9" }} />

      <div className="absolute left-3 bottom-3 z-[900] bg-white/95 border border-slate-200 rounded-xl p-3 shadow text-[10px] font-bold uppercase tracking-wider text-slate-600 space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 border border-white" />
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-500 border border-white -ml-1" />
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-500 border border-white -ml-1" />
          </span>
          <span>RDTR Tersedia (Multi Warna)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm bg-slate-300" />
          <span>RDTR Belum Tersedia</span>
        </div>
      </div>
    </div>
  )
}
