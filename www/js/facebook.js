
     // Defaults to sessionStorage for storing the Facebook token
     openFB.init({appId: '746523682089857'});
    //  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
    //  openFB.init({appId: 'YOUR_FB_APP_ID', tokenStore: window.localStorage});
    function fb_login() {
    openFB.login(
                function(response) {
                    if(response.status === 'connected') {
						   getInfo();
                    } else {
                    }
                }, {scope: 'email,read_stream,publish_stream,user_about_me'});
    }
    function getInfo() {
        openFB.api({
            path: '/me',
            success: function(data) {
			/*
			console.log(JSON.stringify(data));
			console.log(data.name);
			console.log('http://graph.facebook.com/' + data.id + '/picture?type=small');
			*/
                
            },
            error: errorHandler});
    }
    function share() {
        openFB.api({
            method: 'POST',
            path: '/me/feed',
            params: {
                message: document.getElementById('Message').value || 'Testing Facebook APIs'
            },
            success: function() {
                console.log('the item was posted on Facebook');
            },
            error: errorHandler});
    }
    function revoke() {
        openFB.revokePermissions(
                function() {
                    console.log('Permissions revoked');
                },
                errorHandler);
    }
    function logout() {
        openFB.logout(
                function() {
                    console.log('Logout successful');
                },
                errorHandler);
    }
    function errorHandler(error) {
        console.log(error.message);
        $('.facebook_login').fadeIn();
    }