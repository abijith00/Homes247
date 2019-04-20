//(function(){
var calcapp = angular.module('calculatorApp',['rzModule','modalApp','ngDonut']);
calcapp.factory('moreFactory', function(networking) {
    var factory = {};
    factory.addClientQuery = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/querysection', requestData, callback);
    };
	
    return factory;
});
calcapp.directive('validNumber', function() {
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

calcapp.directive("preventTypingGreater", function() {
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
calcapp.controller('calculatorCtrl',function($cookies,$scope,moreFactory,$timeout,$modal, $log){

  $scope.validLength = 9;

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
    var enqinput = document.querySelector("#blogsphno");
    window.intlTelInput(enqinput, {
        initialCountry: "in",
        separateDialCode: true,
        utilsScript: "./js/utils.js",
      });
    
     $scope.interestpayable = 0;
    $scope.totalAmount = 0;
    $scope.monthlyAmount = 0;
     $scope.term = 0;
    $scope.selectedModel = {};
    $scope.setValues = function setValues() {
            $scope.emis = [
                { name: 'Interest Pay', value: 0 },
                { name: 'Total Capacity', value: 9999999 },
            ];
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
        });
	
		$scope.emi ={amount:'',intrestrate:'',term:''};
		// console.log($scope.emi);
    
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
			}else if(emi.intrestrate == ''){$scope.msgs = "Enter the interest rate";
				 $scope.open();}
				 else if(emi.amount != '' && emi.intrestrate !='' && emi.term !='')	{ 
                     $scope.setValues = function setValues() {
            $scope.emis = [
                { name: 'Interest Pay', value: total_interest },
                { name: 'Total Capacity', value: emi.amount },
            ];
        };
    $scope.emis = [];
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
			}
        };
    
    function display2Decimals(x){ 
  return Number(parseFloat(x)).toFixed(2);
}  
		
		
		 $scope.user = {
        name: '',
        mobileno: '',
		email:'',
		msg:''
    }
 $scope.userQuery = function(user) {
        $scope.submit_homeloan = true;
    if (user) {
      var requestParam = {
                name: user.name,
                number: user.mobileno,
				email: user.email,
				msg:user.msg
            };
            moreFactory.addClientQuery(requestParam, function(success) {
                var status = success.data.status;
                if (status == "True") {
					
                }
            }, function(error) {	
                conole.log(error);
				$scope.msgs = "Sorry! we are unable to process your request";
                    $scope.open();
            });
            $scope.user = '';
            $scope.submit_homeloan = false;
            $scope.msgs = "We will intimate you soon.";
            angular.element("input").val(null);
            angular.element("textarea").val(null);
            $scope.open();
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
            
//$cookies.set('key','others');

	 /* $('#horizontalTab').easyResponsiveTabs({
type: 'default', //Types: default, vertical, accordion           
width: 'auto', //auto or any width like 600px
fit: true,   // 100% fit in a container
closed: 'accordion', // Start closed if in accordion view
activate: function(event) { // Callback function if tab is switched
var $tab = $(this);
var $info = $('#tabInfo');
var $name = $('span', $info);
$name.text($tab.text());
$info.show();
}
});
$('#verticalTab').easyResponsiveTabs({
type: 'vertical',
width: 'auto',
fit: true
});  */

});
//});