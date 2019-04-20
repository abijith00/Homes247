//(function(){
var app = angular.module('footerApp',[]);
app.factory('footerFactory', function(networking) {
    var factory = {};
	
	factory.getBuilderDetails = function(callback){
		 return networking.callServerForUrlEncondedGETRequest('/get_bulidersInfo', callback);
	};


	 return factory;
});

app.controller('footerCtrl',function($scope,networkFactory,$stateParams,$cookies,footerFactory,$location){
	//$cookies.put('key','others');
	$scope.mobile_footer = true;
	$scope.dash_hider = false;
	if (window.screen.width <= 768) { 
		$scope.mobile_footer = false;
	}
	if (window.screen.width <= 480){
		$scope.dash_hider = true;
	}
    $scope.quantity = 5;
    var param1= $stateParams.param;
    var url = $location.path().split('/')[1];
    if(url==''){
		$scope.dash_ftrlinks = true;
		$scope.pgs_ftrlinks = false;
	}else{
        $scope.dash_ftrlinks = false;
        $scope.pgs_ftrlinks = true;
	}
    
    if(url=='property'){
        $('.footer_main').addClass('Prpty_footer');
    }
	//  networkFactory.getCityDetails(function(success) {
	// 	 $scope.cities = success.data.locations;
	// });
	// $scope.loadfoot = function (){
	// footerFactory.getBuilderDetails(function(success) {
    //     console.log(success.data);
	// 	 $scope.builders = success.data.details;
	
    // },function(error){
	// 	alert(error);
	// });
	// $scope.loadfoot = function (){
    //     return;
    // }
	// };
});


//});