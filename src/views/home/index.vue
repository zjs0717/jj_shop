<script setup lang="ts">

    import {defineAsyncComponent} from 'vue'
    const Header = defineAsyncComponent(() => import('@/components/header/index.vue'))
    const Side = defineAsyncComponent(() => import('@/components/side/index.vue'))
    
</script>

<template>
    <div>
        <Header />
    </div>
</template>