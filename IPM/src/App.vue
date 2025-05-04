<script setup lang="ts">
    import './index.css'
    import AppSidebar from './components/AppSidebar.vue';
    import { Toaster } from 'vue-sonner'
    import { useRoute } from 'vue-router'

    const route = useRoute();
</script>

<template>
    <div class="app">
        <AppSidebar v-if="route.path != '/login'" class="sidebar" />
        <Toaster richColors />
        <router-view :key="$route.fullPath" />
    </div>
</template>

<style lang="css">
:root {
    --primary: #024B78;
    --primary-hover: #6894AC;
    --light: #F5F5F5;
    --red: #823142;
    --light-red:#CDADB3;
    --green: #166D20;
    --light-green: #166D2066;
    --sidebar-width: 325px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Space Grotesk', sans-serif;
}

body {
    background: var(--light);
    overscroll-behavior: none;
    user-select: none;
}

button {
    cursor: pointer;
    appearance: none;
    border: none;
    outline: none;
    background: none;
}

.app {
    display: flex;
}

.app main {
    flex: 1 1 0;
    padding: 2rem;
}

.sidebar {
    width: var(--sidebar-with);
    height: 100vh;
    overflow: hidden;
    position: sticky;
    top: 0;
}

@media (max-width: 768px) { /* Adjust padding for smaller screens */
    .app main {
        padding: 6rem;
    }
}
</style>