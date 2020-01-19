<template>
    <div class="navbar-container">
        <nav>
            <input type="checkbox" id="nav-toggle" />
            <label for="nav-toggle" class="burger-menu">
                <img src="@/assets/menu.png" alt="" />
            </label>
            <div class="left-menu">
                <n-link to="/about">About</n-link>
                <n-link to="/contact">Contact</n-link>
            </div>
            <n-link to="/" class="logo">METEOR</n-link>
            <div class="right-buttons">
                <login-button />
                <register-button />
            </div>
        </nav>
    </div>
</template>
<script>
import LoginButton from '@/components/LoginButton.vue'
import RegisterButton from '@/components/RegisterButton.vue'
export default {
    name: 'PublicNavbar',
    components: {
        LoginButton,
        RegisterButton
    }
}
</script>
<style scoped>
.navbar-container {
    width: 100%;
    background: black;
}
nav a {
    color: white;
    text-decoration: none;
    text-transform: uppercase;
    transition: 0.3s all ease-in-out;
}

nav a:hover {
    color: orange;
}
nav {
    max-width: 1720px;
    margin: 0 auto;

    display: grid;
    grid-template-columns: 1fr auto 1fr;
}
#nav-toggle,
.burger-menu {
    display: none;
}
.burger-menu {
    width: 40px;
}
@media only screen and (max-width: 1025px) {
    .burger-menu {
        display: inline-block;

        align-self: center;
    }

    .left-menu {
        display: none;
    }

    .right-buttons {
        display: none;
    }

    #nav-toggle:checked ~ .left-menu {
        display: grid;
        grid-row: 2;
    }

    #nav-toggle:checked ~ .right-buttons {
        display: grid;
        grid-row: 2;
    }
}
.left-menu a {
    padding: 10px 0;
    margin-left: 20px;
    font-size: 14px;
    font-weight: 300;
    letter-spacing: 0.5px;
}
.left-menu {
    grid-column: 1;

    align-self: center;
}
.logo {
    font-size: 40px;
    padding: 1rem;

    grid-column: 2;
}
.right-buttons {
    grid-column: 3;

    justify-self: end;
    align-self: center;
}
.right-buttons a {
    margin-right: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
