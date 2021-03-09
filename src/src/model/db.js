import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

export const bucketName = "restaurant-56248.appspot.com";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-QJy4LD_4te_ZSVAh7yLrLPQlp3WQgXc",
  authDomain: "restaurant-56248.firebaseapp.com",
  databaseURL: "https://restaurant-56248-default-rtdb.firebaseio.com",
  projectId: "restaurant-56248",
  storageBucket: "restaurant-56248.appspot.com",
  messagingSenderId: "390293300466",
  appId: "1:390293300466:web:69f28c0d33e887a5a21c6b",
  measurementId: "G-JXJ9FYZQPZ"
};

firebase.initializeApp(firebaseConfig)

//utils
const db = firebase.firestore()
// db.settings()
const auth = firebase.auth()
const storage = firebase.storage()

const userCollection = db.collection('users')
const orderCollection = db.collection('submitted_order')
const foodCollection = db.collection('food')
const blogCollection = db.collection('blog')
const toppingCollection = db.collection('topping')
const feedBackCollection = db.collection('feed_back')

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: 'https://restaurant-56248.web.app/',
  // This must be true.
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.example.ios'
  },
  android: {
    packageName: 'com.example.android',
    installApp: true,
    minimumVersion: '12'
  },
  dynamicLinkDomain: 'example.page.link'
};
export {
  db,
  auth,
  storage,
  userCollection,
  actionCodeSettings,
  orderCollection,
  foodCollection,
  blogCollection,
  toppingCollection,
  feedBackCollection
}
