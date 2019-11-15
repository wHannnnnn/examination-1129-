import Vue from "vue";
import Router from "vue-router";
// import Home from "./views/tea/Home.vue";
// import Index from "./views/tea/index.vue";
// import login from "./views/tea/login.vue";
// student
const index = resolve=> require(['@/views/stu/index1'],resolve)
const test_first = resolve=> require(['@/views/stu/test1/first'],resolve)
const test_test = resolve=> require(['@/views/stu/test1/test'],resolve)
const user = resolve=> require(['@/views/stu/user1/user'],resolve)
const testTrain_index = resolve=> require(['@/views/stu/testTrain1/index'],resolve)
const testTrain_test = resolve=> require(['@/views/stu/testTrain1/test'],resolve)
const mockExam_index = resolve=> require(['@/views/stu/mockExam1/index'],resolve)
const mockExam_test = resolve=> require(['@/views/stu/mockExam1/mockExam'],resolve)
const classRoom_index = resolve=> require(['@/views/stu/classRoom1/index'],resolve)
const learning_index = resolve=> require(['@/views/stu/learning1/index'],resolve)
const classRoom = resolve=> require(['@/views/stu/classRoom1/classRoom'],resolve)
const more = resolve=> require(['@/views/stu/more/more'],resolve)
// 热门视频
const hot_video = resolve=> require(['@/views/stu/lefttab/hotvideo'],resolve)
// 精彩博文
const blog = resolve=> require(['@/views/stu/lefttab/blog'],resolve)
// 最新教案
const teaplan = resolve=> require(['@/views/stu/lefttab/teaplan'],resolve)
// 流行音乐
const hot_music = resolve=> require(['@/views/stu/lefttab/hotmusic'],resolve)
// 热点图片
const hot_pic = resolve=> require(['@/views/stu/lefttab/hotpic'],resolve)
// 交流平台
const online = resolve=> require(['@/views/stu/online/index'],resolve)

//交流平台 导航
const hotTopic = resolve => require(['@/views/stu/online/rightNav/hotTopic'], resolve)
const topicDetails = resolve => require(['@/views/stu/online/rightNav/topicDetails'], resolve)
const myTopic = resolve => require(['@/views/stu/online/rightNav/myTopic'], resolve)
const myNews = resolve => require(['@/views/stu/online/rightNav/myNews'], resolve)
const publish = resolve => require(['@/views/stu/online/rightNav/publish'], resolve)
const myCollect = resolve => require(['@/views/stu/online/rightNav/myCollect'], resolve)
const myReplies = resolve => require(['@/views/stu/online/rightNav/myReplies'], resolve)


//teacher
const StuManagement = resolve=> require(['@/views/tea/management/stuManagement.vue'],resolve)
const teaindex = resolve=> require(['@/views/tea/index1'],resolve)
const TestMaintenance = resolve=> require(['@/views/tea/management/testMaintenance.vue'],resolve)
const ExamManagement = resolve=> require(['@/views/tea/management/examManagement.vue'],resolve)
const ExamEvaluation = resolve=> require(['@/views/tea/management/examEvaluation.vue'],resolve)
const stuEvaluation = resolve=> require(['@/views/tea/management/stuEvaluation.vue'],resolve)
const examScore = resolve=> require(['@/views/tea/management/examScore.vue'],resolve)
const examGD = resolve=> require(['@/views/tea/management/examGD.vue'],resolve)
const KnowManagement = resolve=> require(['@/views/tea/management/knowManagement.vue'],resolve)
const QuestionMaintenance = resolve=> require(['@/views/tea/management/questionMaintenance.vue'],resolve)
const TestStatistics = resolve=> require(['@/views/tea/management/testStatistics.vue'],resolve)
const jbxx = resolve=> require(['@/views/tea/management/JBXX.vue'],resolve)
const kjgl = resolve=> require(['@/views/tea/management/kjgl.vue'],resolve)
const messagetz = resolve=> require(['@/views/tea//management/messageTZ.vue'],resolve)
const teaclassRoom = resolve=> require(['@/views/tea/management/classRoom.vue'],resolve)



const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router);

export default new Router({
//   mode: "history",
//   base: process.env.BASE_URL,
  routes: [
      {
            path: '/',
            name: 'index',
            component: index,
            redirect: "blog",
            children: [
                        {
                              path: '/hot_video',
                              name: '热门视频',
                              component: hot_video,
                        },
                        {
                              path: '/blog',
                              name: '精彩博文',
                              component: blog,
                        },
                        {
                              path: '/teaplan',
                              name: '最新教案',
                              component: teaplan,
                        },
                        {
                              path: '/hot_music',
                              name: '流行音乐',
                              component: hot_music,
                        },
                        {
                              path: '/hot_pic',
                              name: '热点图片',
                              component: hot_pic,
                        },
                  ]
      },
      {
            path: '/test_first',
            name: 'test_first',
            component: test_first,
            // meta: {allowBack: false}  
      },
      {
            path: '/test_test',
            name: 'test_test',
            component: test_test,
            // meta: {allowBack: false}  
      },
      {
            path: '/user',
            name: 'user',
            component: user, 
      },
      {
            path: '/testTrain_index',
            name: 'testTrain_index',
            component: testTrain_index,
            children:[
                  {
                        path: '/testTrain_test',
                        name: 'testTrain_test',
                        component: testTrain_test,
                  },
                  {
                        path: '/mockExam_index',
                        name: 'mockExam_index',
                        component: mockExam_index, 
                  },
            ] 
      },
      // {
      //       path: '/testTrain_test',
      //       name: 'testTrain_test',
      //       component: testTrain_test, 
      // },
      // {
      //       path: '/mockExam_index',
      //       name: 'mockExam_index',
      //       component: mockExam_index, 
      // },
      {
            path: '/mockExam_test',
            name: 'mockExam_test',
            component: mockExam_test, 
      },
      {
            path: '/classRoom_index',
            name: 'classRoom_index',
            component: classRoom_index, 
      },
      {
            path: '/learning_index',
            name: 'learning_index',
            component: learning_index, 
      },
      {
            path: '/classRoom',
            name: 'classRoom',
            component: classRoom, 
      },
      {
            path: '/more',
            name: 'more',
            component: more, 
      },
      {
            path: '/online',
            name: 'online',
            component: online,
            redirect: 'hotTopic',
            children:[
                  {
                        path: '/hotTopic',
                        name: '热门话题',
                        component: hotTopic,
                  },
                  {
                        path: '/topicDetails/:id',
                        name: '/topicDetails',
                        component: topicDetails,
                  },
                  {
                        path: '/myTopic',
                        name: '我的话题',
                        component: myTopic,
                  },
                  {
                        path: '/myNews',
                        name: '个人消息',
                        component: myNews,
                  },
                  {
                        path: '/publish',
                        name: '发表话题',
                        component: publish,
                  },
                  {
                        path: '/myCollect',
                        name: '我的收藏',
                        component: myCollect,
                  },
                  {
                        path: '/myReplies',
                        name: '我的回帖',
                        component: myReplies,
                  },

            ]
      },  
      {
            path: "/teaindex",
            name: "teaindex",
            component: teaindex,
            redirect:"StuManagement",
            children: [
                  // {
                  // path: '/Home',
                  // name: '系统首页',
                  // component: Home,
                  // },
                  {
                  name: '考生管理',
                  path: '/stuManagement',
                  component: StuManagement
                  },

                  {
                        name: '试卷信息维护',
                        path: '/testMaintenance',
                        component: TestMaintenance
                  },
                  {
                        name: '考试信息管理',
                        path: '/examManagement',
                        component: ExamManagement
                  },
                  {
                        name: '试卷评分',
                        path: '/examScore',
                        component: examScore
                  },
                  {
                        name: '试卷归档',
                        path: '/examGD',
                        component: examGD
                  },
                  {
                        name: '试卷分析',
                        path: '/examEvaluation',
                        component: ExamEvaluation
                  },
                  {
                        name: '考生分析',
                        path: '/stuEvaluation',
                        component: stuEvaluation
                  },
                  {
                        name: '知识点管理',
                        path: '/knowManagement',
                        component: KnowManagement
                  },
                  {
                        name: '试题维护管理',
                        path: '/questionMaintenance',
                        component: QuestionMaintenance
                  },
                  {
                        name: '题库统计',
                        path: '/testStatistics',
                        component: TestStatistics
                  }, 
                  {
                        name: '基本信息',
                        path: '/jbxx',
                        component: jbxx
                  }, 
                  {
                        name: '课件管理',
                        path: '/kjgl',
                        component: kjgl
                  }, 
                  {
                        name: '消息通知',
                        path: '/messagetz',
                        component: messagetz
                  },
                  {
                  path: '/teaclassRoom',
                  name: '课件详情',
                  component: teaclassRoom, 
                  },
            ]
      },

]
      
});
