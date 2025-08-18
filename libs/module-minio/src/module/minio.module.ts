import { DynamicModule, Module } from '@nestjs/common';
import { MinioService } from '../service/minio.service';
import { S3ClientModule } from './s3.connection.module';

@Module({})
export class MinioModule {
  static register(): DynamicModule {
    const s3ClientModule = S3ClientModule.register();
    return {
      global: true,
      module: MinioModule,
      imports: [s3ClientModule],
      providers: [MinioService],
      exports: [MinioService],
    };
  }
}
