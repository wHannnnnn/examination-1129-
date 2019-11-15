<template>
  <div class="unit_player">
      <div v-if="FJdata.questionAccessoryType == 'PICTURE'" class='HW100'>
        <img :src="FJdata.requestFullPathAndFileName" class="imgClass">
      </div>
      <div v-if="FJdata.questionAccessoryType == 'VOICE'" class='HW100'>
        <div>
          {{FJdata.name}}
        </div>
        <av-bars
          caps-color="#FFF"
          :bar-color="['#f00', '#ff0', '#0f0']"
          canv-fill-color="#000"
          :caps-height="2"
          :symmetric="true"
          :cors-anonym="true"
          audio-src="FJdata.requestFullPathAndFileName"
        ></av-bars>
  <!--       <audio :src="FJdata.requestFullPathAndFileName" controls="controls" ></audio> -->

      </div>
      <div v-if="FJdata.questionAccessoryType == 'VIDEO'" class='HW100'>
        <div class="player">
          <video-player  class="video-player vjs-custom-skin"
           ref="videoPlayer"
           :playsinline="true"
           :options="playerOptions">
          </video-player>
        </div>
      </div>
      <div v-if="FJdata.fileType == 1" class='HW100' style="text-align: center;">
        <img :src="this.$BASEURL + FJdata.onlinePath" class="imgClass">
        <span style='display: inline-block;height:100%;vertical-align: middle'></span>
      </div>
      <div v-show="FJdata.fileType == 0" class='HW100'>
        <div style='height: 600px;overflow-x: hidden;overflow-y: auto;'>
          <pdf 
          v-for='item in numPages'
          :key='item'
          :page='item'
          :src="FJdata.onlinePath"
          ></pdf>
        </div>
      </div>
      <div v-if="FJdata.fileType == 3" class='HW100'>
        <div class="player">
           <video-player  class="video-player vjs-custom-skin"
           ref="videoPlayer"
           :playsinline="true"
           :options="playerOptions1">
          </video-player>
        </div>
      </div>
  </div>
</template>

<script>
  import pdf from 'vue-pdf'
export default {
  name: 'unit_player',
  components: {
      pdf
    },
  data () {
    return {
      playerOptions : {
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "",
            src: this.$BASEURL + this.FJdata.requestFullPathAndFileName //url地址
          }],
          poster: "", //你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          }
        },
        playerOptions1 : {
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "",
            src: this.$BASEURL + this.FJdata.onlinePath //url地址
          }],
          poster: "", //你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          }
        },
        numPages:undefined, //pdf总页数
    }
  },
  methods: {
    
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  mounted:function(){
    console.log('onlinePath',this.FJdata.onlinePath)
    var loadingTask = pdf.createLoadingTask({
      url:this.FJdata.onlinePath,
    });
    loadingTask.then(pdf => {
      this.numPages = pdf.numPages;
    });
  },
  updated:function(){
    this.playerOptions1.sources[0].src = this.$BASEURL + this.FJdata.onlinePath
  },
  props:{
    FJdata:null,
  }       
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .unit_player{
  width: 100%;
  height: 100%;
  color: #fff;
 }
 .imgClass{
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
 }
 .player {
  margin: 0 auto;
  max-height: 100%;
}
.HW100{
  height:100%;
  width:100%;
  text-align: center;
}
</style>
