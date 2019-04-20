//(function(){
var propertyapp = angular.module('propertyApp', ['duScroll','slickCarousel','rzModule','ngDonut','cityApp','ui.bootstrap','modalApp']);
propertyapp.factory('propertyFactory', function(networking) {
    var factory = {};
    factory.getPropretiesByID = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/get_propertyById', requestData, callback);
    };
    
    factory.getProjectDetails = function(requestData,callback){
		 return networking.callServerForUrlEncondedGETRequest('/search', callback);
	};

    factory.addCallbackDetails = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/callback', requestData, callback);
    };
	factory.getCallBackBasedOnProperty = function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/PropContactInfo', requestData, callback);
	};
	
	factory.getSimilarProperty = function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/get_similar_prop',requestData,callback);
	}
	
    return factory;
});

app.run(function($rootScope) {
  $rootScope.$on("$locationChangeStart", function(event, next, current) {
    
  });
  
});


propertyapp.filter('unique', function() {
   // we will return a function which will take in a collection
   // and a keyname
   return function(collection, keyname) {
      // we define our output and keys array;
      var output = [], 
          keys = [];
      
      // we utilize angular's foreach function
      // this takes in our original collection and an iterator function
      angular.forEach(collection, function(item) {
          // we check to see whether our object exists
          var key = item[keyname];
          // if it's not already part of our keys array
          if(keys.indexOf(key) === -1) {
              // add it to our keys array
              keys.push(key); 
              // push this item to our final output array
              output.push(item);
          }
      });
      // return our array which should be devoid of
      // any duplicates
      return output;
   };
});

propertyapp.directive('onErrorSrc', function() {
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

propertyapp.directive('myRepeatDirective', function() {
  return function(scope, element, attrs) {
    angular.element(element).css('color','blue');
	
    if (scope.$last){
	  var firstSlides = $("#slideshow-list li"),
			secondSlides = $("#image-list li"),
			nbSlides = firstSlides.length,
			slideTime = 3000,
			nextSlide = 0,
			timer;
			
			 function slideshow() {

     secondSlides.eq(nextSlide).addClass('active').siblings().removeClass('active');
     firstSlides.eq(nextSlide).fadeIn().delay(2000).fadeOut();
     nextSlide = (nextSlide + 1) % nbSlides;
     timer = setTimeout(slideshow, slideTime);
	
 }
 slideshow();
 
    }
  };
});
propertyapp.directive("preventTypingGreater", function() {
  return {
    link: function(scope, element, attributes) {
      var oldVal = null;
      element.on("keydown keyup", function(e) {
    if (Number(element.val()) > Number(attributes.max) &&
          e.keyCode != 46 // delete
          &&
          e.keyCode != 8 // backspace
        ) {
          e.preventDefault();
          element.val(oldVal);
        } else {
          oldVal = Number(element.val());
        }
      });
    }
  };
});
propertyapp.directive('validNumber', function() {
      return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
          if(!ngModelCtrl) {
            return; 
          }

          ngModelCtrl.$parsers.push(function(val) {
            if (angular.isUndefined(val)) {
                var val = '';
            }
            
            var clean = val.replace(/[^-0-9\.]/g, '');
            var negativeCheck = clean.split('-');
			var decimalCheck = clean.split('.');
            if(!angular.isUndefined(negativeCheck[1])) {
                negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                clean =negativeCheck[0] + '-' + negativeCheck[1];
                if(negativeCheck[0].length > 0) {
                	clean =negativeCheck[0];
                }
            }
              
            /*if(!angular.isUndefined(decimalCheck[1])) {
                decimalCheck[1] = decimalCheck[1].slice(0,2);
                clean =decimalCheck[0] + '.' + decimalCheck[1];
            }*/

            if (val !== clean) {
              ngModelCtrl.$setViewValue(clean);
              ngModelCtrl.$render();
            }
            return clean;
          });

          element.bind('keypress', function(event) {
            if(event.keyCode === 32) {
              event.preventDefault();
            }
          });
        }
      };
    });
//propertyapp.filter('unique', function() {
//   return function(collection, keyname) {
//      var output = [], 
//          keys = [];
//
//      angular.forEach(collection, function(item) {
//          var key = item[keyname];
//          if(keys.indexOf(key) === -1) {
//              keys.push(key);
//              output.push(item);
//          }
//      });
//      return output;
//   };
//});

propertyapp.filter("trust", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);

propertyapp.controller('propertyCtrl', function($scope,$window, $location, $rootScope,$interval, $timeout, $uibModal, propertyFactory, 
													$stateParams,urls,$modal, $log,networkFactory,$cookies) {
    
  $scope.validLength = 9;

  $(function() {

    var input = document.querySelector("#prptyphno");
     
    window.intlTelInput(input, {
      // allowDropdown: false,
      // autoHideDialCode: false,
      // autoPlaceholder: "off",
      // dropdownContainer: document.body,
      // excludeCountries: ["us"],
      // formatOnDisplay: false,
      // geoIpLookup: function(callback) {
      //   $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
      //     var countryCode = (resp && resp.country) ? resp.country : "";
      //     callback(countryCode);
      //   });
      // },
      // hiddenInput: "full_number",
      initialCountry: "in",
      onlyCountries: ['AU', 'CA','DE','FR','IN','IT','MY','MV','MU','NZ','PH','QA','RU','SG','ZA','ES','LK','GB','US','AE'],
      // localizedCountries: { 'de': 'Deutschland' },
      // nationalMode: false,
      
      // placeholderNumberType: "MOBILE",
      // preferredCountries: ['cn', 'jp'],
      separateDialCode: true,
      utilsScript: "./js/utils.js",
    });

    var propinput = document.querySelector("#enqphno");
    window.intlTelInput(propinput, {
        initialCountry: "in",
        onlyCountries: ['AU', 'CA','DE','FR','IN','IT','MY','MV','MU','NZ','PH','QA','RU','SG','ZA','ES','LK','GB','US','AE'],
        separateDialCode: true,
        utilsScript: "./js/utils.js",
      });
      
      

  });
 
     

      angular.element($window).bind('scroll', function (e) {  
        // var cur = document.getElementsByClassName('intl-tel-input');
        var cur = angular.element(document.querySelector(".iti-container"));
        cur.remove();
        $(".iti-arrow").removeClass("up");
      });
                          

    $scope.tab = 1;
     $scope.setTab = function(newTab){
      $scope.tab = newTab;
    };
    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };
    


    $scope.numLimit=200;
     
    $scope.showMsgs = false;
//    $scope.hidden = true;
    $scope.interestpayable = 0;
    $scope.totalAmount = 0;
    $scope.monthlyAmount = 0;
     $scope.term = 0;
    $scope.quantity1 = 3;
    $scope.quantity2 = 3;
    $scope.quantity3 = 3;
    $scope.quantity4 = 3;
    $scope.quantity5 = 3;
    $scope.plotqty = 3;

    $scope.city_name = "Kerala";

    
    
//    Range-Slider-Starts
//    Range-Slider-Ends
//    DO-NUT-CHART-STARTS
    
    $scope.getID = function(propDetail) {
         $scope.enquiry = propDetail;
         $scope.enquirymodel = propDetail;
   }
    
    $scope.selectedModel = {};
    $scope.setValues = function setValues() {
            $scope.emis = [
                { name: 'Interest Pay', value: 0 },
                { name: 'Total Capacity', value: 9999999 },
            ];
        };
    
    // $('.ui.modal.semant_city_modal').modal('hide');
    // $('.ui.modal.semant_city_modal').remove();
    // $('.ui.modal.semant_modal').modal('hide');
    // $('.ui.modal.semant_modal').remove();
    
    // var interval3;
    
    // interval3 = $interval(function() {
    //      $('.ui.modal.semant_proprty_modal').modal({
    //             blurring: true,
    //             closable: true,
    //             observeChanges: false
    //     }).modal('show');
    // }, 180000);
    
    // $scope.pop_close = function(){
    //     $interval.cancel(interval3);
    //     var dereg3 = $rootScope.$on('$locationChangeSuccess', function() {
    //     $interval.cancel(interval3);
    //     dereg3();
    //             });
    //    interval3 = $interval(function() {
    //      $('.ui.modal.semant_proprty_modal').modal({
    //             blurring: true,
    //             closable: true,
    //             observeChanges: false
    //     }).modal('show');
    // }, 180000); // milliseconds
    //     $("body").removeClass("dimmable");
    //     $("body").removeClass("blurring");
    //     $("body").removeClass("scrolling");
         
    // }
    
    $scope.lightbox_open = function(){
        document.body.style.overflow="hidden";
        // document.getElementsByTagName('html')[0].style.overflow="hidden";
        $interval.cancel(interval3);
        var dereg3 = $rootScope.$on('$locationChangeSuccess', function() {
        $interval.cancel(interval3);
        dereg3();
                });
        interval3 = $interval(function() {
         $('.ui.modal.semant_proprty_modal').modal({
                blurring: true,
                closable: true,
                observeChanges: false
        }).modal('show');
    }, 3.6e+7);   
    }
    
    $('#lightboxOverlay').on('click', function(e) {
        document.body.style.overflow="visible";
        document.getElementsByTagName('html')[0].style.overflow="visible";
         interval3 = $interval(function() {
         $('.ui.modal.semant_proprty_modal').modal({
                blurring: true,
                closable: true,
                observeChanges: false
        }).modal('show');
    }, 180000);
        });
    $('#lightbox').on('click', function(e) {
        document.body.style.overflow="visible";
        document.getElementsByTagName('html')[0].style.overflow="visible";
         interval3 = $interval(function() {
         $('.ui.modal.semant_proprty_modal').modal({
                blurring: true,
                closable: true,
                observeChanges: false
        }).modal('show');
    }, 180000);
        });
    $('.lb-close').on('click', function(e) {
        document.body.style.overflow="visible";
        document.getElementsByTagName('html')[0].style.overflow="visible";
        interval3 = $interval(function() {
         $('.ui.modal.semant_proprty_modal').modal({
                blurring: true,
                closable: true,
                observeChanges: false
        }).modal('show');
    }, 180000);
        
    });
    
    
    
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
                $('.ui.modal.semant_proprty_modal').modal('hide');
                $('.ui.modal.semant_proprty_modal').remove();
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
    

    
    $scope.sorterFunc = function(property){
    return parseInt(property.BHK);
};
    $scope.emis = [];
    $timeout(function timeout() {
            $scope.setValues();
        }, 1000);
    $scope.openTooltip = function openTooltip(model) {
            $scope.selectedModel = model;
        };
    $scope.closeTooltip = function closeTooltip() {
            $scope.selectedModel = {};
        };
    $scope.donutColours = ['#0A3544', '#E4642D'];
    
//    DO-NUT-CHART-ENDS
    
    $scope.limit = 1;
   $scope.slider_ticks_values_at = {
    options: {
    ceil: 99999999,
//    step: 10000,
//    showTicks: true,
    },
  }
    $scope.emi = {
        term:0,
    }
    $scope.customSlider = {
        term:0,
    options: {
    floor: 0,
    ceil: 35,
    step: 1,
//    showTicksValues: true,
    },
  }
//    var formatToPercentage = function(value) {
//          return value + '%'
//        }
//  $scope.percentages = {
//      low: 0,
//      options: {
//        floor: 5,
//        ceil: 15,
//        step: 0.1,
//        precision: 2,
//        showTicksValues: true,
//        translate: formatToPercentage,
//        showSelectionBar: true,
//  },
//  }
    
        
    $(function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        $('.ui.dropdown').dropdown();
        $scope.selecteddata={
    'Type':{
      'MaxLength':8
    }
  }
        $scope.selecteddate={
    'Type':{
      'MaxLength':2
    }
  }
        $scope.selectedpercent={
            'Type':{
                'MaxLength':4
            }
        }

        //        SLICK-SIMILAR-PROJECT
        $scope.slickConfigsimilLoaded = true;
        $scope.slickConfig2Loaded = true;
        $scope.slickConfig3Loaded = true;
        //        SLICK-SIMILAR-PROJECT
		
//        SLICK-SIMILAR-PROJECT
//        SLICK-SIMILAR-PROJECT
        });
	

        
	//$cookies.set('key','others');
    
	$scope.ph_numbr = /^\+?\d{10}$/;
	$scope.propertyimage=urls.imagesURL+"uploadPropertyImgs/";
	$scope.uploadBHKImages = urls.imagesURL+"uploadBHKImgs/";
	$scope.amenitesImages = urls.imagesURL+"amenites/";
	$scope.bankImages = urls.imagesURL+"banks/";
	$scope.masterimages = urls.imagesURL+"masterImgs/";
    
  var property_id;
  var property_name;
	if($stateParams.param != undefined){
    property_id = $stateParams.param;
    property_name = $stateParams.propName;
    $cookies.put('propId',property_id);
    $cookies.put('propName',property_name);
	}else{
    property_id=$cookies.get('propId');
    property_name=$cookies.get('propName');
	}
	
	//var property_id=paramRequest.get();
    $scope.user = {
        name: '',
        mobileno: ''
    };

    
     $scope.enquiry = {
        name: '',
        mobileno: ''
    };
    
    $scope.enquirymodel = {
        uname: '',
        umobileno: ''
    };

	
    propertyFactory.getPropretiesByID({
        propId: property_id,
        propName: property_name
    }, function(success) {
		// console.log(success.data);
        if (success.data.hasOwnProperty('deatils')) {
            $scope.propDetails = success.data.deatils;
            var localityurl = $stateParams.locality;
            var cityurl = $stateParams.cityname;
            var propurl = $stateParams.propName;
            var spacing = localityurl.replace(/-/g," ");
            String.prototype.toProperCase = function () {
              return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            };
            var urlcap = spacing.toProperCase();
            var url = $location.path().split('/')[1];
            var localityapi = $scope.propDetails[0].locality_name;
            var localityvalue = localityapi.replace(/\s+/g, '-').toLowerCase();
            var citynameapi = $scope.propDetails[0].city_name;
            var cityvalue = citynameapi.toLowerCase();
            var propnameapi = $scope.propDetails[0].propertyName;
            var propvalue = propnameapi.replace(/\s+/g, '-').toLowerCase();
            var propidapi = $scope.propDetails[0].property_info_IDPK;
            // alert(propurl);
            // var target = "https://www.homes247.in/property/"+cityvalue+"/"+localityvalue+"/"+propvalue+"-"+propidapi;
            // var key    = "5c765659af3f3c52f0d9f8fb84ea294975f6b595d5308";
            
          // $.ajax(
          //       {
          //           url: "https://api.linkpreview.net",
          //           dataType: "jsonp",
          //           data: {q: target, key: key},
          //           success: function (response) {
          //           console.log(response);
          //                                         }
          //     });
            if(urlcap != $scope.propDetails[0].locality_name){
              $location.url(url+"/"+cityvalue+"/"+localityvalue+"/"+propvalue+"-"+propidapi);
              // window.location.href = "http://192.168.1.116:8080/abijith/homes247_updated/property/"+cityvalue+"/"+localityvalue+"/"+propvalue+"-"+propidapi;
            }else if(cityurl != cityvalue){
              $location.url(url+"/"+cityvalue+"/"+localityvalue+"/"+propvalue+"-"+propidapi);
            }else if(propurl != propvalue){
              $location.url(url+"/"+cityvalue+"/"+localityvalue+"/"+propvalue+"-"+propidapi);
            }
            $rootScope.metaurl = "https://www.homes247.in/property/"+cityvalue+"/"+localityvalue+"/"+propvalue+"-"+propidapi;
  $timeout(function () {
    var sidecountrycode = document.querySelector("#sidephno");
    window.intlTelInput(sidecountrycode, {
        initialCountry: "in",
        onlyCountries: ['AU', 'CA','DE','FR','IN','IT','MY','MV','MU','NZ','PH','QA','RU','SG','ZA','ES','LK','GB','US','AE'],
        separateDialCode: true,
        utilsScript: "./js/utils.js",
      });
});
			$scope.activeItem = $scope.propDetails[0].images[0].Id;
      // console.log(success.data.deatils);
      $rootScope.title = $scope.propDetails[0].seotitle;
      $rootScope.description = $scope.propDetails[0].seodescription;
      $rootScope.keywords = $scope.propDetails[0].seokeyword;
      $rootScope.metaimage = "https://www.homes247.in/cms/images/uploadPropertyImgs/"+ $scope.propDetails[0].images[0].name;
			$scope.image = $scope.propDetails[0].images[0].name;
			$scope.location = $scope.propDetails[0].locality_name;
			$scope.city_name=   $scope.propDetails[0].city_name;
			var localityId = $scope.propDetails[0].LoaclityId;
      var propeId = $scope.propDetails[0].property_info_IDPK;
      var latitude = $scope.propDetails[0].latitude;
      var longitude = $scope.propDetails[0].longitude;
			$scope.tab =  $scope.propDetails[0].BHK_Deatils[0].BHK;
			$scope.getSimilarProjects(localityId, propeId, latitude, longitude);
      
      // $scope.similar();
      $scope.gallery();
      $scope.gallery1();
			$scope.initMap1();
			$scope.initMap2();
			$scope.initMap3();
			$scope.initMap4();
			$scope.initMap5();
        }
    }, function(error) {
        console.log(error);
    });
    $scope.slickConfig2 = {
        autoplay: true,
        autoplaySpeed: 1500,
 	  slidesToShow: 1,
 	  slidesToScroll: 1,
 	  arrows: false,
 	  fade: true,
        infinite: true,
        cssEase: 'ease-out',
        asNavFor: '.slider-nav-thumbnails',
        method: {}
         };
    $scope.slickConfig3 = {
       slidesToShow: 3,
 	slidesToScroll: 1,
        arrows: false,
 	asNavFor: '.slider',
        vertical: true,
 	focusOnSelect: true,
    cssEase: 'ease-out',
    method: {}
         };

    
    
		$scope.$on('$viewContentLoaded', function(){
			var firstSlides = $("#slideshow-list li"),
			secondSlides = $("#image-list li"),
			nbSlides = firstSlides.length,
			slideTime = 3000,
			nextSlide = 0,
			timer;
			// console.log(firstSlides);
			// console.log(firstSlides.length);
			
  });
    
    $scope.gallery = function () {
      $scope.slickConfig2Loaded = false;
      $timeout(function () {
        $scope.slickConfig2Loaded = true;
      });
    };
    $scope.gallery1 = function () {
      $scope.slickConfig3Loaded = false;
      $timeout(function () {
        $scope.slickConfig3Loaded = true;
      });
    };
	

        $scope.setTab = function (tabId) {
			//alert(tabId);
            $scope.tab = tabId;
        };

        $scope.isSet = function (tabId) {
            return $scope.tab === tabId;
        };
	
		$scope.emi ={amount:'',intrestrate:'',term:''};
    
//    CALCULATE-EMI-CLICK-STARTS
    
	     $scope.getrate=function(emi){
             
             $scope.selectedModel = {};
            $timeout(function timeout() {
                $scope.setValues();
                }, 1000);
            $scope.openTooltip = function openTooltip(model) {
            $scope.selectedModel = model;
                };
    $scope.closeTooltip = function closeTooltip() {
            $scope.selectedModel = {};
        };
    $scope.donutColours = ['#0A3544', '#E4642D'];
             
			 if(emi.amount == ''){
				 $scope.msgs = "Enter the amount";
				 $scope.open();
                 $scope.monthlyAmount=0; 
                    $scope.interestpayable = 0;
                    $scope.totalAmount=0;
                 $scope.setValues = function setValues() {
            $scope.emis = [
                { name: 'Interest Pay', value: 0 },
                { name: 'Total Capacity', value: 9999999 },
            ];
        };
			 }
			else if(emi.term == ''){
				$scope.msgs = "Enter the year";
				 $scope.open();
			}
             else if(emi.intrestrate == ''){
                $scope.msgs = "Enter the interest rate";
				 $scope.open();
                 $scope.monthlyAmount=0; 
                    $scope.interestpayable = 0;
                    $scope.totalAmount=0;
             }
				 else if(emi.amount != '' && emi.intrestrate !='' && emi.term !='')	{ 
				 var loanamt = emi.amount;        
                var intrest=emi.intrestrate;
                var repaytrm=emi.term*12;

        //EMI calculation logic         
        var rate1 = (parseFloat(intrest)/100)/12;
        var rate = 1+rate1;
        var interestRate = Math.pow(rate,repaytrm);
        var E1 = loanamt*rate1*interestRate;
        var E2 = interestRate-1;
        var EMI = (E1/E2);      
        var total_payable=EMI*repaytrm;
        var total_interest=(total_payable-loanamt);

        //Values to display
        $scope.monthlyAmount=display2Decimals(EMI); 
        $scope.interestpayable = display2Decimals(total_interest);
        $scope.totalAmount=display2Decimals(total_payable);
        
			 /*var interest_payable= emi.amount*(emi.intrestrate/100)*emi.term;
			    $scope.interestpayable = interest_payable;
               $scope.totalAmount = parseInt(interest_payable)+parseInt(emi.amount);
			   $scope.monthlyAmount=(parseInt(emi.amount)+parseInt(interest_payable))/(parseInt(emi.term)*12);*/
                     
//            DONUT-CHANGES AFTER-CLICK-STARTS
                     
        $scope.setValues = function setValues() {
            $scope.emis = [
                { name: 'Interest Pay', value: total_interest },
                { name: 'Total Capacity', value: emi.amount },
            ];
        };
    $scope.emis = [];
                     
//            DONUT-CHANGES AFTER-CLICK-ENDS
			}
             
        };
    
    //    CALCULATE-EMI-CLICK-ENDS
    
          
    function display2Decimals(x){ 
  return Number(parseFloat(x)).toFixed(2);
}  
       
        
//	$scope.firstReset = function() {
//        
//  }
	 
    
	$scope.getcallBackForProperties = function(enquiry){
        $scope.submitted = true;
    if (enquiry) {
        var propertyCallBack = {name:$scope.enquiry.name,
                                number:$scope.enquiry.mobileno,
                                propertyname:$scope.enquiry.propertyName,
                                propId:property_id,
                                propscndID:$scope.enquiry.property_info_ID
                               };
		propertyFactory.getCallBackBasedOnProperty(propertyCallBack,function(success){
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
        $scope.submitted = false;
		angular.element("input[type='text']").val(null);
    }
	};
    
    
    $scope.getcallBackmodal = function(enquirymodel){
        $scope.submit_dash_modal = true;
    if (enquirymodel) {
      var propertyCallBack = {name:$scope.enquirymodel.uname,
                              number:$scope.enquirymodel.umobileno,
                              propertyname:$scope.enquiry.propertyName,
                              propId:property_id,
                              propscndID:$scope.enquirymodel.property_info_ID
                             };
		propertyFactory.getCallBackBasedOnProperty(propertyCallBack,function(success){
			var status = success.data.status;
                if (status == "True") {
                   
                }
		},function(error){
			$scope.msgs = "Sorry! we are unable to process your request";
			$scope.open();
		});
         $scope.msgs = "We will intimate you soon.";
        $scope.open();
        $scope.enquirymodel = '';
        $scope.submit_dash_modal = false;
//        $('body').removeClass('modal-open')
//        $('.modal-backdrop').remove()
//		$('#myModal').modal().remove();
		angular.element("input[type='text']").val(null);
    }
	};


   $scope.callBack = function(user) {
       $scope.submit = true;
    if (user) {
      var requestParam = {
                name: user.name,
                number: user.mobileno,
                pageorgin: $scope.enquiry.propertyName
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
        $scope.submit = false;
        angular.element("input[type='text']").val(null);
    }

    };
  
//   $scope.priceRangeFilter = function (similarprop) {
  
//             if (similarprop.distance.value < $scope.minPrice) 
//             {
//               return true;
                
//           }
//           return false; 
// };


// $scope.minPrice = 5000;

	$scope.getSimilarProjects= function(locality_id,property_id,Latit,Longit){
		propertyFactory.getSimilarProperty({
      'localityId':locality_id, 
      'propeId':property_id,
      'latitude':Latit,
      'longitude':Longit
    },function(success){
      $scope.slickConfigsimil = {
        autoplay: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        fade: false,
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
              slidesToShow: 2,
              slidesToScroll: 1
            }
          }
        ]
    };
			if (success.data.hasOwnProperty('deatils')) {
            $scope.similarpropDetails = success.data.deatils;
            // $scope.elements = Array();
            // $scope.elements = $scope.similarpropDetails[0].Distance.elements[0];
            // $deatils['Distance'] = $scope.elements;
            // $scope.distances = $scope.elements;
            $scope.distances = $scope.similarpropDetails[0].Distance.elements[0];
			
        }
        
		},function(error){
			console.log(error);
		});
	};
	
	function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if ((charCode < 48 || charCode > 57))
        return false;

    return true;
} 
  
//**************** MAP-SECTION-STARTS  ***************//
    
    var map, places, tmpLatLng, markers1 = [], markers2 = [], markers3 = [],
        markers4 = [], markers5 = [];
    var infowindow;
    var iconBase = 'map/';
    var icons = {
          bus_station: {
            icon: iconBase + 'busstopnew.png'
          },
         hospital: {
            icon: iconBase + 'hospitalnew.png'
          },school: {
            icon: iconBase + 'schoolnew.png'
          },restaurant: {
            icon: iconBase + 'restnew.png'
          },shopping_mall: {
            icon: iconBase + 'mallnew.png'
          }
        };
    
        var myStyles =[
    {
        featureType: "poi",
//        elementType: "labels",
        stylers: [
              { visibility: "off" }
        ]
    }
];
     
         var service2 ; 
         var service3 ; 
         var service4 ; 
         var service5 ; 
         var directionsService = new google.maps.DirectionsService();
         var directionsDisplay; 
      $scope.initMap1 =function() {
        directionsDisplay = new google.maps.DirectionsRenderer({
          polylineOptions: {
            strokeColor: "red"
          }
        });
        var latitude =$scope.propDetails[0].latitude!= undefined?parseFloat($scope.propDetails[0].latitude):0.0;
        var longitude = $scope.propDetails[0].longitude != undefined?parseFloat($scope.propDetails[0].longitude):0.0;
        var pyrmont = {lat: latitude, lng: longitude};
        map = new google.maps.Map(document.getElementById('restaurant_map'), {
          center: pyrmont,
          zoom: 14, 
        });
          
        directionsDisplay.setMap(map);
        directionsDisplay.setOptions( { suppressMarkers: true } );
        
         var marker = new google.maps.Marker({
            position: pyrmont,
            map: map,
            icon: iconBase + 'marker3.png'
            });
            var cityCircle = new google.maps.Circle({
              strokeColor: '#2795ee5e',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#2795ee5e',
              fillOpacity: 0.35,
              map: map,
              center: pyrmont,
              radius: 2000
            });
          
          var markerBounds = new google.maps.LatLngBounds();
        var service = new google.maps.places.PlacesService(map);
          
        infowindow = new google.maps.InfoWindow();
//        service = new google.maps.places.PlacesService(map);
        service2 = new google.maps.places.PlacesService(map);
        service3 = new google.maps.places.PlacesService(map);
        service4 = new google.maps.places.PlacesService(map);
        service5 = new google.maps.places.PlacesService(map);
          
        service.nearbySearch({
          location: pyrmont,
          radius: 1500,
          type: ['restaurant']
        }, callback1);
          
        service2.nearbySearch({
          location: pyrmont,
          radius: 1500,
          type: ['school']
        }, callback2);
          
        service3.nearbySearch({
          location: pyrmont,
          radius: 2000,
          type: ['hospital']
        }, callback3);
          
        service4.nearbySearch({
          location: pyrmont,
          radius: 1000,
          type: ['shopping_mall']
        }, callback4);
          
        service5.nearbySearch({
          location: pyrmont,
          radius: 1000,
          type: ['bus_station']
        }, callback5);

          
      }
      var place1;
      function callback1(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
         for (var i = 0; i < results.length; i++) {
            createMarker1(results[i]);
            //  $scope.restcount = place1;
          }
      } else {
                // console.log("Places request failed: "+status);
              }
    }
    function callback2(results, status) {
        
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker2(results[i]);
            //  $scope.schoolcount = results.length;
          } 
        } else {
                // console.log("Places request failed: "+status);
              }
      }
    function callback3(results, status) {
        
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
            //  place1 = results.length;
            createMarker3(results[i]);
            //  $scope.hoscount = place1;
          }
        }
      }
    
    function callback4(results, status) {
        
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
              // place1 = results.length;
            createMarker4(results[i]);
            //  $scope.mallcount = place1;
          }
        }
      }
    
    function callback5(results, status) {
              
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            //  place1 = results.length;
            createMarker5(results[i]);
          //  $scope.buscount = place1; 
          }
        }
      } 
      function calculateAndDisplayRoute(directionsService, directionsDisplay,latit,longit,place,infowindow) {
        // var selectedMode = document.getElementById('mode').value;
        var latitude =$scope.propDetails[0].latitude!= undefined?parseFloat($scope.propDetails[0].latitude):0.0;
        var longitude = $scope.propDetails[0].longitude != undefined?parseFloat($scope.propDetails[0].longitude):0.0;
        
  directionsService.route({
          
          origin: {lat: latitude, lng: longitude},  // Haight.
          destination: {lat: latit, lng: longit},  // Ocean Beach.
          travelMode: google.maps.TravelMode.DRIVING
          // travelMode: google.maps.TravelMode[selectedMode]
        }, function(response, status) {
          if (status == 'OK') {
            // directionsDisplay.setDirections(response);
            computeTotals(response, infowindow);
            // var step = 0;
            // var infowindow2 = new google.maps.InfoWindow();
            // infowindow2.setContent(response.routes[0].legs[0].steps[step].distance.text + "<br>" + response.routes[0].legs[0].steps[step].duration.text + " ");
            // infowindow2.setPosition(response.routes[0].legs[0].steps[step].start_location);
            // infowindow2.open(map);
          } else {
            // window.alert('Directions request failed due to ' + status);
            // console.log('Directions request failed due to ' + status);
          }
        });
      }
      function computeTotals(result, infowindow) {
        var totalDist = 0;
        var totalTime = 0;
        var myroute = result.routes[0];
        for (i = 0; i < myroute.legs.length; i++) {
          totalDist += myroute.legs[i].distance.value;
          totalTime += myroute.legs[i].duration.value;
        }
        totalDist = totalDist / 1000.
        infowindow.setContent(infowindow.getContent()+"<br>Total Distance =" + totalDist.toFixed(2) + " Km " + "<br>Travel Time=" + (totalTime/60).toFixed(2) + " Minutes");
      }
    function createMarker1(place) {
        var latit = place.geometry.location.lat();
        var longit = place.geometry.location.lng();
        
        var marker1 = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          icon: icons[place.types[0]].icon
        });
        markers1.push(marker1);
        document.getElementById('restaurnt').innerHTML = markers1.length;
          marker1.addListener('mouseover', function() {
            
                // infowindow.setContent(place.name + '<br/>Latitude=' + latit + '<br/>Longitude=' + longit);
                infowindow.setContent(place.name);
          infowindow.open(map, this);
          calculateAndDisplayRoute(directionsService, directionsDisplay,latit,longit,place,infowindow);
            });
              // FOR_MOBILE
            marker1.addListener('click', function() {
              infowindow.setContent(place.name);
        infowindow.open(map, this);
        calculateAndDisplayRoute(directionsService, directionsDisplay,latit,longit,place,infowindow);
          });
            // FOR_MOBILE
            marker1.addListener('mouseout', function() {
            
              infowindow.close();
              directionsDisplay.set('directions', null);
        
          });
      }

      // ONLY SHOW FOR COUNTS IN MAP STARTS

    function createMarker2(place) {
        var placeLoc = place.geometry.location;
        // alert(placeLoc);
        var marker2 = new google.maps.Marker({
          map: map,
//          position: place.geometry.location,
          icon: icons[place.types[0]].icon
        });
        markers2.push(marker2);
        document.getElementById('scool').innerHTML = markers2.length;
        // marker2.addListener('mouseover', function() {
        //         infowindow.setContent(place.name);
        //   infowindow.open(map, this);
        //     });
      }
     function createMarker3(place) {
        //console.log(service);
        var placeLoc = place.geometry.location;
        var marker3 = new google.maps.Marker({
          map: map,
//          position: place.geometry.location,
          icon: icons[place.types[0]].icon
        });
         markers3.push(marker3);
        document.getElementById('hospit').innerHTML = markers3.length;
          marker3.addListener('mouseover', function() {
                infowindow.setContent(place.name);
          infowindow.open(map, this);
            });
      }
    
    function createMarker4(place) {
        //console.log(service);
        var placeLoc = place.geometry.location;
        var marker4 = new google.maps.Marker({
          map: map,
//          position: place.geometry.location,
          icon: icons[place.types[0]].icon
        });
        markers4.push(marker4);
        document.getElementById('shopng').innerHTML = markers4.length;
          marker4.addListener('mouseover', function() {
                infowindow.setContent(place.name);
          infowindow.open(map, this);
            });
      }
    
     function createMarker5(place) {
        //console.log(service);
        var placeLoc = place.geometry.location;
        var marker5 = new google.maps.Marker({
          map: map,
//          position: place.geometry.location,
          icon: icons[place.types[0]].icon
        });
         markers5.push(marker5);
        document.getElementById('busstp').innerHTML = markers5.length;
          marker5.addListener('mouseover', function() {
                infowindow.setContent(place.name);
          infowindow.open(map, this);
            });
      }
    
   // ONLY SHOW FOR COUNTS IN MAP ENDS    
          
          $scope.initMap2 =function() {
            // directionsDisplay = new google.maps.DirectionsRenderer({
            //   polylineOptions: {
            //     strokeColor: "red"
            //   }
            // });
        var latitude =$scope.propDetails[0].latitude!= undefined?parseFloat($scope.propDetails[0].latitude):0.0;
        var longitude = $scope.propDetails[0].longitude != undefined?parseFloat($scope.propDetails[0].longitude):0.0;
        var pyrmont = {lat: latitude, lng: longitude};
        map = new google.maps.Map(document.getElementById('school_map'), {
          center: pyrmont,
          zoom: 14, 
        });
        // directionsDisplay.setMap(map);
        // directionsDisplay.setOptions( { suppressMarkers: true } );
        var marker = new google.maps.Marker({
            position: pyrmont,
            map: map,
            icon: iconBase + 'marker3.png'
//            title: 'Click to zoom'
            });
            var cityCircle = new google.maps.Circle({
              strokeColor: '#2795ee5e',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#2795ee5e',
              fillOpacity: 0.35,
              map: map,
              center: pyrmont,
              radius: 2000
            });

        infowindow = new google.maps.InfoWindow();
        service2 = new google.maps.places.PlacesService(map);
          
       service2.nearbySearch({
          location: pyrmont,
          radius: 1500,
          type: ['school']
        }, callback6);
              
          }
          function callback6(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          } 
        } else {
                console.log("Places request failed: "+status);
              }
      }
    
      
      $scope.initMap3 =function() {
        // directionsDisplay = new google.maps.DirectionsRenderer({
        //   polylineOptions: {
        //     strokeColor: "red"
        //   }
        // });
        var latitude =$scope.propDetails[0].latitude!= undefined?parseFloat($scope.propDetails[0].latitude):0.0;
        var longitude = $scope.propDetails[0].longitude != undefined?parseFloat($scope.propDetails[0].longitude):0.0;
        var pyrmont = {lat: latitude, lng: longitude};
        
        map = new google.maps.Map(document.getElementById('hospital_map'), {
        center: pyrmont,
        zoom: 14, 
        });
        // directionsDisplay.setMap(map);
        // directionsDisplay.setOptions( { suppressMarkers: true } );
          
          var marker = new google.maps.Marker({
            position: pyrmont,
            map: map,
            icon: iconBase + 'marker3.png'
//            title: 'Click to zoom'
            });
            var cityCircle = new google.maps.Circle({
              strokeColor: '#2795ee5e',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#2795ee5e',
              fillOpacity: 0.35,
              map: map,
              center: pyrmont,
              radius: 2000
            });

        infowindow = new google.maps.InfoWindow();
        service3 = new google.maps.places.PlacesService(map);

        service3.nearbySearch({
          location: pyrmont,
          radius: 2000,
          type: ['hospital']
        }, callback7);
            
      }
      
      function callback7(results, status) {
        for (var i = 0; i < results.length; i++) {
              place1 = results.length;
            createMarker(results[i]);
              $scope.hoscount = place1;
          }
      }
    
      $scope.initMap4 =function() {
        // directionsDisplay = new google.maps.DirectionsRenderer({
        //   polylineOptions: {
        //     strokeColor: "red"
        //   }
        // });
        var latitude =$scope.propDetails[0].latitude!= undefined?parseFloat($scope.propDetails[0].latitude):0.0;
        var longitude = $scope.propDetails[0].longitude != undefined?parseFloat($scope.propDetails[0].longitude):0.0;
        var pyrmont = {lat: latitude, lng: longitude};
        
        map = new google.maps.Map(document.getElementById('mall_map'), {
        center: pyrmont,
        zoom: 14,
        });
        // directionsDisplay.setMap(map);
        // directionsDisplay.setOptions( { suppressMarkers: true } );
          var marker = new google.maps.Marker({
            position: pyrmont,
            map: map,
            icon: iconBase + 'marker3.png'
//            title: 'Click to zoom'
            });
            var cityCircle = new google.maps.Circle({
              strokeColor: '#2795ee5e',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#2795ee5e',
              fillOpacity: 0.35,
              map: map,
              center: pyrmont,
              radius: 2000
            });

        infowindow = new google.maps.InfoWindow();
        service4 = new google.maps.places.PlacesService(map);

          service4.nearbySearch({
          location: pyrmont,
          radius: 1000,
          type: ['shopping_mall']
        }, callback8);
      }
      
      function callback8(results, status) {
        for (var i = 0; i < results.length; i++) {
               place1 = results.length;
            createMarker(results[i]);
              $scope.mallcount = place1;
          }
      }
      
      $scope.initMap5 =function() {
        // directionsDisplay = new google.maps.DirectionsRenderer({
        //   polylineOptions: {
        //     strokeColor: "red"
        //   }
        // });
        var latitude =$scope.propDetails[0].latitude!= undefined?parseFloat($scope.propDetails[0].latitude):0.0;
        var longitude = $scope.propDetails[0].longitude != undefined?parseFloat($scope.propDetails[0].longitude):0.0;
        var pyrmont = {lat: latitude, lng: longitude};
        
        map = new google.maps.Map(document.getElementById('atm_map'), {
        center: pyrmont,
        zoom: 14,
        });
        // directionsDisplay.setMap(map);
        // directionsDisplay.setOptions( { suppressMarkers: true } );
          var marker = new google.maps.Marker({
            position: pyrmont,
            map: map,
              icon: iconBase + 'marker3.png'
//            title: 'Click to zoom'
            });
            var cityCircle = new google.maps.Circle({
              strokeColor: '#2795ee5e',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#2795ee5e',
              fillOpacity: 0.35,
              map: map,
              center: pyrmont,
              radius: 2000
            });

        infowindow = new google.maps.InfoWindow();
        service5 = new google.maps.places.PlacesService(map);

          service5.nearbySearch({
          location: pyrmont,
          radius: 1000,
          type: ['bus_station']
        }, callback9);
          
      }
      
      function callback9(results, status) {
              for (var i = 0; i < results.length; i++) {
              place1 = results.length;
            createMarker(results[i]);
            $scope.buscount = place1; 
          }
      } 
      
      function createMarker(place) {
        var latit = place.geometry.location.lat();
        var longit = place.geometry.location.lng();
        var placeLoc = place.geometry.location;
        // alert(placeLoc);
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          icon: icons[place.types[0]].icon
        });
          marker.addListener('mouseover', function() {
                infowindow.setContent(place.name);
          infowindow.open(map, this);
          calculateAndDisplayRoute(directionsService, directionsDisplay,latit,longit,place,infowindow);
            });
          // FOR_MOBILE
            marker.addListener('click', function() {
              infowindow.setContent(place.name);
        infowindow.open(map, this);
        calculateAndDisplayRoute(directionsService, directionsDisplay,latit,longit,place,infowindow);
          });
          // FOR_MOBILE
            marker.addListener('mouseout', function() {
            
              infowindow.close();
              directionsDisplay.set('directions', null);
        
          });
      }
          
   //**************** MAP-SECTION-ENDS  ***************//
      
    
      $(document).ready(checkContainer);
      $(document).ready(checkContainer2);
      $(document).ready(checkContainer3);
      $(document).ready(checkContainer4);
      $(document).ready(checkContainer5);

      function checkContainer () {
     
  if($('#restaurant_map').is(':visible')){    //if the container is visible on the page
    $scope.initMap1(); //Adds a grid to the html
  }  else {
      setTimeout(checkContainer, 100); //wait 50 ms, then try again
  }  
      }
    function checkContainer2 () {

              if($('#school_map').is(':visible')){ //if the container is visible on the page
    $scope.initMap2(); //Adds a grid to the html
  }  else {
      setTimeout(checkContainer2, 100); //wait 50 ms, then try again
  }
          
    }
          
    function checkContainer3 () {
     
  if($('#hospital_map').is(':visible')){ //if the container is visible on the page
    $scope.initMap3(); //Adds a grid to the html
  }  else {
      setTimeout(checkContainer3, 100); //wait 50 ms, then try again
  }
          
}
    function checkContainer4 () {
     
  if($('#mall_map').is(':visible')){ //if the container is visible on the page
    $scope.initMap4(); //Adds a grid to the html
  }  else {
      setTimeout(checkContainer4, 100); //wait 50 ms, then try again
  }
          
}
    function checkContainer5 () {
     
  if($('#atm_map').is(':visible')){ //if the container is visible on the page
    $scope.initMap5(); //Adds a grid to the html
  }  else {
      setTimeout(checkContainer5, 100); //wait 50 ms, then try again
  }
          
}
google.maps.event.addListener(window, 'load', $scope.initMap1); 
    
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
  
   $scope.hitimages =function() {
// alert("clicked");
//  var timer = setTimeout(slideshow, 100);
     clearTimeout(timer);
     var clickIndex = $(this).index()
     $('#slideshow-list li').eq(clickIndex).show().siblings().hide(); 
 };
  
	
});
//});