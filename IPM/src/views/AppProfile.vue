<template>
  <main
    class="profile-page"
    style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100vh;
      overflow-y: auto;
      padding: 20px;
    "
  >
    <div
      style="
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 1000px;
        align-items: flex-start;
        justify-content: center;
        gap: 20px;
        padding: 15px;
        position: relative;
        z-index: 1;
      "
    >
      <h1 class="title" style="font-weight: bold; color: #024b78; font-size: 28px; margin: 0">
        Perfil
      </h1>

      <div style="display: flex; flex-direction: column; width: 100%; justify-content: center">
        <div
          class="profile-container"
          style="
            width: 100%;
            max-width: 800px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 20px;
            box-shadow: 0px 4px 25px 0px rgba(0, 59, 96, 0.1);
            padding: 25px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: start;
          "
        >
          <!-- Mobile Avatar (shown only on mobile) -->
          <div
            class="mobile-avatar"
            style="width: 100%; display: none; justify-content: center; margin-bottom: 20px"
          >
            <img
              class="user-avatar"
              style="
                background-color: var(--light);
                width: 140px;
                height: 140px;
                border-radius: 9999px;
                border-color: #003b60;
                border-width: 3px;
              "
              src="../assets/avatar.svg"
              alt="Avatar"
            />
          </div>

          <div
            class="profile-grid"
            style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; width: 100%"
          >
            <!-- First column with form fields -->
            <div class="profile-form flex flex-col items-start justify-center gap-2">
              <div class="form-group" style="margin-bottom: 20px; width: 100%">
                <label
                  style="
                    font-size: 20px;
                    font-weight: bold;
                    color: #666666;
                    display: block;
                    margin-bottom: 8px;
                  "
                  >Nome:</label
                >
                <input
                  type="text"
                  v-model="user.name"
                  placeholder="Nome do usuário"
                  style="
                    width: 100%;
                    max-width: 380px;
                    height: 50px;
                    border-radius: 10px;
                    border: 1px solid #024b78;
                    padding-left: 20px;
                    font-size: 18px;
                    background-color: rgba(2, 75, 120, 0.05);
                  "
                />
              </div>

              <div class="form-group" style="margin-bottom: 10px; width: 100%">
                <label
                  style="
                    font-size: 20px;
                    font-weight: bold;
                    color: #666666;
                    display: block;
                    margin-bottom: 8px;
                  "
                  >Email:</label
                >
                <input
                  type="text"
                  v-model="user.email"
                  placeholder="Email do usuário"
                  style="
                    width: 100%;
                    max-width: 380px;
                    height: 50px;
                    border-radius: 10px;
                    border: 1px solid #024b78;
                    padding-left: 20px;
                    font-size: 18px;
                    background-color: rgba(2, 75, 120, 0.05);
                  "
                />
              </div>

              <div class="form-group" style="margin-bottom: 10px; width: 100%">
                <label
                  style="
                    font-size: 20px;
                    font-weight: bold;
                    color: #666666;
                    display: block;
                    margin-bottom: 8px;
                  "
                  >Senha:</label
                >
                <div class="relative" style="width: 100%; max-width: 380px">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="user.password"
                    placeholder="Senha do usuário"
                    style="
                      width: 100%;
                      height: 50px;
                      border-radius: 10px;
                      border: 1px solid #024b78;
                      padding-left: 20px;
                      font-size: 18px;
                      background-color: rgba(2, 75, 120, 0.05);
                    "
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer"
                    style="position: absolute; right: 10px; top: 75%; transform: translateY(-50%)"
                  >
                    <span
                      class="material-symbols-outlined text-gray-500 text-[20px]"
                      style="display: flex; align-items: center; height: 100%"
                    >
                      {{ showPassword ? 'visibility' : 'visibility_off' }}
                    </span>
                  </button>
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 10px; width: 100%">
                <label
                  style="
                    font-size: 20px;
                    font-weight: bold;
                    color: #666666;
                    display: block;
                    margin-bottom: 8px;
                  "
                  >Curso:</label
                >
                <span style="width: 100%; height: 50px; font-size: 18px; display: block">
                  Engenharia Informática
                </span>
              </div>

              <div class="form-group" style="margin-bottom: 10px; width: 100%">
                <label
                  style="
                    font-size: 20px;
                    font-weight: bold;
                    color: #666666;
                    display: block;
                    margin-bottom: 8px;
                  "
                  >Data de Inscrição:</label
                >
                <span style="width: 100%; height: 50px; font-size: 18px; display: block">
                  10/09/2022
                </span>
              </div>
            </div>

            <!-- Second column with avatar and buttons -->
            <div
              class="profile-actions"
              style="
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                height: 100%;
              "
            >
              <!-- Desktop Avatar (hidden on mobile) -->
              <div
                class="desktop-avatar"
                style="display: flex; justify-content: center; width: 100%"
              >
                <img
                  class="user-avatar"
                  style="
                    background-color: var(--light);
                    width: 140px;
                    height: 140px;
                    border-radius: 9999px;
                    border-color: #003b60;
                    border-width: 3px;
                  "
                  src="../assets/avatar.svg"
                  alt="Avatar"
                />
              </div>

              <!-- Buttons -->
              <div
                class="action-buttons"
                style="
                  display: flex;
                  justify-content: center;
                  gap: 20px;
                  margin-top: auto;
                  width: 100%;
                "
              >
                <button
                  class="btn"
                  style="
                    width: 140px;
                    height: 45px;
                    background-color: #ccabb2;
                    color: #823142;
                    border-radius: 70px;
                    font-size: 16px;
                  "
                  @click="resetForm"
                >
                  Limpar dados
                </button>
                <button
                  class="btn"
                  style="
                    width: 140px;
                    height: 45px;
                    background-color: #a1c3a5;
                    color: #166d20;
                    border-radius: 70px;
                    font-size: 16px;
                  "
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useSessionStorage } from '@/stores/session'

const showPassword = ref(false)
const session = useSessionStorage()

const user = reactive({
  name: session.name,
  email: session.email,
  password: '123',
})

const resetForm = () => {
  user.name = session.name
  user.email = session.email
  user.password = '123'
}
</script>

<style>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 10px !important;
    margin-left: 0 !important;
    z-index: 1;
  }

  .profile-grid {
    grid-template-columns: 1fr !important;
    gap: 15px !important;
  }

  .mobile-avatar {
    display: flex !important;
  }

  .desktop-avatar {
    display: none !important;
  }

  .profile-container {
    height: auto !important;
    padding: 15px !important;
    width: 100% !important;
  }

  .action-buttons {
    margin-top: 20px;
    flex-direction: column;
    align-items: center;
    gap: 10px !important;
  }

  .btn {
    width: 100% !important;
    max-width: 200px;
  }

  .title {
    font-size: 24px !important;
  }
}
</style>
