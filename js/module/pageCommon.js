/**
 * @description: 页面交互公用模块
 * @author: TinTao(284071917@qq.com)
 * @update:
 */
define('module/pageCommon', [
    'common/interface',
    'common/util',
    'module/cookie'
], function(inter, util, cookie){

    return {
        /**
         * 头部menu交互效果
         */
        initMenu: function(){
            var menu = $('#header').find('li'),
                ps = menu.index($('#header').find('.current'));

            menu.hover(function(){
                var $this = $(this);
                menu.removeClass('current');
                $this.find('.menu-more').removeClass('hide').css({
                    height: 0,
                    opacity: 0
                }).stop().animate({
                    height: 42,
                    opacity: 1
                }, 200, function () {
                    $(this).removeClass('hide');
                });
            }, function(){
                var $this = $(this);
                $this.find('.menu-more').stop().animate({
                    height: 0,
                    opacity: 0
                }, 100, function () {
                    $(this).addClass('hide');
                });
                menu.eq(ps).addClass('current');
            });

            /*判断用户是否登录*/
            var user = cookie.get('web_session_userid');

            if(user){
                menu.css('display','block');
                $('#login-menu').css('display','none');
            }
            else{
                $('#app-download-menu').css('display','block');
                $('#login-menu').css('display','block');
            }
        }
    };
});