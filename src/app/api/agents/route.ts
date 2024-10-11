import { NextResponse } from 'next/server';
import prisma from "@/lib/db";
export const revalidate = 0

export async function GET() {
  // console.log("Fetching agents");
  try {
    const agents = await prisma.agent.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return NextResponse.json(agents);
  } catch (error) {
    console.error("Failed to fetch agents:", error);
    return NextResponse.json({ message: "Failed to fetch agents" }, { status: 500 });
  }
}
