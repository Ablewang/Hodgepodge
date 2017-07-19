$(function () {
    var tag = $("body").find(".tag");
    tag.mouseenter(function () {
        $(this).children(".span-shut").fadeIn(100);
    })
    tag.mouseleave(function () {
        $(this).children(".span-shut").fadeOut(100);
    })
})

$(document).ready(function () {
    var icon = $(".icon");
    /* 绑定鼠标左键按住事件 */
    icon.bind("mousedown", function (event) {
        var oneself = $(this);
        var FF = oneself.parents(".tag");
        /* 获取需要拖动节点的坐标 */
        //var offset_x = this.offsetLeft;//x坐标
        //var offset_y = this.offsetTop;//y坐标
        var offset_x = FF.position().left;//x坐标
        var offset_y = FF.position().top//y坐标
        /* 获取当前鼠标的坐标 */
        var mouse_x = event.pageX;
        var mouse_y = event.pageY;
        /* 绑定拖动事件 */
        /* 由于拖动时，可能鼠标会移出元素，所以应该使用全局（document）元素 */
        $(document).bind("mousemove", "oneself", function (ev) {
            /* 计算鼠标移动了的位置 */
            var _x = ev.pageX - mouse_x;
            var _y = ev.pageY - mouse_y;
            /* 设置移动后的元素坐标 */
            var now_x = (offset_x + _x) + "px";
            var now_y = (offset_y + _y) + "px";
            /* 改变目标元素的位置 */
            oneself.parent().css({
                top: now_y,
                left: now_x
            });
        });
    });
    /* 当鼠标左键松开，接触事件绑定 */
    $(document).bind("mouseup", function () {
        $(this).unbind("mousemove");
    });
})


//编辑
$(function () {
    //获取class为caname的元素 
    $(".Modify").dblclick(function () {
        var modify = $(this);
        var txt = modify.text();
        var input = $("<input class='modify-inp' type='text'value='" + txt + "'/>");
        modify.html(input);
        input.click(function () { return false; });
        //获取焦点 
        input.trigger("focus");
        //文本框失去焦点后提交内容，重新变为文本 
        input.blur(function () {
            var newtxt = $(this).val();
            //判断文本有没有修改 
            if (newtxt != txt) {
                modify.html(newtxt);
                /* 
                *不需要使用数据库的这段可以不需要 
                var caid = $.trim(modify.prev().text());
                //ajax异步更改数据库,加参数date是解决缓存问题 
                var url = "../common/Handler2.ashx?caname=" + newtxt + "&caid=" + caid + "&date=" + new Date(); 
                //使用get()方法打开一个一般处理程序，data接受返回的参数（在一般处理程序中返回参数的方法 context.Response.Write("要返回的参数");） 
                //数据库的修改就在一般处理程序中完成 
                $.get(url, function(data) { 
                if(data=="1") 
                { 
                alert("该类别已存在！"); 
                modify.html(txt);
                return; 
                } 
                alert(data); 
                modify.html(newtxt);
                }); 
                */
            }
            else {
                modify.html(newtxt);
            }
        });
    });
});