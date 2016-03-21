var TableDatatablesEditable = function() {
    var initDialog = function() {
        $('#btnUploadBill').on('click', function(e) {
            var dialogContent = [];
            dialogContent.push('<div class="row">');
            dialogContent.push('<div class="col-md-12">');
            dialogContent.push('<div class="form-group">');
            dialogContent.push('<div class="input-group">');
            dialogContent.push('<label class="input-group-addon">年度</label>');
            dialogContent.push('<div class="input-group-content">');
            dialogContent.push('<input type="text" id="year" name="year" class="form-control date-picker" placeholder="年度" value="">');
            dialogContent.push('</div>');
            dialogContent.push('</div>');
            dialogContent.push('</div>');
            dialogContent.push('</div>');
            dialogContent.push('<div class="col-md-12">');
            dialogContent.push('<div class="form-group">');
            dialogContent.push('<div class="input-group">');
            dialogContent.push('<label class="input-group-addon">月度</label>');
            dialogContent.push('<div class="input-group-content">');
            dialogContent.push('<input type="text" id="month" name="month" class="form-control date-picker" placeholder="月度" value="">');
            dialogContent.push('</div>');
            dialogContent.push(' </div>');
            dialogContent.push('</div>');
            dialogContent.push('</div>');
            dialogContent.push('<div class="col-md-12">');
            dialogContent.push('<div class="form-group">');
            dialogContent.push('<span class="btn green fileinput-button" >');
            dialogContent.push('<i class="glyphicon glyphicon-plus"></i>');
            dialogContent.push('<span>添加工资单</span>');
            dialogContent.push('<input id="fileupload" type="file" name="files[]" ></span>');
            // dialogContent.push('<div id="progress" class="progress">');
            // dialogContent.push('<div class="progress-bar progress-bar-success"></div>');
            dialogContent.push('</div>');
            dialogContent.push('<div id="files" class="files"></div>');
            dialogContent.push('</div>');
            dialogContent.push('</div>');
            dialogContent.push(' </div>');
            bootbox.dialog({
                message: dialogContent.join(''),
                title: "上传工资单",
                buttons: {
                    success: {
                        label: "保存",
                        className: "green",
                        callback: function() {
                            $('#btnUpload').trigger('click');
                            return false;
                        }
                    },
                    danger: {
                        label: "取消",
                        className: "default",
                        callback: function() {}
                    },
                }
            }).init(function(e) {
                $('#fileupload').fileupload({
                        url: Inter.getApiUrl().uploadSalary,
                        dataType: 'json',
                        autoUpload: false,
                        acceptFileTypes: /(\.|\/)(xls?x)$/i,
                        maxFileSize: 999000,
                        formData: { year: $('#year').val(), month: $('#month').val() },        //添加额外的数据
                        singleFileUploads: true,
                        // Enable image resizing, except for Android and Opera,
                        // which actually support image resizing, but fail to
                        // send Blob objects via XHR requests:
                        disableImageResize: /Android(?!.*Chrome)|Opera/
                            .test(window.navigator.userAgent),
                        previewMaxWidth: 100,
                        previewMaxHeight: 100,
                        previewCrop: true,
                        maxNumberOfFiles: 1,
                    }).on('fileuploadadd', function(e, data) {
                        data.context = $('<div/>').appendTo('#files');
                        $.each(data.files, function(index, file) {
                            var node = $('<p/>').append($('<span/>').text(file.name));
                            node.appendTo(data.context);
                        });
                        var uploadButton = $('<button/>').text('Upload').css('display', 'none').attr('id', 'btnUpload');
                        uploadButton.insertAfter('#fileupload').on('click', function(e) {
                            data.submit();
                        });

                    }).on('fileuploadprocessalways', function(e, data) {
                        var index = data.index,
                            file = data.files[index],
                            node = $(data.context.children()[index]);
                        if (file.preview) {
                            node
                                .prepend('<br>')
                                .prepend(file.preview);
                        }
                        if (file.error) {
                            node
                                .append('<br>')
                                .append($('<span class="text-danger"/>').text(file.error));
                        }
                        if (index + 1 === data.files.length) {
                            data.context.find('button')
                                .text('Upload')
                                .prop('disabled', !!data.files.error);
                        }
                    }).on('fileuploadprogressall', function(e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('#progress .progress-bar').css(
                            'width',
                            progress + '%'
                        );
                    }).on('fileuploaddone', function(e, data) {
                        var re = data.result;
                        if(re.success){

                        }else{
                            // switch(re.errCode){
                            //     case '002':
                            //     break;
                            // 
                            // }
                            var arrErrMsg = [];
                            for(var i = 0;i<re.message.length;i++){
                                arrErrMsg.push(re.message+"<br/>");
                            }
                            bootbox.alert(arrErrMsg.join(''));
                        }
                        console.log(data);
                        // $.each(data.result.files, function(index, file) {
                        //     if (file.url) {
                        //         var link = $('<a>')
                        //             .attr('target', '_blank')
                        //             .prop('href', file.url);
                        //         $(data.context.children()[index])
                        //             .wrap(link);
                        //     } else if (file.error) {
                        //         var error = $('<span class="text-danger"/>').text(file.error);
                        //         $(data.context.children()[index])
                        //             .append('<br>')
                        //             .append(error);
                        //     }
                        // });
                    }).on('fileuploadfail', function(e, data) {
                        $.each(data.files, function(index) {
                            var error = $('<span class="text-danger"/>').text('File upload failed.');
                            $(data.context.children()[index])
                                .append('<br>')
                                .append(error);
                        });
                    }).prop('disabled', !$.support.fileInput)
                    .parent().addClass($.support.fileInput ? undefined : 'disabled');
            });
        });
    }

    var handleTable = function() {

        var table = $('#salaryList');

        var oTable = table.dataTable({

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
            // So when dropdowns used the scrollable div should be removed. 
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
                "url": "/userCenter/company/page.do",
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
            // setup responsive extension: http://datatables.net/extensions/responsive/
            responsive: true,

            //"ordering": false, disable column ordering 
            //"paging": false, disable pagination

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

        // var tableWrapper = $("#sample_editable_1_wrapper");

        table.on('click', '.delete', function(e) {
            e.preventDefault();

            if (confirm("Are you sure to delete this row ?") == false) {
                return;
            }

            var nRow = $(this).parents('tr')[0];
            oTable.fnDeleteRow(nRow);
            alert("Deleted! Do not forget to do some ajax to sync with backend :)");
        });

        table.on('click', '.pay', function(e) {
            e.preventDefault();
            if (nNew) {
                oTable.fnDeleteRow(nEditing);
                nEditing = null;
                nNew = false;
            } else {
                restoreRow(oTable, nEditing);
                nEditing = null;
            }
        });

        table.on('click', '.edit', function(e) {
            e.preventDefault();

            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];

            if (nEditing !== null && nEditing != nRow) {
                /* Currently editing - but not this row - restore the old before continuing to edit mode */
                restoreRow(oTable, nEditing);
                editRow(oTable, nRow);
                nEditing = nRow;
            } else if (nEditing == nRow && this.innerHTML == "保存") {
                /* Editing this row and want to save it */
                saveRow(oTable, nEditing);
                nEditing = null;
                alert("Updated! Do not forget to do some ajax to sync with backend :)");
            } else {
                /* No edit in progress - let's start one */
                editRow(oTable, nRow);
                nEditing = nRow;
            }
        });
    }

    return {

        //main function to initiate the module
        init: function() {
            // handleTable();
            initDialog();
        }

    };

}();

jQuery(document).ready(function() {
    TableDatatablesEditable.init();
});
