var fundDatatable = function () {
    //资金审核列表
    var initFundTable = function () {

            var table = $('#fund_body');

            var oTable = table.dataTable({
                'language': {
                    // url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Chinese.json'
                    url: ued_conf.amdPath + '/widget/datatables/Chinese.json'
                },
                bDestory: false,
                searching: false,
                ordering: false,
                paging: true,
                buttons: [
                    { extend: 'print', className: 'btn dark btn-outline', text: '打印此表格' },
                    { extend: 'pdf', className: 'btn green btn-outline', text: '导出pdf' },
                    { extend: 'excel', className: 'btn yellow btn-outline', text: '导出excel' },
                ],
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": Inter.getApiUrl().fundAuditList,
                    "type": "POST",
                    
                },
                "rowId": 'id',
                "columns": [{
                        "class": "",
                        "orderable": false,
                        "data": null,
                        "defaultContent": '<div class="checker"><span class=""><input type="checkbox" class="checkboxes" value="1" name="indcheckboxList"></span></div>'
                    },
                    { "data": "accountName" },
                    { "data": "accountName" },
                    { "data": "accountName" },
                    { "data": "accountName" },
                    { "data": "accountName" },
                    { "data": "accountName" },
                    { "data": "accountName" },
                    { "data": "accountName" },
                    
                ],

                "responsive": false,
                "order": [
                    [0, 'asc']
                ],

                "lengthMenu": [
                    [5, 10, 15, 20, -1],
                    [5, 10, 15, 20, "全部"] // change per page values here
                ],
                "pageLength": 10,

                "dom": "<'row' <'col-md-12'B>><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
            });

            var tableWrapper = jQuery('#fund_body_wrapper');

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
            $('a.fundsearch').on('click', function () {
                oTable._fnAjaxUpdate();
                // oTable.ajax.reload();
                // var args = oTable.ajax.params();
                // console.log(args);

            });
            //搜索条件重置
            $('a.fundreset').on('click', function () {
                $('#fundSearchForm')[0].reset();
            });
            //设置审核条件
            $('button.set_audit').on('click', function () {
                window.location.href=""
            });
            //审核通过
            $('button#pass').on('click', function () {
                var str = [];
                $.each(table.find('.active'), function () {
                    var staStr = $(this).find('td:eq(10)').text();
                    if (staStr !== '不通过') {
                        bootbox.alert({
                            message: '选择用户状态错误，只有状态为：通过的用户信息才可进行不通过操作。',
                        });
                        return false;
                    } else {
                        str.push($(this).attr('id'));
                    }
                })
                var activeStr = "userIds=" + str.join(',');
                if (activeStr.length > 8) {
                    $.post(Inter.getApiUrl().indActUser, activeStr, function (data) {
                        if (data.success == true) {
                            table.find('.active').removeClass('active').find('td:eq(10)').text('启用');
                            table.find('.checked').removeClass('checked')
                        }
                    })
                }

            });
            //审核不通过
            $('button#nopass').on('click', function () {
                var str = [];
                $.each(table.find('.active'), function () {
                    var staStr = $(this).find('td:eq(10)').text();
                    if (staStr !== '通过') {
                        bootbox.alert({
                            message: '选择用户状态错误，只有状态为：不通过的用户信息才可进行通过操作。',
                        });
                        return false;
                    } else {
                        str.push($(this).attr('id'));
                    }
                })
                var activeStr = "userIds=" + str.join(',');
                if (activeStr.length > 8) {
                    $.post(Inter.getApiUrl().indActUser, activeStr, function (data) {
                        if (data.success == true) {
                            table.find('.active').removeClass('active').find('td:eq(10)').text('启用');
                            table.find('.checked').removeClass('checked')
                        }
                    })
                }

            });
        }
    //资金记录列表
    var initFundRecordTable = function(){
        var table = $('#fundRecord_body');

            var oTable = table.dataTable({
                'language': {
                    // url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Chinese.json'
                    url: ued_conf.amdPath + '/widget/datatables/Chinese.json'
                },
                bDestory: false,
                searching: false,
                ordering: false,
                paging: true,
                buttons: [
                    { extend: 'print', className: 'btn dark btn-outline', text: '打印此表格' },
                    { extend: 'pdf', className: 'btn green btn-outline', text: '导出pdf' },
                    { extend: 'excel', className: 'btn yellow btn-outline', text: '导出excel' },
                ],
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": Inter.getApiUrl().indiUserList,
                    "type": "POST",
                    "data": function (d) {
                        var data = $('#fundSearchForm').formatFormParam(d);
                    }
                },
                "rowId": 'id',
                "columns": [
                    { "data": "userCode" },
                    { "data": "userName" },
                    { "data": "mobileTel" },
                    { "data": "lawNo" },
                    { "data": "companyId" },
                    { "data": "email" },
                    { "data": "remark" },
                    { "data": "statusStr" },
                    { "data": "keyValidateStr" },
                    { "data": "fundStatusStr" },
                    {
                        "class": "",
                        "orderable": false,
                        "data": null,
                        "defaultContent": '<a class="indedit btn btn-primary" href="javascript:;"> 编辑 </a><a class="indview btn btn-success" href="javascript:;"> 查看 </a>',
                    }
                ],

                "responsive": false,
                "order": [
                    [0, 'asc']
                ],

                "lengthMenu": [
                    [5, 10, 15, 20, -1],
                    [5, 10, 15, 20, "全部"] // change per page values here
                ],
                "pageLength": 10,

                "dom": "<'row' <'col-md-12'B>><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
            });

            var tableWrapper = jQuery('#fund_body_wrapper');

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
    }
    //已设置为自动提现的用户列表
    var initHadSetTable = function(){
        var table = $('#fundRecord_body');

            var oTable = table.dataTable({
                'language': {
                    // url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Chinese.json'
                    url: ued_conf.amdPath + '/widget/datatables/Chinese.json'
                },
                bDestory: false,
                searching: false,
                ordering: false,
                paging: true,
                buttons: [
                    { extend: 'print', className: 'btn dark btn-outline', text: '打印此表格' },
                    { extend: 'pdf', className: 'btn green btn-outline', text: '导出pdf' },
                    { extend: 'excel', className: 'btn yellow btn-outline', text: '导出excel' },
                ],
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": Inter.getApiUrl().indiUserList,
                    "type": "POST",
                    "data": function (d) {
                        var data = $('#fundSearchForm').formatFormParam(d);
                    }
                },
                "rowId": 'id',
                "columns": [
                    { "data": "userCode" },
                    { "data": "userName" },
                    { "data": "mobileTel" },
                    { "data": "lawNo" },
                    { "data": "companyId" },
                    { "data": "email" },
                    { "data": "remark" },
                    { "data": "statusStr" },
                    { "data": "keyValidateStr" },
                    { "data": "fundStatusStr" },
                    {
                        "class": "",
                        "orderable": false,
                        "data": null,
                        "defaultContent": '<a class="indedit btn btn-primary" href="javascript:;"> 编辑 </a><a class="indview btn btn-success" href="javascript:;"> 查看 </a>',
                    }
                ],

                "responsive": false,
                "order": [
                    [0, 'asc']
                ],

                "lengthMenu": [
                    [5, 10, 15, 20, -1],
                    [5, 10, 15, 20, "全部"] // change per page values here
                ],
                "pageLength": 10,

                "dom": "<'row' <'col-md-12'B>><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
            });

            var tableWrapper = jQuery('#fund_body_wrapper');

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
    }
    return {
        init: function () {
            initFundTable();
            initFundRecordTable();
            initHadSetTable();
        }
    };

}();

jQuery(document).ready(function() {
  fundDatatable.init();

});
