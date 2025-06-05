import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Res,
  Redirect,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { Response, Request } from 'express';
import { readdirSync } from 'fs';
import { join } from 'path';
import { AuthGuard } from '@nestjs/passport';

interface RequestWithSession extends Request {
  session: any;
  isAuthenticated(): this is RequestWithSession;
  user: any;
}

@Controller('')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Get()
  getUploadForm(@Req() req: RequestWithSession, @Res() res: Response) {
    const isAuthenticated = req.isAuthenticated?.() || false;
    console.log('Home page - Auth state:', isAuthenticated);
    console.log('Session:', req.session);
    
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>File Upload</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              position: relative;
            }
            .upload-container {
              border: 2px dashed #ccc;
              padding: 20px;
              text-align: center;
              border-radius: 8px;
              margin-top: 20px;
            }
            .upload-container:hover {
              border-color: #666;
            }
            input[type="file"] {
              margin: 20px 0;
            }
            button {
              background-color: #4CAF50;
              color: white;
              padding: 10px 20px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
            button:hover {
              background-color: #45a049;
            }
          </style>
        </head>
        <body>
          <h1>File Upload</h1>
          <div class="upload-container">
            <form action="/" method="post" enctype="multipart/form-data">
              <input type="file" name="file" />
              <br>
              <button type="submit">Upload File</button>
            </form>
          </div>
        </body>
      </html>
    `);
  }

  @Get('uploads')
  getUploadedFiles(@Req() req: RequestWithSession, @Res() res: Response) {
    const uploadsDir = 'C:\\Users\\mayer\\OneDrive\\Desktop\\Yape-Internship\\uploads';
    const files = readdirSync(uploadsDir);
    
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Uploaded Files</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              position: relative;
            }
            .auth-button {
              background-color: #4285f4;
              color: white;
              padding: 10px 20px;
              border-radius: 4px;
              text-decoration: none;
              display: inline-block;
              position: absolute;
              top: 20px;
              right: 20px;
            }
            .auth-button:hover {
              background-color: #357abd;
            }
            .file-list {
              list-style: none;
              padding: 0;
            }
            .file-item {
              padding: 10px;
              border: 1px solid #ddd;
              margin: 5px 0;
              border-radius: 4px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .file-item:hover {
              background-color: #f5f5f5;
            }
            a {
              color: #4CAF50;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <a href="/auth/logout" class="auth-button">Logout</a>
          <h1>Uploaded Files</h1>
          <ul class="file-list">
            ${files.map(file => `
              <li class="file-item">
                <span>${file}</span>
                <a href="/uploads/${file}" target="_blank">View</a>
              </li>
            `).join('')}
          </ul>
          <a href="/">← Back to Upload</a>
        </body>
      </html>
    `);
  }

  @Get('uploads/:filename')
  serveFile(@Req() req: RequestWithSession, @Param('filename') filename: string, @Res() res: Response) {

    const filePath = join('C:\\Users\\mayer\\OneDrive\\Desktop\\Yape-Internship\\uploads', filename);
    return res.sendFile(filePath);
  }

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @Redirect('/')
  async uploadFile(@UploadedFile() file: any) {
    await this.fileUploadService.handleFileUpload(file);
  }
}