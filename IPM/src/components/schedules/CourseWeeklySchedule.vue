<template>
  <div class="rounded-2xl">
    <table class="schedule-table rounded-2xl shadow-md">
      <thead class="rounded-2xl">
        <tr class="rounded-2xl">
          <th></th>
          <th v-for="day in days" :key="day" class="border-1 border-gray-200 border-t-0">
            {{ day }}
          </th>
        </tr>
      </thead>
      <tbody class="">
        <tr v-for="hour in hours" :key="hour">
          <td class="hour-cell border-1 border-gray-200 border-l-0 !px-6">{{ hour }}h</td>
          <template v-for="day in days" :key="`${day}-${hour}`">
            <td
              v-if="isClassStart(day, hour)"
              class="schedule-cell border-1 border-gray-200 !px-4 !py-2"
              :rowspan="2"
            >
            <div class="class-block" @click="openModal(getClass(day, hour))">
              <div class="class-title">{{ getClass(day, hour).title }}</div>
              <div class="class-room">{{ getClass(day, hour).room }}</div>
            </div>
            </td>
            <td
              v-else-if="!isPartOfPreviousClass(day, hour)"
              class="schedule-cell border-1 border-gray-200 !px-4 !py-2"
            ></td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
  <!-- Close Button -->
  <div class="w-[400px] flex flex-row-reverse">  
    <button
      class=""
      @click="closeModal"
    >
      <span
        class="text-xl leading-none rounded-2xl w-10 h-10 bg-[#823142] text-white flex items-center justify-center hover:bg-[#922f40] focus:outline-none"
      >
        <X class="w-6 h-6" />
      </span>
    </button>
  </div>

  <!-- Modal Content -->
  <div
    class="w-[400px] !mt-2 modal-content !py-8 relative bg-white text-[#666666] text-center p-6 rounded-lg shadow-md flex flex-col items-center gap-4"
  >
    <h2 class="text-xl font-bold">{{ selectedClass.name }}</h2>

    <div class="flex items-center gap-2">
      <UserIcon class="w-5 h-5" />
      <span>{{ selectedClass.teacher }}</span>
    </div>

    <div class="flex items-center gap-2">
      <ClockIcon class="w-5 h-5" />
      <span>{{ selectedClass.hour }}:00 - {{ selectedClass.hour + 1 }}:00</span>
    </div>

    <div class="flex items-center gap-2">
      <MapPinIcon class="w-5 h-5" />
      <span>{{ selectedClass.room }}</span>
    </div>

    <div class="flex items-center gap-2">
      <BriefcaseBusinessIcon class="w-5 h-5" />
      <span>{{ selectedClass.shift }}</span>
    </div>
  </div>
</div>

</template>

<script>
import { getCourseShiftsCalendarFormatted } from '@/api'
import {
  UserIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
  X,
  BriefcaseBusinessIcon
} from 'lucide-vue-next';

export default {
  name: 'CourseWeeklySchedule',
  components: {
    UserIcon,
    ClockIcon,
    MapPinIcon,
    TagIcon,
    X,
    BriefcaseBusinessIcon
  },
  props: {
    courseId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
      hours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      classes: [],
      selectedClass: null,
      showModal: false,
    }
  },
  async mounted() {
    const shifts = await getCourseShiftsCalendarFormatted(this.courseId)

    const dayMap = {
      Monday: 'Segunda',
      Tuesday: 'Terça',
      Wednesday: 'Quarta',
      Thursday: 'Quinta',
      Friday: 'Sexta',
    }

    this.classes = shifts.map((s) => ({
      day: dayMap[s.day] || s.day,
      hour: s.from,
      title: `${s.name}`,
      room: `${s.classroomName}`,
      shift: `${s.shiftName}`,
      teacher: `${s.teacher}`,
      name: `${s.fullName}`,
    }))
  },
  methods: {
    hasClass(day, hour) {
      return this.classes.some((cls) => cls.day === day && cls.hour === hour)
    },
    getClass(day, hour) {
      return this.classes.find((cls) => cls.day === day && cls.hour === hour)
    },
    isClassStart(day, hour) {
      return this.hasClass(day, hour)
    },
    isPartOfPreviousClass(day, hour) {
      return this.hasClass(day, hour - 1)
    },
    openModal(cls) {
    this.selectedClass = cls
    this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedClass = null
    }
  },
}
</script>

<style scoped>
.schedule-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 6px;
  overflow: hidden;
}

th,
td {
  padding: 0.5rem;
  text-align: center;
}

th {
  background-color: #f8f9fa;
  color: #64748b;
  font-weight: 500;
  padding: 1rem 0.5rem;
}

.hour-cell {
  color: #64748b;
  font-weight: 500;
  width: 60px;
}

.schedule-cell {
  height: 50px;
  width: calc((100% - 60px) / 5);
  vertical-align: top;
  padding: 0;
}

tr {
  height: 50px; /* force 1-hour height */
}

.class-block {
  background-color: #a4c2d8;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* allows spacing for the divider */
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  color: #1e3a5f;
  position: relative;
}

/* Add a pseudo-element for the middle divider */
.class-block::after {
  content: '';
  position: absolute;
  top: calc(50% - 0.5px);
  width: 118%;
  height: 0.5px;
  background-color: #e5e7eb;
  opacity: 0.5;
}

.class-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.class-room {
  font-size: 0.85rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-content {
  border-radius: 1rem;
}
</style>
