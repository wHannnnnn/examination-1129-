import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const state = {
	login:false,
	access_token: localStorage.getItem('access_token') ? localStorage.getItem('access_token') : null,
	role: localStorage.getItem('role') ? localStorage.getItem('role') : null,
	aId: localStorage.getItem('aId') ? localStorage.getItem('aId') : null,
	loginUser: localStorage.getItem('loginUser') ? JSON.parse(localStorage.getItem('loginUser')) : null,
	dictionarys:null, //登陆获取字典数据
	knowledgeHierachy:[], //知识点
	addSJ:{
		dialogVisible:false
	},
	addKS:{
		dialogVisible:false
	},
	student_login:false,
	allowBack:false,
	KSdata:'',
	ticket:'',  //准考证号
	isTset:false,  //是否可以进入考试页
	isFile:[],
	topicName: ''
};

const mutations = {
	updateAppSetting(state,allowBack) {
		console.log(555,allowBack)
　　　　　　state.allowBack = allowBack;
　　　　},
};

const actions = {

};
export default new Vuex.Store({
  state,mutations,actions
});
