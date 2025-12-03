import { minioClient } from "./../config/minio";
import { v4 as uuid } from "uuid";

export async function uploadToMinio(file: Express.Multer.File) {
    const bucketName = "product-images";

    // Create bucket if not exists
    const exists = await minioClient.bucketExists(bucketName).catch(() => false);
    if (!exists) {
        await minioClient.makeBucket(bucketName, "us-east-1");
    }

    const fileName = `${uuid()}-${file.originalname}`;

    // Upload file
    await minioClient.putObject(bucketName, fileName, file.buffer);

    // Return public URL
    return `http://localhost:9000/${bucketName}/${fileName}`;
}
