<template>
    <main class="home-page" style="display: flex; align-items: center; justify-content: center;"> 
        
        <div class style="display: flex; flex-direction: column; width: 1000px; align-items: flex-start; justify-content: center; gap: 35px; padding: 156px 0px;">
        
            <span class="title">Unidades Curriculares</span>

            <span class style="display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 10px;">
                
                <span class="card">
                    <span class="group">
                        <span class="text">Análise Matemática para Engenharia</span>
                        <span class="text">Elementos de Probabilidades e Teoria de Números</span>
                        <span class="text">Laboratórios de Informática II</span>
                        <span class="text">Lógica</span>
                        <span class="text">Programação Imperativa</span>
                        <span class="text">Sistemas de Computação</span>
                    </span>
                    <span class="label">1º Ano</span>
                </span>
    
                <span class="card">
                    <span class="group">
                        <span class="text">Bases de Dados</span>
                        <span class="text">Investigação Operacional</span>
                        <span class="text">Métodos Numéricos e Otimização Não Linear</span>
                        <span class="text">Programação Orientada aos Objetos</span>
                        <span class="text">Redes de Computadores</span>
                        <span class="text">Sistemas Operativos</span>
                    </span>
                    <span class="label">2º Ano</span>
                </span>
    
                <span class="card">
                    <span class="group">
                        <span class="text">Aprendizagem e Decisão Inteligentes</span>
                        <span class="text">Computação Gráfica</span>
                        <span class="text">Engenharia Web</span>
                        <span class="text">Interface Pessoa-Máquina</span>
                        <span class="text">Processamento de Linguagens</span>
                        <span class="text">Segurança de Sistemas Informáticos</span>
                    </span>
                    <span class="label">3º Ano</span>
                </span>
    
                <span class="card" style="align-items: center;">
                    <span class style="font-weight: normal; font-size: 18px; text-align: center; letter-spacing: 0.54px; color: #939393B2">Nenhuma Unidade Curricular a mostrar.</span>
                    <span class="label" style="margin-left: 825px;">4º Ano</span>
                </span>

            </span>
            
        </div>

    </main>
</template>

<script setup lang="ts">
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