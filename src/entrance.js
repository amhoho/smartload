/*
解释:
1.所有域名均不要以'/'结尾.资源必须可跨域.
2.自适应版本:v1=不支持缓存的浏览器如ie8-,v2=不支持async如ie8+,ff52-,chrome55-等,v3=支持 async如ff52+,chrome55+
3.命令行:
格式:[plugin_name][类型.版本信息][回调方法]路径或url
其中:
[plugin_name]:唯一键,切勿重复,选填
//若已有对象的键名,则可不填如:'plugin_name':'[css].....';
[类型.版本信息]:类型必填.如css或js,版本信息选填
//例如[css]或[css.v5.0],5.0这样的版本如果改动了,会引起该文件的增量更新.
[回调方法名]:选填,载入url后的回调
//例如[callback]
路径或url:必填,路径则不包括后缀名,url则完整地址
//例如[test]=地址为/test.js
//[http:127.0.0.1/abc.js]
//[test,http:127.0.0.1/abc.js]//逗号之后为后备地址,可多个
4.命令包:
参见smartloadConfig.list;
_preload预加载项
*/
//localStorage.clear();//调试
var smartloadConfig={
entrance: {//入口地址:
file:'[js.v0.6.1]smartload/{$}',//命令行,{$}会被自动替换为自适应版本.
debug:'false'//是否打开调试,默认false;
},
config:{//配置信息:更新时将清理客户端缓存,进行全量更新.
name:'yourname',//必填,自定义的本地缓存库名称,
version:'v1.0',//必填,改动则全量更新
domain:{//域名,必填,格式如下,domain.css和domain.js必填.其余任意
//例如加了'test:'http://abc.com'之后.如被缓存的文件中存在`_domain.test_`则会被替换.
css:'http://127.0.0.1',//或http://www.test.com/css等
js:'http://127.0.0.1',//如果文件中存在_domain.css_,_domain.js_,_domain.img_将被替换为该值
img:'https://css.test.com'
}
},
list:{//命令包,选填:格式如下,_preload是系统内置值
_preload:[//预加载项,true=全部异步加载,false=按顺序加载.数组
//数组示范:
//['abc','hello']=依次加载abc和hello
//['abc',['ni','hao']]//依次加载abc后并行加载ni,hao
//示范['jquery',['jquery.form','jquery.cookie'],'myformcode','mycookiecode']
['_a'],['_d'],['_b','_c']
],
//命令行
_a: '[js.v0.8.1][hello]test,https://test.com/a002.js',//如果项目不考虑ie浏览器,请忽略该项
_b: '[js.v0.1.0]test,http://127.0.0.1/b002.js',
_c: '[js.v0.1.0]test,http://127.0.0.1/c002.js',
_d: '[js.v0.1.0]test,http://127.0.0.1/d002.js'
}
};

//兼容indexOf
Array.prototype.indexOf||(Array.prototype.indexOf=function(b,c){for(var a=c||0,d=this.length;a<d;a++)if(this[a]===b)return a;return-1});
/*兼容console*/
window.console=window.console||function(){var a={};a.log=a.warn=a.debug=a.info=a.error=a.time=a.dir=a.profile=a.clear=a.exception=a.trace=a.assert=function(){};return a}();
/*基本组件*/
(function (window, document) {
var smartload=smartload||{head: document.getElementsByTagName('head')[0]};
//获取资源
smartload.init=function(variable){
var me=this,is_object=typeof variable !== 'undefined' && Object.prototype.toString.call(variable) == '[object Object]',entrance,cmdsInfo,entrance_fn,opt;
if(is_object=='fail'){me.log('配置错误','warn');return;};
//基本设置
window.smartloadConfig=null;//回收smartloadConfig
me.version=me.supportState();//版本
me.prefix=variable.config.name+'/';//前缀
me.lsKeys(me.prefix,true);//清除非本前缀的内容,避免爆满.
if(variable.entrance.debug=='false'||variable.entrance.debug==false){me.debug=false;}else{me.debug=true;};
me.config=variable.config;//配置
me.list=variable["v"+me.version+"_list"]?variable["v"+me.version+"_list"]:variable.list;
me.doms=[];//初始化已加载的dom
//加载对应的版本文件
cmdsInfo=me.formatUrls('smartload',variable.entrance.file.replace(/\{\$\}/g,'v'+me.version));//对应的file信息
if(cmdsInfo=='fail'){me.log('配置错误','warn');return;};
//加载版本文件
cmdsInfo.direct=false;
cmdsInfo.init=true;
me.downCmds(cmdsInfo);
};
//兼容模式
smartload.supportState=function(){var a;if(window.localStorage){a=!1;try{eval('async ()\x3d\x3e{}'),a=!0}catch(b){}a=a?3:2}else a=1;return a};
//调试
smartload.log=function(info,type){this.debug&&(type?console[type](info):console.log(info))};
//下载正文
smartload.downCmds=function(opt,init){
var me=this,domopt={};
opt.id=opt.type+'_'+opt.id;
//进行一次去重校验
if(me.doms){
if(me.doms.indexOf(opt.id)>-1||(opt.url!==undefined&&me.doms.indexOf(opt.url)>-1)){me.log('勿重复加载'+opt.id,'warn');return;};//防止重复
};
domopt={id:opt.id,type:opt.type,direct:opt.direct,version:opt.version};
if(me.version>1){
var lscon=me.ls('get',opt.id),lsversion=me.ls('get',opt.id+'_version');
if(lscon!==undefined&&(lsversion==opt.version)){domopt.direct=false;domopt.con=lscon;opt.url='';me.appendDom(domopt);return;}else{me.ls('remove',opt.id);me.ls('remove',opt.id+'_version');};//加载或删除;
};
me.curls(opt.urls,function(r){
if(r.status==1){
domopt.url=r.url;domopt.con=r.con;if(opt.init){me.log('初始化完成','info');};me.appendDom(domopt);
if(opt.callback){var func=me.func(opt.callback);  if('function'===typeof func){func.call(me,r);};}
}else{
me.log('下载失败:'+r.url,'warn');
};
},true);

};;
//加入节点
smartload.appendDom=function(opt){
var me=this,element={},tags;
opt.direct=opt.direct||false;
if(me.version>1){me.ls('set',opt.id,opt.con);me.ls('set',opt.id+'_version',opt.version);};
if(me.doms){
if(me.doms.indexOf(opt.id)>-1||(opt.url!==undefined&&me.doms.indexOf(opt.url)>-1)){me.log('勿重复加载'+opt.id,'warn');return;};//防止重复
};
element.id=opt.id;
if (opt.type=='css') {
element.dom='style';
element.type='text/css';
if(opt.direct){element.rel='stylesheet';element.href=opt.url;};
}else{
element.dom='script';
element.type='text/javascript';
if(opt.direct){element.src=opt.url;};
}
tags=document.createElement(element.dom);
delete element.dom;
delete element.url;
for(var index in element){
tags.setAttribute(index, element[index]);
}
try{
tags.innerHTML=opt.con;
}catch(e){
tags.text=opt.con;//ie9以下补丁
};
if(me.doms.indexOf(opt.id)>-1||(opt.url!==undefined&&me.doms.indexOf(opt.url)>-1)){me.log('勿重复加载'+opt.id,'warn');return;};//防止重复
me.head.appendChild(tags);
//锁定dom
me.doms.push(opt.id);//创建后写入dom;
if(opt.url){me.doms.push(opt.url);};

if(!me.debug&&opt.type!='css'){setTimeout(function() {me.head.removeChild(tags);}, 5);};
};
//func字符串重构
smartload.func=function(func){
var me=this;
    if (typeof func=== 'string') {
        // support obj.func1.func2
        var fs = func.split('.');

        if (fs.length > 1) {
            func = window;
            for(var i=0,len=fs.length;i<len;i++){
            func=func[fs[i]];
            };
        } else {
            func = window[func];
        }
    }
if('function'===typeof func){return func;};
return false;
}
smartload.curls=function(urls,func,async,args){
var me=this,is_multiple=false;
if(urls.length>0){me.recursiveLoad(urls,func,async,args);};
};

smartload.recursiveLoad=function(urls,func,async,args) { //递归
var me=this,xhr;async=async||false;func=me.func(func);
if (window.XMLHttpRequest) {xhr=new XMLHttpRequest();} else {xhr= new ActiveXObject('Microsoft.XMLHTTP');}
xhr.open('GET',urls[0],async);

xhr.onreadystatechange=function(){
      if (xhr.readyState !== 4){return;};
      var respone={args:args};respone.url=urls[0];
      if(xhr.status == 200 || xhr.status == 304) {
respone.status=1;respone.con=xhr.responseText;
if(respone&&func){func.call(this,respone);};
      }else{
      
respone.status=0;
var oldUrl=urls[0];
urls.shift();//删除首个元素
if(urls.length>0){
me.log('下载失败:'+oldUrl,'warn');
me.log('开始尝试:'+urls[0],'warn');
me.curls(urls,func,async,args);
}else{
me.log('全部下载失败:'+oldUrl+'所在行','warn');
}
      };
};
xhr.send();
};

//单个命令地址遍历
smartload.formatUrls=function(id,cmds){
var me=this,responseText,arr=/^(?:\[([^\]]*)?\])?\[(css|js)(?:\.([^\]]*))?\](?:\[([^\]]*)?\])?([^\[]*)/g.exec(cmds),res={};
if(arr[5]==undefined||arr[5].length==0){me.log(cmds,'warn');me.log('未指定路径或url','warn');return 'fail';};
var i=0,urls=arr[5].split(','),len=urls.length,new_arr=[],o={},regs=/^http(s)?:\/\//,type=arr[2],domain=me.config.domain[type],v=arr[3]||'0.1',id=id||arr[1],callback=arr[4]||false;
for(i;i<len;i++){
var this_url=urls[i];
if(!this_url.match(regs)){this_url=domain+'/'+this_url+'.'+type;};//补齐
if(urls[i].split('?').length>1){this_url+='&';}else{this_url+='?';};//版本信息
this_url+='v='+v;
if(o[this_url]!==true){new_arr.push(this_url);};
o[this_url]=true;
}
o=null;
if(new_arr==undefined||len==0){me.log(cmds,'warn');me.log('没有可下载链接','warn');return 'fail';};
var res={};
res.id=id;
res.type=type;
res.version=v;
res.urls=new_arr;
res.callback=callback;
return res;
}
//localStorage延伸:keys::顺手杀掉不是本域下不是本前缀的内容;
smartload.lsKeys = function(all,clear) {
var me=this;if(me.version==1){return false;};var prefix=all===true?'':me.prefix,prefix_length=prefix.length,length = localStorage.length,keys = [],itemKey,i=0;
if(clear==true){
for (i = 0; i < length; i++) {
itemKey = localStorage.key(i);
if(itemKey&&itemKey.slice(0,prefix_length) !=prefix){
localStorage.removeItem(itemKey);
}
}
}else{
for (i = 0; i < length; i++) {
itemKey = localStorage.key(i);
if(itemKey.slice(0,prefix_length) ==prefix){
keys.push(itemKey.substring(prefix_length));
}
}
}
return keys;
}
//localStorage存储
smartload.ls =function (type,key,value) {
var me=this;if(me.version==1){return false;};
key=me.prefix+key;
if(type=='remove'){
localStorage.removeItem(key);
return true;
}else if(type=='get'){return localStorage.getItem(key);};
if(('object'===typeof value) ||('array'===typeof value)){value=JSON.stringify(value);};
if(type=='set'||type=='diff'){
if(value!=localStorage.getItem(key)){
if(type=='diff'){return true;};
localStorage.setItem(key,value);
return true;
}else{return false;};
}
}
window.smartload=smartload;
}(window, document));
smartload.init(smartloadConfig);