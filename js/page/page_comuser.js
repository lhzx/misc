'use strict';
/*global Inter, Util, $, jQuery, ued_conf, bootbox*/
var CompanyDatatablesManaged = function () {

    var initComTable = function () {

        var table = $('#company_body'),
            oTable = table.dataTable({
                'language': {
                    url: ued_conf.amdPath + '/widget/datatables/Chinese.js'
                },
                searching: false,
                ordering: false,
                paging: true,
                buttons: [
                    { extend: 'print', className: 'btn dark btn-outline', text: '打印此表格' },
                    { extend: 'pdf', className: 'btn green btn-outline', text: '导出pdf' },
                    { extend: 'excel', className: 'btn yellow btn-outline', text: '导出excel' },
                ],

                // setup responsive extension: http://datatables.net/extensions/responsive/
                "responsive": false,
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": Inter.getApiUrl().comUserList,
                    "type": "POST",
                    "data": function (d) {
                        $('#companySearchForm').formatFormParam(d);
                    }
                },
                //每条数据唯一的标示
                "rowId": 'id',
                "columns": [{
                        "class": "",
                        "orderable": false,
                        "data": null,
                        "defaultContent": '<div class="checker"><span class=""><input type="checkbox" class="checkboxes" value="1" name="comcheckboxList"></span></div>'
                    },
                    { "data": "userName" },
                    { "data": "userCode" },
                    { "data": "companyId" },
                    { "data": "userType" },
                    { "data": "createDate" },
                    { "data": "statusStr" },
                    { "data": "remark" }, {
                        "class": "",
                        "orderable": false,
                        "data": null,
                        "defaultContent": '<a class="comedit btn btn-primary" href="' + ued_conf.interPath + '/companyUser/toEdit"> 修改 </a><a class="upcom btn btn-success" href="javascript:;"> 启用 </a><a class="stopcom btn red" href="javascript:;"> 禁用 </a><a class="comretpwd btn btn-info" href="javascript:;"> 重置密码 </a>',
                    }
                ],
                "order": [
                    [0, 'asc']
                ],

                "lengthMenu": [
                    [5, 10, 15, 20, -1],
                    [5, 10, 15, 20, "全部"] // change per page values here
                ],
                // set the initial value
                "pageLength": 10,

                "dom": "<'row' <'col-md-12'B>><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
                rowCallback: function (row, data, index) {
                    var td = $('td:eq(8)', row),
                        id = td.closest('tr').attr('id');
                    if (data.status === 1) {
                        td.find('.btn-success').addClass('disabled');
                        td.find('.red').removeClass('disabled');
                    } else {
                        td.find('.btn-success').removeClass('disabled');
                        td.find('.red').addClass('disabled');
                    }
                    td.find('.comretpwd').on('click', function () {
                        var $this = $(this);
                        if (!$this.hasClass('disabled')) {
                            $this.addClass('disabled');
                            Util.setAjax(Inter.getApiUrl().comResetPw, { id: id },
                                function (json) {
                                    if (!json.success) {
                                        $this.removeClass('disabled');
                                        bootbox.alert('密码重置失败，原因：' + json.errMsg);
                                    } else {
                                        $this.removeClass('disabled');
                                        bootbox.alert('密码重置成功！');
                                    }
                                },
                                function () {
                                    bootbox.alert('服务器繁忙，请稍后再试。');
                                    $this.removeClass('disabled');
                                });
                        }
                    });
                }
            });

        var tableWrapper = jQuery('#company_body_wrapper');

        table.find('.group-checkable').change(function () {
            var set = jQuery(this).attr("data-set");
            var checked = jQuery(this).is(":checked");

            jQuery(set).each(function () {
                if (checked) {
                    $(this).prop("checked", true);
                    $(this).parent('span').addClass('checked').parents('tr').addClass("active");
                } else {
                    $(this).prop("checked", false);
                    $(this).parent('span').removeClass('checked').parents('tr').removeClass("active");
                }
            });
            jQuery.uniform.update(set);
        });

        table.on('change', 'tbody tr .checkboxes', function () {
            $(this).parent('span').toggleClass('checked').parents('tr').toggleClass("active");
        });

        //根据搜索条件搜索数据
        $('a.comsearch').on('click', function () {
            oTable._fnAjaxUpdate();
        });
        //搜索条件重置
        $('a.comreset').on('click', function () {
            $('#companySearchForm')[0].reset();
        });
        //启用选中用户(多个)
        $('button#use_company').on('click', function () {
            var str = [],
                activeItem = table.find('.active'),
                overStr = '',
                status = 1;
            if (activeItem.length) {
                $.each(activeItem, function () {
                    var staStr = $(this).find('td:eq(6)').text();
                    if (staStr !== '禁用') {
                        bootbox.alert({
                            message: '选择用户状态错误，只有状态为：启用的用户信息才可进行禁用操作。',
                        });
                        return false;
                    } else {
                        str.push($(this).attr('id'));
                    }
                });
                overStr = str.join(',');
            } else {
                bootbox.alert('尚未选中用户，请先选择。');
            }
            $.post(Inter.getApiUrl().comUpUser, { 'userIds': overStr, 'status': status }, function (data) {
                if (data.success) {
                    activeItem.find('.btn-success').addClass('disabled');
                    activeItem.find('.red').removeClass('disabled');
                    activeItem.removeClass('active').find('td:eq(6)').text('启用');
                    activeItem.find('.checked').removeClass('checked');
                }
            });
        });
        //停用选中用户(多个)
        $('button#stop_company').on('click', function () {
            var str = [],
                activeItem = table.find('.active'),
                status = 2;
            if (activeItem.length) {
                $.each(activeItem, function () {
                    var staStr = $(this).find('td:eq(6)').text();
                    if (staStr !== '启用') {
                        bootbox.alert({
                            message: '选择用户状态错误，只有状态为：禁用的用户信息才可进行禁用操作。',
                        });
                        return false;
                    } else {
                        str.push($(this).attr('id'));
                    }
                });
            } else {
                bootbox.alert('尚未选中用户，请先选择。');
            }
            $.post(Inter.getApiUrl().comUpUser, { 'userIds': str.join(','), 'status': status }, function (data) {
                if (data.success == true) {
                    activeItem.find('.btn-success').removeClass('disabled');
                    activeItem.find('.red').addClass('disabled');
                    activeItem.removeClass('active').find('td:eq(6)').text('禁用');
                    activeItem.find('.checked').removeClass('checked');
                }
            });
        });
        //启用单个用户
        table.on('click', '.upcom', function (e) {
            e.preventDefault();
            $(this).closest('tr').addClass('active');
            var status = '',
                comid = $(this).closest('tr').attr('id'),
                status = 1;
            $.post(Inter.getApiUrl().comUpUser, { 'userIds': comid, 'status': status }, function (data) {
                if (data.success == true) {
                    var column = table.find('.active');
                    column.find('.btn-success').addClass('disabled');
                    column.find('.red').removeClass('disabled');
                    column.removeClass('active').find('td:eq(6)').text('启用');
                } else {
                    bootbox.alert('启用失败, 原因:' + data.errMsg);
                }
            });
        });
        //禁用状态
        table.on('click', '.stopcom', function (e) {
            e.preventDefault();
            $(this).closest('tr').addClass('active');
            var status = '',
                comid = $(this).closest('tr').attr('id'),
                status = 2;
            $.post(Inter.getApiUrl().comUpUser, { 'userIds': comid, 'status': status }, function (data) {
                if (data.success == true) {
                    var column = table.find('.active');
                    column.find('.btn-success').removeClass('disabled');
                    column.find('.red').addClass('disabled');
                    column.removeClass('active').find('td:eq(6)').text('禁用');
                } else {
                    bootbox.alert('启用失败, 原因:' + data.errMsg);
                }
            });
        });
    }

    var ComhandleDemo = function () {
            //创建公司账户
            $('#add_company_new').click(function () {
                window.location.href = Inter.getApiUrl().comAddUser;
            });
            //管理机构
            $('#manage').on('click', function (e) {
                e.preventDefault();
                $.post(Inter.getApiUrl().comManger, '',
                    function (data) {
                        var arrhtml = [];
                        for (var i = 0; i < data.data.length; i++) {
                            var Str = '<tr class="roleManger" id="' + data.data[i].id + '">' +
                                '<td style="width:360px;">' + data.data[i].companyName + '</td>' +
                                '<td>' +
                                '<div class="checker"><span class="" data-status="' + data.data[i].status + '"><input type="checkbox" class="checkboxes"  name="syscheckboxList" data-id="' + data.data[i].id + '"></span></div>' +
                                '</td>' +
                                '</tr>';
                            arrhtml.push(Str);
                        }

                        bootbox.dialog({
                            message: '<form action="#" class="horizontal-form col-md-12 col-sm-12" id="managerRole">' +
                                '<div class="form-body">' +
                                '<input type="hidden" value="' + roleid + '" name="userId">' +
                                '<table class="table table-striped table-hover table-bordered dataTable no-footer dtr-inline">' +
                                arrhtml.join('') +
                                '</table>' +
                                '</div>' +
                                '</form>',
                            title: "管理角色",
                            buttons: {
                                success: {
                                    label: "保存",
                                    className: "green",
                                    callback: function () {
                                        var str = [];
                                        $.each($('#managerRole').find('.active'), function () {
                                            var manageStr = $(this).find('td:eq(0)').text();
                                            status = $(this).attr('id');
                                            html = '<tr class="odd gradeX" id="' + status + '"> <td> ' + manageStr + ' </td><input type="hidden" value="' + status + '" name="id"></tr>'
                                            str.push(html);
                                        });
                                        $('.table-message tbody').append(str);
                                    }

                                },
                                main: {
                                    label: "取消",
                                    className: "gray",
                                    callback: function () {
                                        //alert("Primary button");
                                    }
                                }
                            }
                        }).init(function () {
                            $('.roleManger').on('click', function () {
                                $(this).find('span').toggleClass('checked').closest('tr').toggleClass("active");
                            });
                            $('#managerRole').find('[data-status=1]').addClass('checked').closest('tr').addClass('active');
                        });
                    }
                );
            });
            //选择权限
            $('#roleManagement').on('click', function (e) {
                e.preventDefault();
                bootbox.dialog({
                    message: '<div class="col-sm-12"><div id="roleList" class="col-md-12"> </div></div>',
                    title: "选择权限",
                    className: 'role-management',
                    buttons: {
                        success: {
                            label: "保存",
                            className: "green",
                            callback: function () {
                                var checkedItems = $('#roleList').find('.jstree-clicked'),
                                    checkedId = [],
                                    checkedStr = '',
                                    $this = $(this).find('.btn.green');
                                $.each($('#roleList').find('.jstree-clicked'), function (i, n) {
                                    checkedId.push($(this).closest('li').attr('id'));
                                })
                                checkedStr = checkedId.join(',');
                                console.log(checkedStr);
                                $this.addClass('disabled');
                                Util.setAjax(Inter.getApiUrl().comRoleSave, { id: checkedStr }, function (json) {
                                    if (!json.success) {
                                        $this.removeClass('disabled');
                                        bootbox.alert('密码重置失败，原因：' + json.errMsg);
                                    } else {
                                        $this.removeClass('disabled');
                                        bootbox.alert('密码重置成功！');
                                    }
                                }, function () {
                                    bootbox.alert('服务器繁忙，请稍后再试。');
                                    $this.removeClass('disabled');
                                })
                            }
                        },
                        main: {
                            label: "取消",
                            className: "gray",
                            callback: function () {
                                //alert("Primary button");
                            }
                        }
                    }
                }).init(function () {
                    $("#roleList").jstree({
                        plugins: ["checkbox", "types"],
                        core: {
                            themes: {
                                responsive: true
                            },
                            'data': [{
                                    "text": "Same but with checkboxes",
                                    "children": [{
                                        "text": "initially selected",
                                        "state": {
                                            "selected": true
                                        }
                                    }, {
                                        "text": "custom icon",
                                        "icon": "fa fa-warning icon-state-danger"
                                    }, {
                                        "text": "initially open",
                                        "icon": "fa fa-folder icon-state-default",
                                        "state": {
                                            "opened": true
                                        },
                                        "children": ["Another node"]
                                    }, {
                                        "text": "custom icon",
                                        "icon": "fa fa-warning icon-state-warning"
                                    }, {
                                        "text": "disabled node",
                                        "icon": "fa fa-check icon-state-success",
                                        "state": {
                                            "disabled": true
                                        }
                                    }]
                                },
                                "And wholerow selection"
                            ]
                        },
                        types: {
                            "default": {
                                icon: "fa fa-folder icon-state-warning icon-lg"
                            },
                            file: {
                                icon: "fa fa-file icon-state-warning icon-lg"
                            }
                        }
                    });
                });
            });
            //为选中的机构进行角色分配
            $('.table-message').on('click', 'tr', function () {
                var str = [];
                manageId = $(this).attr('id');
                $.post(Inter.getApiUrl().roleManagerList, '', function () {
                    console.log(data);
                });
                alert(manageId);
            });
            //保存公司账户
            /*$('button#comSave').on('click', function (e) {
                e.preventDefault();
                var savedata = $('#addCom').serialize(),
                    userCode = $('#userCode').val();
                savedata = savedata + '&userCode=' + userCode;
                if ($('#addCom').valid()) {
                    $.post(Inter.getApiUrl().indSaveUser, savedata, function (data) {
                        if (data.success == true) {
                            window.location.href = Inter.getApiUrl().indUserShow;
                        }
                    });
                }
            });       */
        }
        /**
         *   新增以及修改公司用户表单验证
         **/
    var createComFormValidation = function () {
        var comform = $('#addCom');
        var inderror = $('.alert-danger', comform);
        var indsuccess = $('.alert-success', comform);

        comform.validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block help-block-error', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "", // validate all fields including form hidden input
            messages: {
                select_multi: {
                    maxlength: jQuery.validator.format("Max {0} items allowed for selection"),
                    minlength: jQuery.validator.format("At least {0} items must be selected")
                }
            },
            rules: {
                userCode: {
                    required: true
                },
                userName: {
                    required: true,
                    maxlength: 100
                },
                mobileTel: {
                    required: true
                },
                officeTel: {
                    required: true
                },
                userType: {
                    required: true
                },
                contactor: {
                    required: true
                },
                createDate: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },

            },

            invalidHandler: function (event, validator) { //display error alert on form submit              
                indsuccess.hide();
                inderror.show();
                App.scrollTo(inderror, -200);
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                    .closest('.form-group').removeClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label
                    .closest('.form-group').removeClass('has-error'); // set success class to the control group
            },

            submitHandler: function (form) {
                indsuccess.show();
                inderror.hide();
            }
        });
    }

    return {

        //main function to initiate the module
        init: function () {
            if (!jQuery().dataTable) {
                return;
            }
            initComTable();
            ComhandleDemo();
            createComFormValidation();
        }

    };

}();
jQuery(document).ready(function () {
    if (jQuery().datepicker) {
        var today = new Date();
        $('.date-picker').datepicker({
            orientation: "right",
            autoclose: true,
            todayHighlight: true,
            language: "zh-CN",
            format: "yyyy-mm-dd"
        });

        //$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
    }
    if ($('#addInd').length > 0) {
        $.initSelectBank({
            bankId: 'bankCode', //银行ID
            bankNameId: 'bankName', //银行Name
            provinceId: 'provinceCode',
            provinceNameId: 'provinceName',
            cityId: 'cityCode',
            cityNameId: 'cityName',
            branchBankId: 'brankBankCode',
            branchBankNameId: 'brankBankName',
        });
    }
    CompanyDatatablesManaged.init();
});
