---
layout: post
title:  "Android BroadcastReceiver 学习"
date: 2016/1/25 17:56:46 
categories:
- 技术
tags:
- Android
---

###BroadcastReceiver：
广播接受者：用来接收系统和应用的广播；比如系统的监听电量状态操作、网络状态等

####动态注册接收系统广播操作：

MainActivity.java：

- 继承BroadcastReceiver实现 onReceive(Context context, Intent intent)：用来接收广播，其中包含了receiver对象的context和intent信息，一般系统消息都被装载到了Intent Extra中
- 实例化广播myBroadCastReceiver，和IntentFilter，其中IntentFilter接收Intent的实例操作类；
- 当启动registerReceiver(BroadcastReceiver receiver, IntentFilter filter)：将BroadCastReceiver中匹配的Action注册到Activity中
- 当销毁时候 unregisterReceiver 方法
- BatteryManager电池管理包含了一些对ACTION_BATTERY_CHANGED intent的一些电池的常量；

<nobr/>

	public class MainActivity extends Activity {
		private TextView msgTv;
		BroadcastReceiver myBroadCastReceiver;
		@Override
		protected void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			setContentView(R.layout.activity_main);
			msgTv=(TextView) findViewById(R.id.msgId);
			//实例化广播
			myBroadCastReceiver = new MyBroadCastReceiver();
			
			//实例化广播过滤器
			IntentFilter filter = new IntentFilter();
		
			//添加系统的广播  电量改变  充电状态
			filter.addAction(Intent.ACTION_BATTERY_CHANGED);	
			filter.addAction(Intent.ACTION_POWER_DISCONNECTED);
			
			//注册广播
			registerReceiver(myBroadCastReceiver, filter);
		}
	
		@Override
		protected void onDestroy() {
			super.onDestroy();
			unregisterReceiver(myBroadCastReceiver);
		}

		class MyBroadCastReceiver extends BroadcastReceiver{
			@Override
			public void onReceive(Context context, Intent intent) {
				//接收到广播的处理方法，可以接收多个广播
				if(intent.getAction()==Intent.ACTION_BATTERY_CHANGED){
					int level=intent.getIntExtra(BatteryManager.EXTRA_LEVEL, 0);
					msgTv.setText("电量状态改变:"+level+"%");
				}else if(intent.getAction()==Intent.ACTION_POWER_DISCONNECTED){
					msgTv.setText("电源已经断开（是否是充电状态）");
				}
			}
		}
	}

![android_broadcastreceiver01.png]({{site.baseurl}}/public/img/android_broadcastreceiver01.png)

####静态注册自定义广播地址

在AndroidManifest.xml：添加对receiver的声明和IntentFilter名称定义

	<receiver android:name="com.example.receiver.MyReceiver">
		<intent-filter>
		    <action android:name="com.example.receiver.MY_RECEIVER"/>
		    <category android:name="android.intent.category.DEFAULT"/>
		</intent-filter>            
    </receiver>

通过Activity下面的sendBroadcast(intent)：发送intent广播信息；

	public class MainActivity extends Activity {
		BroadcastReceiver br;
		@Override
		protected void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			setContentView(R.layout.activity_main);
			
			br=new MyReceiver();
			Intent intent = new Intent("com.example.receiver.MY_RECEIVER");  
		    intent.putExtra("msg", "hello receiver.");  
			sendBroadcast(intent);
		}
	}

MyReceiver.java：

	public class MyReceiver extends BroadcastReceiver {
		@Override
		public void onReceive(Context context, Intent intent) {
			Log.i("info", intent.getExtras().getString("msg"));
		}
	}

![android_broadcastreceiver02.png]({{site.baseurl}}/public/img/android_broadcastreceiver02.png)

####静态注册查看网络状态信息；
NetWorkReceiver.java

- ConnectivityManager：管理网络状态，负责告诉程序改变的网络状态；
- NetworkInfo：包含网络状态的信息，getType():取得网络状态的标识;info.isAvailable()判断当前网络状态是否可用

<nobr/>

	//接受网络的方法类
	public class NetWorkReceiver extends BroadcastReceiver {
	
		@Override
		public void onReceive(Context context, Intent intent) {
			Log.i("info", intent.getAction());
			
			//取得系统服务连接管理
			ConnectivityManager conManger=(ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
			//网络信息管理
			NetworkInfo info = conManger.getActiveNetworkInfo();
			if(info!=null&&info.isAvailable()){
				if(info.getType() == ConnectivityManager.TYPE_MOBILE){
					Log.i("info", "网络连接：移动");
				}else if(info.getType() == ConnectivityManager.TYPE_WIFI){
					Log.i("info", "网络连接：Wifi");
				}
			}else{
				Log.i("info", "网络断开");
			}
		}
	}

![android_broadcastreceiver03.png]({{site.baseurl}}/public/img/android_broadcastreceiver03.png)

注意：在网络连接时，有系统程序会对网络状态监听，所以会执行多个程序监听操作；


