<template>
  <main
    class="w-screen h-screen bg-sky-900/20 backdrop-blur-[2px] flex items-center justify-center"
    style="background: linear-gradient(135deg, rgba(131, 49, 66, 1) 0%, rgba(8, 73, 117, 1) 100%)"
  >
    <div
      class="flex flex-col items-center justify-center w-[700px] h-[750px] bg-white rounded-[30px] pt-[141px] pb-[141px] px-[86px] gap-[89px] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.25)]"
    >
      <img class="w-[250px]" src="../assets/logo-red.svg" alt="Logo" />

      <div class="flex flex-col items-center justify-center gap-[24px]">
        <div class="flex flex-col gap-[20px]">
          <div class="w-[528px] inline-flex flex-col justify-start items-start gap-1">
            <div class="self-stretch h-7 relative">
              <label
                class="left-0 top-0 absolute justify-start text-cyan-700 text-base font-normal font-['Space_Grotesk']"
                >Email</label
              >
            </div>
            <input
              type="text"
              class="box-border self-stretch h-14 relative rounded-[30px] outline outline-1 outline-offset-[-1.10px] outline-cyan-700 px-[10px] w-full w-80 text-xl font-normal font-['Space_Grotesk'] text-stone-500"
              style="padding: 25px"
              v-model="email"
              required
            />
          </div>

          <div class="w-[528px] inline-flex flex-col justify-start items-start gap-1">
            <div class="self-stretch h-7 relative">
              <label
                class="left-0 top-0 absolute justify-start text-cyan-700 text-base font-normal font-['Space_Grotesk']"
                >Password</label
              >
            </div>
            <input
              type="password"
              class="self-stretch h-14 relative rounded-[30px] outline outline-1 outline-offset-[-1.10px] outline-cyan-700 px-[10px] w-full w-80 text-xl font-normal font-['Space_Grotesk'] text-stone-500"
              style="padding: 25px"
              v-model="password"
              required
            />
          </div>
        </div>

        <button
          class="inline-flex flex-col justify-center items-center gap-2"
          @click.prevent="login"
        >
          <div
            class="w-[528px] h-16 relative opacity-90 bg-sky-900 rounded-[30px] shadow-[0px_4px_4px_0px_rgba(29,53,87,0.25)] overflow-hidden"
          >
            <div
              class="left-[231.50px] top-[17.50px] absolute inline-flex justify-center items-center gap-2"
            >
              <div
                class="text-center justify-center text-white text-xl font-medium font-['Space_Grotesk']"
              >
                Log in
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import * as api from '../api.ts'
import { ref } from 'vue'
import { useSessionStorage } from '@/stores/session'
import { useRouter } from 'vue-router'

const session = useSessionStorage()
const router = useRouter()

const email = ref('')
const password = ref('')

async function login() {
  const token = await api.login(email.value, password.value)
  if (token) {
    session.login(String(token.id), token.name, token.type, token.email)
    router.push('/')
  } else {
    alert('Invalid email or password!')
  }
}
</script>
