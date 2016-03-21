var SystemDatatablesEditable = function () {

    var SyshandleTable = function () {

        var table = $('#system_body');

        var oTable = table.dataTable({
            'language': {
                url: ued_conf.amdPath + '/widget/datatables/Chinese.json'
            },
            searching: false,
            ordering: false,
            paging: true,
            buttons: [
            ],

            // setup responsive extension: http://datatables.net/extensions/responsive/
            "responsive": true,
            "processing": true,
            "serverSide": true,
            "ajax": {
                "url": Inter.getApiUrl().sysUserList,
                "type": "POST",
                "data": function (d) {
                    $('#systemSearchForm').formatFormParam(d);
                }
            },
            //每条数据唯一的标示
            "rowId": 'id',
            "columns": [
                { "data": "userName" },
                { "data": "userCode" },
                { "data": "password" },
                { "data": "mobileTel" }, //对应人员手机号mobileTel
                { "data": "statusStr" },
                { "data": "remark" }, {
                    "class": "",
                    "orderable": false,
                    "data": null,
                    "defaultContent": '<a class="sysedit btn btn-primary" href="javascript:;"> 修改 </a><a class="sysdelete btn btn-red" href="javascript:;"> 删除 </a>',
                }, {
                    "class": "",
                    "orderable": false,
                    "data": null,
                    "defaultContent": '<a class="sysrole btn btn-primary" href="javascript:;"> 管理角色 </a><a class="sysup btn btn-success" href="javascript:;"> 启用 </a><a class="sysstop btn btn-danger" href="javascript:;"> 禁用 </a>',
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

        });

        //添加用户
        $('#add_system_new').click(function (e) {
            e.preventDefault();
            var html = '<form id="addsystemForm" action="" method="post" name="searchForm">' +
                '<div class="search-item input-group col-md-12 col-sm-12 margin-top-10">' +
                '<span class="input-group-addon">用户编码</span>' +
                '<input type="text" id="userCode" class="form-control" placeholder="系统统一生成用户编码" name="userCode" value=""  >' +
                '</div>' +
                '<div class="search-item input-group col-md-12 col-sm-12 margin-top-10">' +
                '<span class="input-group-addon">用户名称</span>' +
                '<input type="text" id="userName" class="form-control" placeholder="必填项：姓名" name="userName" value="">' +
                '</div>' +
                '<div class="search-item input-group col-md-12 col-sm-12 margin-top-10">' +
                '<span class="input-group-addon">用户密码</span>' +
                '<input type="password" id="password" class="form-control" placeholder="必填项：密码" name="password" value="">' +
                '</div>' +
                '<div class="search-item input-group col-md-12 col-sm-12 margin-top-10">' +
                '<span class="input-group-addon">手机号&nbsp;&nbsp;&nbsp;&nbsp;</span>' +
                '<input type="password" id="mobileTel" class="form-control" placeholder="必填项：手机号" name="mobileTel" value="">' +
                '</div>' +
                '<div class="search-item input-group col-md-12 col-sm-12 margin-top-10">' +
                '<span class="input-group-addon">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注</span>' +
                '<input type="text" id="remark" class="form-control" placeholder="备注" name="remark" value="">' +
                '</div>' +
                '</form>';
            bootbox.dialog({
                message: html,
                title: "新建管理员用户",
                buttons: {
                    success: {
                        label: "保存",
                        className: "green",
                        callback: function () {
                            var data = $('#addsystemForm').serialize();
                            console.log(data);
                            $.post(Inter.getApiUrl().sysAddUser, data, function (data) {
                                if (data.success) {
                                    window.location.href = Inter.getApiUrl().systemUser;
                                }
                            });
                        }
                    },
                    main: {
                        label: "取消",
                        className: "blue",
                        callback: function () {
                            //alert("Primary button");
                        }
                    }
                }
            }).init(function () {
                // $('.userName').on('blur', function(){
                //     var userName = $(this).val();
                //     $.post('', userName, function(){});
                // });
                // $('#managerRole').find('[data-status=1]').addClass('checked');

            });
        });
        //搜索数据
        $('a.syssearch').on('click', function () {
            oTable._fnAjaxUpdate();
        });
        //搜索条件重置
        $('a.sysreset').on('click', function () {
            $('#systemSearchForm')[0].reset();
        });
        //数据删除
        table.on('click', '.sysdelete', function (e) {
            e.preventDefault();
            $(this).closest('tr').addClass('active');
            var comid = "userIds=" + $(this).closest("tr").attr("id");
            bootbox.confirm({
                buttons: {
                    cancel: {
                        label: '确定',
                        className: 'btn-primary'
                    },
                    confirm: {
                        label: '取消',
                        className: 'btn-default'
                    }
                },
                message: '确认删除？',
                callback: function (result) {
                    if (!result) {
                        $.post(Inter.getApiUrl().sysDelUser, comid, function (data) {
                            if (data.success) {
                                oTable.api().ajax.reload();
                            } else {
                                bootbox.alert('删除失败, 原因:' + data.errMsg);
                            }
                        });
                    };
                }
            });
        });


        //数据启用
        table.on('click', '.sysup', function (e) {
            e.preventDefault();
            $(this).closest('tr').addClass('active');
            var comid = "userIds=" + $(this).closest("tr").attr("id");
            console.log(comid);
            var text = $(this).closest('tr').find('td:eq(4)').text();
            if (text == '禁用') {
                $.post(Inter.getApiUrl().sysUpUser, comid, function (data) {
                    table.find('.active').removeClass('active').find('td:eq(4)').text('启用');
                });
            } else {
                bootbox.alert({
                    message: '该用户已经处于‘启用’状态',
                });
            }

        });
        //数据停用
        table.on('click', '.sysstop', function (e) {
            e.preventDefault();
            $(this).closest('tr').addClass('active');
            var comid = "userIds=" + $(this).closest("tr").attr("id");
            console.log(comid);
            var text = $(this).closest('tr').find('td:eq(4)').text();
            if (text == '启用') {
                $.post(Inter.getApiUrl().sysStopUser, comid, function (data) {
                    table.find('.active').removeClass('active').find('td:eq(4)').text('禁用');
                });
            } else {
                bootbox.alert({
                    message: '该用户已经处于“禁用”状态',
                });
            }
        });

        //管理角色
        table.on('click', '.sysrole', function (e) {
            e.preventDefault();
            var roleid = "userId=" + $(this).closest('tr').attr('id');
            var html = '';
            console.log(roleid);
            $.post(Inter.getApiUrl().sysRoleManger, roleid,
                function (data) {
                    console.log(data);
                    var arrhtml = [];
                    for (var i = 0; i < data.data.length; i++) {
                        var Str = '<tr class="roleManger">' +
                            '<td style="width:360px;">' + data.data[i].roleName + '</td>' +
                            '<td>' +
                            '<div class="checker"><span class="" data-status="' + data.data[i].checkStatus + '"><input type="checkbox" class="checkboxes"  name="syscheckboxList" data-id="' + data.data[i].id + '"></span></div>' +
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
                                    $.each($('#managerRole').find('.active').find('input'), function () {
                                        var $this = $(this).data('id');
                                        str.push($(this).data('id'));
                                    })
                                    var roleIds = (str.join(','));
                                    var userId = roleid;
                                    var para = '?roleIds=' + roleIds + "&" + userId + '&relationType=ROLE';
                                    $.post(Inter.getApiUrl().sysRoleSave + para, 'id',
                                        function (data) {

                                        }
                                    );
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
                            $(this).find('span').toggleClass('checked').toggleClass("active");
                        });
                        $('#managerRole').find('[data-status=1]').addClass('checked');
                    });
                }
            );
        });
        //数据编辑
        table.on('click', '.sysedit', function (e) {
            e.preventDefault();
            var id = "id=" + $(this).closest('tr').attr('id');
            $.post(Inter.getApiUrl().toEditUser + "?" + id, 'id', function (data) {
                console.log(data);
                var html = '<form id="editsystemForm" action="" method="post" name="searchForm">' +
                    '<div class="search-item input-group col-md-12 col-sm-12 margin-top-10">' +
                    '<input type="hidden"  class="form-control"  name="id" value="' + data.obj.id + '" >' +
                    '<span class="input-group-addon">用户编码</span>' +
                    '<input type="text" id="userCode" class="form-control" placeholder="★用户编码" name="userCode" value="' + data.obj.userCode + '" >' +
                    '</div>' +
                    '<div class="search-item input-group col-md-12 col-sm-12 margin-top-10">' +
                    '<span class="input-group-addon">用户名称</span>' +
                    '<input type="text" id="userName" class="form-control" placeholder="★姓名" name="userName" value="' + data.obj.userName + '">' +
                    '</div>' +
                    '<div class="search-item input-group col-md-12 col-sm-12 margin-top-10">' +
                    '<span class="input-group-addon">用户密码</span>' +
                    '<input type="password" id="password" class="form-control" placeholder="★密码" name="password" value="' + data.obj.password + '">' +
                    '</div>' +
                    '<div class="search-item input-group col-md-12 col-sm-12 margin-top-10">' +
                    '<span class="input-group-addon">手机号&nbsp;&nbsp;&nbsp;&nbsp;</span>' +
                    '<input type="password" id="mobileTel" class="form-control" placeholder="★手机号" name="mobileTel" value="' + data.obj.officeTel + '">' +
                    '</div>' +
                    '<div class="search-item input-group col-md-12 col-sm-12 margin-top-10">' +
                    '<span class="input-group-addon">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注</span>' +
                    '<input type="text" id="remark" class="form-control" placeholder="备注" name="remark" value="' + data.obj.remark + '">' +
                    '</div>' +
                    '</form>';
                bootbox.dialog({
                    message: html,
                    title: "编辑管理员用户",
                    buttons: {
                        success: {
                            label: "保存",
                            className: "green",
                            callback: function () {
                                var data = $('#editsystemForm').serialize();
                                $.post(Inter.getApiUrl().sysAddUser, data, function (data) {
                                    if (data.success) {
                                        window.location.href = Inter.getApiUrl().systemUser;
                                    }
                                });
                            }
                        },
                        main: {
                            label: "取消",
                            className: "blue",
                            callback: function () {
                                //alert("Primary button");
                            }
                        }
                    }
                }).init(function () {
                    // $('.userName').on('blur', function(){
                    //     var userName = $(this).val();
                    //     $.post('', userName, function(){});
                    // });
                    // $('#managerRole').find('[data-status=1]').addClass('checked');

                });
            });

        });
    }
    var createSysFormValidation = function () {
        var sysform = $('#addsystemForm');
        var inderror = $('.alert-danger', sysform);
        var indsuccess = $('.alert-success', sysform);

        sysform.validate({
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
                    required: true
                },
                password: {
                    required: true
                },
                mobileTel: {
                    required: true
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
        init: function () {
            SyshandleTable();
            createSysFormValidation()
        }

    };

}();

var ComponentsBootstrapSwitch = function () {

    var handleBootstrapSwitch = function () {

        $('.switch-radio1').on('switch-change', function () {
            $('.switch-radio1').bootstrapSwitch('toggleRadioState');
        });

        // or
        $('.switch-radio1').on('switch-change', function () {
            $('.switch-radio1').bootstrapSwitch('toggleRadioStateAllowUncheck');
        });

        // or
        $('.switch-radio1').on('switch-change', function () {
            $('.switch-radio1').bootstrapSwitch('toggleRadioStateAllowUncheck', false);
        });

    }

    return {
        //main function to initiate the module
        init: function () {
            handleBootstrapSwitch();
            createSysFormValidation();
        }
    };

}();

jQuery(document).ready(function () {
    if (jQuery().datepicker) {
        $('.date-picker').datepicker({
            orientation: "right",
            autoclose: true,
            language: "zh-CN",
            format: "yyyy-mm-dd",
        });
        //$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
    }
    SystemDatatablesEditable.init();

});
