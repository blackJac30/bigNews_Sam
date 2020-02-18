//入口函数;
$(function () {
    $('.input_sub').on('click', function (e) {

        //阻止跳转;
        e.preventDefault();

        var userName = $('.input_txt').val().trim(); //账号;
        var password = $('.input_pass').val().trim(); //密码;

        //非空判断;
        if (userName == "" || password == "") {
            $('#myModal').modal();
            $('.modal-body').text('账号密码不能为空');
        }
        //发送ajax请求;
        $.ajax({
            type: 'post',
            url: window.BigNew.user_login,
            data: {
                username: userName,
                password: password
            },
            success: function (backData) {
                console.log(backData);
                if (backData.code == 200) {
                    $('#myModal').modal();
                    $('.modal-body').text(backData.msg);
                    $('#myModal').on('hidden.bs.modal', function (e) { //1.hidden方法调用之后立即触发 {内} 的事件;
                        //把服务器返回的Token令牌保存起来;
                        localStorage.setItem('token', backData.token)
                        //登录成功跳转首页;
                        window.location.href = './index.html'
                    })
                } else {
                    $('#myModal').modal();
                    $('.modal-body').text(backData.msg);
                }
            }
        })
    })
})