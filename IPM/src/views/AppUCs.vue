<template>
    <main class="home-page" style="display: flex; align-items: center; justify-content: center;"> 
        
        <div class style="display: flex; flex-direction: column; width: 1000px; align-items: flex-start; justify-content: center; gap: 35px; padding: 156px 0px;">
        
            <span class="title">Unidades Curriculares</span>

            <!-- Director View -->
            <span v-if="session.type == 'director'" class style="display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 10px;">
                
                <span class="card">
                    <span class="group">
                        <router-link
                            v-for="course in courses1"
                            :key="course.id"
                            :to="`/ucs/${course.abbreviation}`"
                            class="text"
                        >
                            {{ course.name }}
                        </router-link>
                    </span>
                    <span class="label">1º Ano</span>
                </span>
    
                <span class="card">
                    <span class="group">
                        <router-link
                            v-for="course in courses2"
                            :key="course.id"
                            :to="`/ucs/${course.abbreviation}`"
                            class="text"
                        >
                            {{ course.name }}
                        </router-link>
                    </span>
                    <span class="label">2º Ano</span>
                </span>
    
                <span class="card">
                    <span class="group">
                        <router-link
                            v-for="course in courses3"
                            :key="course.id"
                            :to="`/ucs/${course.abbreviation}`"
                            class="text"
                        >
                            {{ course.name }}
                        </router-link>
                    </span>
                    <span class="label">3º Ano</span>
                </span>
    
                <span class="card" style="align-items: center;">
                    <span class style="font-weight: normal; font-size: 18px; text-align: center; letter-spacing: 0.54px; color: #939393B2">Nenhuma Unidade Curricular a mostrar.</span>
                    <span class="label" style="margin-left: 825px;">4º Ano</span>
                </span>

            </span>


            <!-- Student View -->
            <span :if="session.type == 'student'" class style="display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 10px;">
                
                <span v-if="studentCourses1.length > 0" class="card">
                    <span class="group">
                        <router-link
                            v-for="course in studentCourses1"
                            :key="course.id"
                            :to="`/ucs/${course.abbreviation}`"
                            class="text"
                        >
                            {{ course.name }}
                        </router-link>
                    </span>
                    <span class="label">1º Ano</span>
                </span>
    
                <span v-if="studentCourses2.length > 0" class="card">
                    <span class="group">
                        <router-link
                            v-for="course in studentCourses2"
                            :key="course.id"
                            :to="`/ucs/${course.abbreviation}`"
                            class="text"
                        >
                            {{ course.name }}
                        </router-link>
                    </span>
                    <span class="label">2º Ano</span>
                </span>
    
                <span v-if="studentCourses3.length > 0" class="card">
                    <span class="group">
                        <router-link
                            v-for="course in studentCourses3"
                            :key="course.id"
                            :to="`/ucs/${course.abbreviation}`"
                            class="text"
                        >
                            {{ course.name }}
                        </router-link>
                    </span>
                    <span class="label">3º Ano</span>
                </span>

            </span>
            
        </div>

    </main>
</template>

<script setup lang="ts">
import { getCoursesByYearAndSemester , getCoursesByStudentId } from '../api';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { Course } from '../types';
import { useSessionStorage } from '@/stores/session';

const route = useRoute()
const session = useSessionStorage()
const courses1 = ref<Course[]>([])
const courses2 = ref<Course[]>([])
const courses3 = ref<Course[]>([])

const studentId = session.id
const studentCourses = ref<Course[]>([])
const studentCourses1 = ref<Course[]>([])
const studentCourses2 = ref<Course[]>([])
const studentCourses3 = ref<Course[]>([])

onMounted(async () => {
    courses1.value = await getCoursesByYearAndSemester(1, 2)
    courses2.value = await getCoursesByYearAndSemester(2, 2)
    courses3.value = await getCoursesByYearAndSemester(3, 2)
    studentCourses.value = await getCoursesByStudentId(Number(studentId))
    studentCourses1.value = studentCourses.value.filter((course) => Number(course.year) == 1)
    studentCourses2.value = studentCourses.value.filter((course) => Number(course.year) == 2)
    studentCourses3.value = studentCourses.value.filter((course) => Number(course.year) == 3)
})
</script>

<style scoped>

.card {
    height: 275px;
    width: 1000px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    box-shadow: 0px 4px 25px 0px rgba(0, 59, 96, 0.10);
    padding: 50px 40px; gap: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    text-align: start;
}

.label {
    height: 275px;
    width: 175px;
    display: flex;
    position: absolute;
    margin-left: 785px;
    border-radius: 0px 20px 20px 0px;
    background-color: #024B7866;
    font-weight: bold;
    color: #024B78;
    font-size: 28px;
    text-align: center;
    align-items: flex-end;
    justify-content: center;
    padding: 25px;
}

.group {
    gap: 6px;
    display: flex;
    flex-direction: column;
    align-items: start;
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
    letter-spacing: 0.54px;
}

.text:hover {
    color: #024B78;
    cursor: pointer;
}

</style>