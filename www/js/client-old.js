







function socket(user_obj){
  var socket = io.connect('http://squibturf.com:8080', {'force new connection':true});
    geo();
	function geo (){
	   if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(positionSuccess, error, {enableHighAccuracy: true, maximumAge: 3000});
        } 
	   else { $(".error").append("<span>There is an error with your device. Please check your geolocation settings before proceeding.</span>").fadeIn(); }

	   function error (err) {
            // console.log('error message');
        }
	   function positionSuccess(position) {
	   
	      $('.loader').fadeOut();

	   var lat = position.coords.latitude.toFixed(4);
	   var lng = position.coords.longitude.toFixed(4);
      
	   var key = $('html').attr('data-user');
	   var type = 'pinned_squibs';
	   $('html').attr({'lat': lat, 'lng': lng});
	   var sentData = {user: key, lat: lat, lng: lng,  type: type};
	  // $('.title').html( 'lat : '+ lat + ' lng : '+ lng);
	     $('span.coord').show();
	     socket.emit("send:coords", sentData);
	     $.ajax({
	  		url:  "http://squibturf.com/server/server.php",
	  		data: sentData, 
	        type: 'POST',
	        dataType: 'json',
	        success: function(data){
	         
	          $(data.pin).each(function(index, data) {
	          	 
	          	 var reply = "<span class='badge'>"+ data['REPLY'] +"</span>";
	          	 var name = data[0];
	          	 var avatar = data[1];
	          	 var squibImg = data['SQUIB_IMG'];
	          	 if(squibImg == null){ squibImg = ' ';}
	          	 
	          	 
					          	 
	          	 if ((data['REPLY'] == null) || (data['REPLY'] == 0)){ reply = "";}
	          	 var inArray = $.inArray(data.POINT_ID, pinSquibArray);
	          	  if (inArray == -1){
	          	      console.log(data);
	          	  	  pinSquibArray.push(data.POINT_ID);		          	  	  
						  var usersSquib = "";	
						if(key == data[2]){
					         usersSquib = "yourSquib";
					    }
					    $('.news-feed-wrap .news-feed .table-view').prepend('<li class="table-view-cell squib-wrap pindown '+ usersSquib +'">'+
						'<a class="squib profile" id="replyWindow" data-attr="'+ data[2] +'" data-squib="'+ data.POINT_ID +'">' + 
						'<div class="avatar-wrap" style="background:url('+ avatar + ') center no-repeat; background-size:auto 50px;"></div>'+
						'<h6>Pinned<span> by </span>'+ name +'</span><span class="date">'+ data['formatDate'] +'</span></h6><span class="msg">'+ data.MSG.replace(/\//g,'') +'</span> <div class="squibImg">'+ squibImg +'</div>'+ reply +'</a></li>');
						setTimeout(function(){ $('a.profile').addClass('show')}, 1000);      
	          	  }
	          });
	           setTimeout(geo, 1000);
	           //$('.news-feed .table-view').prepend(data);
	        }

	     });	

	   }
	}

  
  
	socket.on('load:coords', function(data){
        
        $('.loader').fadeOut();
	    var yourLat = $('html').attr('lat'); 
	    var yourLng = $('html').attr('lng');
	    var userKey = $('html').attr('data-user');
	    var userLat = data.lat;
	    var userLng = data.lng;		
		var thisUserkey = data.key;
		var thisUserEmail = data.username;
		var thisUserOcc = data.occ.substring(0,100);
		var thisUserName = data.first +" " + data.last;
		var thisUserAvatar = data.avatar;
	    
	    if(thisUserkey != userKey){
	    
	                var lat_difference  =  Math.abs(yourLat - userLat);
                    var lng_difference  =  Math.abs(yourLng - userLng);    
					/* 	    // console.log('lat difference: ' + lat_difference + " lng difference: " + lng_difference); */
	                if((lat_difference < difference) && (lng_difference < difference)){
					//if((yourLat == userLat) && (yourLng == userLng)){
					            var inArray = $.inArray(thisUserkey,usersProxArray);
								if (inArray == -1){
								    usersProxArray.push(thisUserkey); 

								    $('.news-feed-wrap .news-feed .table-view').prepend('<li class="table-view-cell profile-wrap">'+
									    '<a class="profile" id="profileWindow" data-attr="'+ thisUserkey +'">' + 
									    	   '<div class="avatar-wrap" style="background:url('+ thisUserAvatar + ') center no-repeat; background-size:auto 50px;"></div>'+
									    	   '<h6>'+ thisUserName +'<span> is near you</span></h6>'+ thisUserOcc +'...</a></li>');
								    $('.area-prox-tray').append('<div class="profile-wrap" data-attr="'+ thisUserkey +'"  style="background:url('+ thisUserAvatar + ') center no-repeat; background-size:auto 38px;"></div>');

								   setTimeout(function(){ $('a.profile').addClass('show')}, 1000);              
								      data['userKey'] = userKey;
								      data['type'] = 'profile';
								      socket.emit('storeUser', data);  
							    }
					            $('.area-prox-tray .profile-wrap').each(function(){
							        var dataUser =  $(this).attr('data-attr');
							        if (dataUser == thisUserkey){ 
							        	$(this).show();

							        }
						        });      
				    }
				    else{  
							    $('.area-prox-tray .profile-wrap').each(function(){
							        var dataUser =  $(this).attr('data-attr');
							        if (dataUser == thisUserkey){
							        	  $(this).hide();
							        }
						        });		    
				    }
	    	                
	   }
	  

	  });
	$('body').on('touchstart', '.icon.post', function(){
   
   		     $('.newSquib').focusout(); 
             $('.loader').fadeIn();
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
							if(pindown)    					 
							    var squibPkg = {msg:msg, avatar:avatar, name:name, userKey:userKey, lat:lat, lng:lng, squibImg:squibImg, pindown:'pindown'};
							else{
							    var squibPkg = {msg:msg, avatar:avatar, name:name, userKey:userKey, lat:lat, lng:lng, squibImg:squibImg, pindown:'no-pindown'};
						    }
						      socket.emit('sendSquib', squibPkg);
						     $('.modal').removeClass('active'); 

				    }else{
				    	$('.loader').fadeOut();
				    }
	   
	             
	   
	   });
	socket.on('loadSquib', function(data){
           
           // console.log(data);
             var yourLat = $('html').attr('lat'); 
	         var yourLng = $('html').attr('lng');
	         var yourKey = $('html').attr('data-user');
	         var userLat = data.lat;
	         var userLng = data.lng;	
	         var avatar = data.avatar;
             var msg = data.msg;
             var squibImg  = data.squibImg;
             var name = data.name;
             var userKey = data.userKey;
             var squib_id = parseInt(data.squib_id);
             var pindown = data.pindown;
	         var lat_difference  =  Math.abs(yourLat - userLat);
             var lng_difference  =  Math.abs(yourLng - userLng);
             
             if (squibImg == null){squibImg = '';}
             
            	//if((yourLat == userLat) && (yourLng == userLng)){
                 if((lat_difference < difference) && (lng_difference < difference)){     
                    if(pindown != 'pindown'){
					$('.news-feed-wrap .news-feed .table-view').prepend('<li class="table-view-cell squib-wrap '+ pindown +'">'+
					  '<a class="squib profile" id="replyWindow" data-attr="'+ userKey +'" data-squib="'+ squib_id +'">' + 
						   '<div class="avatar-wrap" style="background:url('+ avatar + ') center no-repeat; background-size:auto 50px;"></div>'+
						   '<h6>Squib<span> from </span>'+ name +'</span></h6><span class="msg">'+ msg +'</span><div class="squibImg">'+ squibImg +'</div></a></li>');
					setTimeout(function(){ $('a.profile').addClass('show')}, 1000);              
             	    
             	    //get your userKey
             	    
                   data['yourKey'] = yourKey;
                   data['type'] = 'squib';
             	   socket.emit('storeSquib', data);

                   }
              }  
             
             
            if (yourKey == userKey){           
	             $('.loader').fadeOut();  
	             $('.newSquib').val('');
	             $('#squibImg').empty();
             }
             
             
             
      });
	$('body').on('touchstart', '.post-reply', function(){
		  var squib_comment =  $('.squib-reply').val().replace(/'/g, "\\'");
		  var squib_id =  squib_obj.squib_id;
		  var dataUser = squib_obj.dataUser;
		  var userKey = $('html').attr('data-user');
		  var now = new Date();
          var date = now.getFullYear()+ '-' +(now.getMonth() + 1) + '-' + now.getDate();
          var month = now.getMonth() + 1;
          var dateFormat = formatDate(month) + " " + now.getDate();
		  var type = 'comment';
		  var sendComment = {userKey:userKey, dataUser:dataUser, squib_id:squib_id, squib_comment:squib_comment, date:date, type:type};

          if( squib_comment != ''){
                 $('.loader').fadeIn();
			     socket.emit('sendComment', sendComment);
           }
		}); 
	socket.on('loadComment', function(data){
                     var squib_id =   squib_obj.squib_id;
		             var dataUser =   squib_obj.dataUser;
                     if((squib_id == data.squib_id) && (dataUser == data.dataUser)) {  
         	              $('.reply-wrap ul.table-view').append('<li class="table-view-cell"><a class="profile show reply" data-attr="'+ data.dataUser +'"><div class="avatar-wrap" style="background:url('+  data.avatar +') center no-repeat; background-size:auto 40px; width:40px; height:40px;"></div> <div class="comment"><h5>'+ data.fullName +'</h5> <span> '+ data.squib_comment.replace(/\\/g, '') +'</div></a></li>');
		                  $('.replies-count').html(data.count +" comments");
		                  $('.squib-reply').val("");
		                  $('#replyWindow .icon-more').addClass('open');
		                  $('.reply-wrap').addClass('open');
		                  $('#replyWindow .content').animate({ scrollTop: $('.reply-wrap').height()});
                   
		             }

		         
                     $('.news-feed-wrap li a.squib').each(function(){
	                       var dataUser =  $(this).attr('data-attr');
	                       var dataSquib = $(this).attr('data-squib');
	                       if ((dataUser == data.dataUser) && (dataSquib == data.squib_id)){
	                       	    $(this).find('.badge').remove();
	                       	    $(this).append('<span class="badge badge-positive">'+ data.count +'</span>');
	                       	}       
		            });

                      
                       $('.loader').fadeOut();



		         });
	socket.on('disconnect-user', function(data){   

			   $('.area-prox-tray .profile-wrap').each(function(){
		        var dataUser =  $(this).attr('data-attr');
		        if (dataUser == data){
		            $(this).hide();
		        }
				                     
			   });
 
  });


}

function formatDate(month){
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	return monthNames[month];
}