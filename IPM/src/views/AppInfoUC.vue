<template>
    <main>
        <div v-if="course && teachers" class="!pt-[156px] !px-[85px]">
            <h1 class="text-primary font-semibold text-3xl">
                {{ course.name }} ({{ course.abbreviation }})
            </h1>
            <div class="flex flex-col gap-5 !pt-[64px]">
                <div class="flex flex-row gap-5 h-[540px]">
                    <!-- Left Column -->
                    <div class="w-full flex flex-col gap-5 h-[500px]">
                        <!-- Teachers Card -->
                        <div class="w-full h-full rounded-[20px] bg-white primary-shadow">
                            <h2 class="text-primary font-medium text-2xl !px-10 !pt-10">Docentes</h2>
                            <div class="flex flex-col !px-10 !pt-6 text-stone-500 text-lg font-['Space_Grotesk'] tracking-wide">
                                <span v-for="teacher in teachers" :key="teacher.id" class="font-normal">
                                    {{ teacher.name }}
                                </span>
                                <span v-if="teachers.length == 0">
                                    Nenhum docente atribuído.
                                </span>
                            </div>
                        </div>
                        <!-- Students Card -->
                        <div class="w-full h-full rounded-[20px] bg-white primary-shadow">
                            <h2 class="text-primary font-medium text-2xl !px-7 !py-8">Alunos</h2>
                            <div class="flex justify-center gap-5 !px-10 !pt-8 items-start">
                                <span class="flex flex-row w-full gap-2 text-stone-500 text-xl font-semibold font-['Space_Grotesk'] tracking-wide"> 
                                    <span class="font-semibold">179</span>
                                    <span class="font-normal">Inscritos</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Schedule Card -->
                    <div class="w-full rounded-[20px] h-[540px] bg-white primary-shadow overflow-hidden">
                        <CourseWeeklySchedule :courseId="course.id" />
                    </div>
                </div>

                <!-- Statistics Card -->
                <div class="w-full rounded-[20px] h-[250px] bg-white primary-shadow !px-7 !py-8">
                    <h2 class="text-primary font-medium text-2xl">Estatísticas</h2>
                    <div class="flex flex-row w-full shrink-0">
                        <div class="flex flex-col items-center w-full">
                            <div class="flex flex-row scale-90">
                                <div class="flex flex-col items-center -translate-y-2">
                                    <RingChart id="schedule-status" :chartData=" {
                                        datasets: [
                                            { 
                                                data: [42, 58], 
                                                backgroundColor: ['#ffffff', '#6692ad'] 
                                            }]
                                    }"/>
                                    <p class="text-primary font-medium -translate-y-2">PL1</p>
                                </div>
                                <div class="flex flex-col items-center -translate-y-2">
                                    <RingChart id="schedule-status" :chartData=" {
                                        datasets: [
                                            { 
                                                data: [60, 40], 
                                                backgroundColor: ['#ffffff', '#6692ad'] 
                                            }]
                                    }"/>
                                    <p class="text-primary font-medium -translate-y-2">PL2</p>
                                </div>
                                <div class="flex flex-col items-center -translate-y-2">
                                    <RingChart id="schedule-status" :chartData=" {
                                        datasets: [
                                            { 
                                                data: [30, 70], 
                                                backgroundColor: ['#ffffff', '#6692ad'] 
                                            }]
                                    }"/>
                                    <p class="text-primary font-medium -translate-y-2">PL3</p>
                                </div>
                                <div class="flex flex-col items-center -translate-y-2">
                                    <RingChart id="schedule-status" :chartData=" {
                                        datasets: [
                                            { 
                                                data: [10, 90], 
                                                backgroundColor: ['#ffffff', '#6692ad'] 
                                            }]
                                    }"/>
                                    <p class="text-primary font-medium -translate-y-2">PL4</p>
                                </div>
                            </div>
                        </div>
                        <div class="w-full flex flex-col items-center h-max">
                            <BarChart id="conflicts-per-year" :chartData=" {
                                labels: ['PL1', 'PL2', 'PL3', 'PL4', 'PL5'],
                                datasets: [
                                    { 
                                        data: [29, 20, 35, 45, 50],
                                        backgroundColor: ['#a5bac7', '#a5bac7', '#a5bac7', '#a5bac7', '#a5bac7'] 
                                    }]
                            }"/>
                            <p class="text-stone-500">Alunos por turno</p>
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
import { getCourseByAbbreviation, listCourseTeachers } from '@/api';
import { useRoute } from 'vue-router';
import CourseWeeklySchedule from '@/components/schedules/CourseWeeklySchedule.vue';

export default {
    name: 'AppInfoUC',
    components: {
        DoughnutChart,
        BarChart,
        RingChart,
        CourseWeeklySchedule
    },
    setup() {
        const course = ref(null);
        const teachers = ref([]);
        const route = useRoute();
        const sidebar = useSidebarStore();

        onMounted(() => {
            sidebar.closeSidebar();

            getCourseByAbbreviation(route.params.abbreviation).then((response) => {
                course.value = response;
                listCourseTeachers(response.id).then((response) => {
                    teachers.value = response;
                });
            });    
        });

        return {
            course,
            teachers
        };
    }
};
</script>
