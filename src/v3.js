/*版权：@amhoho http://github.com/amhoho/smartload*/
!function(l,h){"object"==typeof exports&&"undefined"!=typeof module?h():"function"==typeof define&&define.amd?define(h):h()}(0,function(){function l(a){var b=this.constructor;return this.then(function(c){return b.resolve(a()).then(function(){return c})},function(c){return b.resolve(a()).then(function(){return b.reject(c)})})}function h(){}function d(a){if(!(this instanceof d))throw new TypeError("\u5fc5\u987b\u7528new\u6784\u5efa");if("function"!=typeof a)throw new TypeError("not a function");this._state=0;this._handled=!1;this._value=void 0;this._deferreds=[];p(a,this)}function q(a,b){for(;3===a._state;)a=a._value;0!==a._state?(a._handled=!0,d._immediateFn(function(){var c=1===a._state?b.onFulfilled:b.onRejected;if(null!==c){var f;try{f=c(a._value)}catch(g){return void e(b.promise,g)}m(b.promise,f)}else(1===a._state?m:e)(b.promise,a._value)})):a._deferreds.push(b)}function m(a,b){try{if(b===a)throw new TypeError("\u4e0d\u80fdresolve\u8be5Promise\u81ea\u8eab");if(b&&("object"==typeof b||"function"==typeof b)){var c=b.then;if(b instanceof d)return a._state=3,a._value=b,void n(a);if("function"==typeof c)return void p((f=c,g=b,function(){f.apply(g,arguments)}),a)}a._state=1;a._value=b;n(a)}catch(r){e(a,r)}var f,g}function e(a,b){a._state=2;a._value=b;n(a)}function n(a){2===a._state&&0===a._deferreds.length&&d._immediateFn(function(){a._handled||d._unhandledRejectionFn(a._value)});for(var b=0,c=a._deferreds.length;c>b;b++)q(a,a._deferreds[b]);a._deferreds=null}function p(a,b){var c=!1;try{a(function(a){c||(c=!0,m(b,a))},function(a){c||(c=!0,e(b,a))})}catch(f){c||(c=!0,e(b,f))}}var t=setTimeout;d.prototype["catch"]=function(a){return this.then(null,a)};d.prototype.then=function(a,b){var c=new this.constructor(h);return q(this,new function(a,b,c){this.onFulfilled="function"==typeof a?a:null;this.onRejected="function"==typeof b?b:null;this.promise=c}(a,b,c)),c};d.prototype["finally"]=l;d.all=function(a){return new d(function(b,c){function d(a,f){try{if(f&&("object"==typeof f||"function"==typeof f)){var e=f.then;if("function"==typeof e)return void e.call(f,function(b){d(a,b)},c)}g[a]=f;0==--h&&b(g)}catch(u){c(u)}}if(!a||void 0===a.length)throw new TypeError("all\u4e2d\u5fc5\u987b\u662f\u6570\u7ec4");var g=Array.prototype.slice.call(a);if(0===g.length)return b([]);for(var h=g.length,e=0;g.length>e;e++)d(e,g[e])})};d.resolve=function(a){return a&&"object"==typeof a&&a.constructor===d?a:new d(function(b){b(a)})};d.reject=function(a){return new d(function(b,c){c(a)})};d.race=function(a){return new d(function(b,c){for(var d=0,e=a.length;e>d;d++)a[d].then(b,c)})};d._immediateFn="function"==typeof setImmediate&&function(a){setImmediate(a)}||function(a){t(a,0)};d._unhandledRejectionFn=function(a){void 0!==console&&console&&console.warn("\u672a\u8bbe\u7f6ereject:",a)};var k=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw Error("\u627e\u4e0d\u5230\u5168\u5c40\u5bf9\u8c61");}();"Promise"in k?k.Promise.prototype["finally"]||(k.Promise.prototype["finally"]=l):k.Promise=d});
//兼容filter
Array.prototype.filter||(Array.prototype.filter=function(c,f){if(void 0===this||null===this)throw new TypeError;var b=Object(this),g=b.length>>>0;if("function"!=typeof c)throw new TypeError;for(var d=[],a=0;a<g;a++)if(a in b){var e=b[a];c.call(f,e,a,b)&&d.push(e)}return d});
//兼容bind
Function.prototype.bind=Function.prototype.bind||function(b){if("function"!==typeof this)throw new TypeError("bind\u4ec5\u7528\u4e8efunction");var d=Array.prototype.slice.call(arguments,1),e=this,a=function(){},c=function(){return e.apply(this instanceof a&&b?this:b,d.concat(Array.prototype.slice.call(arguments)))};a.prototype=this.prototype;c.prototype=new a;return c};
//兼容reduce
"function"!==typeof Array.prototype.reduce&&(Array.prototype.reduce=function(d,e){if(null===this||"undefined"===typeof this)throw new TypeError("Array.prototype.reduce called on null or undefined");if("function"!==typeof d)throw new TypeError(d+" is not a function");var a=0,f=this.length>>>0,b,c=!1;1<arguments.length&&(b=e,c=!0);for(;f>a;++a)this.hasOwnProperty(a)&&(c?b=d(b,this[a],a,this):(b=this[a],c=!0));if(!c)throw new TypeError("Reduce of empty array with no initial value");return b});
(function (window, document) {
var smartload=window.smartload;
smartload.loadInit=function(){
var me = this,index,type,is_url,configs=me.config,args=[],cmds;
if(('object'!==typeof me.list)||('object'!==typeof me.config)){me.log('list配置错误','warn');return;};
//并行校验所有配置
me.list['_preload']=me.preloadToList({preload:me.list['_preload']});
if(me.list['_preload']=='fail'){me.log('_preload配置错误','warn');return 'fail';};
for(var index in configs) {
if(index=='domain'){type='object';is_url='true';}else{type='string';is_url='false';};
args.push({arr:configs[index],type:type,is_url:is_url,func:'smartload.checkArgs'});
};
args.push({arr:me.list,type:'object',func:'smartload.checkArgs'});
me.promises(args).then(function (results) {
if(results.indexOf('fail')!=-1){me.log('配置校验失败','warn');return 'fail';}else{me.log('配置校验成功','info');};
if(me.ls('diff','config',configs)){me.lsClear();me.ls('set','config',configs);me.log('配置已更新','info');}else{me.log('配置无变更','info');};
me.ready=true;
cmds=me.updateList(me.list,'list',true,true);
me.preloadDown(cmds,true);
}).then(undefined,function(err) {me.log('配置校验失败','warn');me.log(err);});
}
smartload.load = function(loadargs) {
var me=this,args=[],cmds,lists=me.list;
if(me.ready!==true){me.log('load仅限使用在被引入的js中');return 'fail';};
me.promise({preload:loadargs,func:'smartload.preloadToList',test:1}).then(function (results) {
if(results.indexOf('fail')!=-1){me.log('load配置校验失败','warn');return 'fail';}else{me.log('load配置校验成功','info');};
cmds=me.list;
cmds['_preload']=results;
cmds=me.formatList(cmds);
me.preloadDown(cmds);
}).then(undefined,function(err) {me.log('load配置校验失败','warn');});
}
smartload.preloadDown = function(cmds,init) {
var me=this,preload=cmds['_preload'],list;
if(me.is_empty(preload,'arr')){return;};
delete cmds['_preload'];list=cmds;
var i=0,len=preload.length,allPromiseSerial=[],func='smartload.downPreload',promiseSerials=[];
//请求串
for(i;i<len;i++){
//组成一个小并行
var i2=0,len2=preload[i].length,serials=[];
for(i2;i2<len2;i2++){
var i2_obj=me.formatUrls(preload[i][i2],list[preload[i][i2]]);
i2_obj.func=func;
serials.push(i2_obj);
};
//组成一个闭包
(function(arg,serials){   promiseSerials[i]=function(){return me.promises(serials)};})(i,serials);
}
me.promiseSerial(promiseSerials).then(function (value) {
if(init===true){me.log('预加载已全部完成并缓存成功','warn');}else{me.log('加载完成','warn');};
}).then(undefined,function(err) {
if(init===true){me.log('预加载加载失败','warn');}else{me.log('加载失败','warn');};
});
}
//单个的promise异步下载工具
smartload.downPreload=function (args) {
var me=this,opt=args,domopt={};
return new Promise(function (resolve, reject) {
opt.id=opt.type+'_'+opt.id;
domopt={id:opt.id,type:opt.type,direct:false,version:opt.version};
if(me.version>1){
var lscon=me.ls('get',opt.id),lsversion=me.ls('get',opt.id+'_version');
if(lscon!==undefined&&(lsversion==opt.version)){domopt.direct=false;domopt.con=lscon;opt.url='';me.appendDom(domopt);if(opt.callback){var func=me.func(opt.callback);if('function'===typeof func){func.call(me,r);};};resolve(true);}else{me.ls('remove',opt.id);me.ls('remove',opt.id+'_version');//加载或删除;
me.curls(opt.urls,function(r){
if(r.status==1){
domopt.url=r.url;domopt.con=r.con;me.appendDom(domopt);
//回调也是是异步的
if(opt.callback){var func=me.func(opt.callback);if('function'===typeof func){func.call(me,r);};}
resolve(true);
}else{
me.log('下载失败:'+r.url,'warn');reject('fail');
};
},true);
};
};
});
}
smartload.preloadToList = function(args) {
var me=this,preload=args.preload,list_keys=[],res={};
list_keys=me.cmds_keys(me.list);//唯一key的清单数组
if(list_keys=='fail'){me.log('list不能为空','warn');return 'fail';};
if(me.is_string(preload)){return me.strToList(preload,list_keys);}else if(!me.is_array(preload)){return 'fail';};
return me.arrToList(preload,list_keys);
}
smartload.arrToList = function(preload,list_keys) {
var me=this,fails={},list_keys;
if(list_keys=='fail'){me.log('list不能为空','warn');return 'fail';};
//验证格式
var i=0,len=preload.length,i_info,i_info_key;
for(i;i<len;i++){
i_info=preload[i];
if(me.is_string(i_info)){
i_info=me.uniquelize(i_info.split(','));
}else if(me.is_array(i_info)){
i_info=me.uniquelize(i_info);
}else{
i_info=undefined;
}
if(i_info){i_info=me.uniquelize(me.arr_intersect(i_info,list_keys));}
if(me.is_empty(i_info,'arr')){me.log('preload格式不符或list中不存在:'+preload[i].toString(),'warn');return 'fail';};
preload[i]=i_info;
var i2=0,len2=i_info.length,new_i_info=[];
for(i2;i2<len2;i2++){
if(fails[i_info[i2]]!=true){
fails[i_info[i2]]=true;
new_i_info.push(i_info[i2]);
}else{
me.log('preload中`'+i_info.toString()+'`:存在重复:'+i_info[i2]);return 'fail';
}
}
if(me.is_empty(new_i_info,'arr')){me.log('preload均存在重复:'+preload[i].toString(),'warn');return 'fail';};
preload[i]=new_i_info;
}
return preload;
}
//处理版本差异
smartload.updateList= function(cmds,name) {
var me=this,list_str=me.ls('get',name),list_obj=JSON.parse(list_str),old_info,new_info,old_key,new_key;
cmds=me.formatList(cmds,name,true,true);
if(cmds&&me.is_object(list_obj)&&!me.is_empty(list_obj,'obj')){
if(me.ls('diff',name,cmds)){
for(var index in list_obj){
if(index=='_preload'){continue;};
//版本信息
old_info=me.is_cmd(list_obj[index]);
old_key=old_info[2]+'_'+index;
if(!cmds[index]){me.ls('remove',old_key);continue;};
new_info=me.is_cmd(cmds[index]);
new_key=old_info[2]+'_'+index;
if(old_info[3]!=new_info[3]||old_key!=new_key){
me.ls('remove',old_key);
}
}
}
}else{
//初始化时仅保留configs;
me.lsClear();
};
me.ls('set','list',cmds);
return cmds;
}
//单个promise
smartload.promise = function(args) {
var me=this,res,r,func;
func=me.func(args.func); 
if('function'!=typeof func){me.log('方法不存在:'+args.func);return 'fail';};
delete args.func;
 return new Promise(function(resolve, reject){
res=func.call(me,args);
if(res=='fail'){reject('fail');}else{resolve(res);};
});
}
//多个promise
smartload.promises = function(args,spec) {
var me=this,res,i=0,len=args.length,res=[],r,spec=spec||false;
for(i;i<len;i++){
r=me.promise(args[i]);
res.push(r);
}
if(spec===true){return Promise.race(res);};
return Promise.all(res);
}
//promise顺序队列
smartload.promiseSerial = function(tasks) {
    function promiseSerialRecord(results, value) {
        results.push(value);
        return results;
    }
    var pushValue = promiseSerialRecord.bind(null, []);
    return tasks.reduce(function (promise, task) {
        return promise.then(task).then(pushValue);
    }, Promise.resolve());
}
//校验参数
smartload.checkArgs = function(args) {
var me = this;
if(args.arr&&args.type&&!me['is_'+args.type](args.arr)){me.log('统一配置:基本设置错误');me.log(args.arr);return 'fail';};
if(!me.is_object(args.arr)){return;};
if(args.is_url){args.is_url='url';}else{args.is_url='cmd';};
for(var index in args.arr) {
if(index=='_preload'){continue;};
if(!me.check(args.arr[index],args.is_url)){return 'fail';};
}
return;
}
//文字转命令
smartload.strToList =function (cmds,list_keys) {
var me=this,r={};
if(list_keys=='fail'){return 'fail';};
var cmd_key=me.uniquelize(cmds.split(',')),keys=me.arr_intersect(cmd_key,list_keys),diff=me.arr_minus(cmd_key,list_keys);
if(diff.length>0){me.log('_preload存在多余:'+diff.toString(),'warn');};
var i=0,len=keys.length,cmds={};
if(keys.length==0){return 'fail';};
cmds['_preload']=keys;
for(i;i<len;i++){
cmds[keys[i]]=me.list[keys[i]];;
}
return cmds;
}
//格式化命令
smartload.formatList =function (cmds,name,save,inLocalStorage) {
var me=this;
if(me.is_empty(cmds,'obj')){me.log('未设置list,已停止');return false;};//防止无内容
var preload=me.preload(cmds);
if(preload=='fail'){me.log('预载项设置出错',cmds);return preload;};
cmds['_preload']=preload;
if(save===true){me[name]=cmds;};
if(inLocalStorage===true){me.ls('set',name,cmds);}
return cmds;
}
//处理预载项
smartload.preload =function (cmds) {
var me=this,preload=cmds['_preload'],list_keys=[];
list_keys=me.cmds_keys(cmds);//唯一key的清单数组
if(list_keys=='fail'){return 'fail';};
if(!me.is_array(preload)){preload="false"===preload||!1===preload?!1:!0;}else if(me.is_array(preload)){
var all_preload=me.arr_intersect(me.arr_kv(preload),list_keys),preload_keys=[],new_preload=[];// 合法preload
//遍历preload,将value
var i=0,len=preload.length;
for(i;i<len;i++){
if(!(me.is_string(preload[i])||me.is_array(preload[i]))){continue;};
if(me.is_string(preload[i])){preload[i]=[preload[i]];};
preload_keys=me.uniquelize(me.arr_intersect(preload[i],all_preload));
if(preload_keys.length>0){new_preload.push(preload_keys);};
}
//将结果断为一维和list_keys求差集并将差集并入到第一队列
if(new_preload[0]){new_preload[0].push.apply(new_preload[0],me.arr_minus(list_keys,all_preload));};
preload=new_preload;//将预载项以外差集的内容并入第一队列中
//分裂为css和js两个大阵营,以便优先加载css
if(!new_preload){me.log('错误预载项设置',preload);return 'fail';}
//再次遍历清单数组,形成css和js配对的对象
var i=0,len=preload.length,new_preload={css:[],js:[]};
for(i;i<len;i++){
var i2=0,len2=preload[i].length,new_i={},cmd_info;new_i.css=[];new_i.js=[];
for(i2;i2<len2;i2++){
cmd_info=me.is_cmd(cmds[preload[i][i2]]);
new_i[cmd_info[2]].push(preload[i][i2]);
}
if(!me.is_empty(new_i.css,'arr')){new_preload.css.push(new_i.css);};
if(!me.is_empty(new_i.js,'arr')){new_preload.js.push(new_i.js);};
}
preload=me.arr_complement(new_preload.css,new_preload.js);
}else{
me.log('错误预载项设置',preload);return 'fail';
};
return preload;
}
//检查配置
smartload.check=function(value,type,v_type){
var me=this,index;
if(!me['is_'+type](value)){me.log('统一配置错误1:'+value,'error');return false;};
if(!v_type){return true;};
if(me.is_object(value)||me.is_array(value)){for(var index in value) {if(!me['is_'+v_type](value[index])){me.log('统一配置错误2:'+index,'error');return false;};};}
return true;
}
//取出cmd所有的key
smartload.cmds_keys =function (cmds) {
var me=this;
if(me.checkArgs({arr:cmds,type:'object'})=='fail'){me.log(JSON.stringify(cmds));me.log('参数错误');return 'fail';};
return me.uniquelize(me.obj_keys(cmds));//唯一key的清单数组
}
//localStorage延伸:clear
smartload.lsClear = function() {
var me=this,prefix=me.prefix,prefix_length=prefix.length,len = localStorage.length,i=0,defaultKeys=['config','js_entrance','js_entrance_version','list'];
for (i = 0; i < len; i++) {
var itemKey = localStorage.key(i);
if(defaultKeys.indexOf(itemKey.slice(prefix_length+1,itemKey.length))!=-1){
localStorage.removeItem(itemKey);
}
}
return true;
}
//将json对象脱成一维数组:不考虑数字和内含{}等内容
smartload.obj_kv =function (obj) {
return JSON.stringify(obj).replace(/\{|}|"/g, '').split(':');
}
//将多维数组脱成一维数组:不考虑数字和内含[],等内容
smartload.arr_kv =function (arr) {
return JSON.stringify(arr).replace(/\[|]|"/g, '').split(',');
}
//合并两个对象
smartload.obj_extend =function (target, source) {
for (var obj in source) {
target[obj] = source[obj];
}
return target;
}
//一维对象的所有key
smartload.obj_keys =function (obj) {
var r=[];
for(var index in obj) {
if(index=='_preload'){continue;};
if(obj[index]){r.push(index);};
};
return r;
}
//数组唯一
smartload.uniquelize = function(a){
var me=this;
if(me.is_empty(a,'arr')){return;};
var i = 0,len=a.length,o={},b=[];
for(i; i < len; i ++){
if(o[a[i]]!==true){
o[a[i]]=true;
b.push(a[i]);
}
}
return b;
};
//交集
smartload.arr_intersect =function(a,b){ return a.filter(function(v){ return b.indexOf(v) > -1 });}
//差集
smartload.arr_minus = function(a,b){return a.filter(function(v){ return b.indexOf(v) == -1 });}
//补集
smartload.arr_complement =function(a,b){ return a.filter(function(v){ return !(b.indexOf(v) > -1) }).concat(b.filter(function(v){ return !(a.indexOf(v) > -1)}));}
//并集
smartload.arr_union = function(a,b){ return a.concat(b.filter(function(v){ return !(a.indexOf(v) > -1)}));}
smartload.is_empty = function(variable,variable_type){
var me=this;
switch(variable_type){
case 'obj':
if(!me.is_object(variable)){return true;};
for (var name in variable) {return false;};
return true;
break;
case 'arr':
if(!me.is_array(variable)){return true;};
if(variable.length>0){return false;};
break;
case 'str':
if(!me.is_string(variable)){return true;};
if(!(variable==null||variable==undefined||variable=="")){return false;};
break;
};
return true;
}
smartload.is_url= function(variable){
var returns,
returns=/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/.exec(variable);
if(returns){delete returns['index'],delete returns['input'];};
return returns;
}
smartload.is_cmd= function(variable){
var returns;
returns=/^(?:\[([^\]]*)?\])?\[(css|js)(?:\.([^\]]*))?\](?:\[([^\]]*)?\])?([^\[]*)/g.exec(variable);
if(returns){delete returns['index'],delete returns['input'];};
return returns;
}
//兼容ie8的无奈写法
smartload.is_array= function(variable){return typeof variable !== 'undefined' && Object.prototype.toString.call(variable) == '[object Array]';}
smartload.is_object= function(variable){return typeof variable !== 'undefined' && Object.prototype.toString.call(variable) == '[object Object]';}
smartload.is_function= function(variable){return typeof variable !== 'undefined' && Object.prototype.toString.call(variable) == '[object Function]';}
smartload.is_string= function(variable){return typeof variable !== 'undefined' && Object.prototype.toString.call(variable) == '[object String]';}
}(window, document));
smartload.loadInit();