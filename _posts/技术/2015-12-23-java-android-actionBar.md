---
layout: post
title:  "Android ActionBar 学习记录"
date: 2015/12/25 16:52:24 
categories:
- 技术
tags:
- Android
---

###ActionBar
显示窗体的标题栏，提供导航功能；在3.0以后用来替代tittle bar和menu。

定义的图标在main.xml中;showAsAction中的选择项
- ifRoom：根据导航栏的宽度来决定是否溢出
- never：只显示在溢出列表中
- always：总是会显示在标题栏
- withText：显示标题栏的文本标题，若标题空间有限，则有可能显示不全；
- collapseActionView：这个值是可选的，意义在于点击以后会打开（展开）和关闭（折叠）操作，例如搜索按钮触发会展开搜索内容，失去焦点内容闭合

<nobr/>

	<menu xmlns:android="http://schemas.android.com/apk/res/android" >
	    <item
	        android:id="@+id/action_add"
	        android:icon="@android:drawable/ic_menu_add"
	        android:orderInCategory="100"
	        android:showAsAction="ifRoom"
	        android:title="添加"/>
	    <item
	        android:id="@+id/action_camera"
	        android:icon="@android:drawable/ic_menu_camera"
	        android:orderInCategory="100"
	        android:showAsAction="ifRoom"
	        android:title="拍照"/>
	    <item
	        android:id="@+id/action_call"
	        android:icon="@android:drawable/ic_menu_call"
	        android:orderInCategory="100"
	        android:showAsAction="ifRoom"
	        android:title="拨号"/>
	    <item
	        android:id="@+id/action_delete"
	        android:icon="@android:drawable/ic_menu_delete"
	        android:orderInCategory="100"
	        android:showAsAction="always"
	        android:title="删除"/>
	</menu>

![android_actionbar01.png]({{site.baseurl}}/public/img/html/android_actionbar01.png)

MainActivity.java：
- activity中通过getActionBar()方法取得actionBar
- setDisplayShowHomeEnabled()：设置标题栏是否可用
- setDisplayHomeAsUpEnabled()：设置可以向上导航
- 显示图标同样要使用setIconEnable方法
- onOptionsItemSelected(MenuItem item)：用来选择触发各个actionBar图标按钮的事件
- onTouchEvent(MotionEvent event)：触发Activity的事件动作
- getActionBar().hide()/show()：显示和隐藏标题
- dispatchTouchEvent(MotionEvent ev)：事件分发（此处以后详细讲解）

<nobr/>

	public class MainActivity extends Activity {
		private TextView tvId;
		private float fontSize;
		@Override
		protected void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			setContentView(R.layout.activity_main);
			tvId=(TextView) findViewById(R.id.tvId);
			fontSize=tvId.getTextSize();
			
			getActionBar().setDisplayShowHomeEnabled(true);
			getActionBar().setDisplayHomeAsUpEnabled(true);
		}
	
		@Override
		public boolean onCreateOptionsMenu(Menu menu) {
			getMenuInflater().inflate(R.menu.main, menu);
			setIconEnable(menu, true);
			return true;
		}
	
		@Override
		public boolean dispatchTouchEvent(MotionEvent ev) {
			//分发事件
			return onTouchEvent(ev);
		}
		
		@Override
		public boolean onTouchEvent(MotionEvent event) {
			//3种类型的触屏事件	actionBar的显示和隐藏
			if(event.getAction()==MotionEvent.ACTION_UP){
				if(getActionBar().isShowing()){
					getActionBar().hide();
				}else{
					getActionBar().show();
				}
			}else if(event.getAction()==MotionEvent.ACTION_DOWN){
				return true;
			}
			return true;
		}
		
		@Override
		public boolean onOptionsItemSelected (MenuItem item) {
			switch (item.getItemId()) {
				case R.id.action_add:
					fontSize+=10;
					tvId.setTextSize(fontSize);
					break;
				case R.id.action_call:
					break;
				case R.id.action_camera:
					break;
				case R.id.action_delete:
					break;
				case android.R.id.home:
					Toast.makeText(getApplicationContext(), "--->actionBar home", 1).show();
					break;
				default:
					break;
			}
			return false;
			
		}
		
		//通过反射调用 显示菜单Item图标文件
		public void setIconEnable(Menu menu,boolean enable){
			try {
				Class clazz=Class.forName("com.android.internal.view.menu.MenuBuilder");
				Method m=clazz.getDeclaredMethod("setOptionalIconsVisible", boolean.class);
				m.setAccessible(true);
				m.invoke(menu, enable);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

AndroidManifest.xml：

activity节点中：android:uiOptions="splitActionBarWhenNarrow"：启动分离式操作，将actionbar菜单分发到底部，如图显示

![android_actionbar02.png]({{site.baseurl}}/public/img/html/android_actionbar02.png)

###ActionBar实例（ActionBar02）
