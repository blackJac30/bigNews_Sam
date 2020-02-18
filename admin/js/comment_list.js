// 入口函数;
$(function () {
    var myPage = 1;

    function getComments(myPage, callback) {
        $.ajax({
            type: 'get',
            url: window.BigNew.comment_list,
            data: {
                page: myPage,
                perpage: 10
            },
            success: function (backData) {
                // console.log(backData);
                if (backData.code == 200) {
                    var res = template('comments_temp', backData);
                    $('tbody').html(res);

                    // 如果有回调函数就执行;
                    if (callback != null && backData.data.data.length != 0) {
                        callback(backData);
                    } else if (backData.data.data.length == 0 && backData.data.totalPage == myPage - 1) {
                        // 如果进到这里来证明删除的是最后一页的最后一条数据;
                        myPage -= 1;

                        // 第一个参数就是事件名;
                        // 第二个参数就是改变后的总页码;
                        // 第三个参数就是当前显示的页码;
                        $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage, myPage);
                    }
                }
            }
        });
    };

    // 一进入后台评论页面获取所有评论;
    getComments(1, function (backData) {
        // 分页插件;
        $('#pagination').twbsPagination({
            first: "首页",
            prev: "上一页",
            next: "下一页",
            last: "尾页",
            totalPages: backData.data.totalPage, //总页数;
            visiblePages: 7, //可见页数;
            onPageClick: function (event, page) {
                myPage = page;
                // 点击后做的事情;
                getComments(page, null)
            }
        });
    });

    // 批准;
    $('tbody').on('click', '.btn-pizhun', function () {
        var commentId = $(this).attr('data-id');
        // console.log(commentId);

        $.ajax({
            type: 'post',
            url: window.BigNew.comment_pass,
            data: {
                id: commentId
            },
            success: function (backData) {
                // console.log(backData);
                if (backData.code == 200) {
                    alert(backData.msg);
                    // 批准还是显示当前页
                    getComments(myPage, null);
                }
            }
        })
    });

    // 拒绝;
    $('tbody').on('click', '.btn-jujue', function () {
        var commentId = $(this).attr('data-id');

        $.ajax({
            type: 'post',
            url: window.BigNew.comment_reject,
            data: {
                id: commentId
            },
            success: function (backData) {
                console.log(backData);
                if (backData.code == 200) {
                    alert(backData.msg);
                    getComments(myPage, null);
                }
            }
        })
    });

    // 删除;
    $('tbody').on('click', '.btn-delete', function () {
        var commentId = $(this).attr('data-id');

        $.ajax({
            type: 'post',
            url: window.BigNew.comment_delete,
            data: {
                id: commentId
            },
            success: function (backData) {
                if (confirm('确定删除吗?') && backData.code == 200) {
                    alert(backData.msg);
                    getComments(myPage, function (backData) {
                        $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage, myPage)
                    });
                }
            }
        })
    });
})