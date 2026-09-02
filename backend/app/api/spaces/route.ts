import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/spaces — عرض كل المساحات
export async function GET() {
  try {
    const spaces = await prisma.space.findMany();
    return NextResponse.json(spaces);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر" },
      { status: 500 }
    );
  }
}

// POST /api/spaces — إضافة مساحة جديدة
export async function POST(request: Request) {
  try {
    const { name, location, priceDaily, priceMonthly, priceYearly, capacity } =
      await request.json();

    if (!name || !location || !priceDaily || !priceMonthly || !priceYearly || !capacity) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    const space = await prisma.space.create({
      data: { name, location, priceDaily, priceMonthly, priceYearly, capacity },
    });

    return NextResponse.json(
      { message: "تم إنشاء المساحة بنجاح", space },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر" },
      { status: 500 }
    );
  }
}