//(function(){
var app = angular.module('sidebarApp',['calculatorApp','ngCookies']);

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
app.controller('sidebarCtrl',function($scope,$cookies,$state,$stateParams,$rootScope,$interval,networkFactory,propertyFactory,$location,$window){


    //SET-INTERVAL-FUNCTION-POPUP
    
    
//     var interval1;
//     if(localStorage.getItem('popupmain') != 'shown'){
//     interval1 = $interval(function() {
//          $('.ui.modal.semant_modal').modal({
//                 blurring: true, 
//                 closable: true,
//                 observeChanges: false
//         }).modal('show');
//     },180000); // milliseconds
//     localStorage.setItem('popupmain','shown')
// }
// if(sessionStorage.getItem('popupmain') != 'shown'){
//     interval1 = $interval(function() {
//          $('.ui.modal.semant_modal').modal({
//                 blurring: true, 
//                 closable: true,
//                 observeChanges: false
//         }).modal('show');
//     },180000); // milliseconds
//     sessionStorage.setItem('popupmain','shown')
// }
    $scope.pop_close = function(){
        // $interval.cancel(interval1);
        
    //    interval1 = $interval(function() {
    //      $('.ui.modal.semant_modal').modal({
    //             blurring: true, 
    //             closable: true,
    //             observeChanges: false
    //     }).modal('show');
    // }, 180000);
        $("body").removeClass("dimmable");
        $("body").removeClass("blurring");
        $("body").removeClass("scrolling");
    }
    var dereg = $rootScope.$on('$locationChangeSuccess', function() {
    // $interval.cancel(interval1);
    // localStorage.removeItem('popupmain','shown')
    dereg();
  });
    
    
    $scope.mobile = true;
    if (window.screen.width <= 768) { 
        $scope.mobile = false;
      }
    
	$scope.user_favs=false;
     $(function() {
         document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
//         $('.ui.dropdown').dropdown();
         });
	var url = $location.path().split('/')[1];
	// alert(url);
    var windowWidth = $(window).width();
    $scope.fxd_top_icn = true;
	if(url==''){
		$scope.showSearchBar = false;
        $scope.showOffers = true;
        $scope.showNRI = true;
        $scope.showfav = true;
        $scope.showsignup = true;
        $scope.homenav = true;
        $scope.pagesnav = false;
	}else{
        $scope.pagesnav = true;
        $scope.homenav = false;
		$scope.showSearchBar = true;
        $scope.showOffers = false;
        $scope.showNRI = false;
        $scope.showfav = false;
        $scope.showsignup = false;
	}
    
    $scope.logodiv = true;
    $scope.resplogo = false;
    
    $scope.desk_drop = true;
    $scope.callbtn = false;
    $scope.respoffer = false;
    $scope.deskburger = true;
    $scope.respburger = false;
    $scope.respwork = false;
    $scope.desktopburger = true;
    
    if (windowWidth <= 480){

        $scope.desktopburger = false;
        $scope.respburger = true;
        $scope.deskburger = false;
        $scope.logodiv = false;
        $scope.resplogo = true;
        $scope.desk_drop = false;
        $scope.callbtn = true;
        $scope.respoffer = true;
        $scope.respwork = true;
        if(url==''){
            $scope.showSearchBar = false;
            $scope.homenav = false;
        $scope.pagesnav = true;
        }else{
            $scope.showSearchBar = false;
            $scope.pagesnav = true;
        $scope.homenav = false;
        }
    }
	$scope.openNav =function() {
		document.getElementById("mySidenav").style.width = "250px";
	}

	$scope.closeNav = function() {
		document.getElementById("mySidenav").style.width = "0";
	}
	
	$scope.userLoginType = function(type){
		if(type =='Sign up') $state.go('login');
		else if(type=='Profile') $state.go('myFav');
	};
//    $scope.logout = function () {
//                localStorage.clearAll();
//                window.location = '/login';
//            };
	
	$scope.setClientData = function(item){
		
			 if (item){
                       
                       $scope.builderData =item;
                        // console.log(item);
                        $scope.getProjects(item);
                     }
		
    };
    
    var cityname, locality,  localityname, builder, buldername, regionid, reraid, property, propertid;
    if ($stateParams.cityname != undefined || $stateParams.locality != undefined || 
        $stateParams.localityname != undefined || $stateParams.buliderId != undefined || 
        $stateParams.regionid != undefined ||
        $stateParams.buldername != undefined || $stateParams.reraId != undefined || 
        $stateParams.propName != undefined || $stateParams.propeId != undefined ) {
        cityname = $stateParams.cityname;
        locality = $stateParams.locality;
        localityname = $stateParams.localityname;
        builder = $stateParams.buliderId;
        buldername = $stateParams.buldername;
        regionid = $stateParams.regionid;
        reraid = $stateParams.reraId;
        property = $stateParams.propName;
        propertid = $stateParams.propeId;
        $cookies.put('city_data', cityname);
        $cookies.put('loc_data', locality);
        $cookies.put('loc_name', localityname);
        $cookies.put('builder_data', builder);
        $cookies.put('builder_name', buldername);
        $cookies.put('region_id', regionid);
        $cookies.put('rera_data', reraid);
        $cookies.put('prop_data', property);
        $cookies.put('propid_data', propertid);
    } else {
        cityname = $cookies.get('city_data');
        locality = $cookies.get('loc_data');
        localityname = $cookies.get('loc_name');
        builder = $cookies.get('builder_data');
        buldername = $cookies.get('builder_name');
        regionid = $cookies.get('region_id');
        reraid = $cookies.get('rera_data');
        property = $cookies.get('prop_data');
        propertid = $cookies.get('propid_data');
    }
    
    var param1= $stateParams.param;
//    alert('/property/'+param1);
    var property_id;
	if($stateParams.param != undefined){
		property_id = $stateParams.param;
		$cookies.put('propId',property_id);
	}else{
		property_id=$cookies.get('propId');
	}
    
    cityname=cityname =='null'?'':cityname;	
//    $scope.city_name = cityname;

//    citynameurl=citynameurl =='null'?'':citynameurl;	
    // var citynamefinal = cityname.charAt(0).toUpperCase() + cityname.slice(1)
    // $scope.city_name = citynamefinal;

    localityname=localityname == 'null'?'':localityname;
    $scope.locality_name = localityname;

//    alert($scope.city_name);
// if($location.path() == '/'+para){
//     $scope.city_name = cityname
// }

    buldername=buldername == 'null'?'':buldername;
    $scope.builder_name = buldername;

    if(url==url){
        $scope.city_name = citynamefinal;
        // alert(localityname);
    }
    if(url=='property')
    {   
        var citynamefinal = cityname.charAt(0).toUpperCase() + cityname.slice(1)
        $('.footer_main').addClass('tech');
        $scope.city_name = citynamefinal;
        
    }else if(url==''){
        // alert("ok");
    }else{
        // $scope.city_name = "Select"
    }

    
	networkFactory.getCityDetails(function(success) {
        // console.log("MAIN_SIDEBAR_LOAD",success.data);
        $scope.cities = success.data.locations;
        $scope.currentCity = $scope.cities[0];
        // console.log("MAIN_LOAD:",$scope.cities)
        var citynamefinal = cityname.charAt(0).toUpperCase() + cityname.slice(1);
        var res = $scope.cities.findIndex( citydata => citydata.city ===  citynamefinal );
        // var res = $cookies.getObject('data') != undefined?$cookies.getObject('data'):$scope.cities;
		// console.log("SIDEBAR_LOAD:",$scope.cities[res]);
        if(url==url){
            $scope.currentCity =$scope.cities[res];
        }else if(url==''){
            // alert("ok");
        }else{
            $scope.currentCity = $scope.cities [0];
        }
		// $scope.currentCity =res;
		$cookies.putObject('data',$scope.currentCity);
		$scope.getBuilders($scope.cities[res]);
	});
	
	
	 $scope.getBuilders = function(cities)
     {
		//  console.log("SIDEBAR:", cities);
		 $cookies.putObject('data',cities); 
	 	 var ctrl = this;
         ctrl.client ={name:'', id:'',type:''};
        //  var cities = $scope.currentCity;
        //  console.log("SIDEBAR:", cities);
		// alert(cities.city);
		$cookies.put('city_id',cities.id);
		networkFactory.getBuilderDetails({'city_id':cities.id},function(success){
			// console.log(success.data.autolist);
			$scope.autolist = success.data.autolist;
		});

}

$scope.getProjects = function(cities){
    $("body").removeClass("modal-open");
	//alert(cities.city);
	$cookies.putObject('data',cities);
		var propData = $scope.builderData;
        var requests = {locality:'',localityname:'',localitynameurl:'',buliderId:'',buldername:'',regionid:'', 
        regionname:'',reraId:'',propName:'',propeId:''};
		if(propData!= undefined && propData.hasOwnProperty('type')){
        if(propData.type=='bulider_name') {requests.buliderId=propData.id}
        if(propData.type=='bulider_name') {requests.buldername=propData.name}
        if(propData.type=='regions') {requests.regionid=propData.id}
        if(propData.type=='regions') {requests.regionname=propData.name}
        if(propData.type=='locality_name'){requests.locality=propData.id}
        if(propData.type=='locality_name'){requests.localityname=propData.name}
        if(propData.type=='locality_name'){requests.localitynameurl=propData.name}
		if(propData.type=='reraId'){requests.reraId=propData.id}
        if(propData.type=='property_name') {requests.propName=propData.id}
        if(propData.type=='propertyId') {requests.propeId=propData.id}
		
        }
        var locname = requests.localitynameurl;
        // alert(locname);
        var spacless =  locname.replace(/\s+/g, '-').toLowerCase();
        var citinam = cities.city;
        var lowercase = citinam.toLowerCase();
        var buildname = requests.buldername;
        var buildspace = buildname.replace(/\s+/g, '-').toLowerCase();
        var region_name = requests.regionname;
        var region_space = region_name.replace(/\s+/g, '-').toLowerCase();
		$state.go('city',
        { cityname:lowercase,locality:requests.locality,buldername:requests.buldername,
        localityname:requests.localityname,localitynameurl:spacless,
        buliderId:requests.buliderId,regionid:requests.regionid,regionname:region_space,reraId:requests.reraId,
        propName:requests.propName,propeId:requests.propeId});
        if(locname != ""){
            // alert(locname);
            $state.go('city.locality',
        {cityname:lowercase,locality:requests.locality,buldername:requests.buldername,
        localitynameurl:spacless,localityname:requests.localityname,
		buliderId:requests.buliderId,reraId:requests.reraId,regionid:requests.regionid,regionname:region_space,
        propName:requests.propName,propeId:requests.propeId });
        }else if(buildname != ""){
            // alert(buildname);
            $state.go('builder',
            {cityname:lowercase,buliderId:requests.buliderId,
            buldername:buildspace,locality:requests.locality,
            localitynameurl:spacless,localityname:requests.localityname,
            reraId:requests.reraId,regionid:requests.regionid,regionname:region_space,
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
	
    $scope.refer = function(){
       if($cookies.get('user') != null){
		     $state.go('referEarn');
	} else {
        $state.go('login');
    }
    }
    
	function load_bar(){
	if($cookies.get('user') != null){
		$scope.user_favs=true;
		$scope.valueType="Profile";
	}
	else{
		$scope.valueType="Sign up";
	}
	}
	load_bar();
});


//});