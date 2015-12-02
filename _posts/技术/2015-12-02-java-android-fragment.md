---
layout: post
title:  "Android Fragment 学习记录(1)"
date: 2015/12/2 9:05:41 
categories:
- 技术
tags:
- Android
---

##Fragment作用和创建

主要用于布局文件的复用

创建静态的Fragment

- 继承Fragment方法。覆写onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)：创建Fragment
	- 第一个参数：资源加载器
	- 第二个参数：当前Fragment所在的父布局的对象
	- 第三个参数：存放的业务数据
- 通过Layout布局文件中的name指定布局文件的类

HelloFragment：

1. 直接创建一个布局返回

		public View onCreateView(LayoutInflater inflater, ViewGroup container,Bundle savedInstanceState) {
			TextView tv=new TextView(getActivity().getApplicationContext());
			tv.setText("Hello Fragment");
			tv.setTextSize(30);
			tv.setTextColor(Color.RED);
			//转变为标准尺寸的一个函数  10dp 
			int padding=(int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 10, getResources().getDisplayMetrics());
			tv.setPadding(padding, padding, padding, padding);
			
			return tv;
		}
2. 通过取得布局文件返回

	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		return inflater.from(getActivity().getApplicationContext()).inflate(R.layout.fragment_edit, null);
	}

MainActivity 取得控件

	public class MainActivity extends Activity {
		private EditText nameText;
		private Button clickBtn;
		@Override
		protected void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			setContentView(R.layout.activity_main);
			nameText=(EditText) findViewById(R.id.nameId);
			clickBtn=(Button) findViewById(R.id.btnId);
			
			clickBtn.setOnClickListener(new View.OnClickListener() {
				@Override
				public void onClick(View v) {
					setTitle(nameText.getText());
				}
			});
		}
	}

activity_main.xml： fragment节点下通过name关联相应的布局

	<!-- 静态方式显示 fragment -->
    <fragment
        android:id="@+id/fragmentId"
        android:name="com.example.fragment.EditFragment"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="@string/hello_world" />

![android_fragment01]({{site.baseurl}}/public/img/html/android_fragment01.png)


##关于Fragment取得控件
1. 公用了一次的Fragment主布局中可以直接通过findViewById取得其中控件)(上面的实例)
2. 公用多次的Fragment 通过FragmentManager取得Fragment --> View -->控件
3. 若是要在控件上添加事件，则主布局的优先级高于Fragment布局，会将其覆盖

代码：

Fragment Layout布局：

	<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
	    xmlns:tools="http://schemas.android.com/tools"
	    android:layout_width="match_parent"
	    android:layout_height="match_parent"
	    tools:context=".MainActivity" >
	    <EditText
	        android:id="@+id/nameId"
	        android:layout_width="fill_parent"
	        android:layout_height="wrap_content"
	        android:textColor="#000"
	        android:hint="请输入文字" />
	</RelativeLayout>

EditFragment:通过inflater传入Context返回布局文件对象

	public View onCreateView(LayoutInflater inflater, ViewGroup container,Bundle savedInstanceState) {
		return inflater.from(getActivity().getApplicationContext()).inflate(R.layout.fragment_edit, null);
	}

MainActivity主布局中：

	public class MainActivity extends Activity {
		private FragmentManager fragmentManager;
		@Override
		protected void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			setContentView(R.layout.activity_main);
			//取得系统的FragmentManager对象
			fragmentManager = getFragmentManager();		
		}

		public void showInfo(View view){
			//通过FragmentManager返回关联的Fragment对象
			Fragment fragment=fragmentManager.findFragmentById(R.id.fragment2Id);
			
			View v=fragment.getView();
			
			TextView txt2View=(TextView) v.findViewById(R.id.nameId);
			
			setTitle(txt2View.getText());
		}
	}

![android_fragment02]({{site.baseurl}}/public/img/html/android_fragment02.png) 


