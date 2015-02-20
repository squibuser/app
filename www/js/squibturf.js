var squibturf = {
                			
  /*
     ajaxCall: function(postData){
        if(postData.type != 'pinned_squibs'){
            $('.spinner-cont').stop().fadeIn();
        }
		$.ajax({
			url:  "http://squibturf.com/server/server.php", 
			data: postData, 
			type: 'POST',
			dataType: 'json',
			cache: false,
			async:true,
			success: function(data){
	            eval(data.function)(data);			
		    },
			error: function (request, status, error) {
		        ////console.log(request.responseText);
		    }      
		}).done(function(data){
		    if(data.function !="squibturf.loadPinnedSquibs"){
	            //console.log(data);
	            $('.spin-msg').html('Done...');
	            $('.spinner-cont').stop().delay(1000).fadeOut();
	         }
		});
		
		
    },
    
*/
    
    //Call ajax here
    socketCall: function(postData){
        //console.log(postData);
        socket.emit('socketCall', postData); 
        		
    },
    
    
    
    
    
    
    
    getUserKey: function(){
		var userKey;
		var isPhonegap = function() {
		return (typeof(cordova) !== 'undefined' || typeof(phonegap) !== 'undefined');
		}
		
		if (isPhonegap()) {
		   userKey =  window.localStorage.getItem("data-user");
		} else {
		   userKey = $.cookie('data-user');
		}
		
	    return userKey;
    },
    
    
    
    
    
    
    
    //Click Events	
	bindEvents: function(){
		
		console.log('bind events');
		var pageHeight = $(window).height() - 110;
		$('.page').css('height',  pageHeight +'px');
	          
	    var scrolling = false;
		var endScrolling;
	    $('body').on('touchmove', function(e){scrolling = true;});
      
		//all focus out events
		$('body').on('focusout', 'input, textarea', function(event){
		     var $element  = $(this);
		     var $function =  $element.attr('data-function');
             if($function != undefined){  		     
             var function_call = "squibturf." + $function;
		     		eval(function_call)($element);
		     }
		
  		
		});
	   
	   	//all keyup events
	    $('body').on('keyup', 'input.search', function(event){
             var $element  = $(this);
             $('.spin-msg').html("Searching for users...");		            
             var function_call = "squibturf." + $element.attr('data-function');
		     if(function_call != undefined){
		        eval(function_call)($element);
		     }
             
	    });
	    
	    //all touchend event
		$('body').on('touchend', 'a, span, div, button', function(event){ 	
           var $element  = $(this);
           var $FUNCTION = $element.attr('data-function');
           var $MESSAGE = $element.attr('data-message');
           if(!scrolling){
               //check if data-function is set;
	           if($FUNCTION != undefined){
		            //check if data-message is set
		           if($MESSAGE != undefined){ $('.spin-msg').html($MESSAGE); }		            
	               var $function = $FUNCTION.split(",");           
		           //for each function in DOM element data-function
		           $.each($function, function(i,v){
			            var function_call = "squibturf." + v;
				        eval(function_call)($element);
		           });	             
	           }
	           
           }
		   endScrolling = window.setTimeout(function() {
			  scrolling = false;
		      window.clearTimeout(endScrolling);
		   }, 10);

		  

		});	 
	    
	    //scrolling on squibs page
		$(".page.squibs").scroll(function () {
	       
                if (isScrollBottom()) {
                    //scroll is at the bottom
                    //do something...
                    var squib_count =  $('.squibs a.squib').length;
					var yourKey =  squibturf.getUserKey();
					var type = 'get_squibs';
					var avatar = user_obj.avatar;
					var index = squib_count;
					var trash_active;
					if ($('#delete-squibs').hasClass('active')){
						trash_active = 'delete-active';
					}else{
					
						 trash_active='';
					}
					
					var postData = {yourKey:yourKey, avatar:avatar, index:index, trash_active: trash_active, type:type}
		            $('.spin-msg').html("Fetching more squibs...");		            

					squibturf.socketCall(postData);
                }
            });
		
		
		function isScrollBottom() {

                var elementHeight = $(".page.squibs")[0].scrollHeight;
                var scrollPosition = $(".page.squibs").height() + $(".page.squibs").scrollTop();
     
                return (elementHeight == scrollPosition);
            };
		
		
		
	    
	    
	},
	
	
	
	
	
	
	
	
	//initilize function
	initialize: function (){
        //check if facebook session is set 
	    this.bindEvents();
		socket = io.connect('http://squibturf.com:8080', {'force new connection':true});
	    client.socket(socket);
	    openFB.init({appId: '746523682089857'});
		this.validate();

	},	

	
   
	
	
	
	
	
	
	
	
	
	
	
	//facebook login
	facebook_login: function(){
		openFB.login(
		function(response) {
			if(response.status === 'connected') {
			    //console.log(response);
			    squibturf.login();
			}else{

				//console.log(response.error);
			}
		}, {scope: 'email,read_stream,publish_stream'});
	},
	






	
	//facebook login check
	fbCheck: function(){
	    // //console.log('checking facebook session');
		openFB.api({
			path: '/me',
			success: function(data) {
			  // //console.log(data);
			    squibturf.validate();
				
			},
			error: this.errorHandler				
		});	
	
	},
	









    //error handleer for facebook		    
	errorHandler: function(error){
		 //console.log('error status: ' +  error.message);
		 squibturf.not_set();
	},
	









	//google login check
	googleCheck: function(){
		////console.log('assume google is not set');
	},
	
	
	
	
	
	
	
	
	
	
	//session validation
	validate: function(){
			var type = 'validate'; 
			var userKey =  squibturf.getUserKey();
			if(userKey == 'null' || userKey == '' || userKey == undefined){				
				 squibturf.not_set();
			}else{
				var postData = {type:type, userKey:userKey};
				this.socketCall(postData);
			}
	},
    
   
   
   
   
   
   
   
   
   
   
    //on login
	login: function(){
	    // //console.log('logging in');
		openFB.api({
			path: '/me',
			success: function(data) {
		        //console.log(data);
				$('.modal').removeClass('active');
				squibturf.storeSession(data);
			},
			error: this.errorHandler					
		});	
	},  
	
	
	
	
	
	 //session not set
    not_set: function (data){
        $('.facebook_login').show();
        $('.google_login').show();	

        
        // //console.log('squib session is not set');
    },    	    
    
   
	
	
	
	//exit
	exit: function(){
			var type="sign_out";
			var postData = {type:type};
		    window.localStorage.clear();
   			squibturf.socketCall(postData);
			openFB.logout();
	},
    
    
    
    
    
    
    
    
    //store session ---------------- //
    storeSession: function(data){
    
       var postData = {
	       first_name: data.first_name,
	       last_name: data.last_name,
	       email: data.email,
	       fb_id: data.id,
	       type: 'set_session',
	       avatar: 'http://graph.facebook.com/' + data.id + '/picture?type=large',
       } 
	      
	      
	      
	    // //console.log(postData);
	    this.socketCall(postData);
	    
    },
    
    
    
    
    
    
    
    
    //load DOM
    load: function(data){
        
		var occ = data.occ;
		if(occ == null) {occ = "";}
		if((occ == "") || (occ.trim().length == 0)){
		    $('#error-occ').addClass('active');
		}  
		else{
			$('.modal').removeClass('active');
			$.cookie('data-user', data.userKey);
			window.localStorage.setItem("data-user", data.userKey);
			user_obj = data;
			client.geo();
		}
    },
	
	
	
	
	
	
	
	//delete completed callback
	delete_complete: function (data){
	
		 var squib_id = data.squib_id;
		 $('li.mail-wrap.mail-' + squib_id).addClass('deleted');
		 setTimeout(function(){
		 	 $('li.squib-wrap.squib-' + squib_id).hide();
		 }, 500);
	},
	
	
	
	
	trash_complete: function (data){
	
		 var dataMail = data.dataMail;
		 $('li.mail-wrap.mail-' + dataMail).addClass('deleted');
		 setTimeout(function(){
		 	 $('li.mail-wrap.mail-' + dataMail).hide();
		 }, 500);
	},
	
	
	
	
	
	//load all mail
	load_mail: function (data){
	
		var wrap = data.request;
		$('.control-content#' + wrap +' ul').html(data.mail);
	
	    var start_touch_val;
		  $('body').on('touchstart', '.mail .squib', function(event){
		  console.clear();
				start_touch_val = event.originalEvent.touches[0].pageX;
				//console.log(start_touch_val);
		  });
		  
		  $('body').on('touchmove', '.mail .squib', function(event){
			var touch = event.originalEvent.touches[0].pageX;
			var move_val = (start_touch_val - touch);
			var userAgent = navigator.userAgent || navigator.vendor || window.opera;
			//console.log(move_val);
			if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
			{
				if(move_val >= 100){ event.preventDefault(); $(this).addClass('delete-active');}
				else if(move_val <= -100){event.preventDefault(); $(this).removeClass('delete-active');}
			} 
			else if( userAgent.match( /Android/i ) )
			{
				if(move_val >= 8){ event.preventDefault(); $(this).addClass('delete-active');}
				else if(move_val <= -8){event.preventDefault(); $(this).removeClass('delete-active');}
			}
				
		  });	  
	},
    
   
   
   
   
    //mail sent
    mail_sent: function(data){
	    //// //console.log(data);
	    $('.modal').removeClass('active');
 	    $('.opt#mail').trigger('touchend');
		$('.segmented-control a').removeClass('active');
 	    $('.segmented-control a:eq(1)').addClass('active');
 	    $('.control-content').removeClass('active');     	    
 	    $('.control-content:eq(1)').addClass('active');
 	    $('#subject').val("");
 	    $('#msg-body').val("");
 	    
 	    var kind ='sent';
	    squibturf.mail(kind);
 	},
	
	
	
	
	
	
	//load settings
	load_settings: function(data){
	  $('#settings .content').html(data.dom);
	},
    
   
   
   
   
   
    //email users
    email:function (data){
		//// //console.log(data);
		var body = data.mail;
		$('#mailWindow .content-padded').html(body);
    },
    
    
    
    
    
   
   
   
   
   
    //restart app
    restart_app: function(data){
    	window.location.reload(true);
    },   
    
    
    
    
    
    //get users profile
    load_profile: function(data){
         // //console.log(data);
    	 profile_obj = data;
    	 var connect_string;
    	 if( data.connect_status == 'connected'){
    	     connect_string = "<button class='btn icon btn-positive accept'></button>";
    	 }
    	 else if(data.connect_status == 'sent' || data.connect_status == 'pending'){
    	     connect_string = "<button class='btn icon btn-positive pending'></button>";
    	 }
    	 else{
    	 	connect_string = "<span class='icon icon-person' id='connect' data-message='Sending connect request' data-function='connect'></span>";
    	 }
    	 var result = "<div class='profile-content'>" +
			 			  "<span class='icon icon-mail' id='mail-user' href='#mail-user' data-function='mail_form'></span>" +
			 			      connect_string + 
                              "<div class='content-avatar'  style='background:url("+ data.avatar +") center no-repeat; background-size:auto 100px;'></div>"+
                              "<div class='content-name'><p>"+ data.name +"</p></div>"+
                              "<div class='content-info'><p>"+ data.occ +"</p></div>"+
						   "</div>";
		 $('#profileWindow .content-padded').html(result);
		 $('.data-user-mail').html(profile_obj.name);
     },
    
    
    
    
    
    
    //get squib
    get_squib: function (data){
                
        	    var userKey =   squibturf.getUserKey();
        		var editable;
        		if( userKey == data.userKey){
 						editable = "<span class='icon icon-edit edit-squib' data-function='edit_squib'></span>";
        		}else{
        				editable = "";
        		}
        		squib_obj = {dataUser: data.userKey, squib_id: data.squib_id};
        		//// //console.log(data);
        		if(data.squib_img == null){ data.squib_img = '';}
	        	var result = "<div class='profile-content' data-squib='"+ data.squib_id +"' data-user='"+ data.userKey +"'>" +
		                          "<div class='content-avatar' style='background:url("+ data.avatar +") center no-repeat; background-size:auto 100px;'></div>"+
		                          "<div class='content-info'><div class='squib_img'>" + data.squib_img + "</div><p class='squib-text'>"+data.msg +"</p> " + editable + "</div>"+ 
							   "</div>"+
							   "<div class='replies'><span class='icon icon-more' data-function='expand_more'></span>"+
							        "<span class='replies-count'>"+ data.squib_count +" comments</span>"+
							        "<div class='reply-wrap' ><ul class='table-view'></ul></div>"+
							    "</div>";
			   $('#replyWindow .content-padded').html(result);
				if(data.squibs != null){
					$.each(data.squibs, function(index, data){
					    $('.reply-wrap ul.table-view').append('<li class="table-view-cell"><a class="profile show reply" data-attr="'+ data[6] +'"><div class="avatar-wrap" style="background:url('+  data[9] +') center no-repeat; background-size:auto 40px; width:40px; height:40px;"></div> <div class="comment"><h5>'+ data[3] +'</h5> <span> '+ data[1] +'</div></a></li>');  
					});
			}
        },        
	
	
	
	
	
	
	//load history
	history: function (data){
	    // //console.log(data);
		var dom = data.dom;  
		$('.history .table-view').html(dom);
	},	
	
	
	
	
	
	
	
	//contacts
	contacts: function(data){
	  //  // //console.log(data);
		var activity = data.activity;  
		var contacts = data.contacts
		$('.contacts .activity .table-view').html(activity);
		$('.contacts .contact-info .table-view').html(contacts);
	
	},	
	
	
	
	
	
	
	
	
	//squibs
	squibs: function(data){
		var dom = data.squibs;  
		$('.squibs .table-view').append(dom);
		//body squibs
		  var start_touch_val;
		  $('body').on('touchstart', '.squibs .squib', function(event){
		  console.clear();
				start_touch_val = event.originalEvent.touches[0].pageX;
				//console.log(start_touch_val);
		  });
		  
		  $('body').on('touchmove', '.squibs .squib', function(event){
			var touch = event.originalEvent.touches[0].pageX;
			var move_val = (start_touch_val - touch);
			var userAgent = navigator.userAgent || navigator.vendor || window.opera;
			//console.log(move_val);
			if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
			{
				if(move_val >= 100){ event.preventDefault(); $(this).addClass('delete-active');}
				else if(move_val <= -100){event.preventDefault(); $(this).removeClass('delete-active');}
			} 
			else if( userAgent.match( /Android/i ) )
			{
				if(move_val >= 8){ event.preventDefault(); $(this).addClass('delete-active');}
				else if(move_val <= -8){event.preventDefault(); $(this).removeClass('delete-active');}
			}
				
		  });	  
	},	
	
	
	
	
	
	
	
	//select current squib
	select_squib: function($element){
				$element.find('.badge').removeClass('badge-positive');
				$('#replyWindow .content-padded').html('');
				var dataUser = $element.attr('data-attr');
				var squib_id = $element.attr('data-squib');
				var type = 'squib';
				var postData = {dataUser:dataUser, squib_id:squib_id, type:type};
					squibturf.socketCall(postData);
	
	},
	
	
	
	
	
	
	
	//connect completed
	connect_complete: function (data){
	 //  // //console.log(data);
	   dataUser = data.dataUser;
	   userKey = data.userKey;
	   $('.contact-info li.user-'+ userKey).fadeOut();
	   
	   $('.contact-info li.user-'+ dataUser).fadeOut();
	   $('#contacts').trigger('touchend');
	   
	  //  $('.connect-info ')
	},
	
	
	
	
	
	
	
	//update completed
	update_complete: function(data){
		//// //console.log(data);
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
	},
	
	
	
	
	
	
	
	
	
	//registration completed
	reg_complete: function(data){
		//// //console.log(data);
		var email = data.email;
	    var password = data.password;
	    var type = 'login'; 
	    var postData = {email:email, password:password, type:type};
	    callJson(postData);
	
	},
	
	
	
	
	
	
	
	
	
	//search results
	results:function(data){
	
	    $('.search .news-feed ul').html(data.dom);
	},
	
	
	
	
	
	
	
	//get mail type
	mail: function (kind){
	  var yourKey =   squibturf.getUserKey();
	  var type = 'mail_request';
	  var request = kind;
	  var postData = {yourKey:yourKey, type:type, request:request};
	  this.socketCall(postData);
	},
	
	
	
	
	
	
	
	
	//connect request sent
	connect_sent: function(data){
		$('.icon#connect').fadeOut(function(){
			$(this).remove();
			$('#mail-user').after('<button class="btn icon btn-positive pending"></button>');
					
		});
	},
	
	
	
	
	
	
	
	//loaded pinned squibs
	loadPinnedSquibs: function(data){
		$(data.pin).each(function(index, data) {
	          	 var reply = "<span class='badge'>"+ data['REPLY'] +"</span>";
	          	 var name = data[0];
	          	 var avatar = data[1];
	          	 var dataKey  = data[2];
	          	 var userKey = data.yourKey;
	          	 var squibImg = data['SQUIB_IMG'];
	          	 
	          	 if(squibImg == null){ squibImg = ' ';}
	          	 
	          	 if ((data['REPLY'] == null) || (data['REPLY'] == 0)){ reply = "";}
	          	 var inArray = $.inArray(data.POINT_ID, pinSquibArray);
	          	 if (inArray == -1){
		          $('.spinner-cont').stop().delay(1000).fadeOut();
	          	  	  pinSquibArray.push(data.POINT_ID);		          	  	  
						  var usersSquib = "";	
						if(userKey == dataKey ){
					         usersSquib = "yourSquib";
					    }
					    $('.news-feed-wrap .news-feed .table-view').prepend('<li class="table-view-cell squib-wrap pindown squib-'+ data.POINT_ID +' '+ usersSquib +'">'+
						'<a class="squib profile" id="replyWindow" data-function="open_modal, select_squib" data-attr="'+ data[2] +'" data-squib="'+ data.POINT_ID +'" data-message="Loading squib...">' + 
						'<div class="avatar-wrap" style="background:url('+ avatar + ') center no-repeat; background-size:auto 50px;"></div>'+
						'<h6>Pinned<span> by </span>'+ name +'</span><span class="date">'+ data['formatDate'] +'</span></h6><span class="msg">'+ data.MSG.replace(/\//g,'') +'</span> <div class="squibImg">'+ squibImg +'</div>'+ reply +'</a></li>');
						setTimeout(function(){ $('a.profile').addClass('show')}, 1000);      
	          	  }
	          });

	},
  	
  	
  	
  	
  	
  	
  	
  	//occupation is set
  	occ_set: function(data){
  	     squibturf.validate();
  	},
    
   
   
   
   
   
    //post comment --- reply
    post_reply: function(){
      var squib_comment =  $('.squib-reply').val().replace(/'/g, "\\'");
	  var squib_id =  squib_obj.squib_id;
	  var dataUser = squib_obj.dataUser;
	  var userKey =   squibturf.getUserKey();
	  var now = new Date();
	  var date = now.getFullYear()+ '-' +(now.getMonth() + 1) + '-' + now.getDate();
	  var month = now.getMonth() + 1;
	  var type = 'comment';
	  var sendComment = {userKey:userKey, dataUser:dataUser, squib_id:squib_id, squib_comment:squib_comment, date:date, type:type};
	  if( squib_comment != ''){  socket.emit('sendComment', sendComment); }
    },
    
   
   
   
   
   
    //set occupation --- set occ. 
    set_occ: function(){
		var new_occ = $('#occ-body').val();
		$('#settings p.OCC').html(new_occ);
		var type = 'set_occ';
		if (new_occ != null || new_occ != "" || new_occ.trim().length != 0){
		var postData = {type:type, new_occ:new_occ};
		squibturf.socketCall(postData);

		}
    },
    
   
   
   
   
   
    /// post squib
    post_squib: function(){
	  
		$('.newSquib').focusout(); 
		$('.rotate-img').remove();  
		var lat = $('html').attr('lat'); 
		var lng = $('html').attr('lng');
		var squibImg = $('#squibImg').html();
		var msg = $('.newSquib').val();
		
		var userKey = user_obj.userKey;
		var name = user_obj.name;
		var avatar = user_obj.avatar;
		var pindown = $('.pin-squib').hasClass('active');
		
		if(msg.length > 0){ 	   
		    var pindownType;
		if(pindown){ pindownType = 'pindown';}
		else{pindownType = 'no-pindown'; }
		var squibPkg = {msg:msg, avatar:avatar, name:name, userKey:userKey, lat:lat, lng:lng, squibImg:squibImg, pindown: pindownType};
		socket.emit('sendSquib', squibPkg);
		$('.spinner-cont').stop().fadeIn();
		$('.modal').removeClass('active'); 
		}
		
    },
    
   
   
   
   
   
   
    //update squib
    update_squib: function($element){
	     
	      var new_squib = $element.val();
	      $('#replyWindow .content-info p').html(new_squib);
	      var dataSquib = $('#replyWindow .profile-content').attr('data-squib');
		  var dataUser = $('#replyWindow .profile-content').attr('data-user');
		  var type = 'update_squib';
		  var postData = {new_squib:new_squib, dataSquib:dataSquib, dataUser:dataUser, type:type};
		  squibturf.socketCall(postData);
  
    },
    
    
    
    
    
    
    
    //rotate image
    rotate_img: function(){
		var rotate_val = $('#newSquib #squib_preview').attr('data-rotate');
		var new_rotate_val = parseInt(rotate_val) - 90;
	   	$('#newSquib #squib_preview')
	   	.attr('data-rotate', new_rotate_val)
	   	.css({'-webkit-transform': 'rotate(' + new_rotate_val + 'deg)', 'transform':'rotate(' + new_rotate_val + 'deg)'});		
    },
    
    
    
    
    
    
    
    
    //close modal
    close_modal: function($element){
    
       $($element).parent().parent().removeClass('active');
  
    },
    
   
   
   
   
   
    //expand reply 
    expand_more: function($element){
	    $element.toggleClass('open');
        $('#replyWindow .reply-wrap').toggleClass('open');
    },
    
  
  
  
  
  
    //icon search
    icon_search: function($element){
			$element.addClass('active');
			$('input.search').addClass('active');
			$('input.search').focusout();
			$('.area-user').addClass('hide');
			$('.page').hide();
			$('.page.search').show();
    },
    
   
   
   
   
   
    //open modal
    open_modal: function($element){
	      var id = $element.attr('id');
	      $('#'+ id +'.modal').addClass('active');
    },
    
    
    
    
    
    
    
    
    //filter for feed
    feed_filter: function($element){
			$element.toggleClass('active');
			var id = $element.attr('id');
			$('body').toggleClass(id);
    },
    
    
    
    
    
    
    
    
    
    //profile icons
    mail_form: function($element){
	   var id = $element.attr('id');
	   var avatar = user_obj.avatar;
	   $('.modal#' + id).addClass('active');	
	   $('.email.content-avatar').css({"background":"url('"+ user_obj.avatar +"') center no-repeat",  "background-size" : "auto 100px"});            
	   $('.email.to-avatar').css({"background":"url('"+ profile_obj.avatar +"') center no-repeat",  "background-size" : "auto 50px"});            
    },
    
    
    
    
    
    //active delete squib
    toggle_delete_squib: function(){
	     $('.squibs .squib-wrap .squib').toggleClass('delete-active');				
    },
    
    
    
      
    
    
    //delete a squib... 
    delete_squib: function($element){
    
		var dataSquib = $element.prev().attr('data-squib');
		var type = 'delete_squib';
	    var userKey =   squibturf.getUserKey();
		var postData = {dataSquib: dataSquib, type:type, userKey:userKey};
		squibturf.socketCall(postData);
	    
    },
    
    
    
    
    
    
    trash_mail: function($element){

	    var dataMail = $element.prev().attr('data-mail');
		var type = 'trash_mail';
	    var userKey =   squibturf.getUserKey();
		var postData = {dataMail: dataMail, type:type, userKey:userKey};
		squibturf.socketCall(postData);

    },
    
    
    
    
    
    
    //mail icon functions
    mail_icon: function($element){
	     $('#mailWindow .profile-content').addClass('collapse');
	     $element.toggleClass('collapse');
    },
    
    
    
    
    
    
    
    //get mail
    get_mail: function($element){
		 var userKey =   squibturf.getUserKey();
		 $element.parent().removeClass('unread');
		 $element.find('.badge').removeClass('badge-positive');
		 $('#mailWindow .content-padded').html('');
		 var mail_id = $element.attr('data-mail');
		 var type = 'get_mail';
		 var postData = {userKey:userKey, mail_id:mail_id, type:type};
		 squibturf.socketCall(postData);
    },
     
    
    
    
    
    
    //check you inbox 
    check_inbox: function(){
		var kind = 'inBox';
		squibturf.mail(kind);

    },
    
    
    
    
    
    //check type of mail  
    mail_type: function($element){
		var kind = $element.attr('data-attr');		
		squibturf.mail(kind);
    },
       
    
    
    
    
    
    //reply to email
    reply_email: function($element){
		var dataToUser = $element.attr('data-to-user');
		var dataFromUser = squibturf.getUserKey();
		var chainId = $element.attr('data-mail');
		var subject = $('.subject-chat').text();
		var body = $('textarea#reply-body').val();
		var type = 'reply_email';
		var postData = {dataToUser: dataToUser, dataFromUser:dataFromUser, chainId:chainId, body:body, subject:subject, type:type};
		squibturf.socketCall(postData);

    },
    
    
    
    
    
    
    
    //open settings
    settings: function(){
		var type = 'settings';
		var dataUser =   squibturf.getUserKey();
		var postData = {type:type, dataUser:dataUser}
		squibturf.socketCall(postData);
    },
    
    
    
    
    
    
    
    
    
    //search function
    // --- triggerred by keyup funciton..... 
    search: function($element){
		var value  = $element.val();
		var type = 'search'; 
		var length = value.length;
		var postData = {value:value, type:type};
		if(length <= 1 || value ==''){
		   $('.search .news-feed ul').empty();
		}else{
			squibturf.socketCall(postData);		  
		}

    },
    
    
    
    
    
    
    
    
    //update occupation
    update_occ: function($element){
          var new_occ = $element.val();
          $('#settings p.OCC').html(new_occ);
          var userKey = squibturf.getUserKey();
		  var type = 'update_occ';
		  var postData = {type:type, new_occ:new_occ, userKey:userKey};
		  squibturf.socketCall(postData);
    },
  
    
    
    
    
    
    
    
    //edit background function 
    edit_background: function($element){
		var text = $element.prev().text();
		var item = text.replace(/\"/g, "");
		$element.prev()
		.html('<textarea style="height:150px" type="text" data-function="update_occ" placeholder="Enter Background, Occupation, or Interests">'+ item +'</textarea>'); 
  
    },
    
    
    
    
    
    
    
    
    
    
    //get history
    get_history: function(){
		var type="history";
		var yourKey =   squibturf.getUserKey();
		var postData = {type:type, yourKey:yourKey};
		squibturf.socketCall(postData);
    },
    
    
    
    
    
    
    
    
    
    //get squibs
    get_squibs: function(){
	      $('.squibs .table-view').empty();
		  var yourKey =   squibturf.getUserKey();
		  var type = 'get_squibs';
		  var avatar = user_obj.avatar;
		  var index = 0;
		  var postData = {yourKey:yourKey, avatar:avatar, index:index, type:type};
		  squibturf.socketCall(postData);
    },
    
    
    
    
    
    
    
    
    //get contacts
    get_contacts: function(){
	      var yourKey = squibturf.getUserKey();
		  type = 'get_contacts';
		  var postData = {yourKey:yourKey, type:type}
		  squibturf.socketCall(postData); 
	    
    },
    
    
    
    
    
    
    
    
    //contact activity
    contact_activity: function(){
         $('.activity').toggleClass('show');  
    },
    
    
    
    
    
    
    
    
    
    //connect request
    connect: function(){
		 var yourKey = squibturf.getUserKey();
		 var userKey = profile_obj.userKey;
		 var now = new Date();
		 var date = now.getFullYear()+ '-' +(now.getMonth() + 1) + '-' + now.getDate();
		 var type = "contact";
		 var postData = {yourKey: yourKey, userKey:userKey, date:date, type:type};
		 squibturf.socketCall(postData);
    },
    
    
    
    
    
    
    
    
    
    //option button menu toolbar
    opt: function($element){
		var page = $element.attr('id');
		$('.opt').removeClass('active');
		$element.addClass('active');													
		$('.page').hide();
		$('.page.' + page).show();
		$('input.search').removeClass('active');
		$('.icon-search').removeClass('active');
		$('input.search').focusout();
		$('.area-user').removeClass('hide');
    },
    
    
    
    
    
    
    
    
    
    //edit squib enabled
    edit_squib: function($element){
	    var squib_text = $element.prev().text();
		var squib_item = squib_text.replace(/\"/g, "");
		$element.prev().html('<input type="text" placeholder="Enter New Data" data-function="update_squib" value="'+ squib_item +'" />');   
    },
    
    
    
    
    
    
    
    
    
    //reject request
    reject: function($element){
			var dataUser = $element.attr('data-attr');
			var type = 'reject_contact';
			var userKey =   squibturf.getUserKey();
			var data = {type:type, dataUser:dataUser, userKey:userKey};
			squibturf.socketCall(data);	
    },
      
    
    
    
    
    //accept request
    accept: function($element){
			var dataUser = $element.attr('data-attr');
			var userKey =   squibturf.getUserKey();
			var type = 'accept_contact';
			var data = {type:type, dataUser:dataUser, userKey:userKey};
			squibturf.socketCall(data);
    },
         
    
    
    
    
    
    
    //send mail
    send_mail: function(){
		var repecipient = profile_obj.userKey;
		var sender = user_obj.userKey;
		var subject = $('input#subject').val();
		var body = $('#msg-body').val();
		var type = 'send_mail';
		var now = new Date();
		data = {repecipient:repecipient, sender:sender, subject:subject, body:body, type:type};
		// // //console.log(data);
		if(body.length != 0){
		    squibturf.socketCall(data);
		}
    },
    
    
    
    
    
    
    
    
    //get profile
    get_profile:function($element){
			$('#profileWindow .content-padded').html('');
			var dataUser = $element.attr('data-attr');
			var userKey = squibturf.getUserKey();
			var type = 'profile';
			var postData = {dataUser:dataUser, type:type, userKey:userKey};
			squibturf.socketCall(postData); 
    },
    
    
    
    
    
    
    
    //spin message   
    spin_message: function($element){
		var message = $element.attr('data-message');
		$('.spin-msg').text(message);
    },
    
    
    
    
    
    
    
    //expand contacts
    expand_contacts: function($element){
	    $element.toggleClass('open');
        $('.activity').toggleClass('show');
    },

    
    
    
    
    //faq
    faq: function(){
       window.open("http://squibturf.com/faq.php", '_blank', 'location=yes,toolbar=yes');

    },
    
   
   
   
   
   
    //done 
    done: function(){
	     $('.spinner-cont').stop().delay(1000).fadeOut();
    }
	
	
}
