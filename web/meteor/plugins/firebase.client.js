const configOptions = {
    apiKey: 'AIzaSyBzZyisCSV8gFFmPOpp3PJ1-l9kDovlTYw',
    authDomain: 'meteor-247517.firebaseapp.com',
    databaseURL: 'https://meteor-247517.firebaseio.com',
    projectId: 'meteor-247517',
    storageBucket: 'meteor-247517.appspot.com',
    messagingSenderId: '757295326132',
    appId: '1:757295326132:web:e870ea9b92f6765c'
}

function initializeClientPlugin({ fbFunctions }) {
    return {
        async getVideo(id) {
            const callable = fbFunctions.httpsCallable('getVideo')
            const response = await callable({
                video: id
            })
            return response.data
        }
    }
}

export default ({ app }) => {
    console.log('client run')
    // Initialize as client
    const firebase = require('firebase/app')
    require('firebase/auth')
    console.log(`Found ${firebase.apps.length} apps`)
    if (!firebase.apps.length) {
        console.log('initialized app')
        app.fbApp = firebase.initializeApp(configOptions)
    } else {
        app.fbApp = firebase.app()
    }
    app.services = initializeClientPlugin({ fbFunctions: firebase.functions })
}
