-- CreateTable
CREATE TABLE "blobs" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blobs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "blobs" ADD CONSTRAINT "blobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
