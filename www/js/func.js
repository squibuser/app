 $(function(){
			    function onDeviceReady() {
				    if (parseFloat(window.device.version) >= 7.0) {
				          document.body.style.marginTop = "20px";
				          // OR do whatever layout you need here, to expand a navigation bar etc
				      }
				         navigator.splashscreen.hide();
				         
						document.ontouchmove = function(e) {e.preventDefault()};
						
						
			    }
	            document.addEventListener('deviceready', onDeviceReady, false);
	 			//loginWindow
	            window.addEventListener('push', removeModal);	        
	            function removeModal(){
	              $('#loginWindow').removeClass('active'); 
	              reg_error_check();
	            }
	           

				var scrolling = false;
				var endScrolling;

				$('.content').on("scroll", function() {
				    scrolling = true;
				    $('.loader').hide();

				});	        
	            $('body').on('touchend', '.profile-content .icon', function(event){
	            	var id = $(this).attr('id');
	            	$('.modal#' + id).addClass('active');
	            	
	            });	            
	            $('body').on('touchstart', '.small span', function(){
	                 $(this).toggleClass('active');
	                 var id = $(this).attr('id');
	                 $('body').toggleClass(id);

	            });
	            $('body').on('touchend', '.table-view-cell a', function(event){
	            	      event.preventDefault();
	            	      var id= $(this).attr('id');
	            	       if(!scrolling) {
	            	         	 $('#'+ id +'.modal').addClass('active');
	            	         	// $('.loader').fadeIn();
	            	       }
	            	    endScrolling = window.setTimeout(function() {
				        scrolling = false;
				        window.clearTimeout(endScrolling);
				    }, 1000);

	            			
	            });
				$('body').on('touchstart', '.icon-search', function(){
				            $(this).addClass('active');
				            $('input.search').addClass('active');
				            $('input.search').focusout();
				            $('.area-user').addClass('hide');
				            $('.page').hide();
				            $('.page.search').show();		
				});        
	            $('body').on('touchstart', '.icon-close', function(){
	                $(this).parent().parent().removeClass('active');
	            });
				
				init();
				
				function init(){
				    openFB.api({
						path: '/me',
						success: function(data) {
							console.log(data);
							var type = 'validate'; 
							var postData = {type:type};
							callJson(postData);
						},
						error: errorHandler					
					});
			    }
			        
				$('body').on('click', '.facebook_login', function(e){
		           e.preventDefault();
					openFB.login(
					function(response) {
					    if(response.status === 'connected') {
					       console.log(response);
					       
					    }
					}, {scope: 'email,read_stream,publish_stream'});
		        });



		        $('#back').click(function(){
					$('.error').fadeOut();
					$('.input-group').delay(500).fadeIn();

		        });
		        $('body').on('touchstart', '.icon-more', function(){
			        $(this).toggleClass('open');
			        $('#replyWindow .reply-wrap').toggleClass('open');
		        }); 	        
		        
		        function back(){
			          $('.error').fadeOut();
		        }	        
	            function reg_error_check(){
	               $('body').on('click', 'form#newUser textarea#occ' , function(){
	                     
	                   $('form#newUser input').each(function(){
		                   var thisVal = $(this).val();
		                   if(thisVal.length == 0){
			                  return false
		                   }else{
			                   $('#register-submit').fadeIn();
		                   }
		                    
	                   });
	               
	            
	               
	               });
	            
	            
	            } 
	            
	            
				

  			    function mail(kind){
  			    	  var yourKey = $('html').attr('data-user');
					  var type = 'mail_request';
					  var request = kind;
					  var postData = {yourKey:yourKey, type:type, request:request};
					  callJson(postData);
  			    }



                $('body').on('touchstart', '.profile-wrap a, .contact-wrap a', function(){
				      $('#profileWindow .content-padded').html('');
				      var dataUser = $(this).attr('data-attr');
				      var type = 'profile';
				      var postData = {dataUser:dataUser, type:type};
				      callJson(postData);
				});
				$('body').on('touchstart', '#panelMenu', function(){      
					  $('.shadow').fadeIn();
					  $('.panel').addClass('active');
				});
				$('body').on('touchstart', '.shadow', function(){      
					  $('.shadow').fadeOut();
					  $('.panel').removeClass('active');
				});
				$('body').on('touchstart', '.squib-wrap a', function(){
					 $(this).find('.badge').removeClass('badge-positive');
					 $('#replyWindow .content-padded').html('');
					 var dataUser = $(this).attr('data-attr');
					 var squib_id =  $(this).attr('data-squib');
					 var type = 'squib';
					 var postData = {dataUser:dataUser, squib_id:squib_id, type:type};
					 callJson(postData);

				});
				$('body').on('touchstart', '.opt', function (){
					var page = $(this).attr('id');
					$('.opt').removeClass('active');
					$(this).addClass('active');													
					$('.page').hide();
					$('.page.' + page).show();
					
					
					
					
		            $('input.search').removeClass('active');
		            $('.icon-search').removeClass('active');
		            $('input.search').focusout();
		            $('.area-user').removeClass('hide');
				});
                $('body').on('touchstart', '#contact-info', function(){
	                 $('.activity').toggleClass('show');  
                });
				$('body').on('touchstart', '.send-mail', function(){
					var repecipient = profile_obj.userKey;
					var sender = user_obj.userKey;
					var subject = $('input#subject').val();
                    var body = $('#msg-body').val();
                    var type = 'send_mail';
                    var now = new Date();
					var date = now.getFullYear()+ '-' +(now.getMonth() + 1) + '-' + now.getDate();
                    data = {repecipient:repecipient, sender:sender, subject:subject, body:body, date:date, type:type};
                   // console.log(data);
                    if(body.length != 0){
                    	callJson(data);
                    }
				});
				$('body').on('touchstart', 'button.accept', function(){
				    var dataUser = $(this).attr('data-attr');
				    var userKey = $('html').attr('data-user');
				    var type = 'accept_contact';
				    var data = {type:type, dataUser:dataUser, userKey:userKey};
				    callJson(data);	
				});
				$('body').on('touchstart', 'button.reject', function(){
				    var dataUser = $(this).attr('data-attr');
				    var type = 'reject_contact';
				    var userKey = $('html').attr('data-user');
				    var data = {type:type, dataUser:dataUser, userKey:userKey};
				    callJson(data);	
				});
				$('body').on('touchstart','#connect', function (){ 					
					var name = $('#profileWindow .content-name p').text();
					$('.contact-rqst-alrt span.user').html(name);
					$('.shadow').fadeIn(function(){
					     $('.contact-rqst-alrt').fadeIn();
					});
				});
				$('body').on('touchstart','#cancel', function (){ 					
				 $('.contact-rqst-alrt').fadeOut(function(){  $('.shadow').fadeOut(); });
				});
				$('body').on('touchstart', '#confirm', function (){
					 var yourKey = $('html').attr('data-user');
					 var userKey = $('#profileWindow').attr('data-attr'); 
					 var now = new Date();
					 var date = now.getFullYear()+ '-' +(now.getMonth() + 1) + '-' + now.getDate();
					 var type = "contact";
					 var postData = {yourKey: yourKey, userKey:userKey, date:date, type:type};
					 callJson(postData);
				});
				$('body').on('touchstart', '#contacts', function (){
					  var yourKey = $('html').attr('data-user');
					  type = 'get_contacts';
					  var postData = {yourKey:yourKey, type:type}
					  callJson(postData); 
				});
				$('body').on('touchstart', '#squibs', function(){
					  var yourKey = $('html').attr('data-user');
					  var type = 'get_squibs';
					  var avatar = user_obj.avatar;
					  var postData = {yourKey:yourKey, avatar:avatar, type:type}
					  callJson(postData);
				});
				$('body').on('touchstart', '#mail', function(){
				      var kind = 'inBox';
					   mail(kind);

				});
  				$('body').on('touchstart', '.control-item', function(){
  				    var kind = $(this).attr('data-attr');		
  				     mail(kind);
  			    });
				$('body').on('touchstart', '#history', function(){
					   var type="history";
					   var yourKey = $('html').attr('data-user');
					   var postData = {type:type, yourKey:yourKey};
					   callJson(postData);
				}); 
                $('body').on('touchend', '.icon-edit', function(){
                      var squib_text = $(this).prev().text();
                      var squib_item = squib_text.replace(/\"/g, "");
 					  
 					  $(this).prev().html('<input type="text" placeholder="Enter New Data" value="'+ squib_item +'" />'); 



                });
                $('body').on('focusout', '#replyWindow input', function(){
                      
                      var new_squib = $(this).val();
                      $('#replyWindow .content-info p').html(new_squib);
                      var dataSquib = $('#replyWindow .profile-content').attr('data-squib');
					  var dataUser = $('#replyWindow .profile-content').attr('data-user');
					  var type = 'update_squib';
					  var postData = {new_squib:new_squib, dataSquib:dataSquib, dataUser:dataUser, type:type};
					  callJson(postData);

                });  
                $('body').on('focusout', '#setting input', function(){
                /*

                		    $('.icon-search').removeClass('active');
				            $('input.search').removeClass('active');
				            $('.area-user').removeClass('hide');
*/
                
                      
       //                var new_squib = $(this).val();
       //                $('#replyWindow .content-info p').html(new_squib);
       //                var dataSquib = $('#replyWindow .profile-content').attr('data-squib');
					  // var dataUser = $('#replyWindow .profile-content').attr('data-user');
					  // var type = 'update_squib';
					  // var postData = {new_squib:new_squib, dataSquib:dataSquib, dataUser:dataUser, type:type};
					  callJson(postData);

                });  
				$('body').on('touchstart', '#exit', function(){
					var type="sign_out";
					var postData = {type:type};
					callJson(postData);
					 openFB.logout(
		                function() { }, errorHandler);

				});
				$('body').on('touchstart', '.mail-wrap a', function(){
					 var userKey = $('html').attr('data-user');
					 $(this).parent().removeClass('unread');
				     $(this).find('.badge').removeClass('badge-positive');
					 $('#mailWindow .content-padded').html('');
					 var mail_id = $(this).attr('data-mail');
					 var type = 'get_mail';
					 var postData = {userKey:userKey, mail_id:mail_id, type:type};
					 callJson(postData);
				});
				$('body').on('touchstart', '.reply-btn', function(){
					var dataToUser = $(this).attr('data-to-user');
					var dataFromUser = $(this).attr('data-from-user');
					var chainId = $(this).attr('data-mail');
					var body = $('textarea#reply-body').val();
					var subject = $('.subject-chat').last().text();
					var type = 'reply_email';
					var now = new Date();
					var date = now.getFullYear()+ '-' +(now.getMonth() + 1) + '-' + now.getDate();
					var postData = {dataToUser: dataToUser, dataFromUser:dataFromUser, chainId:chainId, date:date, body:body, subject:subject, type:type};
					callJson(postData);
				});
				$('body').on('touchend', '#mailWindow .profile-content', function(){
				      $('#mailWindow .profile-content').addClass('collapse');
				      $(this).toggleClass('collapse');
				});				
				$('body').on('touchend', '.settings', function(){
					var type = 'settings';
					var dataUser = $('html').attr('data-user');
					var postData = {type:type, dataUser:dataUser}
					callJson(postData); 
				});
				$('body').on('touchstart', '#delete-squibs', function(){
				    $('.squibs .squib-wrap .squib').toggleClass('delete-active');				
				});
				$('body').on('touchstart', '#register-submit', function(e){
					e.preventDefault();
					var first_name = $('#newUser input#first').val();
					var last_name = $('#newUser input#last').val();
					var email = $('#newUser input#reg-email').val();
					var password = $('#newUser input#reg-pass').val();
					var occ = $('#newUser textarea#occ').val();
					type = 'register';
					var postData = {first_name:first_name, last_name:last_name, email:email, password:password, occ:occ, type:type};
					callJson(postData);

				});
				$('body').on('touchstart', '.area-user', function(){
						$(this).toggleClass('active');
						$('.area-prox-tray').toggleClass('expand');

				});
                $('body').on('touchstart', '.delete-squib', function(data){
                		var dataSquib = $(this).prev().attr('data-squib');
                		var type = 'delete_squib';
                		var postData = {dataSquib: dataSquib, type:type};
                		callJson(postData);
                });
                $('body').on('keyup', 'input.search', function(){
                    var value  = $(this).val();
                    var type = 'search'; 
                    var length = value.length;
                    var postData = {value:value, type:type};
                    if(length <= 1 || value ==''){
	                   $('.search .news-feed ul').empty();
                    }else{
	                 
                    callJson(postData);
	                  
                    }
               });
				
				
				
				function callJson(postData){
			
				   $.ajax({
					url:  "http://squibturf.com/server/server.php", 
					data: postData, 
					type: 'POST',
					dataType: 'json',
					beforeSend: function(){
						$('.loader').fadeIn();
					},
					
					success: function(data){
//console.log(data);
						eval(data.function)(data);
					    $('.loader').fadeOut();

					}      
				});
				}











   		function delete_complete(data){

   			 var squib_id = data.squib_id;
   			 $('.squibs .table-view li.squib-wrap.squib-' + squib_id).addClass('deleted');
   			 setTimeout(function(){
   			 	 $('.squibs .table-view li.squib-wrap.squib-' + squib_id).hide();
   			 }, 500);
   		}
        function load_mail(data){
        
        	var wrap = data.request;
        	$('.control-content#' + wrap +' ul').html(data.mail);
    

        }
     	function load(data){
     		console.log(data);
     		$('.modal').removeClass('active');
     		$('html').attr('data-user', data.userKey);
     		user_obj = data;
	        socket(data);	
     	} 
     	function mail_sent(data){
		    //console.log(data);
   			$('.modal').removeClass('active');
     	    $('.opt#mail').trigger('touchstart');
			$('.segmented-control a').removeClass('active');
     	    $('.segmented-control a:eq(1)').addClass('active');
     	    $('.control-content').removeClass('active');     	    
     	    $('.control-content:eq(1)').addClass('active');
     	    var kind ='sent';
  			mail(kind);
     	}
        function load_settings(data){
          $('#settings .content').html(data.dom);
        }
     	function email(data){
     		//console.log(data);
     		var body = data.mail;
     		$('#mailWindow .content-padded').html(body);
     	}
        function not_set(data){
        console.log(data);
            $('.facebook_login').fadeIn();
        }    	
        function incorrect(data){
           alert('Your username/password is incorrect!');
            $('.login-form').fadeIn();
        }
        function not_found(data){

               alert('User not found. Please register or try again. ');
                $('.login-form').fadeIn();
        }
        function empty(data){
				alert('Please enter a username and password to proceed. ');
				 $('.login-form').fadeIn();
        }
        function restart_app(data){
        	window.location.reload(true);
        }
        function get_profile(data){
           //  console.log(data);
        	 profile_obj = data;
        	 var connect_string;
        	 if(data.connect_status == 'pending' || data.connect_status == 'connected'){
        	 	connect_string = "";
        	 }else{
        	 	connect_string = "<span class='icon icon-person' id='connect'></span>";
        	 }
        	 var result = "<div class='profile-content'>" +
				 			  "<span class='icon icon-mail' id='mail-user' href='#mail-user'></span>" +
				 			      connect_string + 
	                              "<div class='content-avatar'  style='background:url("+ data.avatar +") center no-repeat; background-size:auto 100px;'></div>"+
	                              "<div class='content-name'><p>"+ data.name +"</p></div>"+
	                              "<div class='content-info'><p>"+ data.occ +"</p></div>"+
							   "</div>";
			 $('#profileWindow .content-padded').html(result);
			 $('.data-user-mail').html(profile_obj.name);
        }
        function get_squib(data){
                
        	    var userKey = $('html').attr('data-user');
        		var editable;
        		if( userKey == data.userKey){
 						editable = "<span class='icon icon-edit'></span>";
        		}else{
        				editable = "";
        		}
        		squib_obj = {dataUser: data.userKey, squib_id: data.squib_id};
        		//console.log(data);
        		if(data.squib_img == null){ data.squib_img = '';}
	        	var result = "<div class='profile-content' data-squib='"+ data.squib_id +"' data-user='"+ data.userKey +"'>" +
		                          "<div class='content-avatar' style='background:url("+ data.avatar +") center no-repeat; background-size:auto 100px;'></div>"+
		                          "<div class='content-info'><div class='squib_img'>" + data.squib_img + "</div><p class='squib-text'>"+data.msg +"</p> " + editable + "</div>"+ 
							   "</div>"+
							   "<div class='replies'><span class='icon icon-more'></span>"+
							        "<span class='replies-count'>"+ data.squib_count +" comments</span>"+
							        "<div class='reply-wrap' ><ul class='table-view'></ul></div>"+
							    "</div>";
			   $('#replyWindow .content-padded').html(result);
				if(data.squibs != null){
					$.each(data.squibs, function(index, data){
					    $('.reply-wrap ul.table-view').append('<li class="table-view-cell"><a class="profile show reply" data-attr="'+ data[6] +'"><div class="avatar-wrap" style="background:url('+  data[9] +') center no-repeat; background-size:auto 40px; width:40px; height:40px;"></div> <div class="comment"><h5>'+ data[3] +'</h5> <span> '+ data[1] +'</div></a></li>');  
					});
			}
        }
        function history(data){
        	var dom = data.dom;  
        	$('.history .table-view').html(dom);
        }	
		function contacts(data){
		  //  console.log(data);
        	var activity = data.activity;  
        	var contacts = data.contacts
        	$('.contacts .activity .table-view').html(activity);
        	$('.contacts .contact-info .table-view').html(contacts);

        }	
        function squibs(data){
        	var dom = data.squibs;  
        	$('.squibs .table-view').html(dom);
        }	
        function connect_complete(data){
         //  console.log(data);
           dataUser = data.dataUser;
           userKey = data.userKey;
           $('.contact-info li.user-'+ userKey).fadeOut();
           
           $('.contact-info li.user-'+ dataUser).fadeOut();
           $('#contacts').trigger('touchstart');
           
	      //  $('.connect-info ')
        }
        function update_complete(data){
        	//console.log(data);
        	var data_squib = data.squibId;
            var userKey = data.userKey;
            var newSquib = data.new_squib;     
           	$('li.squib-wrap a.squib').each(function(){
 				var thisUser = $(this).attr('data-attr');
 				var thisSquib = $(this).attr('data-squib');
                  if((thisUser == userKey) && (thisSquib == data_squib)){
 						$(this).find('.msg').text(newSquib);
                  }
        	});
        }
        function reg_complete(data){
        	//console.log(data);
        	var email = data.email;
	        var password = data.password;
            var type = 'login'; 
            var postData = {email:email, password:password, type:type};
            callJson(postData);

        }
        function results(data){
        
            $('.search .news-feed ul').html(data.dom);
        }
         function errorHandler(error) {
        console.log(error.message);
        $('.facebook_login').fadeIn();
    }


    });
 
          

