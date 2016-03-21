/**
 * Author:DuYutao
 * Date:2016-3-16
 * Description:公司端管理账户管理界面
 */

//初始化基本信息界面
var initAccManPage = function() {

    //初始化提现界面
    var initCashOutBtn = function() {
        $('#btnCashOut').on('click', function(e) {
            window.location.href = ued_conf.comPath + "/cashout";
        });
    }

    //初始化交易记录按钮
    var initTradeRecord = function() { 
        $('#btnViewRecord').on('click', function(e) {
            window.location.href = ued_conf.comPath + "/traderecord";
        });
    }

    return {

        //main function to initiate the module
        init: function() {
            initCashOutBtn();
            initTradeRecord();
        }
    };

}();

//初始化提现界面
var initCashoutPage = function() {

    //初始化下一步操作按钮
    var initNextBtn = function() {
        $('#btnNext').on('click', function(e) {
            window.location.href = ued_conf.comPath + "/cashoutpass";
        });
    }
    return {

        //main function to initiate the module
        init: function() {
            initNextBtn();
        }
    };
}();

//初始化提现确认界面
var initCashOutPassPage = function() {

    //确认按钮增加事件
    var initConfirmBtn = function() {
        $('#btnConfirm').on('click', function(e) {
            // window.location.href = ued_conf.comPath + "/cashout";
        });
    }
    return {

        //main function to initiate the module
        init: function() {
            initConfirmBtn();
        }
    };
}();

jQuery(document).ready(function() {
    if ($('#basicInfoForm')) {
        initAccManPage.init();
    }
    if ($('#cashOutForm')) {
        initCashoutPage.init();
    }
    if ($('#cashOutPassForm')) {
        initCashOutPassPage.init();
    }
});
