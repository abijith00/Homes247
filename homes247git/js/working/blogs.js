//(function(){
var app = angular.module('blogsApp',['blogstoriesApp']);


app.factory('blogsFactory', function(networking) {
    var factory = {};

    factory.addClientQuery = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/querysection', requestData, callback);
    };
    
    factory.storiesDetails = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/stories_deatail_page', requestData, callback);
    };
    
    factory.getblogs = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/blogs', callback);
    };

    factory.gettop_stories = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/top_stories', callback);
    };
	
	factory.getrecent_stories = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/recent_stories', callback);
    };

    factory.getBuilderDetails = function(requestData , callback){
        return networking.callServerForUrlEncondedPOSTRequest('/autocomplete', requestData, callback);
   };

   factory.getblogautodetails = function(requestData , callback){
    return networking.callServerForUrlEncondedPOSTRequest('/blogautocomplete', requestData, callback);
   };

   factory.addPopCallbackDetails = function(requestData, callback) {
    return networking.callServerForUrlEncondedPOSTRequest('/callbackpop', requestData, callback);
};

    return factory;
});

app.directive('clientAutoComp',function($filter){
	return {
				
                restrict: 'A',       
                link: function (scope, elem, attrs) {
                    elem.autocomplete({
                        source: function (request, response) {

                            //term has the data typed by the user
                            var params = request.term;
                            
                            //simulates api call with odata $filter
                            var data = scope.blogsauto;
                            scope.$watch('blogautolist', function(newValue, oldValue) {
   										//  console.log(newValue);
   										//  console.log(oldValue);
  								  //var someVar = [Do something with someVar];

   		
									    // so it will not trigger another digest 
									  //  angular.copy(someVar, $scope.someVar);

									});                                     
                            if (data) { 
                                var result = $filter('filter')(data, {name:params});
                                angular.forEach(result, function (item) {
                                    item['value'] = item['name'];
                                });                       
                            }
                            response(result);

                        },
                        minLength: 1,                       
                        select: function (event, ui) {
                           //force a digest cycle to update the views
                           scope.$apply(function(){
                           	scope.setClientData(ui.item);
                           });                       
                        },
                       
                    });
                }

            };
});



app.filter('startFrom', function() {
    return function(input, start) {
        if (!input || !input.length) { return; }
        start = +start; //parse to int
        return input.slice(start);
    }
});

app.filter("trust", ['$sce', function($sce) {
    return function(htmlCode){
      return $sce.trustAsHtml(htmlCode);
    }
  }]);

app.controller('blogsCtrl',function($scope,$state,$filter, blogsFactory,$modal,urls,$cookies){




    $scope.validLength = 9;
    $scope.numLimit=180;
    $scope.recentLimit=100;
	//$cookies.set('key','others');
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
                // conole.log(error);
				$scope.msgs = "Sorry! we are unable to process your request";
                    $scope.open();
            });
    }
    };


    var page = $scope.user.origin = "Blogs";
    $scope.callBackblog = function(user) {
    
    if (user) {
        var requestParam = {
                name: user.name,
                number: user.mobileno,
                email: user.emailid,
                pageorgin: page
            };
            blogsFactory.addPopCallbackDetails(requestParam, function(success) {
                var status = success.data.status;
                if (status == "True") {
                    
                }
            }, function(error) {
                
				$scope.msgs = "Sorry! we are unable to process your request";
                    $scope.open();
            });
            $scope.msgs = "We will intimate you soon.";
            $scope.user = '';
            angular.element("input").val(null);
            $scope.open();
    }
    };


	$scope.imagepath = urls.imagesURL + "stories/";
//	$scope.imagepath = urls.imagesURL + "New%20folder/";

$scope.setClientData = function(item){
		
    if (item){
              
              $scope.builderData =item;
            //    console.log(item);
               $scope.getblogs(item);
            }
};

$scope.getblogs = function(item){
    // console.log(item.id);
    var id = item.id
    var title = item.name
    var titlespace = title.replace(/\s+/g, '-').toLowerCase();
    blogsFactory.storiesDetails({'id':id,'title':title},function(success){
        $scope.stories= success.data.locations;
        $state.go('newStory',
        { title:titlespace, param: id});
    },function(error){
        console.log(error);
    });

}

    blogsFactory.getblogs(function(success){
        $scope.slickConfigblogLoaded = true;
        $scope.slickConfigblog = {
            autoplay: true,
            arrows : true,
            infinite: true,
            dots: true,
            autoplaySpeed: 3000,
            slidesToShow: 1,
            slidesToScroll: 1,
            responsive: [
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]
        };
		// console.log(success.data);
        $scope.currentPage = 0;
        $scope.pageSize = 9;
		$scope.blogs= success.data.locations;
        $scope.getData = function () {
     
      return $filter('filter')($scope.blogs)
    
    }
        $scope.numberOfPages=function(){
        return Math.ceil($scope.getData().length/$scope.pageSize);                
    }
        for (var i=0; i<65; i++) {
//        $scope.blogs.push("Item "+i);
    }
	},function(error){
		console.log(error);
	});
    
    
    
	blogsFactory.gettop_stories(function(success){
		// console.log(success.data);
		$scope.topStories= success.data.locations;
	},function(error){
		console.log(error);
	});
	
	blogsFactory.getrecent_stories(function(success){
		$scope.recentStories= success.data.locations;
	},function(error){
		console.log(error);
    });
    
    blogsFactory.getblogautodetails({'blog_id':'1'},function(success){
        // console.log("BLOGS_AUTO:",success.data.blogautolist);
        $scope.blogsauto = success.data.blogautolist;
    });
	
	
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