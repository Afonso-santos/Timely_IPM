<template>
    <div class="w-64 h-14 inline-flex flex-col justify-center items-end gap-0.5">
        <div class="self-stretch inline-flex justify-between items-center">
            <div class="justify-center text-sky-900 text-xs font-medium">
                {{ current }}/{{ total }}
            </div>
            <div class="w-6 h-3 text-right justify-center text-sky-900 text-xs font-medium">
                {{ typeof percentage === 'number' ? `${percentage}%` : percentage }}
            </div>
        </div>
        <div class="w-64 h-7 relative">
            <div class="w-64 h-7 left-0 top-0 absolute bg-gray-200 rounded-3xl"></div>
            <div
                class="h-7 left-0 top-0 absolute rounded-3xl"
                :class="barColor"
                :style="{ width: barWidth }"
            ></div>
        </div>
    </div>
</template>
    
<script setup lang="ts">
    import { computed } from 'vue'
    
    const props = defineProps<{
        current: number
        total: number
        color?: string // ex: 'bg-slate-400'
    }>()
    
    const percentage = computed(() => {
        if (!props.total || props.total === 0) return ''
        return Math.min(100, Math.round((props.current / props.total) * 100))
    })

    const barWidth = computed(() => {
        if (!props.total || props.total === 0) return '0%'
        return `${Math.min(100, (props.current / props.total) * 100)}%`
    })
    
    const barColor = computed(() => props.color || 'bg-[#9AB3C3]')
</script>
  