## 作用
带有`重试`和`后备`模式的根据`js/css/img的路径或url`将内容存入`localforage`中,支持全量或增量更新,二次打开页面时直接从`localforage`中读取,省却请求,节省带宽,又提高响应速度.`localforage`相比`localStorage`有许多完美的标签,在缓存这块而言是个重大的尝试.

## 插件实现流程
1. 配置:json或object
2. 初始化:
2.1 浏览器是否支持localforage,不支持的话,直接创建`<script>,<css>`等标签.
2.2 对比`localforage`的`autoload_base('version','domain')`,插入或更新并清理`localforage`
2.3 同步或异步的按参数全量或增量载入css/js/img到指定的键值中
2.4 读取内容并回调.


## 概念
**统一加载**:页面初始化时,从服务器获取`css/js/img等url域名和路径信息的json配置`,按`key`从中加载即可.
**独立加载**:页面初始化后,不从统一配置`json`中调用

## 配置写法
```js
[名称] //独立配置时必填,仅限英文数字._-
[格式.版本号] //格式必填,版本号可选
[回调名称] //选填,仅限英文数字._-
主路径或url,后备1路径或url,后备2路径或url... //以此类推,路径时无需后缀,test/jq.js可写成test/jq
```
**统一配置示例**:
```json
'jquery': '[js.v3.01][callback]test/jq,http://apps.bdimg.com/libs/jqueryui/1.9.2/jquery-ui.min.js',
'jquery': '[js.v3.01]test/jq,http://apps.bdimg.com/libs/jqueryui/1.9.2/jquery-ui.min.js',
'jquery': '[js]test/jq',
'jquery': '[js]http://apps.bdimg.com/libs/jqueryui/1.9.2/jquery-ui.min.js'
```
**独立配置示例**:
```json
'[jquery][js.v3.01][callback]test/jq,http://apps.bdimg.com/libs/jqueryui/1.9.2/jquery-ui.min.js',
'[jquery][js.v3.01]test/jq,http://apps.bdimg.com/libs/jqueryui/1.9.2/jquery-ui.min.js',
'[jquery][js]test/jq',
'[jquery][js]http://apps.bdimg.com/libs/jqueryui/1.9.2/jquery-ui.min.js'
```

`注意:统一配置和独立配置可以混合使用`

`明白了以上写法之后,下方内容就很容易理解了`

## 初始化配置

```json
//
{
  'version': 'v1.0',//必填
  'domain': {//必填,域名及css/js文件内相对路径替换
    'css': 'http://css.test.com',//或http://www.test.com/css等
    'js': 'http://js.test.com',//如果文件中存在_domain.css_,_domain.js_,_domain.img_将被替换为该值
    'img': 'http://img.test.com'
  },
  'base': {//必填,localforage和autoload的url和路径
    '_localforage': '[js.v1.0]localforage.js,http://cdn.test.com/localforage.js',
    '_autoload': '[js.1013][test_function_name]test,http://test.com/libs/test.js'
  },
  //以上均为必填项,其中版本或域名变更时,将清零localforage,进行全量更新.
  'list': {//可选,全站css/js/需缓存的base64_img集合,方便统一管理和下方调用
    'asyn': false,//同步或异步,默认异步
    'localforage': '[js.v1.0]localforage.js,http://cdn.test.com/localforage.js',
    'test': '[js.1013][test_function_name]test,http://test.com/libs/test.js'
  }
}
```
# 使用

> 流程:配置>初始化>加载

**1.配置>初始化**
```js
//初始化
autoload.init({
  'version': 'v1.0',
  'domain': {
    'css': 'http://css.test.com',
    'js': 'http://js.test.com',
    'img': 'http://img.test.com'
  },
  'base': {//必填,localforage和autoload的url和路径
    '_localforage': '[js.v1.0]localforage.js,http://cdn.test.com/localforage.js',
    '_autoload': '[js.1013][test_function_name]test,http://test.com/libs/test.js'
  },
  'list': {//可选,全站css/js/需缓存的base64_img集合,方便统一管理和下方调用
    'asyn': false,//同步或异步,该项未配置时默认异步
    'jquery': '[js.v1.0]jquery',
    'test': '[js.1013][test_function_name]test,http://test.com/libs/test.js'
  }
},'init');
//此后根据需要加载
```
**2.1 统一加载**
```js
autoload();//什么都不填,则异步的加载配置中的'list'全部清单
autoload({'asyn': false,'jquery,test'});//同步,即按list清单逐个加载>回调>再加载
autoload({'jquery,test'});//异步
```
**2.2 独立加载之js**:
```js
//同步:
autoload(
{
'asyn': true,
'[name][js.1013][test_function_name]path/jquery,http://test.com/test.js',
/*,[name][js.1013][test_function_name]...可一次加载多个...*/
});
//异步:
autoload({
'[name][js.1013][test_function_name]path/jquery,http://test.com/test.js',
/*,[name][js.1013][test_function_name]...可一次加载多个...*/
});
```
**2.2 独立加载之Html标签**:
```html
<autoload data-autoload='[name][js.1013][test_function_name]path/jquery,http://test.com/test.js'></autoload>
<!--//data-autoload内容与js中写法无差异-->
```

# 使用范例

```html
<html>
<head>
<link type="text/css" rel="stylesheet" href="base.css"/>
<!--base.css作用:通过该文件解决因autoload未开始前加载css时的页面闪动-->
<script type='text/javascript' src='entrance.js'></script>
<!--entrance.js作用:内置了配置json的入口文件,将包括localforage和autoload在内的所有文件进行缓存-->
</head>
<body>
</body>
</html>
```

# 兼容说明
`smartload`以`localStorage`和`async`为界限,将全平台所有浏览器分成了三大类进行按类加载.
`v1.js`:不支持缓存的古老浏览器如:`ie8-`.
`v2.js`:支持缓存但不支持`async`如:`ie8+`,`firefox v52-`,`chrome v55-`等
`v3.js`:支持缓存且支持`async如:`firefox v52+`,`chrome v55+`

# 测试效果:
首次载入`css`和`js`累计请求18次的18个文件`gzip`共`800k`的耗时`750ms`的页面
二次打开后仅`24ms`且仅请求2次(base.css和entrance.js).

# 未来计划

1.支持图片,音视频缓存
2.支持合并存取






