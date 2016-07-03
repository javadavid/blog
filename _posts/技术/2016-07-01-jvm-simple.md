---
layout: post
title:  “JAVA JVM 简介”
date: 2016/7/01 22:16:52 
categories:
- 技术
tags:
- Java
---

## JVM（Java Virtual Machine）
业界的三大java虚拟机：Oracle hotspot（后来被sun收购。名字源于：热点代码探测。最后独立用在1.4版本的JDK，后来衍生出了开远的Open JDK，也就是现在默认centos安装的jdk）、Oracle JRockit VM、IMB J9 VM。

## java运行时内存区域划分  
![jvm-pic01][image-1]
1. 程序计数器：一块较小的内存空间，他的作用可以看作是线程执行的字节码的行号指示器。或者可以理解成为指针。（若执行的是java方法，则是一个地址，native方法则指示器是null)
2. java堆:
3. 虚拟机栈


[image-1]:	%7B%7Bsite.baseurl%7D%7D/public/img/jvm-pic01.png