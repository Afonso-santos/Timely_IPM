<template>
    <main class="flex flex-col justify-start items-center main">
        <div class="w-[1000px]">
            <div class="w-[100px] text-sky-900 text-2xl font-semibold flex justify-start">
                Pedidos
            </div>

            <div class="student-table">
                <!-- Tabs -->
                <div class="tabs border-b-1 border-[#666666]/20 mb-4">
                    <button
                        v-for="tab in tabs"
                        :key="tab.name"
                        @click="activeTab = tab.name"
                        :class="['tab', { active: activeTab === tab.name }]"
                    >
                        {{ tab.label }}
                        <span class="count">{{ filteredData(tab.name).length }}</span>
                    </button>
                </div>

                <!-- Actions + Search -->
                <div class="toolbar flex justify-between items-center mb-2">
                    <div class="actions space-x-2">
                        <button
                            v-if="activeTab !== 'arquivados'"
                            @click="approveSelected"
                            :disabled="!selectedIds.size"
                            class="btn btn-approve"
                        >
                            <CircleCheckBig :size="20" class="text-green-600" /> Aprovar
                        </button>
                        <button
                            v-if="activeTab !== 'arquivados'"
                            @click="rejectSelected"
                            :disabled="!selectedIds.size"
                            class="btn btn-reject"
                        >
                            <CircleX :size="20" class="text-red-700" /> Recusar
                        </button>
                        <button
                            v-if="activeTab !== 'arquivados'"
                            @click="archiveSelected"
                            :disabled="!selectedIds.size"
                            class="btn btn-archive"
                        >
                            <Archive :size="20" class="text-gray-400" /> Arquivar
                        </button>
                        <button
                            v-if="activeTab === 'arquivados'"
                            @click="deleteArchivedSelected"
                            :disabled="!selectedIds.size"
                            class="btn btn-delete"
                        >
                            <Trash2 :size="20" class="text-gray-400" /> Apagar
                        </button>
                    </div>

                    <div
                        class="flex items-center gap-3 h-[35px] w-full max-w-[400px] border border-gray-400/60 rounded-[10px] bg-white px-4 py-2 search"
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

                <!-- Table -->
                <table class="table-auto w-full">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    @change="toggleSelectAll"
                                    :checked="allSelected"
                                />
                            </th>
                            <th @click="onSort('pedido')" class="cursor-pointer select-none">
                                Pedido
                                <span class="sort-indicator inline-block ml-1">
                                    <component
                                        :is="sortIcon('pedido')"
                                        :size="14"
                                    />
                                </span>
                            </th>
                            <th @click="onSort('nome')" class="cursor-pointer select-none">
                                Nome
                                <span class="sort-indicator inline-block ml-1">
                                    <component
                                        :is="sortIcon('nome')"
                                        :size="14"
                                    />
                                </span>
                            </th>
                            <th @click="onSort('uc')" class="cursor-pointer select-none">
                                UC
                                <span class="sort-indicator inline-block ml-1">
                                    <component
                                        :is="sortIcon('uc')"
                                        :size="14"
                                    />
                                </span>
                            </th>

                            <!-- Specific Columns -->
                            <th v-if="activeTab === 'alunos'" @click="onSort('turno')" class="cursor-pointer select-none">
                                Turno
                                <span class="sort-indicator inline-block ml-1">
                                    <component
                                        :is="sortIcon('turno')"
                                        :size="14"
                                    />
                                </span>
                            </th>
                            <th v-if="activeTab === 'docentes'" @click="onSort('sala')" class="cursor-pointer select-none">
                                Sala
                                <span class="sort-indicator inline-block ml-1">
                                    <component
                                        :is="sortIcon('sala')"
                                        :size="14"
                                    />
                                </span>
                            </th>
                            <th v-if="activeTab === 'arquivados'" @click="onSort('tipo')" class="cursor-pointer select-none">
                                Tipo
                                <span class="sort-indicator inline-block ml-1">
                                    <component
                                        :is="sortIcon('tipo')"
                                        :size="14"
                                    />
                                </span>
                            </th>

                            <th @click="onSort('data')" class="cursor-pointer select-none">
                                Data
                                <span class="sort-indicator inline-block ml-1">
                                    <component
                                        :is="sortIcon('data')"
                                        :size="14"
                                    />
                                </span>
                            </th>
                            <th @click="onSort('estado')" class="cursor-pointer select-none">
                                Estado
                                <span class="sort-indicator inline-block ml-1">
                                    <component
                                        :is="sortIcon('estado')"
                                        :size="14"
                                    />
                                </span>
                            </th>
                            <th @click="onSort('mudanca')" class="cursor-pointer select-none">
                                Mudança
                                <span class="sort-indicator inline-block ml-1">
                                    <component
                                        :is="sortIcon('mudanca')"
                                        :size="14"
                                    />
                                </span>
                            </th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="item in paginatedData" :key="item.pedido">
                            <td>
                                <input
                                    type="checkbox"
                                    :value="item.pedido"
                                    v-model="selectedArray"
                                />
                            </td>
                            <td>{{ item.pedido }}</td>
                            <td>{{ item.nome }}</td>
                            <td>{{ item.uc }}</td>

                            <!-- Valores específicos -->
                            <td v-if="activeTab === 'alunos'">
                                {{ (item as StudentRecord).turno }}
                            </td>
                            <td v-if="activeTab === 'docentes'">
                                {{ (item as TeacherRecord).sala }}
                            </td>
                            <td v-if="activeTab === 'arquivados'">
                                {{ item.tipo }}
                            </td>

                            <td>{{ formatDate(item.data) }}</td>
                            <td>
                                <span
                                    :class="[
                                        'w-22 h-[22px] rounded-[10px] inline-flex justify-center items-center gap-2.5 text-sm status',
                                        item.estado.toLowerCase()
                                    ]"
                                >
                                    {{ item.estado }}
                                </span>
                            </td>
                            <td>{{ item.mudanca }}</td>
                            <td class="actions-cell flex space-x-2">
                                <button
                                    v-if="activeTab !== 'arquivados'"
                                    class="icon-btn"
                                    @click="editItem(item)"
                                >
                                    <SquarePen :size="20" />
                                </button>
                                <button
                                    v-if="activeTab !== 'arquivados'"
                                    class="icon-btn"
                                    @click="archiveItem(item)"
                                >
                                    <Archive :size="20" />
                                </button>
                                <button
                                    v-if="activeTab === 'arquivados'"
                                    class="icon-btn"
                                    @click="deleteItem(item)"
                                >
                                    <X :size="20" />
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

        <ModalRequestStudent v-model="isModalOpenStudent" :request="selectedRequestStudent">
            <template #title>Pedido de Troca de Horário</template>
        </ModalRequestStudent>
        <ModalRequestTeacher v-model="isModalOpenTeacher" :request="selectedRequestTeacher">
            <template #title>Pedido de Troca de Sala</template>
        </ModalRequestTeacher>
    </main>
</template>
  
<script lang="ts">
    import { defineComponent, computed, ref, watch, onMounted } from 'vue';
    import { list_ShiftRequests, list_ClassroomRequests } from '../api'
    import type { ShiftRequestData, ClassroomRequestData } from '../types'
    import ModalRequestStudent from '../components/modals/ModalRequestStudent.vue';
    import ModalRequestTeacher from '../components/modals/ModalRequestTeacher.vue';
    import { parseISO } from 'date-fns';
    import { toast } from 'vue-sonner'
    import {
        CircleCheckBig,
        CircleX,
        Archive,
        SquarePen,
        Search,
        ChevronsLeft,
        ChevronLeft,
        ChevronRight,
        ChevronsRight,
        Trash2,
        X,
        ChevronsUpDown,
        ChevronUp,
        ChevronDown
    } from 'lucide-vue-next';

    interface BaseRecord {
        pedido: number;
        nome: string;
        uc: string;
        data: Date;
        estado: 'Pendente' | 'Recusado' | 'Aprovado';
        mudanca: string;
        arquivado: boolean;
    }

    export interface StudentRecord extends BaseRecord {
        tipo: 'Estudante';
        turno: string;
    }
    export interface TeacherRecord extends BaseRecord {
        tipo: 'Docente';
        sala: string;
        shift: string;
        shiftSize: number;
        classroomId: number;
        alternativeclassroomId: number;
    }

    type AnyRecord = StudentRecord | TeacherRecord;
    type TabName = 'alunos' | 'docentes' | 'arquivados';
    type SortKey = keyof BaseRecord | 'turno' | 'sala' | 'tipo';

    export default defineComponent({
        name: 'RequestTable',
        components: {
            ModalRequestStudent,
            ModalRequestTeacher,
            CircleCheckBig,
            CircleX,
            Archive,
            SquarePen,
            IconSearch: Search,
            ChevronsLeft,
            ChevronLeft,
            ChevronRight,
            ChevronsRight,
            Trash2,
            X,
            ChevronsUpDown,
            ChevronUp,
            ChevronDown
        },
        setup() {
            const studentRecords = ref<StudentRecord[]>([]);
            const teacherRecords = ref<TeacherRecord[]>([]);

            const isModalOpenStudent = ref(false);
            const isModalOpenTeacher = ref(false);
            const selectedRequestStudent = ref<StudentRecord | null>(null);
            const selectedRequestTeacher = ref<TeacherRecord | null>(null);


            onMounted(async () => {
                const [shiftDict, classroomDict] = await Promise.all([
                    list_ShiftRequests(),
                    list_ClassroomRequests()
                ])

                studentRecords.value = Object.values(shiftDict).map((s: ShiftRequestData) => ({
                    tipo: 'Estudante',
                    pedido: s.id,
                    nome: s.nome,
                    turno: s.shift,
                    uc: s.uc,
                    data: parseISO(s.date),
                    estado: s.response,
                    mudanca: s.alternativeShift,
                    arquivado: s.archive
                }))

                teacherRecords.value = Object.values(classroomDict).map((c: ClassroomRequestData) => ({
                    tipo: 'Docente',
                    pedido: c.id,
                    nome: c.nome,
                    sala: c.classroom,
                    uc: c.uc,
                    data: parseISO(c.date),
                    estado: c.response,
                    mudanca: c.alternativeclassroom,
                    arquivado: c.archive,
                    shift: c.shift,
                    shiftSize: c.shiftsize || 0,
                    classroomId: c.classroomId,
                    alternativeclassroomId: c.alternativeclassroomId
                }))
            })

            // Active tab
            const tabs = [
                { name: 'alunos' as TabName, label: 'Alunos' },
                { name: 'docentes' as TabName, label: 'Docentes' },
                { name: 'arquivados' as TabName, label: 'Arquivados' }
            ];
            const activeTab = ref<TabName>('alunos');

            // Seach + Sort
            const searchQuery = ref('');
            const sortKey = ref<SortKey | null>(null);
            const sortOrder = ref<'asc' | 'desc'>('asc');

            function onSort(key: SortKey) {
                if (sortKey.value === key) {
                    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
                } else {
                    sortKey.value = key;
                    sortOrder.value = 'asc';
                }
            }

            function sortIcon(key: SortKey) {
                if (sortKey.value === key) {
                    return sortOrder.value === 'asc'
                    ? ChevronUp
                    : ChevronDown;
                }
                return ChevronsUpDown;
            }

            // 2) Builds the filtered data and returns it
            function filteredData(tab: TabName): AnyRecord[] {
                let list: AnyRecord[] = [];
                if (tab === 'alunos') {
                    list = studentRecords.value.filter(r => !r.arquivado);
                } else if (tab === 'docentes') {
                    list = teacherRecords.value.filter(r => !r.arquivado);
                } else {
                    list = [
                        ...studentRecords.value.filter(r => r.arquivado),
                        ...teacherRecords.value.filter(r => r.arquivado)
                    ];
                }

                // general search
                if (searchQuery.value) {
                    const q = searchQuery.value.toLowerCase();
                    list = list.filter(item =>
                        Object.entries(item).some(([k, v]) => {
                            if (v == null) return false;
                            const s = v instanceof Date ? v.toLocaleDateString() : String(v);
                            return s.toLowerCase().includes(q);
                        })
                    );
                }

                // sorting
                if (sortKey.value) {
                    const key = sortKey.value;
                    list.sort((a, b) => {
                        const va = (a as any)[key];
                        const vb = (b as any)[key];
                        if (va < vb) return sortOrder.value === 'asc' ? -1 : 1;
                        if (va > vb) return sortOrder.value === 'asc' ? 1 : -1;
                        return 0;
                    });
                }

                return list;
            }

            // 3) Selection
            const selectedIds = ref(new Set<number>());
            const selectedArray = computed<number[]>({
                get: () => Array.from(selectedIds.value),
                set(arr) { selectedIds.value = new Set(arr); }
            });
            const allSelected = computed(() => {
                const list = filteredData(activeTab.value);
                return list.length > 0 && list.every(i => selectedIds.value.has(i.pedido));
            });
            function toggleSelectAll(e: Event) {
                const checked = (e.target as HTMLInputElement).checked;
                filteredData(activeTab.value).forEach(i =>
                    checked ? selectedIds.value.add(i.pedido) : selectedIds.value.delete(i.pedido)
                );
            }

            // 4) Actions
            function approveSelected() {
                studentRecords.value.forEach(r => selectedIds.value.has(r.pedido) && (r.estado = 'Aprovado'));
                teacherRecords.value.forEach(r => selectedIds.value.has(r.pedido) && (r.estado = 'Aprovado'));
                selectedIds.value.clear();
            }
            function rejectSelected() {
                studentRecords.value.forEach(r => selectedIds.value.has(r.pedido) && (r.estado = 'Recusado'));
                teacherRecords.value.forEach(r => selectedIds.value.has(r.pedido) && (r.estado = 'Recusado'));
                selectedIds.value.clear();
            }
            function archiveSelected() {
                studentRecords.value.forEach(r => selectedIds.value.has(r.pedido) && (r.arquivado = true));
                teacherRecords.value.forEach(r => selectedIds.value.has(r.pedido) && (r.arquivado = true));
                selectedIds.value.clear();
            }
            function deleteArchivedSelected() {
                const toDel = Array.from(selectedIds.value);
                toDel.forEach(id => {
                    const i1 = studentRecords.value.findIndex(r => r.pedido === id && r.arquivado);
                    if (i1 >= 0) studentRecords.value.splice(i1, 1);
                    const i2 = teacherRecords.value.findIndex(r => r.pedido === id && r.arquivado);
                    if (i2 >= 0) teacherRecords.value.splice(i2, 1);
                });
                selectedIds.value.clear();
            }

            function editItem(item: AnyRecord) {
                if ('turno' in item) {
                    // StudentRecord
                    selectedRequestStudent.value = item;
                    isModalOpenStudent.value = true;
                } else {
                    // TeacherRecord
                    selectedRequestTeacher.value = item;
                    isModalOpenTeacher.value = true;
                }
            }

            function archiveItem(item: AnyRecord) {
                if ('turno' in item) {
                    // StudentRecord
                    const rec = studentRecords.value.find(r => r.pedido === item.pedido);
                    if (rec) rec.arquivado = true;
                } else {
                    // TeacherRecord
                    const rec = teacherRecords.value.find(r => r.pedido === item.pedido);
                    if (rec) rec.arquivado = true;
                }
            }

            function deleteItem(item: AnyRecord) {
                if (item.arquivado) {
                    if ('turno' in item) {
                        const idx = studentRecords.value.findIndex(r => r.pedido === item.pedido);
                        if (idx >= 0) studentRecords.value.splice(idx, 1);
                    } else {
                        const idx = teacherRecords.value.findIndex(r => r.pedido === item.pedido);
                        if (idx >= 0) teacherRecords.value.splice(idx, 1);
                    }
                }
                toast.success('Pedido eliminado com sucesso!', {
                    duration: 3000,
                    position: 'top-center',
                    style: {
                        backgroundColor: '#ffffff'
                    },
                })
            }

            // 5) Pagination
            const currentPage = ref(1);
            const pageSize = 9;
            const totalPages = computed(() =>
                Math.ceil(filteredData(activeTab.value).length / pageSize)
            );
            const pageNumbers = computed(() =>
                Array.from({ length: totalPages.value }, (_, i) => i + 1)
            );
            function goToPage(p: number) {
                currentPage.value = Math.min(Math.max(p, 1), totalPages.value);
            }
            const paginatedData = computed(() => {
                const all = filteredData(activeTab.value);
                const start = (currentPage.value - 1) * pageSize;
                return all.slice(start, start + pageSize);
            });

            watch(activeTab, () => {
                currentPage.value = 1;
                selectedIds.value.clear();
                sortKey.value = null;
                sortOrder.value = 'asc';
                searchQuery.value = '';
            });

            function formatDate(d: Date) {
                const day = d.toLocaleDateString('pt-PT', { day: '2-digit' });
                const month = d.toLocaleDateString('pt-PT', { month: 'short' });
                const year = d.toLocaleDateString('pt-PT', { year: 'numeric' });

                return `${day} ${month} ${year}`;
            }

            return {
                tabs,
                activeTab,
                searchQuery,
                sortKey,
                sortOrder,
                onSort,
                sortIcon,
                selectedIds,
                selectedArray,
                allSelected,
                toggleSelectAll,
                approveSelected,
                rejectSelected,
                archiveSelected,
                deleteArchivedSelected,
                editItem,
                isModalOpenStudent,
                isModalOpenTeacher,
                selectedRequestStudent,
                selectedRequestTeacher,
                archiveItem,
                deleteItem,
                currentPage,
                pageNumbers,
                totalPages,
                goToPage,
                paginatedData,
                filteredData,
                formatDate,
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
.tabs {
    display: flex;
    height: 70px;
    margin-top: 10px;
    padding: 0px 20px;
    align-items: bottom;
    gap: 25px;
    flex-shrink: 0;
    align-self: stretch;
    width: 100%;
}
.tab {
    padding: 8px 12px;
    border: none;
    background: transparent;
    font-size: 1.2em;
    color: rgba(102, 102, 102, 0.70);
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    cursor: pointer;
}
.tab.active {
    border-bottom: 2px solid rgba(2, 75, 120, 0.70);
    color: rgba(2, 75, 120, 0.70);
}
.tab .count {
    background: #e9ecef;
    border-radius: 4px;
    padding: 1px 6px;
    margin-left: 4px;
    font-size: 0.7em;
    font-weight: 600;

}
.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 65px;
    padding: 0px 20px;
}
.actions {
    display: flex;
    gap: 8px;
}
.btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    font-size: 0.9em;
    cursor: pointer;
    font-weight: 700;
    color: rgba(102, 102, 102, 0.40);
}
.btn-approve {
    display: flex;
    border-radius: 20px;
    border: 1px solid rgba(147, 147, 147, 0.30);
    height: 32px;
    padding: 0px 15px;
    justify-content: center;
    align-items: center;
    gap: 6px;
}
.btn-reject {
    display: flex;
    border-radius: 20px;
    border: 1px solid rgba(147, 147, 147, 0.30);
    height: 32px;
    padding: 0px 15px;
    justify-content: center;
    align-items: center;
    gap: 6px; 
}
.btn-archive {
    display: flex;
    border-radius: 20px;
    border: 1px solid rgba(147, 147, 147, 0.30);
    height: 32px;
    padding: 0px 15px;
    justify-content: center;
    align-items: center;
    gap: 6px; 
}
.btn-delete {
    display: flex;
    border-radius: 20px;
    border: 1px solid rgba(147, 147, 147, 0.30);
    height: 32px;
    padding: 0px 15px;
    justify-content: center;
    align-items: center;
    gap: 6px; 
}
.btn:disabled {
    opacity: 0.4; cursor: not-allowed;
}
.table-auto {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
}
.table-auto th,
.table-auto td {
    height: 55px;
    padding: 8px 12px;
    border-top: 1px solid rgba(102, 102, 102, 0.20);
    font-size: 15px;
    color: rgba(102, 102, 102, 0.90);
    
}
.table-auto th {
    cursor: pointer;
    user-select: none;
    font-weight: 400;
}
.table-auto td {
    font-weight: 200;
}
.sort-indicator {
    margin-left: 4px;
    color: #024B78;
}
.status.pendente {
    background: rgba(2, 75, 120, 0.40);
    color: #024B78;
}
.status.recusado {
    background-color: rgba(205, 173, 179, 1);
    color: #823142;
}
.status.aprovado {
    background-color: rgba(22, 109, 32, 0.4);
    color: #166D20;
}
.actions-cell {
    display: flex;
    gap: 25px;
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
</style>