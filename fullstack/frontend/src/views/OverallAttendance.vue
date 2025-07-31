<template>
    <div class="table-sep">
        <h3 class="text-center fs-1">This is the overeall attendance</h3>
        <EmployeeOverallAttendance />
    </div>
    <SideBar />
</template>

<script>
import EmployeeOverallAttendance from '@/components/EmployeeOverallAttendance.vue';
import NavBar from '@/components/NavBar.vue';
import SideBar from '@/components/SideBar.vue';

export default {
    components: {
        NavBar,
        EmployeeOverallAttendance,
        SideBar
    }
}
</script>
<style>
.table-sep {
    width: 80%;
    margin-left: 17%;
}

.btn-return {
    margin-left: 210px;
    height: 50px;
    width: 50px;
    border: 2px solid #2d4257;
    text-align: center;
    align-content: center;
    border-radius: 50%;
    position: fixed;
    margin-top: 10px;
}

.i-arrow {
    color: #2d4257;
}

@media screen and (max-width: 1024px) {
    .pageTitle {
        font-size: 40px;
    }
}
</style>