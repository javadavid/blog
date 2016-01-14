---
layout: post
title:  "HttpUrlConnection 乱码问题"
date: 2016/1/9 17:32:33 
categories:
- 技术
tags:
- Java
---



往往下载的时候要通过远程下载文件，得到产生字节流

可以使用：HttpUrlConnection 和 HttpClient


HttpUrlConnection得到字节流；

	HttpURLConnection con = (HttpURLConnection) new URL(url) .openConnection();
	if (con.getResponseCode() == 200) {
		InputStream is = con.getInputStream();
		byte[] bytes = new byte[is.available()];
		int len = -1;
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		while ((len = is.read()) != -1) {
			baos.write(bytes, 0, len);
		}
		byte[] b = baos.toByteArray();
	}


HttpClient：得到字节流

	HttpClient client=new DefaultHttpClient();
	HttpResponse response= client.execute(new HttpGet(url));
	if(response.getStatusLine().getStatusCode()==HttpStatus.SC_OK){
		byte[] b=EntityUtils.toByteArray(response.getEntity());
	}


使用HttpUrlConnection时候通过 new String(b, 字符编码) 转成 字符串类型 产生乱码，试了多种字符编码都是一样情况，但是 HttpClient 没有乱码问题

![java_httpurlconnection.png]({{site.baseurl}}/public/img/java_httpurlconnection.png)


那么该怎么解决呢？
