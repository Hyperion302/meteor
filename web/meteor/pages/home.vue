<template>
    <div>
        {{ seo }}
        <div v-for="(video, index) in videos" :key="index">
            {{ video.title }}
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
    data() {
        return {
            name: 'Loading...'
        }
    },
    mounted() {
        // Guranteed to be client, check auth
        if (firebase.auth().currentUser) {
            console.log('Signed in')
        } else {
            console.log('Signed out')
        }
    },
    async asyncData({ app }) {
        const video = await app.services.getVideo(
            '43064db7-b703-4d16-9a45-3f84b5e54d45'
        )
        return {
            seo: 'Nevermind',
            videos: [video]
        }
    }
}
</script>

<style></style>
