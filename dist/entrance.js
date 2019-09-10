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
Array.prototype.indexOf||(Array.prototype.indexOf=function(c,k){for(var e=k||0,a=this.length;e<a;e++)if(this[e]===c)return e;return-1});window.console=window.console||function(){var c={};return c.log=c.warn=c.debug=c.info=c.error=c.time=c.dir=c.profile=c.clear=c.exception=c.trace=c.assert=function(){},c}();(function(c,k){var e=e||{head:k.getElementsByTagName("head")[0]};e.init=function(a){var d;"fail"!=(void 0!==a&&"[object Object]"==Object.prototype.toString.call(a))?(c.smartloadConfig=null,this.version=this.supportState(),this.prefix=a.config.name+"/",this.lsKeys(this.prefix,!0),"false"==a.entrance.debug||0==a.entrance.debug?this.debug=!1:this.debug=!0,this.config=a.config,this.list=a["v"+this.version+"_list"]?a["v"+this.version+"_list"]:a.list,this.doms=[],"fail"!=(d=this.formatUrls("smartload",a.entrance.file.replace(/\{\$\}/g,"v"+this.version)))?(d.direct=!1,d.init=!0,this.downCmds(d)):this.log("\u914d\u7f6e\u9519\u8bef","warn")):this.log("\u914d\u7f6e\u9519\u8bef","warn")};e.supportState=function(){var a;if(c.localStorage){a=!1;try{eval("async ()\x3d\x3e{}"),a=!0}catch(d){}a=a?3:2}else a=1;return a};e.log=function(a,d){this.debug&&(d?console[d](a):console.log(a))};e.downCmds=function(a,d){var b=this,f={};if(a.id=a.type+"_"+a.id,b.doms&&(-1<b.doms.indexOf(a.id)||void 0!==a.url&&-1<b.doms.indexOf(a.url)))b.log("\u52ff\u91cd\u590d\u52a0\u8f7d"+a.id,"warn");else{if(f={id:a.id,type:a.type,direct:a.direct,version:a.version},1<b.version){var c=b.ls("get",a.id),e=b.ls("get",a.id+"_version");if(void 0!==c&&e==a.version)return f.direct=!1,f.con=c,a.url="",void b.appendDom(f);b.ls("remove",a.id);b.ls("remove",a.id+"_version")}b.curls(a.urls,function(d){if(1==d.status){if(f.url=d.url,f.con=d.con,a.init&&b.log("\u521d\u59cb\u5316\u5b8c\u6210","info"),b.appendDom(f),a.callback){var c=b.func(a.callback);"function"==typeof c&&c.call(b,d)}}else b.log("\u4e0b\u8f7d\u5931\u8d25:"+d.url,"warn")},!0)}};e.appendDom=function(a){var d,b=this,f={};if(a.direct=a.direct||!1,1<b.version&&(b.ls("set",a.id,a.con),b.ls("set",a.id+"_version",a.version)),b.doms&&(-1<b.doms.indexOf(a.id)||void 0!==a.url&&-1<b.doms.indexOf(a.url)))b.log("\u52ff\u91cd\u590d\u52a0\u8f7d"+a.id,"warn");else{f.id=a.id;"css"==a.type?(f.dom="style",f.type="text/css",a.direct&&(f.rel="stylesheet",f.href=a.url)):(f.dom="script",f.type="text/javascript",a.direct&&(f.src=a.url));d=k.createElement(f.dom);delete f.dom;delete f.url;for(var c in f)d.setAttribute(c,f[c]);try{d.innerHTML=a.con}catch(g){d.text=a.con}-1<b.doms.indexOf(a.id)||void 0!==a.url&&-1<b.doms.indexOf(a.url)?b.log("\u52ff\u91cd\u590d\u52a0\u8f7d"+a.id,"warn"):(b.head.appendChild(d),b.doms.push(a.id),a.url&&b.doms.push(a.url),b.debug||"css"==a.type||setTimeout(function(){b.head.removeChild(d)},5))}};e.func=function(a){if("string"==typeof a){var d=a.split(".");if(1<d.length){a=c;for(var b=0,f=d.length;b<f;b++)a=a[d[b]]}else a=c[a]}return"function"==typeof a&&a};e.curls=function(a,d,b,f){0<a.length&&this.recursiveLoad(a,d,b,f)};e.recursiveLoad=function(a,d,b,f){var e,g=this;b=b||!1;d=g.func(d);(e=c.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP")).open("GET",a[0],b);e.onreadystatechange=function(){if(4===e.readyState){var c={args:f};(c.url=a[0],200==e.status||304==e.status)?(c.status=1,c.con=e.responseText,c&&d&&d.call(this,c)):(c.status=0,c=a[0],a.shift(),0<a.length?(g.log("\u4e0b\u8f7d\u5931\u8d25:"+c,"warn"),g.log("\u5f00\u59cb\u5c1d\u8bd5:"+a[0],"warn"),g.curls(a,d,b,f)):g.log("\u5168\u90e8\u4e0b\u8f7d\u5931\u8d25:"+c+"\u6240\u5728\u884c","warn"))}};e.send()};e.formatUrls=function(a,d){var b=/^(?:\[([^\]]*)?\])?\[(css|js)(?:\.([^\]]*))?\](?:\[([^\]]*)?\])?([^\[]*)/g.exec(d),c={};if(void 0==b[5]||0==b[5].length)return this.log(d,"warn"),this.log("\u672a\u6307\u5b9a\u8def\u5f84\u6216url","warn"),"fail";for(var e=0,g=b[5].split(","),n=g.length,h=[],k={},q=/^http(s)?:\/\//,m=b[2],r=this.config.domain[m],p=b[3]||"0.1",b=(a=a||b[1],b[4]||!1);e<n;e++){var l=g[e];l.match(q)||(l=r+"/"+l+"."+m);1<g[e].split("?").length?l+="\x26":l+="?";!0!==k[l+="v\x3d"+p]&&h.push(l);k[l]=!0}return void 0==h||0==n?(this.log(d,"warn"),this.log("\u6ca1\u6709\u53ef\u4e0b\u8f7d\u94fe\u63a5","warn"),"fail"):((c={}).id=a,c.type=m,c.version=p,c.urls=h,c.callback=b,c)};e.lsKeys=function(a,c){if(1==this.version)return!1;var b,d=!0===a?"":this.prefix,e=d.length,g=localStorage.length,k=[],h;if(1==c)for(h=0;h<g;h++)(b=localStorage.key(h))&&b.slice(0,e)!=d&&localStorage.removeItem(b);else for(h=0;h<g;h++)(b=localStorage.key(h)).slice(0,e)==d&&k.push(b.substring(e));return k};e.ls=function(a,c,b){return 1!=this.version&&(c=this.prefix+c,"remove"==a?(localStorage.removeItem(c),!0):"get"==a?localStorage.getItem(c):("object"!=typeof b&&"array"!=typeof b||(b=JSON.stringify(b)),"set"==a||"diff"==a?b!=localStorage.getItem(c)&&("diff"==a||(localStorage.setItem(c,b),!0)):void 0))};c.smartload=e})(window,document);smartload.init(smartloadConfig);