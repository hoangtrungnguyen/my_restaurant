const express = require('express');
const router = express.Router();
const {Storage} = require('@google-cloud/storage');
const Multer = require('multer');
const {v4: uuidv4} = require('uuid');
const uuid = uuidv4();

// Creates a client
const storage = new Storage();

const bucket = storage.bucket("restaurant-56248.appspot.com");

const multer = Multer({
    // dest:"../uploads",
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});

router.get('/upload', (req, res) => {
    res.render("test")
})
/**
 * Adding new file to the storage
 */
router.post('/upload', multer.single('file'), (req, res) => {
    console.log('Upload Image');
    // let img  = fs.readFileSync(req.file);
    let image = req.file;
    const buffer = req.file.buffer
    if (buffer) {
        new Promise((resolve, reject) => {

            let newFileName = image.originalname;

            let fileUpload = bucket.file(newFileName);

            fileUpload.save(buffer)

            const blobStream = fileUpload.createWriteStream({
                metadata: {
                    metadata: {
                        firebaseStorageDownloadTokens: uuid,
                    },
                    contentType: image.mimeType,
                    cacheControl: 'public, max-age=31536000',
                }
            });

            blobStream.on('error', (error) => {
                console.debug(error)
                reject('Something is wrong! Unable to upload at the moment.');
            });

            blobStream.on('finish', () => {
                // The public URL can be used to directly access the file via HTTP.
                // const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
                const url = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(newFileName) + "?alt=media&token=" + uuid
                resolve(url);
            });

            blobStream.end(buffer);
        }).then((value) => {
            res.status(200).send({
                status: value
            });
            console.log("OK")
        }).catch((error) => {
            console.error(error);
        });

        // uploadImageToStorage(img).then((success) => {
        //     res.status(200).send({
        //         status: 'success'
        //     });
        //     console.log("OK")
        // }).catch((error) => {
        //     console.error(error);
        // });
    } else {
        console.log("Nothing")
    }
});

/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */
const uploadImageToStorage = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No image file');
        }
        let newFileName = `${file.originalname}_${Date.now()}`;

        let fileUpload = bucket.file(newFileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: "image/*"
            }
        });

        blobStream.on('error', (error) => {
            console.debug(error)
            reject('Something is wrong! Unable to upload at the moment.');
        });

        blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
            resolve(url);
        });

        blobStream.end(file.buffer);
    });
}

module.exports = router;