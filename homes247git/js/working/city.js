var cityapp = angular.module('cityApp', ['ui.bootstrap','modalApp','infinite-scroll','mapApp','propertyApp','sidebarApp']);

cityapp.factory('cityFactory', function(networking) 
{
    var factory = {};
    factory.getPropretiesByID = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/get_propertyById', requestData, callback);
    };
    
    factory.addCallbackDetails = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/callback', requestData, callback);
    };
    
    factory.getCallBackBasedOnProperty = function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/PropContactInfo', requestData, callback);
	};

    factory.getBedroomDetails = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/get_bedrooms', callback);
    };

    factory.getBudget = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/get_budget', callback);
    };
	
	factory.getsearchDetails = function(requestData,callback){
		 return networking.callServerForUrlEncondedGETRequest('/search/'+requestData, callback);
	};
	
    factory.getlocality = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/get_locality_basedLocation', requestData, callback);
    };

    factory.getPossission = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/get_possission', callback);
    };
    
    factory.getProjectcounts = function(url, requestData, callback) {
        return networking.callServerForUrlEncondedGetWithRequestData('/get_counts/' + url, requestData, callback);
    };

    factory.getProjectDetailsWithFilter = function(url, requestData, callback) {
        return networking.callServerForUrlEncondedGetWithRequestData('/search/' + url, requestData, callback);
    };

    factory.getUserrecentView = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/add_recent_view', requestData, callback);
    };

    factory.getUserFavourite = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/add_Favourite', requestData, callback);
    };

    return factory;
});

cityapp.filter('spaceless',function() {
    return function(input) {
        if (input) {
            return input.replace(/\s+/g, '-');    
        }
    }
});

cityapp.directive('clientAutoComplete', function($filter) {
    return {

        restrict: 'A',
        link: function(scope, elem, attrs) {
            elem.autocomplete({
                source: function(request, response) {

                    //term has the data typed by the user
                    var params = request.term;

                    //simulates api call with odata $filter
                    var data = scope.autolist;
                    scope.$watch('autolist', function(newValue, oldValue) {
                        // console.log(newValue);
                        // console.log(oldValue);
                        //var someVar = [Do something with someVar];

                        // so it will not trigger another digest 
                        //  angular.copy(someVar, $scope.someVar);

                    });
                    if (data) {
                        var result = $filter('filter')(data, {
                            name: params
                        });
                        angular.forEach(result, function(item) {
                            item['value'] = item['name'];
                        });
                    }
                    response(result);

                },
                minLength: 1,
                select: function(event, ui) {
                    //force a digest cycle to update the views
                    scope.$apply(function() {
                        scope.setClientData(ui.item);
                    });
                },

            });
        }

    };
});

cityapp.directive('onErrorSrc', function() {
    return {
        link: function(scope, element, attrs) {
          element.bind('error', function() {
            if (attrs.src != attrs.onErrorSrc) {
              attrs.$set('src', attrs.onErrorSrc);
            }
          });
        }
    }
});

cityapp.controller('cityCtrl', function($scope,$timeout,$http, cityFactory, propertyFactory,$interval,$rootScope, $stateParams, $state, urls,
    $modal, $log,$location, $cookies, $window, networkFactory) {
    // $cookies.set('key','others');
    // var linkprev = $cookies.get('city_data'); 
    // var target = "https://www.homes247.in/"+linkprev+"/property-sale";
    // var key    = "5c765659af3f3c52f0d9f8fb84ea294975f6b595d5308";
    // alert(target);
    // $.ajax(
    //     {
    // url: "https://api.linkpreview.net",
    // dataType: "jsonp",
    // data: {q: target, key: key},
    // success: function (response) {
    //     console.log(response);
    //         }
    //         });
    $scope.validLength = 9;
    $scope.cityname = true;
    var input = document.querySelector("#phno");
    window.intlTelInput(input, {
      initialCountry: "in",
      onlyCountries: ['AU', 'CA','DE','FR','IN','IT','MY','MV','MU','NZ','PH','QA','RU','SG','ZA','ES','LK','GB','US','AE'],
      separateDialCode: true,
      utilsScript: "./js/utils.js",
    });
    var enqinput = document.querySelector("#enqphno");
    window.intlTelInput(enqinput, {
        initialCountry: "in",
        onlyCountries: ['AU', 'CA','DE','FR','IN','IT','MY','MV','MU','NZ','PH','QA','RU','SG','ZA','ES','LK','GB','US','AE'],
        separateDialCode: true,
        utilsScript: "./js/utils.js",
      });

     angular.element($window).bind('scroll', function (e) {  
        // var cur = document.getElementsByClassName('intl-tel-input');
        var cur = angular.element(document.querySelector(".iti-container"));
        cur.remove();
        $(".iti-arrow").removeClass("up");
      });

$scope.clickedSomewhereElse = function(){
    $('body').removeClass('blurring'); 
  };

  $scope.Date = new Date();
$scope.budget_show = true;
$scope.bud_val_show = false;

    $scope.toggleSearch = function () {
        $('#budgetmodal').toggleClass('expanded');
        $('#budgetmodal').toggleClass('collapsed');
    };

    $scope.clickedSomewherecity = function(){
        $('#budgetmodal').addClass('collapsed');
        $('#budgetmodal').removeClass('expanded');
      };

$scope.filterloader = false;
    $('body').attr('id', '');
    $(function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        $('.ui.dropdown').dropdown();
        $('.ui.search.dropdown').dropdown({
            minCharacters : 3,
            useLabels: false
          });
        $('ui.price_filter.dropdown').dropdown({
            fullTextSearch: true
        })
        // $('.ui.budget_minprice.search.dropdown').dropdown('toggle');
        $('.ui.budget_minprice.search.dropdown').dropdown({
            // minCharacters : 1
            onChange: function() {
                $('.budget_minprice').removeClass('minbud');
                $('.budget_maxprice').addClass('maxbud');
                if($scope.maxprice_value != null){
                    $('#budgetmodal').addClass('collapsed');
                    $('#budgetmodal').removeClass('expanded');
                    $('.budget_minprice').addClass('minbud');
                    $('.budget_maxprice').removeClass('maxbud');
                }
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
               
            },
            forceSelection: false
        });

  
    });
    
//    if($scope.image.name.length == 0){
//    $scope.image.name.push("No Sessions this Day");
//}
    
            // $('.ui.modal.semant_modal').modal('hide');
            // $('.ui.modal.semant_modal').remove();
            // $('.ui.modal.semant_proprty_modal').modal('hide');
            // $('.ui.modal.semant_proprty_modal').remove();
            if (window.screen.width <= 680) { 
                $('.ui.modal.semant_modal').modal('hide');
                $('.ui.modal.semant_modal').remove();
                $('.ui.modal.semant_proprty_modal').modal('hide');
                $('.ui.modal.semant_proprty_modal').remove();
                $('.ui.modal.semant_city_modal').modal('hide');
                $('.ui.modal.semant_city_modal').remove();
              }
    
    //     var interval2;    
    
    //     interval2 =  $interval(function() {
    //      $('.ui.modal.semant_city_modal').modal({
    //             blurring: true,
    //             closable: true,
    //             observeChanges: false
    //     }).modal('show');
    // }, 180000);
    
//     $scope.pop_close = function(){
//         $interval.cancel(interval2);
//         var dereg2 = $rootScope.$on('$locationChangeSuccess', function() {
//     $interval.cancel(interval2);
//     dereg2();
//   });
        
    //    interval2 = $interval(function() {
    //      $('.ui.modal.semant_city_modal').modal({
    //             blurring: true,
    //             closable: true,
    //             observeChanges: false
    //     }).modal('show');
    // }, 180000);
    //     $("body").removeClass("dimmable");
    //     $("body").removeClass("blurring");
    //     $("body").removeClass("scrolling");
    // }
    
    $scope.getID = function(property) {
        $scope.enquiry = property; 
        $interval.cancel(interval2);
        var dereg3 = $rootScope.$on('$locationChangeSuccess', function() {
        $interval.cancel(interval2);
        dereg3();
                });
        interval2 = $interval(function() {
         $('.ui.modal.semant_city_modal').modal({
                blurring: true,
                closable: true,
                observeChanges: false
        }).modal('show');
    }, 3.6e+7);
   }
    
    $('.modal_close').on('click', function(e) {
        interval2 = $interval(function() {
         $('.ui.modal.semant_city_modal').modal({
                blurring: true,
                closable: true,
                observeChanges: false
        }).modal('show');
    }, 180000);
        
    });
    
    
    
//    setInterval(function() {
//        clearInterval(poptimer);
//    }, 15000);
    
//    poptimer =  setInterval(function() {
//         $('.ui.modal.semant_city_modal').modal({
//                blurring: true,
//                closable: true,
//                observeChanges: false
//        }).modal('show');
//        console.log('POP come')
//    }, 10000);
    
    
    
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
                $('.ui.modal.semant_city_modal').modal('hide');
                $('.ui.modal.semant_city_modal').remove();
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
    
    // cityFactory.getsearchDetails(function(success){
	// 	$scope.bedroombhk = success.data.deatils;
    //     $scope.city = success.data.deatils;
	// },function(error){
	// });
    
    $scope.sizeselect = [{
        value: 10
    }, {
        value: 20
    }];
   
    $scope.showLoader = true;
    
    
//    $(window).bind('scroll', function() {
//    if($(window).scrollTop() >= $('#parentdiv').offset().top + $('#parentdiv').outerHeight() - window.innerHeight) {
//            $scope.prprtylimit += 2;
//    }
//});
    
    
    
//    $scope.loadMore = function() {
//      var increamented = $scope.prprtylimit + 2;
//      $scope.prprtylimit = increamented > $scope.propertylists.length ? $scope.propertylists.length : increamented;
//    };
    $scope.sizevalue = $scope.sizeselect[0];
    $scope.itemsPerPage = $scope.sizevalue.value;
    $scope.pagedItems = [];
    $scope.pagedcities = [];
    $scope.currentPage = 0;
    $scope.properties = [];
    $scope.prop_val = true;
    $scope.gap = 0;
    $scope.sorterFunc = function(property){
    return parseInt(property.BHK);
};
//    $scope.sortorder = '';
    
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
//		else return property.price_min;
	};
    
    
//    BHK-FETCHING-STARTS
    
    var property_id;
	if($stateParams.param != undefined){
		property_id = $stateParams.param;
		$cookies.put('propId',property_id);
	}else{
		property_id=$cookies.get('propId');
	}
    
    // propertyFactory.getPropretiesByID({
    //     propId: property_id
    // }, function(success) {
	// 	console.log(success.data);
    //     if (success.data.hasOwnProperty('deatils')) {
    //         $scope.propDetails = success.data.deatils;
	// 		$scope.tab =  $scope.propDetails[0].BHK_Deatils[0].BHK;
      
    //     }
    // }, function(error) {
    //     console.log(error);
    // });
    
//    BHK-FETCHING-ENDS
    
    $scope.propertyimage = urls.imagesURL + "uploadPropertyImgs/";
    $scope.statusimages = urls.imagesURL + "propStatus/";
    $scope.citybanner = urls.imagesURL+"cities/"; 
    var clientData = $cookies.get('user');
    if (clientData != null) {
        var clients = JSON.parse(clientData);
        // console.log(clients[0].user_registration_IDPK);
        var userID = clients[0].user_registration_IDPK;
    }
    var cityname, locality, localityname, localitynameurl, builder, buldername, regionid, regionname, reraid, property, propertid, prprtylimit, prprtyrows;
    if ($stateParams.cityname != undefined ||   $stateParams.locality != undefined || 
        $stateParams.localityname != undefined || $stateParams.localitynameurl != undefined ||
        $stateParams.buliderId != undefined ||  $stateParams.regionid != undefined || 
        $stateParams.regionname != undefined ||  $stateParams.buldername != undefined || 
        $stateParams.reraId != undefined || $stateParams.propName != undefined || 
        $stateParams.propeId != undefined || $stateParams.limit != undefined || 
        $stateParams.limitrows != undefined ) {
        // $scope.cityname = true;
        
        // $scope.localityname = false;
        
        cityname = $stateParams.cityname;
        locality = $stateParams.locality;
        localityname = $stateParams.localityname;
        localitynameurl = $stateParams.localitynameurl;
        builder = $stateParams.buliderId;
        buldername = $stateParams.buldername;
        regionid = $stateParams.regionid;
        regionname = $stateParams.regionname;
        reraid = $stateParams.reraId;
        property = $stateParams.propName;
        propertid = $stateParams.propeId;
        prprtylimit = $stateParams.limit;
        prprtyrows = $stateParams.limitrows;
        $cookies.put('city_data', cityname);
        $cookies.put('loc_data', locality);
        $cookies.put('loc_name', localityname);
        $cookies.put('loc_nameurl', localitynameurl);
        $cookies.put('builder_data', builder);
        $cookies.put('builder_name', buldername);
        $cookies.put('region_id', regionid);
        $cookies.put('region_name', regionname);
        $cookies.put('rera_data', reraid);
        $cookies.put('prop_data', property);
        $cookies.put('propid_data', propertid);
        $cookies.put('prop_limit', prprtylimit);
        $cookies.put('prop_rows', prprtyrows);
    } else {
        cityname = $cookies.get('city_data');
        locality = $cookies.get('loc_data');
        localityname = $cookies.get('loc_name');
        localitynameurl = $cookies.get('loc_nameurl');
        builder = $cookies.get('builder_data');
        buldername = $cookies.get('builder_name');
        regionid = $cookies.get('region_id');
        regionname = $cookies.get('region_name');
        reraid = $cookies.get('rera_data');
        property = $cookies.get('prop_data');
        propertid = $cookies.get('propid_data');
        prprtylimit = $cookies.get('prop_limit');
        prprtyrows = $cookies.get('prop_rows');
    }

    /* var cityname= $stateParams.cityname==""?$cookies.get("citydeta"):$stateParams.cityname;
	$cookies.put("citydeta",$stateParams.cityname);
	//var cityname = $stateParams.cityname;
    $scope.city_name = cityname;
    var locality = $stateParams.locality;
    var builder = $stateParams.buliderId;
    var reraid = $stateParams.reraId;
    console.log($state.params); */
    prprtylimit = 0;
    prprtyrows = 4;
    // alert(cityname);
	cityname=cityname =='null'?'':cityname;	
    // $scope.city_name = cityname;

    // citynameurl=citynameurl =='null'?'':citynameurl;	
    var citynamefinal = cityname.charAt(0).toUpperCase() + cityname.slice(1)
    $scope.city_name = citynamefinal;

    localityname=localityname == 'null'?'':localityname;
    $scope.locality_name = localityname;
    $scope.localityname = true;
    if($scope.locality_name = localityname){
        $scope.cityname = false;
        $scope.localityname = true;
    }
    if($scope.locality_name = localitynameurl){
        // alert(localitynameurl);
        var spacing =  localitynameurl.replace(/-/g," ");
        String.prototype.toProperCase = function () {
            return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        };
        var finaltitle = spacing.toProperCase();
        finaltitle=finaltitle == 'null'?'':finaltitle;
        $scope.locality_name = finaltitle;
        if($scope.locality_name = finaltitle){
            $scope.cityname = false;
            $scope.buildersname = false;
            $scope.zones = false;
        }
    }

    buldername=buldername == 'null'?'':buldername;
    $scope.builder_name = buldername;
    $scope.buildersname = true;
    if($scope.builder_name = buldername){
        var buildspacing =  buldername.replace(/-/g," ");
        String.prototype.toProperCase = function () {
            return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        };
        var buildtitle = buildspacing.toProperCase();
        buildtitle=buildtitle == 'null'?'':buildtitle;
        $scope.builder_name = buildtitle;
        $scope.cityname = false;
        $scope.localityname = false;
        $scope.zones = false;
        $scope.buildersname = true;
    }

    regionname=regionname == 'null'?'':regionname;
    $scope.zone_name = regionname;
    $scope.zones = true;
    if($scope.zone_name = regionname){
        var regspace = regionname.replace(/-/g," ");
        String.prototype.toProperCase = function () {
            return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        };
        var regiontitle = regspace.toProperCase();
        regiontitle=regiontitle == 'null'?'':regiontitle;
        $scope.zone_name = regiontitle;
        $scope.cityname = false;
        $scope.localityname = false;
        $scope.buildersname = false;
        $scope.zones = true;
    }
   
    

    // $rootScope.title = cityname+" | Homes247";
    // console.log(cityname + " " +  locality + " " + localityname + " " + builder + " " + buldername + " " + reraid + " " + property + " " + propertid);
    $cookies.put("citydeta", cityname);
    // $cookies.put('loc_data', locality);
    // $cookies.put('loc_name', localityname);
	
	if (locality != "null" || localityname != "null" || regionid != "null" || builder != "null" || buldername != "null" || reraid != "null" || property != "null" || propertid != "null") {
        var requests = {
            locality: locality,
            localityname:localityname,
            buliderId: builder,
            buldername:buldername,
            regionid:regionid,
            reraId: reraid,
            propName: property,
            propeId: propertid,
//			 userId: ''
            userId: userID,
            limit: prprtylimit,
            limitrows: prprtyrows
        };
        
        
        // networkFactory.getProjectDetailsWithlimitFilter(cityname, requests, function(success) {
        //     console.log(success);
        //     var projectDetails = success.data.deatils;
          
        //     if (projectDetails != undefined)
		// 	  $window.sessionStorage.setItem('properties', JSON.stringify(projectDetails));
        //     if (projectDetails.length > 0) {
        //         $scope.prop_val = true;
        //         $scope.properties = projectDetails;
        //         $scope.pagedcities = success.data.deatils;
        //         $scope.propertylists = projectDetails;
        //         $scope.currentPage = 0;
        //         $scope.gap = Math.ceil(projectDetails.length / $scope.itemsPerPage);
        //         // now group by pages
        //         $scope.groupToPages();
        //     } else {
        //         $scope.prop_val = false;
        //     }

        // }, function(error) {
        //     console.log(error);
        // });

        // LOADMORE WITH FILTER FUNCTIONS

        cityFactory.getProjectcounts(cityname, requests, function(success) {
            var projectcounts = success.data.Counts;
            var propcounts = projectcounts[0].PropertyCounts;
            
        $scope.loadMore = function () {
            prprtylimit += 4;
            prprtyrows+4
            var requests = {
                locality: locality,
            buliderId: builder,
            buldername:buldername,
            regionid: regionid,
            reraId: reraid,
            propName: property,
            propeId: propertid,
            userId: userID,
            bedroom: '',
            minprice: '',
            maxprice: '',
            possission: '',
            limit: prprtylimit,
            limitrows: prprtyrows
            };
    
            requests.bedroom = $scope.bedroom != undefined ? $scope.bedroom.bhk_IDPK : '';
            requests.minprice = $scope.minprice != undefined ? $scope.minprice.budget_IDPK : '';
            requests.maxprice = $scope.maxprice != undefined ? $scope.maxprice.budget_IDPK : '';
            requests.possission = $scope.possission != undefined ? $scope.possission.possission_ID : '';
            requests.locality = $scope.locality != undefined ? $scope.locality.locality_IDPK : locality;
            // var limitreqst = requests.limit;
            // alert(limitreqst);
               
            var limitrequests = requests.limit;
                if(propcounts > limitrequests)
                {
                    $scope.showLoader = true;
                    cityFactory.getProjectDetailsWithFilter(cityname, requests, function(success) {
                        // alert(requests.limit);
                        // console.log("VALUE :",requests.limit);
                        $scope.showLoader = false;
                        // console.log(success);
                        var projectDetails = success.data.deatils;
                        // alert(projectDetails[0].city_name);
                        if (projectDetails != undefined)
                        $scope.showLoader = false;
                          $window.sessionStorage.setItem('properties', JSON.stringify(projectDetails));
                        if (projectDetails.length > 0) {
                            $scope.prop_val = true;
                            $scope.properties = projectDetails;
                            $scope.pagedcities = success.data.deatils;
                            $scope.propertylists = $scope.propertylists.concat(projectDetails);
                            $scope.currentPage = 0;
                            $scope.gap = Math.ceil(projectDetails.length / $scope.itemsPerPage);
                            // now group by pages
                            $scope.groupToPages();
                        } else {
                            $scope.prop_val = false;
                        }
            
                    }, function(error) {
                        console.log(error);
                    });
                }
            };
            $scope.minpriceclick = function(){
                $scope.modeldata = $scope.minprice.budget_IDPK;
                $scope.budget_show = false;
                $scope.bud_val_show = true;
                $scope.minprice_value = $scope.minprice.budget_value;
                $scope.maxprice_value = $scope.maxprice.budget_value;
                
                // alert($scope.minprice.budget_IDPK);
            };
            $scope.maxpriceclick = function(){
                $scope.modelmindata = $scope.maxprice.budget_IDPK;
                $scope.budget_show = false;
                $scope.bud_val_show = true;
                if($scope.minprice_value == null){
                    $scope.minprice_value = "1 L";
                }else{
                    $scope.maxprice_value = $scope.maxprice.budget_value;
                    $scope.minprice_value = $scope.minprice.budget_value;
                }
                $scope.maxprice_value = $scope.maxprice.budget_value;
                // alert($scope.maxprice.budget_IDPK);
            };
           
            $scope.filterProperties = function() {
                limitfilter = 0;
                limitprprtyrows = 4;
                $scope.filterloader = true;
                
                var obj = {
                    locality: locality,
                    buliderId: builder,
                    regionid: regionid,
                    propName: property,
        //            propeId: propertyid,
                    bedroom: '',
                    minprice: '',
                    maxprice: '',
                    possission: '',
                    reraid: reraid,
                    userId: userID,
                    limit: limitfilter,
                    limitrows: limitprprtyrows
                };
                
                // alert(propcounts);
                
                // if(propcounts = limitrowrqst){

                //     $scope.loadMore = function () {
                //         return;
                //     }

                // }else{

                // }
        
                obj.bedroom = $scope.bedroom != undefined ? $scope.bedroom.bhk_IDPK : '';
                obj.minprice = $scope.minprice != undefined ? $scope.minprice.budget_IDPK : '';
                obj.maxprice = $scope.maxprice != undefined ? $scope.maxprice.budget_IDPK : '';
                obj.possission = $scope.possission != undefined ? $scope.possission.possission_ID : '';
                obj.locality = $scope.locality != undefined ? $scope.locality.locality_IDPK : locality;
                cityFactory.getProjectDetailsWithFilter($scope.city_name, obj, function(success) {
                    // console.log(success);
                    // alert(obj.limit);
                    if (success.data.deatils.length > 0) {
                        $scope.prop_val = true;
                        $scope.filterloader = false;
                    } else {
                        $scope.prop_val = false;
                        $scope.filterloader = false;
                    }
                    $window.sessionStorage.setItem('properties', JSON.stringify(success.data.deatils));
                    $scope.properties = success.data.deatils;
                    $scope.propertylists = success.data.deatils;
                    $scope.currentPage = 0;
                    $scope.gap = Math.ceil($scope.properties.length / $scope.itemsPerPage);
                    // now group by pages
                    $scope.groupToPages();
        
                });
                cityFactory.getProjectcounts($scope.city_name, obj, function(success) {
                    // console.log(success);
                    var projectcounts = success.data.Counts;
                    var filtercounts = projectcounts[0].PropertyCounts;
                    // alert(filtercounts);
                    $scope.loadMore = function () {
                        $scope.showLoader = true;
                        limitfilter += 4;
                        var obj = {
                            locality: locality,
                            buliderId: builder,
                            regionid: regionid,
                            propName: property,
                //            propeId: propertyid,
                            bedroom: '',
                            minprice: '',
                            maxprice: '',
                            possission: '',
                            reraid: reraid,
                            userId: userID,
                            limit: limitfilter,
                            limitrows: limitprprtyrows
                        };
                        var limitrowrqst = obj.limit;
                        obj.bedroom = $scope.bedroom != undefined ? $scope.bedroom.bhk_IDPK : '';
                    obj.minprice = $scope.minprice != undefined ? $scope.minprice.budget_IDPK : '';
                    obj.maxprice = $scope.maxprice != undefined ? $scope.maxprice.budget_IDPK : '';
                    obj.possission = $scope.possission != undefined ? $scope.possission.possission_ID : '';
                    obj.locality = $scope.locality != undefined ? $scope.locality.locality_IDPK : locality;
                        
                    if(filtercounts > limitrowrqst){
                    cityFactory.getProjectDetailsWithFilter($scope.city_name, obj, function(success) {
                        // console.log(success);
                        // alert(obj.limit);
                        $scope.showLoader = false;
                        if (success.data.deatils.length > 0) {
                            $scope.prop_val = true;
                            $scope.filterloader = false;
                        } else {
                            $scope.prop_val = false;
                            $scope.filterloader = false;
                        }
                        var projectDetails = success.data.deatils;
                        $window.sessionStorage.setItem('properties', JSON.stringify(projectDetails));
                        $scope.properties = projectDetails;
                        $scope.propertylists = $scope.propertylists.concat(projectDetails);
                        $scope.currentPage = 0;
                        $scope.gap = Math.ceil($scope.properties.length / $scope.itemsPerPage);
                        // now group by pages
                        $scope.groupToPages();
            
                    });
                }else{
                    $scope.showLoader = false;
                }
                    };
                    if (success.data.Counts.length > 0) {
                        $scope.prop_val = true;
        
                    } else {
                        $scope.prop_val = false;
                    }
                    $window.sessionStorage.setItem('prprtyname', JSON.stringify(success.data.Counts));
                    $scope.prprtyname = success.data.Counts;
        //            $scope.propertylists = success.data.deatils;
        //            $scope.currentPage = 0;
        //            $scope.gap = Math.ceil($scope.prprtyname.length / $scope.itemsPerPage);
        //            // now group by pages
        //            $scope.groupToPages();
                   
        
                });
            };
        },function(error) {
                console.log(error);
            });

        // LOADMORE WITH FILTER FUNCTIONS
            
            // console.log("VALUE :",limit);
            
        

//    $timeout(function() {
    cityFactory.getProjectDetailsWithFilter(cityname, requests, function(success) {
            // alert(requests.limit);
            
            $scope.showLoader = false;
            // console.log(success);
            var projectDetails = success.data.deatils;
            
            // alert(projectDetails.length);
            if (projectDetails != undefined)
			  $window.sessionStorage.setItem('properties', JSON.stringify(projectDetails));
            if (projectDetails.length > 0) {
                $scope.prop_val = true;
                $scope.properties = projectDetails;
                $scope.pagedcities = success.data.deatils;
                $scope.propertylists = projectDetails;
                $scope.currentPage = 0;
                $scope.gap = Math.ceil(projectDetails.length / $scope.itemsPerPage);
                // now group by pages
                $scope.groupToPages();
            } else {
                $scope.prop_val = false;
            }

        }, function(error) {
            console.log(error);
        });
//        }, 5000);
        cityFactory.getProjectcounts(cityname, requests, function(success) {
            // console.log(success);
            var projectDetails = success.data.Counts;
            // alert(projectDetails[0].PropertyCounts);
            if (projectDetails != undefined)
                $window.sessionStorage.setItem('prprtyname', JSON.stringify(projectDetails));
            if (projectDetails.length > 0) {
                $scope.prop_val = true;
                $scope.prprtyname = projectDetails;
                
            }else{
                 $scope.prop_val = false;
            }

    },function(error) {
            console.log(error);
        });
        
        
        
    } else {
        
        // networkFactory.getProjectDetailsWithlimitFilter(cityname,  {
        //     userId: ''//userID
        // },  function(success) {
        //     console.log(success);
        //     var projectDetails = success.data.deatils;
        //     $window.sessionStorage.setItem('properties', JSON.stringify(projectDetails));
        //     console.log(projectDetails);
        //     if (projectDetails.length > 0) {
        //         $scope.prop_val = true;
        //         $scope.properties = projectDetails;
        //         $scope.propertylists = projectDetails;
        //         $scope.currentPage = 0;
        //         $scope.gap = Math.ceil(projectDetails.length / $scope.itemsPerPage);
        //         // now group by pages
        //         $scope.groupToPages();
        //     } else {
        //         $scope.prop_val = false;
        //     }

        // }, function(error) {
        //     console.log(error);
        // });
        
//        $timeout(function() {
    cityFactory.getProjectDetailsWithFilter(cityname,  {
            userId: ''//userID
        },  function(success) {
//            alert("api loaded");
            // $scope.loadMore = function () {
            //     $scope.prprtylimit += 2;
            // };
            // $scope.showLoader = false;
            // console.log(success);
            var projectDetails = success.data.deatils;
            $window.sessionStorage.setItem('properties', JSON.stringify(projectDetails));
            // console.log(projectDetails);
            if (projectDetails.length > 0) {
                $scope.prop_val = true;
                $scope.properties = projectDetails;
                $scope.propertylists = projectDetails;
                $scope.currentPage = 0;
                $scope.gap = Math.ceil(projectDetails.length / $scope.itemsPerPage);
                // now group by pages
                $scope.groupToPages();
            } else {
                $scope.prop_val = false;
            }

        }, function(error) {
            console.log(error);
        });
//        }, 5000);
        cityFactory.getProjectcounts(cityname, {
            userId: ''
        }, function(success){
            // console.log(success);
            var projectDetails = success.data.Counts;
            $window.sessionStorage.setItem('prprtyname', JSON.stringify(projectDetails));
            // console.log(projectDetails);
            if (projectDetails.length > 0) {
            $scope.prop_val = true;
            $scope.prprtyname = projectDetails;
            }else{
                scope.prop_val = false;
            }
    },function(error) {
            console.log(error);
        });
    }
	
	
    //}

    /* $scope.properties = typeof $stateParams.param ==='object'?$stateParams.param:JSON.parse($stateParams.param);
    //$scope.properties = $stateParams.param;
    $scope.city_name = $scope.properties[0].city_name */

    $scope.user = {
        name: '',
        mobileno: ''
    }
    
    

    cityFactory.getBedroomDetails(function(success) {
        $scope.bedrooms = success.data.bedroom;

    });

    cityFactory.getBudget(function(success) {
        $scope.budgets = success.data.budget;

    });

    cityFactory.getPossission(function(success) {
        $scope.possissions = success.data.possission;
    });
    var cityLocality = $cookies.get('city_id')!= undefined?$cookies.get('city_id'):1;
    
    var zoneid = $cookies.get('region_id')
    // alert(zoneid);
	
    cityFactory.getlocality({cityId: cityLocality,zone: zoneid}, function(success) 
    {

        $scope.localities = success.data.details;
        // var localities = $scope.localities;
        // alert(localities.locality_name);
        // console.log("BASEDLOCALITY:",localities.locality_name)

    });
    var page = $scope.user.origin = citynamefinal + "City";
    $scope.callBack = function(user) {
        $scope.submit_city = true;
    if (user) {
      var requestParam = {
                name: user.name,
                number: user.mobileno,
                pageorgin: page
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
        $scope.submit_city = false;
        angular.element("input[type='text']").val(null);
    }
    };
    
    
    $scope.isSelected = function(property) {
      return $scope.enquiry === property;
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
//        $('body').removeClass('modal-open')
//        $('.modal-backdrop').remove()
//		$('#myModal_city').modal().remove();
		
		angular.element("input[type='text']").val(null); 
    }
    };
    
//     cityFactory.getProjectcounts(cityname, requests, function(success) {
//         var projectcounts = success.data.Counts;
//         var propcounts = projectcounts[0].PropertyCounts;
//         // alert(propcounts);
//     $scope.filterProperties = function() {
//         $scope.filterloader = true;
//         var obj = {
//             locality: locality,
//             buliderId: builder,
//             propName: property,
// //            propeId: propertyid,
//             bedroom: '',
//             minprice: '',
//             maxprice: '',
//             possission: '',
//             reraid: reraid,
//             userId: userID,
//             limit: prprtylimit,
//             limitrows: propcounts
//         };

//         obj.bedroom = $scope.bedroom != undefined ? $scope.bedroom.bhk_IDPK : '';
//         obj.minprice = $scope.minprice != undefined ? $scope.minprice.budget_IDPK : '';
//         obj.maxprice = $scope.maxprice != undefined ? $scope.maxprice.budget_IDPK : '';
//         obj.possission = $scope.possission != undefined ? $scope.possission.possission_ID : '';
//         obj.locality = $scope.locality != undefined ? $scope.locality.locality_IDPK : locality;
        
//         cityFactory.getProjectDetailsWithFilter($scope.city_name, obj, function(success) {
//             console.log(success);
//             // alert(obj.limit);
//             if (success.data.deatils.length > 0) {
//                 $scope.prop_val = true;
//                 $scope.filterloader = false;
//             } else {
//                 $scope.prop_val = false;
//                 $scope.filterloader = false;
//             }
//             $window.sessionStorage.setItem('properties', JSON.stringify(success.data.deatils));
//             $scope.properties = success.data.deatils;
//             $scope.propertylists = success.data.deatils;
//             $scope.currentPage = 0;
//             $scope.gap = Math.ceil($scope.properties.length / $scope.itemsPerPage);
//             // now group by pages
//             $scope.groupToPages();

//         });
//         cityFactory.getProjectcounts($scope.city_name, obj, function(success) {
//             console.log(success);
//             if (success.data.Counts.length > 0) {
//                 $scope.prop_val = true;

//             } else {
//                 $scope.prop_val = false;
//             }
//             $window.sessionStorage.setItem('prprtyname', JSON.stringify(success.data.Counts));
//             $scope.prprtyname = success.data.Counts;
// //            $scope.propertylists = success.data.deatils;
// //            $scope.currentPage = 0;
// //            $scope.gap = Math.ceil($scope.prprtyname.length / $scope.itemsPerPage);
// //            // now group by pages
// //            $scope.groupToPages();
           

//         });
//     };
// });

    $scope.changepageSize = function(size) {
        $scope.itemsPerPage = size.value;
        $scope.currentPage = 0;
        $scope.gap = Math.ceil($scope.properties.length / $scope.itemsPerPage);
        $scope.groupToPages();
    };

    $scope.getPropertyID = function(propertyID) {

        if (clientData == null) {
            //$cookies.put('recentView', propertyID);
            //$state.go('login');
            // $state.goNewTab('property', {
            //     param: propertyID
            // });
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

    $scope.userFavourite = function(prop, index) {
        var clientData = $cookies.get('user');
//        var typs = $scope.property.user_fav;
        //$scope.property = {user_fav:''};
        if (clientData == null) {
            //$scope.msgs ="To make this as favourite property you need to login first";
            //$scope.open();
//            console.log($scope.properties);
//            $window.sessionStorage.setItem('cityname', cityname);
//            $window.sessionStorage.setItem('locality', locality);
//            $window.sessionStorage.setItem('builder', builder);
//            $window.sessionStorage.setItem('reraid', reraid);
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
            cityFactory.getUserFavourite(requestData, function(success) {
                // console.log(success.data);
//                console.log(prop.user_fav);
                prop.user_fav ? $('#' + index).html('<img src="images/start_icon_2.png" alt=""/>') : $('#' + index).html('<img src="images/star_selected.png" alt=""/>');
//                $scope.property.user_fav = !prop.user_fav;
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
        if (angular.isDefined($scope.locality)) {
            delete $scope.locality;

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

        modalInstance.result.then(function(selectedItem){
            $scope.selected = selectedItem;
        }, function(){
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.range = function(size, start, end) {
        var ret = [];
        //console.log(size,start, end);

        if (size < end) {
            end = size;
            start = size - $scope.gap;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        //console.log(ret);        
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
            document.body.scrollTop = 200;
            document.documentElement.scrollTop = 200;
        }
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
            document.body.scrollTop = 200;
            document.documentElement.scrollTop = 200;
        }
    };

    $scope.setPage = function() {
        $scope.currentPage = this.n;
        document.body.scrollTop = 200;
        document.documentElement.scrollTop = 200;
    };

    /* $scope.mapview = function(){
    	$state.go('map');
    }; */
    // function loadCity() {
    //     networkFactory.getCityDetails(function(success) {
    //         // console.log(success.data);
    //         $scope.cities = success.data.locations;
    //         $scope.selectCity = $scope.cities[0];
    //         //$scope.cityProperty = $scope.currentCity;
    //         $scope.getBuilders($scope.selectCity);
    //     });
    // }

    $scope.getBuilders = function(cities) {

        var ctrl = this;
        ctrl.client = {
            name: '',
            id: '',
            type: ''
        };
        //var builder = $scope.currentCity;
        //alert(cities.city);
        networkFactory.getBuilderDetails({
            'city_id': cities.id
        }, function(success) {
            // console.log(success.data.autolist);
            $scope.autolist = success.data.autolist;
        });

    }

    var map;

    function loadMap() {
        var locations = JSON.parse($window.sessionStorage.getItem('properties'));
        //alert("loaing");
        map = new google.maps.Map(document.getElementById('googleMap'), {
            center: {
                lat: 12.972442,
                lng: 77.580643
            },
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        loadmarker();
    }

    function loadmarker() {
        var infowindow = new google.maps.InfoWindow();

        var marker, i;
        var locations = JSON.parse($window.sessionStorage.getItem('properties'));
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

    
    $scope.setClientData = function(item) {

        if (item) {
            // console.log(item);
            $scope.builderData = item;
        }

    };
    $scope.getProjects = function(cities) {
        //alert(cities.city);
        var propData = $scope.builderData;
        var requests = {
            locality: '',
            buliderId: '',
            regionid: '',
            reraId: '',
            propName: '',
            propeId:''
        };
        if (propData != undefined && propData.hasOwnProperty('type')) {
            if (propData.type == 'bulider_name') {
                requests.buliderId = propData.id
            }
            if (propData.type == 'regions') {
                requests.regionid = propData.id
            }
            if (propData.type == 'city_name') {
                requests.locality = propData.id
            }
            if (propData.type == 'reraId') {
                requests.reraId = propData.id
            }
            if (propData.type == 'property_name') {
                requests.propName = propData.id
            }
            if (propData.type == 'propertyId') {
                requests.propeId = propData.id
            }
        }
        cityFactory.getProjectDetailsWithFilter(cities.city, requests, function(success) {
            // console.log(success);
            if (success.data.deatils.length > 0) {
                $scope.prop_val = true;

            } else {
                $scope.prop_val = false;
            }
            $window.sessionStorage.setItem('properties', JSON.stringify(success.data.deatils));
            //$scope.properties = success.data.deatils;
            loadMap();

        });
         cityFactory.getProjectcounts(cities.city, requests, function(success) {
            // console.log(success);
            if (success.data.Counts.length > 0) {
                $scope.prop_val = true;

            } else {
                $scope.prop_val = false;
            }
            $window.sessionStorage.setItem('prprtyname', JSON.stringify(success.data.Counts));
            //$scope.properties = success.data.deatils;
            loadMap();

        });

    };

});