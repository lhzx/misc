'use strict';
/*jslint browser: true*/
/*global define, $, jQuery*/
/**
 * @description: 弹出框js
 * @author: duyutao(452661976@qq.com)
 * @update:
 */
define('module/dialogPop', [
    'common/util',
    'common/interface'
], function (util, inter) {
    return {
        /**
         * 根据不同类型获取不同数据以及根据级别加载不同层级的列表
         * type: 要获取的数据类型， level: 有几级点击操作
         **/
        initOpts: function (options) {
            var defaults = {
                target: null,
                type: 0,
                level: 'first',
                limit: 0,
                target1: null,
                target2: null
            };
            this.opts = $.extend(defaults, {}, options);
        },
        dataFetch: function (target, data, level) {
            var $this = target;
            switch (level) {
            case 'second':
                $this.find('.first-chosen').off('click').on('click', '.firstItem', function () {
                    var thisArr = [],
                        firstId = $(this).data('id');
                    $.each(data[firstId].children, function (i, n) {
                        var secondItem = util.template('<li><a class="secondItem" data-id=#{id} title=#{name} href="javascript:;">#{name}</a></li>', {
                            id: n.id,
                            name: n.name
                        });
                        thisArr.push(secondItem);
                    });
                    $this.find('#secondName').text($(this).text());
                    $this.find('.list-second').removeClass('hide').siblings('.list-first, .search-result').addClass('hide');
                    $this.find('.second-chosen').empty().append(thisArr.join(''));
                    $.each($this.find('.tab-chosen').find('.itemSelected'), function () {
                        $this.find('.second-chosen').find('[data-id=' + $(this).data('id') + ']').addClass('active');
                    });
                });
                break;
            case 'third':
                var firstId = '';
                $this.find('.first-chosen').off('click').on('click', '.firstItem', function () {
                    var firstArr = [],
                        secondItem = '',
                        i = '';
                    firstId = $(this).data('id');
                    for (i in data[firstId]) {
                        if (typeof (data[firstId][i]) === 'object') {
                            secondItem = util.template('<li><a class="secondItem" data-id=#{id} title=#{name} href="javascript:;">#{name}</a></li>', {
                                id: data[firstId][i].id,
                                name: data[firstId][i].name
                            });
                            firstArr.push(secondItem);
                        }
                    }
                    $this.find('#secondName').text($(this).text());
                    $this.find('.list-second').removeClass('hide').siblings('.list-first, .list-third, .search-result').addClass('hide');
                    $this.find('.second-chosen').empty().append(firstArr.join(''));
                });
                $this.find('.second-chosen').off('click').on('click', '.secondItem', function () {
                    var secArr = [],
                        secId = $(this).data('id');
                    $.each(data[firstId][secId].children, function (i, n) {
                        var thirdItem = util.template('<li><a class="thirdItem" data-id=#{id} title=#{name} href="javascript:;">#{name}</a></li>', {
                            id: n.id,
                            name: n.name
                        });
                        secArr.push(thirdItem);
                    });
                    $this.find('#thirdName').text($(this).text());
                    $this.find('.list-third').removeClass('hide').siblings('.list-first, .list-second, .search-result').addClass('hide');
                    $this.find('.third-chosen').empty().append(secArr.join(''));
                });
                break;
            }
        },
        /**
         *弹出框打开时发送请求获取数据以及后续操作的初始化函数
         * target:需要弹出的窗口对象，type: 要获取的数据类型， level: 有几级点击操作,  limit: 最高可选几项
         **/
        dialogInit: function (options) {
            this.initOpts(options);
            var self = this,
                $this = self.opts.target;
            $.ajax({
                url: inter.getApiUrl().condiSelParent,
                data: {
                    type: self.opts.type
                },
                success: function (data) {
                    self.dataFetch(self.opts.target, data, self.opts.level);
                },
                error: function () {
                    $this.find('.error-message').html('服务器正忙， 请稍后重试。');
                },
                type: 'POST'
            });
            //用于选择过后的显示
            $this.find('.cityReturn').trigger('click');
            $this.find('.tag-info').find('strong').text(self.opts.limit);
            $this.find('.' + self.opts.level + '-chosen, #hotCity, .dialoag-search').off('click').on('click', '.' + self.opts.level + 'Item', function () {
                if (!$(this).hasClass('active')) {
                    if ($this.find('.tab-chosen').find('.itemSelected').length < self.opts.limit) {
                        var txt = $(this).text().split('-'),
                            tabTags = util.template('<span data-id=#{id} class="itemSelected">#{name}<i class="fa fa-times"></i></span>', {
                                id: $(this).data('id'),
                                name: txt[txt.length - 1]
                            });
                        $this.find('.tab-chosen').append(tabTags);
                        $this.find('.' + self.opts.level + '-chosen, #hotCity, .dialoag-search').find('[data-id=' + $(this).data('id') + ']').addClass('active');
                    } else {
                        $this.find('.error-message').removeClass('flipOutX').addClass('flipInX').html('最多只能选择' + self.opts.limit + '项');
                    }
                } else {
                    $this.find('.' + self.opts.level + '-chosen, #hotCity, .dialoag-search').find('[data-id=' + $(this).data('id') + ']').removeClass('active');
                    $this.find('.tab-chosen').find('[data-id=' + $(this).data('id') + ']').remove();
                }
            });
            //选中项移除操作
            $this.find('.tab-chosen').off('click').on('click', '.fa-times', function () {
                var id = $(this).parent().data('id');
                $this.find('.tab-chosen').find('[data-id=' + id + ']').remove();
                $this.find('.second-chosen, .third-chosen, #hotCity, .dialoag-search').find('[data-id=' + id + ']').removeClass('active');
                $this.find('.error-message').removeClass('flipInX').addClass('flipOutX');
            });
            //返回以及清空按钮操作
            $this.find('.cityReturn').on('click', function (e) {
                e.preventDefault();
                $this.find('[name=keywordDialog]').val('');
                switch (self.opts.level) {
                case 'second':
                    $('.search-result, .list-second').addClass('hide').siblings('.list-first').removeClass('hide');
                    break;
                case 'third':
                    if ($(this).attr('id') === 'thirdReturn') {
                        $('.search-result, .list-third, .list-first').addClass('hide').siblings('.list-second').removeClass('hide');
                    } else {
                        $('.search-result, .list-second, .list-third').addClass('hide').siblings('.list-first').removeClass('hide');
                    }
                    break;
                }
            });
            //搜索框操作
            $this.find('#searchFormDialog').off('submit').on('submit', function () {
                $.ajax({
                    url: inter.getApiUrl().condiSelSearch,
                    data: {
                        keyword: $this.find('[name=keywordDialog]').val(),
                        type: self.opts.type
                    },
                    type: 'POST',
                    success: function (data) {
                        var thisArr = [];
                        $.each(data, function (i, n) {
                            var thisItem = util.template('<li><a class=#{level} data-id=#{id} title=#{name} href="javascript:;">#{name}</a></li>', {
                                level: self.opts.level + 'Item',
                                id: n.id,
                                name: n.parent.name + '-' + n.name
                            });
                            thisArr.push(thisItem);
                        });
                        $this.find('.search-result').closest('li').removeClass('hide').siblings('.list-first, .list-second, .list-third').addClass('hide');
                        $this.find('.search-result').find('ul').empty().append(thisArr.join(''));
                    },
                    error: function () {
                        $this.find('.error-message').html('服务器正忙， 请稍后重试。');
                    },
                });
            });
        },
        /**
         *提交按钮绑定事件
         **/
        fnSubmit: function (options) {
            this.initOpts(options);
            var self = this,
                $this = self.opts.target,
                thisStr = '',
                thisKey = '';
            $this.find('.error-message').html('');
            $this.find('.tab-chosen').find('span').each(function () {
                thisStr = thisStr + $(this).text() + ',';
                thisKey = thisKey + $(this).data('id') + ',';
            });
            thisStr = thisStr.substring(0, thisStr.length - 1);
            thisKey = thisKey.substring(0, thisKey.length - 1);
            if (typeof(self.opts.target1) !== 'undefined') {
                self.opts.target1.val(thisStr);
            }
            if (typeof(self.opts.target2) !== 'undefined') {
                self.opts.target2.val(thisKey);
            }
        }
    };
});
