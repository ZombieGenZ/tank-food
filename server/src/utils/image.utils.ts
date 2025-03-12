import multer from 'multer'
import fse from 'fs-extra'
import fs from 'fs'
import path from 'path'

const storageProduct = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../../client/public/images/upload/products/temporary')
    fse
      .ensureDir(uploadPath)
      .then(() => {
        cb(null, uploadPath)
      })
      .catch((err) => {
        cb(err, uploadPath)
      })
  },
  filename: (req, file, cb) => {
    const fileName = path.basename(file.originalname, path.extname(file.originalname))
    const fileExt = path.extname(file.originalname)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${fileName}-${uniqueSuffix}${fileExt}`)
  }
})

export const uploadProduct = multer({
  storage: storageProduct,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 10,
    files: 1
  }
})

export const deleteTemporaryFile = async (file: any) => {
  try {
    fs.unlinkSync(file.path)
  } catch (err) {
    return
  }
}

export const deleteCurrentFile = async (filePath: string) => {
  try {
    fs.unlinkSync(path.join(__dirname, filePath))
  } catch (err) {
    console.log(err)
    return
  }
}
