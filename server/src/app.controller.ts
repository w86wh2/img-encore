import { Controller, Get, Post,Body, UseInterceptors,UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs'
import * as path from 'path'
import { AppService } from './app.service';
import  fileListItem  from './interface/fileList.interface'
const actionPath = "../images"

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/fileList")
  getFileList(): fileListItem[] {
    return this.appService.getFileList();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file, @Body() body) {
    const writeImage = fs.createWriteStream(path.join(actionPath, body.path, `${file.originalname}`))
    writeImage.write(file.buffer)
    return '上传成功'
  }
  @Post('addModule')
  addModule(@Body() body): string {
    return this.appService.postModule(body)
  }
}
