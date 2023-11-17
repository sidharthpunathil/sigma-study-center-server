export default () => ({
    port: parseInt(process.env.PORT) || 3001,
    Backblaze: {
        keyID: process.env.BLACKBLAZE_KEYID,
        keyName: process.env.BLACKBLAZE_KEYNAME,
        applicationKey: process.env.BLACKBLAZE_APPLICATIONKEY
    },
    Google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    Firebase: {
        apiKey: process.env.FIREBASE_APIKEY,
        authDomain: process.env.FIREBASE_AUTHDOMAIN,
        projectId: process.env.FIREBASE_PROJECTID,
        storageBucket: process.env.FIREBASE_STORAGEBUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
        appId: process.env.FIREBASE_APPID,
        measurementId: process.env.FIREBASE_MEASUREMENTID,
    },
    Jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRESIN,
    },
    Misc: {
        frontendUrl: process.env.FRONTEND_URL,
    }
  });
  