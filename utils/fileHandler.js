const multer = require('multer')
const { parse } = require('path')

const storage = multer.diskStorage({
 destination: function (req, res, cb) {
  cb(null, './uploads/')
 },
 filename: function (req, file, cb) {
  const { ext, name } = parse(file.originalname)
  cb(null, `${name}${Date.now()}${ext}`)
 },
})

const upload = multer({ storage })

module.exports = upload.single('post')