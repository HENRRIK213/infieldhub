ALTER TABLE "Product"
    ADD COLUMN IF NOT EXISTS "type" TEXT,
    ADD COLUMN IF NOT EXISTS "brand" TEXT,
    ADD COLUMN IF NOT EXISTS "size" TEXT;

ALTER TABLE "Product" ALTER COLUMN "status" SET DEFAULT 'APPROVED';

ALTER TABLE "User"
    ADD COLUMN IF NOT EXISTS "verificationCode" TEXT,
    ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "verificationCodeExpires" TIMESTAMP(3);

CREATE TABLE IF NOT EXISTS "Document" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "clientName" TEXT,
    "clientPhone" TEXT,
    "content" TEXT,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "serialNo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Document_serialNo_key" ON "Document"("serialNo");
