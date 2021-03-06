﻿/* 控制导航按钮动作 */
function nav_click(is_show) {
  if (is_show) {
    /* 显示左侧aside */
    $('.aside')
      .addClass('visible-md visible-lg')
      .removeClass('hidden-md hidden-lg')
    /* 调整右侧内容 */
    $('.aside3')
      .removeClass('col-md-13 col-lg-13')
      .addClass('col-md-13 col-lg-13');
    /* 调整文字内容格式 */
    $('.aside3-content')
      .removeClass('col-md-10 col-lg-8 col-md-offset-1 col-lg-offset-2')
      .addClass('col-md-13');
  } else {
    /* 隐藏左侧aside */
    $('.aside')
      .removeClass('visible-md visible-lg')
      .addClass('hidden-md hidden-lg');
    /* 右侧内容最大化 */
    $('.aside3')
      .removeClass('col-md-13 col-lg-13')
      .addClass('col-md-13 col-lg-13');
    /* 修改文字排版 */
    $('.aside3-content')
      .removeClass('col-md-13')
      .addClass('col-md-10 col-lg-8 col-md-offset-1 col-lg-offset-2'); 
  }  /*col-md-offset-1 col-lg-offset-2*/
}
/* 控制文章章节列表按钮 */
function content_click(is_show){
  if (is_show) {
    $('#content_table').show();
    $('#content_btn i').removeClass('fa-plus').addClass('fa-minus');
  } else {
    $('#content_table').hide();
    $('#content_btn i').removeClass('fa-minus').addClass('fa-plus');
  }
}


$('#container').load = $(document).ready(function() {
  /* 控制左侧 aside 的动作 */
  $("#nav_btn").on('click', function() {
    isClicked = $(this).data('clicked');

    nav_click(isClicked);

    $(this).data('clicked', !isClicked);
  
  });

  $("#content_btn").on('click', function(){
    isClicked = $(this).data('clicked');

    content_click(!isClicked);

    $(this).data('clicked',!isClicked);

  });
  	picWarp();

	contentEffects();
	
	$(document).pjax('.pjaxlink', '#pjax', { fragment: "#pjax", timeout: 10000 });
	  
	$(document).on("pjax:complete", function(){
	    if($("body").find('.container').width() < 992){
			$('#nav_btn').click();
	    }
		$('.aside3').scrollTop(0);
		picWarp();
		contentEffects();
		pajx_loadDuodsuo();
	});
});




// 动态加载多说评论框的方法（pjax使用后会失效），需要回调重新绑定。
function pajx_loadDuodsuo(){ 
	var dus=$(".ds-thread"); 
	if($(dus).length==1){
		 var el = document.createElement('div');
		 el.setAttribute('data-thread-key',$(dus).attr("data-thread-key"));//必选参数
		 el.setAttribute('data-url',$(dus).attr("data-url"));
		 el.setAttribute('data-title',$(dus).attr("data-title"));
		 DUOSHUO.EmbedThread(el);
		 $(dus).replaceWith(el);
	} 
}


//渲染发表的帖子
function contentEffects(){
  //remove the asidebar
  $('.row-offcanvas').removeClass('active');
  if($("#nav").length > 0){
    $("#content > h2,#content > h3,#content > h4,#content > h5,#content > h6").each(function(i) {
        var current = $(this);
        current.attr("id", "title" + i);
        tag = current.prop('tagName').substr(-1);
        $("#nav").append("<div style='margin-left:"+15*(tag-1)+"px'><a id='link" + i + "' href='#title" +i + "'>" + current.html() + "</a></div>");
    }); 
    $("pre").addClass("prettyprint");
    prettyPrint(); 
    $('#content img').addClass('img-thumbnail').parent('p')//.addClass('center');
    $('#content_btn').show();
  }else{
    $('#content_btn').hide();
  }
}


//包装img标签 使用lightBox,这里要使用当 图片加载完成后运行
function picWarp(){
	$('#content img').on("load",function(){
		if( $(this).height()>500){
			$(this).height(300);
		}
		$(this).wrap("<a title='"+$(this).attr('alt')+"' href='"+$(this).attr('src')+"'></a>").parent().lightBox();
	});
}

