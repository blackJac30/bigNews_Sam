// 第三天:制作文章列表页面;
//入口函数;
$(function () {
    //一: 发送ajax请求,获取所有的文章类别,通过模板引擎渲染到 下拉菜单 里;
    $.ajax({
        type: 'get',
        url: window.BigNew.category_list,
        success: function (backData) {
            // console.log(backData);
            if (backData.code == 200) {
                //使用模板引擎渲染到下拉菜单中;
                var res = template('category_temp', backData);
                $('#selCategory').html(res);
            }
        }
    });

    //二: 一进到页面就发送ajax请求获取默认的文章列表,显示在页面上(调用封装的函数发送ajax请求);

    // 声明一个变量myPage,用它来表示当前点击的页面;
    var myPage = 1;
    // 使用封装后的代码:
    getData(1, function (backData) {
        // 额外做的事情(分页插件);
        $('#pagination').twbsPagination({
            first: "首页",
            prev: "上一页",
            next: "下一页",
            last: "尾页",
            totalPages: backData.data.totalPage, // 总页数;
            visiblePages: 7, // 显示页码宽度;
            // 分页插件点击页码方法;
            onPageClick: function (event, page) {
                // page当前点击的页码;
                myPage = page;
                // 继续发送ajax请求,把当前页面显示;
                // 使用封装后的代码:
                getData(page, null) // 额外不做事情null;
            },
            href: true
        });
    })

    // 第四天:制作文章列表页面(分页插件/删除(委托注册)); -----------------------------------------------

    // 给筛选按钮设置点击事件,获取复合要求的文章:
    $('#btnSearch').on('click', function (e) {
        // 阻止跳转;
        e.preventDefault();

        // 使用封装后的代码:
        getData(1, function (backData) {
            // 额外做的事情:
            // 点击筛选按钮,由于更改了条件,筛选出来的数据总数发生更改;
            // 所以根据新的总页数来重新生成分页结构;
            $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage,
                1); //跳转页面;
        })
    });

    // ------------------------------------- <- 第四天 -> -------------------------------------

    // 发送ajax请求,根据条件获取对应的文章列表,封装成一个函数;
    function getData(myPage, callback) { // myPage:当前页; callback:回调函数;
        $.ajax({
            type: 'get',
            url: window.BigNew.article_query,
            data: {
                type: $('#selCategory').val(),
                state: $('#selStatus').val(),
                page: myPage,
                perpage: 6
            },
            success: function (backData) {
                // console.log(backData);
                if (backData.code == 200) {
                    // 通过模板引擎渲染到页面上;
                    // 调用模板引擎的核心方法:
                    var res = template('articleList_temp', backData);
                    $('tbody').html(res);

                    // 额外做的事情;
                    if (backData.data.data.length != 0 && callback != null) {
                        callback(backData); // 额外做的事情需要总页数,所以把backData作为实参传递过去;

                        // 如果请求回来的分类有数据,显示分页;
                        $('#pagination').show();
                        $('#pagination').next().hide();
                    } else if (backData.data.data.length == 0 && myPage == 1) {
                        // 如果分类没有数据就把分页标签隐藏;
                        $('#pagination').hide();
                        $('#pagination').next().show();
                    } else if (backData.data.totalPage == myPage - 1 && backData.data.data
                        .length == 0) {
                        // 删除到最后一条数据,要跳转页面的判断;
                        myPage -= 1;
                        $('#pagination').twbsPagination('changeTotalPages', backData.data
                            .totalPage, myPage);
                    }
                }
            }
        });
    }

    // 删除文章:
    $('tbody').on('click', '.delete', function () {
        if (confirm('你确定要删除吗?')) {
            var articleId = $(this).attr('data-id');
            // 发送ajax请求完成删除;
            $.ajax({
                type: 'post',
                url: window.BigNew.article_delete,
                data: {
                    id: articleId
                },
                success: function (backData) {
                    console.log(backData);
                    if (backData.code == 204) {
                        // 删除数据重新加载(重新发送ajax请求得到新数据);
                        // 调用封装的发送ajax请求的方法:
                        // getData(myPage, callback);
                        getData(myPage, function (backData) {
                            // myPage: 当前页面(如果当前页非 第1页 时,操作删除按钮,发送ajax请求,myPage保留当前页码数据);
                            //         (这样的目的是: 在当前页做删除操作,任保留在当前页上);
                            // callback(回调函数): 
                            $('#pagination').twbsPagination(
                                'changeTotalPages', backData.data
                                .totalPage, myPage);

                            // if (backData.data.totalPage == myPage) {
                            //     $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage, myPage);
                            // }else {
                            //     $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage, myPage - 1);
                            // }
                        })
                    }
                }
            })
        }
    });
})