import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);

  handleFileUpload(file: Express.Multer.File) {
    this.logger.log(`File saved at: ${file.path}`);
    return { message: 'File uploaded successfully', filePath: file.path };
  }
}