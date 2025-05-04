<template>
    <main>
        <div v-if="showContent" class="!pt-[156px] !px-[85px]">
            <h1 class="text-primary font-semibold text-3xl">
                Interface Pessoa-Máquina (IPM)
            </h1>
            <div class="flex flex-col gap-5 !pt-[64px]">
                <div class="flex flex-row gap-5 h-[540px]">
                    
                    <div class="w-full flex flex-col gap-5 h-[500px]">
                        <div class="w-full h-full rounded-[20px] bg-white primary-shadow">
                            <h2 class="text-primary font-medium text-2xl !px-10 !pt-10">Docentes</h2>
                            <div class="flex flex-col !px-10 !pt-8 text-stone-500 text-lg font-['Space_Grotesk'] tracking-wide inline-flex items-start">
                                <span class="flex flex-row items-center gap-2"> 
                                    <span class="font-medium">José Francisco Creissac Freitas Campos</span>
                                    <span class="material-symbols-outlined">crown</span>
                                </span>
                                <span class="font-normal">Daniel Rodrigues Pacheco Murta</span>
                                <span class="font-normal">Rafael Braga Gomes Costa</span>
                            </div>
                        </div>
                        <div class="w-full h-full rounded-[20px] bg-white primary-shadow">
                            <h2 class="text-primary font-medium text-2xl !px-7 !py-8">Alunos</h2>
                            <div class="flex justify-center gap-5 !px-10 !pt-8 items-start">
                                <span class="flex flex-row items-center gap-2 text-stone-500 text-xl font-semibold font-['Space_Grotesk'] tracking-wide"> 
                                    <span class="font-semibold">179</span>
                                    <span class="font-normal">Inscritos</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="w-full rounded-[20px] h-[540px] bg-white primary-shadow !px-7 !py-8">
                        <h2 class="text-primary font-medium text-2xl">Horário</h2>
                        <div class="flex w-full justify-center items-center flex-col h-full">
                        </div>
                    </div>
                </div>
                <div class="w-full rounded-[20px] h-[250px] bg-white primary-shadow !px-7 !py-8">
                    <h2 class="text-primary font-medium text-2xl">Estatísticas</h2>
                    <div class="flex flex-row">
                        <div class="flex flex-col items-center w-full text-secondary font-medium">
                            
                        </div>
                        <div class="flex flex-col items-center w-full text-secondary font-medium">
                            
                        </div>
                        <div class="flex flex-col items-center w-full text-secondary font-medium">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { ref, onMounted } from 'vue';
import DoughnutChart from '@/components/graphs/DoughnutChart.vue';
import BarChart from '@/components/graphs/BarChart.vue';
import RingChart from '@/components/graphs/RingChart.vue';
import { useSidebarStore } from '@/stores/sidebar';
import { getCourseByAbbreviation } from '@/api';

export default {
    name: 'AppInfoUC',
    components: {
        DoughnutChart,
        BarChart,
        RingChart
    },
    setup() {
        const showContent = ref(false);
        const sidebar = useSidebarStore();
        //const course = getCourseByAbbreviation(courseAbbreviation);

        onMounted(() => {
            sidebar.closeSidebar();
            setTimeout(() => {
                showContent.value = true;
            }, 200);
        });

        return { showContent };
    }
};
</script>
