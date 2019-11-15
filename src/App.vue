<template>
  <div id="app">

    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  mounted:function(){
    // window.onpopstate = () => {
    // if (!this.$store.state.allowBack) {    //    这个allowBack 是存在vuex里面的变量
    //     history.go(1)
    //   }
    // }
  }
}
</script>
<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size:16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  min-width: 960px;
  min-height: max-content;
  min-height: -moz-max-content;
  height:100%;
  background-size:100% 100%;
}
</style>
