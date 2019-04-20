var app = angular.module('blogstoriesApp',[]);
app.factory('blogsFactory', function(networking){
    var factory = {};
    
    factory.addClientQuery = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/querysection', requestData, callback);
    };
    
});

app.filter("trust", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);

app.controller('storiesCtrl',function($scope,$rootScope,blogsFactory,urls,$modal,$stateParams,$cookies){
    
    $scope.validLength = 9;
    
    var enqinput = document.querySelector("#blogsphno");
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
    
    $scope.user = {
        name: '',
        mobileno: '',
		email:'',
		msg:''
    }
    
    $scope.blogQuery = function(user) {
        $scope.submit_blogquery = true;
    if (user) {
      var requestParam = {
                name: user.name,
                number: user.mobileno,
				email: user.email,
				msg:user.msg
            };
            blogsFactory.addClientQuery(requestParam, function(success) {
                var status = success.data.status;
                if (status == "True") {
					$scope.msgs = "We will intimate you soon.";
					angular.element("input").val(null);
					angular.element("textarea").val(null);
                    $scope.open();
                }
            }, function(error) {	
                conole.log(error);
				$scope.msgs = "Sorry! we are unable to process your request";
                    $scope.open();
            });
    }
    };
    
	var id ;
	var title ;
	if($stateParams.param != undefined && $stateParams.title != undefined){
		id =$stateParams.param;
		title =$stateParams.title;
		$cookies.put('id',id);
		$cookies.put('title',title);
		
	}else{
		id =$cookies.get('id');
		title = $cookies.get('title');	
	}
	$scope.imagepath = urls.imagesURL + "stories/";
	
		
		blogsFactory.storiesDetails({'id':id,'title':title},function(success){
            $scope.stories= success.data.locations;
            
            $rootScope.title = $scope.stories[0].seotitle;
            $rootScope.description = $scope.stories[0].seodesc;
            $rootScope.keywords = $scope.stories[0].seokey;
		},function(error){
			console.log(error);
		});
    
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