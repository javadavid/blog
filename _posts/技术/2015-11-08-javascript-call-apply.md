---
layout: post
title:  "关于js中 apply call 理解"
date:   2015.11.08 15:13:04 
tags:
- javascript 
---
关于apply和call的应用；
作用是改变函数作用域
语法：fun.apply(obj,[params...])
{% highlight js %}
window.firstName = "diz";
window.lastName = "song";
var myObject = { firstName: "my", lastName: "Object" };
function HelloName() {
	console.log("Hello " + this.firstName + " " + this.lastName, " glad to meet you!");
}
HelloName.call(window); //who .call(this);
HelloName.call(myObject); 
{% endhighlight %}
另外需要注意的是；

fun.call(obj):return boolean

function(){ fun.call(obj) }:return function 


