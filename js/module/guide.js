/**
 * @description: 用户引导
 * @author: TinTao(284071917@qq.com)
 * @update:
 */
define('module/guide', [
    'common/interface',
    'common/util'
], function(inter, util){

    return {
        /**
         * 初始化
         */
        init: function () {
            var self = this,
                tpl = [
                    '<div class="guide">',
                        '<div class="guide-box step">',
                            '<a class="guide-btn" href="javascript:"></a>',
                        '</div>',
                        '<div class="guide-bg"></div>',
                    '</div>'
                ].join(''),
                version = 20150417,
                userVersion = $('#guideVersion').val(),
                guide = $('.guide');

            this.version = version;
            if(version != userVersion) {
                if (!guide.length) {
                    guide = $(tpl);
                    $('body').append(guide);
                }
                if (!$.support.leadingWhitespace) {
                    guide.find('.guide-bg').css('position', 'absolute').height($(document).height());
                }
                guide.find('.guide-btn').on('click', function (e) {
                    e.preventDefault();
                    self.stepNext();
                });
                self.steps = 4;
                self.step = 1;
                self.target = guide;
                self.stepNext();
            }
        },
        /**
         * 更新用户版本记录
         */
        setVersion: function(){
            var self = this;
            util.setAjax(inter.getApiUrl().updateGuideVersionUrl, {
                "type": "WEB_NEW_COMER_GUIDE",
                "version": self.version
            }, function(json){

            }, function(){

            });
        },
        /**
         * 下一步
         */
        stepNext: function(){
            var self = this;

            if(self.step <= self.steps) {
                self.target.find('.step').removeClass('step-' + (self.step - 1)).addClass('step-' + self.step);
                self.step++;
            }else{
                self.target.remove();
                self.step = 1;
                self.setVersion();
            }
        }
    }

});
