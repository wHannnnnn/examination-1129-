<template>
<div class="indextop">
    <div class="top_center" @click='goHome'>
      <b>训练考核系统</b>
    </div>
    <div class="top_center2">
      管理平台
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      
    }
  },
  watch: {
    
  },
  methods: {
    goHome:function(){
      //this.$router.go(-1)
      this.$router.push({path:'./'})
    }
  },
  mounted:function(){
    
      
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.indextop{
  padding-top: 10px;
  height: 80px;
  line-height: 80px;
  width: 100%;
  background: url('./../../../assets/img/index1.png') center center no-repeat;
  background-size: 100% 100%;
}
.top_center{
  height: 50px;
  line-height: 50px;
  font-size: 30px;
  cursor: pointer;
}

.top_center2{
  height: 30px;
  line-height: 30px;
  font-size: 18px;
}

</style>
