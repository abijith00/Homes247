//function(){
var app = angular.module('offersApp',[]);
app.factory('offerFactory', function(networking) {
    var factory = {};

    factory.addCallbackDetails = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/callback', requestData, callback);
    };
    
     factory.getCallBackBasedOnProperty = function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/PropContactInfo', requestData, callback);
	};
    
    factory.getcity = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/get_location', callback);
    };

    factory.getBedroomDetails = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/get_bedrooms', callback);
    };

    factory.getBudget = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/get_budget', callback);
    };

    factory.getPossission = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/get_possission', callback);
    };
//    factory.getcity = function(callback) {
//        return networking.callServerForUrlEncondedGETRequest('/search/', callback);
//    };
	 factory.getProjectDetails = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/get_offers/', callback);
    };
    factory.getlocality = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/get_locality_basedLocation', requestData, callback);
    };
    factory.getProjectDetailsWithFilter = function(url, requestData, callback) {
        return networking.callServerForUrlEncondedGetWithRequestData('/get_offers/' + url, requestData, callback);
    };

    factory.getUserrecentView = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/add_recent_view', requestData, callback);
    };

    factory.getUserFavourite = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/add_Favourite', requestData, callback);
    };


    return factory;
});

app.filter("unique", function(){
  return function(data) {
    if(angular.isArray(data)) {
      var result = [];
      var key = {};
      for(var i=0; i<data.length; i++) {
        var val = data[i];
        if(angular.isUndefined(key[val])) {
          key[val] = val;
          result.push(val);
        }
      }
      if(result.length > 0) {
        return result;
      }
    }
    return data;
  }
})

app.controller('offersCtrl',function($scope, offerFactory, $stateParams, 
$state, urls, $modal, $log, $cookies, $window, $rootScope, networkFactory){

    $scope.validLength = 9;
    
    $scope.budget_show = true;
$scope.bud_val_show = false;


var enqmodal = document.querySelector("#enqphno");
window.intlTelInput(enqmodal, {
    initialCountry: "in",
    separateDialCode: true,
    utilsScript: "./js/utils.js",
  });

  var offerenq = document.querySelector("#offerphno");
  window.intlTelInput(offerenq, {
      initialCountry: "in",
      separateDialCode: true,
      utilsScript: "./js/utils.js",
    });

    $scope.toggleSearch = function () {
        // console.log('toggle')
        // $scope.open = !$scope.open;
        $('#budgetmodal').toggleClass('expanded');
        $('#budgetmodal').toggleClass('collapsed');
    };

    $scope.clickedSomewherecity = function(){
        $('#budgetmodal').addClass('collapsed');
        $('#budgetmodal').removeClass('expanded');
      };


    $(function() {
         document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
        $('.ui.dropdown').dropdown();
        $('.ui.budget_minprice.search.dropdown').dropdown({
            // minCharacters : 1
            onChange: function() {
                $('.budget_minprice').removeClass('minbud');
                $('.budget_maxprice').addClass('maxbud');
            },
            forceSelection: false,
        });
        $('.ui.budget_maxprice.search.dropdown').dropdown({
            // minCharacters : 1
            onChange: function() {
                $('#budgetmodal').addClass('collapsed');
                $('#budgetmodal').removeClass('expanded');
                $('.budget_minprice').addClass('minbud');
                $('.budget_maxprice').removeClass('maxbud');
                // $('#budgetmodal').removeClass('in');
                // $('body').removeClass('modal-open');
                // $('body').removeAttr('style');
                // $('.modal-backdrop').remove();
            },
            forceSelection: false
        });
        $('.example .offer_drop .browse')
  .popup({
    inline     : true,
    lastResort : 'bottom left',
    on    : 'click',
    position   : 'bottom left',
    delay: {
      show: 300,
      hide: 200
    }
  });
        });
    
        $rootScope.title = "Offers | Homes247";
	//$cookies.set('key','others');
	$scope.sizeselect=[{value:10},{value:20}];
	$scope.sizevalue = $scope.sizeselect[0];
	$scope.itemsPerPage = $scope.sizevalue.value;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.properties = [];
	$scope.prop_val = true;
   $scope.sorterFunc = function(property){
    return parseInt(property.BHK);
};
    $scope.sortorder = '';
    //console.log($state.params);
    $scope.propertyimage = urls.imagesURL + "uploadPropertyImgs/";
    $scope.statusimages = urls.imagesURL + "propStatus/";
    var clientData = $cookies.get('user');
    if (clientData != null) {
        var clients = JSON.parse(clientData);
        // console.log(clients[0].user_registration_IDPK);
        var userID = clients[0].user_registration_IDPK;
    }
    var cityname, locality, builder, reraid;
    if ($stateParams.cityname != undefined || $stateParams.locality != undefined || $stateParams.buliderId != undefined || $stateParams.reraId != undefined) {
        cityname = $stateParams.cityname;
        locality = $stateParams.locality;
        builder = $stateParams.buliderId;
        reraid = $stateParams.reraId;
        $cookies.put('city_data', cityname);
        $cookies.put('loc_data', locality);
        $cookies.put('builder_data', builder);
        $cookies.put('rera_data', reraid);
    } else {
        cityname = $cookies.get('city_data');
        locality = $cookies.get('loc_data');
        builder = $cookies.get('builder_data');
        reraid = $cookies.get('rera_data');
    }
    //console.log($stateParams.cityname + " " + $stateParams.locality + " " + $stateParams.buliderId + " " + $stateParams.reraId);
    
//    var locality = '';
//    var builder = '';
//    var reraid = '';
    //$scope.getProjects = function($stateParams.citynamecurrentcity){

    cityname=cityname =='null'?'':cityname;	
	$scope.city_name = cityname;
    // console.log(cityname + " " + locality + " " + builder + " " + reraid);
    $cookies.put("citydeta", cityname);
    
    
        
        offerFactory.getProjectDetails(function(success) {
            // console.log(success);
            var projectDetails = success.data.offer_deatils;
			
            // console.log(projectDetails);
			var properties =[];
            if (projectDetails.length > 0) {
                $scope.prop_val = true;
				for(var index=0; index<projectDetails.length;index++){
					if(projectDetails[index].offerPrice != null && projectDetails[index].offerPrice != ""){
						properties.push(projectDetails[index]);
					}
				}
                $scope.properties = properties;
				$window.sessionStorage.setItem('offers',JSON.stringify(properties));
				var cityname = $scope.properties[0].city_name;
				$scope.city_name = cityname;
                 $scope.currentPage = 0;
				  $scope.gap = Math.ceil(properties.length/$scope.itemsPerPage);
        		// now group by pages
       			 $scope.groupToPages();
            } else {
                $scope.prop_val = false;
            }
        }, function(error) {
            console.log(error);
        });
  
	
	
    //}

    /* $scope.properties = typeof $stateParams.param ==='object'?$stateParams.param:JSON.parse($stateParams.param);
    //$scope.properties = $stateParams.param;
    $scope.city_name = $scope.properties[0].city_name */
    ;


    $scope.user = {
        name: '',
        mobileno: ''
    }

    offerFactory.getBedroomDetails(function(success) {
        $scope.bedrooms = success.data.bedroom;

    });

    offerFactory.getBudget(function(success) {
        $scope.budgets = success.data.budget;

    });

    offerFactory.getPossission(function(success) {
        $scope.possissions = success.data.possission;
    });
    
    offerFactory.getcity(function(success) {
        $scope.cityDetails = success.data.locations;
    });
    
    var cityLocality = $cookies.get('city_id')!= undefined?$cookies.get('city_id'):1;
	
    offerFactory.getlocality({
        cityId: cityLocality
    }, function(success) {

        $scope.localities = success.data.details;
    });

    
    var page = $scope.user.origin = "Offers";
    $scope.callBack = function(user) {
        $scope.submit_offr = true;
    if (user) {
      var requestParam = {
                name: user.name,
                number: user.mobileno,
                pageorgin:page
            };
            networkFactory.addCallbackDetails(requestParam, function(success) {
                var status = success.data.status;
                if (status == "True") {
					
                }
            }, function(error) {
                
				$scope.msgs = "Sorry! we are unable to process your request";
                    $scope.open();
            });
        $scope.msgs = "We will intimate you soon.";
        $scope.open();
        $scope.user = '';
        $scope.submit_offr = false;
        angular.element("input[type='text']").val(null);
    }
    };
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
    
    $scope.sortorder = function (property) {
        
		if ($scope.orderBy == 'price-low-high') 
        {
			if(property.price_min.indexOf('L') > -1){
            return property.price_min.replace('L', '') * 100000;
        }else if(property.price_min.indexOf('Cr') > -1){
            return property.price_min.replace('Cr', '') * 10000000;
        }
		}
		if ($scope.orderBy == 'price-high-low') {
			if(property.price_min.indexOf('L') > -1){
            return -property.price_min.replace('L', '') * 100000;
        }else if(property.price_min.indexOf('Cr') > -1){
            return -property.price_min.replace('Cr', '') * 10000000;
        }
		}
		else return property.price_min;
	};
    
     $scope.getID = function(property) {
        $scope.enquiry = property; 
   }
    $scope.isSelected = function(property) {
      return $scope.enquiry === property;
    }
    
    $scope.minpriceclick = function(){
        // alert($scope.minprice.budget_value);
        $scope.modeldata = $scope.minprice.budget_IDPK;
        
    };
    $scope.maxpriceclick = function(){
        $scope.minprice_value = $scope.minprice.budget_value;
        $scope.maxprice_value = $scope.maxprice.budget_value;
        $scope.budget_show = false;
        $scope.bud_val_show = true;
    };
   
    
    $scope.filterProperties = function() {
//       $scope.city_name;
        var obj = {
            locality: '',
            buliderId: builder,
            bedroom: '',
            minprice: '',
            maxprice: '',
            possission: '',
            deatils:'',
            reraid: reraid,
            userId: userID
        };
		var city=$scope.locations != undefined ? $scope.locations.city:'';
        obj.bedroom = $scope.bedroom != undefined ? $scope.bedroom.bhk_IDPK : '';
        obj.minprice = $scope.minprice != undefined ? $scope.minprice.budget_IDPK : '';
        obj.maxprice = $scope.maxprice != undefined ? $scope.maxprice.budget_IDPK : '';
        obj.possission = $scope.possission != undefined ? $scope.possission.possission_IDPK : '';
        obj.deatils = $scope.deatils != undefined ? $scope.deatils.property_info_IDPK : '';
        
        offerFactory.getProjectDetailsWithFilter(city, obj, function(success) {
            // console.log(success);
            
            
			$window.sessionStorage.setItem('offers',JSON.stringify(success.data.offer_deatils));
			  var projectDetails= success.data.offer_deatils;
			  var properties=[];
			 for(var index=0; index<projectDetails.length;index++){
					if(projectDetails[index].offerPrice != null && projectDetails[index].offerPrice != ""){
						properties.push(projectDetails[index]);
					}
				}
				$scope.properties =properties;
				if ($scope.properties.length > 0) {
                $scope.prop_val = true;
               
            } else {
                $scope.prop_val = false;
            }
				$scope.currentPage = 0;
				  $scope.gap = Math.ceil(properties.length/$scope.itemsPerPage);
        		// now group by pages
       			 $scope.groupToPages();

        });
    };

	
	$scope.changepageSize = function(size){
		$scope.itemsPerPage =size.value;
		$scope.currentPage = 0;
		$scope.gap = Math.ceil($scope.properties.length/$scope.itemsPerPage);
        $scope.groupToPages();
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
            offerFactory.getUserrecentView({
                userId: client_Data[0].user_registration_IDPK,
                propId: propertyID
            }, function() {
                $state.goNewTab('property', {
                    param: propertyID
                });
            });
        }
    };

    $scope.userFavourite = function(prop, index) {
        //var clientData = $cookies.get('user');
        //var typs = $scope.property.user_fav;
        //$scope.property = {user_fav:''};
        if (clientData == null) {
            //$scope.msgs ="To make this as favourite property you need to login first";
            //$scope.open();
            // console.log($scope.properties);
            $window.sessionStorage.setItem('cityname', cityname);
            $window.sessionStorage.setItem('locality', locality);
            $window.sessionStorage.setItem('builder', builder);
            $window.sessionStorage.setItem('reraid', reraid);
            $cookies.put('propertyID', prop.property_info_IDPK);
            $cookies.put('type', 'city');
            $state.go('login');
        } else {
            var clients = JSON.parse(clientData);
            // console.log(clients[0].user_registration_IDPK);
            var requestData = {
                userId: clients[0].user_registration_IDPK,
                propId: prop.property_info_IDPK
            };
            offerFactory.getUserFavourite(requestData, function(success) {
                // console.log(success.data);
                // console.log(prop.user_fav);
                prop.user_fav ? $('#' + index).html('<img src="images/start_icon_2.png" alt=""/>') : $('#' + index).html('<img src="images/star_selected.png" alt=""/>');
                //$scope.property.user_fav = !prop.user_fav;
            }, function(error) {
                console.log(error);
            });
        }
    };


    $scope.resetDropDown = function() {
        if (angular.isDefined($scope.bedroom)) {
            delete $scope.bedroom;
        }
        if (angular.isDefined($scope.budget)) {
            delete $scope.budget;
        }
        if (angular.isDefined($scope.possission)) {
            delete $scope.possission;
        }
        if (angular.isDefined($scope.deatils)) {
            delete $scope.deatils;
        }
        $window.location.reload();
        //$scope.properties = JSON.parse($stateParams.param);

    };

    $scope.open = function(size) {
        var modalInstance;
        var modalScope = $scope.$new();
        modalScope.ok = function() {
            modalInstance.close(modalScope.selected);
        };
        modalScope.cancel = function() {
            modalInstance.dismiss('cancel');
        };

        modalInstance = $modal.open({
            template: '<my-modal></my-modal>',
            size: size,
            scope: modalScope
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

     $scope.range = function (size,start, end) {
        var ret = [];        
        // console.log(size,start, end);
                      
        if (size < end) {
            end = size;
            start = size-$scope.gap;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }        
         console.log(ret);        
        return ret;
    };
    

    // calculate page in place
    $scope.groupToPages = function() {
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.properties.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.properties[i]];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.properties[i]);
            }
        }
    };


    $scope.prevPage = function() {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };

    $scope.setPage = function() {
        $scope.currentPage = this.n;
    };

function loadCity(){
	networkFactory.getCityDetails(function(success) {
        // console.log(success.data);
		$scope.cities = success.data.locations;
		$scope.selectCity = $scope.cities [0];
		$scope.cityProperty = $scope.currentCity;
		$scope.getBuilders($scope.selectCity);
	});
}

	var map;
      function loadMap() {
		  var locations=JSON.parse($window.sessionStorage.getItem('offers'));
		  //alert("loaing");
        map = new google.maps.Map(document.getElementById('googleMap'), {
          center: {lat:12.972442, lng:77.580643},
          zoom: 10,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
        });
		loadmarker();
		 }
		function loadmarker(){
		var infowindow = new google.maps.InfoWindow();

  var marker, i;
	var locations=JSON.parse($window.sessionStorage.getItem('offers'));
	//alert(locations.length);
    for (i = 0; i < locations.length; i++) {  
	map.panTo(new google.maps.LatLng(locations[i].latitude, locations[i].longitude));
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
        map: map
      });
	
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i].address);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
		}

$scope.getBuilders = function(cities){

	 	 var ctrl = this;
         ctrl.client ={name:'', id:'',type:''};
	 	//var builder = $scope.currentCity;
		//alert(cities.city);
		networkFactory.getBuilderDetails({'city_id':cities.id},function(success){
			// console.log(success.data.autolist);
			$scope.autolist = success.data.autolist;
		});

}
$scope.setClientData = function(item){
		
			 if (item){
                    //    console.log(item);
                       $scope.builderData =item;
                        // console.log(item);
                     }
		
	};
$scope.getProjects = function(cities){
	//alert(cities.city);
		var propData = $scope.builderData;
		var requests = {locality:'',buliderId:'',reraId:''};
		if(propData!= undefined && propData.hasOwnProperty('type')){
				if(propData.type=='bulider_name') {requests.buliderId=propData.id}
				if(propData.type=='city_name'){requests.locality=propData.id}
				if(propData.type=='reraId'){requests.reraId=propData.id}
		}
		offerFactory.getProjectDetailsWithFilter(cities.city, requests, function(success) {
            // console.log(success);
			var projectDetails = success.data.offer_deatils;
            var properties =[];
            if (projectDetails.length > 0) {
                $scope.prop_val = true;
				for(var index=0; index<projectDetails.length;index++){
					if(projectDetails[index].offerPrice != null){
						properties.push(projectDetails[index]);
					}
				}
                $scope.properties = properties;
				$window.sessionStorage.setItem('offers',JSON.stringify(properties));
				
            } else {
                $scope.prop_val = false;
            }
			 //$scope.properties = success.data.deatils;
                 loadMap();
				

        });
		
		
		
	};
	
$scope.resetMapField = function(){
	 if (angular.isDefined($scope.bedtype)) {
            delete $scope.bedtype;
        }
        if (angular.isDefined($scope.budgettype)) {
            delete $scope.budgettype;
        }
        if (angular.isDefined($scope.possissiontype)) {
            delete $scope.possissiontype;
        }
	$scope.filtermapProperties();
};

$scope.filtermapProperties = function(){
 var obj = {
            locality: locality,
            buliderId: builder,
            bedroom: '',
            minprice: '',
            maxprice: '',
            possission: '',
            deatils:'',
            reraid: reraid,
            userId: userID
        };

        obj.bedroom = $scope.bedtype != undefined ? $scope.bedtype.bhk_IDPK : '';
        obj.minprice = $scope.budgettype != undefined ? $scope.budgettype.budget_IDPK : '';
        obj.possission = $scope.possissiontype != undefined ? $scope.possissiontype.possission_IDPK : '';
        obj.deatils = $scope.deatils != undefined ? $scope.deatils.property_info_IDPK : '';
        offerFactory.getProjectDetailsWithFilter($scope.city_name, obj, function(success) {
            var projectDetails = success.data.deatils;
            var properties =[];
            if (projectDetails.length > 0) {
                $scope.prop_val = true;
				for(var index=0; index<projectDetails.length;index++){
					if(projectDetails[index].offerPrice != null){
						properties.push(projectDetails[index]);
					}
				}
                $scope.properties = properties;
				$window.sessionStorage.setItem('offers',JSON.stringify(properties));
				
            } else {
                $scope.prop_val = false;
            }
			 //$scope.properties = success.data.deatils;
                 loadMap();
				

        });


}
	
     
	
	// $(function() {
	// 			 $('.open-popup').on('click',loadMap)
	// 			$(".open-popup").fullScreenPopup({
	// 				bgColor: '#fff'
	// 			});
	// 			loadCity();
				
	// 		});

    
	

});
//});