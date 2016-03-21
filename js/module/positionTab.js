'use strict';
/*jslint browser: true*/
/*global $, jQuery*/
/**
 * @description: 简历库职位tab
 * @author: duyutao(452661976@qq.com)
 * @update:
 */
define('module/positionTab', [
    'common/interface',
    'common/util',
    'module/dataList',
    'module/tabMenu',
    'common/auditDialog',
], function (inter, util, list, tabMenu, aD) {
    return {
        /**
         * 初始化Tab签
         */
        init: function (option) {
            var defaults = {
                target: {},
                tabId: "",
                midId: "",
                tabName: "",
                dataTab: "",
                url: "",
            };
            var self = this;
            self.option = $.extend({}, defaults, option);
            tabMenu.addTab({
                target: self.option.target,
                tabId: self.option.tabId,
                midId: self.option.midId,
                tabName: self.option.tabName,
                dataTab: self.option.dataTab,
                url: self.option.url,
            }, function (httpresponse, status, xhr) {
                var $this = $(this);
                /*为tabs增加关闭功能*/
                $("#newTabs-" + self.option.midId + self.option.tabId).on("click", function () {
                    self.initlist($this, self.option);
                }).trigger("click");
            });
        },
        initlist: function ($objlist, option) {
            var page = 1,
                pageSize = ued_conf.pageSize * 3,
                param = {};
            list.init({
                target: $objlist.find('ul[name="positionList"]'),
                pagination: $objlist.find('.pagePos'),
                noDataTpl: '<li class="#{noDataCls}">#{noDataText}</li>',
                itemTpl: ['<li class="li-body">',
                    '<ul data-dbid="' + option.tabId + '" data-pid="#{id}">',
                    '<li hidden="hidden">#{id}</li>',
                    '<li class="li-position">#{name}<span class="td-label #{project}">活</span>',
                    '</li>',
                    '<li>已被推荐#{candidateNums}人</li>',
                    '<li class="li-com" title="#{compnayName}">#{compnayName}</li>',
                    '<li>#{industry}</li>',
                    '<li>#{createTime}</li>',
                    '<li>#{status}</li>',
                    '<li>#{positionType}</li>',
                    '<li class="li-handle">',
                    '<a href="javascript:;" name="recommendBtn" title="推荐" class="ifont"><i class="ace-icon fa fa-thumbs-up" data-id="#{id}" data-tab="posMgr" data-name="#{name}"></i></a>',
                    '</li>',
                    '</ul>',
                    '</li>'
                ].join(''),
                getDataCallback: function (data) {
                    return data;
                },
                finishedCallback: function () {},
                page: page, //当前页码
                pageSize: pageSize, //分页大小
                param: {
                    positionId: option.tabId,
                    listType : "myManage",
                },
                url: option.listUrl
            });
            $objlist.find('[name=positionList]').off('click').on("click", 'a[name="recommendBtn"]', function (e) {
                var $target = $(e.target),
                    $ul = $target.closest("ul"),
                    dbid = $ul.data("dbid"),
                    positionId = $ul.data("pid"),
                    recommendValidate = {};
                var diaOption = {
                    tab: $("#newTabs-" + option.midId + option.tabId),
                    pid: positionId,
                    dbid: dbid,
                    handleType:'recommendReason',
                }
                aD.recommend(diaOption);
            });
        }
    }
});
