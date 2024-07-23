import { NextResponse, NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import prisma from "@/db";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
});

async function uploadFileToS3(file: Buffer, fileName: string) {
  const fileBuffer = file;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${fileName}`,
    Body: fileBuffer,
    ContentType: "image/jpeg",
  };

  const command = new PutObjectCommand(params);
  const result = await s3Client.send(command);

  const url = `${process.env.IMAGE_KIT_URL}/${fileName}`;

  if (result) {
    const session = await auth();

    if (!session?.user) return NextResponse.json({ error: "Unauthorized" });

    const userId = session?.user?.id;

    const uploadedFile = await prisma.image.create({
      data: {
        url: url,
        userId: userId as string,
      },
    });
  }

  return fileName;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "File is required and must be a Blob." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadFileToS3(buffer, file.name);

    return NextResponse.json({ success: true, fileName });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
