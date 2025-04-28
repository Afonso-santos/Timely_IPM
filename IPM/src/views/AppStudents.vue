<template>
    <main class="flex flex-col justify-start items-center main">
        <div class="w-[1000px]">
            <div class="w-[100px] text-sky-900 text-2xl font-semibold flex justify-start">
                Alunos
            </div>

            <div class="student-table">
                <!-- Filter + Search -->
                <div class=" flex justify-between items-center mb-2">
                    <div class="flex items-center gap-10 toolbar">
                        <label for="uc-select" class="text-[#666666]">Unidade Curricular:</label>
                        <div class="relative w-[220px]">
                            <select 
                                id="uc-select"
                                v-model="selectedUc"
                                class=" select block w-full h-[34px] bg-[#666666]/20 text-sm text-gray-600 pr-10 rounded-[25px] appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400"
                            >
                                <option value="">Todas</option>
                                <option
                                    v-for="uc in ucOptions"
                                    :key="uc"
                                    :value="uc"
                                >
                                    {{ uc }}
                                </option>
                            </select>
                            <ChevronsUpDown :size="15" class=" absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                        </div>
                    </div>
                    <div class="toolbar flex justify-between items-center mb-2">
                        <div
                            class="flex items-center gap-3 h-[40px] w-80 max-w-[400px] border border-gray-400/60 rounded-[10px] bg-white py-2 search"
                        >
                            <IconSearch :size="20" class="text-gray-400 pl-1" />
                            <input
                                v-model="searchQuery"
                                type="text"
                                placeholder="Pesquisar"
                                class="flex-1 px-2 bg-transparent placeholder-neutral-400/70 focus:outline-none text-neutral-400 text-base"
                            />
                        </div>
                    </div>
                </div>

                <!-- Table -->
                <table class="table-auto w-full">
                    <thead>
                        <tr>
                            <th @click="onSort('id')" class="cursor-pointer select-none">
                                Nº Mecanográfico
                                <span class="sort-indicator inline-block ml-1">
                                    <component
                                        :is="sortIcon('id')"
                                        :size="14"
                                    />
                                </span>
                            </th>
                            <th @click="onSort('name')" class="cursor-pointer select-none">
                                Nome
                                <span class="sort-indicator inline-block ml-1">
                                    <component
                                        :is="sortIcon('name')"
                                        :size="14"
                                    />
                                </span>
                            </th>
                            <th @click="onSort('horario')" class="cursor-pointer select-none">
                                Horário
                                <span class="sort-indicator inline-block ml-1">
                                    <component
                                        :is="sortIcon('horario')"
                                        :size="14"
                                    />
                                </span>
                            </th>
                            <th @click="onSort('ano')" class="cursor-pointer select-none">
                                Ano
                                <span class="sort-indicator inline-block ml-1">
                                    <component
                                        :is="sortIcon('ano')"
                                        :size="14"
                                    />
                                </span>
                            </th>
                            <th @click="onSort('numMat')" class="cursor-pointer select-none">
                                Nº de Matrículas
                                <span class="sort-indicator inline-block ml-1">
                                    <component
                                        :is="sortIcon('numMat')"
                                        :size="14"
                                    />
                                </span>
                            </th>
                            <th @click="onSort('data')" class="cursor-pointer select-none">
                                Data de Inscrição
                                <span class="sort-indicator inline-block ml-1">
                                    <component
                                        :is="sortIcon('data')"
                                        :size="14"
                                    />
                                </span>
                            </th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="item in paginatedData" :key="item.id">
                            <td>{{ "A" + item.id }}</td>
                            <td>{{ item.name }}</td>
                            <td>
                                <span
                                    :class="[
                                        'w-24 h-[22px] rounded-[10px] inline-flex justify-center items-center gap-2.5 text-sm status',
                                        item.horario.toLowerCase()
                                    ]"
                                >
                                    {{ item.horario }}
                                </span>
                            </td>
                            <td>{{ item.ano + "º ano" }}</td>
                            <td class="text-center">{{ item.numMat }}</td>
                            <td>{{ formatDate(item.data) }}</td>
                            
                            <td class="actions-cell">
                                <button
                                    class="icon-btn"
                                    @click="editItem(item)"
                                >
                                    <SquarePen :size="20" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="w-full flex justify-end mt-4">
                <div class="pagination flex items-center space-x-1">
                    <button
                        class="page"
                        @click="goToPage(1)"
                        :disabled="currentPage === 1"
                    >
                        <ChevronsLeft :size="20" />
                    </button>
                    <button
                        class="page"
                        @click="goToPage(currentPage - 1)"
                        :disabled="currentPage === 1"
                    >
                        <ChevronLeft :size="18" />
                    </button>
                    <button
                        v-for="page in pageNumbers"
                        :key="page"
                        @click="goToPage(page)"
                        :class="['page', { active: currentPage === page }]"
                    >
                        {{ page }}
                    </button>
                    <button
                        class="page"
                        @click="goToPage(currentPage + 1)"
                        :disabled="currentPage === totalPages"
                    >
                        <ChevronRight :size="18" />
                    </button>
                    <button
                        class="page-alt"
                        @click="goToPage(totalPages)"
                        :disabled="currentPage === totalPages"
                    >
                        <ChevronsRight :size="20" />
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>
  
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { listStudents, listCourses } from '../api';

interface StudentRecord {
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

interface Course {
    id: number;
    name: string;
    abbreviation: string;
    year: number;
    semester: number;
    degreeId: number;
}

import {
    SquarePen,
    Search,
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
    ChevronsUpDown,
    ChevronUp,
    ChevronDown
} from 'lucide-vue-next';

export default defineComponent({
    name: 'StudentTable',
    components: {
        SquarePen,
        IconSearch: Search,
        ChevronsLeft,
        ChevronLeft,
        ChevronRight,
        ChevronsRight,
        ChevronsUpDown,
        ChevronUp,
        ChevronDown
    },
    setup() {
        const studentRecords = ref<StudentRecord[]>([]);
        const courses        = ref<Course[]>([]);
        const selectedUc     = ref<string>('');
        const searchQuery    = ref('');
        const sortKey        = ref<keyof StudentRecord | null>(null);
        const sortOrder      = ref<'asc'|'desc'>('asc');
        const currentPage    = ref(1);
        const pageSize       = 10;

        const ucOptions = computed(() =>
            courses.value.map(c => c.abbreviation)
        );

        onMounted(async () => {
            const apiStudents = await listStudents();
            courses.value = await listCourses();

            studentRecords.value = apiStudents.map(s => ({
                id: s.id,
                name: s.name,
                email: s.email,
                password: s.password,
                enrolled: s.enrolled,
                horario: s.horario,
                ano: s.ano,
                numMat: s.numMat,
                data: new Date(s.data)
            }));
        });

        // Sort
        function onSort(key: keyof StudentRecord) {
            if (sortKey.value === key) {
                sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
            } else {
                sortKey.value = key;
                sortOrder.value = 'asc';
            }
        }

        function sortIcon(key: keyof StudentRecord) {
            if (sortKey.value === key) {
                return sortOrder.value === 'asc' ? ChevronUp : ChevronDown;
            }
            return ChevronsUpDown;
        }

        // Search + Filter
        const filteredData = computed(() => {
            let list = [...studentRecords.value];

            if (selectedUc.value) {
                const curso = courses.value.find(c => c.abbreviation === selectedUc.value);
                if (curso) {
                    list = list.filter(s => s.enrolled.includes(curso.id));
                }
            }

            if (searchQuery.value) {
                const q = searchQuery.value.toLowerCase();
                list = list.filter(item =>
                    Object.entries(item).some(([_, v]) => {
                        const s = Array.isArray(v)
                            ? v.join(', ')
                            : v instanceof Date
                                ? v.toLocaleDateString()
                                : String(v);
                        return s.toLowerCase().includes(q);
                    })
                );
            }

            if (sortKey.value) {
                const key = sortKey.value;
                list.sort((a, b) => {
                    const va = (a as any)[key], vb = (b as any)[key];
                    if (va < vb) return sortOrder.value === 'asc' ? -1 : 1;
                    if (va > vb) return sortOrder.value === 'asc' ? 1 : -1;
                    return 0;
                });
            }

            return list;
        });

        // Pagination
        const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize));
        const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1));

        function goToPage(p: number) {
            currentPage.value = Math.min(Math.max(p, 1), totalPages.value);
        }

        const paginatedData = computed(() => {
            const start = (currentPage.value - 1) * pageSize;
            return filteredData.value.slice(start, start + pageSize);
        });

        function formatDate(d: Date) {
            const day   = d.toLocaleDateString('pt-PT', { day: '2-digit' });
            const month = d.toLocaleDateString('pt-PT', { month: 'short' });
            const year  = d.toLocaleDateString('pt-PT', { year: 'numeric' });
            return `${day} ${month} ${year}`;
        }

        function editItem(item: StudentRecord) {
            console.log('Editar aluno:', item);
        }

        return {
            selectedUc,
            ucOptions,
            searchQuery,
            sortKey,
            sortOrder,
            onSort,
            sortIcon,
            currentPage,
            pageNumbers,
            totalPages,
            goToPage,
            paginatedData,
            formatDate,
            editItem,
            ChevronsUpDown,
            ChevronUp,
            ChevronDown
        };
    }
});
</script>

<style scoped lang="css">
.main {
    padding-top: 98px;
} 
.student-table {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-top: 27px;
    display: flex;
    width: 1000px;
    height: 700px;
    flex-direction: column;
    flex-shrink: 0;
}
.search {
    padding: 0px 8px;
}
.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 76px;
    padding: 0px 20px;
}
.actions {
    display: flex;
    gap: 8px;
}

.table-auto {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
}
.table-auto th,
.table-auto td {
    height: 56px;
    padding: 8px 12px;
    border-top: 1px solid rgba(102, 102, 102, 0.20);
    font-size: 15px;
    color: rgba(102, 102, 102, 0.90);
    
}
.table-auto th {
    cursor: pointer;
    user-select: none;
    font-weight: 400;
    height: 61px;
}
.table-auto td {
    font-weight: 200;
}
.table-auto td.actions-cell {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 40px;
}
.sort-indicator {
    margin-left: 4px;
    color: #024B78;
}
.status.completo {
    background: rgba(2, 75, 120, 0.40);
    color: #024B78;
}
.status.incompleto {
    background-color: rgba(205, 173, 179, 1);
    color: #823142;
}
.page {
    padding: 6px 15px;
    border-right: 1px solid rgba(102, 102, 102, 0.20);
    cursor: pointer;
}
.page-alt {
    padding: 6px 15px;
    cursor: pointer;
}
.page.active {
    color: #024B78;
}
.icon-btn {
    color: rgba(145, 145, 145, 1);
}
.pagination {
    display: flex;
    cursor: pointer;
    border-radius: 10px;
    background: #FFFFFF;
    box-shadow: 0px 4px 5px 0px rgba(0, 0, 0, 0.05);
    margin-top: 16px;
    color: rgba(145, 145, 145, 1);
}
.select{
    padding: 0px 15px;
}
</style>