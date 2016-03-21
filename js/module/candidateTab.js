'use strict';
/*jslint browser: true*/
/*global $, jQuery*/
/**
 * @description: 职位弹出候选人Tab签
 * @author: duyutao(452661976@qq.com)
 * @update:
 */
define('module/candidateTab', [
    'common/interface',
    'common/util',
    'common/errCode',
    'module/dataList',
    'module/tabMenu',
    'common/failReason',
    'module/formatResume',
    'common/auditDialog',
], function(inter, util, errCode, list, tabMenu, failReason, formatResume, aD) {
    return {
        /**
         * 初始化Tab签
         */
        init: function(option) {
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
                parentId: self.option.parentId,
            }, function() {
                var $this = $(this);
                /*为tabs增加关闭功能*/
                if (self.option.userType == "specialHunter") {
                    $("#newTabs-" + self.option.midId + self.option.tabId).on("click", function() {
                        self.initlist($this, self.option);
                    }).trigger("click");
                    $this.find('[name="btnSearch"]').on("click", function() {
                        self.initlist($this, self.option);
                    });
                } else if (self.option.userType == "company") {
                    $("#newTabs-" + self.option.midId + self.option.tabId).on("click", function() {
                        self.initlistForCom($this, self.option);
                    }).trigger("click");
                    $this.find('[name="btnSearch"]').on("click", function() {
                        self.initlistForCom($this, self.option);
                    });
                } else if (self.option.userType == "sysadmin") {
                    $("#newTabs-" + self.option.midId + self.option.tabId).on("click", function() {
                        self.initlistForSys($this, self.option);
                    }).trigger("click");
                    $this.find('[name="btnSearch"]').on("click", function() {
                        self.initlistForSys($this, self.option);
                    });
                }
            });
        },
        initlist: function($objlist, option) {
            var page = 1,
                pageSize = 10,
                param = {},
                status = $objlist.find('select[name="txt_candidate_status"]').val(),
                name = $objlist.find('input[name="txt_candidate_name"]').val(),
                sourceTab = option.dataTab;
            list.init({
                target: $objlist.find('ul[name="ul_candidate_info"]'),
                pagination: $objlist.find('.pageCandidate'),
                noDataTpl: '<li class="#{noDataCls}">#{noDataText}</li>',
                itemTpl: [
                    '<li class="li-body">',
                    '<ul data-canid="#{canId}" data-canna="#{canName}" data-status="#{status}" data-email="#{canEmail}" data-pid="' + option.tabId + '"  data-mid="' + option.midId + '" >',
                    '<li class="li-canname">',
                    '<a href="#" name="canname" data-tab="' + sourceTab + '" >#{canName}</a>',
                    '<sup class="name-status #{statusCls}">#{isFormat}</sup>',
                    '</li>',
                    '<li class="li-over" title="#{positionName}">#{positionName}</li>',
                    '<li class="li-com li-over" title="#{companyName}">#{companyName}</li>',
                    '<li class="li-phone" title="#{canPhone}">#{canPhone}</li>',
                    '<li class="li-email li-over" title="#{canEmail}"><a href="javascript:void(0);" name="emailSend">#{canEmail}</a></li>',
                    '<li class="li-presenter" title="#{presenterName}">',
                    '<a class="viewPresenter" href="javascript:void(0);">#{presenterName}</a>',
                    '<div class="presenterDetail">',
                    '<p><strong>兼职猎头信息</strong></p>',
                    '<ul>',
                    '<li>手机: #{presenterPhone}</li>',
                    '<li class="li-pres-email" title="#{presenterEmail}">邮箱: #{presenterEmail}</li>',
                    '<li>推荐面试比率: #{presenterInterviewRate}</li>',
                    '</ul>',
                    '</div>',
                    '</li>', '<li  class="li-statue" title="#{canStatus}"><a href="javascript:" name="viewRemark" >#{canStatus}</a> <span class="badge badge-info interview-steps">#{viewCount}</span></li>',
                    '<li class="li-other">',
                    '<a href="javascript:void(0);" name="view" data-id="#{canId}" title="查看"><i class="ace-icon fa fa-plus"></i></a>',
                    '</li>',
                    '<li class="li-handle">',
                    '<a href="javascript:void(0);" name="format" class="#{format_display}" data-tab="posMgr" title="标准化"><i class="ace-icon fa fa-anchor" name="format"></i></a>',
                    '<a href="javascript:void(0);" name="auditSucess" class="#{a_display}" title="审核通过"><i class="ace-icon fa fa-check" name="auditSucess"></i></a>',
                    '<a href="javascript:void(0);" name="auditFail" class="#{a_display}" title="审核失败"><i class="ace-icon fa fa-times" name="auditFail"></i></a>',
                    '<a href="javascript:void(0);" name="cAuditFail" class="#{caf_display}" title="失败原因"><i class="ace-icon fa fa-commenting" name="cAuditFail"></i></a>',
                    '<a href="javascript:void(0);" name="launch" class="#{l_display}" title="发起面试"><i class="ace-icon fa fa-calendar-o" name="launch" ></i></a>',
                    '<a href="javascript:void(0);" name="notlaunch" class="#{l_display}" title="发起面试失败"><i class="ace-icon fa fa-times" name="notlaunch" ></i></a>',
                    '<a href="javascript:void(0);" name="recommend" class="#{r_display}" title="推荐"><i class="ace-icon fa fa-thumbs-up" name="recommend"></i></a>',
                    '<a href="javascript:void(0);" name="cancelRecommend" class="#{r_display}" title="取消推荐"><i class="ace-icon fa fa-ban" name="cancelRecommend"></i></a>',
                    '<a href="javascript:void(0)" name="launch" class="#{ag_display}" title="重新发起面试"><i class="ace-icon fa fa-calendar-plus-o" name ="launch"></i></a>',
                    '<a href="javascript:void(0)" name="hold" class="#{h_display}" title="继续Hold"><i class="menu-icon fa fa-pause" name="hold"></i></a>',
                    '<a class="#{guarantee_dispalay} #{auditCls}" href="javascript:void(0);" name="g_pass" title="通过保证期"><i class="ace-icon fa fa-check" name="g_pass" ></i></a>',
                    '<a href="javascript:void(0)" name="follow" class="#{follow_display} #{auditCls}" title="跟进"><i class="ace-icon fa fa-location-arrow" name="follow" ></i></a>',
                    '<a class="#{guarantee_dispalay} #{auditCls}" href="javascript:void(0);" name="g_nopass" title="未过保证期"><i class="ace-icon fa fa-times"  name="g_nopass" ></i></a>',
                    // '<a href="javascript:void(0)" name="result" class="#{rt_display}" title="面试结果"><i class="ace-icon fa fa-pencil " name="result" ></i></a>',
                    '<a href="javascript:void(0)" name="interview_sucess" class="#{is_display}" title="面试成功"><i class="ace-icon fa fa-calendar-check-o" name="interview_sucess" ></i></a>',
                    '<a href="javascript:void(0)" name="interview_fail" class="#{if_display}" title="面试失败"><i class="ace-icon fa fa fa-calendar-times-o" name="interview_fail" ></i></a>',
                    '<a href="javascript:void(0)"  name="edit" class="#{edit_display}" title="修改面试"><i name="edit" class="ace-icon fa fa-calendar"></i></a>',
                    '<a href="javascript:void(0)" name="offer" class="#{w_display}" title="待发OFFER"><i name="offer" class="ace-icon fa fa-envelope-o"></i></a>',
                    '<a href="javascript:void(0)" name="hold" class="#{ah_display}" title="暂时Hold"><i name="hold" class="menu-icon fa fa-pause"></i></a>',
                    '<a href="javascript:void(0)" name="cancel" class="#{c_display}" title="取消面试"><i name="cancel" class="menu-icon fa fa-times"></i></a>',
                    '<a href="javascript:void(0);" name="offerpass" class="#{offer_display}" title="提交offer" ><i name="offerpass" class="ace-icon fa fa-check-square-o"></i></a>',
                    '<a href="javascript:void(0);" name="offerfollow" class="#{offer_display}" title="offer跟进" ><i name="offerfollow" class="ace-icon fa fa-location-arrow"  ></i></a>',
                    '<a href="javascript:void(0);" name="offernopass" class="#{offer_display}" title="offer失败" ><i name="offernopass" class="ace-icon fa fa-times"  ></i></a>',
                    '<a href="javascript:void(0)" name="entrypass" class="#{entry_display} #{auditCls}" title="入职成功"><i name="entrypass" class="menu-icon fa fa-check-circle-o"></i></a>',
                    '<a href="javascript:void(0)" name="entrynopass" class="#{entry_display} #{auditCls}" title="入职失败"><i name="entrynopass" class="menu-icon fa fa-times-circle-o"></i></a>',
                    '<a href="javascript:void(0)" name="return" class="#{back_display}" title="#{buttonName}"><i name="return" class="menu-icon fa fa-undo"></i></a>',
                    '<a href="javascript:void(0)" name="grab" class="#{grabCls} ifont" title="抢占候选人"><i name="grab" class="iconfont icon-qiang"></i></a>',
                    '<a class="#{editCls}" href="javascript:void(0)" name="editoffer" title="修改offer"><i  name="editoffer"  class="ace-icon fa fa-pencil "></i></a>',
                    '</li>',
                    '</ul>',
                    '</li>',
                    '<li id="detail-#{canId}" class="li-detail"></li>',
                ].join(''),
                getDataCallback: function(data) {
                    var arr = data.data,
                        objbna = {
                            "-1": "返回审核",
                            "-2": "返回待推荐",
                            "-3": "返回待客户审核",
                            "-4": "返回待面试",
                            "-8": "返回待入职",
                            "-7": "返回待发offer",
                            "-9": "返回保期内",
                            "7": "返回面试成功",
                        };
                    var arr = data.data;
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].refunded || arr[i].Recruit) {
                            //如果是已退款
                            arr[i].status = -91;
                        }
                        // console.log(arr[i]);
                        arr[i]["isFormat"] = arr[i].status == 0 ? "非" : "标";
                        arr[i].statusCls = arr[i].managerStatus == "NORMAL" && arr[i].status == 0 ? '' : 'hide';
                        arr[i]["format_display"] = arr[i].managerStatus == "NORMAL" && arr[i].status == 0 ? "" : "hide";
                        arr[i]["a_display"] = arr[i].managerStatus == "NORMAL" && $.inArray(arr[i].status, [1]) >= 0 ? "" : "hide";
                        arr[i]["caf_display"] = arr[i].managerStatus == "NORMAL" && $.inArray(arr[i].status, [-3, -4, -6, -5, -7, -8, -9]) >= 0 ? "" : "hide";
                        arr[i]["l_display"] = arr[i].managerStatus == "NORMAL" && $.inArray(arr[i].status, [4]) >= 0 ? "" : "hide";
                        arr[i]["r_display"] = arr[i].managerStatus == "NORMAL" && $.inArray(arr[i].status, [2]) >= 0 ? "" : "hide";
                        arr[i]["fl_display"] = arr[i].managerStatus == "NORMAL" && $.inArray(arr[i].status, [-5]) >= 0 ? "" : "hide";
                        arr[i]["follow_display"] = arr[i].managerStatus == "NORMAL" && $.inArray(arr[i].status, [3, 9]) >= 0 ? "" : "hide";
                        arr[i]["is_display"] = arr[i].managerStatus == "NORMAL" && $.inArray(arr[i].status, [11, 52]) >= 0 ? "" : "hide";
                        arr[i]["if_display"] = arr[i].managerStatus == "NORMAL" && $.inArray(arr[i].status, [11, 52]) >= 0 ? "" : "hide";
                        arr[i]["ah_display"] = arr[i].managerStatus == "NORMAL" && $.inArray(arr[i].status, [52]) >= 0 ? "" : "hide";
                        arr[i]["edit_display"] = arr[i].managerStatus == "NORMAL" && $.inArray(arr[i].status, [52, 51]) >= 0 ? "" : "hide";
                        arr[i]["c_display"] = arr[i].managerStatus == "NORMAL" && $.inArray(arr[i].status, [52, 51]) >= 0 ? "" : "hide";
                        arr[i]["ag_display"] = arr[i].managerStatus == "NORMAL" && $.inArray(arr[i].status, [11, -5, -6, 6]) >= 0 ? "" : "hide";
                        arr[i]["h_display"] = arr[i].managerStatus == "NORMAL" && $.inArray(arr[i].status, [11]) >= 0 ? "" : "hide";
                        arr[i]["w_display"] = arr[i].managerStatus == "NORMAL" && $.inArray(arr[i].status, [6]) >= 0 ? "" : "hide";
                        arr[i]["offer_display"] = arr[i].managerStatus == "NORMAL" && $.inArray(arr[i].status, [7]) >= 0 ? "" : "hide";
                        arr[i]["entry_display"] = arr[i].managerStatus == "NORMAL" && $.inArray(arr[i].status, [8]) >= 0 ? "" : "hide";
                        arr[i]["guarantee_dispalay"] = arr[i].managerStatus == "NORMAL" && $.inArray(arr[i].status, [9]) >= 0 ? "" : "hide";
                        arr[i]['viewCount'] = arr[i].status === 52 ? arr[i]['viewCount'] : '';
                        arr[i]["back_display"] = ($.inArray(arr[i].status, [-1, -2, -3, -4, -7, -8, -9, 7]) >= 0 && arr[i].auditStatus != "CANDNOTEXIST") ? "" : "hide";
                        arr[i]["grabCls"] = arr[i].managerStatus == "UNALLOCATED" ? "" : "hide";
                        arr[i]["buttonName"] = objbna[arr[i].status];
                        arr[i]["canStatus"] = arr[i].status == 51 ? "未面试" : arr[i]["canStatus"];
                        arr[i]['presenterName'] = arr[i]['presenterName'] ? arr[i]['presenterName'] : arr[i]['presenterUserName'];
                        arr[i].auditCls = arr[i].auditStatus == "AUDITSUCC" ? "" : "hide";
                        arr[i].editCls = (arr[i].auditStatus == "AUDITFAIL" && arr[i].status == "8") ? "" : "hide";
                    }
                    return data;
                },
                finishedCallback: function() {
                    $('.viewPresenter').hover(function(e) {
                        $(this).next().show();
                    }, function() {
                        $(this).next().hide();
                    });
                },
                page: page, //当前页码
                pageSize: pageSize, //分页大小
                param: {
                    positionId: option.tabId,
                    status: status,
                    name: name,
                },
                url: option.listUrl
            });
            $objlist.find('[name=ul_candidate_info]').off('click').on("click", function(e) {
                var $target = e.target.nodeName.toLowerCase() == "i" ? $(e.target).parent() : $(e.target),
                    targetName = $target.attr("name"),
                    title = $target.attr("title"),
                    $ul = $target.closest("ul"),
                    id = $ul.data("canid"),
                    status = $ul.data("status"),
                    pid = $ul.data("pid"),
                    mid = $ul.data("mid"),
                    tabid = "newTabs-" + mid + pid,
                    targetTab = $('#management-ul-tabs'),
                    $tab = $('#' + tabid);
                var followDic = {
                    "3": "CUSTOMERAUDITING",
                    "9": "HIRED",
                };
                switch (targetName) {
                    case 'viewRemark': //查看全部评论
                        $('#remarkDialog').empty().load(util.strFormat(inter.getApiUrl().candidateStatus, [id]), function(xhr, status, re) {
                            $('#remarkDialog').removeClass('hide').dialog({
                                resizable: false,
                                width: 500,
                                maxHeight: 500,
                                modal: true,
                                title: '<div class="widget-header widget-header-small"><h4 class="smaller" style="font-family:microsoft yahei;">全部评语</h4></div>',
                                title_html: true,
                                autoFocus: false,
                                open: function() {
                                    // $('#remarkDialog').empty().html(remark);
                                },
                                buttons: [{
                                    html: '确定',
                                    'class': 'btn btn-primary btn-xs',
                                    click: function() {
                                        $(this).dialog('close');
                                    }
                                }]
                            });
                        });
                        break;
                    case 'deleteRemark': //删除评论
                        var memo = $target.closest('div').text(),
                            thisId = $target.closest('li').attr('id').substr(7);
                        util.setAjax(
                            inter.getApiUrl().deleteMemo, {
                                id: thisId,
                                memo: memo
                            },
                            function(data) {
                                if (data.success && !data.errCode) {
                                    var tip = $('#detail-' + thisId).find('.tips');
                                    tip.html('备注删除成功!');
                                    $target.closest('div').next('br').remove()
                                    $target.closest('div').remove();
                                    tip.stop().fadeIn(function() {
                                        tip.delay(3000).fadeOut()
                                    });
                                } else {
                                    util.alertDialog(data.errMsg);
                                }
                            }
                        );
                        break
                    case "view":
                        //查看
                        // var $this = $target.closest('.li-body').next('.li-detail');
                        if ($target.find('i').hasClass('fa-plus')) {
                            if (id) {
                                $('#detail-' + id).load(util.strFormat(inter.getApiUrl().candInfo, [id]), function(response, status, xhr) {
                                    if (status == 'error') {
                                        return;
                                    }
                                    $('#detail-' + id).stop().slideDown('normal');
                                    $target.find('i').removeClass('fa-plus').addClass('fa-minus');
                                    $('.detailPosiitionList').find('a').each(function(i) {
                                        $(this).on('click', function() {
                                            $('.proDetail').addClass('hide').eq(i).removeClass('hide');
                                        });
                                    });
                                    //查看其他推荐职位的信息
                                    var $this = $(this);
                                    var detailHeight = $this.find('.detail-1-right').offset().top;
                                    $(this).find('.detailPosiitionList').find('a').each(function(i) {
                                        $(this).hover(function(e) {
                                            e.stopPropagation();
                                            var height = $(this).offset().top,
                                                posHeight = $this.find('.detailPosiitionList').outerHeight();
                                            $this.find('.detail-1-right-hunter').removeClass('hide');
                                            $this.find('.proDetail').addClass('hide').eq(i).removeClass('hide');
                                            if (posHeight > 130) {
                                                $this.find('.detail-1-right-hunter').css('top', height - detailHeight - 20);
                                            }
                                            $this.find('.detail-1-right-hunter').on('click', function(e) {
                                                e.stopPropagation();
                                            });
                                        }, function(e) {
                                            $(e.target).closest('.detail-1-right').find('.detail-1-right-hunter:not(.hide)').addClass('hide');
                                        });
                                    });
                                    $('#detail-' + id).find('.detail-remark').off('click').on('click', function(e) {
                                        var memo = $('#detail-' + id).find('[name=tags]').val();
                                        if (memo.length) {
                                            util.setAjax(
                                                inter.getApiUrl().hunterMemo, {
                                                    id: id,
                                                    memo: memo
                                                },
                                                function(data) {
                                                    if (data.success && !data.errCode) {
                                                        var tip = $('#detail-' + id).find('.tips');
                                                        tip.html('备注添加成功!');
                                                        tip.stop().fadeIn(function() {
                                                            tip.delay(3000).fadeOut()
                                                        });
                                                        $('#detail-' + id).find('[name=tags]').val('');
                                                        $('#detail-' + id).find('.memoItem').append('<div>' + memo + '<a href="javascript:;" name="deleteRemark"><i name="deleteRemark" class="ace-icon fa fa-times"></i></a></div><br>');
                                                        $('#detail-' + id).find('.memoItem').find('div').hover(function() {
                                                            $(this).find('i').css('opacity', '1');
                                                        }, function() {
                                                            $(this).find('i').css('opacity', '0');
                                                        });
                                                    } else {
                                                        util.alertDialog(data.errMsg);
                                                    }
                                                }
                                            );
                                        }
                                    });
                                    $('#detail-' + id).find('.memoItem').find('div').hover(function() {
                                        $(this).find('i').css('opacity', '1');
                                    }, function() {
                                        $(this).find('i').css('opacity', '0');
                                    });
                                });
                            }
                        } else {
                            $('#detail-' + id).stop().slideUp('normal');
                            $target.find('i').removeClass('fa-minus').addClass('fa-plus');
                        }
                        break;
                    case "canname":
                        if ($("#sidebar-collapse").find("i").hasClass('fa-angle-double-left')) {
                            $("#sidebar-collapse").trigger("click");
                        }
                        //查看简历
                        var name = $target.text(),
                            tab = $target.data('tab') ? $target.data('tab') : $target.parent().data('tab');
                        console.log(mid + pid);
                        tabMenu.addTab({
                            tabId: id,
                            tabName: name,
                            dataTab: tab,
                            target: targetTab,
                            url: inter.getApiUrl().getCandidateDetail,
                            parentId: mid + pid
                        }, function() {
                            // console.log(this);
                            $(this).find('a[name="edit_candidate"]').removeClass('hide').on("click", function(e) {
                                var id = $(this).attr('data-id'),
                                    loadingTpl = '<div class="loadingCandi">数据加载中 <i class="ace-icon fa fa-spinner fa-pulse"></i></div>';
                                $('#tabsContent-' + id).html(loadingTpl).load(util.strFormat(inter.getApiUrl().editResume, [id]), function(response, status, xhr) {
                                    formatResume.init($(this));
                                });
                            });
                        });
                        break;
                    case 'emailSend':
                        $('#emailForm')[0].reset();
                        var email = $target.closest('ul').data("email");
                        var option = {
                            email: email,
                            canid: id,
                        }
                        aD.sendEmail(option);
                        break;
                    case "format":
                        //sidebar收起来
                        if ($("#sidebar-collapse").find("i").hasClass('fa-angle-double-left')) {
                            $("#sidebar-collapse").trigger("click");
                        }
                        //标准化
                        var id = $target.closest("ul").data("canid"),
                            name = "标准化 — " + $target.closest("ul").data("canna"),
                            tab = $target.data('tab') ? $target.data('tab') : $target.parent().data('tab');
                        tabMenu.addTab({
                            tabId: id,
                            tabName: name,
                            dataTab: tab,
                            target: targetTab,
                            url: inter.getApiUrl().resumeFormat,
                            parentId: mid + pid
                        }, function(text, status, jqXHR) {
                            formatResume.init($(this));
                        });
                        break;
                    case "auditSucess":
                        var option = {
                            tab: $tab,
                            id: id,
                            titleText: '审核成功',
                            successStatus: 'RECOMMENDING',
                            successText: '审核成功',
                            failStatus: '',
                            failText: '取消',
                        }
                        aD.changeStatusDialog(option);
                        break;
                    case "auditFail":
                        var option = {
                            tab: $tab,
                            dia: $("#dialog_fail"),
                            id: id,
                            title: '审核失败',
                            successStatus: "AUDITFAIL",
                            successText: "确定",
                            failStatus: "",
                            failText: "取消",
                            handleType: "hunterAuditFail",
                        };
                        aD.dialogFail(option);
                        break;
                    case "cAuditFail":
                        var objparam = {
                            "-3": {
                                "title": "审核失败",
                                "handleType": "hunterAuditFail2",
                                "successStatus": "CUSTOMERAUDITFAIL",
                            },
                            "-4": {
                                "title": "发起面试失败",
                                "handleType": "launchFail",
                                "successStatus": "FORINTERVIEWFAIL",
                            },
                            "-5": {
                                "title": "取消面试",
                                "handleType": "cancelInterview",
                                "successStatus": "INTERVIEWCANCLE",
                            },
                            "-6": {
                                "title": "面试失败",
                                "handleType": "interviewFail",
                                "successStatus": "INTERVIEWFAIL",
                            },
                            "-7": {
                                "title": "Offer失败",
                                "handleType": "offerFail",
                                "successStatus": "OFFERFAIL",
                            },
                            "-8": {
                                "title": "入职失败",
                                "handleType": "entryFail",
                                "successStatus": "ENTRYFAIL",
                            },
                            "-9": {
                                "title": "未过保期",
                                "handleType": "guranteeFail",
                                "successStatus": "UNOUTDATED",
                            }
                        }
                        var option = {
                            tab: $('#a-tabs-cfailure'),
                            dia: $("#dialog_fail"),
                            id: id,
                            title: objparam[status].title,
                            successStatus: objparam[status].successStatus,
                            successText: "确定",
                            failStatus: "",
                            failText: "取消",
                            handleType: objparam[status].handleType,
                        };
                        aD.dialogFail(option);
                        break;
                    case "launch":
                        var option = {
                            tab: $tab,
                            canId: id,
                            titleText: "发起面试",
                        }
                        aD.interviewDialog(option);
                        break;
                    case "notlaunch":
                        //取消发起面试
                        var option = {
                            tab: $tab,
                            dia: $("#dialog_fail"),
                            id: id,
                            title: title,
                            seltitle: "失败原因",
                            successStatus: "FORINTERVIEWFAIL",
                            successText: "确定",
                            failStatus: "",
                            failText: "取消",
                            handleType: "launchFail",
                        };
                        aD.dialogFail(option);
                        break;
                    case "recommend":
                        //待推荐
                        var option = {
                            id: id,
                            tab: $tab,
                        };
                        aD.waitRecommend(option);
                        break;
                    case "cancelRecommend":
                        //取消推荐
                        var option = {
                            tab: $tab,
                            dia: $("#dialog_fail"),
                            id: id,
                            title: title,
                            seltitle: "取消原因",
                            successStatus: "RECOMMENDFAIL",
                            successText: "确定",
                            failStatus: "",
                            failText: "取消",
                            handleType: "recommendFail",
                        };
                        aD.dialogFail(option);
                        break;
                    case "follow":
                        var option = {
                            tab: $tab,
                            id: id,
                            titleText: '跟进',
                            successStatus: followDic[status],
                            successText: '确定',
                            failStatus: '',
                            failText: '取消',
                        }
                        aD.changeStatusDialog(option);
                        break;
                    case "hold":
                        var option = {
                            tab: $tab,
                            dia: $("#dialog_fail"),
                            id: id,
                            seltitle: "hold原因",
                            title: '暂时HOLD',
                            successStatus: "HOLD",
                            successText: "提交",
                            failStatus: "",
                            failText: "取消",
                            handleType: "hold",
                            ishold: true,
                        };
                        aD.dialogFail(option);
                        break;
                    case "interview_sucess":
                        var option = {
                            tab: $tab,
                            id: id,
                            titleText: '面试成功',
                            successStatus: 'INTERVIEWSUCC',
                            successText: '面试成功',
                            failStatus: '',
                            failText: '取消',
                        }
                        aD.changeStatusDialog(option);
                        break;
                    case "interview_fail":
                        var option = {
                            tab: $tab,
                            dia: $("#dialog_fail"),
                            id: id,
                            title: title,
                            successStatus: "INTERVIEWFAIL",
                            successText: "提交",
                            failStatus: "",
                            failText: "取消",
                            handleType: "interviewFail",
                        };
                        aD.dialogFail(option);
                        break;
                    case "cancel":
                        var option = {
                            tab: $tab,
                            dia: $("#dialog_fail"),
                            seltitle: "取消原因",
                            id: id,
                            title: title,
                            successStatus: "INTERVIEWCANCLE",
                            successText: "确定",
                            failStatus: "",
                            failText: "取消",
                            handleType: "cancelInterview",
                        };
                        aD.dialogFail(option);
                        break;
                    case "offer":
                        var option = {
                            tab: $tab,
                            id: id,
                            titleText: '待发OFFER',
                            successStatus: 'OFFERING',
                            successText: '确定',
                            failStatus: '',
                            failText: '取消',
                        }
                        aD.changeStatusDialog(option);
                        break;
                    case "backtoAudit":
                        var option = {
                            tab: $tab,
                            dia: $("#dialog_fail"),
                            seltitle: "返回审核",
                            id: id,
                            title: title,
                            othertitle: "原因",
                            successStatus: "AUDITING",
                            successText: "确定",
                            failStatus: "",
                            failText: "取消",
                            // handleType: "cancelInterview",
                        };
                        aD.dialogFail(option);
                        break;
                    case "offerpass":
                        var option = {
                            tab: $tab,
                            canId: id,
                        }
                        aD.sendOffer(option);
                        break;
                    case "offerfollow":
                        var option = {
                            tab: $tab,
                            id: id,
                            titleText: 'offer跟进',
                            successStatus: 'OFFERING',
                            successText: '确定',
                            failStatus: '',
                            failText: '取消',
                        }
                        aD.changeStatusDialog(option);
                        break;
                    case "entrypass":
                        var option = {
                            tab: $tab,
                            id: id,
                            titleText: '入职成功',
                            successStatus: 'HIRED',
                            successText: '确定',
                            failStatus: '',
                            failText: '取消',
                        }
                        aD.changeStatusDialog(option);
                        break;
                    case "entrynopass":
                        var option = {
                            tab: $tab,
                            dia: $("#dialog_fail"),
                            id: id,
                            seltitle: "失败原因",
                            title: '入职失败',
                            successStatus: "ENTRYFAIL",
                            successText: "确定",
                            failStatus: "",
                            failText: "取消",
                            handleType: "entryFail",
                        };
                        aD.dialogFail(option);
                        break;
                    case "g_pass":
                        var option = {
                            tab: $tab,
                            id: id,
                            titleText: '过保期',
                            successStatus: "OUTDATED",
                            successText: '确定',
                            failStatus: '',
                            failText: '取消',
                        }
                        aD.changeStatusDialog(option);
                        break;
                    case "g_nopass":
                        var option = {
                            tab: $tab,
                            dia: $("#dialog_fail"),
                            id: id,
                            seltitle: "失败原因",
                            title: '未通过保期',
                            successStatus: "UNOUTDATED",
                            successText: "确定",
                            failStatus: "",
                            failText: "取消",
                            handleType: "guranteeFail",
                        };
                        aD.dialogFail(option);
                        break;
                    case "offernopass":
                        var option = {
                            tab: $tab,
                            dia: $("#dialog_fail"),
                            id: id,
                            seltitle: "失败原因",
                            title: 'offer失败',
                            successStatus: "OFFERFAIL",
                            successText: "确定",
                            failStatus: "",
                            failText: "取消",
                            handleType: "offerFail",
                        };
                        aD.dialogFail(option);
                        break;
                    case "edit":
                        //编辑面试
                        var option = {
                            tab: $tab,
                            canId: id,
                            titleText: '修改面试',
                        }
                        aD.editInterview(option);
                        break;
                    case "return":
                        var option = {
                            tab: $tab,
                            id: id,
                            titleText: $target.attr("title"),
                            successStatus: '',
                            successText: '确定',
                            failStatus: '',
                            failText: '取消',
                            nowStatus: $ul.data("status"),
                            direction: "-1",
                            lableTitle: "返回原因",
                            placeHolder: "返回原因为必填",
                        }
                        aD.changeStatusDialog(option);
                        break;
                    case 'grab':
                        //抢占候选人
                        name = $target.closest('ul').data('canna');
                        util.confirm({
                            content: '你是否想成为 ' + name + ' 的负责人？',
                            okValue: '确定',
                            okCall: function() {
                                $.get(util.strFormat(inter.getApiUrl().grabHunter, [id]), function(re) {
                                    if (re.success) {
                                        $tab.trigger('click');
                                    } else {
                                        util.alertDialog(re.errMsg);
                                    }
                                });
                            },
                            cancelValue: '取消',
                        });
                        break;
                    case 'editoffer':
                        $.get(util.strFormat(inter.getApiUrl().getOfferInfo, [id]), function(data) {
                            if (data.success) {
                                var option = {
                                    tab: $('#tab_all'),
                                    canId: id,
                                    initdata: data.data,
                                }
                                aD.sendOffer(option);
                            } else {
                                util.alertDialog(data.errMsg);
                            }
                        });
                        break;
                }
            });
        },
        initlistForCom: function($objlist, option) {
            var page = 1,
                pageSize = 10,
                param = {},
                status = $objlist.find('select[name="txt_candidate_status"]').val(),
                name = $objlist.find('input[name="txt_candidate_name"]').val(),
                sourceTab = option.dataTab;
            list.init({
                target: $objlist.find('ul[name="ul_candidate_info"]'),
                pagination: $objlist.find('.pageCandidate'),
                noDataTpl: '<li class="#{noDataCls}">#{noDataText}</li>',
                itemTpl: [
                    '<li class="li-body">',
                    '<ul data-canid="#{canId}" data-canna="#{canName}" data-status="#{status}" data-pid="' + option.tabId + '"  data-mid="' + option.midId + '" >',
                    '<li class="li-com-canname">',
                    '<a href="#" name="canname" data-tab="' + sourceTab + '" >#{canName}</a>',
                    '</li>',
                    '<li class="li-com-pos" title="#{positionName}">#{positionName}</li>',
                    '<li class="li-com-phone" title="#{canPhone}">#{canPhone}</li>',
                    '<li class="li-com-email li-over" title="#{canEmail}">#{canEmail}</li>',
                    '<li  class="li-com-statue" title="#{canStatus}"><a href="javascript:" name="viewRemark" >#{canStatus}</a> <span class="badge badge-info interview-steps #{count_diaplay}">#{viewCount}</span></li>',
                    '<li class="li-com-other">',
                    '<a href="javascript:void(0);" name="view" data-id="#{canId}" title="查看"><i class="ace-icon fa fa-plus"></i></a>',
                    '</li>',
                    '<li class="li-com-handle">',
                    '<a href="javascript:void(0);" name="auditSucess" class="#{a_display}" title="审核通过"><i class="ace-icon fa fa-check" name="auditSucess"></i></a>',
                    '<a href="javascript:void(0);" name="auditFail" class="#{a_display}" title="审核未通过"><i class="ace-icon fa fa-times" name="auditFail"></i></a>',
                    '<a href="javascript:void(0);" name="launch_again" class="#{l_display}" title="发起面试"><i class="ace-icon fa fa-calendar-o" name="launch_again" ></i></a>',
                    '<a href="javascript:void(0);" name="notlaunch" class="#{l_display}" title="发起面试失败"><i class="ace-icon fa fa-times" name="notlaunch" ></i></a>',
                    '<a href="javascript:void(0);" name="recommend" class="#{r_display}" title="推荐"><i class="ace-icon fa fa-star" name="recommend"></i></a>',
                    '<a href="javascript:void(0)"  name="edit" class="#{edit_display}" title="修改面试"><i name="edit" class="ace-icon fa fa-calendar"></i></a>',
                    '<a href="javascript:void(0)" name="interview_sucess" class="#{is_display}" title="面试成功"><i class="ace-icon fa fa-calendar-check-o " name="interview_sucess" ></i></a>',
                    '<a href="javascript:void(0)" name="interview_fail" class="#{if_display}" title="面试失败"><i class="ace-icon fa fa-calendar-times-o " name="interview_fail" ></i></a>',
                    '<a href="javascript:void(0)" name="hold" class="#{h_display}" title="继续Hold"><i class="menu-icon fa fa-pause" name="hold"></i></a>',
                    '<a href="javascript:void(0)" name="launch_again" class="#{ag_display}" title="重新发起面试"><i class="ace-icon fa fa-calendar-plus-o" name ="launch_again"></i></a>',
                    '<a href="javascript:void(0)" name="offer" class="#{w_display}" title="待发OFFER"><i name="offer" class="ace-icon fa fa-envelope-o"></i></a>',
                    '<a href="javascript:void(0)" name="hold" class="#{ah_display}" title="暂时Hold"><i name="hold" class="menu-icon fa fa-pause"></i></a>',
                    '<a href="javascript:void(0)" name="cancel" class="#{c_display}" title="取消面试"><i name="cancel" class="menu-icon fa fa-times"></i></a>',
                    '<a href="javascript:void(0)" name="entrypass" class="#{entry_display}" title="入职成功"><i name="entrypass" class="menu-icon fa fa-check-circle-o"></i></a>',
                    '<a href="javascript:void(0)" name="entrynopass" class="#{entry_display}" title="入职失败"><i name="entrynopass" class="menu-icon fa fa-times-circle-o"></i></a>',
                    '<a href="javascript:void(0);" name="offerpass" class="#{offer_display}" title="提交offer" ><i name="offerpass" class="ace-icon fa fa-check-square-o""></i></a>',
                    '<a href="javascript:void(0);" name="offernopass" class="#{offer_display}" title="offer失败" ><i name="offernopass" class="ace-icon fa fa-times"  ></i></a>',
                    '<a href="javascript:void(0)" name="guaranteepass" class="#{guarantee_display}" title="过保期"><i name="guaranteepass" class="menu-icon fa fa-check"></i></a>',
                    '<a href="javascript:void(0)" name="guaranteenopass" class="#{guarantee_display}" title="未过保期"><i name="guaranteenopass" class="menu-icon fa fa-times"></i></a>',
                    '</li>',
                    '</ul>',
                    '</li>',
                    '<li id="detail-#{canId}" class="li-detail comDeatail">',
                    '<div class="detail">',
                    '<div class="detail-2" name="report">',
                    '</div>',
                    '</div>',
                    '</li>',
                ].join(''),
                getDataCallback: function(data) {
                    var arr = data.data,
                        objbna = {
                            "-1": "返回审核",
                            "-2": "返回待推荐",
                            "-3": "返回待审核",
                            "-4": "返回待面试",
                            "-8": "返回待入职",
                            "-7": "返回待发offer",
                            "-9": "返回保期内",
                            "7": "返回面试成功",
                        };
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].refunded || arr[i].Recruit) {
                            //如果是已退款
                            arr[i].status = -91;
                        }
                        arr[i]["canStatus"] = arr[i].status == 51 ? "未面试" : arr[i]["canStatus"];
                        arr[i]["isFormat"] = arr[i].status == 0 ? "非" : "标";
                        arr[i]["format_display"] = arr[i].status == 0 ? "" : "hide";
                        arr[i]["a_display"] = $.inArray(arr[i].status, [3]) >= 0 ? "" : "hide";
                        arr[i]["l_display"] = $.inArray(arr[i].status, [4]) >= 0 ? "" : "hide";
                        arr[i]["r_display"] = $.inArray(arr[i].status, [2]) >= 0 ? "" : "hide";
                        arr[i]["fl_display"] = $.inArray(arr[i].status, [-5]) >= 0 ? "" : "hide";
                        arr[i]["is_display"] = $.inArray(arr[i].status, [11, 52]) >= 0 ? "" : "hide";
                        arr[i]["if_display"] = $.inArray(arr[i].status, [11, 52]) >= 0 ? "" : "hide";
                        arr[i]["ah_display"] = $.inArray(arr[i].status, [52]) >= 0 ? "" : "hide";
                        arr[i]["c_display"] = $.inArray(arr[i].status, [51, 52]) >= 0 ? "" : "hide";
                        arr[i]["offer_display"] = $.inArray(arr[i].status, [7]) >= 0 ? "" : "hide";
                        arr[i]["entry_display"] = $.inArray(arr[i].status, [8]) >= 0 ? "" : "hide";
                        arr[i]["edit_display"] = $.inArray(arr[i].status, [51, 52]) >= 0 ? "" : "hide";
                        arr[i]["ag_display"] = $.inArray(arr[i].status, [11, 6, -6, -5]) >= 0 ? "" : "hide";
                        arr[i]["h_display"] = $.inArray(arr[i].status, [11]) >= 0 ? "" : "hide";
                        arr[i]["w_display"] = $.inArray(arr[i].status, [6]) >= 0 ? "" : "hide";
                        arr[i]["guarantee_display"] = $.inArray(arr[i].status, [9]) >= 0 ? "" : "hide";
                        arr[i]["count_diaplay"] = $.inArray(arr[i].status, [52]) >= 0 ? "" : "hide"; //面试数量
                        arr[i]["back_display"] = $.inArray(arr[i].status, [-3, -4, -7, -8, -9, 7]) >= 0 ? "" : "hide";
                    }
                    return data;
                },
                finishedCallback: function() {
                    $('.viewPresenter').hover(function(e) {
                        $(this).next().show();
                    }, function() {
                        $(this).next().hide();
                    });
                },
                page: page, //当前页码
                pageSize: pageSize, //分页大小
                param: {
                    positionId: option.tabId,
                    status: status,
                    name: name,
                },
                url: option.listUrl
            });
            $objlist.find('ul[name="ul_candidate_info"]').on("click", function(e) {
                var $target = e.target.nodeName.toLowerCase() == "i" ? $(e.target).parent() : $(e.target),
                    targetName = $target.attr("name"),
                    title = $target.attr("title"),
                    $ul = $target.closest("ul"),
                    id = $ul.data("canid"),
                    status = $ul.data("status"),
                    pid = $ul.data("pid"),
                    mid = $ul.data("mid"),
                    tabid = "newTabs-" + mid + pid,
                    targetTab = $('#management-ul-tabs'),
                    $tab = $('#' + tabid);
                var followDic = {
                    "3": "CUSTOMERAUDITING",
                    "9": "HIRED",
                };
                switch (targetName) {
                    case "view":
                        //查看
                        if ($target.find('i').hasClass('fa-plus')) {
                            if (id) {
                                $('#detail-' + id).find('[name=report]').load(util.strFormat(inter.getApiUrl().candiateFindById + "?dataId=" + id, [id]), function(response, status, xhr) {
                                    if (status == 'error') {
                                        return;
                                    }
                                    $('#detail-' + id).stop().slideDown('normal');
                                    $target.find('i').removeClass('fa-plus').addClass('fa-minus');
                                });
                            }
                        } else {
                            $('#detail-' + id).stop().slideUp('normal');
                            $target.find('i').removeClass('fa-minus').addClass('fa-plus');
                        }
                        break;
                    case "canname":
                        if ($("#sidebar-collapse").find("i").hasClass('fa-angle-double-left')) {
                            $("#sidebar-collapse").trigger("click");
                        }
                        //查看简历
                        var name = $target.text(),
                            tab = $target.data('tab') ? $target.data('tab') : $target.parent().data('tab');
                        tabMenu.addTab({
                            tabId: id,
                            tabName: name,
                            dataTab: tab,
                            target: targetTab,
                            url: inter.getApiUrl().getCandidateDetail,
                            parentId: mid + pid
                        });
                        break;
                    case "auditSucess":
                        var option = {
                            canId: id,
                            tab: $tab,
                        }
                        aD.customerAuditPass(option);
                        break;
                    case "auditFail":
                        var option = {
                            tab: $tab,
                            dia: $("#dialog_fail"),
                            id: id,
                            title: '审核失败',
                            successStatus: "CUSTOMERAUDITFAIL",
                            successText: "审核失败",
                            failStatus: "",
                            failText: "取消",
                            handleType: "customerAuditFail",
                        };
                        aD.dialogFail(option);
                        break;
                    case "launch_again":
                        var option = {
                            tab: $tab,
                            canId: id,
                            titleText: "重新发起面试",
                        }
                        aD.interviewDialog(option);
                        break;
                    case "notlaunch":
                        //取消发起面试
                        var option = {
                            tab: $tab,
                            dia: $("#dialog_fail"),
                            id: id,
                            title: title,
                            seltitle: "失败原因",
                            successStatus: "FORINTERVIEWFAIL",
                            successText: "确定",
                            failStatus: "",
                            failText: "取消",
                            handleType: "launchFail",
                        };
                        aD.dialogFail(option);
                        break;
                    case "hold":
                        var option = {
                            tab: $tab,
                            dia: $("#dialog_fail"),
                            id: id,
                            seltitle: "hold原因",
                            title: '暂时HOLD',
                            successStatus: "HOLD",
                            successText: "提交",
                            failStatus: "",
                            failText: "取消",
                            handleType: "hold",
                            ishold: true,
                        };
                        aD.dialogFail(option);
                        break;
                    case "interview_sucess":
                        var option = {
                            tab: $tab,
                            id: id,
                            titleText: '面试成功',
                            successStatus: 'INTERVIEWSUCC',
                            successText: '面试成功',
                            failStatus: '',
                            failText: '取消',
                        }
                        aD.changeStatusDialog(option);
                        break;
                    case "interview_fail":
                        var option = {
                            tab: $tab,
                            dia: $("#dialog_fail"),
                            id: id,
                            title: title,
                            successStatus: "INTERVIEWFAIL",
                            successText: "提交",
                            failStatus: "",
                            failText: "取消",
                            handleType: "interviewFail",
                        };
                        aD.dialogFail(option);
                        break;
                    case "edit":
                        //编辑面试
                        var option = {
                            tab: $tab,
                            canId: id,
                            titleText: '修改面试',
                        }
                        aD.editInterview(option);
                        break;
                    case "cancel":
                        var option = {
                            tab: $tab,
                            dia: $("#dialog_fail"),
                            seltitle: "取消原因",
                            id: id,
                            title: title,
                            successStatus: "INTERVIEWCANCLE",
                            successText: "确定",
                            failStatus: "",
                            failText: "取消",
                            handleType: "cancelInterview",
                        };
                        aD.dialogFail(option);
                        break;
                    case "offer":
                        var option = {
                            tab: $tab,
                            id: id,
                            titleText: '待发OFFER',
                            successStatus: 'OFFERING',
                            successText: '确定',
                            failStatus: '',
                            failText: '取消',
                        }
                        aD.changeStatusDialog(option);
                        break;
                    case "offerpass":
                        var option = {
                            tab: $tab,
                            canId: id,
                        }
                        aD.sendOffer(option);
                        break;
                    case "offernopass":
                        var option = {
                            tab: $tab,
                            dia: $("#dialog_fail"),
                            id: id,
                            seltitle: "失败原因",
                            title: 'offer失败',
                            successStatus: "OFFERFAIL",
                            successText: "确定",
                            failStatus: "",
                            failText: "取消",
                            handleType: "offerFail",
                        };
                        aD.dialogFail(option);
                        break;
                    case "entrypass":
                        var option = {
                            tab: $tab,
                            id: id,
                            titleText: '入职成功',
                            successStatus: 'HIRED',
                            successText: '确定',
                            failStatus: '',
                            failText: '取消',
                        }
                        aD.changeStatusDialog(option);
                        break;
                    case "entrynopass":
                        var option = {
                            tab: $tab,
                            dia: $("#dialog_fail"),
                            id: id,
                            seltitle: "失败原因",
                            title: '入职失败',
                            successStatus: "ENTRYFAIL",
                            successText: "确定",
                            failStatus: "",
                            failText: "取消",
                            handleType: "entryFail",
                        };
                        aD.dialogFail(option);
                        break;
                    case "guaranteepass":
                        var option = {
                            tab: $tab,
                            id: id,
                            titleText: '过保期',
                            successStatus: "OUTDATED",
                            successText: '确定',
                            failStatus: '',
                            failText: '取消',
                        }
                        aD.changeStatusDialog(option);
                        break;
                    case "guaranteenopass":
                        var option = {
                            tab: $tab,
                            dia: $("#dialog_fail"),
                            id: id,
                            seltitle: "失败原因",
                            title: '未通过保期',
                            successStatus: "UNOUTDATED",
                            successText: "确定",
                            failStatus: "",
                            failText: "取消",
                            handleType: "guranteeFail",
                        };
                        aD.dialogFail(option);
                        break;
                    case "return":
                        var option = {
                            tab: $tab,
                            id: id,
                            titleText: $target.attr("title"),
                            successStatus: '',
                            successText: '确定',
                            failStatus: '',
                            failText: '取消',
                            nowStatus: $ul.data("status"),
                            direction: "-1",
                            lableTitle: "返回原因",
                            placeHolder: "返回原因为必填",
                        }
                        aD.changeStatusDialog(option);
                        break;
                }
            });
        },
        initlistForSys: function($objlist, option) {
            var page = 1,
                pageSize = 10,
                param = {},
                status = $objlist.find('select[name="txt_candidate_status"]').val(),
                name = $objlist.find('input[name="txt_candidate_name"]').val(),
                sourceTab = option.dataTab;
            list.init({
                target: $objlist.find('ul[name="ul_candidate_info"]'),
                pagination: $objlist.find('.pageCandidate'),
                noDataTpl: '<li class="#{noDataCls}">#{noDataText}</li>',
                itemTpl: [
                    '<li class="li-body">',
                    '<ul data-canid="#{canId}" data-canna="#{canName}" data-status="#{status}" data-email="#{canEmail}" data-pid="' + option.tabId + '"  data-mid="' + option.midId + '" >',
                    '<li class="li-canname">#{canName}</li>',
                    '<li class="li-over" title="#{positionName}">#{positionName}</li>',
                    '<li class="li-com li-over" title="#{companyName}">#{companyName}</li>',
                    '<li class="li-phone" title="#{canPhone}">#{canPhone}</li>',
                    '<li class="li-email li-over" title="#{canEmail}">#{canEmail}</li>',
                    '<li class="li-presenter" title="#{presenterName}">#{presenterName}</li>',
                    '<li  class="li-statue" title="#{canStatus}">#{canStatus}</li>',
                    '<li class="li-recommendtime">#{recommendTime}</li>',
                    '</ul>',
                    '</li>',
                ].join(''),
                getDataCallback: function(data) {
                    // console.log(data.data);
                    var arr = data.data;
                    for (var i = arr.length - 1; i >= 0; i--) {
                        arr[i]['presenterName'] = arr[i]['presenterName'] ? arr[i]['presenterName'] : arr[i]['presenterUserName'];
                    };
                    return data;
                },
                finishedCallback: function() {},
                page: page, //当前页码
                pageSize: pageSize, //分页大小
                param: {
                    positionId: option.tabId,
                    status: status,
                    name: name,
                },
                url: option.listUrl
            });
        }
    }
});
