const admin = require('firebase-admin');
const firebase = require('firebase/app');
import 'firebase/database';
import 'firebase/storage';

// Access the real-time database in the initialized application.
const storage = firebase.storage()

export function upload_image(ref, filename, file) {

    const upload_loc = ref.toString() + '/' + filename;
    const upload_ref = storage.ref().child(upload_loc);

    upload_ref.put(file).then(function (snapshot) {
        snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL);
            return downloadURL;
        });
    }, function (error) {
        console.log("FirebaseManager, upload_image(): " + error);
        throw error;
    });

    return 'error';
}