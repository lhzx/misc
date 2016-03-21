/**
 * @description: 错误编码表
 * @author: fangyuan(43726695@qq.com)
 * @update:
 */
define('common/errCode', [], function(){

    return {
        /**
         * 根据code获取错误信息
         */
        get: function(code){
            var error = '';
            switch (code){
                case "80001":
                    error = '用户名不存在， 请重新输入。';
                    break;
                case "80002":
                    error = '密码错误, 请重新输入。';
                    break;
                case "80003":
                    error = '用户已被禁用，请联络系统管理员。';
                    break;
            }
            return error;
        }
    };
});