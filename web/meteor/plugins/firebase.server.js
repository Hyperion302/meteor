function initializeServerPlugin({ fbDB }) {
    return {
        async getVideo(id) {
            const snap = await fbDB.doc(`videos/${id}`).get()
            return snap.data()
        }
    }
}

export default ({ app }) => {
    console.log('server run')
    const admin = require('firebase-admin')
    console.log(`Found ${admin.apps.length} apps`)
    if (!admin.apps.length) {
        console.log('initialized app')
        app.fbApp = admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            databaseURL: 'https://meteor-247517.firebaseio.com'
        })
    } else {
        app.fbApp = admin.app()
    }
    app.services = initializeServerPlugin({ fbDB: admin.firestore() })
}
