//(function(){
var app = angular.module('servicesApp',[]);

app.controller('servicesCtrl',function($scope, $http, policyFactory,$modal,$log,$cookies){

     var enqinput = document.querySelector("#blogsphno");
    window.intlTelInput(enqinput, {
        initialCountry: "in",
        separateDialCode: true,
        utilsScript: "./js/utils.js",
      });
    
    $http({
        method: 'GET',
        data: '',
        headers: {
            'Content-Type': 'application/json'
        },
        url: 'json/banglore_price.json'
    }).success(function(res){
        console.log(res);
        $scope.bangloretrends = res;
    }).error(function(){
        console.log('error');
    });
//    $http.get('json/banglore_price.json')
//       .then(function(res){
//          $scope.bangloretrends = res.data;                
//        });
    
    $http({
        method: 'GET',
        data: '',
        headers: {
            'Content-Type': 'application/json'
        },
        url: 'json/chennai_price.json'
    }).success(function(res){
        console.log(res);
        $scope.chennaitrends = res;
    }).error(function(){
        console.log('error');
    });
    
//    $http.get('json/chennai_price.json')
//       .then(function(res){
//          $scope.chennaitrends = res.data;                
//        });
    
    $http({
        method: 'GET',
        data: '',
        headers: {
            'Content-Type': 'application/json'
        },
        url: 'json/pune_price.json'
    }).success(function(res){
        console.log(res);
        $scope.punetrends = res;
    }).error(function(){
        console.log('error');
    });
    
//    $http.get('json/pune_price.json')
//       .then(function(res){
//          $scope.punetrends = res.data;                
//        });
    
    $http({
        method: 'GET',
        data: '',
        headers: {
            'Content-Type': 'application/json'
        },
        url: 'json/kochi_price.json'
    }).success(function(res){
        console.log(res);
        $scope.kochitrends = res;
    }).error(function(){
        console.log('error');
    });
    
//    $http.get('json/kochi_price.json')
//       .then(function(res){
//          $scope.kochitrends = res.data;                
//        });
    
    $http({
        method: 'GET',
        data: '',
        headers: {
            'Content-Type': 'application/json'
        },
        url: 'json/hyderabad_price.json'
    }).success(function(res){
        console.log(res);
        $scope.hydertrends = res;
    }).error(function(){
        console.log('error');
    });
    
//     $http.get('json/hyderabad_price.json')
//       .then(function(res){
//          $scope.hydertrends = res.data;                
//        });
    
    $scope.demo = function(){
        document.body.scrollTop = 200;
        document.documentElement.scrollTop = 200;
    }
    
    $(function() {
         document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
        $('.ui.dropdown').dropdown();
        });
//$cookies.set('key','others');
	
	/* $('.test_design').niceSelect();
	$('#first').carouseller({
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
    
	$scope.user = {
        name: '',
        mobileno: '',
		email:'',
		msg:''
    }
 $scope.userQuery = function(user) {
        $scope.submit_servce = true;
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
//					$scope.msgs = "We will intimate you soon";
//					angular.element("input").val(null);
//					angular.element("textarea").val(null);
//                    $scope.open();
                    
                }
            }, function(error) {	
                conole.log(error);
				$scope.msgs = "Sorry! we are unable to process your request";
                    $scope.open();
            });
        $scope.msgs = "We will intimate you soon";
        $scope.open();
        $scope.user = '';
        $scope.submit_servce = false;
        angular.element("input").val(null);
        angular.element("textarea").val(null);
                 
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