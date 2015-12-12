---
layout: post
title:  "Android Storage 学习记录"
date: 2015/12/12 16:09:00 
categories:
- 技术
tags:
- Android
---

##Storage的分类
 
- Shared Preferences：共享存储，原始的键值对；
- Internal Storage：内部存储
- External Storage：扩展存储
- SQLite Databases：数据库
- Network Connection：网络


###Shared Preferences
- 写操作：通过 getSharedPreferences(String name,int mode)传入引用的名称和存储的类型，返回SharedPreferences对象；通过接口SharedPreferences.Editor的put方法设置值提交

		public void write(View view){
			SharedPreferences sf= getSharedPreferences("set", Context.MODE_PRIVATE);
			SharedPreferences.Editor edit=sf.edit();
			edit.putInt("color", Color.RED);
			edit.putInt("backGroundColor", Color.BLACK);
			edit.putBoolean("allCaps", true);
			edit.commit();
			Toast.makeText(getApplicationContext(), "write ok", 1).show();
		}

	- 此时点击后会在项目目录生成文件 /shared_prefs/set.xml;文件内容如下
![android_storage01.png]({{site.baseurl}}/public/img/android_storage01.png)
		 

- 读操作：直接通过取得SharedPreferences，直接使用get读取相应数据

		public void read(View view){
			SharedPreferences sf= getSharedPreferences("set", Context.MODE_PRIVATE);
			tv.setTextColor(sf.getInt("color", Color.RED));
			tv.setBackgroundColor(sf.getInt("backGroundColor", Color.BLACK));
			tv.setAllCaps(sf.getBoolean("allCaps", true));
			Toast.makeText(getApplicationContext(), "read ok", 1).show();
		}

![android_storage02.png]({{site.baseurl}}/public/img/android_storage02.png)

待更新。。。