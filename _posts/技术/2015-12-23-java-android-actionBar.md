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

![android_actionbar01.png]({{site.baseurl}}/public/img/android_actionbar01.png)

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

![android_actionbar02.png]({{site.baseurl}}/public/img/android_actionbar02.png)

###ActionBar实例（ActionBar02）
使用搜索框(searchView)，通过LoaderManager.LoaderCallbacks<Cursor>异步加载联系人查询信息

创建Main和Item的布局文件、和menu中的main.xml的search节点信息

	<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
	    xmlns:tools="http://schemas.android.com/tools"
	    android:layout_width="match_parent"
	    android:layout_height="match_parent"
	    tools:context=".MainActivity" >
	    <ListView android:id="@+id/lvId"
	        android:layout_width="wrap_content"
	        android:layout_height="wrap_content"/>
	</RelativeLayout>

</br>

	<?xml version="1.0" encoding="utf-8"?>
	<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
	    android:layout_width="match_parent"
	    android:layout_height="wrap_content"
	    android:orientation="vertical" >
	    <TextView
	        android:id="@+id/nameId"
	        android:layout_width="match_parent"
	        android:layout_height="match_parent"
	        android:textColor="#0f0"
	        android:layout_margin="12dp" />
	    <TextView
	        android:id="@+id/phoneId"
	        android:layout_width="match_parent"
	        android:layout_height="match_parent"
	        android:textColor="#00F"
	        android:layout_margin="20dp"/>
	</LinearLayout>

<br/>

	<menu xmlns:android="http://schemas.android.com/apk/res/android" >
	    <item
	        android:id="@+id/action_search"
	        android:orderInCategory="100"
	        android:showAsAction="always"
	        android:actionViewClass="android.widget.SearchView"
	        android:title="查找"/>
	</menu>


MainActivity.java:实现接口LoaderCallbacks<Cursor>

- LoaderCallbacks用来实现异步回调
	- onCreateLoader(int id, Bundle args)：初始化创建拥有ID的Loader
	- onLoadFinished(Loader<Cursor> loader, Cursor data):用于通知回调调用
	- onLoaderReset(Loader<Cursor> loader)：重置当前Loader的信息
- SearchView.setOnQueryTextListener(OnQueryTextListener listener):添加searchView的监听事件事件
	- onQueryTextSubmit(String query)：当提交时候改变的事件
	- onQueryTextChange(String newText)：当文字改变触发事件

<nobr/>

	public class MainActivity extends Activity implements LoaderCallbacks<Cursor>{
		private ListView lvId;
		private SimpleCursorAdapter adapter;
		private Uri rawcontactUrl=ContactsContract.CommonDataKinds.Phone.CONTENT_URI;
		private String[] colums={"_id","display_name","data1"};
	
		private SearchView searchItem;
		@Override
		protected void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			setContentView(R.layout.activity_main);
			lvId=(ListView) findViewById(R.id.lvId);
			adapter=new SimpleCursorAdapter(getApplicationContext(),
						R.layout.item_contact_phone,null,
						new String[]{"display_name","data1"},
						new int[]{R.id.nameId,R.id.phoneId},
						SimpleCursorAdapter.FLAG_REGISTER_CONTENT_OBSERVER);
			lvId.setAdapter(adapter);
			getLoaderManager().initLoader(3, null, this);
		}
	
		@Override
		public boolean onCreateOptionsMenu(Menu menu) {
			getMenuInflater().inflate(R.menu.main, menu);
			MenuItem item= menu.findItem(R.id.action_search);	//查找item
			searchItem = (SearchView) item.getActionView();		//取得Item中的ActionView
			
			searchItem.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
				@Override
				public boolean onQueryTextSubmit(String query) {
					// 提交时候改变的事件
					return false;
				}
				@Override
				public boolean onQueryTextChange(String newText) {
					//当文字改变触发的事件
					Bundle bundle=new Bundle();
					bundle.putString("key", newText);
					getLoaderManager().restartLoader(3,bundle,MainActivity.this);
					return false;
				}
			});
			return true;
		}
	
		@Override
		public Loader<Cursor> onCreateLoader(int id, Bundle args) {
			String where=null;
			String whereArgs[]=null;
			if(args!=null){
				where ="display_name like ? or data1 like ? ";
				String key="%"+args.getString("key")+"%";
				whereArgs=new String[]{key,key};
			}
			return new CursorLoader(getApplicationContext(),rawcontactUrl,colums,where,whereArgs,null);
		}
	
		@Override
		public void onLoadFinished(Loader<Cursor> loader, Cursor data) {
			adapter.swapCursor(data);
		}
	
		@Override
		public void onLoaderReset(Loader<Cursor> loader) {
			adapter.swapCursor(null);
		}
	}

![android_actionbar03.png]({{site.baseurl}}/public/img/android_actionbar03.png)
