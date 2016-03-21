'use strict';
/*global $, define*/
/**
 * @description: 数据列表
 * @author: fangyuan(43726695@qq.com)
 * @update:
 */
define('module/dataListNew', [
    'common/interface',
    'common/util',
    'common/errCode'
], function (inter, util, errCode) {
    /**
     * 动态原型模式是把所有信息都封装在构造函数中，通过构造函数中初始化原型，
     * 检测该方法是否有效而选择是否需要初始化原型
     *
     * 构造函数传递初始化参数: 构造函数模式用于定义实例属性，
     * 原型模式用于定义共享属性
     */
    function Element(options) {
        var defaults = {
            target: null,
            pagination: null,
            loadingCls: 'loading',
            loadingText: '数据加载中 <i class="ace-icon fa fa-spinner fa-pulse"></i>',
            loadingTpl: '<li class="#{loadingCls}">#{loadingText}</li>',
            failedCls: 'failed',
            failedText: '数据加载失败',
            failedTpl: '<li class="#{failedCls}">#{failedText}</li>',
            noDataCls: 'noData',
            noDataText: '暂无数据',
            noDataTpl: '<div class="#{noDataCls}">#{noDataText}</div>',
            itemTpl: [
                '<li></li>'
            ].join(''),
            ajaxApi: null,
            getDataCallback: null,
            finishedCallback: null,
            hasPagination: false, //标识是否已经初始化分页控件
            listData: null, //记录ajax数据
            page: 1, //当前页码
            pageSize: ued_conf.pageSize, //分页大小
            param: {},
            listName: 'data',
            ajaxType: 'POST',
            url: '', //ajax请求地址,
            link: '#tabsMenu'
        };
        this.opts = $.extend(defaults, {}, options);

        /**
         * 初始化调用
         */
        if (typeof this.initital !== 'function') { // 这里的代码只执行了一次
            Element.prototype.initital = function () {
                var self = this;
                self.opts.pagination.empty();
                self.renderList();
            };
        }
        /**
         * 获取数据
         */
        if (typeof this.getData !== 'function') {
            Element.prototype.getData = function (call) {
                var self = this;
                if (!self.opts.listData) {
                    if (!self.opts.target.find('.' + self.opts.loadingCls).length) {
                        self.opts.target.html(util.template(self.opts.loadingTpl, {
                            loadingCls: self.opts.loadingCls,
                            loadingText: self.opts.loadingText
                        }));
                    }
                    self.opts.ajaxApi && self.opts.ajaxApi.abort();
                    self.opts.param.page = self.opts.page;
                    self.opts.param.pageSize = self.opts.pageSize;
                    self.opts.ajaxApi = util.setAjax(self.opts.url, self.opts.param,
                        function (json) {
                            if (json.errCode) {
                                self.loadFailed(errCode.get(json.errCode));
                            } else {
                                if (self.opts.getDataCallback) {
                                    json = self.opts.getDataCallback(json);
                                }
                                call && call(json);
                            }
                        },
                        function () {
                            self.loadFailed(self.opts.failedText);
                        }, self.opts.ajaxType);
                } else {
                    call && call(self.opts.listData);
                    self.opts.listData = null;
                }
            };
        }
        /**
         * 渲染列表
         */
        if (typeof this.renderList !== 'function') {
            Element.prototype.renderList = function () {
                var self = this,
                    listArr = [];

                self.getData(function (data) {
                    var count = data.totalCount,
                        list = data[self.opts.listName];
                    if (!self.opts.hasPagination) {
                        self.opts.listData = data;
                        self.initPagination(count);
                    } else {
                        if (list && list.length) {
                            $.each(list, function (i, n) {
                                listArr.push(util.template(self.opts.itemTpl, n));
                            });
                        } else {
                            listArr.push(util.template(self.opts.noDataTpl, {
                                noDataCls: self.opts.noDataCls,
                                noDataText: self.opts.noDataText
                            }));
                            self.opts.target.html('');
                        }
                        self.opts.target.html(listArr.join(''));
                        self.opts.finishedCallback && self.opts.finishedCallback(self.opts.target);
                        self.addTitle();
                    }
                });
            };
        }
        /**
         * 加载数据失败
         */
        if (typeof this.loadFailed !== 'function') {
            Element.prototype.loadFailed = function (errMsg) {
                var self = this,
                    failedPanel = $(util.template(self.opts.failedTpl, {
                        failedCls: self.opts.failedCls,
                        failedText: errMsg + '，<a id="listReload" href="javascript:">点击重新加载</a>'
                    }));
                self.opts.target.find('.' + self.opts.loadingCls).closest('tr').remove();
                self.opts.target.html(failedPanel);
                $('#listReload').on('click', function (e) {
                    e.preventDefault();
                    self.renderList();
                });
            };
        }
        /**
         * 初始化分页控件
         */
        if (typeof this.initPagination !== 'function') {
            Element.prototype.initPagination = function (count) {
                var self = this;
                self.opts.hasPagination = true;
                if (this.opts.pagination === null) {
                    this.renderList();
                    return;
                }
                if (count > self.opts.pageSize) {
                    self.opts.pagination.parent().css('display', 'block');
                    self.opts.pagination.pagination(count, {
                        prev_text: '上一页',
                        next_text: '下一页',
                        link_to: self.opts.link,
                        items_per_page: self.opts.pageSize,
                        num_display_entries: 6,
                        current_page: self.opts.page - 1,
                        num_edge_entries: 2,
                        callback: function (page_id, jq) {
                            self.opts.page = page_id + 1;
                            self.renderList();
                        }
                    });
                } else {
                    self.renderList();
                }
            };
        }
        /**
         * 给每个列表元素添加title属性
         */
        if (typeof this.addTitle !== 'function') {
            Element.prototype.addTitle = function () {
                var self = this;
                self.opts.target.find('.li-body>ul>li').each(function (index, el) {
                    var lititle = $(this).attr('title'),
                        domchild = $(this).children(),
                        title = '';
                    if (!lititle) {
                        if (domchild.length === 0) {
                            title = $(this).text();
                            $(this).attr('title', title);
                        } else {
                            for (var i = 0; i < domchild.length; i++) {
                                var childTargetName = domchild[i].nodeName;
                                switch (childTargetName) {
                                    case "A":
                                        title = $(this).find('a').text();
                                        $(this).attr('title', title);
                                        break;
                                    case "DIV":
                                        title = domchild.eq(i).text();
                                        domchild.eq(i).attr('title', title);
                                        break;
                                }
                            }
                        }
                    }
                });
            };
        }
    }

    /**
     * 返回新创建的实例给别的地方引用
     */
    return {
        /**
         * 每次创建一个新的实例, 每个实例都会有自己的一份实例属性，
         * 但同时又共享着方法，最大限度的节省了内存
         */
        init: function (options) {
            var element = new Element(options);
            return element.initital();
        }
    };
});
