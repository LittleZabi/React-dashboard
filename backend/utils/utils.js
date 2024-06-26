const multer = require('multer')


const getRandom = (limit = 5) => {
    const strings = 'abcdefghijklmnopqrstuvwxyz1234567890'
    let f = ''
    for (let i = 0; i < limit; i++) {
        let index = Math.ceil(Math.random() * (strings.length - 1))
        f += strings[index]
    }
    return f
}

module.exports.storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/home/alzainmh/admin.alzainmhc.com/media/images/')
    },
    filename: (req, file, cb) => {
        let ex = file.originalname.split('.')
        ex = ex[ex.length - 1]
        cb(null, getRandom(10) + '.' + ex);
    }
})


module.exports.getRandom = getRandom
