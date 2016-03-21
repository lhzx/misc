'use strict';
/*jslint browser: true*/
/*global $, jQuery*/
/**
 * @description: 职位Tab下的简历推荐列表
 * @author: duyutao(452661976@qq.com)
 * @update:
 */
define('module/resumeTab', [
    'common/interface',
    'common/util',
    'module/dataList',
    'module/tabMenu',
    'module/dialogPop',
    'common/auditDialog',
], function (inter, util, list, tabMenu, pop, aD) {
    var gPositionId = "";
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
                gPositionId = self.option.tabId;
                $("#newTabs-" + self.option.midId + self.option.tabId).on("click", function () {
                    self.initlist($this, self.option);
                }).trigger("click");
                /*查询事件*/
                $this.find("a[name=btn_search]").on('click', function () {
                    self.initlist($this, self.option);
                });
            });
        },
        /*初始化列表*/
        initlist: function ($objlist, option) {
            var page = 1,
                pageSize = ued_conf.pageSize,
                param = {},
                positionId = gPositionId,
                comName = $objlist.find('input[name="comname"]').val(),
                workRangeMin = $objlist.find('input[name="workRangeMin"]').val(),
                workRangeMax = $objlist.find('input[name="workRangeMax"]').val();
            list.init({
                target: $objlist.find('ul[name="resumeList"]'),
                pagination: $objlist.find('.pageResume'),
                noDataTpl: '<li class="#{noDataCls}">#{noDataText}</li>',
                itemTpl: ['<li class="li-body">',
                    '<ul data-id="#{id}" data-name="#{name}" data-dbid="#{id}" data-tab="tabs-resume" name="body-ul" data-pid="' + option.tabId + '">',
                    '<li class="li-name">',
                    '<a href="javascript:void(0);" data-parentid="' + (option.midId + option.tabId) + '" id="#{id}" name="resumeDetail"  data-target="' + option.target + '">#{name}</a>',
                    '</li>',
                    '<li class="li-phone" title="#{mobilePhone}">#{mobilePhone}</li>',
                    '<li class="li-com" title="#{expectIndustrys}">#{expectIndustrys}</li>',
                    '<li>#{expectPositions}</li>',
                    '<li class="" title="#{salary}">#{salary}</li>',
                    '<li  title="#{expectSalary}">#{expectSalary}</li>',
                    '<li>#{expectAreas}</li>',
                    '<li class="li-other">',
                    '<a href="javascript:void(0);" title="查看" name="viewother"><i class="ace-icon fa fa-plus"></i></a>',
                    '</li>',
                    '<li class="li-handle">',
                    '<a href="javascript:void(0);" name="recommend" class="ifont" title="推荐"><i class="ace-icon fa fa-thumbs-up" name=""></i></a>',
                    '</li>',
                    '</ul>',
                    '</li>',
                    '<li id="detail-#{id}" class="li-detail li-position"></li>'
                ].join(''),
                getDataCallback: function (data) {
                    return data;
                },
                finishedCallback: function () {},
                page: page, //当前页码
                pageSize: pageSize, //分页大小
                param: {
                    positionId: positionId,
                    company: comName,
                    workRangeMax: workRangeMax,
                    workRangeMin: workRangeMin,
                },
                url: option.listUrl
            });
            //查询按钮

            // 简历详细信息
            $objlist.find('[name=resumeList]').on('click', 'a[name="resumeDetail"]', function (e) {
                var $target = $(e.target),
                    $ul = $target.closest("ul"),
                    id = $ul.data('id'),
                    name = $(e.target).text(),
                    tab = $(e.target).data('tab'),
                    parentId = $(e.target).data('parentid');
                tabMenu.addTab({
                    tabId: id,
                    tabName: name,
                    dataTab: tab,
                    midTab: 'r',
                    target: $('#management-ul-tabs'),
                    url: inter.getApiUrl().resumeDetail,
                    parentId: parentId,
                }, function (response, status, xhr) {

                });
            });
            $objlist.find('[name=resumeList]').off('click').on("click", 'a[name="viewother"]', function (e) {
                var $target = e.target.nodeName.toLowerCase() == 'i' ? $(e.target).parent() : $(e.target),
                    $ul = $target.closest("ul"),
                    resumeId = $ul.data("id"),
                    $nextLi = $target.closest("li.li-body").next("li.li-detail");
                if ($target.children('i').hasClass('fa-plus')) {
                    $target.children('i').removeClass('fa-plus').addClass('fa-minus');
                    $nextLi.html('<div class="loading">数据加载中 <i class="ace-icon fa fa-spinner fa-pulse"></i><div>')
                        .stop().slideDown('normal')
                        .load(inter.getApiUrl().resumeOther, {
                            size: 5,
                            dbid: resumeId
                        }, function (response, status, xhr) {
                            // var detailHeight = $this.find('.detail-1-right-position').offset().top;
                            if (status == 'error') {
                                alert('暂无信息，请联系管理员');
                                return;
                            }
                            $(this).find('a[name="d_more"]').attr("data-rid", resumeId);
                        });
                } else {
                    $nextLi.stop().slideUp('normal');
                    $target.children('i').removeClass('fa-minus').addClass('fa-plus');
                }
            });
            //查看更多
            $objlist.find('[name=resumeList]').on("click", 'a[name="d_more"]', function (e) {
                $("#ul_more").empty();
                var resumeId = $(e.target).closest('a[name="d_more"]').data('rid');
                var data = {
                    dbid: resumeId
                };
                $.post(inter.getApiUrl().resumeOther, data, function (re) {
                    if (re.success) {
                        var strHtml = [];
                        console.log(re.otherInfos);
                        for (var i = 0; i < re.otherInfos.length; i++) {
                            strHtml.push('<li>',
                                '<span class="col-sm-4 pname" title="' + re.otherInfos[i].positionName + '[' + re.otherInfos[i].payType + '">' + re.otherInfos[i].positionName + '[' + re.otherInfos[i].payType + ']</span>',
                                '<span class="col-sm-4 ">' + re.otherInfos[i].companyName + '</span>',
                                '<span class="col-sm-3 status">[' + re.otherInfos[i].status + ']</span>',
                                '</li>');
                        }
                        $("#ul_more").html(strHtml.join(""));
                        $("#dia_more").removeClass("hide").dialog({
                            modal: true,
                            width: '650px',
                            resizable: false,
                            title: "<div class='widget-header widget-header-small'><h4 class='smaller' style='font-family:microsoft yahei;'>更多职位信息</h4></div>",
                            title_html: true,
                            open: function () {},
                            close: function () {},
                            buttons: [{
                                text: "确定",
                                'class': 'btn btn-xs btn-primary',
                                click: function () {
                                    $(this).dialog('close');
                                }
                            }]
                        });
                    } else {
                        util.alertDialog(re.errMsg);
                    }
                });
            });
            //推荐按钮
            $objlist.find('[name=resumeList]').on("click", 'a[name="recommend"]', function (e) {
                var $target = $(e.target),
                    $ul = $target.closest("ul"),
                    dbid = $ul.data("dbid"),
                    positionId = $ul.data("pid"),
                    recommendValidate = {};
                var diaOption = {
                    tab: $("#newTabs-" + option.midId + option.tabId),
                    pid: positionId,
                    dbid: dbid,
                    handleType: 'recommendReason',
                }
                aD.recommend(diaOption);
            });
        }
    }
});
