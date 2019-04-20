//(function(){
var app = angular.module('faqApp',['ui.bootstrap','modalApp']);

app.factory('faqFactory', function(networking) {
    var factory = {};
    factory.addfaq = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/faq', requestData, callback);
    };
	
    return factory;
});
app.controller('faqCtrl',function(faqFactory, $scope,$modal, $log,$cookies){

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
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        $('.ui.dropdown').dropdown();
    });
	//$cookies.set('key','others');
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
	
	
	
		   $scope.user = {
        name: '',
		emailid:'',
		msg:''
    }
 $scope.userfaq = function(user) {
        $scope.submit_faq = true;
    if (user) {
      var requestParam = {
                name: user.name,
				emailid: user.emailid,
				msg:user.msg
            };
       
            faqFactory.addfaq(requestParam, function(success) {
                var status = success.data.status;
                if (status == "True") {
//					$scope.msgs = "We will intimate you soon.";
//                    $scope.open();
//					angular.element("input").val(null);
//					angular.element("textarea").val(null);
                }
            }, function(error) {
                
				$scope.msgs = "Sorry! we are unable to process your request";
                    $scope.open();
            });
         $scope.msgs = "We will intimate you soon.";
        $scope.open();
        $scope.user = '';
        $scope.submit_faq = false;
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