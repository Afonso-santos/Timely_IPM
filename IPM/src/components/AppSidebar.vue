<template>
    <aside :class="{ 'is-expanded': is_expanded }">

        <div class="top-section">
            <div class="logo" v-show="is_expanded">
                <img src="../assets/logo-white.svg" alt="Logo" />
            </div>
    
            <div class="menu-toggle-wrap">
                <button class="menu-toggle" @click="() => { ToggleMenu(); if (isUserExpanded) toggleUserMenu(); }">
                    <span class="material-icons toggle-icon">
                        keyboard_double_arrow_right
                    </span>
                </button>
            </div>
        </div>

        <div class="menu">
            <router-link class="button" to="/">
                <span class="material-icons">schedule</span>
                <span class="text">Horários</span>
            </router-link>
            <router-link class="button" to="/about">
                <span class="material-icons">pending_actions</span>
                <span class="text">Tarefas</span>
            </router-link>
            <router-link class="button" to="/">
                <span class="material-icons">groups</span>
                <span class="text">Alunos</span>
            </router-link>
            <router-link class="button" to="/">
                <span class="material-icons">school</span>
                <span class="text">UCs</span>
            </router-link>
            <router-link class="button" to="/">
                <span class="material-icons">chat</span>
                <span class="text">Pedidos</span>
            </router-link>
            <router-link class="button" to="/">
                <span class="material-icons">equalizer</span>
                <span class="text">Estatísticas</span>
            </router-link>
        </div>

        <div class="user-section" ref="userMenuRef" :class="{ collapsed: !is_expanded }">
            <div class="user-menu" v-if="isUserExpanded">
                <router-link to="/perfil" class="menu-option">Página de Perfil</router-link>
                <div class="menu-option logout" @click="logout">Terminar Sessão</div>
            </div>
            <img class="user-avatar" src="../assets/avatar.png" alt="Avatar" />
            <div class="user-info">
                <p class="user-name">Diana Cunha</p>
                <p class="user-role">Diretora de Curso</p>
            </div>
            <span
                class="material-icons arrow-icon"
                :class="{ 'rotate-180': isUserExpanded }"
                v-show="is_expanded"
                @click="toggleUserMenu"
            >
                expand_more
            </span>
        </div>

    </aside>
</template>
  
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const is_expanded = ref(false);
const isUserExpanded = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

const ToggleMenu = () => {
    is_expanded.value = !is_expanded.value;
};

const toggleUserMenu = () => {
    isUserExpanded.value = !isUserExpanded.value;
};

const logout = () => {
    // Perform logout logic here
    console.log('Logging out...');
    router.push('/login');
};

const handleClickOutside = (event: MouseEvent) => {
        if (
            userMenuRef.value && 
            !userMenuRef.value.contains(event.target as Node)
        ) {
            isUserExpanded.value = false;
        }
    };

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>
  
<style scoped>

    aside {
        background-color: var(--primary);
        color: var(--light);
        min-height: 100vh;
        width: calc(2rem + 32px);
        transition: width 0.2s ease-out;
        overflow: hidden;
        border-radius: 0px 30px 30px 0px;
    
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    aside.is-expanded {
        width: var(--sidebar-with);
        align-items: flex-start;

        .button .text {
            opacity: 1;
        }
    }
    
    .top-section {
        display: flex;
        align-items: center;
        width: 100%;
        height: 4rem;
        position: relative;
        padding: 1rem;
        margin-top: 5rem;
        margin-bottom: 3rem;
        justify-content: center;
        gap: 1rem;
    }

    aside.is-expanded .top-section {
        justify-content: space-between;
    }
    
    .logo {
        opacity: 0;
        transform: translateY(-10px);
        transition: opacity 0.2s ease-out, transform 0.2s ease-out;
        margin-left: 1rem;
        pointer-events: none;
        visibility: hidden;
    
        img {
            width: 220px;
        }
    }
    
    aside.is-expanded .logo {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
        visibility: visible;
    }
    
    .menu-toggle-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.2s ease-out;
    }
    
    .menu-toggle {
        display: flex;
        justify-content: center;
        background: none;
        border: none;
        cursor: pointer;
        margin-bottom: 8.5rem;
    
        .material-icons {
            font-size: 2rem;
            color: var(--light);
            transition: transform 0.2s ease;
        }
    }

    .button .text {
        opacity: 0;
        transition: 0.2s ease-out;
    }

    .menu {
        width: 100%;
        
        .button {
            display: flex;
            align-items: center;
            text-decoration: none;

            padding: 1.2rem 3rem;

            transition: 0.2s ease-out;

            .material-icons {
                font-size: 2.2rem;
                color: var(--light);
                margin-right: 1rem;
                margin-left: -2.1rem;
                transition: 0.2s ease;
            }

            .text {
                font-size: 1.2rem;
                font-weight: 400;
                color: var(--light);
                transition: 0.2s ease-out;
            }

            &:hover {
                background-color: var(--primary-hover);
            }
        }
    }

    aside.is-expanded .menu .button .material-icons {
        margin-left: 0;
        transition: 0.2s ease-out;
    }
    
    aside.is-expanded .toggle-icon {
        transform: rotate(180deg);
    }

    .user-section {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 1rem 0rem;
        margin-left: 1.45rem;
        gap: 1rem;
        transition: all 0.2s ease;
        margin-bottom: 2rem;
        margin-top: auto;
    }

    .user-avatar {
        background-color: var(--light);
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 9999px;
    }

    .user-info {
        flex: 1;
        opacity: 0;
        overflow: hidden;
        transition: all 0.2s ease-out;
        pointer-events: none;
        white-space: nowrap;
    }

    .user-name {
        font-size: 0.9rem;
        font-weight: 600;
    }

    .user-role {
        font-size: 0.75rem;
        opacity: 0.8;
    }

    .arrow-icon {
        cursor: pointer;
        color: var(--light);
    }
    
    aside.is-expanded .user-info {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.2s ease-out;
    }

    aside.is-expanded .user-section {
        padding: 1rem 2rem;
        margin-left: 0;
    }

    /* User dropdown menu */
    .user-menu {
        position: absolute;
        bottom: 6rem;
        left: 7rem;
        background-color: white;
        border-radius: 1rem;
        padding: 1rem;
        box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        min-width: 180px;
        z-index: 10;
    }

    .menu-option {
        text-decoration: none;
        font-size: 0.9rem;
        text-align: center;
        color: #6b7280;
        cursor: pointer;
        transition: color 0.2s;
    }

    .menu-option.logout {
        color: #9b5555;
    }

    .menu-option:hover {
        color: #374151;
    }

    .menu-option.logout:hover {
        color: #7f1d1d;
    }
    
    @media (max-width: 768px) {
        aside {
            position: fixed;
            z-index: 99;
        }
    }
</style>
  