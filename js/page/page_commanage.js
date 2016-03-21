/**
 * Author:DuYutao
 * Date:2016-2-25
 * Description:公司管理列表
 */
/**
 * 功能：初始化公司列表
 * @return {[type]} [description]
 */
var initDatatable = function() {

    var comTable = function() {
            var oTable = $('#comlist').dataTable({
                // Internationalisation. For more info refer to http://datatables.net/manual/i18n
                searching: false,
                paging: true,
                buttons: [],
                "ajax": {
                    "url": "/backStage/company/page.do",
                    "type": "POST",
                    "data": function(d) {
                        $('#searchForm').formatFormParam(d);
                    },
                    "dataSrc": function(json) { //datatable callback后可以修改数据的地方
                        var objstatus = {
                            1: '正常',
                            2: '停用',
                        };
                        for (var i = 0, ien = json.data.length; i < ien; i++) {
                            json.data[i].statusName = objstatus[json.data[i].status];
                        }
                        return json.data;
                    }
                },
                "processing": true,
                "serverSide": true,
                "rowId": "id",
                "columns": [
                    { "data": "id" },
                    { "data": "companyCode" },
                    { "data": "companyName" },
                    { "data": "companyAddress" },
                    { "data": "statusName" },
                    { "data": "companyRemark" }, {
                        "class": "",
                        "orderable": false,
                        "data": null,
                        "defaultContent": '<a name="btnEdit" class="btn btn-primary" href="javascript:;"> 编辑 </a><a name="btnEnable" class="btn btn-success" href="javascript:;">启用</a>',
                    }
                ],
                // setup responsive extension: http://datatables.net/extensions/responsive/
                // responsive: true,
                // "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.

                "ordering": false, // disable column ordering
                //"paging": false, disable pagination


                "lengthMenu": [
                    [1, 5, 10, 15, 20, -1],
                    [1, 5, 10, 15, 20, "全部"] // change per page values here
                ],
                // set the initial value
                "pageLength": 10,

                // "pagingType": "bootstrap_full_number",
                "columnDefs": [{
                    "targets": [0],
                    "visible": false,
                    "searchable": false
                }, {
                    "targets": [6],
                    "render": function(data, type, row) {
                        var redata = '';
                        if (data.status == 1) {
                            redata = '<a name="btnEdit" class="btn btn-primary" href="javascript:;"> 编辑 </a><a name="btnDisable" class="btn btn-danger" href="javascript:;">停用</a>';
                        } else {
                            redata = '<a name="btnEdit" class="btn btn-primary" href="javascript:;"> 编辑 </a><a name="btnEnable" class="btn btn-success" href="javascript:;">启用</a>';
                        }
                        return redata;
                    }
                }],
                initComplete: function(data) {
                    $('#btnSearch').on('click', function(e) {
                        oTable.api().ajax.reload();
                    });
                    $('#comlist').on('click', function(e) {
                        var tarName = $(e.target).attr('name'),
                            $curRow = $(e.target).closest('tr'),
                            curRowId = oTable.api().row($curRow[0]).id();
                        switch (tarName) {
                            case 'btnEdit':
                                window.location.href = Util.addUrlParam(Inter.getApiUrl()['comEdit'], { 'comId': curRowId });
                                break;
                            case 'btnEnable':
                                var postdata = {
                                        comId: curRowId,
                                        status: 1,
                                    },
                                    $curRowTd = $('>td', $curRow);
                                // oTable.fnDraw();
                                // console.log($curRowTd);
                                $.post(Inter.getApiUrl()['enableCom'], postdata, function(data) {
                                    if (data.success) {
                                        oTable.fnUpdate('正常', $curRow, 4, false);
                                        oTable.fnUpdate('<a name="btnEdit" class="btn btn-primary" href="javascript:;"> 编辑 </a><a name="btnDisable " class="btn btn-danger" href="javascript:;">停用</a>', $curRow, 6, true);
                                    } else {
                                        bootbox.alert(data.errMsg);
                                    }
                                });
                                break;
                            case 'btnDisable':
                                var postdata = {
                                    comId: curRowId,
                                    status: 2,
                                };
                                var enableUrl = "";
                                $.post(Inter.getApiUrl()['enableCom'], postdata, function(data) {
                                    if (data.success) {
                                        oTable.fnUpdate('停用', $curRow, 4, false);
                                        oTable.fnUpdate('<a name="btnEdit" class="btn btn-primary" href="javascript:;"> 编辑 </a><a name="btnEnable" class="btn btn-success" href="javascript:;">启用</a>', $curRow, 6, true);
                                    } else {
                                        bootbox.alert(data.errMsg);
                                    }
                                });
                                break;
                        }
                    });
                },
                "dom": "<'row' <'col-md-12'B>><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

            });
        },
        initDaterange = function() {
            if (!jQuery().daterangepicker) {
                return;
            }

            $('#createDate').daterangepicker({
                "ranges": {
                    '今日': [moment(), moment()],
                    '昨日': [moment().subtract('days', 1), moment().subtract('days', 1)],
                    '过去七天': [moment().subtract('days', 6), moment()],
                    '过去30天': [moment().subtract('days', 29), moment()],
                    '上个月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                },
                // autoUpdateInput: false,
                "locale": {
                    "format": "YYYY/MM/DD",
                    "separator": " - ",
                    "applyLabel": "确定",
                    "cancelLabel": "取消",
                    "fromLabel": "从",
                    "toLabel": "至",
                    "customRangeLabel": "自定义",
                    "daysOfWeek": [
                        "周日",
                        "周一",
                        "周二",
                        "周三",
                        "周四",
                        "周五",
                        "周六"
                    ],
                    "monthNames": [
                        "一月",
                        "二月",
                        "三月",
                        "四月",
                        "五月",
                        "六月",
                        "七月",
                        "八月",
                        "九月",
                        "十月",
                        "十一月",
                        "十二月"
                    ],
                    "firstDay": 1
                },
                //"startDate": "11/08/2015",
                //"endDate": "11/14/2015",
            }, function(start, end, label) {
                // $('#createDate span').html(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'));
                /*$('#createDate').hide();*/
            });            
        };
    return {
        //main function to initiate the module
        init: function() {
            if (!jQuery().dataTable) {
                return;
            }
            comTable();
            initDaterange();
        }
    };
}();


jQuery(document).ready(function() {
    initDatatable.init();
    $('#btnCreateCom').on('click', function() {
        window.location.href = "addView";
    });
    $('#btnClearForm').on('click', function() {
        document.getElementById("searchForm").reset();
    });
});
