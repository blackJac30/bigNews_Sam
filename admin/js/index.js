// 入口函数;
$(function () {
    //一进入页面发送ajax请求获取到用户信息;
    $.ajax({
        type: 'get',
        //这里就是把token令牌带过去的方法:
        // headers: {
        //     'Authorization': localStorage.getItem('token') //这个'token'在登录页面时候已经取得并通过localStorage.setItem的方法存到本地
        // },
        url: window.BigNew.user_info,
        success: function (backData) {
            // console.log(backData);
            $('.user_info>img').attr('src', backData.data.userPic); //修改用户头像;
            $('.user_center_link>img').attr('src', backData.data.userPic); //修改用户头像;
            $('.user_info>span').html('欢迎&nbsp;&nbsp;' + backData.data.nickname); //修改用户名;
        }
    })

    //使用元素js方法;
    //一:进入页面发送ajax请求获取到用户信息;
    //二:原生js发送ajax请求,如何带token过去;
    // var xhr = new XMLHttpRequest();
    // xhr.open('get', 'http://localhost:8080/api/v1/admin/user/info');
    // //把存放在localStorage中的token令牌取出来,通过请求头的方式发送给后端接口;
    // xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
    // xhr.send();
    // xhr.onload = function () {
    //     console.log(xhr.response);
    // }

    //退出:实际上就是删除token;
    $('.logout').on('click', function (e) {
        e.preventDefault();
        //删除token;
        localStorage.removeItem('token');
        //回到登录页;
        window.location.href = './login.html';
    })

    //给左侧导航栏div设置点击事件;当前点击的div添加一个active类,其他的兄弟div移出active类;
    $('.menu>div.level01').on('click', function () {
        $(this).addClass('active').siblings('div').removeClass('active');
        //文章管理div的ul缩放(slideToggle);
        if ($(this).index() == 1) {
            $('ul.level02').stop(true, false).slideToggle();
            //给文章管理这个页签后面的三角加上类
            $(this).find('b').toggleClass('rotate0');

            //默认选中第一个二级菜单;
            $('ul.level02>li:eq(0)').trigger('click')
        }
    })

    //给点击文章管理下的li标签设置点击事件改编字体颜色
    $('.level02>li').on('click', function () {
        $(this).addClass('active').siblings('li').removeClass('active');
    })

})