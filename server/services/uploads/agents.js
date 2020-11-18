const path = require('path');
module.exports = function (app) {
    let multer = require('multer');
    let storage = multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, path.join(__dirname + "../../../uploads/agents/")), // where the files are being stored
        filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`) // getting the file name
    });
    let upload = multer({
        storage,
        limits: {
            fieldSize: 1e+8, // Max field value size in bytes, here it's 100MB
            fileSize: 1e+7 //  The max file size in bytes, here it's 10MB
        }
    });

    app.use('/api/uploads/agents',
        upload.array('files'), (req, _res) => {
            const { method } = req;
            if (method === 'POST') {
                for (const file of req.files) {
                    _res.json({ "name": file.path.replace(path.join(__dirname + "../../../uploads/agents/"), "") })
                }
                if (req.files.length == 0) {
                    _res.json({ "name": "null.jpg" })
                }
            }
        })

};
