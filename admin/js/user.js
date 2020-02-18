//入口函数
$(function () {
    //一进到页面就发送ajax请求获取对应信息;填入对应的标签中;
    $.ajax({
        type: 'get',
        url: window.BigNew.user_detail,
        success: function (backData) {
            // console.log(backData);
            if (backData.code == 200) {
                // $('input.username').val(backData.data.username);
                // $('input.nickname').val(backData.data.nickname);
                // $('input.email').val(backData.data.email);
                // $('input.password').val(backData.data.password);

                //循环
                for (var key in backData.data) {
                    $('input.' + key).val(backData.data[key]);
                }

                $('img.user_pic').attr('src', backData.data.userPic);
            }
        }
    });

    //个人中心信息修改:图片预览;
    $('#exampleInputFile').on('change', function () {
        //1.获取选中的文件;
        var file1 = this.files[0];
        //2.把获取到的图片创建一个url;
        var url = URL.createObjectURL(file1);
        //3.把这个url赋值给预览的那个img标签的src属性;
        $('img.user_pic').attr('src', url);
    })

    //完成个人中心修改;
    //1.给修改按钮设置点击事件;
    //2.创建一个formData对象;
    //3.发送ajax请求完成修改;
    //4.显示修改后的信息;
    $('button.btn').on('click', function (e) {
        e.preventDefault();

        var form1 = document.querySelector('form');
        var fd = new FormData(form1);

        $.ajax({
            type: 'post',
            url: window.BigNew.user_edit,
            data: fd,
            contentType: false,
            processData: false,
            success: function (backData) {
                console.log(backData);
                if (backData.code == 200) {
                    alert('更新成功');
                    //4.显示修改后的信息;
                    // getAjax();
                    // 第一种:刷新父页面
                    // parent.window.location.reload(); //父页面刷新;

                    // 第二种:重新发送ajax请求
                    $.ajax({
                        type: 'get',
                        url: window.BigNew.user_info,
                        success: function (backData) {
                            //在子页面上获取父页面上的标签,前面加parent;
                            parent.$('.user_info>img').attr('src',
                                backData
                                .data.userPic); //修改用户头像;
                            parent.$('.user_center_link>img').attr(
                                'src',
                                backData.data.userPic); //修改用户头像;
                            parent.$('.user_info>span').html(
                                '欢迎&nbsp;&nbsp;' +
                                backData.data.nickname); //修改用户名;
                        }
                    })
                }
            }
        })
    })
})