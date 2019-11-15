const BASEURL = "http://192.168.43.70:8080/"
const imgUrl = 'http://192.168.43.70:8080/api-ac/FileManipulateCenter/Accessory/Picture/'
const imgThumbUrl = 'http://192.168.43.70:8080/api-ac/FileManipulateCenter/Accessory/Picture/Thumbnail/thumbnail__'
const BASEURL1 = "http://192.168.43.70:8080"

const URL1 ={
  system: BASEURL + 'sys/',
  u_user: BASEURL + 'api-u/',
  u_users: BASEURL+'api-u/users/',
  e_examination: BASEURL + 'api-e/examination/',
  e_examinationPaper: BASEURL + 'api-e/examinationPaper/',
  k_knowledgeHierachy: BASEURL + 'api-k/knowledgeHierachy/',
  k_knowledgePoint: BASEURL + 'api-k/knowledgePoint/',
  k_examinationQuestion: BASEURL + 'api-k/examinationQuestion/',
  K_examinationQuestionAccessory: BASEURL + 'api-k/examinationQuestionAccessory/',
  b_dictionarys : BASEURL+'api-b/dictionarys/dictMap',
  k_common: BASEURL+'api-k/common/',
  b_stuStatistics: BASEURL+'api-b/findStuStatistics',
  fm_fileManipulate: BASEURL + 'api-fm/fileManipulate',
  b_queStatistics: BASEURL+'api-b/queStatistics',
  f_file: BASEURL+'api-f/file/',
  f_upload: BASEURL+'api-f/upload/',
  n_notice: BASEURL+'api-n/notice/',
  // student
  student: BASEURL + 'stu/',
  b_findStuStatistics : BASEURL+'api-b/findStuStatistics',
  f_downloadFile:BASEURL+'api-f/downloadFile/',
  f_search:BASEURL+'api-f/file/',
  K_knowledgePoint:BASEURL+'api-k/knowledgePoint/',
  u_notice: BASEURL+'api-u/notice/',
  K_neoUser:BASEURL+'api-k/neoUser/',
  // 話題部分
  Fr_topic: BASEURL + 'api-fr/topic/',
  Fr_userTopic: BASEURL + 'api-fr/userTopic/',
  Fr_comment: BASEURL + 'api-fr/comment/',
  Fr_personMsg: BASEURL + 'api-fr/personMsg/',
  // 全文检索
  Fr_es: BASEURL + 'api-fr/es/',
}

window.serverIpConfig = URL1
window.imgUrl = imgUrl
window.imgThumbUrl = imgThumbUrl
window.BASEURL1 = BASEURL1