require.config({
    baseUrl: ued_conf.amdPath,
    waitSeconds: 10,
    paths: {
        'jquery': 'core/jquery',
        'jquery.bootstrap': 'core/bootstrap',
        'jquery.dataTables': 'widget/datatables/dataTables',
    },
    shim: {
        'jquery.dataTables': {
            deps: ['jquery'],
            exports: 'DataTable'
        },
        'jquery.bootstrap': {
            deps: ['jquery']
        }
    }
});
