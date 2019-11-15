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
    for (var i = 0; i < items.length; i++) {
      if(record.name == items[i].name){
        record.disabled = true
      }
    }
  })
  
  console.log(tmp,7878787);

  // return tmp
}

export default DataTransfer
