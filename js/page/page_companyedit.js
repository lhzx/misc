/**
 * Author:DuYutao
 * Date:2016-2-25
 * Description:添加公司列表
 */

/**
 * 页面初始化
 */
var InitComManPage = function() {

    var handleDatePickers = function() {

        if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                orientation: "left",
                autoclose: true,
                language: "zh-CN",
                format: "yyyy-mm-dd",
            });
            //$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
        }

        /* Workaround to restrict daterange past date select: http://stackoverflow.com/questions/11933173/how-to-restrict-the-selectable-date-ranges-in-bootstrap-datepicker */
    }

    var initBankBranchSelect = function() {
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
    return {
        //main function to initiate the module
        init: function() {
            handleDatePickers();
        }
    };

}();
var FormValidation = function() {

    // basic validation
    var createFormValidation = function() {
        // for more info visit the official plugin documentation: 
        // http://docs.jquery.com/Plugins/Validation

        var createForm = $('#createForm');
        var formError = $('.alert-danger', createForm);
        var formSuccess = $('.alert-success', createForm);

        createForm.validate({
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
                companyCode: {
                    required: true
                },
                companyName: {
                    required: true,
                },
                companyType: {
                    required: true,
                },
                createTime: {
                    required: true,
                    dateCN: true,
                },
                companyAddress: {
                    required: true,
                    maxlength: 128,
                },
                status: {
                    required: true
                },
                legalPerson: {
                    required: true,
                    maxlength: 128,
                },
                papersType: {
                    required: true
                },
                papersNum: {
                    required: true
                },
                email: {
                    // required: true,
                    email: true
                },
                contacts: {
                    required: true,
                },
                officeTel: {
                    required: true,
                },
                telephone: {
                    required: true,
                },
                contacts: {
                    required: true,
                },
                bankUserName: {
                    required: true,
                    // creditcard: true
                },
                cardNum: {
                    required: true,
                    creditcard: true
                },
                bankCode: {
                    required: true,
                },
                provinceCode: {
                    required: true,
                },
                cityCode: {
                    required: true,
                },
                branchBankCode: {
                    required: true,
                },
                accountType: {
                    required: true,
                }
            },

            errorPlacement: function(error, element) {
                error.appendTo(element.parent());
            },

            invalidHandler: function(event, validator) { //display error alert on form submit              
                formSuccess.hide();
                formError.show();
                App.scrollTo(formError, -200);
            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            unhighlight: function(element) { // revert the change done by hightlight
                $(element)
                    .closest('.form-group').removeClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label
                    .closest('.form-group').removeClass('has-error'); // set success class to the control group
            },

            submitHandler: function(form) {
                formSuccess.show();
                formError.hide();
            }
        });
    }

    return {
        //main function to initiate the module
        init: function() {
            createFormValidation();
        }

    };
}();

jQuery(document).ready(function() {
    document.getElementById('createForm').reset();
    InitComManPage.init();
    FormValidation.init();
    $.initSelectBank({
        bankId: 'bankCode', //银行ID
        bankNameId: 'bankName', //银行Name
        provinceId: 'provinceCode',
        provinceNameId: 'provinceName',
        cityId: 'cityCode',
        cityNameId: 'cityName',
        branchBankId: 'branchBankCode',
        branchBankNameId: 'branchBankName',

    });
    $('#companyName').blur(function(e) {
        var curV = $(this).val();
        $('#bankUserName').val(curV);
    });
    $('#btnBack').on('click',function(e) {
        window.location.href='/backStage/company/showindex';
    });
    $('#btnSubmit').on('click', function(e) {
        var postdata = $('#createForm').formatForm();
        console.log(postdata);
        if ($('#createForm').valid()) {
            $(this).find('.btn').prop('disabled', true);
            $.post(Inter.getApiUrl()['comManAdd'], postdata, function(data) {
                if (data.success) {
                    window.location.href = "showindex.do";
                } else {
                    $(this).find('.btn').prop('disabled', false);
                    bootbox.alert(data.errMsg);
                }
            });
        }
    });
});
