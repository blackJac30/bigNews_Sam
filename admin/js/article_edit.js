 // 入口函数;
 $(function () {
     // 准备编辑页面该有的元素(日期插件,富文本编辑器,文章类别下拉菜单,图片预览);
     // 日期插件;
     jeDate("#testico", {
         format: "YYYY-MM-DD",
         isTime: false,
         minDate: "2014-09-19 00:00:00",
         zIndex: 20999999 // 日期插件弹出层级;
     })

     // 调用编辑器方法显示编辑器到页面;
     var E = window.wangEditor
     var editor = new E('#editor')
     // 或者 var editor = new E( document.getElementById('editor') )
     editor.create()

     // 发送ajax请求,获取所有的文章类别,通过模板引擎渲染到 下拉菜单 里;
     $.ajax({
         type: 'get',
         url: window.BigNew.category_list,
         success: function (backData) {
             // console.log(backData);
             if (backData.code == 200) {
                 //使用模板引擎渲染到下拉菜单中;
                 var res = template('category_temp', backData);
                 $('.category').html(res);
             }
         }
     });

     // 图片预览;
     $('#inputCover').on('change', function () {
         var file = this.files[0];
         var url = URL.createObjectURL(file);
         $('.article_cover').attr('src', url);
     })

     // 编辑第一步: 根据id发送ajax请求获取文章内容并渲染到页面上;
     // 把页面数据已对象形式保存;
     var allData = {
         // 获取当前页面id;
         id: window.location.search.split('=')[1], // id;
         title: $('#inputTitle'), // 文章标题;
         // cover: $('.article_cover'), // 文章封面;
         categoryId: $('.category'), // 文章分类;
         date: $('#testico'), // 日期时间;
         // content: $('#data_content') // 文章内容;
     }
     // console.log(allData);
     setTimeout(function () {
         $.ajax({
             type: 'get',
             url: window.BigNew.article_search,
             data: {
                 id: allData.id
             },
             success: function (backData) {
                 // console.log(backData);

                 // 把获取到的数据加载到页面上;
                 for (var key in allData) {
                     // console.log(key);
                     $(allData[key]).val(backData.data[key]);
                 }
                 $('.article_cover').attr('src', backData.data.cover); // 文章封面;
                 editor.txt.html(backData.data.content) // 文章内容;

                 // $('.title').val(backData.data.title); // 文章标题;
                 // $('.category').val(backData.data.categoryId); // 文章分类;
                 // $('#testico').val(backData.data.date); // 日期时间;
             }
         });
     }, 100);

     // 封装ajax发送请求;
     function alterData(state) {
         var form1 = document.querySelector('form');
         var fd1 = new FormData(form1);
         // 往FormData对象中追加文章id,修改后的内容,state值(已发布/草稿);
         fd1.append('id', allData.id); // 追加id
         fd1.append('content', editor.txt.html()); // 追加内容;
         fd1.append('state', state); // 追加内容;
         $.ajax({
             type: 'post',
             url: window.BigNew.article_edit,
             data: fd1,
             contentType: false,
             processData: false,
             success: function (backData) {
                 console.log(backData);
                 if (backData.code == 200) {
                     alert('修改成功' + state);
                     window.history.back(); // 历史回退;
                     console.log(window.location.href);
                 }
             }
         })
     }
     // 编辑第二步: (已发布)
     $('.btn-edit').on('click', function (e) {
         e.preventDefault();
         alterData('已发布');
     });

     // 修改为草稿;
     $('.btn-draft').on('click', function (e) {
         e.preventDefault();
         alterData('草稿');
     })
 })