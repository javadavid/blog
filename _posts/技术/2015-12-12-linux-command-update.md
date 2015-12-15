---
layout: post
title:  "Linux 常用命令 - 更新 "
date: 2015/12/12 16:09:00 
categories:
- 技术
tags:
- Linux
---

setup：进入设置页面
ifconfig:查看网络设置
df：查看硬盘的信息

ls：查看文件列表
  - l:long file:长文件列表  和ll命令行的效果一样
    - 其中前面的文件权限 每3个字符为一个权限，分别是 当前用户权限，组权限，其他用户权限  
  - h:human:显示文件字节变成KB
  - i:可以查看文件的ID号
  - a:可以查看目录下面的文件
  - d:查看文件夹的信息

cd:change directory 改变文件目录
  - cd ..：返回上级目录
  - cd -：跳到上次目录
  - cd ~：跳到root根目录
  - cd .： 跳到当前目录

mkdir:make directory：创建文件目录
  - p :可以创建文件队列

pwd:print working directory 打印当前目录

rm -rf：删除文件；
  - r：文件夹
  - f：是否强制删除

mv:移动文件夹

