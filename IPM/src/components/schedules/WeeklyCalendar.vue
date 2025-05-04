<template> 
    <div class="flex !h-6">
        <div
            v-if="hasConflict"
            class="text-sm font-medium text-[#823142]"
        >
            Horário com sobreposições! Por favor escolhe outro turno.
        </div>
    </div>
    <div class="grid grid-cols-5 gap-px rounded-2xl overflow-hidden border border-gray-200">
        <div
            v-for="(day, colIdx) in weekDays"
            :key="day"
            class="grid grid-rows-6"
        >
            <div
                v-for="rowIdx in 6"
                :key="rowIdx"
                class="h-10 bg-gray-100 flex items-center justify-center relative"
            >
                <div
                    v-for="shift in getShiftsForCell(colIdx, rowIdx)"
                    :key="shift.id"
                    class="absolute inset-0 flex items-center justify-center rounded text-sm font-bold"
                    :class="getShiftClass(shift)"
                >
                    {{ shift.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface CalendarShift {
    id: string
    name: string
    day: number
    timeSlot: number
}

const props = defineProps<{
    shifts: CalendarShift[]
    currentShift?: CalendarShift
    newShift?: CalendarShift
}>()

const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']

const hasConflict = computed(() => {
    if (!props.newShift) return false

    return props.shifts.some(s =>
        s.day === props.newShift!.day &&
        s.timeSlot === props.newShift!.timeSlot &&
        s.id !== props.newShift!.id
    )
})

const allShifts = computed(() => {
    const ids = new Set(props.shifts.map(s => s.id))
    const list = [...props.shifts]

    if (props.currentShift && !ids.has(props.currentShift.id)) {
        list.push(props.currentShift)
        ids.add(props.currentShift.id)
    }

    if (props.newShift && !ids.has(props.newShift.id)) {
        list.push(props.newShift)
    }

    return list
})

function getShiftsForCell(col: number, row: number): CalendarShift[] {
    return allShifts.value.filter(
        shift => shift.day === col && shift.timeSlot === row
    )
}

function isConflict(shift: CalendarShift): boolean {
    if (!props.newShift) return false

    return Boolean(
        shift.id === props.newShift.id &&
        props.shifts.some(s =>
            s.day === props.newShift!.day &&
            s.timeSlot === props.newShift!.timeSlot &&
            s.id !== props.newShift!.id
        )
    )
}

function getShiftClass(shift: CalendarShift) {
    if (props.currentShift && shift.id === props.currentShift.id) {
        return 'bg-[#004b75] text-white'
    } else if (props.newShift && shift.id === props.newShift.id) {
        if (isConflict(shift)) {
            return 'bg-[#c7aab0] text-[#823142]'
        }
        return 'bg-[#823142] text-white'
    }
    return 'bg-[#9AB3C3] text-white'
}
</script>

