'use strict';
/*jslint browser: true*/
/*global define, $, jQuery*/
/**
 * @description: 根据上级下拉框选项返回次级下拉框结果
 * @author: fangyuan(43726695@qq.com)
 * @update:
 */
define('module/tabMenu', [
    'common/interface',
    'common/util',
    'common/errCode'
], function (inter, util, err) {
    return {
        /**
         *初始化选项
         **/
        initTab: function (options) {
            var defaults = {
                target: '',
                url: '',
                tabId: 'newTab',
                midId: '',
                tabName: '新标签页',
                reload: false,
                dataTab: '',
                parentId: ''
            };
            this.opts = $.extend(defaults, {}, options);
        },
        /**
         *添加新Tab
         **/
        addTab: function (opts, call) {
            var self = this;
            self.initTab(opts);
            var tabTpl = [
                    '<li>',
                    '<a href="#tabsContent-#{midId}#{id}" data-tab="#{dataTab}" data-parentid="#{parentId}" title="#{name}" id="newTabs-#{midId}#{id}">#{name}</a>',
                    '<i class="ace-icon fa fa-times"></i>',
                    '</li>'
                ].join(''),
                contentTpl = '<div id="tabsContent-#{midId}#{id}" class="div-tabs div-tabs-full"></div>',
                loadingTpl = '<div class="loadingCandi">数据加载中 <i class="ace-icon fa fa-spinner fa-pulse"></i></div>',
                tabNew = util.template(tabTpl, {
                    id: self.opts.tabId,
                    midId: self.opts.midId,
                    name: self.opts.tabName,
                    dataTab: self.opts.dataTab,
                    parentId: self.opts.parentId
                }),
                contentNew = util.template(contentTpl, {
                    id: self.opts.tabId,
                    midId: self.opts.midId,
                    name: self.opts.tabName
                }),
                first = true;
            if (!$('#newTabs-' + self.opts.midId + self.opts.tabId).length) {
                self.opts.target.append(tabNew).parent().tabs('refresh');
                self.opts.target.parent().append(contentNew);
                $('#newTabs-' + self.opts.midId + opts.tabId).on('click', function () {
                    if (!self.opts.target.find('.loadingCandi').length && !$('#tabsContent-' + self.opts.midId + self.opts.tabId).children().length) {
                        $('#tabsContent-' + self.opts.midId + self.opts.tabId).html(loadingTpl);
                    }
                    if (!self.opts.reload && first) {
                        $('#tabsContent-' + self.opts.midId + self.opts.tabId).load(util.strFormat(opts.url, [self.opts.tabId]), call);
                        first = false;
                        return;
                    } else {
                        if (self.opts.reload) {
                            $('#tabsContent-' + self.opts.midId + self.opts.tabId).load(util.strFormat(opts.url, [self.opts.tabId]), call);
                        }
                    }
                }).trigger('click');
                //为新增的 tab增加删除事件
                $('#newTabs-' + self.opts.midId + self.opts.tabId).parent().on('click','.fa-times',function(e){
                    var _this = $(e.target).siblings('a'),
                        id = _this.attr('id').substr(8),
                        tab = _this.data('tab'),
                        parentId = _this.data('parentid');
                    self.removeTab({
                        tabId: id,
                        target: self.opts.target ,
                        dataTab: tab,
                        parentId:parentId
                    });
                });
            } else {
                self.reloadTab(opts, call);
                $('#newTabs-' + self.opts.midId + self.opts.tabId).trigger('click');
            }

        },
        /**
         *删除Tab以及其id的content并且返回到第一个相同dataTab的标签
         **/
        removeTab: function (opts) {
            var self = this;
            self.initTab(opts);
            if ($('#newTabs-' + self.opts.midId + self.opts.tabId).length) {
                $('#newTabs-' + self.opts.midId + self.opts.tabId).closest('li').remove().parent().tabs('refresh');
                $('#tabsContent-' + self.opts.midId + self.opts.tabId).off('click').remove();
                if (self.opts.parentId.length) {
                    $('#newTabs-' + self.opts.parentId).trigger('click');
                } else {
                    $(self.opts.target).find('[data-tab=' + self.opts.dataTab + ']').eq(0).trigger('click');
                }
            }
        },
        /**
         *根据当前ID重新发送请求并加载不同的内容
         **/
        reloadTab: function (opts, call) {
            var self = this;
            self.initTab(opts);
            $('#tabsContent-' + self.opts.midId + self.opts.tabId).empty().load(util.strFormat(opts.url, [self.opts.tabId]), call);
        }
    };
});
