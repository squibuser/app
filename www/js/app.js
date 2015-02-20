//    app.initialize();

    function getImage() {
        // Retrieve image file location from specified source
	    
	    if(navigator.camera === undefined){
		    
		  uploadfromform();
		  
	    }else{
	      initializeCamera();
	      
	    
	    }
    }

    function initializeCamera(){
	     $('.shadow').fadeIn(function(){
	          $('.camera_options').show();
		      setTimeout(function () {$('.camera_options').addClass('open')}, 300); 
	     }); 
    }
    
    function getPhoto(source){
         navigator.camera.getPicture(uploadPhoto, function(message) {
           $('#squibImg').html("An error has occurred: Code = " + error.code);
	    }, { 
		   quality: 50,
	       destinationType: Camera.DestinationType.FILE_URI,
	       sourceType: source,
	       popoverOptions: new CameraPopoverOptions(300, 300, 200, 200, Camera.PopoverArrowDirection.ARROW_ANY)
  	     });
     }
     
    function uploadPhoto(imageURI) {
        //console.log(imageURI);
        var options = new FileUploadOptions();
		options.fileKey="image";
		options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
		options.mimeType="image/jpeg";
		options.chunkedMode = false;
		var params = new Object();
		var msg="test message";
		var token= "test token";
		params.message = msg;
		params.access_token = token;
		options.params = params;
		var ft =new FileTransfer();
        var url = encodeURI("http://squibturf.com/server/squibImg.php");
        ft.upload(imageURI, url, win, fail, options);
        $('.spin-msg').text("Uploading your pic... Sit tight!!!");
        $('.spinner-cont').fadeIn();
    }

    function win(r) {   
        console.log(r);

       // $('.col-25').hide(); 
       
        $('#squibImg').html(r.response);
        $('.spin-msg').text("Boom... Done!");
        $('.spinner-cont').delay(1000).fadeOut();
    }

    function fail(error) {
       $('.spin-msg').text("Dang! Somthing went sour. Try and upload again");
       $('.spinner-cont').delay(3000).fadeOut();
    }
    
    //function upload from form
    function uploadfromform(){
	    $('#imageInput').click();
	     var options = { 
            target:   '#squibImg',   // target element(s) to be updated with server response 
            beforeSubmit:  beforeSubmit,  // pre-submit callback 
            resetForm: true        // reset the form after successful submit 
        }; 
        
         $('#MyUploadForm').on('change', function() { 
            $(this).ajaxSubmit(options);  //Ajax Submit form            
            // return false to prevent standard browser submit and page navigation 
            return false; 
        }); 
    }

	//function to check file size before uploading.
	function beforeSubmit(){
	    //check whether browser fully supports all File API
	   if (window.File && window.FileReader && window.FileList && window.Blob)
	    {
	        
	        if( !$('#imageInput').val()) //check empty input filed
	        {
	            $("#squibImg").html("Are you kidding me?");
	            return false
	        }
	        
	        var fsize = $('#imageInput')[0].files[0].size; //get file size
	        var ftype = $('#imageInput')[0].files[0].type; // get file type
	        
	
	        //allow only valid image file types 
	        switch(ftype)
	        {
	            case 'image/png': case 'image/gif': case 'image/jpeg': case 'image/pjpeg':
	                break;
	            default:
	                $("#squibImg").html("<b>"+ftype+"</b> Unsupported file type!");
	                return false
	        }
	        
	        //Allowed file size is less than 1 MB (1048576)
	        if(fsize>1048576) 
	        {
	            $("#squibImg").html("<b>"+fsize +"</b> Too big Image file! <br />Please reduce the size of your photo using an image editor.");
	            return false
	        }
	                
	        $('#submit-btn').hide(); //hide submit button
	        $('#loading-img').show(); //hide submit button
	        $("#squibImg").html("");  
	    }
	    else
	    {
	        //Output error to older browsers that do not support HTML5 File API
	        $("#output").html("Please upgrade your browser, because your current browser lacks some new features we need!");
	        return false;
	    }
	}

