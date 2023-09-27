import { fileMerge, fileUpload } from '@/api/modules/upload'
import { UploadConfig } from '@textbus/editor'
// import OSS from "ali-oss";
import { errorMessage } from '../common/message'

// function requestCustom(file: File): Promise<string> {
//   // Get the absolute path of the cover. I haven’t written it yet.
//   return new Promise<string>(async (resolve, reject) => {
//     const { data, code, msg } = await getToken() as IResponse<any>;
//     const { credentials } = data;
//     if (code == 200) {
//       const { res }: any = await aliossFileUpload(file, credentials);
//       resolve(res.requestUrls[0])
//     }
//     reject(msg);
//   })
// }
// Alibaba Cloud direct transmission
// async function aliossFileUpload(file: File, config: any) {
//   let client = new OSS({
//     region: config.region,
//     accessKeyId: config.AccessKeyId,
//     accessKeySecret: config.AccessKeySecret,
//     stsToken: config.SecurityToken,
//     bucket: config.bucket,
//   })
//   return new Promise((resolve, reject) => {
//     let fileName = String(Date.now());
//     client.multipartUpload(fileName, file, {
//       progress: (p, checkpoint) => {
//         console.log(p, checkpoint);
//       },
//       parallel: 4,
//       partSize: 1024 * 1024,
//       mime: file.type,
//     })
//       .then((res) => {
//         resolve(res);
//       })
//       .catch((err) => {
//         reject(err)
//       });
//   })
// }

// Slice upload
export function ImageUpload(file: File) {
  const M = 5,
    maxSize = 1024 * 1024 * M,
    chunkSize = 1024 * 1024,
    filename = file.name.slice(0, file.name.lastIndexOf('.')),
    ext = file.name.slice(file.name.lastIndexOf('.') + 1)
  // console.log(filename.length)
  return new Promise<string>((resolve, reject) => {
    async function upload(index: number) {
      const start = index * chunkSize
      if (file.size > maxSize) {
        return errorMessage('Image size cannot exceed' + M + 'M!')
      }
      if (filename.length > 80) {
        return errorMessage('File name is too long, Change it')
      }
      // slice
      if (start > file.size) {
        // After the upload is completed, merge the slices
        return merge(file.name, index)
      }
      // slice into blobs
      const blob = file.slice(start, start + chunkSize)
      const blobName = `${filename}.${index}.${ext}`
      const blobFile = new File([blob], blobName)
      const form = new FormData()
      form.append('file', blobFile)

      try {
        await fileUpload(form)
        upload(++index)
      } catch {
        reject('The upload failed, please try again later~')
      }
    }
    async function merge(name: string, length: number) {
      const data: any = await fileMerge({ name, length })
      if (data.code === 200) {
        resolve(data.url)
      } else {
        reject(data.msg)
      }
    }
    upload(0)
  })
}

export async function uploader(config: UploadConfig) {
  switch (config.uploadType) {
    case 'image': {
      try {
        const file = await getPickerFile({
          multiple: config.multiple,
          accept: 'image/png, image/gif, image/jpeg,image/jpg, image/bmp, image/x-icon'
        })
        return await ImageUpload(file)
      } catch (err) {
        return String('null')
      }
    }
  }
  return String('null')
}
interface IUploadOptions {
  multiple: boolean
  accept: string
}
export function getPickerFile(options: IUploadOptions) {
  const fileInput = document.createElement('input')
  fileInput.setAttribute('type', 'file')
  fileInput.setAttribute('accept', options.accept)
  fileInput.style.cssText = 'position: absolute; left: -9999px; top: -9999px; opacity: 0'
  fileInput.multiple = options.multiple
  const promise = new Promise<File>(function (resolve) {
    fileInput.addEventListener('change', async function (event) {
      document.body.removeChild(fileInput)
      try {
        const files = (event.target as HTMLInputElement).files as FileList
        resolve(files[0])
      } catch (e) {
        errorMessage(<string>e)
      }
    })
  })
  document.body.appendChild(fileInput)
  fileInput.click()
  return promise
}
