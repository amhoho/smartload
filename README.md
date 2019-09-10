## 作用

带有`重试`和`后备`模式(即1个js可多个地址,1地址下载失败后,重试2地址,3地址)的根据css,js等存入`localStorage`中
支持全量或增量更新,只要`ls`未被清空(如二次打开页面或清空浏览器缓存)时,则从`localStorage`中读取,省却请求,节省带宽,又提高响应速度.

## 概念

**配置**: 一个css/js/img等url域名和路径信息的json,即`entrance.js`的`smartloadConfig`,写到`entrance.js`有益合理利用304.
**入口文件**: 即`entrance.js`,页面唯一需要引入的`<script src=''>`文件,它将按浏览器将`css/js`等载至缓存.
**统一加载**: 页面初始化时,从配置中,按`key`加载.
**独立加载**: 页面初始化时,不从配置中加载,而按需引入.

## 配置基本写法:文件加载

```
整体格式:
[名称][格式.版本号][回调名称]主路径或url,后备1路径或url,后备2路径或url...

详细说明:
[名称] //如jquery,仅限"英文","数字",".","_","-"(必填)
[格式.版本号] 如//如js.v1.0或css.v1.0,当如v1.0修改v1.1后则更新该jquery缓存(可选,建议填)
[回调名称] //如callback,该jquery加载完成后想运行"function callback(){}",仅限"英文","数字",".","_","-"(可选)
主路径或url,后备1路径或url,后备2路径或url... //以此类推,路径时无需后缀,test/jq.js可写成test/jq(必填)
```

**统一配置示例**:
```
'jquery': '[js.v3.01][callback]test/jq,http://apps.bdimg.com/libs/jqueryui/1.9.2/jquery-ui.min.js',
'jquery': '[js.v3.01]test/jq,http://apps.bdimg.com/libs/jqueryui/1.9.2/jquery-ui.min.js',
'jquery': '[js]test/jq',
'jquery': '[js]http://apps.bdimg.com/libs/jqueryui/1.9.2/jquery-ui.min.js'
```

**独立配置示例**:
```
'[jquery][js.v3.01][callback]test/jq,http://apps.bdimg.com/libs/jqueryui/1.9.2/jquery-ui.min.js',
'[jquery][js.v3.01]test/jq,http://apps.bdimg.com/libs/jqueryui/1.9.2/jquery-ui.min.js',
'[jquery][js]test/jq',
'[jquery][js]http://apps.bdimg.com/libs/jqueryui/1.9.2/jquery-ui.min.js'
```

`注意:统一配置和独立配置可以混合使用`

`明白了以上写法之后,下方内容就很容易理解了`


## 配置基本写法:加载顺序

`_preload:true`:全部异步加载

`_preload:false`:按list键顺序加载

`_preload:[]`按数组的自定义顺序加载

顺序数组写法示例:
```
['a','b','c']//即a加载后才加载b,再下载c.
['a',['b','c']]//先加载a,再并行加载b和c.
[a,['b,c'],'d']//可混合以上
['jquery',['jquery.form','jquery.cookie'],'myformcode','mycookiecode']//示范
```

## 配置写法

```
{
entrance: {//入口地址:
file:'[js.v0.1.1]smartload/{$}',//命令行,{$}会被自动替换为自适应版本.大版本v0.1.1为entrance的自定义版本
debug:'false'//是否打开调试,默认false;
},
config:{//配置信息:修改后将全量更新或全部重缓.
name:'yourname',//必填,自定义的本地缓存库名称,
version:'v1.0',//必填,改动则全量更新
domain:{//域名,必填,格式如下,domain.css和domain.js必填.其余任意,
//作用:例如所有被缓存的文件中存在`_domain.test_`均被替换,用于cdn或相对路径.
css:'http://127.0.0.1',//或http://www.test.com/css等,替换缓存中的_domain.css_
js:'http://127.0.0.1',//替换缓存中的_domain.js_
img:'https://css.test.com'//替换缓存中的_domain.img_
}
},
list:{//命令包,
//_preload是系统内置值(选填),写法参见 配置基本写法:加载顺序
_preload:[
['_a'],['_d'],['_b','_c']
],
//命令行,写法参见 配置基本写法:文件加载
_a: '[js.v0.8.1][hello]test,https://test.com/a002.js',
_b: '[js.v0.1.0]test,http://127.0.0.1/b002.js',
_c: '[js.v0.1.0]test,http://127.0.0.1/c002.js',
_d: '[js.v0.1.0]test,http://127.0.0.1/d002.js'
}
};
```

# 使用范例

```html
<html>
<head>
<link type="text/css" rel="stylesheet" href="base.css"/>
<!--base.css作用:通过该文件解决因css无任何加载前的页面闪动-->
<script type='text/javascript' src='entrance.js'></script>
</head>
<body>
</body>
</html>
```

# 兼容说明

`smartload` 以 `localStorage` , `async` 为界限,将全平台所有浏览器分成了三大类进行按类加载:

`v1.js`:不支持缓存的古老浏览器如:`ie8-`。

`v2.js`:支持缓存但不支持`async`如:`ie8+`,`firefox v52-`,`chrome v55-`等。

`v3.js`:支持缓存且支持`async如:`firefox v52+`,`chrome v55+`。

版本号是向下兼容的,即 `v2.js`适用于 `v3.js`支持的浏览器。

 `v1.js` 过于古老,使用者不多,仅用 `alert`提示成功。
 
 `v3.js`尚无时间计划,直接以 `v2.js`替代了,从理论上而言 `v3.js` 将比 `v2.js` 快大约 `4-6` 倍。

# 测试效果:

首次载入 `css` 和 `js` 累计请求 `18` 次的 `18` 个文件 `gzip`共 `800k` 的耗时 `750ms` 的页面.

二次打开或清空浏览器缓存后仅 `24ms` 且仅请求 `2` 次( `base.css` 和 `entrance.js` ).

# 未来计划

1.支持图片,音视频缓存.

2.支持合并存取.