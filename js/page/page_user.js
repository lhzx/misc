'use strict';
/*global $, jQuery, ued_conf, Util, Inter, window*/
var IndividualDatatablesManaged = function () {

    var initIndTable = function () {

            var table = $('#individual_body');

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
                        var data = $('#individualSearchForm').formatFormParam(d);
                    }
                },
                "rowId": 'id',
                "columns": [{
                        "class": "",
                        "orderable": false,
                        "data": null,
                        "defaultContent": '<div class="checker"><span class=""><input type="checkbox" class="checkboxes" value="1" name="indcheckboxList"></span></div>'
                    },
                    { "data": "userCode" },
                    { "data": "userName" },
                    { "data": "mobileTel" },
                    { "data": "lawNo" },
                    { "data": "companyName" },
                    { "data": "email" },
                    { "data": "remark" },
                    { "data": "statusStr" },
                    { "data": "keyValidateStr" },
                    { "data": "fundStatusStr" },
                    // { "data": "userVO.bank.accountNo" },
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

            var tableWrapper = jQuery('#individual_body_wrapper');

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
            $('a.indsearch').on('click', function () {
                oTable._fnAjaxUpdate();
                // oTable.ajax.reload();
                // var args = oTable.ajax.params();
                // console.log(args);

            });
            //搜索条件重置
            $('a.indreset').on('click', function () {
                $('#individualSearchForm')[0].reset();
            });
            //激活选中用户
            $('button#active_individual').on('click', function () {
                console.log(Inter.getApiUrl().login);
                var str = [];
                $.each(table.find('.active'), function () {
                    var staStr = $(this).find('td:eq(8)').text();
                    if (staStr !== '新增') {
                        bootbox.alert({
                            message: '选择用户状态错误，只有状态为：新增的用户信息才可进行激活操作。',
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
                            table.find('.active').removeClass('active').find('td:eq(8)').text('启用');
                            table.find('.checked').removeClass('checked')
                        } else {
                            bootbox.alert('启用用户基金出错, 原因:' + data.errMsg);
                        }
                    });
                }
            });
            //启用选中用户
            $('button#up_individual').on('click', function () {
                var str = [];
                $.each(table.find('.active'), function () {
                    var staStr = $(this).find('td:eq(8)').text();
                    if (staStr !== '禁用') {
                        bootbox.alert({
                            message: '选择用户状态错误，只有状态为：禁用的用户信息才可进行启用操作。',
                        });
                        return false;
                    } else {
                        str.push($(this).attr('id'));
                    }
                })
                var upStr = "userIds=" + str.join(',');
                if (upStr.length > 8) {
                    $.post(Inter.getApiUrl().indUpUser, upStr, function (data) {
                        if (data.success == true) {
                            table.find('.active').removeClass('active').find('td:eq(8)').text('启用');
                            table.find('.checked').removeClass('checked')
                        } else {
                            bootbox.alert('启用用户基金出错, 原因:' + data.errMsg);
                        }
                    });
                }

            });
            //停用选中用户
            $('button#over_individual').on('click', function () {
                var str = [];
                $.each(table.find('.active'), function () {
                    var staStr = $(this).find('td:eq(8)').text();
                    if (staStr !== '启用') {
                        bootbox.alert({
                            message: '选择用户状态错误，只有状态为：启用的用户信息才可进行禁用操作。',
                        });
                        return false;
                    } else {
                        str.push($(this).attr('id'));
                    }
                });
                var overStr = "userIds=" + str.join(',');
                if (overStr.length > 8) {
                    $.post(Inter.getApiUrl().indStopUser, overStr, function (data) {
                        if (data.success == true) {
                            table.find('.active').removeClass('active').find('td:eq(8)').text('禁用');
                            table.find('.checked').removeClass('checked');
                        } else {
                            bootbox.alert('启用用户基金出错, 原因:' + data.errMsg);
                        }
                    });
                }
            });
            //四要素验证
            $('button#four_validate').on('click', function () {
                var str = [];
                $("input[name=indcheckboxList]").each(function () {
                    if ($(this).parent('span').attr("class") === "checked") {
                        var indId = $(this).closest("tr").attr("id");
                        str.push(indId);
                    }
                });
                Util.setAjax(Inter.getApiUrl().fourElement, {userIds: str.join(',')});
            });
            //启用选中用户基金
            $('button#fundActive').on('click', function () {
                var str = [],
                    staStr = '',
                    activeItem = table.find('.active');
                if (activeItem.length) {
                    $.each(activeItem, function () {
                        if ($(this).find('td:eq(10)').text() !== '禁用') {
                            bootbox.alert({
                                message: '选择用户状态错误，只有状态为"禁用"的用户才可进行启用基金操作。',
                            });
                            return false;
                        } else {
                            str.push($(this).attr('id'));
                        }
                    });
                    if (str.length) {
                        $.post(Inter.getApiUrl().indFundActive, {userIds: str.join(',')}, function (data) {
                            if (data.success === true) {
                                activeItem.removeClass('active').find('td:eq(10)').text('禁用');
                                activeItem.find('.checked').removeClass('checked');
                            } else {
                                bootbox.alert('启用用户基金出错, 原因:' + data.errMsg);
                            }
                        });
                    }
                } else {
                    bootbox.alert('尚未选中用户，请先选择。');
                }
            });
            //停用选中用户基金
            $('button#fundDisable').on('click', function () {
                var str = [],
                    staStr = '',
                    activeItem = table.find('.active');
                if (activeItem.length) {
                    $.each(activeItem, function () {
                        if ($(this).find('td:eq(10)').text() !== '已开通') {
                            bootbox.alert({
                                message: '选择用户状态错误，只有状态为"已开通"的用户才可进行禁用基金操作。',
                            });
                            return false;
                        } else {
                            str.push($(this).attr('id'));
                        }
                    });
                    if (str.length) {
                        $.post(Inter.getApiUrl().indFundDisable, {userIds: str.join(',')}, function (data) {
                            if (data.success === true) {
                                activeItem.removeClass('active').find('td:eq(10)').text('停用');
                                activeItem.find('.checked').removeClass('checked');
                            } else {
                                bootbox.alert('启用用户基金出错, 原因:' + data.errMsg);
                            }
                        });
                    }
                } else {
                    bootbox.alert('尚未选中用户，请先选择。');
                }
            });
            //个人用户信息编辑
            table.on('click', '.indedit', function (e) {
                e.preventDefault();
                var indid = "id=" + $(this).closest("tr").attr("id");
                console.log(indid);
                window.location.href = Inter.getApiUrl().indEditUser + "?" + indid;
                /* $.post(Inter.getApiUrl().indStopUser, indid, function(data){
                    
                });*/
            });
            //个人用户信息查看
            table.on('click', '.indview', function (e) {
                e.preventDefault();
                var indid = "id=" + $(this).closest("tr").attr("id");
                window.location.href = Inter.getApiUrl().indViewUser + "?" + indid;
                /* $.post(Inter.getApiUrl().indStopUser, indid, function(data){
                    
                });*/
            });
            //编辑页返回
            $('button#indClose').on('click', function () {
                window.location.href = "individualUser";
            });
            //加载银行信息
            var initBankBranchSelect = function () {
                function formatRepo(repo) {
                    if (repo.loading) return repo.text;

                    var markup = "<div class='select2-result-repository clearfix'>" +
                        "<div class='select2-result-repository__avatar'><img src='" + repo.owner.avatar_url + "' /></div>" +
                        "<div class='select2-result-repository__meta'>" +
                        "<div class='select2-result-repository__title'>" + repo.full_name + "</div>";

                    if (repo.description) {
                        markup += "<div class='select2-result-repository__description'>" + repo.description + "</div>";
                    }

                    markup += "<div class='select2-result-repository__statistics'>" +
                        "<div class='select2-result-repository__forks'><span class='glyphicon glyphicon-flash'></span> " + repo.forks_count + " Forks</div>" +
                        "<div class='select2-result-repository__stargazers'><span class='glyphicon glyphicon-star'></span> " + repo.stargazers_count + " Stars</div>" +
                        "<div class='select2-result-repository__watchers'><span class='glyphicon glyphicon-eye-open'></span> " + repo.watchers_count + " Watchers</div>" +
                        "</div>" +
                        "</div></div>";

                    return markup;
                }

                function formatRepoSelection(repo) {
                    return repo.full_name || repo.text;
                }
            }

            //加载所属公司信息
          /*  $('#comID').on('focus', function () {
                var html = '';
                $.post('', function (data) {
                    $.each(data, function () {
                        var str = '<option value="' + data.id + '">' + data.name + '</option>';
                        html.push(str);
                    });
                    $(this).append(html);

                });
            });*/
            //姓名与开户名称一致
            $('#userName').on('blur', function () {
                var text = $(this).val();
                $('#bank_userName').val(text);
            });

        }
        //创建个人账户数据验证
    var createIndFormValidation = function () {
        var indform = $('#addInd');
        var inderror = $('.alert-danger', indform);
        var indsuccess = $('.alert-success', indform);

        indform.validate({
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
                lawNo: {
                    required: true
                },
                lawType: {
                    required: true
                },
                mobileTel: {
                    required: true
                },
                officeTel: {
                    required: true
                },
                createDate: {
                    required: true
                },
                salaryDate: {
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
    var IndhandleDemo = function () {
        //创建个人账户
        $('#add_individual_new').click(function () {
            window.location.href = Inter.getApiUrl().indAddUser;
        });
        //个人用户信息保存
        $('button#indSave').on('click', function (e) {
            e.preventDefault();
            var savedata = $('#addInd').serialize(),
                userCode = $('#userCode').val();
            savedata = savedata + '&userCode=' + userCode;
            console.log(savedata);           
            if ($('#addInd').valid()) {
                $.post(Inter.getApiUrl().indSaveUser, savedata, function (data) {
                    if (data.success == true) {
                        window.location.href = Inter.getApiUrl().indUserShow;
                    }

                });
            }

        });
    }
    return {

        //main function to initiate the module
        init: function () {
            if (!jQuery().dataTable) {
                return;
            }
            initIndTable();
            IndhandleDemo();
            createIndFormValidation();

        }

    };

}();
if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function () {
        IndividualDatatablesManaged.init();

    });
}
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
    $('[name=companyId]').select2({
        width: "off",
        placeholder: '请输入选择公司',
        allowClear: true,
        ajax: {
            url: Inter.getApiUrl().comSearch,
            dataType: 'json',
            delay: 1000,
            data: function(params) {
                return {
                    q: params.term, // search term
                    page: params.page
                };
            },
            processResults: function(data, params) {
                params.page = params.page || 1;

                return {
                    results: data.data,
                    pagination: {
                        more: (params.page * 30) < data.total_count
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function(markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1,
        // templateResult: formatRepo,
        // templateSelection: formatRepoSelection
    });
    if ($('#addInd').length > 0) {
        $.initSelectBank({
            bankId: 'clsBankCode', //银行ID
            bankNameId: 'clsBankName', //银行Name
            provinceId: 'provinceCode',
            provinceNameId: 'provinceName',
            cityId: 'cityCode',
            cityNameId: 'cityName',
            branchBankId: 'bankId',
            branchBankNameId: 'brankBankName',
        });
    }
});
