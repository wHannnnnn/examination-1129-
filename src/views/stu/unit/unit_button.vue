<template>

  <div class="svg-wrapper">
      <svg height="40" width="110" xmlns="http://www.w3.org/2000/svg">
        <rect :id="isChoose?'isshape':'shape'" height="40" width="110"></rect>
        </svg><div id="text">
          <a href="#"><span class="spot"></span>{{msg}}</a>
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
    msg:null,
    isChoose:false
  }       
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #workarea{position:absolute;width:100%;height:100%;background-color:#1e1a3e;font-family:Raleway}

.spot{position:absolute;width:100%;height:100%;top:0;left:0}
.svg-wrapper{margin-top:0;position:relative;width:110px;height:40px;display:inline-block;border-radius:3px;margin-left:5px;margin-right:5px}
#shape{stroke-width:6px;fill:transparent;stroke:#009FFD;stroke-dasharray:85 300;stroke-dashoffset:-165;transition:1s all ease}
/*stroke-dashoffset:-165;下划线位置*/
#text{margin-top:-35px;text-align:center}
#text a{color:white;text-decoration:none;font-weight:100;font-size:1.1em}
.svg-wrapper:hover #shape{stroke-dasharray:50 0;stroke-width:3px;stroke-dashoffset:0;stroke:#06D6A0}

#isshape{stroke-width:6px;fill:transparent;stroke:#009FFD;stroke-dasharray:85 300;stroke-dashoffset:-165;transition:1s all ease}
.svg-wrapper #isshape{stroke-dasharray:50 0;stroke-width:3px;stroke-dashoffset:0;stroke:#06D6A0}

</style>
