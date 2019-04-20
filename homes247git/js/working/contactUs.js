//(function(){
var app = angular.module('contactUsApp',['ui.bootstrap','modalApp']);
app.controller('contactUsCtrl',function($scope, networkFactory,$modal, $log,$cookies){

    $scope.validLength = 9;
    
    var enqinput = document.querySelector("#contactphno");
    window.intlTelInput(enqinput, {
        initialCountry: "in",
        separateDialCode: true,
        utilsScript: "./js/utils.js",
      });
        
    $(function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        $('.ui.dropdown').dropdown();
    });
//	$cookies.set('key','others');
//s$('.test_design').niceSelect();
	/* $('#first').carouseller({
					scrollSpeed: 850,
					autoScrollDelay: -1800,
					easing: 'easeOutBounce'
				});
	$('#third').carouseller({ 
					scrollSpeed: 800,
					autoScrollDelay: 1600,
					easing: 'linear'
				});
	$('#top-project').carouseller({ 
					scrollSpeed: 800,
					autoScrollDelay: 1600,
					easing: 'linear'
				}); */
				
	$scope.user = {
        name: '',
        mobileno: ''
    }
    var page = $scope.user.origin = "Contact Us";
 $scope.callBack = function(user) {
     $scope.submit_cntct = true;
    if (user) {
      var requestParam = {
                name: user.name,
                number: user.mobileno,
                pageorgin: page
            };
        
            networkFactory.addCallbackDetails(requestParam, function(success) {
                var status = success.data.status;
                if (status == "True") {
//					$scope.msgs = "We will intimate you soon.";
//                    $scope.open();
                }
            }, function(error) {
                
				$scope.msgs = "Sorry! we are unable to process your request";
                    $scope.open();
            });

        $scope.msgs = "We will intimate you soon.";
        $scope.open();
        $scope.user = '';
        $scope.submit_cntct = false;
        angular.element("input[type='text']").val(null);
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