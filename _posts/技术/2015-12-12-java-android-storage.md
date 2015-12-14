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

	- 此时点击后会在项目目录生成文件 包路径/shared_prefs/set.xml;文件内容如下
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


####Shared Preferences应用（延伸）

MainActivity：设置文字的属性后，按退出后重启依然保存内容

- 将TextView的各种变量保存在全局中
- onCreate初始取得TextView并读取共享存储
- onDestroy保存在共享存储中
- 通过判断item.getItemId()来执行创建的ContextMenu的动作

<nobr/>

	public class MainActivity extends Activity {
		private TextView tv;
		private int changeBackgroundColor;
		private int changeFontColor;
		private float addfontSize;
		@Override
		protected void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			setContentView(R.layout.activity_main);
			tv = (TextView) findViewById(R.id.tvId);
			registerForContextMenu(tv);
			read(null);
		}
	
		@Override
		public void onCreateContextMenu(ContextMenu menu, View v,
				ContextMenuInfo menuInfo) {
			getMenuInflater().inflate(R.menu.main, menu);
			super.onCreateContextMenu(menu, v, menuInfo);
		}
	
		@Override
		public boolean onContextItemSelected(MenuItem item) {
			switch (item.getItemId()) {
				case R.id.changeBackgroundColor:
					changeBackgroundColor=Color.rgb((int)(Math.random()*256),(int)(Math.random()*256), (int)(Math.random()*256));
					tv.setBackgroundColor(changeBackgroundColor);
					break;
				case R.id.changeFontColor:
					changeFontColor=Color.rgb((int)(Math.random()*256),(int)(Math.random()*256), (int)(Math.random()*256));
					tv.setTextColor(changeFontColor);
					break;
				case R.id.addfontSize:
					addfontSize+=tv.getTextSize()+10;
					tv.setTextSize(addfontSize);
					break;
				default:
					break;
			} 
			return super.onContextItemSelected(item);
		}
	
		public void read(View view) {
			SharedPreferences sf = getSharedPreferences("set", Context.MODE_PRIVATE);
			tv.setTextColor(sf.getInt("textColor", tv.getCurrentTextColor()));
			tv.setBackgroundColor(sf.getInt("backGroundColor", ((ColorDrawable)tv.getBackground()).getColor()));
			tv.setTextSize(sf.getFloat("textSize" , tv.getTextSize()));
			tv.setAllCaps(sf.getBoolean("allCaps", true));
			Toast.makeText(getApplicationContext(), "read ok", 1).show();
		}
	
		public void write(View view) {
			SharedPreferences sf = getSharedPreferences("set", Context.MODE_PRIVATE);
			SharedPreferences.Editor edit = sf.edit();
			edit.putInt("textColor", changeFontColor);
			edit.putInt("backGroundColor",changeBackgroundColor);
			edit.putFloat("textSize",addfontSize);
			edit.putBoolean("allCaps", true);
			edit.commit();
			Toast.makeText(getApplicationContext(), "write ok", 1).show();
		}
		
		@Override
		protected void onDestroy() {
			write(null);
			super.onDestroy();
		}
	}

![android_storage03.png]({{site.baseurl}}/public/img/android_storage03.png)


###Internal Storage

- 通过openFileOutput(String name, int mode)打开输出流，保存文件
- 通过openFileInput(String name)打开输入流，读取文件
- 文件保存内容在 包名称/files/文件名;


布局文件：activity_main.xml：

	<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
	    xmlns:tools="http://schemas.android.com/tools"
	    android:layout_width="match_parent"
	    android:layout_height="match_parent"
	    android:orientation="vertical"
	    tools:context=".MainActivity" >
	    <LinearLayout
	        android:orientation="horizontal"
	        android:layout_width="match_parent"
	        android:layout_height="wrap_content" >
	        <EditText
	            android:id="@+id/nameId"
	            android:layout_weight="1"
	            android:singleLine="true"
	            android:layout_width="wrap_content"
	            android:layout_height="wrap_content"
	            android:hint="请输入文件名"/>
	        <Button
	            android:onClick="openFile"
	            android:layout_width="wrap_content"
	            android:layout_height="wrap_content"
	            android:text="打开" />
	        <Button
	            android:onClick="saveFile"
	            android:layout_width="wrap_content"
	            android:layout_height="wrap_content"
	            android:text="保存" />
	    </LinearLayout>
	    <EditText
	        android:id="@+id/contentId"
	        android:layout_width="fill_parent"
	        android:layout_height="fill_parent"
	        android:hint="文件内容"/>
	</LinearLayout>

MainActivity.java：
	
	public class MainActivity extends Activity {
		EditText nameId,contentId;
		@Override
		protected void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			setContentView(R.layout.activity_main);
			contentId=(EditText) findViewById(R.id.contentId);
			nameId=(EditText) findViewById(R.id.nameId);
		}
	
		public void openFile(View view) {
			String fileName=nameId.getText().toString().trim();	//文件名
			try {
				FileInputStream fis= openFileInput(fileName);
				byte[] b=new byte[fis.available()];
				fis.read(b);
				fis.close();
				contentId.setText(new String(b));
				Toast.makeText(getApplicationContext(), "open success", 0).show();
			} catch ( Exception e) {
				e.printStackTrace();
			}
		}
	
		public void saveFile(View view) {
			String fileName=nameId.getText().toString().trim();	//文件名
			String content=contentId.getText().toString().trim();//文件内容
			try {
				FileOutputStream fos=openFileOutput(fileName, Context.MODE_PRIVATE);
				fos.write(content.getBytes());
				fos.close();
				Toast.makeText(getApplicationContext(), "save success", 0).show();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

![android_storage04.png]({{site.baseurl}}/public/img/android_storage04.png)

####Internal Storage应用（延伸）

添加Options菜单，选择后显示AlertDialog对话框，选择打开相应文件

- 启动初始化控件和adapter布局文件，设置监听
- 通过fileList()返回其中的私有模式的文件列表，并且放入到adapter中
- 点击列表重置nameId的Text属性，读取显示文件内容

MainActivity.java：
	public class MainActivity extends Activity {
		private EditText nameId,contentId;
		private AlertDialog dialog;
		private ArrayAdapter<String> adapter;
		@Override
		protected void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			setContentView(R.layout.activity_main);
			contentId=(EditText) findViewById(R.id.contentId);
			nameId=(EditText) findViewById(R.id.nameId);
			
			adapter=new ArrayAdapter<String>(this, R.layout.item);
			dialog=new AlertDialog.Builder(this)
					.setTitle("请选择文件")
					.setIcon(android.R.drawable.ic_dialog_alert)
					.setAdapter(adapter, new DialogInterface.OnClickListener() {
						@Override
						public void onClick(DialogInterface dialog, int which) {
							nameId.setText(adapter.getItem(which));
							openFile(null);
						}
					})
					.create();
		}
	
		@Override
		public boolean onCreateOptionsMenu(Menu menu) {
			getMenuInflater().inflate(R.menu.main, menu);
			return super.onCreateOptionsMenu(menu);
		}
		
		@Override
		public boolean onOptionsItemSelected(MenuItem item) {
			if(item.getItemId()==R.id.selectId){
				adapter.clear();
				adapter.addAll(fileList());
				dialog.show();
			}
			return super.onOptionsItemSelected(item);
		}
		
		public void openFile(View view) {
			String fileName=nameId.getText().toString().trim();	//文件名
			try {
				FileInputStream fis= openFileInput(fileName);
				byte[] b=new byte[fis.available()];
				fis.read(b);
				fis.close();
				contentId.setText(new String(b));
				Toast.makeText(getApplicationContext(), "open success", 0).show();
			} catch ( Exception e) {
				e.printStackTrace();
			}
		}
	
		public void saveFile(View view) {
			String fileName=nameId.getText().toString().trim();	//文件名
			String content=contentId.getText().toString().trim();//文件内容
			try {
				FileOutputStream fos=openFileOutput(fileName, Context.MODE_PRIVATE);
				fos.write(content.getBytes());
				fos.close();
				Toast.makeText(getApplicationContext(), "save success", 0).show();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}


![android_storage05.png]({{site.baseurl}}/public/img/android_storage05.png)



未完待续。。

