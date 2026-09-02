import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const space = await prisma.space.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json({ message: "تم تعديل المساحة بنجاح", space });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "المساحة غير موجودة أو حدث خطأ" },
      { status: 404 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.space.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "تم حذف المساحة بنجاح" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "المساحة غير موجودة أو حدث خطأ" },
      { status: 404 }
    );
  }
}