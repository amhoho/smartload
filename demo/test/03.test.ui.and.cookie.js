 $(function() {
 //jquery ui 测试
$("#progressbar_test").progressbar({value: 37});
console.log("jquery ui test : $('#progressbar_test').progressbar({value: 37});");
$.cookie('cookie_name', 'the_cookie_name_value', { expires: 7, path: '/' });
console.log("jquery cookie test: set cookie cookie_name："+$.cookie('cookie_name'));
$('#cookie_test').html('cookie_name:'+$.cookie('cookie_name'));
});