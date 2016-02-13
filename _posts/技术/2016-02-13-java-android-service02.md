---
layout: post
title:  "Android Service 学习(2)"
date: 2016/2/13 14:09:55 
categories:
- 技术
tags:
- Android
---

#### Service 进程间的通信（AIDL）
不同的android进程中无法共享内存，aidl则提供了进程间的通信接口机制，可以调用外部应用程序提供的数据接口 （与webservice机制感觉差不多，需要服务端和客户端之间通信）

服务端：
1. 定义一个aidl文件 CalculateInterface.aidl
	
	package com.example.aidl； 
	interface CalculateInterface {
		double doCalculate(double a, double b);
	}
	
在gen中会生成相应的CalculateInterface.java文件，定义方法如下：

![android_service05.png]({{site.baseurl}}/public/img/android_service05.png)

其中会生成一个接口的实现，并且通过生成的子类存放抽象类，和一个代理类

- 子类Stub的定义，继承了Binder，并且实现了接口

		public static abstract class Stub extends android.os.Binder implements com.example.aidl.CalculateInterface

- asInterface：取得IBinder转换成本地的接口实体 若是本地的Binder则不进行通信了，直接在本地调用（客户端调用）
- onTransact：主要作用是将接口方法中的传入传出参数类型和值 读取和写入到Parcel中；（服务端通过transact方法调用）
	
		case TRANSACTION_doCalculate: {
				data.enforceInterface(DESCRIPTOR);
				double _arg0;
				_arg0 = data.readDouble();
				double _arg1;
				_arg1 = data.readDouble();
				double _result = this.doCalculate(_arg0, _arg1);
				reply.writeNoException();
				reply.writeDouble(_result);
				return true;
			}

- asBinder：用于给代理类调用返回正确的binder对象；


2. 服务返回绑定接口IBinder  CalculateServer.java实例化子类Binder对象，实现接口方法；

		public class CalculateServer extends Service{
	
			@Override
			public IBinder onBind(Intent intent) {
				Log.i("info", "-- onBind --");
				return mBinder;
			}
			
			private final CalculateInterface.Stub mBinder = new CalculateInterface.Stub() {
				
				@Override
				public double doCalculate(double a, double b) throws RemoteException {
					return a+b;
				}
			};
		}

3. 静态声明service配置文件

		<service android:name="com.example.aidl.server.CalculateServer">
	            <intent-filter>
	                <action android:name="com.example.aidl.server.CalculateServer"/>
	            </intent-filter>
	        </service>

服务端:需要同样的aidl文件，与绑定本地服务相似，只不过是隐式声明后的调用绑定
> ServiceConnection连接取得服务 - 启动定义意图  - 绑定后调用服务内容/方法接口

	public class MainActivity extends Activity {
		private EditText num1;
		private EditText num2;
		private TextView result;
		
		private CalculateInterface mService;
		
		private ServiceConnection sConnect = new ServiceConnection() {
			
			@Override
			public void onServiceDisconnected(ComponentName name) {
				Log.i("info", "-- onServiceDisconnected --");
				mService=null;
			}
			
			@Override
			public void onServiceConnected(ComponentName name, IBinder service) {
				Log.i("info", "-- onServiceConnected --");
				//从服务取得service接口
				mService = CalculateInterface.Stub.asInterface(service);
			}
		};
	    @Override
	    protected void onCreate(Bundle savedInstanceState) {
	        super.onCreate(savedInstanceState);
	        setContentView(R.layout.activity_main);
	        Intent intent =new Intent("com.example.aidl.server.CalculateServer");
	        
	        //绑定服务
	       	bindService(intent, sConnect, BIND_AUTO_CREATE);
	        
	        num1=(EditText) findViewById(R.id.num1Id);
	        num2=(EditText) findViewById(R.id.num2Id);
	        result=(TextView) findViewById(R.id.resultId);
	    }
	    
	    public void add(View v){
	    	try {
	    		//调用接口方法返回值给 result TextView
	    		result.setText( String.valueOf(  mService.doCalculate(Double.valueOf(num1.getText().toString()),Double.valueOf(num2.getText().toString())) )) ;
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
	    }
	}

布局文件activity_main.xml

	<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
	    xmlns:tools="http://schemas.android.com/tools"
	    android:layout_width="match_parent"
	    android:layout_height="match_parent"
		android:orientation="vertical"
	    tools:context=".MainActivity" >
	
	    <EditText
	        android:id="@+id/num1Id"
	        android:layout_width="match_parent"
	        android:layout_height="wrap_content" />
		<EditText
	        android:id="@+id/num2Id"
	        android:layout_width="match_parent"
	        android:layout_height="wrap_content" />
		<Button 
		    android:onClick="add"
		    android:text="远程计算（AIDL）"
		    android:layout_width="match_parent"
	        android:layout_height="wrap_content" />
		<TextView
	        android:id="@+id/resultId"
	        android:layout_width="wrap_content"
	        android:layout_height="wrap_content" />
	</LinearLayout>

![android_service06.png]({{site.baseurl}}/public/img/android_service06.png)

