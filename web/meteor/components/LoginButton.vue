<template>
    <n-link class="login-button" to="/login">
        Login
    </n-link>
</template>

<script>
export default {
    name: 'LoginButton'
}
</script>

<style scoped>
.login-button {
    color: white;
    background: #e65100;
    text-transform: uppercase;
    text-decoration: none;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    font-size: 12px;
}
</style>
