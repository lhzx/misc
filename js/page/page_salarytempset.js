/**
 * Author:DuYutao
 * Date:2016-3-16
 * Description:公司端工资模板设置
 */

/**
 * 页面中全局变量
 * @type {Object}
 */
var pageData = {
    objItems: {},
    objsrc: {}, //位置操作的源Dom
}

/**
 * 页面初始化
 */
var InitTempSetPage = function() {
    var strInputTemp = '<div class="col-md-6 tempItemDiv">' +
        '<div class="form-group">' +
        '<div class="input-group">' +
        '<label class="input-group-addon"  name="item" title="#{column}"  data-type="#{itemType}">#{column}</label>' +
        '<div class="input-group-content">' +
        '<input type="text"class="form-control" placeholder=""  value="" readonly="" >' +
        '</div>' +
        '<i class="btnDel fa fa-times #{hideCls}"></i>' +
        '</div>' +
        '</div>' +
        '</div>';
    //初始化查询功能
    var initSearchBtn = function() {
        $('#btnSearch').on('click', function() {
            var postData = {
                type: $('#selTemplate').val() || 1,
            }
            Util.setAjax(Inter.getApiUrl().getSalaryTemp, postData, function(data) {
                if (data.success) {
                    // var data={};
                    // data.data = { "type": "1", "basic": ["身份证/护照号", "姓名"], "fund": ["年度", "月度", "实发合计", "扣款合计"], "salary": ["年度", "公积金基数", "养老个人缴纳", "公积金单位缴纳"], "salaryUrl": "http://hiring.oss-cn-beijing.aliyuncs.com/trusdom/salarymodel/%E5%B7%A5%E8%B5%84%E5%8D%95%E6%A8%A1%E6%9D%BF2003%E7%89%88.xls" }
                    var defaultTemp = com_Conf.getSalaryConf('tempItems'),
                        fixedItems = com_Conf.getSalaryConf('fixedItems'),
                        tempItems = $.extend({}, defaultTemp, data.data, true),
                        tempUrl = tempItems.salaryUrl;
                    $('#btnDownload').attr('href',tempUrl);
                    delete tempItems.type;
                    delete tempItems.salaryUrl;

                    for (var key in tempItems) {
                        var arrHtml = [],
                            hideCls;
                        tempItems[key] = Util.distinctArray(fixedItems[key].concat(tempItems[key]));
                        for (var i = 0; i < tempItems[key].length; i++) {
                            if ($.inArray(tempItems[key][i], fixedItems[key]) >= 0) {
                                hideCls = 'hide';
                            } else {
                                hideCls = '';
                            }
                            pageData.objItems[tempItems[key][i]] = 1;
                            arrHtml.push(Util.template(strInputTemp, { column: tempItems[key][i], hideCls: hideCls, itemType: key }));
                        }
                        $('#' + key + 'Info').html(arrHtml.join(''));
                    }
                    // alert(re);
                } else {
                    bootbox.alert(data.errMsg);
                }
            }, function(data) {

            });
        }).trigger('click');

    }

    //初始化添加功能
    var initAddBtn = function() {
        $('[name="addItem"]').on('click', function(e) {
            var domFor = $(this).data('for'),
                $inputDom = $(this).closest('div').find('input'),
                inputV = $inputDom.val();
            if (!inputV) {
                return;
            }
            if (inputV && !pageData.objItems[inputV]) {
                var $virualDom = $(Util.template(strInputTemp, { column: inputV, hideCls: '' }));
                $virualDom.appendTo('#' + domFor + 'Info');
                pageData.objItems[inputV] = 1;
            } else {
                bootbox.alert(inputV + '已经存在，不能重复添加。');
            }
            $inputDom.val('');
        });
    }

    //初始化每一项后面的删除功能
    var initDeleteBtn = function() {
        $('.createform').on('click', '.btnDel', function(e) {
            var $tempItemDiv = $(this).closest('.tempItemDiv'),
                inputV = $tempItemDiv.find('[name=item]').text(),
                itemType = $tempItemDiv.find('[name=item]').data('type');
            $(this).closest('.tempItemDiv').remove();
            delete pageData.objItems[itemType][inputV];
        });
    }

    //初始化保存功能
    var initSaveBtn = function() {
        $('#btnSave').on('click', function(e) {
            var $items = $('[name=item]'),
                inputV = '',
                itemType = '';
            var postData = {
                id: $('#selTemplate').val()
            };
            $items.each(function(i, e) {
                inputV = $(this).text();
                itemType = $(this).data('type');
                if (!postData[itemType]) {
                    postData[itemType] = [];
                }
                postData[itemType].push(inputV);
            });
            Util.setAjax(Inter.getApiUrl().saveSalaryTemp, postData, function(data) {
                console.log(data);
            }, function(data) {
                console.log(data);
            });
            // console.log(postData);
        });
    }

    //初始化置顶、上移、下移、置底功能
    var initPositionHandler = function() {
        $(document).on('click', function(e) {
            var $itemDiv = $(e.target).closest('.tempItemDiv');
            if ($itemDiv.length > 0) {
                pageData.objsrc = $itemDiv;
                // pageData.objsrc.remove();
            } else {
                if ($(e.target).hasClass('posiHandle')) {
                    if (pageData.objsrc.length > 0) {
                        $clone = pageData.objsrc.clone(true);
                    } else {
                        bootbox.alert('请选择数据项');
                        return;
                    }
                    var id = $(e.target).attr('id'),
                        $clone, $pre, $next, $parent;
                    switch (id) {
                        case "btnSetTop":
                            $pre = pageData.objsrc.prev();
                            if ($pre.length > 0) {
                                $parent = pageData.objsrc.parent();
                                pageData.objsrc.remove();
                                $parent.prepend($clone);
                            } else {
                                bootbox.alert('已经是顶部了，不能再移动了');
                                return;
                            };
                            break;
                        case "btnSetBottom":
                            $next = pageData.objsrc.next();
                            if ($next.length > 0) {
                                $parent = pageData.objsrc.parent();
                                pageData.objsrc.remove();
                                $parent.append($clone);
                            } else {
                                bootbox.alert('已经是底部了，不能再移动了');
                                return;
                            }
                            break;
                        case "btnSetUp":
                            $pre = pageData.objsrc.prev();
                            if ($pre.length > 0) {
                                pageData.objsrc.remove();
                                $pre.before($clone);
                            } else {
                                bootbox.alert('已经是顶部了，不能再移动了');
                                return;
                            }
                            break;
                        case "btnSetDown":
                            $next = pageData.objsrc.next();
                            if ($next.length > 0) {
                                pageData.objsrc.remove();
                                $next.after($clone);
                            } else {
                                bootbox.alert('已经是底部了，不能再移动了');
                                return;
                            }
                            break;
                    }
                    pageData.objsrc = $clone;
                } else {
                    pageData.objsrc = undefined;
                }
            }
            console.log(pageData.objsrc);
        });
    }

    //初始化模板的选择
    var initSalarySelect = function() {
        var arrOptions = [],
            objConf = com_Conf.getSalaryConf('salaryTemplateType');
        for (key in objConf) {
            arrOptions.push('<option value="' + key + '">' + objConf[key] + '</option>');
        }
        $('#selTemplate').empty().append(arrOptions.join(''));
    }

    return {
        //main function to initiate the module
        init: function() {
            initSearchBtn();
            initAddBtn();
            initDeleteBtn();
            initSaveBtn();
            initPositionHandler();
            initSalarySelect();
        }
    };

}();
// var FormValidation = function() {

//     // basic validation
//     var createFormValidation = function() {
//         // for more info visit the official plugin documentation:
//         // http://docs.jquery.com/Plugins/Validation

//         var createForm = $('#createForm');
//         var formError = $('.alert-danger', createForm);
//         var formSuccess = $('.alert-success', createForm);

//         createForm.validate({
//             errorElement: 'span', //default input error message container
//             errorClass: 'help-block help-block-error', // default input error message class
//             focusInvalid: false, // do not focus the last invalid input
//             ignore: "", // validate all fields including form hidden input
//             messages: {
//                 select_multi: {
//                     maxlength: jQuery.validator.format("Max {0} items allowed for selection"),
//                     minlength: jQuery.validator.format("At least {0} items must be selected")
//                 }
//             },
//             rules: {
//                 companyCode: {
//                     required: true
//                 },
//                 companyName: {
//                     required: true,
//                 },
//                 companyType: {
//                     required: true,
//                 },
//                 createTime: {
//                     required: true,
//                     dateCN: true,
//                 },
//                 companyAddress: {
//                     required: true,
//                     maxlength: 128,
//                 },
//                 status: {
//                     required: true
//                 },
//                 legalPerson: {
//                     required: true,
//                     maxlength: 128,
//                 },
//                 papersType: {
//                     required: true
//                 },
//                 papersNum: {
//                     required: true
//                 },
//                 email: {
//                     // required: true,
//                     email: true
//                 },
//                 contacts: {
//                     required: true,
//                 },
//                 officeTel: {
//                     required: true,
//                 },
//                 telephone: {
//                     required: true,
//                 },
//                 contacts: {
//                     required: true,
//                 },
//                 bankUserName: {
//                     required: true,
//                     // creditcard: true
//                 },
//                 cardNum: {
//                     required: true,
//                     creditcard: true
//                 },
//                 bankCode: {
//                     required: true,
//                 },
//                 provinceCode: {
//                     required: true,
//                 },
//                 cityCode: {
//                     required: true,
//                 },
//                 branchBankCode: {
//                     required: true,
//                 },
//                 accountType: {
//                     required: true,
//                 }
//             },

//             errorPlacement: function(error, element) {
//                 error.appendTo(element.parent());
//             },

//             invalidHandler: function(event, validator) { //display error alert on form submit
//                 formSuccess.hide();
//                 formError.show();
//                 App.scrollTo(formError, -200);
//             },

//             highlight: function(element) { // hightlight error inputs
//                 $(element)
//                     .closest('.form-group').addClass('has-error'); // set error class to the control group
//             },

//             unhighlight: function(element) { // revert the change done by hightlight
//                 $(element)
//                     .closest('.form-group').removeClass('has-error'); // set error class to the control group
//             },

//             success: function(label) {
//                 label
//                     .closest('.form-group').removeClass('has-error'); // set success class to the control group
//             },

//             submitHandler: function(form) {
//                 formSuccess.show();
//                 formError.hide();
//             }
//         });
//     }

//     return {
//         //main function to initiate the module
//         init: function() {
//             createFormValidation();
//         }

//     };
// }();

jQuery(document).ready(function() {
    // console.log(com_Conf.getSalaryConf('salaryTemplateType'));

    // document.getElementById('createForm').reset();
    InitTempSetPage.init();
    // FormValidation.init();
    // $.initSelectBank({
    //     bankId: 'bankCode', //银行ID
    //     bankNameId: 'bankName', //银行Name
    //     provinceId: 'provinceCode',
    //     provinceNameId: 'provinceName',
    //     cityId: 'cityCode',
    //     cityNameId: 'cityName',
    //     branchBankId: 'branchBankCode',
    //     branchBankNameId: 'branchBankName',

    // });
    // $('#companyName').blur(function(e) {
    //     var curV = $(this).val();
    //     $('#bankUserName').val(curV);
    // });
    // $('#btnBack').on('click',function(e) {
    //     window.location.href='/backStage/company/showindex';
    // });
    // $('#btnSubmit').on('click', function(e) {
    //     var postdata = $('#createForm').formatForm();
    //     console.log(postdata);
    //     if ($('#createForm').valid()) {
    //         $(this).find('.btn').prop('disabled', true);
    //         $.post(Inter.getApiUrl()['comManAdd'], postdata, function(data) {
    //             if (data.success) {
    //                 window.location.href = "showindex.do";
    //             } else {
    //                 $(this).find('.btn').prop('disabled', false);
    //                 bootbox.alert(data.errMsg);
    //             }
    //         });
    //     }
    // });
});
