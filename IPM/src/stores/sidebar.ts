// stores/sidebar.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('sidebar', () => {
  const isExpanded = ref(false);
  const isUserExpanded = ref(false);

  const toggleSidebar = () => {
    isExpanded.value = !isExpanded.value;
  };

  const toggleUserMenu = () => {
    isUserExpanded.value = !isUserExpanded.value;
  };

  const closeUserMenu = () => {
    isUserExpanded.value = false;
  };

  const closeSidebar = () => {
    isExpanded.value = false;
  };

  return {
    isExpanded,
    isUserExpanded,
    toggleSidebar,
    toggleUserMenu,
    closeUserMenu,
    closeSidebar,
  };
});
