/**
 * 功能：银行下拉选择功能
 * require: select2.css select2.full.js selectbank.js
 * 使用方法：
 * Dom元素：
    <input name="provinceName" id="provinceName" type="hidden" />
    <select name="provinceCode" id="provinceCode" class="form-control input-inline">
    </select>
    Js文件
    $.initSelectBank({
        bankId: 'bankCode', //银行ID
        bankNameId: 'bankName', //银行Name
        provinceId: 'provinceCode',
        provinceNameId: 'provinceName',
        cityId: 'cityCode',
        cityNameId: 'cityName',
        branchBankId: 'brankBankCode',
        branchBankNameId: 'brankBankName',

    });
 */
;
(function($) {
    function initBranchBank(options) {
        var bankId = $("#" + options.bankId).val(),
            cityId = $("#" + options.cityId).val(),
            $branchBankSelect;
        if (!bankId || !cityId) {
            if ($('#' + options.branchBankId).attr('aria-hidden')) {
                $("#" + options.branchBankId).html('');
            }
            $branchBankSelect = $("#" + options.branchBankId).select2({
                placeholder: '请先选择开户行，省份和城市信息',
            });
            $branchBankSelect.val(null).trigger('change');
        } else {
            $("#" + options.branchBankId).select2({
                width: "off",
                placeholder: '请输入选择开户支行',
                allowClear: true,
                ajax: {
                    url: Inter.getApiUrl()['branchBank'],
                    dataType: 'json',
                    delay: 1000,
                    data: function(params) {
                        return {
                            q: params.term, // search term
                            cityCode: $("#" + options.cityId).val(),
                            clsCode: $("#" + options.bankId).val().substring(0, 3),
                            page: params.page
                        };
                    },
                    processResults: function(data, params) {
                        // parse the results into the format expected by Select2
                        // since we are using custom formatting functions we do not need to
                        // alter the remote JSON data, except to indicate that infinite
                        // scrolling can be used
                        params.page = params.page || 1;

                        return {
                            results: data.data, //返回的数据
                            pagination: {
                                more: (params.page * 30) < data.total_count
                            }
                        };
                    },
                    cache: true
                },
                matcher: function(params, data) {
                    // If there are no search terms, return all of the data
                    if ($.trim(params.term) === '') {
                        return data;
                    }
                    // `params.term` should be the term that is used for searching
                    // `data.text` is the text that is displayed for the data object
                    if (data.text.indexOf(params.term) > -1) {
                        var modifiedData = $.extend({}, data, true);
                        // modifiedData.text += ' (matched)';

                        // You can return modified objects from here
                        // This includes matching the `children` how you want in nested data sets
                        return modifiedData;
                    }

                    // Return `null` if the term should not be displayed
                    return null;
                },
                escapeMarkup: function(markup) {
                    return markup;
                }, // let our custom formatter work
                minimumInputLength: 1,
                // templateResult: formatRepo,
                // templateSelection: formatRepoSelection
            }).change(function(event) {
                /* Act on the event */
                var thisId = $(this).attr('id'),
                    name = $('#select2-' + thisId + '-container').attr('title');
                $('#' + options.branchBankNameId).val(name);
                //值发生了变化
                if ($('#' + options.branchBankNameId).data('code') != $("#" + options.branchBankId).val()) {
                    cleanDataCode(options,'branch');
                }
            }).select2('val', $('#' + options.branchBankNameId).data('code'));
        }
    }
    /**
     * 清空data-code 内容
     * @return {[type]} [description]
     */
    function cleanDataCode(options, source) {
        switch (source) {
            case 'bank':
                $('#' + options.bankNameId).attr('data-code', '');
                break;
            case "province":
                $('#' + options.provinceNameId).attr('data-code', '');
                $('#' + options.cityNameId).attr('data-code', '');
                break;
            case "city":
                $('#' + options.cityNameId).attr('data-code', '');
                break;
        }
        $('#' + options.branchBankNameId).attr('data-code', '');
    }
    $.extend({
        /*格式化form表单的参数，转换为JSON格式*/
        initSelectBank: function(options) {
            var defaultOption = {
                bankId: 'selBank', //银行ID
                bankNameId: 'bankName', //银行Name
                provinceId: 'selProvince',
                provinceNameId: 'provinceName',
                cityId: 'selCity',
                cityNameId: 'cityName',
                branchBankId: 'selbranchBank',
                branchBankNameId: 'branchBankName',
            };
            options = $.extend(defaultOption, options);
            $("#" + options.bankId).select2({
                width: "off",
                data: objBankName,
                placeholder: "请输入并选择银行",
                allowClear: true,
                // escapeMarkup: function(markup) {
                //     return markup;
                // }, // let our custom formatter work
                matcher: function(params, data) {
                    // If there are no search terms, return all of the data
                    if ($.trim(params.term) === '') {
                        return data;
                    }
                    // `params.term` should be the term that is used for searching
                    // `data.text` is the text that is displayed for the data object
                    if (data.text.indexOf(params.term) > -1) {
                        var modifiedData = $.extend({}, data, true);
                        // modifiedData.text += ' (matched)';

                        // You can return modified objects from here
                        // This includes matching the `children` how you want in nested data sets
                        return modifiedData;
                    }

                    // Return `null` if the term should not be displayed
                    return null;
                },
                minimumInputLength: 1,
                // templateResult: formatRepo,
                // templateSelection: formatRepoSelection
            }).change(function(e) {
                var thisId = $(this).attr('id'),
                    name = $('#select2-' + thisId + '-container').attr('title');
                $('#' + options.bankNameId).val(name);
                //值发生了变化
                if ($('#' + options.bankNameId).data('code') != $("#" + options.bankId).val()) {
                    cleanDataCode(options,'bank');
                }
                //初始化支行下拉
                initBranchBank(options);
            }).select2('val', $('#'+options.bankNameId).data('code'));

            $("#" + options.provinceId).select2({
                // width: "off",
                placeholder: "请输入选择省份",
                allowClear: true,
                data: objProvinceNam,
                // escapeMarkup: function(markup) {
                //     return markup;
                // }, // let our custom formatter work
                minimumInputLength: 1,
            }).change(function(event) {
                var thisId = $(this).attr('id'),
                    name = $('#select2-' + thisId + '-container').attr('title');
                $('#' + options.provinceNameId).val(name);
                //值发生了变化
                if ($('#' + options.provinceNameId).data('code') != $("#" + options.provinceId).val()) {
                    cleanDataCode(options,'province');
                }
                /* Act on the event */
                var provinceValue = $(this).val();
                if (provinceValue) {
                    $("#" + options.cityId).select2({
                        // width: "off",
                        placeholder: '请输入选择城市',
                        allowClear: true,
                        ajax: {
                            url: Inter.getApiUrl()['branchCity'],
                            dataType: 'json',
                            delay: 1000,
                            data: function(params) {
                                return {
                                    q: params.term, // search term
                                    upCodeId: $("#" + options.provinceId).val(),
                                    page: params.page
                                };
                            },
                            processResults: function(data, params) {
                                // parse the results into the format expected by Select2
                                // since we are using custom formatting functions we do not need to
                                // alter the remote JSON data, except to indicate that infinite
                                // scrolling can be used
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
                    }).change(function(event) {
                        var thisId = $(this).attr('id'),
                            name = $('#select2-' + thisId + '-container').attr('title');
                        $('#' + options.cityNameId).val(name);
                        //值发生了变化
                        if ($('#' + options.cityNameId).data('code') != $("#" + options.cityId).val()) {
                            cleanDataCode(options,'city');
                        }
                        /* Act on the event */
                        initBranchBank(options);
                    }).select2('val', $('#' + options.cityNameId).data('code'));
                } else {
                    if ($('#' + options.cityId).attr('aria-hidden')) {
                        $("#" + options.cityId).html('');
                    }
                    var $citySelect;
                    $citySelect = $("#" + options.cityId).select2({ placeholder: '请先选择省份' });
                    $citySelect.val(null).trigger('change');
                }
            }).select2('val', $('#' + options.provinceNameId).data('code'));
        }
    });
    var objBankName = [{ "id": "102100099996", "text": "中国工商银行" }, { "id": "103100000026", "text": "中国农业银行股份有限公司" }, { "id": "104100000004", "text": "中国银行总行" }, { "id": "105100000017", "text": "中国建设银行股份有限公司总行" }, { "id": "301290000007", "text": "交通银行" }, { "id": "302100011000", "text": "中信银行股份有限公司" }, { "id": "303100000006", "text": "中国光大银行" }, { "id": "304100040000", "text": "华夏银行" }, { "id": "305100000013", "text": "中国民生银行" }, { "id": "306581000003", "text": "广东发展银行股份有限公司运营作业部" }, { "id": "307584007998", "text": "平安银行（原深圳发展银行）" }, { "id": "308584000013", "text": "招商银行股份有限公司" }, { "id": "309391000011", "text": "兴业银行总行" }, { "id": "310290000013", "text": "上海浦东发展银行" }, { "id": "313100000013", "text": "北京银行" }, { "id": "313110000017", "text": "天津银行股份有限公司" }, { "id": "313121006888", "text": "河北银行股份有限公司" }, { "id": "313127000013", "text": "邯郸市商业银行股份有限公司" }, { "id": "313131000016", "text": "邢台银行股份有限公司" }, { "id": "313138000019", "text": "张家口市商业银行股份有限公司" }, { "id": "313141052422", "text": "承德银行股份有限公司" }, { "id": "313143005157", "text": "沧州银行" }, { "id": "313146000019", "text": "廊坊银行" }, { "id": "313148053964", "text": "衡水银行股份有限公司" }, { "id": "313161000017", "text": "晋商银行股份有限公司" }, { "id": "313168000003", "text": "晋城市商业银行" }, { "id": "313175000011", "text": "晋中银行" }, { "id": "313191000011", "text": "内蒙古银行" }, { "id": "313192000013", "text": "包商银行股份有限公司" }, { "id": "313193057846", "text": "乌海银行股份有限公司" }, { "id": "313205057830", "text": "鄂尔多斯银行股份有限公司" }, { "id": "313222080002", "text": "大连银行" }, { "id": "313223007007", "text": "鞍山市商业银行" }, { "id": "313227000012", "text": "锦州银行" }, { "id": "313227600018", "text": "葫芦岛银行股份有限公司" }, { "id": "313228000276", "text": "营口银行股份有限公司资金清算中心" }, { "id": "313229000008", "text": "阜新银行结算中心" }, { "id": "313241066661", "text": "吉林银行" }, { "id": "313261000018", "text": "哈尔滨银行结算中心" }, { "id": "313261099913", "text": "龙江银行股份有限公司" }, { "id": "313301008887", "text": "南京银行股份有限公司" }, { "id": "313301099999", "text": "江苏银行股份有限公司" }, { "id": "313305066661", "text": "苏州银行股份有限公司" }, { "id": "313312300018", "text": "江苏长江商业银行" }, { "id": "313331000014", "text": "杭州银行股份有限公司" }, { "id": "313332082914", "text": "宁波银行股份有限公司" }, { "id": "313332090019", "text": "宁波通商银行股份有限公司" }, { "id": "313333007331", "text": "温州银行股份有限公司" }, { "id": "313335081005", "text": "嘉兴银行股份有限公司清算中心(不对外办理业务）" }, { "id": "313336071575", "text": "湖州银行股份有限公司" }, { "id": "313337009004", "text": "绍兴银行股份有限公司营业部" }, { "id": "313338009688", "text": "金华银行股份有限公司" }, { "id": "313338707013", "text": "浙江稠州商业银行" }, { "id": "313345001665", "text": "台州银行股份有限公司" }, { "id": "313345010019", "text": "浙江泰隆商业银行" }, { "id": "313345400010", "text": "浙江民泰商业银行" }, { "id": "313391080007", "text": "福建海峡银行股份有限公司" }, { "id": "313393080005", "text": "厦门银行股份有限公司" }, { "id": "313397075189", "text": "泉州银行股份有限公司(不对外营业)" }, { "id": "313421087506", "text": "南昌银行" }, { "id": "313424076706", "text": "九江银行股份有限公司" }, { "id": "313428076517", "text": "赣州银行股份有限公司" }, { "id": "313433076801", "text": "上饶银行" }, { "id": "313451000019", "text": "齐鲁银行" }, { "id": "313452060150", "text": "青岛银行" }, { "id": "313453001017", "text": "齐商银行" }, { "id": "313454000016", "text": "枣庄银行股份有限公司" }, { "id": "313455000018", "text": "东营市商业银行" }, { "id": "313456000108", "text": "烟台银行股份有限公司" }, { "id": "313458000013", "text": "潍坊银行" }, { "id": "313461000012", "text": "济宁银行股份有限公司" }, { "id": "313463000993", "text": "泰安市商业银行" }, { "id": "313463400019", "text": "莱商银行" }, { "id": "313465000010", "text": "威海市商业银行" }, { "id": "313468000015", "text": "德州银行股份有限公司" }, { "id": "313473070018", "text": "临商银行股份有限公司" }, { "id": "313473200011", "text": "日照银行股份有限公司" }, { "id": "313491000232", "text": "郑州银行" }, { "id": "313491099996", "text": "中原银行股份有限公司" }, { "id": "313492070005", "text": "开封市商业银行" }, { "id": "313493080539", "text": "洛阳银行" }, { "id": "313495081900", "text": "平顶山银行股份有限公司" }, { "id": "313501080608", "text": "焦作市商业银行" }, { "id": "313504000010", "text": "漯河市商业银行" }, { "id": "313506082510", "text": "商丘市商业银行股份有限公司" }, { "id": "313513080408", "text": "南阳市商业银行" }, { "id": "313521000011", "text": "汉口银行资金清算中心" }, { "id": "313521006000", "text": "湖北银行股份有限公司" }, { "id": "313551070008", "text": "华融湘江银行股份有限公司" }, { "id": "313551088886", "text": "长沙银行股份有限公司" }, { "id": "313581003284", "text": "广州银行" }, { "id": "313585000990", "text": "珠海华润银行股份有限公司清算中心" }, { "id": "313586000006", "text": "广东华兴银行股份有限公司" }, { "id": "313591001001", "text": "广东南粤银行股份有限公司" }, { "id": "313602088017", "text": "东莞银行股份有限公司" }, { "id": "313611001018", "text": "广西北部湾银行" }, { "id": "313614000012", "text": "柳州银行股份有限公司清算中心" }, { "id": "313617000018", "text": "桂林银行股份有限公司" }, { "id": "313651099999", "text": "成都银行" }, { "id": "313653000013", "text": "重庆银行" }, { "id": "313655091983", "text": "自贡市商业银行清算中心" }, { "id": "313656000019", "text": "攀枝花市商业银行" }, { "id": "313658000014", "text": "德阳银行股份有限公司" }, { "id": "313659000016", "text": "绵阳市商业银行" }, { "id": "313673093259", "text": "南充市商业银行股份有限公司" }, { "id": "313701098010", "text": "贵阳市商业银行" }, { "id": "313731010015", "text": "富滇银行股份有限公司运营管理部" }, { "id": "313736000019", "text": "曲靖市商业银行" }, { "id": "313741095715", "text": "玉溪市商业银行" }, { "id": "313791000015", "text": "西安银行股份有限公司" }, { "id": "313791030003", "text": "长安银行股份有限公司" }, { "id": "313821001016", "text": "兰州银行股份有限公司" }, { "id": "313851000018", "text": "青海银行股份有限公司营业部" }, { "id": "313871000007", "text": "宁夏银行总行清算中心" }, { "id": "313881000002", "text": "乌鲁木齐市商业银行清算中心" }, { "id": "313882000012", "text": "昆仑银行股份有限公司" }, { "id": "314302066666", "text": "无锡农村商业银行股份有限公司" }, { "id": "314302200018", "text": "江苏江阴农村商业银行股份有限公司" }, { "id": "314305106644", "text": "太仓农村商业银行" }, { "id": "314305206650", "text": "昆山农村商业银行" }, { "id": "314305400015", "text": "吴江农村商业银行清算中心" }, { "id": "314305506621", "text": "江苏常熟农村商业银行股份有限公司清算中心" }, { "id": "314305670002", "text": "张家港农村商业银行" }, { "id": "314581000011", "text": "广州农村商业银行股份有限公司" }, { "id": "314588000016", "text": "佛山顺德农村商业银行股份有限公司" }, { "id": "314641000014", "text": "海口联合农村商业银行股份有限公司" }, { "id": "314651000000", "text": "成都农商银行" }, { "id": "314653000011", "text": "重庆农村商业银行股份有限公司" }, { "id": "315456000105", "text": "恒丰银行" }, { "id": "316331000018", "text": "浙商银行" }, { "id": "317110010019", "text": "天津农村合作银行" }, { "id": "318110000014", "text": "渤海银行股份有限公司" }, { "id": "319361000013", "text": "徽商银行股份有限公司" }, { "id": "320100010011", "text": "北京顺义银座村镇银行股份有限公司" }, { "id": "320343800019", "text": "浙江景宁银座村镇银行股份有限公司" }, { "id": "320345790018", "text": "浙江三门银座村镇银行股份有限公司" }, { "id": "320428090311", "text": "江西赣州银座村镇银行股份有限公司" }, { "id": "320455000019", "text": "东营莱商村镇银行股份有限公司" }, { "id": "320584002002", "text": "深圳福田银座村镇银行股份有限公司" }, { "id": "320653000104", "text": "重庆渝北银座村镇银行股份有限公司" }, { "id": "320687000016", "text": "重庆黔江银座村镇银行股份有限公司" }, { "id": "322290000011", "text": "上海农村商业银行" }, { "id": "323584000888", "text": "深圳前海微众银行股份有限公司" }, { "id": "325290000012", "text": "上海银行股份有限公司" }, { "id": "402100000018", "text": "北京农村商业银行股份有限公司" }, { "id": "402241000015", "text": "吉林省农村信用社联合社（不办理转汇业务）" }, { "id": "402301099998", "text": "江苏省农村信用社联合社信息结算中心" }, { "id": "402331000007", "text": "浙江省农村信用社联合社" }, { "id": "402332010004", "text": "宁波鄞州农村合作银行" }, { "id": "402361018886", "text": "安徽省农村信用联社资金清算中心" }, { "id": "402391000068", "text": "福建省农村信用社联合社" }, { "id": "402421099990", "text": "江西省农村信用社联合社" }, { "id": "402451000010", "text": "山东省农村信用社联合社(不对外办理业务)" }, { "id": "402521000032", "text": "湖北省农村信用社联合社结算中心" }, { "id": "402521090019", "text": "武汉农村商业银行股份有限公司" }, { "id": "402581090008", "text": "广东省农村信用社联合社" }, { "id": "402584009991", "text": "深圳农村商业银行" }, { "id": "402602000018", "text": "东莞农村商业银行股份有限公司" }, { "id": "402611099974", "text": "广西壮族自治区农村信用社联合社" }, { "id": "402641000014", "text": "海南省农村信用社联合社资金清算中心" }, { "id": "402651020006", "text": "四川省农村信用社联合社" }, { "id": "402701002999", "text": "贵州省农村信用社联合社" }, { "id": "402731057238", "text": "云南省农村信用社联合社" }, { "id": "402791000010", "text": "陕西省农村信用社联合社资金清算中心" }, { "id": "402871099996", "text": "宁夏黄河农村商业银行股份有限公司" }, { "id": "403100000004", "text": "中国邮政储蓄银行有限责任公司" }, { "id": "502290000006", "text": "东亚银行（中国）有限公司" }, { "id": "591110000016", "text": "外换银行（中国）有限公司" }, { "id": "593100000020", "text": "友利银行(中国)有限公司" }, { "id": "595100000007", "text": "新韩银行（中国）有限公司" }, { "id": "596110000013", "text": "企业银行（中国）有限公司" }, { "id": "597100000014", "text": "韩亚银行（中国）有限公司" }, { "id": "781393010011", "text": "厦门国际银行股份有限公司" }, { "id": "787290000019", "text": "富邦华一银行有限公司" }],
        objProvinceNam = [{ "id": "110", "text": "北京市" }, { "id": "120", "text": "天津市" }, { "id": "130", "text": "河北省" }, { "id": "140", "text": "山西省" }, { "id": "150", "text": "内蒙古自治区" }, { "id": "210", "text": "辽宁省" }, { "id": "220", "text": "吉林省" }, { "id": "230", "text": "黑龙江省" }, { "id": "310", "text": "上海市" }, { "id": "320", "text": "江苏省" }, { "id": "330", "text": "浙江省" }, { "id": "340", "text": "安徽省" }, { "id": "350", "text": "福建省" }, { "id": "360", "text": "江西省" }, { "id": "370", "text": "山东省" }, { "id": "410", "text": "河南省" }, { "id": "420", "text": "湖北省" }, { "id": "430", "text": "湖南省" }, { "id": "440", "text": "广东省" }, { "id": "450", "text": "广西壮族自治区" }, { "id": "460", "text": "海南省" }, { "id": "500", "text": "重庆市" }, { "id": "510", "text": "四川省" }, { "id": "520", "text": "贵州省" }, { "id": "530", "text": "云南省" }, { "id": "540", "text": "西藏自治区" }, { "id": "610", "text": "陕西省" }, { "id": "620", "text": "甘肃省" }, { "id": "630", "text": "青海省" }, { "id": "640", "text": "宁夏回族自治区" }, { "id": "650", "text": "新疆维吾尔自治区" }, { "id": "710", "text": "台湾省" }, { "id": "810", "text": "香港特别行政区" }, { "id": "820", "text": "澳门特别行政区" }, ];
})(jQuery);
