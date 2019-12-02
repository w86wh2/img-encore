import { Injectable, Body } from '@nestjs/common';
import * as path from 'path'
import * as fs from 'fs'
import  fileListItem  from './interface/fileList.interface'
const actionPath = "../images"

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  postModule(params): string {
    try {
      fs.mkdirSync(path.join(actionPath, params.module))
      fs.writeFileSync(path.join(actionPath, params.module, 'name.txt'), params.name)
      return '添加成功'
    } catch(err){
      return '添加失败'
    }
    
  }
  getFileList(): fileListItem[] {
    let returnTemp = []
    let files  = fs.readdirSync(actionPath)

    files.forEach((item, key) => {
      let temp = fs.readdirSync(path.join(actionPath, item))
      returnTemp.push({
        name: item,
        text: '',
        imgItem: []
      })
      temp.forEach(ite => {
        if (ite === 'name.txt') {
          let name = fs.readFileSync(path.join(actionPath, item, ite), 'utf8')
          returnTemp[key].text = name
        } else {
          returnTemp[key].imgItem.push({
            url: `http://img.encore.work/${item}/${ite}`,
            size: ''
          })
        }
      })
    })
    
    return returnTemp
  }
}
