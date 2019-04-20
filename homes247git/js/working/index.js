//(function(){
var app = angular.module('homesApp', ['duScroll','slickCarousel','angular-page-loader','routerApp',
 'networkApp', 'sidebarApp',
    'footerApp', 'aboutUsApp', 'blogsApp',
    'careerApp', 'calculatorApp', 'faqApp',
    'servicesApp', 'offersApp', 'policyApp',
    'signupApp', 'contactUsApp', 'loginApp', 'myAccountApp',
	'propertyApp','cityApp','ui.bootstrap','modalApp','forgotpwdModule'
]);
app.directive('onlyLettersInput', onlyLettersInput);
  
  function onlyLettersInput() {
      return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
          function fromUser(text) {
            var transformedInput = text.replace(/[^a-zA-Z ]/g,'');
            //console.log(transformedInput);
            if (transformedInput !== text) {
              ngModelCtrl.$setViewValue(transformedInput);
              ngModelCtrl.$render();
            }
            return transformedInput;
          }
          ngModelCtrl.$parsers.push(fromUser);
        }
      };
    }

    app.directive(
        "bnLazySrc",
        function( $window, $document ) {
            // I manage all the images that are currently being
            // monitored on the page for lazy loading.
            var lazyLoader = (function() {
                // I maintain a list of images that lazy-loading
                // and have yet to be rendered.
                var images = [];
                // I define the render timer for the lazy loading
                // images to that the DOM-querying (for offsets)
                // is chunked in groups.
                var renderTimer = null;
                var renderDelay = 100;
                // I cache the window element as a jQuery reference.
                var win = $( $window );
                // I cache the document document height so that
                // we can respond to changes in the height due to
                // dynamic content.
                var doc = $document;
                var documentHeight = doc.height();
                var documentTimer = null;
                var documentDelay = 2000;
                // I determine if the window dimension events
                // (ie. resize, scroll) are currenlty being
                // monitored for changes.
                var isWatchingWindow = false;
                // ---
                // PUBLIC METHODS.
                // ---
                // I start monitoring the given image for visibility
                // and then render it when necessary.
                function addImage( image ) {
                    images.push( image );
                    if ( ! renderTimer ) {
                        startRenderTimer();
                    }
                    if ( ! isWatchingWindow ) {
                        startWatchingWindow();
                    }
                }
                // I remove the given image from the render queue.
                function removeImage( image ) {
                    // Remove the given image from the render queue.
                    for ( var i = 0 ; i < images.length ; i++ ) {
                        if ( images[ i ] === image ) {
                            images.splice( i, 1 );
                            break;
                        }
                    }
                    // If removing the given image has cleared the
                    // render queue, then we can stop monitoring
                    // the window and the image queue.
                    if ( ! images.length ) {
                        clearRenderTimer();
                        stopWatchingWindow();
                    }
                }
                // ---
                // PRIVATE METHODS.
                // ---
                // I check the document height to see if it's changed.
                function checkDocumentHeight() {
                    // If the render time is currently active, then
                    // don't bother getting the document height -
                    // it won't actually do anything.
                    if ( renderTimer ) {
                        return;
                    }
                    var currentDocumentHeight = doc.height();
                    // If the height has not changed, then ignore -
                    // no more images could have come into view.
                    if ( currentDocumentHeight === documentHeight ) {
                        return;
                    }
                    // Cache the new document height.
                    documentHeight = currentDocumentHeight;
                    startRenderTimer();
                }
                // I check the lazy-load images that have yet to
                // be rendered.
                function checkImages() {
                    // Log here so we can see how often this
                    // gets called during page activity.
                    // console.log( "Checking for visible images..." );
                    var visible = [];
                    var hidden = [];
                    // Determine the window dimensions.
                    var windowHeight = win.height();
                    var scrollTop = win.scrollTop();
                    // Calculate the viewport offsets.
                    var topFoldOffset = scrollTop;
                    var bottomFoldOffset = ( topFoldOffset + windowHeight );
                    // Query the DOM for layout and seperate the
                    // images into two different categories: those
                    // that are now in the viewport and those that
                    // still remain hidden.
                    for ( var i = 0 ; i < images.length ; i++ ) {
                        var image = images[ i ];
                        if ( image.isVisible( topFoldOffset, bottomFoldOffset ) ) {
                            visible.push( image );
                        } else {
                            hidden.push( image );
                        }
                    }
                    // Update the DOM with new image source values.
                    for ( var i = 0 ; i < visible.length ; i++ ) {
                        visible[ i ].render();
                    }
                    // Keep the still-hidden images as the new
                    // image queue to be monitored.
                    images = hidden;
                    // Clear the render timer so that it can be set
                    // again in response to window changes.
                    clearRenderTimer();
                    // If we've rendered all the images, then stop
                    // monitoring the window for changes.
                    if ( ! images.length ) {
                        stopWatchingWindow();
                    }
                }
                // I clear the render timer so that we can easily
                // check to see if the timer is running.
                function clearRenderTimer() {
                    clearTimeout( renderTimer );
                    renderTimer = null;
                }
                // I start the render time, allowing more images to
                // be added to the images queue before the render
                // action is executed.
                function startRenderTimer() {
                    renderTimer = setTimeout( checkImages, renderDelay );
                }
                // I start watching the window for changes in dimension.
                function startWatchingWindow() {
                    isWatchingWindow = true;
                    // Listen for window changes.
                    win.on( "resize.bnLazySrc", windowChanged );
                    win.on( "scroll.bnLazySrc", windowChanged );
                    // Set up a timer to watch for document-height changes.
                    documentTimer = setInterval( checkDocumentHeight, documentDelay );
                }
                // I stop watching the window for changes in dimension.
                function stopWatchingWindow() {
                    isWatchingWindow = false;
                    // Stop watching for window changes.
                    win.off( "resize.bnLazySrc" );
                    win.off( "scroll.bnLazySrc" );
                    // Stop watching for document changes.
                    clearInterval( documentTimer );
                }
                // I start the render time if the window changes.
                function windowChanged() {
                    if ( ! renderTimer ) {
                        startRenderTimer();
                    }
                }
                // Return the public API.
                return({
                    addImage: addImage,
                    removeImage: removeImage
                });
            })();
            // ------------------------------------------ //
            // ------------------------------------------ //
            // I represent a single lazy-load image.
            function LazyImage( element ) {
                // I am the interpolated LAZY SRC attribute of
                // the image as reported by AngularJS.
                var source = null;
                // I determine if the image has already been
                // rendered (ie, that it has been exposed to the
                // viewport and the source had been loaded).
                var isRendered = false;
                // I am the cached height of the element. We are
                // going to assume that the image doesn't change
                // height over time.
                var height = null;
                // ---
                // PUBLIC METHODS.
                // ---
                // I determine if the element is above the given
                // fold of the page.
                function isVisible( topFoldOffset, bottomFoldOffset ) {
                    // If the element is not visible because it
                    // is hidden, don't bother testing it.
                    if ( ! element.is( ":visible" ) ) {
                        return( false );
                    }
                    // If the height has not yet been calculated,
                    // the cache it for the duration of the page.
                    if ( height === null ) {
                        height = element.height();
                    }
                    // Update the dimensions of the element.
                    var top = element.offset().top;
                    var bottom = ( top + height );
                    // Return true if the element is:
                    // 1. The top offset is in view.
                    // 2. The bottom offset is in view.
                    // 3. The element is overlapping the viewport.
                    return(
                            (
                                ( top <= bottomFoldOffset ) &&
                                ( top >= topFoldOffset )
                            )
                        ||
                            (
                                ( bottom <= bottomFoldOffset ) &&
                                ( bottom >= topFoldOffset )
                            )
                        ||
                            (
                                ( top <= topFoldOffset ) &&
                                ( bottom >= bottomFoldOffset )
                            )
                    );
                }
                // I move the cached source into the live source.
                function render() {
                    isRendered = true;
                    renderSource();
                }
                // I set the interpolated source value reported
                // by the directive / AngularJS.
                function setSource( newSource ) {
                    source = newSource;
                    if ( isRendered ) {
                        renderSource();
                    }
                }
                // ---
                // PRIVATE METHODS.
                // ---
                // I load the lazy source value into the actual
                // source value of the image element.
                function renderSource() {
                    element[ 0 ].src = source;
                }
                // Return the public API.
                return({
                    isVisible: isVisible,
                    render: render,
                    setSource: setSource
                });
            }
            // ------------------------------------------ //
            // ------------------------------------------ //
            // I bind the UI events to the scope.
            function link( $scope, element, attributes ) {
                var lazyImage = new LazyImage( element );
                // Start watching the image for changes in its
                // visibility.
                lazyLoader.addImage( lazyImage );
                // Since the lazy-src will likely need some sort
                // of string interpolation, we don't want to
                attributes.$observe(
                    "bnLazySrc",
                    function( newSource ) {
                        lazyImage.setSource( newSource );
                    }
                );
                // When the scope is destroyed, we need to remove
                // the image from the render queue.
                $scope.$on(
                    "$destroy",
                    function() {
                        lazyLoader.removeImage( lazyImage );
                    }
                );
            }
            // Return the directive configuration.
            return({
                link: link,
                restrict: "A"
            });
        }
    );
    
    app.filter('trusted',
    function($sce) {
      return function(ss) {
        return $sce.trustAsHtml(ss)
      };
    }
 )
app.run(function($rootScope, $location, $cookies, $state,$sce) {
    $rootScope.getCanonical = function() {
        return $location.$$protocol + '://' + $location.$$host + $location.$$path;
    };

    
    
    $rootScope.$on("$locationChangeStart", function(event, next, current) {
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            event.preventDefault(); 
            $rootScope.title = $state.current.title;
            $rootScope.description = $state.current.description;
            $rootScope.keywords = $state.current.keywords;
            // console.log("NEWUPDATE:",$state);
            
        
       
        // $('.ui.modal.semant_modal').modal('hide');
        // $('.ui.modal.semant_modal').remove();
         // alert(localityurls);
        // $rootScope.metaurl = window.location.href;
        // console.log("URL:",window.location.href);
        var localityurls = $location.path();
        var url = $location.path().split('/')[2];
        
    if ($location.path() == '/'){  
        // $rootScope.metaurl = "https://www.homes247.in/";
        $rootScope.metaimage = "https://www.homes247.in/images/01.jpg";
    }else if($location.path() == '/bangalore/property-sale'){
        $rootScope.locality_filter = true;
        $rootScope.title = "Property in Bangalore | Real Estate in Bangalore | Apartments ,Villas, Plots for  sale in Bangalore | Homes247.in";
        $rootScope.description = "Latest Updates on Residential Projects in Bangalore,Details of Affordable,Luxury and Ultra Luxury Projects in Bangalore,Price of 2,3,4 BHK units in Bangalore from Best Developers.";
        $rootScope.keywords = "Best Realestate Website in Bangalore, Buy properties in Bangalore, Best Residential Properties in Bangalore, Best Residential Projects in Bangalore, Apartments for Sale in Bangalore, New Launched Residential Projects in Bangalore, Under construction flats in Bangalore, Ongoing Residential Projects in Bangalore, Ready to Move flats for sale in Bangalore, Affordable Apartments in Bangalore, Property for sale in Bangalore, Budgeted Apartments in Bangalore, Flats for sale in Bangalore, Villas for sale in Bangalore, Plots for sale in Bangalore,Homes247.in";
        $rootScope.metaimage = "http://www.spsevents.org/city/Bangalore/Bangalore2018/PublishingImages/BG4.png?&RenditionID=5";
       
    }else if($location.path() == '/hyderabad/property-sale'){
        $rootScope.locality_filter = true;
        $rootScope.title = "Property in Hyderabad | Real Estate in Hyderabad | Apartments ,Villas, Plots for  sale in  Hyderabad | Homes247.in";
        $rootScope.description = "Residential Projects in Hyderabad.Get the latest updates on details of affordable,luxury and ultra luxury projects in Hyderabad,Latest updates on the price,neighborhood and zones.";
        $rootScope.keywords = "Best Realestate Website in Hyderabad, Buy properties in Hyderabad, Best Residential Properties in Hyderabad, Best Residential Projects in Hyderabad, Apartments for Sale in Hyderabad, New Launched Residential Projects in Hyderabad, Under construction flats in Hyderabad, Ongoing Residential Projects in Hyderabad, Ready to Move flats for sale in Hyderabad, Affordable Apartments in Hyderabad, Property for sale in Hyderabad, Budgeted Apartments in Hyderabad, Flats for sale in Hyderabad, Villas for sale in Hyderabad, Plots for sale in Hyderabad,Homes247.in";
        $rootScope.metaimage = "https://images.thrillophilia.com/image/upload/s--prRfLXa4--/c_fill,f_auto,fl_strip_profile,h_775,q_auto,w_1600/v1/images/photos/000/039/718/original/1526278603_Main.jpg.jpg?1526278603";
    }else if($location.path() == '/chennai/property-sale'){
        $rootScope.locality_filter = true;
        $rootScope.title = "Properies for Sale in Chennai | Real Estate in Chennai | Apartments for Sale in Chennai | Villas and Plots for Sale in Chennai  | Homes247.in";
        $rootScope.description = "Residential Projects in Chennai.Get the latest updates on details of affordable,luxury and ultra luxury projects in Chennai,Price,Neighborhood and Key Distances from project.";
        $rootScope.keywords = "Best Realestate Website in Chennai, Buy properties in Chennai, Best Residential Properties in Chennai, Best Residential Projects in Chennai, Apartments for Sale in Chennai, New Launched Residential Projects in Chennai, Under construction flats in Chennai, Ongoing Residential Projects in Chennai, Ready to Move flats for sale in Chennai, Affordable Apartments in Chennai, Property for sale in Chennai, Budgeted Apartments in Chennai, Flats for sale in Chennai, Villas for sale in Chennai, Plots for sale in Chennai,Homes247.in";
        $rootScope.metaimage = "https://www.jetairways.com/Explore/Chennai2-1024x400.jpg";

    }else if($location.path() == '/kochi/property-sale'){
        $rootScope.locality_filter = true;
        $rootScope.title = "Properties in Kochi | Real Estate in Kochi | Apartments in Kochi | Villas for sale in Kochi | Plots in Kochi | Homes247.in";
        $rootScope.description = "Residential Projects in Kochi.Get the latest updates on details of affordable,luxury and ultra luxury projects in Kochi,Price,Neighborhood and Key Distances from project.";
        $rootScope.keywords = "Best Realestate Website in Kochi, Buy properties in Kochi, Best Residential Properties in Kochi, Best Residential Projects in Kochi, Apartments for Sale in Kochi, New Launched Residential Projects in Kochi, Under construction flats in Kochi, Ongoing Residential Projects in Kochi, Ready to Move flats for sale in Kochi, Affordable Apartments in Kochi, Property for sale in Kochi, Budgeted Apartments in Kochi, Flats for sale in Kochi, Villas for sale in Kochi, Plots for sale in Kochi,Homes247.in";
        $rootScope.metaimage = "https://keralatourism.travel/images/places-to-visit/headers/marine-drive-kochi-tourism-entry-fee-timings-holidays-reviews-header.jpg";

    }else if($location.path() == '/pune/property-sale'){
        $rootScope.locality_filter = true;
        $rootScope.title = "Properties in Pune  | Real Estate Trends in Pune | Apartments in Pune | Villas in Pune | Plots in Pune | Homes247.in";
        $rootScope.description = "Residential Projects in Pune. Details of latest trends,luxury projects in Pune. Get the Latest updates on price,neighborhood,Key distances and surrounding developments from this project.";
        $rootScope.keywords = "Best Realestate Website in Pune, Buy properties in Pune, Best Residential Properties in Pune, Best Residential Projects in Pune, Apartments for Sale in Pune, New Launched Residential Projects in Pune, Under construction flats in Pune, Ongoing Residential Projects in Pune, Ready to Move flats for sale in Pune, Affordable Apartments in Pune, Property for sale in Pune, Budgeted Apartments in Pune, Flats for sale in Pune, Villas for sale in Pune, Plots for sale in Pune,Homes247.in";
        $rootScope.metaimage = "https://images.thrillophilia.com/image/upload/s--rgJ0wRy5--/c_fill,f_auto,fl_strip_profile,h_775,q_auto,w_1600/v1/images/photos/000/053/221/original/1521657823_Lavasa.jpg.jpg?1521657823";

    }else if($location.path() == '/aboutus'){
        
    }else if($location.path() == '/careers'){
        
    }else if($location.path() == '/blogs'){
       
    }else if($location.path() == '/faq'){
        
    }else if($location.path() == '/contactus'){
        
    }else if($location.path() == '/expert-service'){
        
    }else if($location.path() == '/buyers-guide'){
    
    }else if($location.path() == '/latest-trends'){
       
    }else if($location.path() == '/Buy'){
        
    }else if($location.path() == '/rera'){

    }else if($location.path() == '/homeloan'){
      
    }else if($location.path() == '/calculator'){

    }else if($location.path() == '/vaastu'){
       
    }else if(url && url.indexOf("property-sale-in") > -1 ){
        $rootScope.locality_filter = false;
        var localitynameurl = $cookies.get('loc_nameurl');
        var locspace = localitynameurl.replace(/-/g," ");
        var loctitle = locspace.charAt(0).toUpperCase() + locspace.slice(1)
        var nbsp = String.fromCharCode(160);
        $rootScope.title = "Property For Sale in" + nbsp + loctitle + nbsp + "| Homes247.in";
        $rootScope.description = "Get the latest updates of best residential projects in" + nbsp + loctitle + nbsp + "Details of price,Possession, Availability,Key Distance and Neighborhood of the project.";
        $rootScope.keywords = "Best Realestate Website in" + nbsp + loctitle + "," + nbsp + "Buy properties in" + nbsp + loctitle + "," + nbsp + "Best Residential Properties in" + nbsp + loctitle + "," + nbsp + "Best Residential Projects in" + nbsp + loctitle + "," + nbsp + "Apartments for Sale in" + nbsp + loctitle + "," + nbsp + "New Launched Residential Projects in" + nbsp + loctitle + "," + nbsp + "Under construction flats in" + nbsp + loctitle + "," + nbsp + "Ongoing Residential Projects in" + nbsp + loctitle + "," + nbsp + "Ready to Move flats for sale in" + nbsp + loctitle + "," + nbsp + "Affordable Apartments in" + nbsp + loctitle + "," + nbsp + "Property for sale in" + nbsp + loctitle + "," + nbsp + "Budgeted Apartments in" + nbsp + loctitle + "," + nbsp + "Flats for sale in" + nbsp + loctitle + "," + nbsp + "Villas for sale in" + nbsp + loctitle + "," + nbsp + "Plots for sale in" + nbsp + loctitle + "," + nbsp + "Homes247.in";
    }else if(url && url.indexOf("builder") > -1 ){
        $rootScope.locality_filter = true;
        var builderurl = $cookies.get('builder_name');
        var citynameurl = $cookies.get('city_data');
        var cityname = citynameurl.charAt(0).toUpperCase() + citynameurl.slice(1);
        var builderspace = builderurl.replace(/-/g," ");
        String.prototype.toProperCase = function () {
            return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        };
        var buildertitle = builderspace.toProperCase();
        var nbsp = String.fromCharCode(160);
        $rootScope.title = "Residential Projects in"+ nbsp + cityname + " | " + nbsp + buildertitle + nbsp + "| Homes247.in";
        $rootScope.description = "Get the Details of Projects from Best Real Estate Developers in" + nbsp + cityname + ". Check the Latest Updates Of Up coming, Ongoing and Ready To Move in Projects from" + nbsp + buildertitle + ".";
        $rootScope.keywords = "Best Real Estate Developer in" + nbsp + cityname + ", Best Residential Developers in" + nbsp + cityname + ", Real Estate Developers in" + nbsp + cityname + "," + nbsp + buildertitle + nbsp + "Luxury Villas," + nbsp + buildertitle + nbsp + "Apartments, Reputed Developers in" + nbsp + cityname + ".";
    }else if(url && url.indexOf("zone") > -1 ){
        var zonecookie = $cookies.get('region_name');
        var zonespace = zonecookie.replace(/-/g," ");
        String.prototype.toProperCase = function () {
            return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        };
        var zonetitle = zonespace.toProperCase();
        var nbsp = String.fromCharCode(160);
        $rootScope.title = "Residential Projects in" + nbsp + zonetitle + nbsp + "| Apartments,Villas, Plots for Sale in" + nbsp + zonetitle + nbsp + "- Homes247.in";
        $rootScope.description = "Get the details of best residential projects in" + nbsp + zonetitle + "." + nbsp + "Get the latest updates of neighborhood,infrastructure developments in" + nbsp + zonetitle + "." + nbsp + "Check the price trends and  real estate updates.";
        $rootScope.keywords = "Apartments in" + nbsp + zonetitle + ",Villas in " + nbsp + zonetitle + ",Residential Projects in" + nbsp + zonetitle + ", Homes247.in,Flats for Sale in" + nbsp + zonetitle + ",Luxury Apartments in" + nbsp + zonetitle + ",Ready To Move Projects in" + nbsp + zonetitle + ",Ongoing Apartments in" + nbsp + zonetitle + ",Properties in" + nbsp + zonetitle + ",Plots in" + nbsp + zonetitle + ".";
        $rootScope.keywords = "Best Realestate Website in" + nbsp + zonetitle + "," + nbsp + "Buy properties in" + nbsp + zonetitle + "," + nbsp + "Best Residential Properties in" + nbsp + zonetitle + "," + nbsp + "Best Residential Projects in" + nbsp + zonetitle + "," + nbsp + "Apartments for Sale in" + nbsp + zonetitle + "," + nbsp + "New Launched Residential Projects in" + nbsp + zonetitle + "," + nbsp + "Under construction flats in" + nbsp + zonetitle + "," + nbsp + "Ongoing Residential Projects in" + nbsp + zonetitle + "," + nbsp + "Ready to Move flats for sale in" + nbsp + zonetitle + "," + nbsp + "Affordable Apartments in" + nbsp + zonetitle + "," + nbsp + "Property for sale in" + nbsp + zonetitle + "," + nbsp + "Budgeted Apartments in" + nbsp + zonetitle + "," + nbsp + "Flats for sale in" + nbsp + zonetitle + "," + nbsp + "Villas for sale in" + nbsp + zonetitle + "," + nbsp + "Plots for sale in" + nbsp + zonetitle + "," + nbsp + "Homes247.in";
    }else if(url && localityurls.indexOf("property") > -1){
        // $rootScope.metaurl = window.location;
        // alert(window.location);
    }else{
        $rootScope.locality_filter = true;
    }
})
    });
});

app.run(function ($rootScope, $location) {
    $rootScope.$on('$locationChangeStart', function(){
        ga('send', 'pageview', $location.path());
    });
});

app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }            
                ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

app.directive('wmBlock', function ($parse) {
    return {
        scope: {
          wmBlockLength: '='
        },
        link: function (scope, elm, attrs) {
         
          elm.bind('keypress', function(e){
           
            if(elm[0].value.length > scope.wmBlockLength){
              e.preventDefault();
              return false;
            }
          });
        }
    }   
});

app.factory('networkFactory', function(networking) {
    var factory = {};

    factory.getCityDetails = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/get_location', callback);
    };

    factory.getTopProperties = function(requestData,callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/get_topProperties',requestData,callback);
    };

    factory.getNewProperties = function(requestData,callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/get_newProperties',requestData,callback);
    };
    
    // factory.getPropretiesByID = function(requestData, callback) {
    //     return networking.callServerForUrlEncondedPOSTRequest('/get_propertyById', requestData, callback);
    // };

    factory.addCallbackDetails = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/callback', requestData, callback);
    };
    
    factory.addPopCallbackDetails = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/callbackpop', requestData, callback);
    };
    
    factory.getCallBackBasedOnProperty = function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/PropContactInfo', requestData, callback);
	};
	
	factory.getBuilderDetails = function(requestData , callback){
		 return networking.callServerForUrlEncondedPOSTRequest('/autocomplete', requestData, callback);
	};
	
	// factory.getProjectDetails = function(requestData,callback){
	// 	 return networking.callServerForUrlEncondedGETRequest('/search/'+requestData, callback);
	// };
    
    factory.getblogs = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/blogs', callback);
    };
	
	// factory.getProjectDetailsWithFilter = function(url,requestData,callback){
	// 	 return networking.callServerForUrlEncondedGetWithRequestData('/search/'+url, requestData,callback);
	// };
    // factory.getProjectDetailsWithlimitFilter = function(url,requestData,callback){
	// 	 return networking.callServerForUrlEncondedGetWithRequestData('/limitsearch/'+url, requestData,callback);
	// };
	factory.getUserrecentView = function(requestData,callback){
		 return networking.callServerForUrlEncondedPOSTRequest('/add_recent_view', requestData,callback);
	};
    return factory;
});
app.directive('clickAnywhereButHere', function($document){
  return {
    restrict: 'A',
    link: function(scope, elem, attr, ctrl) {
      elem.bind('click', function(e) {
        e.stopPropagation();
      });
      $document.bind('click', function() {
        scope.$apply(attr.clickAnywhereButHere);
      })
    }
  }
})
app.directive('clientAutoComplete',function($filter){
	return {
				
                restrict: 'A',       
                link: function (scope, elem, attrs) {
                    elem.autocomplete({

                        source: function (request, response) {
                            
                            //term has the data typed by the user
                            var params = request.term;
                            
                            //simulates api call with odata $filter
                            var data = scope.autolist;
                            scope.$watch('autolist', function(newValue, oldValue) {
   										//  console.log(newValue);
   										//  console.log(oldValue);
  								  //var someVar = [Do something with someVar];

   		
									    // so it will not trigger another digest 
									  //  angular.copy(someVar, $scope.someVar);

									});                                     
                            if (data) { 
                                var result = $filter('filter')(data, {name:params});
                                angular.forEach(result, function (item) {
                                    item['value'] = item['name'];
                                });                       
                            }
                            response(result);

                        },
                        minLength: 1,                       
                        select: function (event, ui) {
                           //force a digest cycle to update the views
                           scope.$apply(function(){
                               scope.setClientData(ui.item);
                           });                       
                        },
                       
                    });
                }

            };
});

app.controller('dashboardCtrl', function($scope, $timeout,$stateParams,$rootScope,$interval, networkFactory,$state,urls,$modal, $log,$cookies,cityFactory) {
       
   
    // var target = "https://www.homes247.in/";
            // var key    = "5c765659af3f3c52f0d9f8fb84ea294975f6b595d5308";

// $.ajax({
//     url: "https://api.linkpreview.net",
//     dataType: "jsonp",
//     data: {q: target, key: key},
//     success: function (response) {
//         console.log(response);
//     }
// });
    $scope.topqty = 3;
    $scope.validLength = 9;
    $scope.mobile = true;
    $scope.imagesdesktop = true;
    $scope.imagesVisible = false;
    if (window.screen.width <= 768) { 
        $scope.mobile = false;
        $scope.imagesdesktop = false;
        $scope.loaderimage = true;
      $timeout(function () {
        $scope.imagesVisible = true;
        $scope.loaderimage = false;
      },5000);
      }

      $scope.desk_search = true;

      if (window.screen.width <= 480) { 
        $scope.desk_search = false;
        $('.ui.modal.semant_modal').modal('hide');
        $('.ui.modal.semant_modal').remove();
        $('.ui.modal.semant_proprty_modal').modal('hide');
        $('.ui.modal.semant_proprty_modal').remove();
        $('.ui.modal.semant_city_modal').modal('hide');
        $('.ui.modal.semant_city_modal').remove();
      }
      
      

    var input = document.querySelector("#phno");
    window.intlTelInput(input, {
      
      initialCountry: "in",
      onlyCountries: ['AU', 'CA','DE','FR','IN','IT','MY','MV','MU','NZ','PH','QA','RU','SG','ZA','ES','LK','GB','US','AE'],
      separateDialCode: true,
      utilsScript: "../js/utils.js",
    });
    var dashenq = document.querySelector("#dashmodalphno");
    window.intlTelInput(dashenq, {
        initialCountry: "in",
        onlyCountries: ['AU', 'CA','DE','FR','IN','IT','MY','MV','MU','NZ','PH','QA','RU','SG','ZA','ES','LK','GB','US','AE'],
        separateDialCode: true,
        utilsScript: "./js/utils.js",
      });

    //    Body-click

    
$scope.clickedSomewhereElse = function(){
    $('body').removeClass('blurring'); 
  };
    
//    Body-click
    

    
     $scope.getID = function(property) {
        $scope.enquiry = property;
        // $interval.cancel(interval1);
        var dereg3 = $rootScope.$on('$locationChangeSuccess', function() {
        // $interval.cancel(interval1);
        dereg3();
                });
    //     interval1 = $interval(function() {
    //      $('.ui.modal.semant_modal').modal({
    //             blurring: true,
    //             closable: true,
    //             observeChanges: false
    //     }).modal('show');
    // }, 3.6e+7);
   }
     
    //  $('.modal_close').on('click', function(e) {
    //     interval1 = $interval(function() {
    //      $('.ui.modal.semant_modal').modal({
    //             blurring: true,
    //             closable: true,
    //             observeChanges: false
    //     }).modal('show');
    // }, 180000);
        
    // });
    
//SET-INTERVAL-FUNCTION-POPUP
    
    $scope.poplog = function(){
//        $('.ui.modal.semant_modal').modal('hide');
    };
    
    $scope.callBackpop = function(enquiry) {
        $scope.submit_pop_modal = true;
    if (enquiry) {
        var requestParam = {
                name: enquiry.name,
                number: enquiry.mobileno,
                email: enquiry.email
            };
            networkFactory.addPopCallbackDetails(requestParam, function(success) {
                var status = success.data.status;
                $('.ui.modal.semant_modal').modal('hide');
                $('.ui.modal.semant_modal').remove();
                if (status == "True") {
					 $scope.msgs = "We will intimate you soon.";
                    $scope.open();
                }
            }, function(error) {
                
				$scope.msgs = "Sorry! we are unable to process your request";
                    $scope.open();
            });
        angular.element("input[type='text']").val(null); 
    }
    };

    
//    setInterval(function(){
//        document.getElementById('myModal_dash')
//    }, 1200)
    //$('.test_design').niceSelect();
	$('body').attr('id', '');
    $(window).on('load', function() { // makes sure the whole site is loaded 
//            $('#wndw_load').fadeOut('fast'); // will fade out the white DIV that covers the website. 
            $('body').delay(350);
        })
        
       
    
    //    READMORE
    
     $scope.ngShowhide = false;
    $scope.toggleBtn = true;
    $scope.$watch('toggleBtn', function(flag) {
        $scope.toggleText = $scope.toggleBtn ? 'Read More' : 'Read Less';
                if (flag) {
                    $scope.ngShowhide = false;
                } else {
                    $scope.ngShowhide = true;
                }
            });
    
//    READMORE
    
$(function() {
//     document.body.scrollTop = 0;
//    document.documentElement.scrollTop = 0;
	$(this).css('background-color', 'red');
	$scope.slickConfig3Loaded = true;
    $scope.slickConfig2Loaded = true;
	$scope.slickConfig4Loaded = true;
    $scope.slickConfig5Loaded = true;
    $scope.slickConfig5 = {
        autoplay: true,
        arrows : false,
        infinite: true,
        dots: false,
      autoplaySpeed: 3000,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };
	$('.ui.dropdown').dropdown();
     $('#first').carouseller({
        //scrollSpeed: 850,
        //autoScrollDelay: -1800,
        //easing: 'easeOutBounce'
    });

   
    $('#top-project').carouseller({
       // scrollSpeed: 800,
        //autoScrollDelay: 1600,
        //easing: 'linear'
    });
    $('#fourd').carouseller();

     $('#fourd01').carouseller(); 
});
    $scope.imagepath = urls.imagesURL + "stories/";
    

     $scope.sorterFunc = function(property){
    return parseInt(property.BHK);
};
//	$cookies.put('key','dashboard');
    
    var property_id;
    
    $scope.user = {
        name: '',
        mobileno: ''
    }
    
	$scope.propertyimage=urls.imagesURL+"uploadPropertyImgs/";
	$scope.imagePath =urls.imagesURL+"cities/"; 
	var clientData = $cookies.get('user');
	if(clientData != null){
		var clients = JSON.parse(clientData);
			// console.log(clients[0].user_registration_IDPK);
		var userID = clients[0].user_registration_IDPK;
	}
    var page = $scope.user.origin = "Home Page";
    $scope.callBack = function(user) {
        $scope.submit_dash = true;
    if (user) {
        var requestParam = {
                name: user.name,
                number: user.mobileno,
                pageorgin: page
            };
            networkFactory.addCallbackDetails(requestParam, function(success) {
                var status = success.data.status;
                $('.form_call').removeClass('ng-submitted');
                if (status == "True") {
                }
            }, function(error) {
                
				$scope.msgs = "Sorry! we are unable to process your request";
                    $scope.open();
            });
        $scope.msgs = "We will intimate you soon.";
        $scope.open();
        $scope.user = '';
        $scope.submit_dash = false;
        angular.element("input[type='text']").val(null); 
    }
    };
    
   
    $scope.isSelected = function(property) {
      return $scope.enquiry === property;
    }
    $scope.getIDS = function(newProp) {
        $scope.enquiry = newProp; 
   }
    $scope.isSelected = function(newProp) {
      return $scope.enquiry === newProp;
    }
    
    
    
    $scope.getcallBackForProperties = function(enquiry) {
        $scope.submit_dash_modal = true;
    if (enquiry) {
        var propertyCallBack = {
            name:$scope.enquiry.name,
            number:$scope.enquiry.mobileno,
            propertyname:$scope.enquiry.propertyName,
            propId:$scope.enquiry.property_info_IDPK,
            propscndID:$scope.enquiry.property_info_ID
//            propId:propertyName
        };
        
		networkFactory.getCallBackBasedOnProperty(propertyCallBack,function(success){
             
			var status = success.data.status;
                if (status == "True") {
                }
		},function(error){
			$scope.msgs = "Sorry! we are unable to process your request";
			$scope.open();
		});
        $scope.msgs = "We will intimate you soon.";
        $scope.open();
		$scope.enquiry = '';
        $scope.submit_dash_modal = false;
		angular.element("input[type='text']").val(null); 
    }
    };
    
    $scope.getcallBackpop = function(enquiry) {
        $scope.submit_pop_modal = true;
    if (enquiry) {
        var propertyCallBack = {
            name:$scope.enquiry.name,
            number:$scope.enquiry.mobileno,
            propertyname:$scope.enquiry.propertyName,
            propId:$scope.enquiry.property_info_IDPK
//            propId:propertyName
        };
		networkFactory.getCallBackBasedOnProperty(propertyCallBack,function(success){
			var status = success.data.status;
                if (status == "True") {
                   $scope.msgs = "We will intimate you soon.";
                    $scope.open();
                }
		},function(error){
			$scope.msgs = "Sorry! we are unable to process your request";
			$scope.open();
		});
		
		angular.element("input[type='text']").val(null); 
    }
    };
    
    
	
	$scope.userFav = function(property,index){
		var clientData = $cookies.get('user');
		
		if(clientData == null){
		
		  
		 $cookies.put('propertyID',property.property_info_IDPK);
		  $cookies.put('type','dashboard');
		 $state.go('login');
		}
		else{
			var clients = JSON.parse(clientData);
			// console.log(clients[0].user_registration_IDPK);
			var requestData = {userId:clients[0].user_registration_IDPK, propId:property.property_info_IDPK};
			cityFactory.getUserFavourite(requestData,function(success){
				// console.log(success.data);
				property.user_fav?$('#'+index).html('<img src="images/start_icon.png" alt=""/>'):$('#'+index).html('<img src="images/selected_star.png" alt=""/>');
			},function(error){
				console.log(error);
			});
		}
	};

    networkFactory.getCityDetails(function(success) {
        // console.log(success.data);
		$scope.cities = success.data.locations;
		$scope.currentCity = $scope.cities [0];
		$scope.cityProperty = $scope.currentCity;
		$scope.getProperties($scope.currentCity);
		
		$scope.getBuilders();
		$scope.updateNumber();
		 $scope.slickConfig3 = {
        autoplay: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
        {
          breakpoint: 995,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };
    });
	
	 $scope.updateNumber = function () {
      $scope.slickConfig3Loaded = false;
      $timeout(function () {
        $scope.slickConfig3Loaded = true;
      });
    };

   
	
	$scope.getProperties= function(){
    var id = $scope.cityProperty.id;
    // $scope.loadtop = function (){
    networkFactory.getTopProperties({'cityId':id,'userId':userID},function(success) {
        // console.log(success.data.deatils);
		
		$scope.topProperties =success.data.deatils; 
		$scope.updateNumber2();
		
    $scope.slickConfig2 = {
      autoplay: false,
      infinite: true,
     autoplaySpeed: 5000,
      slidesToShow: 3,
      slidesToScroll: 1,
	  init: true,
      responsive: [
        {
          breakpoint: 995,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
          }
        },
        {
          breakpoint: 770,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 490,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };
		
    });
    networkFactory.getNewProperties({'cityId':id,'userId':userID},function(success) {
        // console.log(success.data.deatils);
		$scope.newProperties = success.data.deatils;
		 $scope.updateNumber3();
		 $scope.slickConfig4 = {
        autoplay: true,
        arrows : false,
        infinite: true,
        dots: true,
      autoplaySpeed: 3000,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
        {
          breakpoint: 995,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
          }
        },
        {
          breakpoint: 770,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };
    });
    $scope.loadtop = function (){
        return;
    }
// };
}

// $scope.loadblogs = function (){
    networkFactory.getblogs(function(success){
		// console.log(success.data);
        $scope.blogs= success.data.locations;
        $scope.updateNumber4();
	},function(error){
		console.log(error);
    });
    $scope.loadblogs = function (){
        return;
    }
// };
	
	 $scope.updateNumber2 = function () {
      $scope.slickConfig2Loaded = false;
      $timeout(function () {
        $scope.slickConfig2Loaded = true;
      });
    };

		
    $scope.updateNumber3 = function () {
      $scope.slickConfig4Loaded = false;
      $timeout(function () {
        $scope.slickConfig4Loaded = true;
      });
    };

    $scope.updateNumber4 = function () {
        $scope.slickConfig5Loaded = false;
        $timeout(function () {
            $scope.slickConfig5Loaded = true;
          });
    };

   
	 $scope.getBuilders = function(){
	 	 var ctrl = this;
         ctrl.client ={name:'', id:'',type:''};
	 	var builder = $scope.currentCity;
		// console.log("DUM:", builder);
		$cookies.put('city_id',builder.id);
		networkFactory.getBuilderDetails({'city_id':builder.id},function(success){
			// console.log(success.data.autolist);
			$scope.autolist = success.data.autolist;
		});
}
$scope.setClientData = function(item){
			 if (item){
                       $scope.builderData =item;
                        // console.log("AUTOCOMPLETE:",item);
                        // alert(item.city);
                        $scope.getProjects(item);
                     }
	};

    $scope.getPropertyID = function(propertyID) {

        if (clientData == null) {
            //$cookies.put('recentView', propertyID);
            //$state.go('login');
            $state.goNewTab('property', {
                param: propertyID
            });
        } else {
            var client_Data = JSON.parse(clientData);
            cityFactory.getUserrecentView({
                userId: client_Data[0].user_registration_IDPK,
                propId: propertyID
            }, function() {
                $state.goNewTab('property', {
                    param: propertyID
                });
            });
        }
    };
    
//	
	$scope.getProjects = function(currentCity){
        //alert(currentCity.city);
        // console.log("BUTTONCLICK:",currentCity)
		var propData = $scope.builderData;
        var requests = {locality:'',localityname:'',localitynameurl:'',buliderId:'',buldername:'',
                        regionid:'',regionname:'',reraId:'',propName:'',propeId:''};
        // var dumm = requests.localityname=propData.name;
        // var final =  dumm.replace(/\s+/g, '-');
        // alert(final);

		if(propData!= undefined && propData.hasOwnProperty('type')){
        if(propData.type=='bulider_name') {requests.buliderId=propData.id}
        if(propData.type=='bulider_name') {requests.buldername=propData.name}
        if(propData.type=='regions') {requests.regionid=propData.id}
        if(propData.type=='regions') {requests.regionname=propData.name}
        if(propData.type=='locality_name'){requests.locality=propData.id}
        if(propData.type=='locality_name'){requests.localityname=propData.name}
        if(propData.type=='locality_name'){requests.localitynameurl=propData.name}
		if(propData.type=='reraId'){requests.reraId=propData.id}
		if(propData.type=='property_name'){requests.propName=propData.id}
		if(propData.type=='propertyId'){requests.propeId=propData.id}
		
        }
        var locname = requests.localitynameurl;
        var spacless =  locname.replace(/\s+/g, '-').toLowerCase();
        var citinam = currentCity.city;
        var lowercase = citinam.toLowerCase();
        var buildname = requests.buldername;
        var buildspace = buildname.replace(/\s+/g, '-').toLowerCase();
        var region_name = requests.regionname;
        var region_space = region_name.replace(/\s+/g, '-').toLowerCase();
        $state.go('city',
        {cityname:lowercase,locality:requests.locality,buldername:requests.buldername,
        localitynameurl:spacless,localityname:requests.localityname,
		buliderId:requests.buliderId,regionid:requests.regionid,reraId:requests.reraId,
        propName:requests.propName,propeId:requests.propeId });
        if(locname != ""){
            // alert(locname);
            $state.go('city.locality',
        {cityname:lowercase,locality:requests.locality,
        localitynameurl:spacless,localityname:requests.localityname,
		buliderId:requests.buliderId,reraId:requests.reraId,
        propName:requests.propName,propeId:requests.propeId });
        }else if(buildname != ""){
            // alert(buildname);
            $state.go('builder',
            {cityname:lowercase,buliderId:requests.buliderId,
            buldername:buildspace,locality:requests.locality,
            localitynameurl:spacless,localityname:requests.localityname,
            reraId:requests.reraId,
            propName:requests.propName,propeId:requests.propeId });
        }else if(region_name != ""){
            $state.go('zone',
            {cityname:lowercase,buliderId:requests.buliderId,
            buldername:buildspace,locality:requests.locality,
            localitynameurl:spacless,localityname:requests.localityname,
            reraId:requests.reraId,regionid:requests.regionid,regionname:region_space,
            propName:requests.propName,propeId:requests.propeId });
        }
	};
	

	

  $scope.open = function (size) {
    var modalInstance;
    var modalScope = $scope.$new();
    modalScope.ok = function () {
            modalInstance.close(modalScope.selected);
    };
    modalScope.cancel = function () {
            modalInstance.dismiss('cancel');
    };      
    
    modalInstance = $modal.open({
      template: '<my-modal></my-modal>',
      size: size,
      scope: modalScope
      }
    );

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };



});

//});