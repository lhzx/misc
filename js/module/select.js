/**
 * @description: 自定义下拉选择框模块
 * @author: TinTao(284071917@qq.com)
 * @update:
 */
define('module/select', [
    'common/util'
], function(util){



    return {
        /**
         * 初始化表单验证
         */
        init: function (opts) {
            var self = this;
            self.options = opts || {};
            $('.select').each(function(i, n){
                //初始化
                var select = $(n),
                    selData = select.data('selData') || [],
                    selInp = select.find('input[type="hidden"]'),
                    selVal = $.trim(selInp.val()),
                    selTxt = select.find('.sel-text'),
                    selList = select.find('.sel-list a'),
                    defData = [];

                if(selVal.length){
                    if(self.options.multiple) {
                        $.each(selVal.split(','), function(x, y){
                            selList.each(function(j, k){
                                var defTxt = $(k).text(),
                                    defVal = $(k).attr('data-value') || defTxt;
                                if(y == defVal){
                                    defData.push({txt: defTxt, val: defVal});
                                    return false;
                                }
                            });
                        });
                        self.addTag(select, defData);
                    }else{
                        select.find('.sel-list').addClass('hide').find('a').removeClass('selected');
                        selList.each(function(j, k){
                            var defTxt = $(k).text(),
                                defVal = $(k).attr('data-value') || defTxt;
                            if(selVal == defVal){
                                $(k).addClass('selected');
                                selTxt.text(defTxt);
                                return false;
                            }
                        });
                    }
                }
                //绑定事件
                select.hover(function(){
                    $(this).find('.sel-list').removeClass('hide').css('top', $(this).outerHeight()-2);
                }, function(){
                    $(this).find('.sel-list').addClass('hide');
                });
                selList.on('click', function(e){
                    e.preventDefault();
                    selData = select.data('selData') || [];
                    var $this = $(this),
                        txt = $this.attr('data-text') || $this.text(),
                        val = $this.attr('data-value') || txt;

                    if($this.attr('data-value') == ''){
                        return;
                    }
                    if(self.options.multiple) {
                        if($.inArray(val, selData) == -1) {
                            self.addTag(select, [{txt: txt, val: val}]);
                        }
                    }else{
                        $this.parent().addClass('hide').find('a').removeClass('selected');
                        $this.addClass('selected');
                        selInp.val(val);
                        selTxt.text(txt);
                    }
                });
            })
        },
        /**
         * 添加标签
         */
        addTag: function(select, data){
            var self = this,
                selData = select.data('selData') || [],
                selInp = select.find('input[type="hidden"]'),
                selTxt = select.find('.sel-text'),
                selTag = select.find('.sel-tags'),
                tagsTpl = [
                    '<span class="sel-tags" data-value="#{val}">',
                        '<span class="sel-tag">#{tag}</span>',
                        '<a href="javascript:">×</a>',
                    '</span>'
                ].join(''),
                tag = [],
                tagItem = null;
            $.each(data, function(i, n){
                tag.push(util.template(tagsTpl, {
                    tag: n.txt,
                    val: n.val
                }));
                selData.push(n.val);
            });
            if (selTag.length) {
                selTxt.append(tag.join(''));
            } else {
                selTxt.html(tag.join(''));
            }
            select.data('selData', selData);
            selInp.val(selData.join(','));
            self.bindDeleteTag(select.find('.sel-tags'));
        },
        /**
         * 删除标签
         */
        bindDeleteTag: function(tag){
            var self = this;
            tag.find('a').off('click').on('click', function(e){
                e.preventDefault();
                var $this = $(this),
                    newSelData = [],
                    tagSelf = $this.closest('.sel-tags'),
                    val = $this.closest('.sel-tags').attr('data-value'),
                    select = $this.closest('.select'),
                    selData = select.data('selData'),
                    selInp = select.find('input[type="hidden"]'),
                    selTxt = select.find('.sel-text'),
                    selDef = selTxt.attr('data-default');
                //console.log(selData);
                $.each(selData, function(i, n){
                    if(n != val){
                        newSelData.push(n);
                    }
                });
                select.data('selData', newSelData);
                //console.log(select.data('selData'), newSelData);
                selInp.val(newSelData.join(','));
                if(!newSelData.length || select.find('.sel-tags').length == 1){
                    selTxt.html(selDef);
                    select.data('selData', []);
                }
                tagSelf.remove();
            });
        }
    }
});
