//入口函数;
$(function () {
    //一.已进入页面发送ajax请求,获取所以文章类别;
    function getData() {
        $.ajax({
            type: 'get',
            url: window.BigNew.category_list,
            success: function (backData) {
                console.log(backData);
                if (backData.code == 200) {
                    //使用模板引擎渲染到页面;
                    var res = template('acticle_cate_temp', backData);
                    $('tbody').html(res)
                }
            }
        });
    };
    getData();

    // 第三天: 设置 新增/编辑 事件;
    //二.引入bootStrap事件;
    //Bootstrap显示事件(官语:Bootstrap 的模态框类提供了一些事件用于监听并执行你自己的代码);
    $('#myModal').on('show.bs.modal', function (e) { //1.show 方法调用之后立即触发 {内} 的事件;
        console.log(e.relatedTarget); //2. e.relatedTarget则是获取到了触发这个模态框的按钮(dom元素);

        // 通过e.relatedTarget获取到的dom元素进行判断是否是 "新增分类" 这个按钮触发的;
        // 从而更改不同内容的模态框;
        if (e.relatedTarget == $('#xinzengfenlei')[0]) {
            $('#myModalLabel').text('新增分类');
            $('#btnAdd').text('新增').addClass('btn-primary').removeClass('btn-success');
        } else {
            $('#myModalLabel').text('编辑分类');
            $('#btnAdd').text('编辑').addClass('btn-success').removeClass('btn-primary');

            //编辑的第一步:把需要编辑的当前这一行的内容信息显示到模态框上;
            $('#recipient-name').val($(e.relatedTarget).parent().prev().prev().text().trim());
            $('#message-text').val($(e.relatedTarget).parent().prev().text().trim());
            $('#categoryID').val($(e.relatedTarget).attr('data-id'));
        }
    });

    //三.给模态框中的新增/编辑按钮设置点击事件;
    $('#btnAdd').on('click', function () {
        if ($(this).hasClass('btn-primary')) {
            var recipientName = $('#recipient-name').val().trim();
            var messageText = $('#message-text').val().trim();
            $.ajax({
                type: 'post',
                url: window.BigNew.category_add,
                data: {
                    name: recipientName,
                    slug: messageText
                },
                success: function (backData) {
                    if (backData.code == 201) {
                        console.log(backData);
                        //新增成功隐藏模态框;
                        $('#myModal').modal('hide');
                        getData();
                        //清空输入框;
                        $('#recipient-name').val("");
                        $('#message-text').val("");
                    }
                }
            })
        } else {
            // 编辑的第二步:把新获取到的内容发送ajax请求修改;
            // var id = $('#categoryID').val().trim();
            // var recipientName = $('#recipient-name').val().trim();
            // var messageText = $('#message-text').val().trim();

            //jQuery中的serialize()方法;(这个方法也可以把form表单中带有name属性的标签的值全部取到);
            var data = $('#myModal form').serialize();

            //发送ajax请求完成编辑;
            $.ajax({
                type: 'post',
                url: window.BigNew.category_edit,
                // data: {
                //     id: id,
                //     name: recipientName,
                //     slug: messageText
                // },
                // 传参使用jQuery的serialize()方法;
                data: data,
                success: function (backData) {
                    console.log(backData);
                    if (backData.code == 200) {
                        //隐藏模态框;
                        $('#myModal').modal('hide');
                        // 从新发送ajax请求获取一下内容显示到页面上;
                        getData();
                    }
                }
            })
        }
    });

    //四:给模态框取消按钮设置点击事件清空文本内容;
    $('.btn_cancle').on('click', function () {
        // 第一种方法:清空输入框文本;
        // $('#recipient-name').val("");
        // $('#message-text').val("");

        // 第二种方法:form表单的reset()方法(reset() 方法可把表单中的元素重置为它们的默认值);
        $('#myModal form')[0].reset(); //dom对象调用reset()方法;
    });

    //五:给删除按钮设置点击事件(委托注册);
    $('tbody').on('click', '.btn_del', function () {
        var that = this;
        if (confirm('确定删除吗?')) {
            var id = $(this).attr('data-id');

            $.ajax({
                type: 'post',
                url: window.BigNew.category_delete,
                data: {
                    id: id
                },
                success: function (backData) {
                    if (backData.code == 204) {
                        // 第一种:删除成功重新加载数据;
                        // getData();
                        // 第二种:直接把当前行删除;
                        $(that).parent().parent().remove();
                    }
                }
            })
        }
    })
});