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
                                <!-- UC -->
                                <div class="flex justify-between items-center">
                                    <div class="text-right justify-center text-stone-500">Unidade Curricular:</div>
                                    <select
                                    v-model="selectedCourseId"
                                    class="w-[300px] h-[34px] rounded-[25px] !px-4 bg-gray-200 text-sm text-gray-600 appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    >
                                        <option value="" disabled>Selecione a UC</option>
                                        <option
                                            v-for="uc in enrolledCourses"
                                            :key="uc.id"
                                            :value="uc.id"
                                        >
                                            {{ uc.name }}
                                        </option>
                                    </select>
                                    <ChevronsUpDown :size="15" class=" absolute right-11 z-50 text-gray-600 pointer-events-none" />
                                </div>
                            </div>

                            <div class="justify-center text-stone-500 font-medium text-lg padding-x">Seleciona o teu turno preferido</div>

                            <div class="flex justify-between items-center flex-wrap content-center padding-x shifts">
                                <div class="w-64 inline-flex flex-col justify-start items-start gap-2.5">
                                    <div class="self-stretch h-6 inline-flex justify-between items-center">
                                        <div class="text-right justify-center text-stone-500">Aulta teórica:</div>
                                        <div class="w-12 h-6 text-right justify-center text-stone-500 font-bold">{{ teoricalShiftData?.name }}</div>
                                    </div>
                                    <div class="w-30 h-5 justify-center text-sky-900 text-sm">
                                        <div
                                            v-if="teoricalShiftData?.day && teoricalShiftData?.from !== undefined"
                                        >
                                            {{ teoricalShiftData.day }}, {{ teoricalShiftData.from }}h
                                        </div>
                                    </div>
                                </div>
                                <div class="relative w-[300px]">
                                    <select 
                                        id="uc-select"
                                        v-model="selectedShiftTeorical"
                                        class="!pl-4 block w-full h-[34px] bg-gray-200 text-sm text-gray-600 pr-10 rounded-[25px] appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    >
                                        <option value="" disabled selected>Selecione outro turno</option>
                                        <option
                                            v-for="shift in shifts.filter((s: Shift) => s.type === 'T')"
                                            :key="shift.id"
                                            :value="shift.id"
                                        >
                                            {{ shift.name }}
                                        </option>
                                    </select>
                                    <ChevronsUpDown :size="15" class=" absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                                </div>
                            </div>

                            <div class="flex justify-between items-center flex-wrap content-center padding-x shifts">
                                <div class="w-64 inline-flex flex-col justify-start items-start gap-2.5">
                                    <div class="self-stretch h-6 inline-flex justify-between items-center">
                                        <div class="text-right justify-center text-stone-500">Aula prática:</div>
                                        <div class="w-12 h-6 text-right justify-center text-stone-500 font-bold">{{ praticalShiftData?.name }}</div>
                                    </div>
                                    <div class="w-30 h-5 justify-center text-sky-900 text-sm">
                                        <div
                                            v-if="praticalShiftData?.day && praticalShiftData?.from !== undefined"
                                        >
                                            {{ praticalShiftData.day }}, {{ praticalShiftData.from }}h
                                        </div>
                                    </div>
                                </div>
                                <div class="relative w-[300px]">
                                    <select 
                                        id="uc-select"
                                        v-model="selectedShiftPratical"
                                        class="!pl-4 block w-full h-[34px] bg-gray-200 text-sm text-gray-600 pr-10 rounded-[25px] appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    >
                                        <option value="" disabled selected>Selecione outro turno</option>
                                        <option
                                            v-for="shift in shifts.filter((s: Shift) => s.type === 'PL')"
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
                                    @click="approveRequest"
                                    :disabled="!canSubmit"
                                    :class="[
                                        '!px-6 !py-2 rounded-md font-semibold focus:outline-none',
                                        canSubmit
                                            ? 'text-white !bg-[#136D1E] hover:bg-[#188625] !border-2'
                                            : 'text-[#136D1E] !border-2 !border-[#136D1E] opacity-50 !cursor-not-allowed'
                                    ]"
                                >
                                    Submeter
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
    import { ref, watch } from 'vue'
    import { X, ChevronsUpDown } from 'lucide-vue-next'
    import WeeklyCalendar from '@/components/schedules/WeeklyCalendar.vue'
    import { toast } from 'vue-sonner'
    import {
        getCourses,
        getAllocations,
        getShifts,
        getClassrooms,
        listStudents,
    } from '@/api'
    import type { Shift, Course, Student } from '@/types'

    const props = defineProps<{
        modelValue: boolean
        request: Number
    }>()

    const emit = defineEmits(['update:modelValue'])

    interface CalendarShift {
        id: string
        name: string
        day: number
        timeSlot: number
    }

    const selectedCourseId = ref<number | ''>('')
    const selectedShiftTeoricalType = ref<string | ''>('')
    const selectedShiftTeorical = ref('')
    const selectedShiftPratical = ref('')
    const enrolledCourses = ref<Course[]>([])
    const availableShiftTypes = ref<string[]>([])
    const shifts = ref<Shift[]>([])
    const allShifts = ref<Shift[]>([])
    const shifts_calendar = ref<CalendarShift[]>([])
    const currentShift = ref<CalendarShift>()
    const newShift = ref<CalendarShift>()
    const canSubmit = ref(false)
    const student = ref<Student | null>(null)
    const teoricalShiftData = ref<Shift>()
    const praticalShiftData = ref<Shift>()

    const dayMap: Record<string, number> = {
        'Monday': 0,
        'Tuesday': 1,
        'Wednesday': 2,
        'Thursday': 3,
        'Friday': 4,
    }

    function shiftToCalendarShift(shift: Shift): CalendarShift {
        return {
            id: String(shift.id),
            name: shift.name,
            day: dayMap[shift.day] ?? -1,
            timeSlot: Math.floor((shift.from - 8) / 2)
        }
    }

    async function handleShiftChange(shiftId: string, assignShiftData: typeof teoricalShiftData | typeof praticalShiftData) {
        const shift = shifts.value.find(s => s.id == Number(shiftId))
        if (!shift) {
            assignShiftData.value = undefined
            canSubmit.value = false
            return
        }

        assignShiftData.value = shift
        const calendarShift = shiftToCalendarShift(shift)
        if (assignShiftData.value.type === 'T') newShift.value = calendarShift
        else currentShift.value = calendarShift

        const hasConflict = shifts_calendar.value.some(s =>
            s.day === dayMap[shift.day] &&
            s.timeSlot === Math.floor((shift.from - 8) / 2)
        )

        canSubmit.value = !hasConflict

        if (hasConflict) {
            console.warn('Conflito de horário: já existe um turno nesse horário.')
        }
    }

    watch(selectedShiftTeorical, (id) => handleShiftChange(id, teoricalShiftData))
    watch(selectedShiftPratical, (id) => handleShiftChange(id, praticalShiftData))

    watch(
        () => props.modelValue,
        async (newVal) => {
            if (!newVal) {
                praticalShiftData.value = undefined
                selectedShiftTeorical.value = ''
                selectedShiftPratical.value = ''
                teoricalShiftData.value = undefined
                shifts.value = []
            }
        }
    )

    watch(
        () => props.modelValue,
        async (isOpen) => {
            if (!isOpen) {
                selectedCourseId.value = ''
                selectedShiftTeoricalType.value = ''
                selectedShiftTeorical.value = ''
                selectedShiftPratical.value = ''
                teoricalShiftData.value = undefined
                praticalShiftData.value = undefined
                currentShift.value = undefined
                newShift.value = undefined
                canSubmit.value = false
                return
            }

            const students = await listStudents()
            student.value = students.find(st => st.id === props.request) || null

            const courses = await getCourses()
            for (const course of courses) course.id = Number(course.id)

            const studentEnrolledIds = student.value?.enrolled || []
            enrolledCourses.value = courses.filter(c => studentEnrolledIds.includes(c.id))

            const allocations = await getAllocations()
            const shiftsRaw = await getShifts()
            allShifts.value = shiftsRaw

            const allocationsStudent = allocations.filter(a => a.studentId == student.value?.id)
            const shifts_student = shiftsRaw.filter(s => allocationsStudent.some(a => a.shiftId == s.id))
            shifts_calendar.value = shifts_student.map(shiftToCalendarShift)
        }
    )

    watch(selectedCourseId, (courseId) => {
        if (!courseId) {
            availableShiftTypes.value = []
            selectedShiftTeoricalType.value = ''
            return
        }

        const shiftsInCourse = allShifts.value.filter(s => s.courseId == courseId)
        teoricalShiftData.value = shiftsInCourse.find(s => s.type == 'T')
        praticalShiftData.value = shiftsInCourse.find(s => s.type == 'PL')
        shifts.value = shiftsInCourse
        if (teoricalShiftData.value) {
            newShift.value = shiftToCalendarShift(teoricalShiftData.value)
        }

        if (praticalShiftData.value) {
            currentShift.value = shiftToCalendarShift(praticalShiftData.value)
        }
    })

    watch(selectedShiftTeoricalType, async (shiftType) => {
        if (!selectedCourseId.value || !shiftType) {
            shifts.value = []
            return
        }

        const relevantShifts = allShifts.value.filter(s =>
            s.courseId == selectedCourseId.value && s.type == shiftType
        )
        shifts.value = relevantShifts

        const studentId = student.value?.id
        const allocations = await getAllocations()
        const alloc = allocations.find(a =>
            a.studentId == studentId && relevantShifts.some(s => s.id == a.shiftId)
        )

        if (alloc) {
            const current = relevantShifts.find(s => s.id == alloc.shiftId)
            if (shiftType === 'Teórica') {
                teoricalShiftData.value = current
                currentShift.value = current ? shiftToCalendarShift(current) : undefined
            } else {
                praticalShiftData.value = current
                currentShift.value = current ? shiftToCalendarShift(current) : undefined
            }

            shifts.value = relevantShifts.filter(s => s.id !== current?.id)
        } else {
            if (shiftType === 'Teórica') teoricalShiftData.value = undefined
            else praticalShiftData.value = undefined
            currentShift.value = undefined
        }
    })

    function approveRequest() {
        if (canSubmit.value) emit('update:modelValue', false)
        toast.success('Pedido Submetido!', {
            duration: 3000,
            position: 'top-center',
            style: {
                backgroundColor: '#ffffff'
            }
        })
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
