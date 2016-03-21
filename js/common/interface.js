'use strict';
/*global jQuery, $*/
/**
 * @description: 接口
 * @author: fangyuan(43726695@qq.com)
 * @update:
 */
var Inter = function () {
    return {
        getApiUrl: function () {
            return {
                /*用户中心*/
                activeUser: '/backStage/userManager/activate', //登录
                indUserShow: '/backStage/userManager/individualUser',//个人用户显示页
                indiUserList: '/backStage/userManager/page', //个人用户列表
                indActUser: '/backStage/userManager/activate',//个人用户激活用户
                indUpUser: '/backStage/userManager/enable',//个人用户启用用户
                indStopUser: '/backStage/userManager/disable',//个人用户停用用户
                indEditUser: '/backStage/userManager/toEdit',//个人用户修改用户
                indViewUser: '/backStage/userManager/toView',//个人用户明细查看
                indAddUser: '/backStage/userManager/toAdd',//个人用户添加用户
                indSaveUser: '/backStage/userManager/save',//个人用户保存用户
                fourElement: 'backStage/userManager/fourElement', //四要素验证
                indFundActive: '/backStage/userManager/fundStatus/1', //个人用户启用基金
                indFundDisable: '/backStage/userManager/fundStatus/2', //个人用户停用基金
                ///信息审核
                inforLook:'/backStage/userManager/inforLook',///用户修改信息审核 列表界面
                infordetail:'/backStage/userManager/infordetail',///修改核明细界面
                auditingDetail:'/backStage/userManager/auditingDetail',///修改核明细界面
                auditingPage:'/backStage/userManager/auditingPage',///审核列表
                auditingEditStatus:'/backStage/userManager/auditingEditStatus',/// 审核状态修改，通过：2，不通过：1，银行修改：3
                
                //用户中心，公司用户
                comUserList: '/backStage/companyUser/query', //公司用户列表
                comUpUser: '/backStage/companyUser/startAndBlock',//公司用户启用用户(单个)
                //comStopUser: '/backStage/companyUser/',//公司用户停用用户(单个)
                comAddUser: '/backStage/companyUser/toadd',//公司用户添加用户
                comSaveUser: '/backStage/companyUser/add',//公司用户添加用户
                comEditUser: '/backStage/companyUser/update',//公司用户编辑用户
                comManger: '/backStage/company/getList',//公司用户加载全部机构
                comResetPw: '/backStage/company/resetPassWord', //公司用户重置密码
                comRoleSave: '/backStage/company/roleSave', //公司用户保存权限
                comSearch: '/backStage/company/serch', //公司下拉列表选择
                
                //系统用户
                sysUserList: '/backStage/systemUser/page', //系统用户列表
                systemUser: '/backStage/systemUser/systemUser', //系统用户列表
                sysDelUser: '/backStage/systemUser/delete',//系统用户删除用户
                sysUpUser: '/backStage/systemUser/enable',//系统用户启用用户
                sysStopUser: '/backStage/systemUser/disable',//系统用户停用用户
                //sysEditUser: '/backStage/systemUser/',//系统用户修改用户
                toEditUser: '/backStage/systemUser/byId',//系统用户修改用户
                sysAddUser: '/backStage/systemUser/save',//系统用户添加用户
                ///sysSaveUser: '/backStage/systemUser/update',//系统用户保存用户
                sysRoleManger: '/backStage/userRelation/listForConfig',//系统用户分配角色
                ///sysRoleSave: '/backStage/roleRelation/addUserRelation',//系统用户保存分配角色
                sysRoleSave: '/backStage/userRelation/addRelation',//系统用户保存分配角色
                
                roleModuleList: '/backStage/roleRelation/listForConfig',//角色分配模块列表展示
                roleModuleAdd: '/backStage/roleRelation/addModuleRelation',//角色分配模块关系保存
                //公司管理
                comManAdd:'/backStage/company/add', //公司管理-添加公司
                comEdit:'/backStage/company/update', //公司管理-添加公司
                enableCom:'/backStage/company/startAndBlock', //公司管理--启用停用公司

                //联动选择银行下拉
                branchBank:'/backStage/bankInfo/serch', //开户行分行
                branchCity: '/backStage/cityInfo/city',//开户行支行所在城市

                /*角色管理*/
                roleManagerList: '/backStage/role/page', //角色管理列表
                addRole: '/backStage/role/add', //添加新角色
                comList: '/backStage/company/getList', //查询所属公司列表
                deleteRole: '/backStage/role/deleteById', //删除指定角色
                roleEdit: '/backStage/role/toEdit/{0}', //编辑指定角色
                /**
                 * 公司端接口 Start
                 */
                /*工资管理*/
                uploadSalary:'/company-application/uploadFile',
                getSalaryTemp:'/company-application/querySalaryModel',
                // saveSalaryTemp:'http://172.19.6.230:8060/company-application/saveSalaryModel',
                saveSalaryTemp:'/company-application/saveSalaryModel',


                                

            };
        }
    };

}();
// jQuery(document).ready(function () {
//     Inter.getApiUrl(); // init metronic core componets
// });