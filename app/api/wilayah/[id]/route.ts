import { prisma } from "@/lib/prisma";
import { resolveMasterCoordinate } from "@/lib/wilayah-master";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const wilayah = await prisma.wilayah.findUnique({
      where: { id }
    });
    
    if (!wilayah) return Response.json({ error: "Not Found" }, { status: 404 });
    return Response.json(wilayah);
  } catch (error) {
    return Response.json({ error: "Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const kecamatan = String(body.kecamatan || '').trim()
    const desa = String(body.desa || '').trim()
    const masterPoint = resolveMasterCoordinate(kecamatan, desa)
    if (!masterPoint) {
      return Response.json(
        { error: `Wilayah ${desa}, ${kecamatan} tidak ada pada referensi geolokasi` },
        { status: 400 },
      )
    }
    
    const updated = await prisma.wilayah.update({
      where: { id },
      data: {
        kecamatan,
        desa,
        statusRdtr: body.statusRdtr,
        usahaSesuai: body.usahaSesuai,
        perluKajian: body.perluKajian,
        catatanRisiko: body.catatanRisiko || '',
        estimasiBiaya: body.estimasiBiaya || '',
        estimasiWaktu: body.estimasiWaktu || '',
        gambarRdtr: body.gambarRdtr || '',
        latitude: masterPoint.latitude,
        longitude: masterPoint.longitude,
      }
    });
    
    return Response.json(updated);
  } catch (error) {
    return Response.json({ error: "Update Failed" }, { status: 500 });
  }
}
