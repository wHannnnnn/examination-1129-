<template>

  <div class="svg-wrapper">
      <svg height="40" width="110" xmlns="http://www.w3.org/2000/svg">
        <rect id="shape" height="40" width="110"></rect>
        </svg><div id="text">
          <a href="javascript:;"><span class="spot"></span>{{msg}}</a>
        </div>
    </div>

</template>

<script>
  
export default {
  name: 'unit_button',
  data () {
    return {
      
    }
  },
  methods: {
    
  },
  props:{
    msg:null
  }       
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
