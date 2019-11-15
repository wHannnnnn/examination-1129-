/*
* @Author: sunlandong
* @Date:   2017-03-11 12:06:49
* @Last Modified by:   sunlandong
* @Last Modified time: 2017-03-11 16:30:03
*/

import Vue from 'vue'
function DataTransfer (data) {
  if (!(this instanceof DataTransfer)) {
    return new DataTransfer(data,items)
  }
}

DataTransfer.treeToArray = function (data,items) {
  let tmp = []
  Array.from(data).forEach(function (record) {
    tmp.push(record)
    if (record.knowledgePoints && record.knowledgePoints.length > 0) {
      // record['disabled'] = true
      DataTransfer.treeToArray(record.knowledgePoints,items)
    }
    if(record.name == items.name){
        record.disabled = false
      // record.knowledgePoints.push(items)
    }
  })
  
  return tmp
}

export default DataTransfer
