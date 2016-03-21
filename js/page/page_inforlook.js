var InfoDatatablesManaged = function () {

    var initIndTable = function () {

        var table = $('#inforlook_body');
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
                { extend: 'print', className: 'btn dark btn-outline', text:'打印此表格' },
                { extend: 'pdf', className: 'btn green btn-outline', text:'导出pdf' },
                { extend: 'excel', className: 'btn yellow btn-outline', text:'导出excel' },
            ],
            "processing": true,
            "serverSide": true,
            "ajax": {
                "url" : Inter.getApiUrl().auditingPage,
                "type": "POST",
                "data": function ( d ) {
                    $('#infoSearchForm').formatFormParam(d);
                }
            },
            "rowId": 'id',
            "columns": [
                { "data": "userName"},
                { "data": "userCode"},
                { "data": "lawNo" },
                { "data": "mobileTel" },
                { "data": "companyId" },
                { "data": "remark" },
                { "data": "statusStr"},
                { 
                    "class": "",
                    "orderable": false,
                    "data": null,
                    "defaultContent": '<a class="view btn btn-primary" href="javascript:;"> 查看 </a><a class="pass btn btn-success" href="javascript:;" data-id="1"> 通过 </a><a class="nopass btn btn-success" href="javascript:;" data-id="2"> 不通过 </a><a class="conform btn btn-success" href="javascript:;" data-id="3"> 确定 </a>',
                }
            ],

            "responsive": true,
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

        var tableWrapper = jQuery('#inforlook_body_wrapper');

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
        $('a.infosearch').on( 'click', function () {
            oTable._fnAjaxUpdate();
            // oTable.ajax.reload();
            // var args = oTable.ajax.params();
            // console.log(args);

        });
        //搜索条件重置
        $('a.inforest').on( 'click', function () {
            $('#infoSearchForm')[0].reset();
        } );
        //通过状态修改
        table.on('click', '.pass', function (e) {
            e.preventDefault();
            var status = 1,
                infoid = $(this).closest('tr').attr('id');
            console.log(infoid,status);
            $.post(Inter.getApiUrl().auditingEditStatus, {'userIds':infoid,'status':status}, function(data){
                console.log(data);
                // if(data.success == true){
                //     table.find('.active').find('td:eq(8)').text('启用');
                // }
            })
        });
        //不通过
        table.on('click', '.nopass', function (e) {
            e.preventDefault();
            var status = 2,
                infoid = $(this).closest('tr').attr('id');
            console.log(infoid,status);
            $.post(Inter.getApiUrl().auditingEditStatus, {'userIds':infoid,'status':status}, function(data){
                // if(data.success == true){
                //     table.find('.active').find('td:eq(8)').text('启用');
                // }
            })
        });
        //确定信息
        table.on('click', '.conform', function (e) {
            e.preventDefault();
            var status = 1,
                infoid = $(this).closest('tr').attr('id');
            console.log(infoid,status);
            $.post(Inter.getApiUrl().auditingEditStatus, {'userIds':infoid,'status':status}, function(data){
                // if(data.success == true){
                //     table.find('.active').find('td:eq(8)').text('启用');
                // }
            })
        });
        //查看明细
        table.on('click', '.view', function (e) {
            e.preventDefault();
            infoid = $(this).closest('tr').attr('id');
            console.log(infoid,status);
            window.location.href=Inter.getApiUrl().infordetail+"/"+infoid;
            /*$.post(Inter.getApiUrl().auditingEditStatus+"?"+infoid,'', function(data){
                alert(123);
            });*/
            
        });
    }
    
    return {

        //main function to initiate the module
        init: function () {
            if (!jQuery().dataTable) {
                return;
            }
            initIndTable();
        }

    };

}();

if (App.isAngularJsApp() === false) { 
    jQuery(document).ready(function() {
        InfoDatatablesManaged.init();
    });
}
jQuery(document).ready(function() {
    if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                orientation: "right",
                autoclose: true,
                language: "zh-CN",
                format: "yyyy-mm-dd",
            });
            //$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
        }
});
