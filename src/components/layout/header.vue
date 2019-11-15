<template>
<div class="header-wraper">
    <el-menu theme="dark" default-active="1" class="el-menu-demo" mode="horizontal" @select="handleSelect">

        <li class="title">
            <i class="el-icon-menu"></i>
            <span  v-if="this.$store.state.role =='EXAM_PLAN_TEACHER'" >考核筹划分系统</span>
            <span v-if="this.$store.state.role =='QUESTIONS_BANK_TEACHER'">知识题库分系统</span>
        </li>
        <!-- <li class="option">
            <el-select v-model="value" placeholder="请选择">
                <el-option v-for="item in options" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </li> -->
        <li class="user">
            <el-dropdown trigger="click" @command='output()'>
                <span class="el-dropdown-link">
                {{this.$store.state.loginUser.nickname}}<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item >退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </li>
    </el-menu>
</div>
</template>

<script>

export default {
  name: '',
  data () {
    return {
      
    }
  },

  methods: {
    handleSelect(key, keyPath) {
       console.log(key, keyPath);
    },
    output:function(){
      this.$router.push({path: '/login'});
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.header-wraper .el-menu-demo{
  background:transparent !important;
}
.header-wraper li {
    float: left;
    margin-right: 20px;
    margin-top: 5px;  
}

.title {
    padding: 1em .2em;
}

.title span {
    font-size: 1.4em;
    margin-left: 5px;
}
.el-select-dropdown__list{
  max-height: 187px !important;
}
.option {
    padding-top: 10px;
}

.user .el-dropdown {
    position: absolute;
    right: 20px;
    padding-top: 20px;
    /*color: #fff !important;*/
}
.el-dropdown-link{
  color: #fff
}
</style>
