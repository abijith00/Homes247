//(function(){
var app = angular.module('policyApp', ['ui.bootstrap','modalApp']);

  

app.factory('policyFactory', function(networking) {
    var factory = {};
    factory.addClientQuery = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/querysection', requestData, callback);
    };
	
    return factory;
});

app.controller('policyCtrl',function(policyFactory, $scope,$modal, $log,$cookies){

    $scope.validLength = 9;

    var enqinput = document.querySelector("#blogsphno");
    window.intlTelInput(enqinput, {
        initialCountry: "in",
        onlyCountries: ['AU', 'CA','DE','FR','IN','IT','MY','MV','MU','NZ','PH','QA','RU','SG','ZA','ES','LK','GB','US','AE'],
        separateDialCode: true,
        utilsScript: "./js/utils.js",
      });


    $(function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        $('.ui.dropdown').dropdown();
    });
	
	//$('.test_design').niceSelect();
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
	//$(fourd).carouseller();
	
	
	//$cookies.set('key','others');
	   $scope.user = {
        name: '',
        mobileno: '',
		email:'',
		msg:''
    }
 $scope.userQuery = function(user) {
        $scope.submit_policy = true;
    if (user) {
      var requestParam = {
                name: user.name,
                number: user.mobileno,
				email: user.email,
				msg:user.msg
            };
        
            policyFactory.addClientQuery(requestParam, function(success) {
                var status = success.data.status;
                if (status == "True") {
//					$scope.msgs = "We will intimate you soon.";
//                    $scope.open();
//                     $scope.user = {};
//                    $scope.policyForm.uname.$setValidity('required', false);
                }
            }, function(error) {	
                conole.log(error);
				$scope.msgs = "Sorry! we are unable to process your request";
                    $scope.open();
            });
            $scope.msgs = "We will intimate you soon.";
            $scope.open();
            $scope.user = '';
            $scope.submit_policy = false;
                    angular.element("input").val(null);
					angular.element("textarea").val(null);
    }
//     $scope.user = {};
//        $scope.user= angular.copy(original);
//     $scope.policyForm.$setPristine();
//     $scope.policyForm.$setUntouched();
     $scope.policyForm.$setValidity();
     
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