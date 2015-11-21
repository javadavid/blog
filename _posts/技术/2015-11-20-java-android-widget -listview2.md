---
layout: post
title:  "Android ListView 学习记录(2) - ViewHolder "
date: 2015/11/20 9:22:13 
tags:
- java 
- android
- ListView
- ViewHolder
- 记录
---

ListView中的Adapter需要覆写的方法；

	public View getView(int position, View convertView, ViewGroup parent)

>convertView:是指的是保存的 ListView中 划出 界面的对象，当界面滑动时候总是会保存上一个的划出的 Item View对象；

	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		if(convertView==null){
			convertView=LayoutInflater.from(context).inflate(R.layout.item_person, null);
			convertView.setTag( position);
			Log.i("info", "item Tag："+convertView.getTag( ));
		}
		 
		TextView nameTv=(TextView) convertView.findViewById(R.id.nameid);
		TextView ageTv=(TextView) convertView.findViewById(R.id.ageid);
		nameTv.setText(datas.get(position).getName());
		ageTv.setText(String.valueOf(datas.get(position).getAge()));
		
		return convertView;
	}

运行结果：可以看出每次程序只会创建界面显示的几个子控件对象
![android_listview_viewholder01](http://i.imgur.com/HUNRl2m.png)


关于ViewHolder：
>首先定义一个ViewHolder子类来封装itemView中的对象，通过查看convertView是否是空，来临时保存子控件中的数据；来达到使创建子控件减少的效果（每次只创建界面显示的itemView），从而使程序不易产生垃圾对象

关于setTag(Object)和getTag()方法：
>是用来保存和取得对象中的一个临时的数据，（相当于一个对象中的子对象，内部类的关系更加容易理解）


	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		ViewHolder vHolder=null;
		if(convertView==null){
			convertView=LayoutInflater.from(context).inflate(R.layout.item_person, null);
			vHolder=new ViewHolder();
			vHolder.nameView=(TextView) convertView.findViewById(R.id.nameid);
			vHolder.ageView=(TextView) convertView.findViewById(R.id.ageid);
			convertView.setTag(vHolder);
		}else{
			vHolder=(ViewHolder) convertView.getTag();
		}
		//TextView nameTv=(TextView) convertView.findViewById(R.id.nameid);
		//TextView ageTv=(TextView) convertView.findViewById(R.id.ageid);
		
		vHolder.nameView.setText(datas.get(position).getName());
		vHolder.ageView.setText(String.valueOf(datas.get(position).getAge()));
		
		return convertView;
	}
	
	//封装Item View的子控件；在复用时候，用来减少View中的findViewById的使用。
	class ViewHolder{
		TextView nameView;
		TextView ageView;
	}

