import { DynamicModule, Module, Provider } from '@nestjs/common';

import { S3Client } from '@aws-sdk/client-s3';
import { MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_URI } from '../config';

export const S3_CONNECTION = 'S3_CONNECTION';

const s3ClientProvider: Provider = {
  provide: S3_CONNECTION,
  useFactory: () =>
    new S3Client({
      forcePathStyle: true,
      credentials: {
        accessKeyId: MINIO_ACCESS_KEY,
        secretAccessKey: MINIO_SECRET_KEY,
      },
      endpoint: MINIO_URI,

      region: 'us-east-1',
    }),
};

@Module({})
export class S3ClientModule {
  static register(): DynamicModule {
    return {
      module: S3ClientModule,
      providers: [s3ClientProvider],
      exports: [s3ClientProvider],
    };
  }
}
