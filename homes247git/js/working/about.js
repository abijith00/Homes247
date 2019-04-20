//(function(){
var aboutapp = angular.module('aboutUsApp', ['ui.bootstrap','modalApp']);


aboutapp.controller('aboutusCtrl', function($scope, networkFactory,$modal, $log,$cookies) {
	//$cookies.put('key','others');
    
    $scope.validLength = 9;
    var enqinput = document.querySelector("#aboutphno");
    window.intlTelInput(enqinput, {
        initialCountry: "in",
        separateDialCode: true,
        utilsScript: "./js/utils.js",
      });


    $scope.teams = [{
        Name: "JAI",
        Desig: "Project Manager",
        Desc: "Lorem Ipsum is simply dummy text of the printing and typesetting Industry.Lorem Ipsum is simply dummy text of the printing and typesetting Industry.",
        Image: "https://www.archid.co.za/wp-content/uploads/2011/07/team-1.jpg",
     
    }, {
        Name: "BARRY",
        Desig: "Lead Developer",
        Desc: "Lorem Ipsum is simply dummy text of the printing and typesetting Industry.Lo",
        Image: "https://www.xing.com/image/f_d_b_c0b187404_3391069_3/patrick-metz-foto.1024x1024.jpg",
     
    }, {
        Name: "IRIS",
        Desig: "Accountants",
        Desc: "Lorem Ipsum is simply dummy text of the printing and typesetting Industry.Lo",
        Image: "https://mk0beaveraddonsc9xx2.kinstacdn.com/wp-content/uploads/2017/06/t1-2.png",
    },{
        Name: "CAITLIN",
        Desig: "Developer",
        Desc: "Lorem Ipsum is simply dummy text of the printing and typesetting Industry.Lo",
        Image: "http://jagthemes.com/wp-content/uploads/2017/02/member-02-320x320.jpg",
    }];
    
    $(function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        $('.ui.dropdown').dropdown();
        });
    $scope.user = {
        name: '',
        mobileno: ''
    }
    var page = $scope.user.origin = "About us Page";
 $scope.callBack = function(user) {
        $scope.submit_abt = true;
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
        $scope.user = '';
        $scope.submit_abt = false;
        angular.element("input[type='text']").val(null);
        $scope.msgs = "We will intimate you soon.";
        $scope.open();
    }
    };
    //$('.test_design').niceSelect();
	/* 
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