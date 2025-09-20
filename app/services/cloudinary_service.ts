import { v2 as cloudinary } from 'cloudinary'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { inject } from '@adonisjs/core'


@inject()
export default class CloudinaryService{

    public async upload(file: MultipartFile,folder:string){

          if (!file.tmpPath) {
        throw new Error('Invalid file: tmpPath is undefined');
    }
        const result = await cloudinary.uploader.upload(file.tmpPath,{

            resource_type: 'auto',
            folder: folder
        })
        return result
    }


      public async destroy(publicId: string) {
    if (!publicId || publicId === 'local') {
      return
    }
    await cloudinary.uploader.destroy(publicId)
  }
}