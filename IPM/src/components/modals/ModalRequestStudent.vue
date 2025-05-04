<template>
    <TransitionRoot appear :show="modelValue" as="template">
        <Dialog as="div" @close="$emit('update:modelValue', false)" class="relative z-10">
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>

            <div class="fixed inset-0">
                <div class="flex min-h-full items-center justify-center text-center">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel class="relative w-[800px] rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-4">
                            <button
                                @click="$emit('update:modelValue', false)"
                                class="absolute top-[-44px] right-0"
                            >
                                <span class="text-xl leading-none rounded-2xl w-10 h-10 bg-[#823142] text-white flex items-center justify-center hover:bg-[#922f40] focus:outline-none">
                                    <X class="w-6 h-6" />
                                </span>
                            </button>

                            <div class="border-b border-[#E7E7E7]">
                                <DialogTitle as="h3" class="text-2xl font-medium flex items-center pl-4 text-[#666666] padding-x title">
                                    <slot name="title">Default Title</slot>
                                </DialogTitle>
                            </div>

                            <div class="padding-x info">
                                <div class="flex justify-between items-center">
                                    <div class="text-right justify-center text-stone-500">Nome:</div>
                                    <div class="text-right justify-start text-black/50 font-bold leading-7">{{ student?.name }}</div>
                                </div>
                                <div class="flex justify-between items-center">
                                    <div class="text-right justify-center text-stone-500">Ano:</div>
                                    <div class="text-right justify-start text-black/50 font-bold leading-7">{{ student?.ano }}º ano</div>
                                </div>
                                <div class="flex justify-between items-center">
                                    <div class="text-right justify-center text-stone-500">Estatuto:</div>
                                    <div class="text-right justify-start text-black/50 font-bold leading-7">Estudante</div>
                                </div>
                                <div class="flex justify-between items-center">
                                    <div class="text-right justify-center text-stone-500">Unidade Curricular:</div>
                                    <div class="text-right justify-start text-black/50 font-bold leading-7">{{ course?.name }}</div>
                                </div>
                            </div>

                            <div class="justify-center text-stone-500 font-medium text-lg padding-x">Alteração de turnos</div>

                            <div class="flex justify-between items-center flex-wrap content-center padding-x shifts">
                                <div class="w-64 inline-flex flex-col justify-start items-start gap-2.5">
                                    <div class="self-stretch h-6 inline-flex justify-between items-center">
                                        <div class="text-right justify-center text-stone-500">Turno atual:</div>
                                        <div class="w-12 h-6 text-right justify-center text-stone-500 font-bold">{{ currentShiftData?.name }}</div>
                                    </div>
                                    <div class="w-30 h-5 justify-center text-sky-900 text-sm">{{ currentShiftData?.day }}, {{ currentShiftData?.from }}h</div>
                                </div>
                                <ProgressBar :current="currentEnrolledStudents" :total="currentCapacity"/>
                            </div>

                            <div class="flex justify-between items-center flex-wrap content-center padding-x shifts">
                                <div class="w-64 inline-flex flex-col justify-start items-start gap-2.5">
                                    <div class="self-stretch h-6 inline-flex justify-between items-center">
                                        <div class="text-right justify-center text-stone-500">Novo turno:</div>
                                        <div class="w-12 h-6 text-right justify-center text-stone-500 font-bold">{{ newShiftData?.name }}</div>
                                    </div>
                                    <div class="w-30 h-5 justify-center text-sky-900 text-sm">{{ newShiftData?.day }}, {{ newShiftData?.from }}h</div>
                                </div>
                                <ProgressBar :current="newEnrolledStudents" :total="newCapacity"/>
                            </div>

                            <div class="padding-x !my-4">
                                <div class="relative w-[260px]">
                                    <select 
                                        id="uc-select"
                                        v-model="selectedShift"
                                        class="!pl-4 block w-full h-[34px] bg-gray-200 text-sm text-gray-600 pr-10 rounded-[25px] appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    >
                                        <option value="" disabled selected>Selecione outro turno</option>
                                        <option
                                            v-for="shift in shifts"
                                            :key="shift.id"
                                            :value="shift.id"
                                        >
                                            {{ shift.name }}
                                        </option>
                                    </select>
                                    <ChevronsUpDown :size="15" class=" absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                                </div>
                            </div>

                            <div class="padding-x !pt-2">
                                <WeeklyCalendar
                                    :shifts="shifts_calendar"
                                    :currentShift="currentShift"
                                    :newShift="newShift"
                                />
                            </div>

                            <div class="flex justify-end gap-4 padding-x !my-5">
                                <button
                                    @click="refuseRequest"
                                    :disabled="!canSubmit"
                                    :class="[
                                        '!px-6 !py-2 rounded-md font-semibold focus:outline-none',
                                        canSubmit
                                            ? 'text-white !bg-[#7C2D3A] hover:bg-[#922f40] !border-2'
                                            : 'text-[#7C2D3A] !border-2 border-[#7C2D3A] opacity-50 !cursor-not-allowed'
                                    ]"
                                >
                                    Recusar
                                </button>
                                <button
                                    @click="approveRequest"
                                    :disabled="!canSubmit"
                                    :class="[
                                        '!px-6 !py-2 rounded-md font-semibold focus:outline-none',
                                        canSubmit
                                            ? 'text-white !bg-[#136D1E] hover:bg-[#188625] !border-2'
                                            : 'text-[#136D1E] !border-2 !border-[#136D1E] opacity-50 !cursor-not-allowed'
                                    ]"
                                >
                                    Aprovar
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
    import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
    import { ref, onMounted, watch } from 'vue'
    import { X, ChevronsUpDown } from 'lucide-vue-next'
    import WeeklyCalendar from '@/components/schedules/WeeklyCalendar.vue'
    import ProgressBar from '@/components/schedules/ProgressBar.vue'
    import type { StudentRecord } from '@/views/AppRequests.vue'
    import {
        getShiftRequests,
        getCourses,
        getAllocations,
        getShifts,
        getClassrooms,
        listStudents,
    } from '@/api'
    import type { Shift, Course } from '@/types'

    const props = defineProps<{
        modelValue: boolean
        request: StudentRecord | null
    }>()

    const emit = defineEmits(['update:modelValue'])

    interface Student {
        id: number;
        name: string;
        email: string;
        password: string;
        enrolled: number[];
        horario: 'Completo' | 'Incompleto';
        ano: number;
        numMat: number;
        data: Date;
    }
    
    interface CalendarShift {
        id: string
        name: string
        day: number
        timeSlot: number
    }

    const student = ref<Student | null>(null)
    const course = ref<Course | null>(null)
    const selectedShift = ref('')
    const shifts = ref<Shift[]>([])
    const shifts_calendar = ref<CalendarShift[]>([])
    const currentShift = ref<CalendarShift>()
    const newShift = ref<CalendarShift>()
    const canSubmit = ref(true)
    const currentEnrolledStudents = ref(0)
    const currentCapacity = ref(0)
    let newEnrolledStudents = ref(0)
    const newCapacity = ref(0)
    const currentShiftData = ref<Shift>()
    const newShiftData = ref<Shift>()

    const dayMap: Record<string, number> = {
        'Monday': 0,
        'Tuesday': 1,
        'Wednesday': 2,
        'Thursday': 3,
        'Friday': 4
    }
    
    function shiftToCalendarShift(shift: Shift): { id: string; name: string; day: number; timeSlot: number } {
        return {
            id: String(shift.id),
            name: shift.name,
            day: dayMap[shift.day] ?? -1,
            timeSlot: Math.floor((shift.from - 8) / 2)
        }
    }

    watch(selectedShift, (id) => {
        const shift = shifts.value.find(s => s.id == Number(id))
        
        if (!shift) {
            canSubmit.value = false
            return
        }

        newEnrolledStudents.value = shift.totalStudentsRegistered
        newShiftData.value = shift
        newShift.value = shiftToCalendarShift(shift)

        const hasConflict = shifts_calendar.value.some(s =>
            s.day === dayMap[shift.day] &&
            s.timeSlot === Math.floor((shift.from - 8) / 2)
        )

        canSubmit.value = !hasConflict

        if (hasConflict) {
            console.warn('Conflito de horário: já existe um turno nesse horário.')
        }
    })

    watch(
        () => props.modelValue,
        async (newVal) => {
            if (!newVal) {
                selectedShift.value = ''
            }
        }
    )
    watch(
        () => props.modelValue,
        async (newVal) => {
            if (newVal) {
                canSubmit.value = true
            }
        }
    )

    watch(
        () => props.modelValue,
        async (newVal) => {
            if (newVal) {
                const students = await listStudents()
                const mappedStudents = students.map(s => ({
                    id: s.id,
                    name: s.name,
                    email: s.email,
                    password: s.password,
                    enrolled: s.enrolled,
                    horario: s.horario,
                    ano: s.ano,
                    numMat: s.numMat,
                    data: new Date(s.data)
                }))

                student.value = mappedStudents.find(st => st.name === props.request?.nome) || null

                const courses = await getCourses()
                course.value = courses.find(c => c.abbreviation === props.request?.uc) || null

                const all_shifts = await getShifts()

                if (course.value?.id !== undefined) {
                    shifts.value = all_shifts.filter(s => s.courseId == course.value?.id)
                } else {
                    console.warn('course.value.id está undefined')
                }

                const allocations = await getAllocations()
                const allocationsStudent = allocations.filter(a => a.studentId == student.value?.id)
                const shifts_student = all_shifts.filter(s => allocationsStudent.some(a => a.shiftId == s.id))
                const calendarShifts = shifts_student.map(shiftToCalendarShift)
                shifts_calendar.value = calendarShifts

                const shiftRequest = await getShiftRequests()
                const currentShiftId = shiftRequest.find(s => s.studentId == student.value?.id)?.shiftId
                currentShiftData.value = all_shifts.find(s => s.id == currentShiftId)
                currentEnrolledStudents.value = currentShiftData.value?.totalStudentsRegistered || 0
                const classrooms = await getClassrooms()
                const currentClassroom = classrooms.find(c => c.id == currentShiftData.value?.classroomId)
                currentCapacity.value = currentClassroom?.capacity || 0
                if (currentShiftData.value) {
                    currentShift.value = shiftToCalendarShift(currentShiftData.value)
                } else {
                    console.warn('currentShiftData está undefined')
                }

                shifts.value = shifts.value.filter(s => s.id != currentShiftId)

                const newShiftId = shiftRequest.find(s => s.studentId == student.value?.id)?.alternativeShiftId
                newShiftData.value = all_shifts.find(s => s.id == newShiftId)
                newEnrolledStudents.value = newShiftData.value?.totalStudentsRegistered || 0
                const newClassroom = classrooms.find(c => c.id == newShiftData.value?.classroomId)
                newCapacity.value = newClassroom?.capacity || 0
                if (newShiftData.value) {
                    newShift.value = shiftToCalendarShift(newShiftData.value)
                } else {
                    console.warn('newShiftData está undefined')
                }
                
            }
        }
    )

    function approveRequest() {
        if (canSubmit.value) emit('update:modelValue', false)
    }

    function refuseRequest() {
        if (canSubmit.value) emit('update:modelValue', false)
    }

</script>

<style scoped>
    .padding-x {
        padding-left: 2rem;
        padding-right: 2rem;
    }
    .title {
        padding-top: 1rem;
        padding-bottom: 1rem;
    }
    .info {
        padding-top: 1rem;
        padding-bottom: 1rem;
        display: flex;
        gap: 0.4rem;
        flex-direction: column;
    }
    .shifts {
        padding-top: 1rem;
        padding-bottom: 1rem;
    }
</style>
