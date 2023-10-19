export default () => ({
    port: parseInt(process.env.PORT) || 3001,
    Backblaze: {
        keyID: process.env.BLACKBLAZE_KEYID,
        keyName: process.env.BLACKBLAZE_KEYNAME,
        applicationKey: process.env.BLACKBLAZE_APPLICATIONKEY
    }
  });
  