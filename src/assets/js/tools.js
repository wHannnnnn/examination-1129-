
//秒转时分秒
const MtoSFM = function (val) {
	var s = parseInt(val)
	var m = 0
	var h = 0
	if (s>60) {
		m = parseInt(s/60)
		s = parseInt(s%60)
		if (m>60) {
			h = parseInt(m/60)
			m = parseInt(m%60)
		}
	}
	var result = '' + parseInt(s) + '秒'
	if (m>0) {
		result = '' + parseInt(m) + '分' + result
	}
	if (h>0) {
		result = '' + parseInt(h) + '小时' + result
	}
	return result
}

//UTC时间转正常时间
const UTCtoDate = function (timestamp) {
	 // var T= date.indexOf('T')
  //     var Z= date.indexOf('Z')
  //     var year_month_day = date.substr(0,T)
  //     var hour_min_second = date.substr(T+1,Z-T-1)
  //     var new_dateTime = year_month_day + '' + hour_min_second

  //     var timestamp = new Date(Date.parse(new_dateTime)).getTime()/1000 +8*60*60

  //     var dateTime = new Date(parseInt(timestamp)*1000).toLocaleString().splic('下午')[0]
  //     return dateTime
        var date = new Date(timestamp)
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
        var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
        var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        return Y + M + D + h + m + s
}

//string超出长度省略号
const cutString = function (str,len) {
	 if (str.length*2<=len) {
	 	return str
	 }
	 var strlen= 0
	 var s = ''
	 for (var i =0; i < str.length ; i++) {
	 	s = s +str.charAt(i);
	 	if (str.charCodeAt(i)>128) {
	 		strlen = strlen + 2
	 		if (strlen>=len) {
	 			return s.substring(0,s.length-1)+'...'
	 		} 
	 	}else {
	 		strlen = strlen + 1
	 		if (strlen >= len) {
	 			return s.substring(0,s.length-2)+'...'
	 		} 
	 	}
	 }
	 return s
	 // var reg = /[\u4e00-\u9fa5]/g
	 // var slice = str.substring(0,len)
	 // var chineseCharNum = ((slice.match(reg)&&slice.match(reg).length))
	 // var realen = slice.length * 2 - chineseCharNum
	 // return str.substring(0,realen)+(realen<str.length?'...':'')
}
// 判断用户loginUser.id是否存在
function userid(val){
	if(val=='id'){
		return sessionStorage.getItem('loginUser') == null ? null : JSON.parse(sessionStorage.getItem('loginUser')).id
	}
	if(val=='username'){
		return sessionStorage.getItem('loginUser') == null ? null : JSON.parse(sessionStorage.getItem('loginUser')).username
	}  
}
const tools = {
	MtoSFM:MtoSFM,
	UTCtoDate:UTCtoDate,
	cutString:cutString,
	userid: userid
}

export default tools