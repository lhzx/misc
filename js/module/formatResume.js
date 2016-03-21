'use strict';
/*jslint browser: true*/
/*global $, jQuery*/
/**
 * @description: 标准化简历
 * @author: duyutao(452661976@qq.com)
 * @update:
 */
define('module/formatResume', [
    'common/util',
    'common/interface',
    'module/tabMenu',
    'module/dialogPop'
], function (util, inter, tabMenu, pop) {
    return {
        /**
         * 职位标准化；根据传过来的对象，对界面内的元素进行初始化操作
         */
        init: function (obj, op) {
            var $that = obj,
                dialog_work,
                dialog_project,
                dialog_edu;
            var option = {
                url: inter.getApiUrl().unificationiInfoSave
            };
            option = $.extend({}, option, op);
            //初始化datepicker
            $that.find('input[name="birthday"]').datepicker({
                language: 'zh-CN',
                format: "yyyy-mm-dd",
                autoclose: true,
            });
            $that.find('input[name=startTime],input[name=endTime]').datepicker({
                language: 'zh-CN',
                format: "yyyy-mm",
                autoclose: true,
            });
            //添加验证
            var validateFormValidate = $that.find('form[name="infoForm"]').validate({
                errorElement: 'div',
                errorClass: 'help-block',
                rules: {
                    name: 'required',
                    mobilePhone: {
                        required: true, //必填
                        digits: true, //只能输入整数
                        minlength: 11,
                        maxlength: 11 //数字长度11位
                    },
                    expectArea: 'required',
                    expectPositions: 'required',
                    expectIndustry: 'required',
                    idcard: {
                        digits: true
                    },
                    Msalary: {
                        digits: true,
                    },
                    month: {
                        digits: true,
                    },
                    all: {
                        required: true,
                        digits: true,
                    },
                    expectMsalary: {
                        digits: true,
                    },
                    expectmonth: {
                        digits: true,
                    },
                    expectall: {
                        required: true,
                        digits: true,
                    }
                },
                highlight: function (e) {
                    $(e).closest('.form-group').removeClass('has-info').addClass('has-error');
                    $('html,body').animate({
                        scrollTop: $('.has-error').eq(0).offset().top - 70
                    }, 300);
                },
                success: function (e) {
                    $(e).closest('.form-group').removeClass('has-error').addClass('has-info');
                    $(e).remove();
                }
            });
            $that.find('.has-error').removeClass('has-error');
            validateFormValidate.resetForm();
            // 标准化  弹出框添加工作经历信息
            $that.find('a[name="btn_addworkinfo"]').on('click', function (e) {
                e.preventDefault();
                if (dialog_work) {
                    dialog_work.find('form[name="addWorkInfoForm"]')[0].reset();
                    dialog_work.find('form[name="addWorkInfoForm"]').find(':disabled').removeAttr('disabled');
                    dialog_work.dialog("open");
                } else {
                    dialog_work = $that.find('div[name="add_workinfo"]').removeClass('hide').dialog({
                        resizable: false,
                        width: '500',
                        modal: true,
                        title: '<div class="widget-header widget-header-small"><h4 class="smaller">新增工作经历</h4></div>',
                        open: function () {
                            $(this).find('form[name="addWorkInfoForm"]')[0].reset();
                            $(this).find('div[name="addWorkInfoForm"]').find(':disabled').removeAttr('disabled');
                        },
                        title_html: true,
                        buttons: [{
                            html: "确定",
                            "class": "btn btn-primary btn-xs",
                            click: function () {
                                var $this = $(this),
                                    name = $this.find('input[name=company]').val(),
                                    work = $this.find('input[name="position"]').val(),
                                    starttime = $this.find('input[name="startTime"]').val(),
                                    status = $this.find('input[name="workinfonow"]').prop("checked"),
                                    infos = $this.find('textarea[name="description"]').val(),
                                    endtime = $this.find('input[name="endTime"]').val();
                                if (name == "" && work == "" && starttime == "" && status == "" && infos == "" && endtime == "") {
                                    $(this).dialog("close");
                                    return false;
                                }
                                if (status) {
                                    $this.closest("div").find('input[name="endTime"]').attr('disabled', 'disabled');
                                } else {
                                    $this.closest("div").find('input[name="endTime"]').removeAttr("disabled");
                                }
                                $that.find('div[name="workinfo"]').prepend('<div class="workInfoNum" name="workInfoNum">' + '<div class="form-group">' + '<label class="col-sm-3 control-label no-padding-left"  >公司名称 </label>' + '<div class="col-sm-3">' + ' <input type="text" class="col-xs-6 col-sm-12" name="company" id="companyname" value="' + name + '">' + '</div>' + '<label class="col-sm-3 control-label no-padding-left"  > 职位 </label>' + '<div class="col-sm-3">' + '<input type="text" name="position" class="col-xs-6 col-sm-12" value="' + work + '">' + '</div>' + '</div>' + '<div class="form-group">' + '<label class="col-sm-3 control-label no-padding-left" for="companyselect">时间 </label>' + '<div class="col-sm-9 form-unit">' + '<input type="text" id="workstarttime" name="startTime" placeholder="开始时间" class="valid col-xs-10 col-sm-3" value="' + starttime + '">' + '<label class="col-xs-10 col-sm-2 text-center">——</label>' + '<input type="text" id="workendtime" name="endTime" placeholder="结束时间" class="col-xs-10 col-sm-3" ' + (status ? 'disabled="disabled",value="至今"' : 'value="' + endtime + '"') + '>' + '<label class="checkbox col-sm-3">' + '<input name="workinfonow" id="workinfonow" type="checkbox" ' + (status ? 'checked="checked"' : '') + ' class="ace">' + '<span class="lbl"> 至今</span>' + '</label>' + '</div>' + '</div>' + '<div class="form-group">' + '<label class="col-sm-3 control-label no-padding-left" for="companyselect">工作描述</label>' + '<div class="col-sm-9 ">' + '<textarea name="description"  class="no-resize col-xs-10 col-sm-12 text-hei" cols="50" row="30">' + infos + '</textarea>' + '</div>' + '</div>' + '<div class="info-de">' + '<button class="btn btn-shanchu" type="button" id="work_det" name="work_det">' + '删除' + '</button>' + '</div>' + '</div>');
                                $that.find('div[name="workinfo"]>.workInfoNum:first-child').find('[name=startTime],[name=endTime]').datepicker({
                                    language: 'zh-CN',
                                    format: "yyyy-mm",
                                    autoclose: true,
                                });
                                $(this).dialog("close");
                            }
                        }, {
                            html: "取消",
                            "class": "btn btn-xs",
                            click: function () {
                                $(this).dialog("close");
                            }
                        }]
                    });
                }
            });
            // 标准化 弹出框添加项目经验信息
            $that.find('a[name="btn_addproinfo"]').on('click', function (e) {
                e.preventDefault();
                if (dialog_project) {
                    dialog_project.find('form[name="addProInfoForm"]')[0].reset();
                    dialog_project.find('form[name="addProInfoForm"]').find(':disabled').removeAttr('disabled');
                    dialog_project.dialog("open");
                } else {
                    dialog_project = $that.find('div[name="add_proinfo"]').removeClass('hide').dialog({
                        resizable: false,
                        width: '500',
                        modal: true,
                        title: '<div class="widget-header widget-header-small"><h4 class="smaller">新增项目经验</h4></div>',
                        title_html: true,
                        open: function () {
                            $(this).find('form[name="addProInfoForm"]')[0].reset();
                            $(this).find('form[name="addProInfoForm"]').find(':disabled').removeAttr('disabled');
                        },
                        buttons: [{
                            html: "确定",
                            "class": "btn btn-primary btn-xs",
                            click: function () {
                                var $this = $(this);
                                var name = $this.find('input[name="project"]').val(),
                                    //项目名称
                                    starttime = $this.find('input[name="startTime"]').val(),
                                    //开始时间
                                    infos = $this.find('textarea[name="description"]').val(),
                                    status = $this.find('input[name="workinfonow"]').prop("checked");
                                if (name == "" && starttime == "" && status == "" && infos == "") {
                                    $(this).dialog("close");
                                    return false;
                                }
                                if (status) {
                                    $this.closest("div").find('input[name="endTime"]').attr('disabled', 'disabled');
                                } else {
                                    $this.closest("div").find('input[name="endTime"]').removeAttr("disabled");
                                    var endtime = $this.find('input[name="endTime"]').val();
                                } // 结束时间
                                //项目描述
                                //console.log($infos);
                                $that.find('div[name="proinfo"]').prepend('<div class="proInfoNum" name="proInfoNum">' + '<div class="form-group" >' + '<label class="col-sm-3 control-label no-padding-left"  >项目名称 </label>' + '<div class="col-sm-9">' + '<input type="text" name="project" id="proname" class="col-xs-10 col-sm-12" value="' + name + '">' + '</div>' + '</div>' + '<div class="form-group">' + '<label class="col-sm-3 control-label no-padding-left" for="companyselect">时间 </label>' + '<div class="col-sm-9 form-unit">' + '<input type="text" id="prostarttime" name="startTime" placeholder="开始时间" class="valid col-xs-10 col-sm-3" value="' + starttime + '">' + '<label class="col-xs-10 col-sm-2 text-center">——</label>' + '<input type="text" id="proendtime" name="endTime" placeholder="结束时间" class="col-xs-10 col-sm-3"  ' + (status ? 'disabled="disabled",value="至今"' : 'value="' + endtime + '"') + '>' + '<label class="checkbox col-sm-3">' + '<input name="workinfonow" type="checkbox" ' + (status ? 'checked="checked"' : '') + ' class="ace">' + '<span class="lbl"> 至今</span>' + '</label>' + '</div>' + '</div>' + '<div class="form-group">' + '<label class="col-sm-3 control-label no-padding-left" id="proinfos" for="companyselect">项目描述</label>' + '<div class="col-sm-9 ">' + '<textarea name="description"  id="prodes"  class="no-resize text-hei col-xs-10 col-sm-12" cols="50" row="30">' + infos + '</textarea>' + '</div>' + '</div>' + '<div class="info-de">' + '<button class="btn btn-shanchu" name="pro_det">' + '删除' + '</button>' + '</div>' + '</div>');
                                $that.find('div[name="proinfo"]>.proInfoNum:first-child').find('[name=startTime],[name=endTime]').datepicker({
                                    language: 'zh-CN',
                                    format: "yyyy-mm",
                                    autoclose: true,
                                });
                                $(this).dialog("close");
                            }
                        }, {
                            html: "取消",
                            "class": "btn btn-xs",
                            click: function () {
                                $(this).dialog("close");
                            }
                        }]
                    });
                }
            });
            //行业弹出框
            $that.find('[name=industryName]').on('click', function () {
                $('#industryDialog').removeClass('hide').dialog({
                    resizable: false,
                    width: '800',
                    modal: true,
                    title: '<div class="widget-header widget-header-small"><h4 class="smaller">选择行业</h4></div>',
                    title_html: true,
                    open: function () {
                        var thisStr = $that.find('[name=industryName]').val() === '' ? '' : $that.find('[name=industryName]').val().split(','),
                            thisKey = $that.find('[name=industry]').val() === '' ? '' : $that.find('[name=industry]').val().split(','),
                            tagList = [],
                            i = 0,
                            l = thisStr.length,
                            tabTag = '';
                        //用于回显
                        if (thisStr.length > 0) {
                            for (i; i < l; i++) {
                                tabTag = '<span data-id=' + thisKey[i] + ' class="itemSelected">' + thisStr[i] + '<i class="fa fa-times"></i></span>';
                                tagList.push(tabTag);
                            }
                            $('#industryDialog').find('.tab-chosen').empty().html(tagList.join(''));
                        } else {
                            $('#industryDialog').find('.tab-chosen').empty();
                            $('#industryDialog').find('.active').removeClass('active');
                        }
                        // 一次性加载全部列表
                        pop.dialogInit({
                            target: $('#industryDialog'),
                            type: 1,
                            level: 'second',
                            limit: 1
                        });
                    },
                    buttons: [{
                        html: '确定',
                        'class': 'btn btn-primary btn-xs',
                        click: function () {
                            //1:弹框对象 2:需要传值的input, 3: 需要传ID的inout 
                            pop.fnSubmit({
                                target: $('#industryDialog'),
                                target1: $that.find('[name=industryName]'),
                                target2: $that.find('[name=industry]')
                            });
                            $(this).dialog('close');
                        }
                    }, {
                        html: '取消',
                        'class': 'btn btn-xs',
                        click: function () {
                            $(this).dialog('close');
                        }
                    }]
                });
            });
            //所在地弹框
            $that.find('[name=areaName]').on('click', function () {
                $('#workplaceDialog').removeClass('hide').dialog({
                    resizable: false,
                    width: '800',
                    modal: true,
                    title: '<div class="widget-header widget-header-small"><h4 class="smaller">选择所在地</h4></div>',
                    title_html: true,
                    open: function () {
                        var thisStr = $that.find('[name=areaName]').val() === '' ? '' : $that.find('[name=areaName]').val().split(','),
                            thisKey = $that.find('[name=area]').val() === '' ? '' : $that.find('[name=area]').val().split(','),
                            tagList = [],
                            i = 0,
                            l = thisStr.length,
                            tabTag = '';
                        //用于回显
                        if (thisStr.length > 0) {
                            for (i; i < l; i++) {
                                tabTag = '<span data-id=' + thisKey[i] + ' class="itemSelected">' + thisStr[i] + '<i class="fa fa-times"></i></span>';
                                tagList.push(tabTag);
                            }
                            $('#workplaceDialog').find('.tab-chosen').empty().html(tagList.join(''));
                        } else {
                            $('#workplaceDialog').find('.tab-chosen').empty();
                            $('#workplaceDialog').find('.active').removeClass('active');
                        }
                        //一次性加载全部列表
                        pop.dialogInit({
                            target: $('#workplaceDialog'),
                            type: 3,
                            level: 'second',
                            limit: 1
                        });
                    },
                    buttons: [{
                        html: '确定',
                        'class': 'btn btn-primary btn-xs',
                        click: function () {
                            //1:弹框对象 2:需要传值的input, 3: 需要传ID的inout 
                            pop.fnSubmit({
                                target: $('#workplaceDialog'),
                                target1: $that.find('[name=areaName]'),
                                target2: $that.find('[name=area]')
                            });
                            $(this).dialog('close');
                        }
                    }, {
                        html: '取消',
                        'class': 'btn btn-xs',
                        click: function () {
                            $(this).dialog('close');
                        }
                    }]
                });
            });
            // 标准化 弹出框添加教育经历信息
            $that.find('a[name="btn_addstudyinfo"]').on('click', function (e) {
                e.preventDefault();
                if (dialog_edu) {
                    dialog_edu.find('form[name="addStudyInfoForm"]')[0].reset();
                    dialog_edu.find('form[name="addStudyInfoForm"]').find(':disabled').removeAttr('disabled');
                    dialog_edu.dialog("open");
                } else {
                    dialog_edu = $("#add_studyinfo").removeClass('hide').dialog({
                        resizable: false,
                        width: '500',
                        modal: true,
                        title: '<div class="widget-header widget-header-small"><h4 class="smaller">新增教育经历</h4></div>',
                        title_html: true,
                        open: function () {
                            $(this).find('form[name="addStudyInfoForm"]')[0].reset();
                            $(this).find('form[name="addStudyInfoForm"]').find(':disabled').removeAttr('disabled');
                        },
                        buttons: [{
                            html: "确定",
                            "class": "btn btn-primary btn-xs",
                            click: function () {
                                var $this = $(this),
                                    school = $this.find('input[name="school"]').val(),
                                    //学校名称
                                    degree = $this.find('input[name="degree"]').val(),
                                    //学历
                                    major = $this.find('input[name="major"]').val(),
                                    // 专业
                                    starttime = $this.find('input[name="startTime"]').val(),
                                    //开始时间
                                    status = $this.find('input[name="workinfonow"]').prop("checked");
                                if (school == "" && degree == "" && starttime == "" && major == "") {
                                    $(this).dialog("close");
                                    return false;
                                }
                                if (status) {
                                    $this.closest("div").find('input[name="endTime"]').attr('disabled', 'disabled');
                                } else {
                                    $this.closest("div").find('input[name="endTime"]').removeAttr("disabled");
                                    var endtime = $this.find('input[name="endTime"]').val();
                                }
                                //console.log($infos);
                                $that.find('div[name="eduInfo"]').prepend('<div class="eduInfoNum" name="eduInfoNum">' + '<div class="form-group" >' + '<label class="col-sm-3 control-label no-padding-left"  >学校 </label>' + '<div class="col-sm-9">' + '<input type="text" class="col-xs-12 col-sm-12" name="school" value="' + school + '">' + '</div>' + '</div>' + '<div class="form-group" >' + '<label class="col-sm-3 control-label no-padding-left"  >学历 </label>' + '<div class="col-sm-3">' + '<input type="text" class="col-xs-6 col-sm-12" name="degree" value="' + degree + '">' + '</div>' + '<label class="col-sm-3 control-label no-padding-left"  > 专业 </label>' + '<div class="col-sm-3">' + '<input type="text" name="major" class="col-xs-6 col-sm-12" value="' + major + '"">' + '</div>' + '</div>' + '<div class="form-group">' + '<label class="col-sm-3 control-label no-padding-left" for="companyselect">时间 </label>' + '<div class="col-sm-9 form-unit">' + '<input type="text"  id="studystarttime" name="startTime" placeholder="开始时间" class="valid col-xs-10 col-sm-3" value="' + starttime + '">' + '<label class="col-xs-10 col-sm-2 text-center">——</label>' + '<input type="text" id="studyendtime" name="endTime" placeholder="结束时间" class="col-xs-10 col-sm-3" ' + (status ? 'disabled="disabled",value="至今"' : 'value="' + endtime + '"') + '>' + '<label class="checkbox col-sm-3">' + '<input name="workinfonow" type="checkbox" ' + (status ? 'checked="checked"' : '') + ' class="ace">' + '<span class="lbl"> 至今</span>' + '</label>' + '</div>' + '</div>' + '<div class="info-de">' + '<button class="btn btn btn-shanchu" name="edu_det" type="button">' + '删除' + '</button>' + '</div>' + '</div>');
                                $that.find('div[name="eduInfo"]>.eduInfoNum:first-child').find('[name=startTime],[name=endTime]').datepicker({
                                    language: 'zh-CN',
                                    format: "yyyy-mm",
                                    autoclose: true,
                                });
                                $(this).dialog("close");
                            }
                        }, {
                            html: "取消",
                            "class": "btn btn-xs",
                            click: function () {
                                $(this).dialog("close");
                            }
                        }]
                    });
                }
            });

            //时间为至今时 结束时间为灰色
            $that.find('form[name="infoForm"],form[name="addWorkInfoForm"],form[name="addProInfoForm"],form[name="addStudyInfoForm"]').on("click", "input[name='workinfonow']", function (e) {
                var status = $(this).prop("checked");
                if (status) {
                    $(this).closest("div").find('input[name="endTime"]').attr('disabled', 'disabled');
                } else {
                    $(this).closest("div").find('input[name="endTime"]').removeAttr("disabled");
                }
            });
            //工作经历删除
            $that.find('div[name="workinfo"]').on("click", "button[name='work_det']", function (e) {
                $(this).closest('div[name="workInfoNum"]').remove();
            });
            //项目经验删除
            $that.find('div[name="proinfo"]').on("click", "button[name='pro_det']", function (e) {
                $(this).closest('div[name="proInfoNum"]').remove();
            });
            //教育经历删除
            $that.find('div[name="eduInfo"]').on("click", "button[name='edu_det']", function (e) {
                $(this).closest('div[name="eduInfoNum"]').remove();
            });
            //期望行业弹窗
            //一次性加载全部列表
            $that.find('[name=expectIndustry]').on('click', function () {
                $('#industryDialog').removeClass('hide').dialog({
                    resizable: false,
                    width: '800',
                    modal: true,
                    title: '<div class="widget-header widget-header-small"><h4 class="smaller">选择期望行业</h4></div>',
                    title_html: true,
                    open: function () {
                        var thisStr = $that.find('[name=expectIndustry]').val() === '' ? '' : $that.find('[name=expectIndustry]').val().split(','),
                            thisKey = $that.find('[name=expectIndustryKey]').val() === '' ? '' : $that.find('[name=expectIndustryKey]').val().split(','),
                            tagList = [],
                            i = 0,
                            l = thisStr.length,
                            tabTag = '';
                        //用于回显
                        if (thisStr.length > 0) {
                            for (i; i < l; i++) {
                                tabTag = '<span data-id=' + thisKey[i] + ' class="itemSelected">' + thisStr[i] + '<i class="fa fa-times"></i></span>';
                                $('#hotCity').find('[data-id=' + thisKey[i] + ']').addClass('active');
                                tagList.push(tabTag);
                            }
                            $('#industryDialog').find('.tab-chosen').empty().html(tagList.join(''));
                        } else {
                            $('#industryDialog').find('.tab-chosen').empty();
                            $('#industryDialog').find('.active').removeClass('active');
                        }
                        pop.dialogInit({
                            target: $('#industryDialog'),
                            type: 1,
                            level: 'second',
                            limit: 3
                        });
                    },
                    buttons: [{
                        html: '确定',
                        'class': 'btn btn-primary btn-xs',
                        click: function () {
                            //1:弹框对象 2:需要传值的input, 3: 需要传ID的inout 
                            pop.fnSubmit({
                                target: $('#industryDialog'),
                                target1: $that.find('[name=expectIndustry]'),
                                target2: $that.find('[name=expectIndustryKey]')
                            });
                            $(this).dialog('close');
                        }
                    }, {
                        html: '取消',
                        'class': 'btn btn-xs',
                        click: function () {
                            $(this).dialog('close');
                        }
                    }]
                });
            });
            //期望职位列表弹框
            $that.find('[name=expectPositions]').on('click', function () {
                $('#categoryDialog').removeClass('hide').dialog({
                    resizable: false,
                    width: '800',
                    modal: true,
                    title: '<div class="widget-header widget-header-small"><h4 class="smaller">选择期望职位</h4></div>',
                    title_html: true,
                    open: function () {
                        var thisStr = $that.find('[name=expectPositions]').val() === '' ? '' : $that.find('[name=expectPositions]').val().split(','),
                            thisKey = $that.find('[name=expectPositionsKey]').val() === '' ? '' : $that.find('[name=expectPositionsKey]').val().split(','),
                            tagList = [],
                            i = 0,
                            l = thisStr.length,
                            tabTag = '';
                        //用于回显
                        if (thisStr.length > 0) {
                            for (i; i < l; i++) {
                                tabTag = '<span data-id=' + thisKey[i] + ' class="itemSelected">' + thisStr[i] + '<i class="fa fa-times"></i></span>';
                                $('#hotCity').find('[data-id=' + thisKey[i] + ']').addClass('active');
                                tagList.push(tabTag);
                            }
                            $('#categoryDialog').find('.tab-chosen').empty().html(tagList.join(''));
                        } else {
                            $('#categoryDialog').find('.tab-chosen').empty();
                            $('#categoryDialog').find('.active').removeClass('active');
                        }
                        //一次性加载全部列表
                        pop.dialogInit({
                            target: $('#categoryDialog'),
                            type: 2,
                            level: 'third',
                            limit: 3
                        });
                    },
                    buttons: [{
                        html: '确定',
                        'class': 'btn btn-primary btn-xs',
                        click: function () {
                            //1:弹框对象 2:需要传值的input, 3: 需要传ID的inout 
                            pop.fnSubmit({
                                target: $('#categoryDialog'),
                                target1: $that.find('[name=expectPositions]'),
                                target2: $that.find('[name=expectPositionsKey]')
                            });
                            $(this).dialog('close');
                        }
                    }, {
                        html: '取消',
                        'class': 'btn btn-xs',
                        click: function () {
                            $(this).dialog('close');
                        }
                    }]
                });
            });
            //期望工作城市列表弹框
            $that.find('[name=expectArea]').on('click', function () {
                $('#workplaceDialog').removeClass('hide').dialog({
                    resizable: false,
                    width: '800',
                    modal: true,
                    title: '<div class="widget-header widget-header-small"><h4 class="smaller">选择期望工作地点</h4></div>',
                    title_html: true,
                    open: function () {
                        var thisStr = $that.find('[name=expectArea]').val() === '' ? '' : $that.find('[name=expectArea]').val().split(','),
                            thisKey = $that.find('[name=expectAreaKey]').val() === '' ? '' : $that.find('[name=expectAreaKey]').val().split(','),
                            tagList = [],
                            i = 0,
                            l = thisStr.length,
                            tabTag = '';
                        //用于回显
                        if (thisStr.length > 0) {
                            for (i; i < l; i++) {
                                tabTag = '<span data-id=' + thisKey[i] + ' class="itemSelected">' + thisStr[i] + '<i class="fa fa-times"></i></span>';
                                $('#hotCity').find('[data-id=' + thisKey[i] + ']').addClass('active');
                                tagList.push(tabTag);
                            }
                            $('#workplaceDialog').find('.tab-chosen').empty().html(tagList.join(''));
                        } else {
                            $('#workplaceDialog').find('.tab-chosen').empty();
                            $('#workplaceDialog').find('.active').removeClass('active');
                        }
                        //一次性加载全部列表
                        pop.dialogInit({
                            target: $('#workplaceDialog'),
                            type: 3,
                            level: 'second',
                            limit: 3
                        });
                    },
                    buttons: [{
                        html: '确定',
                        'class': 'btn btn-primary btn-xs',
                        click: function () {
                            //1:弹框对象 2:需要传值的input, 3: 需要传ID的input 
                            pop.fnSubmit({
                                target: $('#workplaceDialog'),
                                target1: $that.find('[name=expectArea]'),
                                target2: $that.find('[name=expectAreaKey]')
                            });
                            $(this).dialog('close');
                        }
                    }, {
                        html: '取消',
                        'class': 'btn btn-xs',
                        click: function () {
                            $(this).dialog('close');
                        }
                    }]
                });
            });
            //数据提交
            $that.find('a[name=submit]').off("click").on('click', function () {
                var data = {},
                    $form = $that.find("form");
                if (!validateFormValidate.form()) {
                    return;
                }
                data['filePath'] = $form.find('input[name=filePath]').val(); //文件路径
                data['type'] = $form.find('input[name=type]').val();//简历类型
                data['fileName'] = $form.find('input[name=fileName]').val();//文件名称
                data['cid'] = $form.find('input[name=candidateID]').val();
                data['id'] = $form.find('input[name=resumeID]').val();
                data['name'] = $form.find('input[name=name]').val(); //姓名
                data['gender'] = $form.find("input[name='gender']:checked").val(); //性别
                data['mobilePhone'] = $form.find("input[name='mobilePhone']").val(); //手机号
                data['email'] = $form.find("input[name='email']").val(); //邮箱
                data['IDNO'] = $form.find("input[name='IDNO']").val(); //身份证号码
                data['birthday'] = $form.find("input[name='birthday']").val(); //生日
                data['marriage'] = $form.find("input[name='marriage']:checked").val(); //婚姻状况
                data['selfEvaluation'] = $form.find("#selfeva").val().replace(/\n/g, '[br]'); //自我介绍
                data['expectIndustry'] = $form.find('[name=expectIndustryKey]').val(); //期望行业
                data['expectPositions'] = $form.find('[name=expectPositionsKey]').val(); //期望职位
                data['expectArea'] = $form.find('[name=expectAreaKey]').val(); //期望工作地点
                data['workingStatus'] = $form.find("#workingStatus").val(); //工作状态
                data['workRange'] = $form.find("input[name='workRange']").val(); //工作年限
                data['area'] = $form.find("input[name='area']").val(); //工作地址
                data['industry'] = $form.find("input[name='industry']").val(); //行业
                data['monthSalary'] = $form.find("input[name='monthSalary']").val(); //当前月薪
                data['month'] = $form.find("input[name='month']").val(); //当前月
                data['ecpectMonthSalary'] = $form.find("input[name='ecpectMonthSalary']").val(); //期望月薪
                data['ecpectMonth'] = $form.find("input[name='ecpectMonth']").val(); //期望月
                //工作经历 数据获取
                var arrworkExps = [];
                $form.find("div[name='workInfoNum']").each(function () {
                    var objwork = {};
                    $("#workinfonow").prop("checked", function () {
                        if (true) {
                            $(this).closest("div").find('input[name="endTime"]').attr('disabled', 'disabled');
                        } else {
                            $(this).closest("div").find('input[name="endTime"]').removeAttr('disabled');
                        }
                    });
                    objwork['company'] = $(this).find("input[name='company']").val(); //公司名称
                    objwork['position'] = $(this).find("input[name='position']").val(); //职位
                    objwork['startTime'] = $(this).find("input[name='startTime']").val(); //开始时间
                    objwork['endTime'] = $(this).find("input[name='endTime']").val(); //结束时间
                    objwork['description'] = $(this).find("[name=description]").text().replace(/\n/g, '[br]'); //工作描述
                    if (objwork['company'] == "" && objwork['position'] == "" && objwork['startTime'] == "" && objwork['endTime'] == "" && objwork['description'] == "") {
                        return false;
                    }
                    arrworkExps.push(objwork);
                });
                if ($.isEmptyObject(arrworkExps)) {
                    util.alertDialog("请添加工作经验！");
                    return false;
                }
                data['workExps'] = arrworkExps;
                //项目经验数据获取
                var projectExps = [];
                $form.find("div[name='proInfoNum']").each(function () {
                    var objpro = {};
                    objpro['project'] = $(this).find("input[name='project']").val(); //项目名称
                    objpro['startTime'] = $(this).find("input[name='startTime']").val(); //开始时间
                    objpro['endTime'] = $(this).find("input[name='endTime']").val(); //结束时间
                    objpro['description'] = $(this).find("[name=description]").text().replace(/\n/g, '[br]'); //项目描述
                    if (objpro['project'] == "" && objpro['startTime'] == "" && objpro['endTime'] == "" && objpro['description'] == "") {
                        return false;
                    }
                    projectExps.push(objpro);
                });
                // if ($.isEmptyObject(projectExps)) {
                //     util.alertDialog("请添加项目经验！");
                //     return false;
                // }
                data['projectExps'] = projectExps;
                //教育经历数据获取
                var educationExps = [];
                $form.find("div[name='eduInfoNum']").each(function () {
                    var objedu = {};
                    objedu['school'] = $(this).find("input[name='school']").val(); //学校名称
                    objedu['degree'] = $(this).find("input[name='degree']").val(); //学历
                    objedu['major'] = $(this).find("input[name='major']").val(); //专业
                    objedu['startTime'] = $(this).find("input[name='startTime']").val(); //开始时间
                    objedu['endTime'] = $(this).find("input[name='endTime']").val(); //结束时间
                    if (objedu['school'] == "" && objedu['degree'] == "" && objedu['major'] == "" && objedu['startTime'] == "" && objedu['endTime'] == "") {
                        return false;
                    }
                    educationExps.push(objedu);
                });
                // if ($.isEmptyObject(educationExps)) {
                //     util.alertDialog("请添加教育经历！");
                //     return false;
                // }
                data['educationExps'] = educationExps;
                util.setAjax(option.url, data, function (data) {
                    if (data.success) {
                        if (option.objdialog) {
                            //上传简历
                            if (option.aftercallback) {
                                option.aftercallback();
                            }
                            option.objdialog.dialog('close');
                        } else {
                            //标准化
                            var tabId = $that.attr('id').substr(12),
                                dataTab = $('#newTabs-' + tabId).data('tab'),
                                target = '',
                                midTab = $('#newTabs-' + tabId).data('midtab');
                            if ($('#ul_tabs').length) {
                                target = $('#ul_tabs');
                            } else if ($('#management-ul-tabs').length) {
                                target = $('#management-ul-tabs');
                            } else {
                                target = $('#bill-tabs');
                            }

                            tabMenu.removeTab({
                                tabId: tabId,
                                dataTab: dataTab,
                                target: target,
                                midTab: midTab
                            });
                        }
                    } else {
                        util.alertDialog(data.errMsg);
                    }
                }, function () {
                    alert("数据提交失败");
                });
            });
        }
    }
});
