-- CreateTable
CREATE TABLE "BaseUrl" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BaseUrl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BaseUrlInspection" (
    "id" TEXT NOT NULL,
    "inspectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "baseUrlId" TEXT NOT NULL,

    CONSTRAINT "BaseUrlInspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UrlPath" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "baseUrlId" TEXT NOT NULL,

    CONSTRAINT "UrlPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UrlPathInspection" (
    "id" TEXT NOT NULL,
    "inspectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "urlPathId" TEXT NOT NULL,

    CONSTRAINT "UrlPathInspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileUrl" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "urlPathId" TEXT NOT NULL,

    CONSTRAINT "FileUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BaseUrl_value_key" ON "BaseUrl"("value");

-- CreateIndex
CREATE UNIQUE INDEX "UrlPath_value_key" ON "UrlPath"("value");

-- CreateIndex
CREATE UNIQUE INDEX "FileUrl_value_key" ON "FileUrl"("value");

-- AddForeignKey
ALTER TABLE "BaseUrlInspection" ADD CONSTRAINT "BaseUrlInspection_baseUrlId_fkey" FOREIGN KEY ("baseUrlId") REFERENCES "BaseUrl"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrlPath" ADD CONSTRAINT "UrlPath_baseUrlId_fkey" FOREIGN KEY ("baseUrlId") REFERENCES "BaseUrl"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrlPathInspection" ADD CONSTRAINT "UrlPathInspection_urlPathId_fkey" FOREIGN KEY ("urlPathId") REFERENCES "UrlPath"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileUrl" ADD CONSTRAINT "FileUrl_urlPathId_fkey" FOREIGN KEY ("urlPathId") REFERENCES "UrlPath"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
