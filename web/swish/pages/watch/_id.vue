<template>
  <span>
    <section class="masthead">
      <div class="profile-container">
        <div class="profile-icon"></div>
      </div>
    </section>
    <main class="main-page"></main>
  </span>
</template>

<script lang="ts">
export default {};
</script>

<style scoped>
.masthead {
  display: flex;
  width: 100%;
  height: 3.5em;
  justify-content: flex-end;
  background-color: cyan;
}
.masthead > .profile-container {
  width: 3.5em;
  height: 100%;
  padding: 0px;
  background-color: green;
}
.masthead > .profile-container > .profile-icon {
  background-color: red;
  width: 3.2em;
  height: 3.2em;
  border-radius: 50%;
}
.main {
  width: 100vw;
  height: 100vh;

  display: grid;
}
</style>
