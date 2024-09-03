('use node');

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ConvexError } from 'convex/values';

const awsApi = new S3Client(
    {
        region: 'us-east-1',
        logger: undefined,
        credentials: {
            accessKeyId: process.env.AWS_IAM_USER_KEY!,
            secretAccessKey: process.env.AWS_IAM_USER_SECRET!,
        },
    }
);

if (!awsApi) {
    throw new ConvexError("Failed to create S3 bucket client.");
}

export function constructS3URL(s3BucketName: string, s3Path: string): string {
  return `https://${s3BucketName}.s3.amazonaws.com/${s3Path}`
}

export async function uploadUrlToS3(
    s3BucketName: string,
    s3Path: string,
    url: string
): Promise<string> {
    let response:(Response|null) = null
    try {
        response = await fetch(url);
    } catch (e) {
        throw new ConvexError(`Failed to fetch from URL: '${url}'\nError:${e}`);
    }
    if (!response || !response.body) {
        throw new ConvexError(`Failed to fetch response with valid body from URL: ${url}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const command = new PutObjectCommand({
        Bucket: s3BucketName,
        Key: s3Path,
        Body: uint8Array,
    });
    await awsApi.send(command);
    return constructS3URL(s3BucketName, s3Path);
}