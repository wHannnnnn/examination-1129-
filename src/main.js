import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";
import VueBus from 'vue-bus'
import echarts from 'echarts'
import Vuex from 'vuex'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import $ from 'jquery'
import 'babel-polyfill'
// import store from '@/index.js'
import animate from 'animate.css'
import '@/assets/css/index.css'//更改element默认样式
import '@/assets/css/zzsc.css'//标签云
// student
// import {get,post,resBody,resBody1,res,res1,download} from '@/assets/js/http-service.js'//封装axios
// teacher
import { get, post, resBody, resBody1, resBody2, res, res1, res2, download, download1, download2, stuGet, stuPost, stuResBody, stuResBody1, stuRes, stuRes1, stuDownload, uploadImg} from '@/assets/js/http-service.js'//封装axios

Vue.config.productionTip = false;
import unit_button from '@/components/unit/unit_button.vue' //引入button组件
import unit_player from '@/components/unit/unit_player.vue' //引入附件预览组件
import tools from '@/assets/js/tools.js'//引入工具类
// import {BASEURL,url,imgUrl,imgThumbUrl} from '@/config.js' //生产环境所用配置文件

import '@/assets/css/font-awesome/css/font-awesome.min.css'
Vue.prototype.$echarts = echarts
// 右键弹窗
import VueContextMenu from 'vue-contextmenu'
// import 'vue-contextmenu/style/css/font-awesome.min.css'

// 音频
import AudioVisual from 'vue-audio-visual'
Vue.use(AudioVisual)

// 自定义指令 input自动获取焦点
Vue.directive('focus', function (el) {
    el.querySelector('input').focus()
})
//视频播放
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
// 无缝滚动
import scroll from 'vue-seamless-scroll'
Vue.use(scroll)
// // 富文本编辑器
import  VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import EleMultiCascader from "ele-multi-cascader"

Vue.use(EleMultiCascader)

import EleMultiCascaders from "ele-multi-cascaders"

Vue.use(EleMultiCascaders)

import Viewer from 'v-viewer'
import '@/assets/css/viewer.css'
Vue.use(Viewer)
Vue.use(Viewer, {
    defaultOptions: {
        button: false,
        navbar: false,
        title: false,
        toolbar: true,
    }
})

Vue.use(VueQuillEditor)

Vue.use(VideoPlayer)

Vue.use(VueContextMenu)

Vue.prototype.$axiosGet = get
Vue.prototype.$axiosPost = post
Vue.prototype.$axiosURL = serverIpConfig
Vue.prototype.$imgUrl = imgUrl
Vue.prototype.$imgThumbUrl = imgThumbUrl
Vue.prototype.$BASEURL = BASEURL1


Vue.prototype.$axiosResBody = resBody
Vue.prototype.$axiosResBody1 = resBody1
Vue.prototype.$axiosRes = res
Vue.prototype.$axiosRes1 = res1
Vue.prototype.$axiosRes2 = res2
Vue.prototype.$axiosDownload = download
Vue.prototype.$axiosDownload2 = download2

// stuGet,stuPost,stuResBody,stuResBody1,stuRes,stuRes1,stuDownload
Vue.prototype.$axiosStuGet = stuGet
Vue.prototype.$axiosStuPost = stuPost
Vue.prototype.$axiosStuResBody = stuResBody
Vue.prototype.$axiosStuResBody1 = stuResBody1
Vue.prototype.$axiosStuRes = stuRes
Vue.prototype.$axiosStuRes1 = stuRes1
Vue.prototype.$axiosStuDownload = stuDownload
Vue.prototype.$uploadImg = uploadImg

Vue.prototype.$tools= tools
Vue.use(VueBus)
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(animate)
Vue.config.productionTip = false

Vue.component('unit_button', unit_button)
Vue.component('unit_player', unit_player)

const teaList = ['/teaindex', '/Home', '/testMaintenance', '/StuManagement', '/questionMaintenance', '/knowManagement', '/examManagement', '/examGD', '/examScore', '/examEvaluation', '/stuEvaluation', '/kjgl', '/jbxx', '/messagetz', '/testStatistics']
// if (!LOGIN && teaList.indexOf(to.path) !== -1) {
//     next({ path: '/login' })
// } 
router.beforeEach((to, from, next) => {
  //const LOGIN = JSON.parse(localStorage.getItem('login'));
  const LOGIN = localStorage.getItem('access_token');
  if(teaList.indexOf(to.path) !== -1){
      if(localStorage.getItem('role') == 'STUDENT' || !LOGIN){
        next({ path: '/' })
      } else {
          next() 
      }
  } else {
      next()
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
