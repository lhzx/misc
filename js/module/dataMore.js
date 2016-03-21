/**
 * @description: 数据列表
 * @author: TinTao(284071917@qq.com)
 * @update:
 */
define('module/dataMore', [
    'common/interface',
    'common/util',
    'common/errCode'
], function(inter, util, errCode){
    var ajaxApi = null,
        hasMore = false;
    return {
        /**
         * 发送
         */
        init: function(options){
            var defaults = {
                target: null,
                moreTarget: null,
                loadTarget: null,
                failedTarget: null,
                loadingCls: 'loading',
                loadingText: '数据加载中...',
                loadingTpl: '<tr><td colspan="6" class="#{loadingCls}">#{loadingText}</td></tr>',
                failedCls: 'failed',
                failedText: '数据加载失败',
                failedTpl: '<tr><td colspan="6" class="#{failedCls}">#{failedText}</td></tr>',
                noDataCls: 'noData',
                noDataText: '没有符合条件的记录',
                noDataTpl: '<tr><td colspan="6" class="#{noDataCls}"><div>#{noDataText}</div></td></tr>',
                moreCls: 'btn-default btn-gray btn-mid',
                moreText: '加载更多',
                moreTpl: '<div class="record-page-warp p10"><a href="javascript:" class="#{moreCls}">#{moreText}</a></div>',
                noMoreDataCls: 'noMoreData',
                noMoreDataText: '没有更多记录了',
                noMoreDataTpl: '<tr><td colspan="6" class="#{noMoreDataCls}">#{noMoreDataText}</td></tr>',
                itemTpl: [
                    '<tr>',
                        '<td>#{time}</td>',
                        '<td>#{content}</td>',
                        '<td class="money">#{amount}</td>',
                        '<td>#{status}</td>',
                        '<td>',
                            '<a href="/account/record/#{tradeNo}" target="_blank">详情</a>',
                        '</td>',
                    '</tr>'
                ].join(''),
                ajaxApi: null,
                getDataCallback: null,
                finishedCallback: null,
                hasPagination: false, //标识是否已经初始化分页控件
                page: 0, //当前页码
                pageSize: 10, //分页大小
                param: {},
                listName: 'list',
                ajaxType: 'POST',
                url: '' //ajax请求地址
            };
            this.opts = $.extend(defaults, {}, options);
            this.renderList();
            this.hasData = false;
            hasMore = false;
        },
        /**
         * 获取数据
         */
        getData: function (call){
            var self = this;

            if(self.opts.moreTarget && self.opts.moreTarget.length){
                self.opts.moreTarget.remove();
                self.opts.moreTarget = null;
            }
            if(self.opts.failedTarget && self.opts.failedTarget.length){
                self.opts.failedTarget.remove();
                self.opts.failedTarget = null;
            }
            if(!self.opts.loadTarget || !self.opts.loadTarget.length){
                self.opts.loadTarget = $(util.template(self.opts.loadingTpl, {
                    loadingCls: self.opts.loadingCls,
                    loadingText: self.opts.loadingText
                }));
                self.opts.target.append(self.opts.loadTarget);
            }
            self.opts.param.currentPage = self.opts.page + 1;
            self.opts.param.pageSize = self.opts.pageSize;
            ajaxApi && ajaxApi.abort();
            ajaxApi = util.setAjax(self.opts.url, self.opts.param, function(json){
                if(!json.success && json.errorCode){
                    self.loadFailed(errCode.get(json.errorCode));
                }else{
                    if(self.opts.getDataCallback){
                        json.data = self.opts.getDataCallback(json);
                    }
                    call && call(json);
                }
                ajaxApi = null;
            }, function(){
                self.loadFailed(self.opts.failedText);
                ajaxApi = null;
            }, self.opts.ajaxType);
        },
        /**
         * 渲染列表
         */
        renderList: function(){
            var self = this,
                listArr = [];

            self.getData(function(data){
                data.list = data[self.opts.listName];
                if(data.list && data.list.length){
                    $.each(data.list, function(i, n){
                        listArr.push(util.template(self.opts.itemTpl, n));
                    });
                }else if(!data.total && !hasMore){
                    listArr.push(util.template(self.opts.noDataTpl, {
                        noDataCls: self.opts.noDataCls,
                        noDataText: self.opts.noDataText
                    }));
                }
                if(self.opts.loadTarget && self.opts.loadTarget.length){
                    self.opts.loadTarget.remove();
                    self.opts.loadTarget = null;
                }
                self.opts.target.append(listArr.join(''));
                if(data.list.length >= self.opts.pageSize) {
                    self.loadMore();
                    self.hasData = true;
                }
                if(!data.list.length && self.hasData){
                    self.hasData = false;
                    self.showNoMore();
                }
                self.opts.finishedCallback && self.opts.finishedCallback(self.opts.target);
            })
        },
        /**
         * 加载数据失败
         */
        loadFailed: function (errMsg){
            var self = this,
                failedPanel = $(util.template(self.opts.failedTpl, {
                    failedCls: self.opts.failedCls,
                    failedText: errMsg + '，<a id="listReload" href="javascript:">点击重新加载</a>'
                }));
            self.opts.loadTarget.remove();
            if(!self.opts.failedTarget || !self.opts.failedTarget.length) {
                self.opts.failedTarget = failedPanel;
                self.opts.target.append(self.opts.failedTarget);
                $('#listReload').on('click', function (e) {
                    e.preventDefault();
                    self.renderList();
                });
            }
        },
        /**
         * 加载更多数据
         */
        loadMore: function(){
            var self = this,
                morePanel = $(util.template(self.opts.moreTpl, {
                    moreCls: self.opts.moreCls,
                    moreText: self.opts.moreText
                }));
            if(!self.opts.moreTarget || !self.opts.moreTarget.length) {
                self.opts.moreTarget = morePanel;
                self.opts.target.after(self.opts.moreTarget);
                morePanel.find('a').on('click', function (e) {
                    e.preventDefault();
                    self.opts.page = self.opts.page + 1;
                    self.renderList();
                    hasMore = true;
                });
            }
        },
        /**
         * 没有更多数据
         */
        showNoMore: function(){
            var self = this,
                panel = $(util.template(self.opts.noMoreDataTpl, {
                    noMoreDataCls: self.opts.noMoreDataCls,
                    noMoreDataText: self.opts.noMoreDataText
                }));

            self.opts.target.append(panel);
        }
    }
});