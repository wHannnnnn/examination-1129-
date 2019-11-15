/*
* @Author: sunlandong
* @Date:   2017-03-11 12:06:49
* @Last Modified by:   sunlandong
* @Last Modified time: 2017-03-11 16:30:03
*/

import Vue from 'vue'
function DataTransfer (data) {
  if (!(this instanceof DataTransfer)) {
    return new DataTransfer(data,name)
  }
}

DataTransfer.treeToArray = function (data,name) {
  let tmp = []
  Array.from(data).forEach(function (record) {
    tmp.push(record)
    if (record.knowledgePoints && record.knowledgePoints.length > 0) {
      // record['disabled'] = true
      DataTransfer.treeToArray(record.knowledgePoints,name)
    }
    if(record.name == name){
      record.disabled = true
      return
    }
  })
  // return tmp
}

export default DataTransfer
