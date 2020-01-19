<template>
    <n-link class="register-button" to="/signup">
        Sign Up
    </n-link>
</template>

<script>
export default {
    name: 'RegisterButton'
}
</script>

<style scoped>
.register-button {
    padding: 10px 20px;
    border-radius: 5px;
    border: 1px solid white;
    background-color: black;
    color: white;
    transition: 0.3s all ease-in-out;
    cursor: pointer;
    font-size: 12px;
}
.register-button:hover {
    border: 1px solid orange;
    color: orange;
}
</style>
