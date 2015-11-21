---
layout: post
title:  "java科大讯飞面试"
date:   2015/11/12 9:05:39 
categories:
- 技术
tags:
- java 
- 面试
---

前几天去科大讯飞面试了，主考官面试了几个问题。总感觉败笔不再知识面回答上，而是在技巧和说话方式上。

###**1、对java回收机制的理解;**

我想想不就是System.gc()和Runtime.getRuntime().gc()俩方法吗。只是觉得对它有一定理解，但是用到的非常少。就回答到我会尽力将代码写最优化（也都怪我嘴笨）；

那么到底该怎么回答呢？

- Java的回收机制是jvm虚拟机提供的能力（比如无用变量或者线程），回收机时间不一定;
- 垃圾回收是对内存所占据的空间进行回收，而不是对象本身
- 对上述的两个显示声明的回收方法而言，执行以后也不是马上对其进行回收，而是对其声明，告诉告诉jvm要进行回收操作。

###**2、对struts2中的拦截器（Interceptor）和web.xml中的filter过滤器的不同;**

我回答的是拦截器是对action拦截，而filter可以对所有的文件夹或者jsp过滤（其实以前项目都是用的struts1，近期才开始了解的），可能还要补充几点

- 拦截器是基于java反射机制的，而过滤器是基于回调函数的
- 过滤器是依赖与servlet容器，拦截器不依赖
- 拦截器只能对action起作用，filter对所有的请求都起作用
- 拦截器可以访问action中的上下文、值、栈里面的对象，过滤器不可以
- action的生命周期中，拦截器可以多次调用，过滤器只能一次被调用；
	
	具体的参考可以参见[CSDN](http://blog.csdn.net/sd0902/article/details/8392987)

###**3、关于反射的理解**

我的回答是通过类名称对对象进行实例化调用和查看它的具体信息，来看看具体详细的怎么说吧

> ####JAVA反射机制是在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意一个方法；这种动态获取的信息以及动态调用对象的方法的功能称为java语言的反射机制。
> 
> ####Java反射机制主要提供了以下功能： 在运行时判断任意一个对象所属的类；在运行时构造任意一个类的对象；在运行时判断任意一个类所具有的成员变量和方法；在运行时调用任意一个对象的方法；生成动态代理。

###**4、对于spring中注入的方式和spring注入的作用**

我回答的是一种是通过annotation（注释）隐式声明注入和通过spring中配置bean声明注入方法后，bean通过get来取，注入的作用是让bean实例化，给各个control组件来调用，总感觉回答有点牵强。下面看看怎么回答吧。

- 通过setter方法注入：需要在bean中生成相应熟悉的get set

		<bean id="userDao" class="com.uni2uni.spring.dao.impl.UserDao" />
		<bean id="userService" class="com.uni2uni.spring.service.impl.UserService">
		  <property name="userDao" ref="userDao"></property>
		</bean>

- 通过构造方法注入：声明XML后需要在使用bean构造方法中实现注入接口

		<bean id="userService" class="com.uni2uni.spring.service.impl.UserService" />
		<bean id="userAction" class="com.uni2uni.spring.action.UserAction">
			<constructor-arg ref="userService" />
		</bean>
		
		//java代码
		public UserAction(IUserService userService) {
			super();
			this.userService = userService;
		}
 
- 自动注入：autowire的参数值可选有：“default”、“byName”、“byType”、“constructor”、“no”。配置来实现自动装配；

		<bean id="beanId" class="包名.类名" autowire="参数值" />

- 通过注解进行注入；这种方法不是太常用
	
	- 注意：在新的Spring3的标准中，已经不推荐使用@Component的方式来完成bean的创建。新的标准提供了更多的Annotation来替代@Component。

	例如：

	@Repository：一般用于Dao的注入；

	@Service：一般用于Service层的注入；

	@Controller：一般用于Action层的注入。
 
		@Component("userAction")
		@Scope("prototype") 
		public class UserAction {
		 private User user;
		 private IUserService userService;
		 private int id;
		 public UserAction(IUserService userService) {
		  super();
		  this.userService = userService;
		 }
		 public User getUser() {
		  return user;
		 }
		 @Resource
		 public void setUser(User user) {
		  this.user = user;
		 }
		 public IUserService getUserService() {
		  return userService;
		 }
		 @Resource
		 public void setUserService(IUserService userService) {
		  this.userService = userService;
		 }
		 public int getId() {
		  return id;
		 }
		 public void setId(int id) {
		  this.id = id;
		 }
		 public void add(){
		  userService.add(user);
		 }
		 public void delete(){
		  userService.delete(id);
		 }
		 public void Get(){
		  userService.Get(id);
		 }
		}
		
参考[CSDN](http://my.oschina.net/wlb/blog/282958)

###**5、对于线程的理解** 
请参考我的[日志](/blog/2015/11/10/java-thread/)

###**6、JQuery中的显示和隐藏元素是什么**

当然是hide和show；这个是说出来了。另外一个我忽略了toggle,这个是我回家的路上才想起里的。唉~

###**7、对加班问题的看待**

这个我回答的特含糊；要是要我现在来回答的话，也许我会参考很多帖子后在来回答吧。准备不充分的啊，来看看网上的回答吧。

----------

第一种：

如果真是非完成不可的工作，那我就会加班。我认为，休假日也不一定就该不闻不问地休息。连休假日都需要加班的话，说明所从事的工作一定是相当充实的。只要是有意义的工作，与其昏昏然地享受休假，不如高高兴兴地来加班。

点评：

不只局限于是否能在加班的问题，而且更进一步从加班谈到工作的充实感，其中独具匠心。虽然全世界都在指责日本的勤劳过度现象，在这里却应该对此加以褒扬。

从这个问题的回答中可以看出应试者的敬业精神及对公司的忠诚度如何。因此，不必多费唇舌，只要理所当然地说“可以”就行了。

第二种：

加班但以后可以得到调休，所以，我觉得不会有什么问题。个人的时间固然重要，但由于工作需要，当然也会出现不得不在休假日上班的情况。我觉得只要是自己分内的工作，就算加些班也不会有人抱怨的。

点评：

这番话在不至于变成赞成勤劳过度方面掌握着巧妙的平衡。但是，为了自然而然地暗示这个意思而采取第三者的立场的话，就会妨碍意思的表达。如果不能堂堂正正地发表自己的意见，就会被认为是无论做什么事情都缺乏自信的表现。

----------

###**8、最后提问**
最后就是对他们有什么想问的了，问了一些像公司项目流程是否会有不规范的情况，往往在某些公司的人就会遇到这样那样的需求不明确，甚至是前后台所有事情都要由你一个人来完成。另外对于技术这块有没有定期的交流或是沟通学习。然后就是公司项目的来源：这个面试我的人好像很忌讳的样子，其实问了也白问，哈哈。

切记啊。面试时候要准备好，不要盲目的去面试了，一般不会问太深奥的问题，就是看你的基础。以后会把它当成经验的。从穿着到言行，很多方面都能体现出一个人的修养，所以要多加注意；