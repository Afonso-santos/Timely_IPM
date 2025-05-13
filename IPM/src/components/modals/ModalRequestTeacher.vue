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
                                    <div class="text-right justify-start text-black/50 font-bold leading-7">{{ classroomRequest?.nome }}</div>
                                </div>
                                <div class="flex justify-between items-center">
                                    <div class="text-right justify-center text-stone-500">Unidade Curricular:</div>
                                    <div class="text-right justify-start text-black/50 font-bold leading-7">{{ classroomRequest?.uc }}</div>
                                </div>
                                <div class="flex justify-between items-center">
                                    <div class="text-right justify-center text-stone-500">Turno:</div>
                                    <div class="text-right justify-start text-black/50 font-bold leading-7">{{ classroomRequest?.shift }}</div>
                                </div>
                                <div class="flex justify-between items-center">
                                    <div class="text-right justify-center text-stone-500">Tamanho da turma:</div>
                                    <div class="text-right justify-start text-black/50 font-bold leading-7">{{ request?.shiftSize }}</div>
                                </div>
                                <div class="flex justify-between items-center">
                                    <div class="text-right justify-center text-stone-500">Ocupação:</div>
                                    <ProgressBar :current="currentShiftSize" :total="currentRoomSize"/>
                                </div>
                            </div>

                            <div class="justify-center text-stone-500 font-medium text-lg padding-x">Alteração da sala</div>
                            
                            <div class="flex flex-row justify-between !my-5 padding-x">
                                <div>
                                    <div class="flex w-[250px] justify-between !my-2">
                                        <div class="text-right justify-center text-stone-500">Sala atual:</div>
                                        <div class="text-right justify-start text-black/50 font-bold leading-7">{{ request?.sala }}</div>
                                    </div>
                                    <div class="flex w-[250px] justify-between !my-2">
                                        <div class="text-right justify-center text-stone-500">Capacidade da sala:</div>
                                        <div class="text-right justify-start text-black/50 font-bold leading-7">{{ currentRoomSize }}</div>
                                    </div>
                                </div>
                                <div>
                                    <div class="flex w-[250px] justify-between !my-2">
                                        <div class="text-right justify-center text-stone-500">Nova Sala:</div>
                                        <div class="text-right justify-start text-black/50 font-bold leading-7">{{ newClassroom?.abbreviation }} {{ newClassroom?.name }}</div>
                                    </div>
                                    <div class="flex w-[250px] justify-between !my-2">
                                        <div class="text-right justify-center text-stone-500">Capacidade da sala:</div>
                                        <div class="text-right justify-start text-black/50 font-bold leading-7">{{ newClassroom?.capacity }}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="padding-x !my-4 justify-between">
                                <div class="!h-6">
                                    <div v-if="!canSubmit" class="text-sm font-medium text-[#823142]">Sala com capacidade menor ao tamanho da turma! Por favor escolha outra sala.</div>
                                </div>
                                <div class="relative !mt-1 w-[260px]">
                                    <select 
                                        id="uc-select"
                                        v-model="selectedRoom"
                                        class="!pl-4 block w-full h-[34px] bg-gray-200 text-sm text-gray-600 pr-10 rounded-[25px] appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    >
                                        <option value="" disabled selected>Selecione outra sala</option>
                                        <option
                                            v-for="classroom in classrooms"
                                            :key="classroom.id"
                                            :value="classroom.id"
                                        >
                                            {{ classroom.abbreviation }} {{ classroom.name }}
                                        </option>
                                    </select>
                                    <ChevronsUpDown :size="15" class=" absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                                </div>
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
    import ProgressBar from '@/components/schedules/ProgressBar.vue'
    import type { TeacherRecord } from '@/views/AppRequests.vue'
    import { toast } from 'vue-sonner'
    import {
        getShiftRequests,
        getCourses,
        getAllocations,
        getShifts,
        getClassrooms,
        listStudents,
        list_ClassroomRequests,
    } from '@/api'
    import type { Classroom } from '@/types'

    const props = defineProps<{
        modelValue: boolean
        request: TeacherRecord | null
    }>()

    const emit = defineEmits(['update:modelValue'])

    const canSubmit = ref(true)
    const classroomRequest = ref<TeacherRecord | null>(null)
    const currentShiftSize = ref(0)
    const currentRoomSize = ref(0)
    const selectedRoom = ref('')
    const classrooms = ref<Classroom[]>([])
    const newClassroom = ref<Classroom>()

    watch(selectedRoom, (id) => {
        const classroom = classrooms.value.find(c => c.id == Number(id))
        if (classroom) {
            newClassroom.value = classroom
            canSubmit.value = (props.request!.shiftSize ?? 0) <= classroom.capacity
        } else {
            canSubmit.value = false
        }
        
    })

    watch(
        () => props.modelValue,
        async (newVal) => {
            const requestId = props.request?.pedido
                const classroomRequestsData = await list_ClassroomRequests()
                const classroomRequests = Object.values(classroomRequestsData)
                classroomRequest.value = classroomRequests.find((request) => request.id == requestId)

                const ucs = await getCourses()
                const uc = Object.values(ucs).find((uc) => uc.abbreviation == classroomRequest.value?.uc)
                if (classroomRequest.value && uc?.name) classroomRequest.value.uc = uc.name

                const shifts = await getShifts()
                const shift = Object.values(shifts).find((shift) => shift.courseId == uc?.id && shift.name == classroomRequest.value?.shift)
                currentShiftSize.value = shift?.totalStudentsRegistered || 0

                classrooms.value = await getClassrooms()
                const currentClassroom = Object.values(classrooms.value).find((classroom) => classroom.id == classroomRequest.value?.classroomId)
                currentRoomSize.value = currentClassroom?.capacity || 0

                newClassroom.value = Object.values(classrooms.value).find((classroom) => classroom.id == classroomRequest.value?.alternativeclassroomId)
                
                
        }
    )

    function approveRequest() {
        if (canSubmit.value) emit('update:modelValue', false)
        toast.success('Pedido aprovado com sucesso!', {
            duration: 3000,
            position: 'top-center',
            style: {
                backgroundColor: '#ffffff'
            },
        })
    }

    function refuseRequest() {
        if (canSubmit.value) emit('update:modelValue', false)
        toast.success('Pedido recusado com sucesso!', {
            duration: 3000,
            position: 'top-center',
            style: {
                backgroundColor: '#ffffff'
            },
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
