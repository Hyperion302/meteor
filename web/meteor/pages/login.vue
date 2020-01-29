<template>
    <div class="login-container">
        <div class="login-card">
            <div>
                <input
                    class="email-input"
                    placeholder="email"
                    v-model="email"
                />
            </div>
            <div>
                <input
                    class="password-input"
                    placeholder="password"
                    v-model="password"
                />
            </div>
            <button @click="login">
                Login
            </button>
            <n-link to="/signup">
                Sign Up
            </n-link>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        login() {
            firebase
                .auth()
                .signInWithEmailAndPassword(this.email, this.password)
                .then(() => {
                    this.$router.push({
                        path: '/home'
                    })
                })
                .catch((e) => {
                    console.log('Error during login')
                    console.log(e)
                })
        }
    }
}
</script>

<style scoped>
.login-container {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: 1fr auto 1fr;

    height: 100vh;
    width: 100vw;
}
.login-card {
    grid-row: 2;
    grid-column: 2;
}
</style>
