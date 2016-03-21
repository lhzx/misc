var Login = function () {

	var handleLogin = function() {
		$('.login-form').validate({
	            errorElement: 'span', //default input error message container
	            errorClass: 'help-block', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            rules: {
	                username: {
	                    required: true
	                },
	                password: {
	                    required: true
	                },
	                remember: {
	                    required: false
	                }
	            },

	            messages: {
	                username: {
	                    required: "用户名为必填."
	                },
	                password: {
	                    required: "密码为必填"
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   
	                $('.alert-danger', $('.login-form')).show();
	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.form-group').addClass('has-error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.form-group').removeClass('has-error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                error.insertAfter(element.closest('.input-icon'));
	            },

	            submitHandler: function (form) {
	                form.submit();
	            }
	        });

	        $('.login-form input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('.login-form').validate().form()) {
	                    $('.login-form').submit();
	                }
	                return false;
	            }
	        });
	}

	var handleForgetPassword = function () {
		$('.forget-form').validate({
	            errorElement: 'span', //default input error message container
	            errorClass: 'help-block', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            ignore: "",
	            rules: {
	                email: {
	                    required: true,
	                    email: true
	                }
	            },

	            messages: {
	                email: {
	                    required: "邮箱为必填项"
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   

	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.form-group').addClass('has-error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.form-group').removeClass('has-error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                error.insertAfter(element.closest('.input-icon'));
	            },

	            submitHandler: function (form) {
	                form.submit();
	            }
	        });

	        $('.forget-form input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('.forget-form').validate().form()) {
	                    $('.forget-form').submit();
	                }
	                return false;
	            }
	        });

	        jQuery('#forget-password').click(function () {
	            jQuery('.login-form').hide();
	            jQuery('.forget-form').show();
	        });

	        jQuery('#back-btn').click(function () {
	            jQuery('.login-form').show();
	            jQuery('.forget-form').hide();
	        });

	}

	// var handleRegister = function () {
	// 		// 下拉框国旗logo
		


 //         $('.register-form').validate({
	//             errorElement: 'span', //default input error message container
	//             errorClass: 'help-block', // default input error message class
	//             focusInvalid: false, // do not focus the last invalid input
	//             ignore: "",
	//             rules: {
	                
	//                 fullname: {
	//                     required: true
	//                 },
	//                 email: {
	//                     required: true,
	//                     email: true
	//                 },
	//                 address: {
	//                     required: true
	//                 },
	//                 city: {
	//                     required: true
	//                 },
	//                 country: {
	//                     required: true
	//                 },

	//                 username: {
	//                     required: true
	//                 },
	//                 password: {
	//                     required: true
	//                 },
	//                 rpassword: {
	//                 	required: true,
	//                     equalTo: "#register_password"
	//                 },

	//                 tnc: {
	//                     required: true
	//                 }
	//             },

	//             messages: { // custom messages for radio buttons and checkboxes
	//             	fullname: {
	//                     required: "请输入全名称。"
	//                 },
	//                 email: {
	//                     required: "请输入邮箱。",
	//                     email: "请输入正确的邮箱地址"
	//                 },
	//                 address: {
	//                     required: "请输入地址。"
	//                 },
	//                 username: {
	//                     required: "请输入用户名。"
	//                 },
	//                 password: {
	//                     required: "请输入密码。"
	//                 },
	//                 rpassword: {
	//                 	required: "请输入确认密码。",
	//                     equalTo: "两次密码不一致，请重新输入。"
	//                 },
	//                 tnc: {
	//                     required: "请先阅读并同意用户协议和合同。"
	//                 }
	//             },

	//             invalidHandler: function (event, validator) { //display error alert on form submit   

	//             },

	//             highlight: function (element) { // hightlight error inputs
	//                 $(element)
	//                     .closest('.form-group').addClass('has-error'); // set error class to the control group
	//             },

	//             success: function (label) {
	//                 label.closest('.form-group').removeClass('has-error');
	//                 label.remove();
	//             },

	//             errorPlacement: function (error, element) {
	//                 if (element.attr("name") == "tnc") { // insert checkbox errors after the container                  
	//                     error.insertAfter($('#register_tnc_error'));
	//                 } else if (element.closest('.input-icon').size() === 1) {
	//                     error.insertAfter(element.closest('.input-icon'));
	//                 } else {
	//                 	error.insertAfter(element);
	//                 }
	//             },

	//             submitHandler: function (form) {
	//                 form.submit();
	//             }
	//         });

	// 		$('.register-form input').keypress(function (e) {
	//             if (e.which == 13) {
	//                 if ($('.register-form').validate().form()) {
	//                     $('.register-form').submit();
	//                 }
	//                 return false;
	//             }
	//         });

	//         jQuery('#register-btn').click(function () {
	//             jQuery('.login-form').hide();
	//             jQuery('.register-form').show();
	//         });

	//         jQuery('#register-back-btn').click(function () {
	//             jQuery('.login-form').show();
	//             jQuery('.register-form').hide();
	//         });
	// }
    
    return {
        //main function to initiate the module
        init: function () {
        	
            handleLogin();
            handleForgetPassword();

            // init background slide images
		    $.backstretch([
		        "../images/login/1.jpg",
		        "../images/login/2.jpg",
		        "../images/login/3.jpg",
		        "../images/login/4.jpg"
		        ], {
		          fade: 1000,
		          duration: 8000
		    	}
        	);
        }
    };

}();

jQuery(document).ready(function() {
    Login.init();
});