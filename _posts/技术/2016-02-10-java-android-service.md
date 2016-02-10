---
layout: post
title:  "Android Service 学习"
date: 2016/2/10 10:02:46 
categories:
- 技术
tags:
- Android
---

### Service服务
属于后台运行的一个子线程，可以长时间的保存用于管理组件，一般不依赖用户界面；用来管理线程生命周期：启动和停止线程；

#### 创建service子类的；重写生命周期；
- onCreate():初始化Service组件（一次）
- onStartCommand():启动服务执行的方法（多次）
- onDestroy():销毁service服务（一次）

#### 注册Serice组件
在配置文件AndroidManifest.xml中注册组件<service android:name="{serivce名称}"/>

#### 启动组件(Activity、BroadcastReceiver、Service组件内部)
Context.startSerivice(Intent intent): intent指向启动组件的class


> 组件启动第一次创建执行、若存在则不需要创建，直接执行onStartCommand

MyService.java:创建Service，复写生命周期;

	public class MyService extends Service {
	
		@Override
		public IBinder onBind(Intent intent) {
			//绑定生命周期的方法
			return null;
		}
		
		@Override
		public void onCreate() {
			//初始化
			super.onCreate();
			Log.i("info", "-- onCreate --");
			
		}
		
		@Override
		public int onStartCommand(Intent intent, int flags, int startId) {
			//启动Service
			Log.i("info", "-- onStartCommand --"+ intent.getExtras().getString("msg"));
			return super.onStartCommand(intent, flags, startId);
		}
		
		@Override
		public void onDestroy() {
			//销毁
			super.onDestroy();
			Log.i("info", "-- onDestroy --");
		}
	}
	
注册Service组件
> <service android:name="com.example.service01.MyService"/>

启动和停止Service
- Context.startService(Intent):启动相应Service意图
- Context.stopService(Intent):停止相应Service意图

	public class MainActivity extends Activity {
	
		private Intent myServiceIntent;
		
	    @Override
	    protected void onCreate(Bundle savedInstanceState) {
	        super.onCreate(savedInstanceState);
	        setContentView(R.layout.activity_main);
	        myServiceIntent=new Intent(getApplicationContext(),MyService.class);
	    }
	 
	    public void startService(View v){
	    	myServiceIntent.putExtra("msg","msg - "+System.currentTimeMillis());
	    	startService(myServiceIntent);
	    }
	    
	    public void stopService(View v){
	    	stopService(myServiceIntent);
	    }
	}

![android_service01.png]({{site.baseurl}}/public/img/android_service01.png)

### Service服务播放MediaPlayer
实例化MediaPlayer：可以通过构造和create()方法创建，
> 参数一：Context对象、参数二：播放文件的资源ID:一般放在raw文件夹中，通过id可以取得；

- create()方法已经实现了prepare()方法；其中需要销毁release()方法对实例释放；
- 通过广播对进度条和media实体类通知 改变状态 实现进度条的功能

MyMediaPlayer.java:

- onCreate:实现mediaPlayer实例化；和注册MediaPlayer状态广播、实例化接受SeekBar的状态广播
- onStartCommand:其中子线程，子线程用来发送一个广播；通知主线程界面来改变SeekBar的max和progress值
- onDestroy：销毁、停止和回收MediaPlayer资源(同时会销毁子线程)；解注册SeekBar BroadCastReceiver的监听

<nobr/>

	public class MyMediaPlayer extends Service {
		MediaPlayer myPlayer;
		SeekReceiver seekReceiver;
		
		@Override
		public IBinder onBind(Intent intent) {
			// TODO Auto-generated method stub
			return null;
		}
	
		@Override
		public void onCreate() {
			super.onCreate();
			//创建MediaPlayer，其中已经实现prepare()方法；在销毁必须release()释放方法；
			myPlayer = MediaPlayer.create(getApplicationContext(), R.raw.a1);
			
			seekReceiver = new SeekReceiver();
			registerReceiver(seekReceiver, new IntentFilter(Config.ACTION_SEEK_BROADCAST));
		}
		
		@Override
		public int onStartCommand(Intent intent, int flags, int startId) {
			if(myPlayer.isPlaying()){
				myPlayer.pause();
			}else{
				myPlayer.start();
				new ProgressThread().start();
			}
			return super.onStartCommand(intent, flags, startId);
		}
		
		@Override
		public void onDestroy() {
			super.onDestroy();
			myPlayer.stop();
			//myPlayer.release();	//回收资源
			unregisterReceiver(seekReceiver);
		}
		
		//子线程向主线程发送的进度广播
		class ProgressThread extends Thread{
			@Override
			public void run() {
				while(myPlayer!=null && myPlayer.isPlaying()){
					Intent intent = new Intent(Config.ACTION_PROG_BROADCAST);
	
					//取得当前播放位置
					intent.putExtra(Config.CURRENT_POSITION, myPlayer.getCurrentPosition());
	
					//取得播放音乐的持续时间
					intent.putExtra(Config.MAX_LEN, myPlayer.getDuration());
	
					sendBroadcast(intent);
				}
			}
		}
		
		class SeekReceiver extends BroadcastReceiver{
			
			@Override
			public void onReceive(Context context, Intent intent) {
				int currentPosition = intent.getIntExtra(Config.ACTION_SEEK_BROADCAST,0);
				if(myPlayer!=null)
					myPlayer.seekTo(currentPosition);
			}
		}
	}


MainActivity.java：

- onCreate：初始化主界面 、实例化接受mediaPlayer service进度的广播 和 注册SeekBar进度条的广播
	- seekBar.setOnSeekBarChangeListener：seekBar的状态改变的监听状态方法；拖动开始、拖动中和拖动结束(拖动结束：注册SeekBar发送进度广播)
- onDestroy：销毁方法，解注册广播
- 通过按钮来创建启动销毁service意图；

<nobr/>

	public class MainActivity extends Activity {
		Intent playerIntent;
		SeekBar seekBar;
		ProgressReceiver progressReceiver;
		
	    @Override
	    protected void onCreate(Bundle savedInstanceState) {
	        super.onCreate(savedInstanceState);
	        setContentView(R.layout.activity_main);
	        seekBar = (SeekBar) findViewById(R.id.seekBarId);
	        
	        progressReceiver=new ProgressReceiver();
	        registerReceiver(progressReceiver, new IntentFilter(Config.ACTION_PROG_BROADCAST));
	        
	        seekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
				
				@Override
				public void onStopTrackingTouch(SeekBar seekBar) {
					// TODO 拖动结束的事件
					int progress = seekBar.getProgress();
					Intent intent = new Intent(Config.ACTION_SEEK_BROADCAST);
					intent.putExtra(Config.ACTION_SEEK_BROADCAST, progress);
					
					sendBroadcast(intent);
	
				}
				
				@Override
				public void onStartTrackingTouch(SeekBar seekBar) {
					// TODO 开始拖动
				}
				
				@Override
				public void onProgressChanged(SeekBar seekBar, int progress,boolean fromUser) {
					// TODO 正在拖动之中
				}
			});
	    }
	    
	    @Override
	    protected void onDestroy() {
	    	super.onDestroy();
	    	unregisterReceiver(progressReceiver);
	    }
	    
	    public void start(View v){
	    	playerIntent=new Intent(getApplicationContext(),MyMediaPlayer.class);
	    	startService(playerIntent);
	    }
	    
	    public void stop(View v){
	    	stopService(playerIntent);
	    }
	    
	    
	    //用来接受service中广播发送的当前播放进度数据
		class ProgressReceiver extends BroadcastReceiver{
	
			@Override
			public void onReceive(Context context, Intent intent) {
				int currentPosition = intent.getIntExtra(Config.CURRENT_POSITION,0);
				int maxLen = intent.getIntExtra(Config.MAX_LEN,0);
				
				seekBar.setMax(maxLen);
				seekBar.setProgress(currentPosition);
			}
	    }
	}

config.java 配置信息文件

	public class Config {
		//进度广播
		public static final String ACTION_PROG_BROADCAST="com.example.service02_mediaplayer.progress";
		
		//拖动广播,指定位置
		public static final String ACTION_SEEK_BROADCAST="com.example.service02_mediaplayer.seek";
		
		public static final String CURRENT_POSITION="current";
		public static final String MAX_LEN="max";
	}

布局文件activity_main.xml

	<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
	    xmlns:tools="http://schemas.android.com/tools"
	    android:layout_width="match_parent"
	    android:layout_height="match_parent"
	    android:orientation="vertical"
	    tools:context=".MainActivity" >
	
	    <Button
	        android:layout_width="wrap_content"
	        android:layout_height="wrap_content"
	        android:onClick="start"
	        android:text="开启音乐" />
	
	    <Button
	        android:layout_width="wrap_content"
	        android:layout_height="wrap_content"
	        android:onClick="stop"
	        android:text="停止音乐" />
	
	    <!-- 可以拖动的进度条 -->
	
	    <SeekBar
	        android:id="@+id/seekBarId"
	        android:layout_width="fill_parent"
	        android:layout_height="wrap_content"/>
	
	</LinearLayout>


![android_service02.png]({{site.baseurl}}/public/img/android_service02.png)

