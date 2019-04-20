//(function(){

	var router= angular.module('routerApp',['ui.router']);
	//var router= angular.module('routerApp',['ngRoute']);
	
	//SPINNER-STARTS
	
	//router.run(function($window, $rootScope, $timeout) {
	//
	//  var hideClass = 'ng-hide',
	//    delay = 1000,
	//    firstChangeStartt = false,
	//    firstContentLoaded = false,
	//    timer;
	//
	//  $rootScope.$on('$stateChangeStart',
	//    function(event, toState, toParams, fromState, fromParams) {
	//
	//      
	//      if (!firstChangeStartt) {
	//        firstChangeStartt = true;
	//        return;
	//      }
	//      
	//      $timeout.cancel(timer);
	//      // Show the loader and hide the old view as soon as a state change has started
	//      $(".waiting_box").removeClass(hideClass);
	//      $('.page').addClass(hideClass);
	//    });
	//  // Use '$viewContentLoaded' instead of '$stateChangeSuccess'.
	//  // When '$stateChangeSuccess' fires the DOM has not been rendered and you cannot directly query the elements from the new HTML
	//  // When '$viewContentLoaded' fires the new DOM has been rendered
	//  $rootScope.$on('$viewContentLoaded',
	//    function(event, toState, toParams, fromState, fromParams) {
	//      // Remove this if you want the loader + delayed view behavior when first entering the page
	//      if (!firstContentLoaded) {
	//        firstContentLoaded = true;
	//        return;
	//      }
	//      $timeout.cancel(timer);
	//      // Hide the new view as soon as it has rendered
	//      var page = $('.page');
	//      page.addClass(hideClass);
	//
	//      // Hide the loader and show the new view after a delay
	//      // Pass false as the third argument to prevent the digest loop from starting (since you are just modifying CSS there is no reason for Angular to perform dirty checking in this example)
	//      timer = $timeout(function() {
	//        page.removeClass(hideClass);
	//        $(".waiting_box").addClass(hideClass);
	//      }, delay, false);
	//    });
	//});
	
	//SPINNER-ENDS
	
	//router.config(function($routeProvider) {
	//    
	//    var header = {
	//					templateUrl: 'html/sidebar.html',
	//					controller: 'sidebarCtrl'
	//						
	//			}
	//  
	//			var footer = {
	//					templateUrl: 'html/footer.html',
	//					controller:'footerCtrl' 
	//
	//			}
	//
	//    $routeProvider
	//        .when('/', {
	//                header: header,
	//                controller: 'dashboardCtrl',
	//                templateUrl: 'html/dashboard.html',
	//                footer: footer
	//
	//            })
	//        .when('/city', {
	//            header: header,
	//            params: {
	//					cityname: null,
	//					locality:null,
	//					buliderId:null,
	//					reraId:null,
	//                    propName:null,
	//                    propeId:null
	//					},
	//            controller: 'cityCtrl',
	//            templateUrl: 'html/city.html',
	//            footer: footer
	//        })
	//        .otherwise({
	//            redirectTo: '/'
	//        });
	//    
	//    });
	
	
	router.config(["$stateProvider", "$urlRouterProvider", "$locationProvider",
			function ($stateProvider,$urlRouterProvider,$locationProvider) {
				
	
				var header = {
						templateUrl: 'html/sidebar.html',
						controller: 'sidebarCtrl'
							
				}
	  
				var footer = {
						templateUrl: 'html/footer.html',
						controller:'footerCtrl' 
	
				}
				$stateProvider.state('dashboard', {
					url: '/',
					title: 'Homes247.in | Properties in India | Realestate | Apartments/Villas/Plots for sale in India',
					description: 'Homes247.in-Best Realestate Website to buy properties in India.Apartments/Villas/Plots for sale- Ready to move,Ongoing,NewLaunch,Prelaunch Property in India.Find underconstruction Premium Luxury Affordable 1,2,3&4 bhk flats,residential projects,homes,house,sites,homeloans,interiors in Bangalore',
					keywords: 'Best Realestate Website in India, Buy properties in India, Best Residential Properties in India, Best Residential Projects in India, Apartments for Sale in India, New Launched Residential Projects in India, Under construction flats in India, Ongoing Residential Projects in India, Ready to Move flats for sale in India, Affordable Apartments in India, Property for sale in India, Budgeted Apartments in India, Flats for sale in India, Villas for sale in India, Plots for sale in India,Homes247.in',
					views: {
					header: header,
					content: {
						templateUrl: 'html/dashboard.html',
						controller: 'dashboardCtrl',
					},
					footer: footer
				}
					
				}).state('aboutus', {
					url: '/aboutus',
					title: "Meet Our Experts | Know more details About our Team | Homes247.in",
					description: "Details of Our Organisation, Employees along with their Roles and Responsibilites.",
					keywords: "Best Real Estate Consultant in Bangalore, Homes247.in, Real Estate Advisor in Bangalore, Property Consultant in Bangalore.",
					views: {
					header: header,
					content: {
						templateUrl: 'html/about-us.html',
						controller: 'aboutusCtrl'
					},
					footer: footer
					}
					
				}).state('cityInfo', {
					url: '/cityInfo',
					views: {
					header: header,
					content: {
						templateUrl: 'html/bangalore-city-info.html',
						controller: 'cityInfoCtrl'
					},
					footer: footer
				}
				}).state('newStory', {
					url: '/blogs/:title-:param',
					 params: {
						param:null,
						title:null,
					}, 
					views: {
					header: header,
					content: {
						templateUrl: 'html/newStories.html',
						controller: 'storiesCtrl'
					},
					 footer: footer
				}	
				}).state('property', {
					url: '/property/:cityname/:locality/:propName-:param',
					 params: {
						cityname: null,	
						citynameurl: null,
						locality:null,				
						param:null,
						propName:null,
					}, 
					views: {
					header: header,
					content: {
						templateUrl: 'html/property-details.html',
						controller: 'propertyCtrl'
					},
					footer: footer
				}
				}).state('city', {
					url: '/:cityname/property-sale',
					// url: '/city/Properties-in-:cityname',
					//url: '/city/:cityname/:locality/:buliderId/:reraId',
					 params: {
						cityname: {value: null},
						locality: {value: null},
						regionid:null,
						regionname:null,
						localitynameurl:null,
						localityname: null,
						buldername:null,
						buliderId:null,
						reraId:null,
						propName:null,
						propeId:null
						},
						
					views: {
					header: header,
					content: {
						templateUrl: 'html/city.html',
						abstract: true,
						controller: 'cityCtrl',
						//params: {new_param: null}
					},
					footer: footer
				}
				}).state('city.locality', {
					url: '-in-:localitynameurl-:locality',
					 params: {
						cityname: {value: null},
						locality: {value: null},
						localitynameurl:null,
						localityname: null,
						buldername:null,
						buliderId:null,
						regionid:null,
						regionname:null,
						reraId:null,
						propName:null,
						propeId:null
						},
						
					views: {
					header: header,
					content: {
						templateUrl: 'html/city.html',
						controller: 'cityCtrl',
					},
					footer: footer
				}
				}).state('builder', {
					url: '/:cityname/builder/:buldername-:buliderId',
					 params: {
						cityname: {value: null},
						locality: {value: null},
						localitynameurl:null,
						localityname: null,
						buldername:null,
						buliderId:null,
						regionid:null,
						regionname:null,
						reraId:null,
						propName:null,
						propeId:null
						},
						
					views: {
					header: header,
					content: {
						templateUrl: 'html/city.html',
						controller: 'cityCtrl',
					},
					footer: footer
				}
				}).state('zone', {
					url: '/:cityname/zone/:regionname-:regionid',
					 params: {
						cityname: {value: null},
						locality: {value: null},
						localitynameurl:null,
						localityname: null,
						buldername:null,
						buliderId:null,
						regionid:null,
						regionname:null,
						reraId:null,
						propName:null,
						propeId:null
						},
						
					views: {
					header: header,
					content: {
						templateUrl: 'html/city.html',
						controller: 'cityCtrl',
					},
					footer: footer
				}
				}).state('map', {
					url: '/map',
					views: {
					header: header,
					content: {
						templateUrl: 'html/map.html',
						controller: 'mapCtrl',
					},
					footer: footer
				}
				}).state('blogs', {
					url: '/blogs',
					title:'Get Latest Updates on Real Estate | Price | Trends in  Constructions Technology | Legislations on Real Estate | Homes247.in',
					description: 'Gets the Details of Latest Updates in Real Estate, Legal Rights, Price Trends in that area,Surrounding Developments.',
					keywords: 'Real Estate Blogs, Best Residential Blogs,Latest Updates on Residential Projects in Bangalore, Latest Images, Amenities, Specifications in this project.',
					views: {
					header: header,
					content: {
						templateUrl: 'html/blogss.html',
						controller: 'blogsCtrl'
					},
					footer: footer
					}
					
				}).state('builderPage', {
					url: '/builderPage',
					views: {
					header: header,
					content: {
					   templateUrl: 'html/builderPage.html',
					   controller: 'builderPageCtrl'
					},
					footer: footer
				}
					
					
				}).state('careers', {
					url: '/careers',
					title: "Build Your Career along with Homes247.in | Details of Current Openings and Position | Homes247.in",
					description: "Build Your Careers with Homes247.in, Fill in the Details along with your CV , Apply For you dream Job",
					keywords: "Job Openings in Bangalore, Sales and Marketing Jobs in Bangalore, Opening for Customer Suport Executive, Digital Marketing Jobs in Bangalore.",
					views: {
					header: header,
					content: {
						templateUrl: 'html/careers.html',
						controller: 'careersCtrl'
					},
					footer: footer
				}
					
					
				}).state('contactus', {
					url: '/contactus',
					title: "Fill in Your Details | Our Experts will call you back  in 5 Min | Homes247.in",
					description: "Feel Free to Drop an Enquiry and Our Experts will clear your doubts",
					keywords: "Homes247.in Contact Number, Homes247.in Email ID, Homes247.in Address.",
					views: {
					header: header,
					content: {
						templateUrl: 'html/contact-us.html',
						controller: 'contactUsCtrl'
					},
					footer: footer
				}
					
				}).state('calculator', {
					url: '/calculator',
					title: 'Home Loan | Homes247.in | Check Your EMI for your Loan',
					description: "Check out your Home Loan EMI through our EMI Calculator online and Plan your Monthly Installment. At Homes247.in we provide loan assistance also.",
					keywords: "Loan emi calculator, Emi calculator for home loan homes247.in, Emi calculator online, Emi calculator breakup, Home loan emi calculator, Emi calculator for loan, Emi calculator home, Emi calculator india",
					views: {
					header: header,
					content: {
					   templateUrl: 'html/emi-calculator.html',
						controller: 'calculatorCtrl'
					},
					footer: footer
				}
					
				}).state('homeloan', {
					url: '/homeloan',
					title: 'Details About Home Loan | Required Document for Home Loans | Loan Eligibilty | Homes247.in',
					description: "Get Details of the Loan Procedure, Check details of Eligibity for the Loan, Calculate EMI yourself and Plan Accordingly",
					keywords: "",
					views: {
					header: header,
					content: {
					   templateUrl: 'html/homeloan.html',
						controller: 'calculatorCtrl'
					},
					footer: footer
				}
					
					
				}).state('vaastu', {
					url: '/vaastu',
					title: 'Vaastu Tips | Complete Vaastu Tips for perfect Home| Homes247.in',
					description: "Get the details of Vaastu that must be implemented in the design of any residential space and select your dream home accordingly  to bring prosperity and positive energy into your life and Home.",
					keywords: "Vastu tips for home, Vastu tips for bedroom, Vastu tips for house homes247.in, Vaastu tips for kitchen, Vaastu tips while buying a flat, Vastu tips home entrance, Vastu tips while buying a house, Vastu tips for 1 bhk, Vastu tips for 2 bhk, Vastu tips for 3 bhk, Vastu tips for 4 bhk",
					views: {
					header: header,
					content: {
					   templateUrl: 'html/vaastutips.html',
						controller: 'calculatorCtrl'
					},
					footer: footer
				}
					
					
				}).state('rera', {
					url: '/rera',
					title: '',
					description: "",
					keywords: "",
					views: {
					header: header,
					content: {
						templateUrl: 'html/rera.html',
						controller: 'faqCtrl'
					},
					 footer: footer
				}
				}).state('interior', {
					url: '/interior',
					title: 'Interiors Design Tips | Interior Design Consultation in Bangalore-Homes247.in',
					description: "Are you looking for better interior designs for your home in Bangalore at affordable rates, Homes247.in will be there to assist you.",
					keywords: "Interior design for home, Interior designs, Famous interior designers in bangalore, Modern house interior design, Budget interior designers in bangalore, Interior design for living room, Interior design for kitchen, Interior decoration, Interior bedroom design, Interior Designing and Consultation homes247.in ",
					views: {
					header: header,
					content: {
					   templateUrl: 'html/interior.html',
						controller: 'calculatorCtrl'
					},
					footer: footer
				}
					
					
				}).state('news', {
					url: '/news',
					views: {
					header: header,
					content: {
					   templateUrl: 'html/news.html',
						controller: 'calculatorCtrl'
					},
					footer: footer
				}
					
				}) .state('faq', {
					url: '/faq',
					title: "Real Estate| Frequently Asked Questions | Homes247.in",
					description: "Obtain best solutions for all FAQ's related to Real Estate",
					keywords: "Real Estate FAQ's, Frequently Asked Questions About Real Estate-Homes247.in, Real Estate Terms,Latest Real Estate News.",
					views: {
					header: header,
					content: {
						templateUrl: 'html/faq.html',
						controller: 'faqCtrl'
					},
					footer: footer
				}
					
					
				}).state('login', {
					url: '/login',
					views: {
					header:{ 
						template: '<div></div>'
					},
					content: {
						templateUrl: 'html/login.html',
						controller: 'loginCtrl'
					},
					footer: { 
						template: '<div></div>'
					}
				}
					
					
				}).state('myaccounts', {
					url: '/myaccounts',
					views: {
					header: header,
					content: {
					   templateUrl: 'html/my-accounts.html',
					   controller: 'myaccountsCtrl'
					},
					footer: footer
				}
					
					
				}).state('myFav', {
					url: '/myFav',
					views: {
					header: header,
					content: {
					   templateUrl: 'html/my_fav.html',
					   controller: 'favCtrl'
					},
					footer: footer
				}
					
					
				}).state('setting', {
					url: '/setting',
					views: {
					header: header,
					content: {
					   templateUrl: 'html/account_setting.html',
					   controller: 'settingCtrl'
					},
					footer: footer
				}
					
					
				}).state('recentlyView', {
					url: '/recentlyView',
					views: {
					header: header,
					content: {
					   templateUrl: 'html/recently_viewed.html',
					   controller: 'recentlyViewedCtrl'
					},
					footer: footer
				}
					
					
				}).state('referEarn', {
					url: '/referEarn',
					title: '',
					description: "",
					keywords: "",
					views: {
					header: header,
					content: {
					   templateUrl: 'html/refer_earn.html',
					   controller: 'referEarnCtrl'
					},
					footer: footer
				}
					
					
				}).state('services', {
					url: '/services',
					views: {
					header: header,
					content: {
					  templateUrl: 'html/nri-services.html',
					  controller: 'servicesCtrl'
					},
					footer: footer
					
					}
				}).state('expert-service', {
					url: '/expert-service',
					title: "Details about our Customised Services | Enquiry here for all Service related to Home | Homes247.in",
					description: "We at homes247.in provide end to end assistance for our customers and help them right from the property enquiry stage till they own it. ",
					keywords: "Expert services & consulting, Expert services and solutions homes247.in, Expert Services for end to end assistance to customers, Expert services assistance homes247.in, Expert Services homes247.in",
					views: {
					header: header,
					content: {
					  templateUrl: 'html/expert.html',
					  controller: 'servicesCtrl'
					},
					footer: footer
					
					}
				}).state('buyers-guide', {
					url: '/buyers-guide',
					title: 'Essential Facts to enquire before you Buy a Property | Home Buyers Guide | Homes247.in',
					description: "Get all your home development related inquiries cleared  by  experts at homes247.in. we provide overall assistance for our customers  in every  stage till they own their dream home.",
					keywords: "Homes Buyers Guide homes247.in, first home buyers guide, new home buyers guide , home buyers information guide, home buying steps guide, home buying guide bangalore, home buying guide india",
					views: {
					header: header,
					content: {
					  templateUrl: 'html/guide.html',
					  controller: 'servicesCtrl'
					},
					footer: footer
					
					}
				}).state('latest-trends', {
					url: '/latest-trends',
					title: 'Latest Updates on Real Estate|Real Estate Market | Price Trends in Real Estate | Homes247.in',
					description: "Find overall price trends and Guidance on land, Property, Buyers/Sellers and NRIs (Non-Resident Indian) in India in Homes247.in",
					keywords: "Latest Real Estate Trends homes247.in, latest real estate marketing trends, current real estate trends in bangalore, latest real estate trends in bangalore, Latest real estate trends in 2019, Latest real estate trends Bangalore",
					views: {
					header: header,
					content: {
					  templateUrl: 'html/trend.html',
					  controller: 'servicesCtrl'
					},
					footer: footer
					
					}
				}).state('Buy', {
					url: '/Buy',
					title: 'Best Places to Buy |Get the Latest Updates about the Real Estate Price in your Area | Homes247.in',
					description: "Get to know about the best place to invest from our expert in Homes247.in",
					keywords: "Best Locality to Invest homes247.in, best locality to invest in bangalore, best locality to invest in pune, best areas to invest in bangalore, where to invest in bangalore, affordable housing in bangalore, where to buy flat in bangalore",
					views: {
					header: header,
					content: {
					  templateUrl: 'html/buy.html',
					  controller: 'servicesCtrl'
					},
					footer: footer
					
					}
				}).state('price-trends', {
					url: '/price-trends',
					title: '',
					description: "Discover property costs & trends at Homes247.in and we will help you get the best property.",
					keywords: "Price Trends bangalore homes247.in, price trends in bangalore, property price trends in bangalore, bangalore real estate market trends, property rates in bangalore area wise ",
					views: {
					header: header,
					content: {
					  templateUrl: 'html/pricetrend.html',
					  controller: 'servicesCtrl'
					},
					footer: footer
					
					}
				}).state('offers', {
					url: '/offers',
					title: 'Find The Best offers on Residential Projects today in India at Homes247.in',
					description: "Find Some of the most  exciting Discount and  Schemes,The Best offers on Residential Projects today in India at Homes247.in",
					keywords: "Best offers on Residential Projects, Homes247.in, Most exciting Discount and Schemes In Real estate in India, Apartments, Villa,Flats On Sale, Best offer on 1,2,3 Bhk Apartments",
					views: {
					header: header,
					content: {
					  templateUrl: 'html/offers.html',
					  controller: 'offersCtrl'
					},
					footer: footer
					
					}
					
					
				}).state('policy', {
					url: '/policy',
					title: '',
					description: "",
					keywords: "Homes247.in Policy Page.",
					views: {
					header: header,
					content: {
						templateUrl: 'html/privacy-poilicy.html',
						controller: 'policyCtrl'
					},
					footer: footer
				}
					
				}).state('similarprop', {
					url: '/similarproperty',
					//url: '/similarproperty:param',
					 params: {
						param:null,
					}, 
					views: {
					header: header,
					content: {
						templateUrl: 'html/similar_property.html',
						controller: 'propertyCtrl'
					},
					footer: footer
				}
					
					
					
				}).state('enquiry', {
					url: '/enquiry',
					//url: '/enquiry:param',
					 params: {
						param:null,
					}, 
					views: {
					header: header,
					content: {
						templateUrl: 'html/enquiry.html',
						controller: 'propertyCtrl'
					},
					footer: footer
				}
					
					
					
				}).state('signUp', {
					url: '/signUp',
					views: {
					header: {
						template:'<div></div>'
					},
					content: {
						templateUrl: 'html/sign-up.html',
						controller: 'signUpCtrl'
					},
					footer: {
						template:'<div></div>'
					}
				}
					
					
				}).state('forgotPassword', {
					url: '/forgotPassword?token',
					views: {
					 header: header,
					content: {
						templateUrl: 'html/forgot-pwd.html',
						controller: 'fpwdCtrl'
					},
					footer: footer
				   
				}
					
					
				}).state('disclaimer', {
					url: '/disclaimer',
					title: '',
					description: "",
					keywords: "",
					views: {
					header: header,
					content: {
						templateUrl: 'html/disclaimer.html',
						controller: 'policyCtrl'
					},
					 footer: footer
				}
					
					
				})
				
				$urlRouterProvider.otherwise('/');
			//    $locationProvider.hashPrefix('');
				$locationProvider.html5Mode(true);
			}]);
	
	   
	
	//});
	