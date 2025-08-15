import {
  _Object,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { Readable } from 'stream';

import { MINIO_EXCEPTION } from '../exceptions';
import { S3_CONNECTION } from '../module/s3.connection.module';

@Injectable()
export class MinioService {
  public bucket = 'files';

  constructor(@Inject(S3_CONNECTION) private readonly client: S3Client) {}

  async checkIfFileExists(key: string): Promise<boolean> {
    try {
      // получиаем метаданные объекта в S3-совместимом хранилище (AWS S3, MinIO и т.п.) без скачивания самого файла.
      const command = new HeadObjectCommand({ Bucket: this.bucket, Key: key });
      await this.client.send(command);
      return true;
    } catch {
      return false;
    }
  }

  //Bucket: this.bucket — имя bucket-а, где лежит файл (в MinioService по умолчанию "files").
  //Key: key — путь/имя файла в bucket-е.

  async deleteS3File(key: string): Promise<void> {
    // — удаляет файл из bucket-а.
    const isExists = await this.checkIfFileExists(key);
    if (!isExists) throw new Error(MINIO_EXCEPTION.NOT_FOUND_FILE);
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await this.client.send(command);
    } catch (error) {
      throw new Error(
        `${MINIO_EXCEPTION.FAILED_DELETE_FILE}: ${error?.message}`,
      );
    }
  }

  async downloadFile(key: string): Promise<Buffer> {
    // скачивает файл полностью в Buffer.
    const isExists = await this.checkIfFileExists(key);
    if (!isExists) throw new Error(MINIO_EXCEPTION.NOT_FOUND_FILE);
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    const { Body } = await this.client.send(command);
    if (!Body) throw new Error(MINIO_EXCEPTION.EMPTY_BUFFER);
    const bufferArray = await Body.transformToByteArray();
    const buffer = Buffer.from(bufferArray);
    return buffer;
  }

  async downloadStream(key: string) {
    // скачивает файл в виде потока (Readable).
    const isExists = await this.checkIfFileExists(key);
    if (!isExists) throw new Error(MINIO_EXCEPTION.NOT_FOUND_FILE);
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    const { Body } = await this.client.send(command);
    if (!Body) throw new Error(MINIO_EXCEPTION.EMPTY_BUFFER);
    return Body as Readable;
  }

  async listFilesInFolder(prefix: string): Promise<string[]> {
    // возвращает список файлов в папке (по префиксу).

    //     map берёт из каждого объекта только поле Key.
    // ! говорит TypeScript: «я уверен, что Key точно есть».
    // ?? [] — на случай, если map вернёт null или undefined (хотя тут почти не сработает).
    const data = await this.listS3Objects(prefix);
    if (!Array.isArray(data) || data.length === 0 || !data[0].Key)
      throw new Error(MINIO_EXCEPTION.FAILED_LIST_OBJECTS);
    return data.map((item) => item.Key!) ?? [];
  }

  async uploadFile(key: string, body: Buffer | Readable, contentType?: string) {
    //загружает файл в bucket.
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType || 'application/octet-stream',
      });
      await this.client.send(command);
    } catch (error) {
      throw new Error(
        `${MINIO_EXCEPTION.FAILED_UPLOAD_FILE}: ${error?.message}`,
      );
    }
  }

  private async listS3Objects(prefix: string): Promise<_Object[]> {
    // получает объекты из S3/MinIO по префиксу (служебный метод).
    if (!prefix) {
      prefix = '';
    } else if (prefix.startsWith('/')) prefix = prefix.slice(1);

    const param = {
      Bucket: this.bucket,
      ContinuationToken: undefined,
      Prefix: prefix,
    };

    async function getFilesRecursivelySub( // вспомогательная вложенная функция для постраничного получения объектов, чтобы обойти лимит в 1000 штук.
      param: {
        Bucket: string;
        ContinuationToken: string | undefined;
        Prefix: string;
      },
      client: S3Client,
    ): Promise<_Object[]> {
      const command = new ListObjectsV2Command(param);
      const result = await client.send(command);

      if (result.IsTruncated) {
        param.ContinuationToken = result.NextContinuationToken;
        return [
          ...result.Contents!,
          ...(await getFilesRecursivelySub(param, client)),
        ];
      } else {
        return result.Contents!;
      }
    }
    return getFilesRecursivelySub(param, this.client);
  }
}
