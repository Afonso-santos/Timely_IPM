<template>
    <main class="flex flex-col justify-start items-center main">
        <div class="w-[1000px]">
            <div class= "flex flex-row justify-between">
                <div class="text-sky-900 text-2xl font-semibold">
                    Pedidos
                </div>
                <div 
                    class="!px-2.5 cursor-pointer py-2.5 bg-sky-900/90 rounded-[10px] shadow-[0px_4px_5px_0px_rgba(0,0,0,0.10)] inline-flex justify-center items-center"
                    @click="isModalOpen = true"
                >
                    <div class="text-center justify-center text-white text-sm font-medium">Novo Pedido</div>
                </div>
            </div>

            <div class="student-table">
                <!-- Table -->
                <table class="table-auto w-full">
                    <thead>
                        <tr>
                            <th @click="onSort('pedido')" class="cursor-pointer select-none">
                                Pedido
                                <span class="sort-indicator inline-block ml-1">
                                    <component
                                        :is="sortIcon('pedido')"
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
                            <th @click="onSort('turno')" class="cursor-pointer select-none">
                                Turno
                                <span class="sort-indicator inline-block ml-1">
                                    <component
                                        :is="sortIcon('turno')"
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
                            <th @click="onSort('estado')" class="cursor-pointer select-none">
                                Estado
                                <span class="sort-indicator inline-block ml-1">
                                    <component
                                        :is="sortIcon('estado')"
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
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="item in paginatedData" :key="item.pedido">
                            <td>{{ item.pedido }}</td>
                            <td>{{ item.uc }}</td>
                            <td>{{ item.turno }}</td>
                            <td>{{ item.mudanca }}</td>
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
                            <td>{{ formatDate(item.data) }}</td>
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
        <ModalRequest v-model="isModalOpen" :request="Number(userId)">
            <template #title>Novo Pedido</template>
        </ModalRequest>
    </main>
</template>
  
<script lang="ts"> 
    import { useSessionStorage } from '@/stores/session.ts';
    import { defineComponent, computed, ref, watch, onMounted } from 'vue';
    import { list_ShiftRequests, list_ClassroomRequests } from '../api';
    import type { ShiftRequestData, ClassroomRequestData } from '../types';
    import ModalRequest from '@/components/modals/ModalRequest.vue';
    import { parseISO } from 'date-fns';
    import { toast } from 'vue-sonner';
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
        tipo: 'Estudante';
        turno: string;
    }

    type SortKey = keyof BaseRecord | 'turno' | 'sala' | 'tipo';

    export default defineComponent({
        name: 'RequestTable',
        components: {
            ModalRequest,
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
            const studentRecords = ref<BaseRecord[]>([]);

            const isModalOpen = ref(false);

            const session = useSessionStorage();
            const user = session.name;
            const userId = session.id;

            onMounted(async () => {
                const [shiftDict] = await Promise.all([
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

                studentRecords.value = studentRecords.value.filter((s) => s.nome == user);
            })

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

            // 2) Builds the sorted data
            function sortedData(): BaseRecord[] {
                let list: BaseRecord[] = [];
                list = studentRecords.value;
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

            // 5) Pagination
            const currentPage = ref(1);
            const pageSize = 9;
            const totalPages = computed(() =>
                Math.ceil(sortedData().length / pageSize)
            );
            const pageNumbers = computed(() =>
                Array.from({ length: totalPages.value }, (_, i) => i + 1)
            );
            function goToPage(p: number) {
                currentPage.value = Math.min(Math.max(p, 1), totalPages.value);
            }
            const paginatedData = computed(() => {
                const all = sortedData();
                const start = (currentPage.value - 1) * pageSize;
                return all.slice(start, start + pageSize);
            });

            function formatDate(d: Date) {
                const day = d.toLocaleDateString('pt-PT', { day: '2-digit' });
                const month = d.toLocaleDateString('pt-PT', { month: 'short' });
                const year = d.toLocaleDateString('pt-PT', { year: 'numeric' });

                return `${day} ${month} ${year}`;
            }

            return {
                ModalRequest,
                isModalOpen,
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
                sortedData,
                formatDate,
                ChevronsUpDown,
                ChevronUp,
                ChevronDown,
                userId
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