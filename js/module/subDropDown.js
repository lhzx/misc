/**
 * @description: 根据上级下拉框选项返回次级下拉框结果
 * @author: fangyuan(43726695@qq.com)
 * @update:
 */
define('module/subDropDown', [], function(){

    return {
        /**
         * 读取下级下拉框菜单
         */
        getMenu: function (source, subDropdown, url, call){
            var parentId = $(source).children('option:selected').val();
            $.post(url,{key:parentId},function(data,status){
                if(data=="timeout"){
                    $(this).html("操作超时，请重新登录");
                    alert("操作超时，请重新登录");
                    window.location.href="/admin";
                }
                var objectData = eval(data);
                var dropdowns = objectData.data;
                subDropdown.empty();
                var option = '<option value="">请选择</option>';
                subDropdown.append(option);
                for(var i=0;i<dropdowns.length;i++){
                    if(dropdowns[i].key==call){    
                        option = '<option selected="selected" value='+dropdowns[i].key+'>'+dropdowns[i].value+'</option>';
                    }
                    else{
                        option = '<option value='+dropdowns[i].key+'>'+dropdowns[i].value+'</option>';
                    }
                    subDropdown.append(option);
                }
            });
        }
    };
});
