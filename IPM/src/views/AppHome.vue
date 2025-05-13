<template>
    <main class="home-page"> 
        <!-- Director view -->
        <div v-if="session.type == 'director'" style="display: flex; align-items: center; justify-content: center; padding: 85px 150px;">
        <div style="display: flex; width: 920px; flex-wrap: wrap; align-items: center; justify-content: center; gap: 90px;">
            <button class="button">
                <span class="group">
                    <span class="material-symbols-outlined">bolt</span>
                    <span class="title">Geração de Horários</span>
                </span>
                <span class="text" style="width: 268px;">Atribuição automática de horários a alunos selecionados</span>
            </button>

            <button class="button" @click="isOpen = true">
                <span class="group">
                    <span class="material-symbols-outlined">public</span>
                    <span class="title">Publicação de Horários</span>
                </span>
                <span class="text" style="width: 264px;">Disponibilização dos horários aos respetivos alunos</span>
            </button>

            <button class="button">
                <span class="group">
                    <span class="material-symbols-outlined">build</span>
                    <span class="title">Alocação Manual</span>
                </span>
                <span class="text" style="width: 270px;">Atribuição manual de horário a um aluno selecionado</span>
            </button>

            <button class="button">
                <span class="group">
                    <span class="material-symbols-outlined">emergency_home</span>
                    <span class="title">Gestão de Conflitos</span>
                </span>
                <span class="text" style="width: 239px;">Visualização e resolução de conflitos em horários</span>
            </button>
        </div>
        
        <div class="h-screen w-screen bg-black/20 duration-200 flex flex-col transition-all fixed" v-if="isOpen" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; " @click="isOpen = false">
            <div class="popup">
                <p style="width: 350px">Tem a certeza que deseja {{ isVisible ? 'ocultar' : 'publicar' }} os horários?</p>
                <div style="display: flex; gap: 110px; justify-content: center; align-items: center;">
                    <button class="popup-button" @click="isOpen = false" style="color: #823142; background-color: #CDADB3;">Não</button>
                    <button class="popup-button" @click="toggleVisibility" style="color: #166D20; background-color: #166D2066;">Sim</button>
                </div>
            </div>
        </div>
        </div>

        <!-- Student view -->
        <div v-if="session.type == 'student'" class="!pt-[130px] !px-[85px]">
            <div class="flex flex-row justify-between">
                <h1 class="text-primary font-semibold text-3xl">O Meu Horário</h1>
                <button class="!bg-primary text-white !px-3 !text-base rounded-xl">
                    Exportar
                </button>
            </div>
            <div class="!pt-8">
                <WeeklySchedule :studentId="Number(session.id)"/>
            </div>
        </div>
        

    </main>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';
import { getSchedulesVisibility, updateSchedulesVisibility } from '../api';
import { useSessionStorage } from '@/stores/session';
import WeeklySchedule from '@/components/schedules/WeeklySchedule.vue';

const isOpen = ref(false);
const isVisible = ref(false);
const session = useSessionStorage();

onMounted(async () => {
    isVisible.value = await getSchedulesVisibility();
});

async function toggleVisibility() {
    await updateSchedulesVisibility(!isVisible.value);
    isVisible.value = !isVisible.value;
}

</script>

<style scoped>

.button {
    height: 262px;
    width: 378px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    box-shadow: 0px 4px 25px 0px rgba(0, 59, 96, 0.15);
    padding: 50px 5px; gap: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.button:hover {
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0px 4px 25px 0px rgba(0, 59, 96, 0.30);
    transition: ease-out 0.5ms;
    transform: scale(1.01);
}

.popup {
    width: 462px;
    height: 259px;
    padding: 30px;
    background-color: #FAFAFA;
    border-radius: 25px;
    color: #024B78;
    font-weight: 400;
    font-size: 25px;
    border-bottom: #66666633 solid 1px;
    text-align: center;
    gap: 40px;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
}

.popup-button {
    display: flex;
    width: 118.377px;
    height: 48px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    font-size: 25px;
    font-weight: 400;
    border-radius: 25px;
}

.popup-button:hover {
    box-shadow: 0px 4px 25px 0px rgba(0, 59, 96, 0.10);
    transition: ease-out 0.5ms;
    transform: scale(1.01);
}

.group {
    gap: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.group .material-symbols-outlined {
    font-size: 50px;
    color: rgba(2, 75, 120, 1);
}

.title {
    font-weight: bold;
    color: #024B78;
    font-size: 28px;
    text-align: center;
}

.text {
    font-weight: normal;
    color: #666;
    font-size: 18px;
    text-align: center;
}

</style>