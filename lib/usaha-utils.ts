import { prisma } from '@/lib/prisma'

export const normalizeRegionText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim()

export async function resolveWilayahCoordinate(
  kecamatan: string,
  desa: string,
): Promise<{ latitude: number; longitude: number } | null> {
  const kecamatanNormalized = normalizeRegionText(kecamatan)
  const desaNormalized = normalizeRegionText(desa)

  const wilayahs = await prisma.wilayah.findMany({
    where: { kecamatan },
    select: { desa: true, latitude: true, longitude: true },
  })

  if (wilayahs.length > 0) {
    const exact = wilayahs.find((w) => w.desa.toLowerCase() === desa.toLowerCase())
    if (exact) {
      return { latitude: exact.latitude, longitude: exact.longitude }
    }

    const fuzzy = wilayahs.find((w) => normalizeRegionText(w.desa) === desaNormalized)
    if (fuzzy) {
      return { latitude: fuzzy.latitude, longitude: fuzzy.longitude }
    }
  }

  const fallback = await prisma.wilayah.findFirst({
    where: {
      desa: {
        equals: desa,
      },
    },
    select: { kecamatan: true, latitude: true, longitude: true },
  })
  if (fallback && normalizeRegionText(fallback.kecamatan) === kecamatanNormalized) {
    return { latitude: fallback.latitude, longitude: fallback.longitude }
  }

  return null
}

export const asSafeString = (value: unknown) => String(value ?? '').trim()

export const toNullableString = (value: unknown) => {
  const normalized = asSafeString(value)
  return normalized.length > 0 ? normalized : null
}

export const parseRupiahToBigInt = (value: unknown): bigint | null => {
  if (value === null || value === undefined || value === '') return null
  const numeric = String(value).replace(/[^0-9]/g, '')
  if (!numeric) return null
  return BigInt(numeric)
}

export const parseYearFromDateText = (value: unknown): number | null => {
  const text = asSafeString(value)
  if (!text) return null

  const yearMatch = text.match(/(19|20)\d{2}/)
  if (!yearMatch) return null

  const year = Number(yearMatch[0])
  if (Number.isNaN(year) || year < 1900 || year > new Date().getFullYear()) return null
  return year
}
