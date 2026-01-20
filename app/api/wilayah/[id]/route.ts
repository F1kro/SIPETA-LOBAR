import { prisma } from "@/lib/prisma";

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
    
    const updated = await prisma.wilayah.update({
      where: { id },
      data: {
        ...body,
        // Pastikan koordinat tetap float di tingkat database
        latitude: parseFloat(body.latitude),
        longitude: parseFloat(body.longitude),
      }
    });
    
    return Response.json(updated);
  } catch (error) {
    return Response.json({ error: "Update Failed" }, { status: 500 });
  }
}