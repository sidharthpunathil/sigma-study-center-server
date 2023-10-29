import { Controller, Post, Query, UploadedFile, UseInterceptors, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}


  // Returns the uploadFileId
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    return this.storageService.uploadFile(file);
  }

  // Returns the fileURL
  @Get('url')
  @UseInterceptors()
  async getUrl(@Query('id') id): Promise<string> {
    return this.storageService.getFileUrlById(id);
  }

    // Returns the fileURL
    @Get('file')
    @UseInterceptors()
    async getFile(@Query('id') id): Promise<Buffer> {
      return this.storageService.getFileAsBuffer(id);
    }

    @Get('base64')
    @UseInterceptors()
    async getAsBase64(@Query('id') id): Promise<string> {
      return this.storageService.getFileAsBase64(id);
    }
}
