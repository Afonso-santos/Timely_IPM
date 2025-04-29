<template>
    <main>
        <div v-if="showContent" class="!pt-[156px] !px-[85px]">
            <h1 class="text-primary font-semibold text-3xl">Estatísticas</h1>
            <div class="flex flex-col gap-5 !pt-[64px]">
                <div class="flex flex-row gap-5 h-[540px]">
                    <div class="w-full rounded-[20px] h-[540px] bg-white primary-shadow !px-7 !py-8">
                        <h2 class="text-primary font-medium text-2xl">Pedidos</h2>
                        <div class="flex w-full justify-center items-center flex-col h-full">
                            <DoughnutChart id="request-status" :chartData=" {
                                labels: ['Aprovados', 'Recusados', 'Pendentes'],
                                datasets: [
                                    { 
                                        data: [approvedRequests, rejectedRequests, pendingRequests],
                                        backgroundColor: ['#72a778', '#b3828d', '#6692ad'] 
                                    }]
                            }"/>
                        </div>
                    </div>
                    <div class="w-full flex flex-col gap-5 h-[500px]">
                        <div class="w-full h-full rounded-[20px] bg-white primary-shadow">
                            <h2 class="text-primary font-medium text-2xl !px-7 !pt-8">Horários</h2>
                            <div class="flex flex-row justify-center gap-12">
                                <div class="flex flex-col items-center -translate-y-2">
                                    <RingChart id="schedule-status" :chartData=" {
                                        datasets: [
                                            { 
                                                data: [70, 30], 
                                                backgroundColor: ['#ffffff', '#6692ad'] 
                                            }]
                                    }"/>
                                    <p class="text-sm font-medium text-primary -translate-y-2">Por Atribuir</p>
                                </div>
                                <div class="flex flex-col items-center -translate-y-2">
                                    <RingChart id="schedule-status" :chartData=" {
                                        datasets: [
                                            { 
                                                data: [percentageOfStudentsWithConflicts, 100 - percentageOfStudentsWithConflicts], 
                                                backgroundColor: ['#ffffff', '#6692ad'] 
                                            }]
                                    }"/>
                                    <p class="text-sm font-medium text-primary -translate-y-2">Com Conflitos</p>
                                </div>
                            </div>
                        </div>
                        <div class="w-full h-full rounded-[20px] bg-white primary-shadow">
                            <h2 class="text-primary font-medium text-2xl !px-7 !py-8">Turnos</h2>
                            <div class="flex flex-row justify-center gap-12">
                                <div class="flex flex-col items-center -translate-y-2">
                                    <RingChart id="schedule-status" :chartData=" {
                                        datasets: [
                                            { 
                                                data: [60, 40], 
                                                backgroundColor: ['#ffffff', '#6692ad'] 
                                            }]
                                    }"/>
                                    <p class="text-sm font-medium text-primary -translate-y-2">Turnos Completos</p>
                                </div>
                                <div class="flex flex-col items-center -translate-y-2">
                                    <RingChart id="schedule-status" :chartData=" {
                                        datasets: [
                                            { 
                                                data: [30, 70], 
                                                backgroundColor: ['#ffffff', '#6692ad'] 
                                            }]
                                    }"/>
                                    <p class="text-sm font-medium text-primary -translate-y-2">Ocupação Média</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full rounded-[20px] h-[250px] bg-white primary-shadow !px-7 !py-8">
                    <h2 class="text-primary font-medium text-2xl">Alunos</h2>
                    <div class="flex flex-row">
                        <div class="flex flex-col items-center w-full text-secondary font-medium">
                            <BarChart id="students-per-year" :chartData=" {
                                labels: ['1º Ano', '2º Ano', '3º Ano'],
                                datasets: [
                                    { 
                                        data: [firstYearConflicts, secondYearConflicts, thirdYearConflicts], 
                                        backgroundColor: ['#a5bac7', '#a5bac7', '#a5bac7'] 
                                    }]
                            }"/>
                            <p class="text-sm font-normal">Alunos com Conflitos no Horário</p>
                        </div>
                        <div class="flex flex-col items-center w-full text-secondary font-medium">
                            <BarChart id="conflicts-per-year" :chartData=" {
                                labels: ['1º Ano', '2º Ano', '3º Ano'],
                                datasets: [
                                    { 
                                        data: [firstYearToAssign, secondYearToAssign, thirdYearToAssign],
                                        backgroundColor: ['#a5bac7', '#a5bac7', '#a5bac7'] 
                                    }]
                            }"/>
                            <p class="text-sm font-normal">Alunos com Horário por Atribuir</p>
                        </div>
                        <div class="flex flex-col items-center w-full text-secondary font-medium">
                            <BarChart id="requests-per-year" :chartData=" {
                                labels: ['1º Ano', '2º Ano', '3º Ano'],
                                datasets: [
                                    { 
                                        data: [firstYearRequests, secondYearRequests, thirdYearRequests],
                                        backgroundColor: ['#a5bac7', '#a5bac7', '#a5bac7'] 
                                    }]
                            }"/>
                            <p class="text-sm font-normal">Pedidos por Alunos por Ano</p>
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
import { getPercentageOfStudentsWithConflicts, listRequestsByYearStatistics, listRequestStatusStatistics, listStudentsWithIncompleteSchedulesByYearStatistics, listUsersWithConflictsByYearStatistics } from '../api';

export default {
    name: 'AppStatistics',
    components: {
        DoughnutChart,
        BarChart,
        RingChart
    },
    setup() {
        const showContent = ref(false);
        const sidebar = useSidebarStore();

        const pendingRequests = ref(0);
        const approvedRequests = ref(0);
        const rejectedRequests = ref(0);

        const firstYearConflicts = ref(0);
        const secondYearConflicts = ref(0);
        const thirdYearConflicts = ref(0);

        const firstYearRequests = ref(0);
        const secondYearRequests = ref(0);
        const thirdYearRequests = ref(0);

        const firstYearToAssign = ref(0);
        const secondYearToAssign = ref(0);
        const thirdYearToAssign = ref(0);

        const percentageOfStudentsWithConflicts = ref(0);

        onMounted(() => {
            listRequestStatusStatistics().then((response) => {
                pendingRequests.value = response.pending;
                approvedRequests.value = response.approved;
                rejectedRequests.value = response.denied;
            });
            listUsersWithConflictsByYearStatistics().then((response) => {
                firstYearConflicts.value = response.firstYear;
                secondYearConflicts.value = response.secondYear;
                thirdYearConflicts.value = response.thirdYear;
            });
            listRequestsByYearStatistics().then((response) => {
                firstYearRequests.value = response.firstYear;
                secondYearRequests.value = response.secondYear;
                thirdYearRequests.value = response.thirdYear;
            });
            listStudentsWithIncompleteSchedulesByYearStatistics().then((response) => {
                firstYearToAssign.value = response.firstYear * 3;
                secondYearToAssign.value = response.secondYear * 3;
                thirdYearToAssign.value = response.thirdYear * 3;
            });
            getPercentageOfStudentsWithConflicts().then((response) => {
                percentageOfStudentsWithConflicts.value = response;
            });
            sidebar.closeSidebar();
            setTimeout(() => {
                showContent.value = true;
            }, 200);
        });

        return { showContent, sidebar, pendingRequests, approvedRequests, rejectedRequests, firstYearConflicts, secondYearConflicts, thirdYearConflicts, firstYearRequests, secondYearRequests, thirdYearRequests, firstYearToAssign, secondYearToAssign, thirdYearToAssign, percentageOfStudentsWithConflicts };
    }
};
</script>
