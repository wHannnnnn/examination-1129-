<template>
<div>
        <el-row>
            <el-col :span="4">
                <div class="grid-content bg-purple">
                    <i class="el-icon-menu"></i>
                    <span v-if="this.$store.state.role =='EXAM_PLAN_TEACHER'" >考核筹划分系统</span>
                    <span v-if="this.$store.state.role =='QUESTIONS_BANK_TEACHER'">知识题库分系统</span>
                    <span>考核筹划分系统</span>
                </div>
            </el-col>
            
            <el-col :span="5" :offset="15">

                <el-dropdown @command='change'>
                        <span class="el-dropdown-link">
                        <!-- {{this.$store.state.loginUser.nickname}} -->
                        更换主题
                        <i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>默认</el-dropdown-item>
                            <el-dropdown-item command="theme1">背景一</el-dropdown-item>
                            <el-dropdown-item command="theme2">背景二</el-dropdown-item>
                        </el-dropdown-menu>
                </el-dropdown>

                <el-dropdown trigger="click" @command='output()'>
                        <span class="el-dropdown-link">
                        <!-- {{this.$store.state.loginUser.nickname}} -->
                        asd
                        <i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item >退出</el-dropdown-item>
                        </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>

        <!-- <li class="title">
            <i class="el-icon-menu"></i>
            <span  v-if="this.$store.state.role =='EXAM_PLAN_TEACHER'" >考核筹划分系统</span>
            <span v-if="this.$store.state.role =='QUESTIONS_BANK_TEACHER'">知识题库分系统</span>
            <span>考核筹划分系统</span>
        </li> -->
        <!-- <li class="option">
            <el-select v-model="value" placeholder="请选择">
                <el-option v-for="item in options" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </li> -->
        <!-- <li class="user">
            <el-dropdown trigger="click" @command='output()'>
                <span class="el-dropdown-link"> -->
                <!-- {{this.$store.state.loginUser.nickname}}<i class="el-icon-caret-bottom el-icon--right"></i> -->
              <!-- </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item >退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </li> -->
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
    output:function(){
      this.$router.push({path: '/login'});
    },
    change(command){
        console.log(command)
        if(command){
            window.document.documentElement.setAttribute('data-theme',command)
        } else {
            window.document.documentElement.removeAttribute('data-theme','')
        }
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.el-row {
   padding: 20px 0;
}
.el-dropdown {
    margin-right: 15px
}
</style>
