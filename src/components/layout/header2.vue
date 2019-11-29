<template>
    <el-row style="width:100%">

        <div class="header-left">
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <span class="title" @click="index" style="cursor:pointer;padding: 0 10px;">综合训练考核系统</span>
                </div>
            </el-col>
        </div>

        <div class="header-center">
            <el-col :span="11" style="color: #fff0;">
                a
            </el-col>
        </div>

        <div class="header-right">
            <el-col :span="7" style="text-align: right">
                <el-dropdown @command='change' trigger="click">
                        <span class="el-dropdown-link">
                    <!-- {{this.$store.state.loginUser.nickname}} -->
                    换肤
                    <i class="el-icon-caret-bottom el-icon--right"></i>
                    </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>默认</el-dropdown-item>
                            <el-dropdown-item command="theme1">背景一</el-dropdown-item>
                        </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                    {{this.$store.state.loginUser.nickname}}<i class="el-icon-caret-bottom el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="output">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </div>

    </el-row>
    <!-- <el-menu theme="dark" default-active="1" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-dropdown trigger="click" @command='output()'>
            <span class="el-dropdown-link">
            {{this.$store.state.loginUser.nickname}}<i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item >退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </el-menu> -->
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
    index(){
        this.$router.push({path: '/'})
    },
    handleSelect(key, keyPath) {
       console.log(key, keyPath);
    },
    output:function(){
            this.$confirm('是否退出登录?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success'
            }).then(() => {
                localStorage.removeItem('access_token')
                localStorage.removeItem('loginUser')
                localStorage.removeItem('role')
                localStorage.removeItem('aId')
                this.$store.state.access_token = null
                this.$store.state.loginUser = null
                this.$store.state.role = null
                this.$store.state.aId = null
                this.isLogin = false;
                this.$router.push({path: '/'});
            }).catch(() => {

            });
    },
    change(command) {
            if (command) {
                window.document.documentElement.setAttribute('data-theme', command)
            } else {
                window.document.documentElement.removeAttribute('data-theme', '')
            }
    },
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
