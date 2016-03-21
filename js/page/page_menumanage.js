/**
 * Author:DuYutao
 * Date:2016-3-15
 * Description:功能管理列表
 */

'use strict';
/*global $, jQuery, ued_conf, Util, Inter, window*/
var initDatatable = function () {

    var menuTable = function () {
        var table = $('#menulist'),
            oTable = table.dataTable({
                'buttons': [],
                // data: [
                //     ['0001', '联合智信', '北京市朝阳区', '正常', '备注', '操作'],
                //     ['0001', '联合智信', '北京市朝阳区', '正常', '备注', '操作']
                // ],
                'searching': false,
                // setup responsive extension: http://datatables.net/extensions/responsive/
                'responsive': false,
                //"bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.

                "ordering": false, //disable column ordering,
                "paging": true, //disable pagination
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": Inter.getApiUrl().roleManagerList,
                    "type": "POST",
                    "data": function (d) {
                        $('#roleManageForm').formatFormParam(d);
                    }
                },
                "rowId": 'id',
                "columns": [
                    { "data": "roleCode" },
                    { "data": "roleName" },
                    { "data": "roleType" },
                    { "data": "companyId" },
                    { "data": "remark" }, {
                        "class": "",
                        "orderable": false,
                        "data": null,
                        "defaultContent": ['<a href="javascript:;" name="edit" class="btn btn-primary">编辑</a>',
                            '<a href="javascript:;" class="btn green" name="allocate">分配权限</a>',
                            '<a href="javascript:;" class="btn btn-danger" name="delete">删除</a>'
                            ].join('')
                    }
                ],
                "order": [
                    [0, 'asc']
                ],
                "lengthMenu": [
                    [1, 5, 10, 15, 20, -1],
                    [1, 5, 10, 15, 20, "全部"] // change per page values here
                ],
                // set the initial value
                "pageLength": 10,
                "dom": "<'row' <'col-md-12'B>><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
                initComplete: function (settings, json) {
                    // $('#roleList').on('click', function (e) {
                    //     var $target = $(e.target),
                    //         tName = $target.attr('name'),
                    //         roleId = $target.closest('tr').attr('id'),
                    //         html = '';

                    //     if (tName) {
                    //         switch (tName) {
                    //         case 'edit':
                    //             window.location.href = Util.strFormat(Inter.getApiUrl().roleEdit, [roleId]);
                    //             break;
                    //         case 'allocate':
                    //             if (!$target.prop('disabled')) {
                    //                 $target.prop('disabled', true);
                    //                 Util.setAjax(Inter.getApiUrl().roleModuleList+"?roleId="+roleId, {roleId: roleId}, function (json) {
                    //                 	 var arrhtml = [];
                    //                 	if (json.success) {
                    //                         for (var i = 0; i < json.data.length; i++) {
                    //                             var Str = '<tr class="roleManger">' +
                    //                                 '<td style="width:360px;">' + json.data[i].roleName + '</td>' +
                    //                                 '<td>' +
                    //                                 '<div class="checker"><span class="" data-status="' + json.data[i].checkStatus + '"><input type="checkbox" class="checkboxes"  name="syscheckboxList" data-id="' + json.data[i].id + '"></span></div>' +
                    //                                 '</td>' +
                    //                                 '</tr>';
                    //                             arrhtml.push(Str);
                    //                         }
                    //                         bootbox.dialog({
                    //                             message: '<form action="#" class="horizontal-form col-md-12 col-sm-12" id="managerRole">' +
                    //                                 '<div class="form-body">' +
                    //                                 '<input type="hidden" value="' + roleid + '" name="userId">' +
                    //                                 '<table class="table table-striped table-hover table-bordered dataTable no-footer dtr-inline">' +
                    //                                 arrhtml.join('') +
                    //                                 '</table>' +
                    //                                 '</div>' +
                    //                                 '</form>',
                    //                             title: "管理角色",
                    //                             buttons: {
                    //                                 success: {
                    //                                     label: "保存",
                    //                                     className: "green",
                    //                                     callback: function () {
                    //                                         var str = [];
                    //                                         $.each($('#managerRole').find('.active').find('input'), function () {
                    //                                             var $this = $(this).data('id');
                    //                                             str.push($(this).data('id'));
                    //                                         })
                    //                                         var moduleIds = (str.join(','));
                    //                                         $.post(Inter.getApiUrl().roleModuleAdd, { 'roleId': roleId, 'moduleIds': moduleIds },
                    //                                             function (data) {

                    //                                             }
                    //                                         );
                    //                                     }
                    //                                 },
                    //                                 main: {
                    //                                     label: "取消",
                    //                                     className: "gray",
                    //                                     callback: function () {
                    //                                         //alert("Primary button");
                    //                                     }
                    //                                 }
                    //                             }
                    //                         }).init(function () {
                    //                             $('.roleManger').on('click', function () {
                    //                                 $(this).find('span').toggleClass('checked').toggleClass("active");
                    //                             });
                    //                             $('#managerRole').find('[data-status=1]').addClass('checked');
                    //                         });
                    //                     } else {
                    //                         bootbox.alert('分配失败，原因:' + json.errMsg);
                    //                     }
                    //                 }, function () {
                    //                     bootbox.alert('服务器繁忙，请稍后再试。');
                    //                     $target.prop('disabled', false);
                    //                 });
                    //             }
                    //             bootbox.dialog({
                    //                 message: '<div class="row"><div class="form-group"><label class="col-md-10 control-label">企业商户-产品上架</label><div class="checkbox-list col-md-2"><label><input type="checkbox"name="chkAuthority"value="1"></label></div></div><div class="form-group"><label class="col-md-10 control-label">企业商户-产品上架-账户明细</label><div class="checkbox-list col-md-2"><label><input type="checkbox"name="chkAuthority"value="2"></label></div></div></div>',
                    //                 title: "分配权限",
                    //                 buttons: {
                    //                     success: {
                    //                         id: 'assignRole',
                    //                         label: "保存",
                    //                         className: "btn-success",
                    //                         callback: function () {
                    //                             $(this).find('.btn').prop('disabled', true);
                    //                             alert("great success");
                    //                         }
                    //                     },
                    //                     cancel: {
                    //                         label: "取消",
                    //                         className: "btn-default",
                    //                         // callback: function() {
                    //                         //     alert("Primary button");
                    //                         // }
                    //                     }
                    //                 }
                    //             });
                    //         break;
                    //         case 'delete':
                    //             if (!$target.prop('disabled')) {
                    //                 $target.prop('disabled', true);
                    //                 Util.setAjax(Inter.getApiUrl().deleteRole, {id: roleId}, function (json) {
                    //                     if (json.success) {
                    //                         $target.prop('disabled', false);
                    //                         oTable.api().ajax.reload();
                    //                     } else {
                    //                         $target.prop('disabled', false);
                    //                         bootbox.alert('服务器繁忙，请稍后再试。');
                    //                     }
                    //                 }, function () {
                    //                     bootbox.alert('服务器繁忙，请稍后再试。');
                    //                     $target.prop('disabled', false);
                    //                 });
                    //             }
                    //         break;
                    //         }
                    //     }
                    // });
                }
            });
        
        // $('#roleSearch').on('click', function(e) {
        //     e.preventDefault();
        //     oTable.api().ajax.reload();
        // });
        // $('#roleSearchClean').on('click', function(e) {
        //     e.preventDefault();
        //     $('#roleManageForm')[0].reset();
        // });
    }

    return {
        //main function to initiate the module
        init: function () {
            if (!jQuery().dataTable) {
                return;
            }
            menuTable();
        }
    };
}();

// var FormValidation = function () {

//     // basic validation
//     var createFormValidation = function () {
//         // for more info visit the official plugin documentation: 
//         // http://docs.jquery.com/Plugins/Validation

//         var roleForm = $('#roleForm'),
//             formError = $('.alert-danger', roleForm),
//             formSuccess = $('.alert-success', roleForm);

//         roleForm.validate({
//             errorElement: 'div', //default input error message container
//             errorClass: 'help-block help-block-error', // default input error message class
//             focusInvalid: false, // do not focus the last invalid input
//             ignore: "", // validate all fields including form hidden input
//             messages: {
//                 roleName: {
//                     required: "角色名称为必填项",
//                     maxlength: jQuery.validator.format("角色名称长度不能超过 {0} 个字")
//                 }
//             },
//             rules: {
//                 roleName: {
//                     required: true,
//                     maxlength: 10
//                 },
//             },

//             errorPlacement: function (error, element) {
//                 error.appendTo(element.parent());
//             },

//             invalidHandler: function (event, validator) { //display error alert on form submit              
//                 formSuccess.hide();
//                 formError.show();
//                 App.scrollTo(formError, -200);
//             },

//             highlight: function (element) { // hightlight error inputs
//                 $(element)
//                     .closest('.form-group').addClass('has-error'); // set error class to the control group
//             },

//             unhighlight: function (element) { // revert the change done by hightlight
//                 $(element)
//                     .closest('.form-group').removeClass('has-error'); // set error class to the control group
//             },

//             success: function (label) {
//                 label
//                     .closest('.form-group').removeClass('has-error'); // set success class to the control group
//             },

//             submitHandler: function (form) {
//                 formSuccess.show();
//                 formError.hide();
//             }
//         });
//     }

//     return {
//         //main function to initiate the module
//         init: function () {
//             createFormValidation();
//         }

//     };
// }();

jQuery(document).ready(function () {
    // var roleForm = $('#roleForm'),
    //     roleList = $('#roleList'),
    //     btn = roleForm.find('.btn-submit');
    // if (roleList.length) {
    // }
    initDatatable.init();
});
