'use strict';
/*global $, define*/
/**
 * @description: 数据列表
 * @author: fangyuan(43726695@qq.com)
 * @update:
 */
define('module/dataList', [
    'common/interface',
    'common/util',
    'common/errCode'
], function (inter, util, errCode) {
    /**
     * 闭包单例模式，
     * 保证一个类只有一个实例，
     * 从全局命名空间里提供一个唯一的访问点来访问该对象。
     */
    return (function (options) {
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
            },
            opts, // 私有属性
            uniq;

        /**
         * 初始化调用, 以及合并接收的参数
         */
        var initital = function (options) {
            opts = $.extend(defaults, {}, options);
            opts.hasPagination = false;
            opts.pagination.empty();
            renderList();
        };
        /**
         * 获取数据
         */
        var getData = function (call) {
            if (!opts.listData) {
                if (!opts.target.find('.' + opts.loadingCls).length) {
                    opts.target.html(util.template(opts.loadingTpl, {
                        loadingCls: opts.loadingCls,
                        loadingText: opts.loadingText
                    }));
                }
                opts.ajaxApi && opts.ajaxApi.abort();
                opts.param.page = opts.page;
                opts.param.pageSize = opts.pageSize;
                opts.ajaxApi = util.setAjax(opts.url, opts.param,
                    function (json) {
                        if (json.errCode) {
                            loadFailed(errCode.get(json.errCode));
                        } else {
                            if (opts.getDataCallback) {
                                json = opts.getDataCallback(json);
                            }
                            call && call(json);
                        }
                    },
                    function () {
                        loadFailed(opts.failedText);
                    }, opts.ajaxType);
            } else {
                call && call(opts.listData);
                opts.listData = null;
            }
        };
        /**
         * 渲染列表
         */
        var renderList = function () {
            var listArr = [];

            getData(function (data) {
                var count = data.totalCount,
                    list = data[opts.listName];
                
                if (!opts.hasPagination) {
                    opts.listData = data;
                    initPagination(count);
                } else {
                    if (list && list.length) {
                        $.each(list, function (i, n) {
                            listArr.push(util.template(opts.itemTpl, n));
                        });
                    } else {
                        listArr.push(util.template(opts.noDataTpl, {
                            noDataCls: opts.noDataCls,
                            noDataText: opts.noDataText
                        }));
                        opts.target.html('');
                    }
                    opts.target.html(listArr.join(''));
                    opts.finishedCallback && opts.finishedCallback(opts.target);
                    addTitle();
                }
            });
        };
        /**
         * 加载数据失败
         */

        var loadFailed = function (errMsg) {
            var failedPanel = $(util.template(opts.failedTpl, {
                failedCls: opts.failedCls,
                failedText: errMsg + '，<a id="listReload" href="javascript:">点击重新加载</a>'
            }));
            opts.target.find('.' + opts.loadingCls).closest('tr').remove();
            opts.target.html(failedPanel);
            $('#listReload').on('click', function (e) {
                e.preventDefault();
                renderList();
            });
        };
        /**
         * 初始化分页控件
         */

        var initPagination = function (count) {
            opts.hasPagination = true;
            if (opts.pagination === null) {
                renderList();
                return;
            }
            if (count > opts.pageSize) {
                opts.pagination.parent().css('display', 'block');
                opts.pagination.pagination(count, {
                    prev_text: '上一页',
                    next_text: '下一页',
                    link_to: opts.link,
                    items_per_page: opts.pageSize,
                    num_display_entries: 6,
                    current_page: opts.page - 1,
                    num_edge_entries: 2,
                    callback: function (page_id, jq) {
                        opts.page = page_id + 1;
                        renderList();
                    }
                });
            } else {
                renderList();
            }
        };
        /**
         * 给每个列表元素添加title属性
         */
        var addTitle = function () {
            opts.target.find('.li-body>ul>li').each(function (index, el) {
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
        /**
         * 返回新创建的实例给别的地方引用
         */
        return {
            /**
             * 惰性单例就是只有在使用的时候才初始化
             * 也就是说只有在用的时候才会去初始化方法，这样可以更省资源。
             */
            init: function (options) { // 在公开的方法中返回私有方法
                if(!uniq){
                    uniq = initital(options)
                }
                return uniq;
            }
        };
    })();
});
