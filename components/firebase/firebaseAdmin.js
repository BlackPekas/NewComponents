var admin = require("firebase-admin");
var serviceAccount = require("../../secrets.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "pekomponents.appspot.com",
      });
}

export const db =  admin.firestore()
export const st = admin.storage().bucket("pekomponents.appspot.com")
export const auth = admin.auth()