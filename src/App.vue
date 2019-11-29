<template>
  <div id="app">

    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  mounted:function(){
    // window.onbeforeunload = function(e){
    //   var storage = window.localStorage
    //   storage.clear()
    // }
    // window.onpopstate = () => {
    // if (!this.$store.state.allowBack) {    //    这个allowBack 是存在vuex里面的变量
    //     history.go(1)
    //   }
    // }
  }
}
</script>
