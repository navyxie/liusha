var request = require('request');
var _ = require('lodash');
var crypto = require('crypto');
/**
 *md5加密
 *@param string data
 *@param string format
 *@return hex
**/
function md5(data,format){
	var MD5 = crypto.createHash("md5");
	MD5.update(data);
	return MD5.digest(format || 'hex');
}
/**
 * 对象按键排序
 * @param object obj
 * @param boolean desc
 * @return object
*/
function sortObjectByKey(obj,desc){
	var keys = Object.keys(obj);
	var returnObj = {};
	keys = keys.sort();
	if(desc){
		keys = keys.reverse();
	}
	for(var i = 0 , len = keys.length ; i < len ; i++){
		returnObj[keys[i]] = obj[keys[i]];
	}
	return returnObj;
}
/**
 *将请求对象拼接成加密字符串
 *@param object json
 *@return string
*/
function jsontosearch(json){
	var search = '';
	if(_.isObject(json)){
		var cloneJson = sortObjectByKey(_.clone(json));
		_.forEach(cloneJson,function(val,key){
			search += key + '=' + val + '&';
		});
	}
	return search.substring(0,search.length-1);
}
/**
 *获取MD5加密sign
 *@param object paramObj
 *@param string appkey,流沙分配
 *@return string
*/
function getSign(paramObj,appkey){
	var sign = md5(jsontosearch(paramObj)+appkey);
	return sign.substring(0,16);
}
function basePostQuest(url,data,cb){
	// console.log('url:',url,'data',data);
	request.post({url:url,form:data},function(error,response,body){
		if(!error && response.statusCode === 200){
			try{
				body = JSON.parse(body);
				cb(null,body);
			}catch(e){
				cb('流量赠送异常:'+body);
			}
		}else{
			cb(error, response, body);
		}	
	});
}
function LIUSHA(config){
	this.config = {}
	if(_.isObject(config)){
		this.config.apiUrl = config.apiUrl;
		this.config.appid = config.appid;
		this.config.appkey = config.appkey;
	}
}
LIUSHA.prototype.baseParam = function(params){
	var config = this.config;
	params = _.extend(params,{appid:config.appid,timestamp:parseInt((params.timestamp || Date.now())/1000)});
	return params;
}
LIUSHA.prototype.checkBaseParam = function(params){
	if(!_.isObject(params)){
		return {pass:false,msg:'参数必须是json'}
	}
	if(!params.apiUrl){
		return {pass:false,msg:'缺少api请求地址:apiUrl'}
	}
	if(!params.appid){
		return {pass:false,msg:'缺少appid:appid'}
	}
	if(!params.timestamp){
		return {pass:false,msg:'缺少timestamp:timestamp'}
	}
	if(!params.appkey){
		return {pass:false,msg:'appkey:appkey'}
	}
	return {pass:true,msg:'ok'};
}
LIUSHA.prototype.flowTopUp = function(params,cb){
	var defaultConfig = _.clone(this.config);
	params = _.extend(defaultConfig,params);
	params = _.extend(params,this.baseParam(params));
	var checkResult = this.checkBaseParam(params);
	if(!checkResult.pass){
		return cb(checkResult.msg);
	}
	if(!params.mobile){
		return cb('缺少手机:mobile');
	}
	if(!params.skuId){
		return cb('缺少套餐ID:skuId');
	}
	var toParams = {
		mobile:params.mobile,
		skuId:params.skuId
	}
	toParams = this.baseParam(toParams);
	var sign = getSign(toParams,params.appkey);
	toParams.sign = sign;
	var url = defaultConfig.apiUrl+'ent/flow-topup';
	basePostQuest(url,toParams,function(err,data){
		cb(err,data);
	});
}
LIUSHA.prototype.balance = function(cb){
	var defaultConfig = _.clone(this.config);
	var toParams = {};
	toParams = this.baseParam(toParams);
	var sign = getSign(toParams,defaultConfig.appkey);
	toParams.sign = sign;
	var url = defaultConfig.apiUrl+'ent/query-balance';
	basePostQuest(url,toParams,function(err,data){
		cb(err,data);
	});
}
LIUSHA.prototype.query = function(orderId,cb){
	var defaultConfig = _.clone(this.config);
	var toParams = {
		orderId:orderId
	}
	toParams = this.baseParam(toParams);
	var sign = getSign(toParams,params.appkey);
	toParams.sign = sign;
	var url = defaultConfig.apiUrl+'ent/flow-query';
	basePostQuest(url,toParams,function(err,data){
		cb(err,data);
	});
}
LIUSHA.prototype.exists = function(params,cb){
	this.query(params,function(err,data){
		if(!err && _.isObject(data)){
			if(data.resultcode === '2001'){
				cb(null,false);
			}else{	
				cb(null,true);
			}
		}else{
			cb(err || data);
		}
	});
}
LIUSHA.prototype.success = function(orderId,cb){
	this.query(orderId,function(err,data){
		if(!err && _.isObject(data)){
			if(data.status === '2'){
				cb(null,true);
			}else{	
				cb(null,false);
			}
		}else{
			cb(err || data);
		}
	});
}
function LSINSTANCE(config){
	return new LIUSHA(config);
}
module.exports = LSINSTANCE;