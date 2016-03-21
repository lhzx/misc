/**
 * 公司端配置文件
 * @type {Object}
 * 调用形式：com_Conf.getSalaryConf('salaryTemplateType')
 */
var com_Conf = function() {
    return {
        getSalaryConf: function(key) {
            var re;
            switch (key) {
                case 'salaryTemplateType':
                    //工资模板类型配置文件
                    re = { 1: '月工资模板', 2: '奖金模板', 3: '福利模板' };
                    break;
                case 'fixedItems':
                    //模板中的固定的数据
                    re = { basic: ['姓名', '证件编号', '税后工资'], salary: [], fund: [] };
                    break;
                case 'tempItems':
                    //默认模板
                    re = {
                        basic: ['姓名', '证件编号', '税后工资'],
                        salary: ['年度', '月度', '税后工资', '本月应发总额', '扣税基数', '工资个人所得税'],
                        fund: ['公积金基数', '社保基数', '公积金-个人','养老-个人','医疗-个人','失业-个人','社保及住房个人部分小记','公积金-公司','养老-公司','医疗-公司','失业-公司','工商-公司','生育-公司','社保及住房公司部分小记','备注']
                    };
                    break;
                    // case ''
            }
            return re;
        },
    }
}();
