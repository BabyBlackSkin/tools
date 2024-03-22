<template>
  <div class="home">
    <div class="title">
      <h1>
        The
        <span>Tools</span>
      </h1>
    </div>
    <el-divider style="width: 80% !important;"></el-divider>
  </div>
</template>

<script>


export default {
  name: 'HomeView',
  components: {
  },
  data() {
    return {
      update_info: null
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }

}
</script>
<style>
.home{
  width: 100%;
  height: 100%;
}
.home .title{
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100%;
}
.home h1{
  font-size: 4rem;
}
.home span{
  background: -webkit-linear-gradient(315deg,#42d392 25%,#647eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent
}
</style>
