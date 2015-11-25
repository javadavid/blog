---
layout: post
title:  "Android ContextMenu 学习记录"
date: 2015/11/25 10:14:37 
categories:
- 技术
tags:
- java 
- android
- 记录
---

##解释
ContextMenu：用来长按后的点击出现的菜单。

如下图显示

![android_contextmenu01.PNG](http://i.imgur.com/uiljwVG.png)

各个菜单框的触发事件如下：

- onCreateContextMenu(ContextMenu menu, View v, ContextMenuInfo menuInfo)：创建上下文本菜单项 
	- ContextMenu menu：需要显示的快捷菜单
	- View v：是用户选择的界面元素
	- ContextMenuInfo menuInfo：menuInfo是所选择界面元素的额外信息（包括ViewID和Position）
- registerForContextMenu(View view)：向组件注册菜单上下文；(长按触发弹出对话框 触发 onCreateContextMenu)
- onContextItemSelected(MenuItem item)：点击菜单Item发生的事件
	- MenuItem item：上下文本菜单的对象

##代码

menu.xml文件：

	<menu xmlns:android="http://schemas.android.com/apk/res/android" >
	    <item
	        android:id="@+id/action_add"
	        android:orderInCategory="100"
	        android:showAsAction="never"
	        android:title="增加"/>
	    <item
	        android:id="@+id/action_update"
	        android:orderInCategory="100"
	        android:showAsAction="never"
	        android:title="更新"/>
	    <item
	        android:id="@+id/action_del"
	        android:orderInCategory="100"
	        android:showAsAction="never"
	        android:title="删除"/>
	</menu>

MainActivity.java：

	public class MainActivity extends Activity {
		private ListView lv;
		private List<String> datas;
		private ArrayAdapter<String> adapter;
		private int currentPosition;
	
		@Override
		protected void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			setContentView(R.layout.activity_main);
			datas = new ArrayList<String>();
			lv = (ListView) findViewById(R.id.lvId);
			adapter = new ArrayAdapter<String>(getApplicationContext(),R.layout.item, datas);
			lv.setAdapter(adapter);
			loadData();
			registerForContextMenu(lv); //向组件注册菜单上下文；
		}
	
		private void loadData() {
			for (int i = 0; i < 40; i++) {
				datas.add("person - " + i);
			}
		}
	
		// 点击菜单时候发生的事件
		@Override
		public boolean onContextItemSelected(MenuItem item) {
			switch (item.getItemId()) {
				case R.id.action_add:
					datas.add(currentPosition, "新的Person - "+System.currentTimeMillis());
					break;
				case R.id.action_update:
					datas.set(currentPosition, "修改Person - "+datas.get(currentPosition)+System.currentTimeMillis());
					break;
				case R.id.action_del:
					Toast.makeText(getApplicationContext(), "DEL : "+datas.get(currentPosition), Toast.LENGTH_SHORT).show();
					datas.remove(currentPosition);
					break;
				default:
					break;
			}
			adapter.notifyDataSetChanged();
			return super.onContextItemSelected(item);
		}
	
		@Override
		public void onCreateContextMenu(ContextMenu menu, View v,
				ContextMenuInfo menuInfo) {
			getMenuInflater().inflate(R.menu.item_edit, menu);	//注册item layout
			AdapterContextMenuInfo amenuInfo=(AdapterContextMenuInfo) menuInfo;	//取得item layout的组件对象
			currentPosition = amenuInfo.position;
			super.onCreateContextMenu(menu, v, menuInfo);
		}
	}

##具体步骤

1. 在activity的onCreate(...)方法中为一个view注册上下文菜单
2. 在onCreateContextMenuInfo(...)中生成上下文菜单。
3. 在onContextItemSelected(...)中响应上下文菜单项。


##总结
在ListView中的操作实际上是对其中的List的操作一样； 

![android_contextmenu02.PNG](http://i.imgur.com/Cwz6jgx.png)