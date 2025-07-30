<template>
  <SideBar />
<LeaveViewComp />
</template>

<script>
import LeaveViewComp from "@/components/LeaveViewComp.vue";
import SideBar from "@/components/SideBar.vue";
import attendanceAndLeave from "@/data/attendanceAndLeave";

export default {
  data() {
    return {
      attendanceAndLeave: attendanceAndLeave,
    };
  },

  components: {
    SideBar,
    LeaveViewComp,
  },
};
</script>

<style>
.card{
  font-weight: 500;
}
@media screen and (max-width: 1024px) {
  .leave-div{
    margin-left: 147px !important;
  }
}
@media screen and (max-width: 780px) {
  .leave-div{
    margin-left: 70px !important;
  }
}

</style>
