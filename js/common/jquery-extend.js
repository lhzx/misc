;(function($){
    $.fn.extend({
    	/*格式化form表单的参数，转换为JSON格式*/
        formatForm:function(){
	    	var formData = $(this).serializeArray(),postData={};
	    	for(var i = 0 ;i<formData.length;i++){
	    		if(formData[i].value==""){
	    			continue;
	    		}
	    		postData[formData[i].name] =formData[i].value;
	    	}
	    	return JSON.stringify(postData);
		},
		formatFormParam:function(param){
			if(typeof param !== 'object') {
				return false;
			} else {
				var formData = $(this).serializeArray();
				for(var i = 0 ;i<formData.length;i++){
		    		param[formData[i].name] =formData[i].value;
		    	}
		    	return param;
			}	    	
		}
    });
})(jQuery);
