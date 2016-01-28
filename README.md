# 流沙流量充值接口

## DEMO

```js
var liusha = require('liusha')({
	apiUrl:"",//流沙流量充值地址http://xxx.xxx.cn/(测试)
	appid:"",//appid
	appkey:""//appkey
});
//直充接口
liusha.flowTopUp({
        mobile:"",//手机号
        skuId:""//套餐id
},function(err,data){
        //todo
});
```

## API:

[`flowTopUp`](#flowTopUp) : 直充到用户手机上

[`query`](#query) : 充值结果查询

[`exists`](#exists) : 判断充值订单是否存在

[`success`](#success) : 判断充值订单是否成功到账

[`balance`](#balance) : 查询账户余额



--------

<a name="flowTopUp" />
flowTopUp:流量充值接口

```js
liusha.flowTopUp({ 
    mobile:"",//手机号
    skuId:""//套餐id
},function(err,data){
	//todo
});
```

<a name="query" />
query:充值结果查询

```js
liusha.query(orderId,function(err,data){
	//todo
});
```

<a name="exists" />
exists:判断充值订单是否存在

```js
liusha.exists(orderId,function(err,data){
	//todo
});
```

<a name="success" />
success:判断充值订单是否成功到账

```js
//status 为可选(默认是2)，0表示充值失败，1表示充值中，2表示充值成功
liusha.success(orderId,status,function(err,data){
	//todo
});
```

<a name="balance" />
balance:查询余额

```js
liusha.balance(function(err,data){
	//todo
});
```
