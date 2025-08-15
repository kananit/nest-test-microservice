import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { MinioService } from '../service';

@Controller('files')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post('upload') //http://localhost:3300/files/upload
  @UseInterceptors(FileInterceptor('file')) //Это готовый интерцептор из пакета @nestjs/platform-express, который работает с библиотекой Multer.
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    await this.minioService.uploadFile(
      file.originalname, // имя файла на клиенте
      file.buffer, // Содержимое файла в виде бинарных данных (Buffer). Именно эти байты и записываются в MinIO.
      file.mimetype, // MIME-тип файла (например, "image/png", "application/pdf", "text/plain"). Позволяет MinIO (и в будущем — браузеру) знать, что это за файл.
    );
    return {
      message: 'Файл загружен успешно',
      fileName: file.originalname, // название файла в minio
    };
  }

  @Get('download/:key') // http://localhost:3300/files/download/hello.txt
  async dowloadFile(@Param('key') key: string, @Res() res: Response) {
    const buffer = await this.minioService.downloadFile(key);
    // Метод сервиса, который берёт ключ (key) и скачивает файл из MinIO в виде Buffer.
    res.setHeader('Content-Type', 'application/octet-stream');
    // Говорит браузеру: «Это бинарный файл, его нельзя отображать напрямую, нужно сохранить».
    res.setHeader('Content-Disposition', `attachment; filename="${key}"`);
    // Заставляет браузер скачать файл с именем key вместо отображения.
    res.send(buffer);
    // Отправляет файл (в виде Buffer) пользователю.
  }

  @Delete(':key')
  async deleteFile(@Param('key') key: string) {
    await this.minioService.deleteS3File(key);
    // Этот метод внутри отправляет команду в MinIO API (DeleteObjectCommand в AWS SDK) и удаляет файл.
    return { message: 'Файл был успешно удален', filename: key };
  }

  @Get() // http://localhost:3300/files?prefix
  async listFiles(@Query('prefix') prefix: string) {
    // Достаёт из URL query-параметр prefix. Query-параметры — это часть запроса после ?.
    // если планируется много фильтров (префикс, сортировка, дата, и т. п.),  лучше @Query.
    return this.minioService.listFilesInFolder(prefix);
  }
}
