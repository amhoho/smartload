/*��Ȩ��@amhoho http://github.com/amhoho/smartload*/
var smartloadConfig={entrance:{file:"[js.v0.6.1]https://amhoho.github.io/smartload/demo/smartload/{$}.js",debug:"true"},config:{name:"yourname",version:"v1.2",domain:{css:"https://amhoho.github.io/smartload/demo/smartload",js:"https://amhoho.github.io/smartload/demo/smartload",img:"http://code.jquery.com/ui/1.10.4/themes/smoothness"}},list:{_preload:["jquery",["test_jquery","jquery_ui","jquery_ui_css","jquery_cookie"],"test_ui_and_cookie"],test_jquery:"[js.v0.1.1]test/02.test.jquery",jquery:"[js.v3.4.1]test/01.jquery-3.4.1.min",jquery_ui:"[js.v1.12.1]test/02.jquery-ui.min",jquery_ui_css:"[css.v1.0.1]test/jquery-ui",jquery_cookie:"[js.1.4.1]test/02.jquery.cookie",test_ui_and_cookie:"[js.v1.0.01]test/03.test.ui.and.cookie"}};Array.prototype.indexOf||(Array.prototype.indexOf=function(d,m){for(var e=m||0,a=this.length;e<a;e++)if(this[e]===d)return e;return-1});window.console=window.console||function(){var d={};d.log=d.warn=d.debug=d.info=d.error=d.time=d.dir=d.profile=d.clear=d.exception=d.trace=d.assert=function(){};return d}();(function(d,m){var e=e||{head:m.getElementsByTagName("head")[0]};e.init=function(a){var c=this,b;"fail"==("undefined"!==typeof a&&"[object Object]"==Object.prototype.toString.call(a))?c.log("\u914d\u7f6e\u9519\u8bef","warn"):(d.smartloadConfig=null,c.version=c.supportState(),c.prefix=a.config.name+"/",c.lsKeys(c.prefix,!0),c.debug="false"==a.entrance.debug||0==a.entrance.debug?!1:!0,c.config=a.config,c.list=a["v"+c.version+"_list"]?a["v"+c.version+"_list"]:a.list,c.doms=[],(b=Object.keys(a.config.domain))?c.domainregs=new RegExp("_domain."+b.join("_|_domain.")+"_","g"):c.domainregs="",delete b,a.entrance.debug&&Object.keys(a.config.domain).forEach(function(b){c.log(b+" domain: "+a.config.domain[b],"info")}),b=c.formatUrls("smartload",a.entrance.file.replace(/\{\$\}/g,"v"+c.version)),"fail"==b?c.log("\u914d\u7f6e\u9519\u8bef","warn"):(b.direct=!1,b.init=!0,c.downCmds(b)))};e.supportState=function(){var a;if(d.localStorage){a=!1;try{eval("async ()\x3d\x3e{}"),a=!0}catch(c){}a=a?3:2}else a=1;return a};e.log=function(a,c){this.debug&&(c?console[c](a):console.log(a))};e.downCmds=function(a,c){var b=this,f={};a.id=a.type+"_"+a.id;if(b.doms&&(-1<b.doms.indexOf(a.id)||void 0!==a.url&&-1<b.doms.indexOf(a.url)))b.log("\u52ff\u91cd\u590d\u52a0\u8f7d"+a.id,"warn");else{f={id:a.id,type:a.type,direct:a.direct,version:a.version};if(1<b.version){var d=b.ls("get",a.id),e=b.ls("get",a.id+"_version");if(void 0!==d&&e==a.version){f.direct=!1;f.con=d;a.url="";b.appendDom(f);return}b.ls("remove",a.id);b.ls("remove",a.id+"_version")}b.curls(a.urls,function(c){if(1==c.status){if(f.url=c.url,f.con=c.con,a.init&&b.log("\u521d\u59cb\u5316\u5b8c\u6210","info"),b.appendDom(f),a.callback){var d=b.func(a.callback);"function"===typeof d&&d.call(b,c)}}else b.log("\u4e0b\u8f7d\u5931\u8d25:"+c.url,"warn")},!0)}};e.appendDom=function(a){var c=this,b={},f;a.direct=a.direct||!1;1<c.version&&(c.ls("set",a.id,a.con),c.ls("set",a.id+"_version",a.version));if(c.doms&&(-1<c.doms.indexOf(a.id)||void 0!==a.url&&-1<c.doms.indexOf(a.url)))c.log("\u52ff\u91cd\u590d\u52a0\u8f7d"+a.id,"warn");else{b.id=a.id;"css"==a.type?(b.dom="style",b.type="text/css",a.direct&&(b.rel="stylesheet",b.href=a.url)):(b.dom="script",b.type="text/javascript",a.direct&&(b.src=a.url));f=m.createElement(b.dom);delete b.dom;delete b.url;for(var d in b)f.setAttribute(d,b[d]);try{f.innerHTML=a.con}catch(g){f.text=a.con}-1<c.doms.indexOf(a.id)||void 0!==a.url&&-1<c.doms.indexOf(a.url)?c.log("\u52ff\u91cd\u590d\u52a0\u8f7d"+a.id,"warn"):(c.head.appendChild(f),c.doms.push(a.id),a.url&&c.doms.push(a.url),c.debug||"css"==a.type||setTimeout(function(){c.head.removeChild(f)},5))}};e.func=function(a){if("string"===typeof a){var c=a.split(".");if(1<c.length){a=d;for(var b=0,f=c.length;b<f;b++)a=a[c[b]]}else a=d[a]}return"function"===typeof a?a:!1};e.curls=function(a,c,b,f){0<a.length&&this.recursiveLoad(a,c,b,f)};e.recursiveLoad=function(a,c,b,f){var e=this,g;b=b||!1;c=e.func(c);g=d.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");g.open("GET",a[0],b);g.onreadystatechange=function(){if(4===g.readyState){var d={args:f};d.url=a[0];200==g.status||304==g.status?(d.status=1,d.con=e.domainregs?g.responseText.replace(e.domainregs,function(a){return e.config.domain[a.replace(/(^_domain.)|(_$)/g,"")]}):g.responseText,d&&c&&c.call(this,d)):(d.status=0,d=a[0],a.shift(),0<a.length?(e.log("\u4e0b\u8f7d\u5931\u8d25:"+d,"warn"),e.log("\u5f00\u59cb\u5c1d\u8bd5:"+a[0],"warn"),e.curls(a,c,b,f)):e.log("\u5168\u90e8\u4e0b\u8f7d\u5931\u8d25:"+d+"\u6240\u5728\u884c","warn"))}};g.send()};e.formatUrls=function(a,c){var b=/^(?:\[([^\]]*)?\])?\[(css|js)(?:\.([^\]]*))?\](?:\[([^\]]*)?\])?([^\[]*)/g.exec(c),d;if(void 0==b[5]||0==b[5].length)return this.log(c,"warn"),this.log("\u672a\u6307\u5b9a\u8def\u5f84\u6216url","warn"),"fail";d=0;var e=b[5].split(","),g=e.length,k=[],h={},m=/^http(s)?:\/\//,n=b[2],q=this.config.domain[n],p=b[3]||"0.1";a=a||b[1];b=b[4]||!1;for(d;d<g;d++){var l=e[d];l.match(m)||(l=q+"/"+l+"."+n);l=1<e[d].split("?").length?l+"\x26":l+"?";l+="v\x3d"+p;!0!==h[l]&&k.push(l);h[l]=!0}if(void 0==k||0==g)return this.log(c,"warn"),this.log("\u6ca1\u6709\u53ef\u4e0b\u8f7d\u94fe\u63a5","warn"),"fail";d={};d.id=a;d.type=n;d.version=p;d.urls=k;d.callback=b;return d};e.lsKeys=function(a,c){if(1==this.version)return!1;var b=!0===a?"":this.prefix,d=b.length,e=localStorage.length,g=[],k,h;if(1==c)for(h=0;h<e;h++)(k=localStorage.key(h))&&k.slice(0,d)!=b&&localStorage.removeItem(k);else for(h=0;h<e;h++)k=localStorage.key(h),k.slice(0,d)==b&&g.push(k.substring(d));return g};e.ls=function(a,c,b){if(1==this.version)return!1;c=this.prefix+c;if("remove"==a)return localStorage.removeItem(c),!0;if("get"==a)return localStorage.getItem(c);if("object"===typeof b||"array"===typeof b)b=JSON.stringify(b);if("set"==a||"diff"==a){if(b!=localStorage.getItem(c)){if("diff"==a)return!0;localStorage.setItem(c,b);return!0}return!1}};d.smartload=e})(window,document);smartload.init(smartloadConfig);