import { NextResponse, NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import prisma from "@/db";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
});

function generateUniqueFileName(originalFileName: string) {
  const fileExtension = originalFileName.split(".").pop();
  const uniqueId = `${Date.now()}-${uuidv4()}`;
  return `${uniqueId}.${fileExtension}`;
}

async function uploadFileToS3(file: Buffer, fileName: string) {
  const fileBuffer = file;
  const folderPath = "blob/";
  const uniqueFileName = generateUniqueFileName(fileName);
  const filePath = `${folderPath}${uniqueFileName}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: filePath,
    Body: fileBuffer,
    ContentType: "video/webm",
  };

  const command = new PutObjectCommand(params);
  const result = await s3Client.send(command);

  const url = `${process.env.IMAGE_KIT_URL}/blob/${uniqueFileName}`;

  if (result) {
    const session = await auth();

    if (!session?.user) return NextResponse.json({ error: "Unauthorized" });

    const userId = session?.user?.id;

    const uploadedFile = await prisma.blob.create({
      data: {
        url: url,
        userId: userId as string,
      },
    });
  }

  return filePath;
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
    const filePath = await uploadFileToS3(buffer, file.name);

    return NextResponse.json({ success: true, filePath });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
