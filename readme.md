Ionic-google-drive mobile Application
=========
Getting Started
---------------

Step-1: (Setup Project)
=======
After you have cloned this repo, run the ionic installer to set up your machine
with the necessary dependencies to run and test this app:

     ```bash

     $ cd ionic-google-drive
     $ sudo npm install -g cordova ionic gulp
     $ npm install
     $ gulp install
     $ bower install

     ```

------------------
Step-2: (Configure Platforms & Plugins)
=======
With Ionic CLI (less than 3.0)
  ```
  $ ionic state restore 
  ```

With Ionic CLI (>= 3.0)
  ```
  $ ionic cordova prepare
  ```


Step-3: (Set up google-application on https://console.developers.google.com)
=======

Create a new project E.g. 'google-drive-test'

open this 'google-drive-test' project. 

Goto APIs & services -> Credentials
 
 Move to 2nd Tab on top 'OAuth consent screen' 
 provide a 'Product Name' for your app E.g. "Google Drive Test App 2.0" and hit 'save' button. 

Move back to 1st Tab 'Credentials' on top and click 'Create credentials' button to get a client Id for your application. 

 Select 'OAuth 2.0 client ID' option.
 Select 'Web-application' option.
 Put a redirect-uri for your application e.g. 'http://localhost/callback/'
  
  Note: Authorized-redirect-uri can be any page where google can redirect user after login. 
    If you're implementing a purely Javascript based application where you don't have a backend. you can put any valid URL 
    like 'http:localhost/callback/', this redirect-uri must match with the redirect-uri of your call. 
     

 Click 'Create' button and you'll have 'client_id' for your app. :)  Update the existing 'clientIdd' in declared constants www/js/drive.js with this new 'client_id' that is issued for your app.

 Click 'Create Credentials' button to get an API Key for your application.. Update the existing 'apiKey' in declared constants www/js/drive.js with this new apiKey that is issued for your app. 


 Finally, you just need to enable google-drive api for your app;
    Goto: APIs & services -> Library
    and in search type 'drive', Now hit the 'Drive API' option.
    press the 'Enable API' button on top and you're done.

    There you go :)

-------------

Step-4: Try it
==============
Depending on your platform, device or emulator try the base code.

'ionic [run|emulate] [andoid|ios]'

i.e. 'ionic run andorid' if you have an android device properly connected.  

Note that by design, OAuth in ionic does not support running in the browser since the callback url is for mobile.  In other words you can not use 'ionic serve' when trying OAuth.  See https://github.com/nraboy/ng-cordova-oauth/issues/46 regarding this.

-------------

How does it work? how do I extend it?
==============

 You are basically calling the 'authenticate' method of 'Drive' factory inside drive.js. (This will open goolge-authentication form inside in-app browser plugin)
 
    this.authenticateViaGoogle = function (user) {
       var defer = $q.defer();
       var scopes = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/userinfo.email'];
  
       Drive.authenticate(scopes, {redirect_uri: 'http://localhost/callback/'})
           .then(function (response) {
             if (response) {
               token = response.access_token;
             }
           },
           function (error) {
             console.log("" + error);
             defer.reject('de-authenticated');
           });
       return defer.promise;
    };
   
   
    Note: how we're passing exactly same 'redirect-uri' in the authorize call. 
 
 once you receive response-token-object. You can use access_token for your authorization scheme.
 
Received access_token will be set within Drive service for API requests.

 You can see in drive.js how we're loading 'google-drive' client to use with the 'gapi' javascript client library.
 
 There you go!! 
 
 Now we can simply access our google-drive by using the drive client. 
 
 
     Drive.readFiles().then(function (files) {
       $scope.files = files;
       console.log("FileRead: success.");
     }, function () {
       console.log("FileRead: error.");
     });

 'Drive.readFiles' will read all files from google-drive.
  
  Similarly 'Drive' factory currently supports these methods.. 
  
      ///read all files
      
      Drive.readFiles().then(function (files) {
             $scope.files = files;
             console.log("FileRead: success.");
           }, function () {
             console.log("FileRead: error.");
           });
           
      ///load a single file against Id..
      
      Drive.loadFile($scope.file_id).then(function (response) {
        $scope.file = response;
        var fpath = $scope.file.metadata.title;
        $scope.file.metadata.title = fpath.substring(fpath.lastIndexOf('/') + 1, fpath.lastIndexOf('.'));
        $scope.file_content = $scope.file.content;
      }, function (error) {
         console.log(error);
      });
      
      ///save file
      
      Drive.saveFile($scope.file.metadata, $scope.file.content).then(function (result) {
        console.log("FileSaved: successfully.");
        $state.go('directory');
      }, function (err) {
        console.log("FileSaved: error.");
      });
      
      ///delete file
      
      Drive.deleteFile(file.id).then(function (resp) {
        $scope.files.splice($scope.files.indexOf(file), 1);
        console.log("file deleted successfully.")
      }, function (error) {
        console.log(error);
      });
      
      
      You can still implement whatever you want inside Drive factory.. 
      
      It's pretty Simple.. :)
      
      
      
      
  
 
