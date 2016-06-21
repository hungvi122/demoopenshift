var app = angular.module('flapperNews', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/html/home.ejs',
      controller: 'MainCtrl',
      resolve: {
	    postPromise: ['posts', function(posts){
	      return posts.getAll();
	    }]
	  }
    })
	
	.state('auction/all', {
      url: '/auction/all',
      templateUrl: '/html/home.ejs',
      controller: 'MainCtrl',
      resolve: {
	    postPromise: ['posts', function(posts){
	      return posts.getAll();
	    }]
	  }
    })
	.state('auction/technology', {
      url: '/auction/technology',
      templateUrl: '/html/auctiontechnology.ejs',
      controller: 'MainCtrl',
      resolve: {
	    postPromise: ['posts', function(posts){
	      return posts.getAll();
	    }]
	  }
    })
	.state('auction/fashion', {
      url: '/auction/fashion',
      templateUrl: '/html/auctionfashion.ejs',
      controller: 'MainCtrl',
      resolve: {
	    postPromise: ['posts', function(posts){
	      return posts.getAll();
	    }]
	  }
    })
	.state('auction/hot', {
      url: '/auction/hot',
      templateUrl: '/html/auctionhot.ejs',
      controller: 'MainCtrl',
      resolve: {
	    postPromise: ['posts', function(posts){
	      return posts.getAll();
	    }]
	  }
    })
	.state('done/all', {
      url: '/done/all',
      templateUrl: '/html/done.ejs',
      controller: 'DoneProductCtrl',
      resolve: {
	    postPromise: ['posts', function(posts){
	      return posts.getAll();
	    }]
	  }
    })
	.state('done/technology', {
      url: '/done/technology',
      templateUrl: '/html/donetechnology.ejs',
      controller: 'DoneTechnologyCtrl',
      resolve: {
	    postPromise: ['posts', function(posts){
	      return posts.getAll();
	    }]
	  }
    })
	.state('done/fashion', {
      url: '/done/fashion',
      templateUrl: '/html/donefashion.ejs',
      controller: 'DoneFashionCtrl',
      resolve: {
	    postPromise: ['posts', function(posts){
	      return posts.getAll();
	    }]
	  }
    })
	.state('done/hot', {
      url: '/done/hot',
      templateUrl: '/html/donehot.ejs',
      controller: 'DoneHotCtrl',
      resolve: {
	    postPromise: ['posts', function(posts){
	      return posts.getAll();
	    }]
	  }
    })
    .state('posts', {
	  url: '/posts/{id}',
	  templateUrl: '/index.html',
	  controller: 'PostsCtrl',
	  resolve: {
	    post: ['$stateParams', 'posts', function($stateParams, posts) {
	      //alert($stateParams.id);
		  return posts.get($stateParams.id);
	    }]
	  }
	})
	.state('login', {
  url: '/login',
  templateUrl: '/html/login.ejs',
  controller: 'AuthCtrl',
  onEnter: ['$state', 'auth', function($state, auth){
    if(auth.isLoggedIn()){
      $state.go('home');
    }
  }]
})
.state('register', {
  url: '/register',
  templateUrl: '/html/register.ejs',
  controller: 'AuthCtrl',
  onEnter: ['$state', 'auth', function($state, auth){
    if(auth.isLoggedIn()){
      $state.go('home');
    }
  }]
})
.state('product', {
	  url: '/product/{id}',
	  templateUrl: '/html/product.ejs',
	  controller: 'ProductCtrl',
	  resolve: {
	    postPromise: ['posts', function(posts){
	      return posts.getAll();
	    }]
	  }
	})
	.state('rule', {
	  url: '/rule',
	  templateUrl: '/html/rule.ejs',
	  controller:''
	})
	.state('email', {
	  url: '/email',
	  templateUrl: '/html/email.ejs',
	  controller:''
	})
	.state('about', {
	  url: '/about',
	  templateUrl: '/html/about.ejs',
	  controller:''
	})
	.state('phidangki', {
	  url: '/phidangki',
	  templateUrl: '/html/phidangki.ejs',
	  controller:''
	})
	.state('done', {
	  url: '/done',
	  templateUrl: '/html/done.ejs',
	  controller: 'DoneProductCtrl',
	  resolve: {
	    postPromise: ['posts', function(posts){
	      return posts.getAll();
	    }]
	  }
	})
		.state('forgetpass', {
  url: '/forgetpass',
  templateUrl: '/html/forgetpass.ejs',
  controller: 'ForgetCtrl',
  resolve: {
	    postPromise: ['posts', function(posts){
	      return posts.getAll();
	    }]
	  }
});

  $urlRouterProvider.otherwise('home');
}]);

/* Controllers */

app.controller('MainCtrl', [
'$scope',
'posts',
'auth',
function($scope, posts, auth){
  $scope.posts = posts.posts;
  $scope.isLoggedIn = auth.isLoggedIn;

	$scope.addPost = function(){
	  if(!$scope.title || $scope.title === '') { return; }
	  posts.create({
	    title: $scope.title,
	    link: $scope.link,
	  });
	  $scope.title = '';
	  $scope.link = '';
	};

	$scope.incrementUpvotes = function(post) {
	  posts.upvote(post);
	};
}]);

app.controller('PostsCtrl', [
'$scope',
'posts',
'post',
'auth',
function($scope, posts, post, auth){
	alert(posts.get($stateParams.id));
	$scope.post = post;
	$scope.isLoggedIn = auth.isLoggedIn;
	
	$scope.addComment = function(){
	  if($scope.body === '') { return; }
	  posts.addComment(post._id, {
	    body: $scope.body,
	    author: 'user',
	  }).success(function(comment) {
	    $scope.post.comments.push(comment);
	  });
	  $scope.body = '';
	};

	$scope.incrementUpvotes = function(comment){
	  posts.upvoteComment(post, comment);
	};
}]);

app.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
	 
  $scope.user = {};

  $scope.register = function(){
  	$scope.submitted = true;
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
  	$scope.submitted = true;
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}]);

app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);



/* Factory Services */
app.factory('posts', ['$http', 'auth', function($http, auth){
  var o = {
    posts: []
  };

  o.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.posts);
    });
  };

  o.create = function(post) {
	  return $http.post('/posts', post, {
    	headers: {Authorization: 'Bearer '+auth.getToken()}
  	}).success(function(data){
	    o.posts.push(data);
	  });
	};

	o.upvote = function(post) {
		return $http.put('/posts/' + post._id + '/upvote', null, {
    	headers: {Authorization: 'Bearer '+auth.getToken()}
  	}).success(function(data){
		  post.upvotes += 1;
		});
	};

	o.get = function(id) {
	  return $http.get('/posts/' + id).then(function(res){
	    return res.data;
	  });
	};

	o.addComment = function(id, comment) {
	  return $http.post('/posts/' + id + '/comments', comment, {
    	headers: {Authorization: 'Bearer '+auth.getToken()}
  	});
	};

	o.upvoteComment = function(post, comment) {
	  return $http.put('/posts/'+ post._id + '/comments/'+ comment._id + '/upvote', null, {
    	headers: {Authorization: 'Bearer '+auth.getToken()}
  	}).success(function(data){
	      comment.upvotes += 1;
	    });
	};

  return o;
}]);

app.factory('auth', ['$http', '$window', function($http, $window){
   var auth = {};

	auth.saveToken = function (token){
	  $window.localStorage['flapper-news-token'] = token;
	};

	auth.getToken = function (){
	  return $window.localStorage['flapper-news-token'];
	};

	auth.isLoggedIn = function(){
	  var token = auth.getToken();
	  //console.log(token);
	  if(token){
	    var payload = JSON.parse($window.atob(token.split('.')[1]));
		
	    var k = payload.exp > Date.now() / 1000;
		
		return k;
	  } else {
	    return false;
	  }
	};

	auth.currentUser = function(){
	  if(auth.isLoggedIn()){
	    var token = auth.getToken();
	    var payload = JSON.parse($window.atob(token.split('.')[1]));

	    return payload.username;
	  }
	};

	auth.register = function(user){
	  return $http.post('/register', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};
	

	auth.logIn = function(user){
	  return $http.post('/login', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};

	auth.logOut = function(){
	  $window.localStorage.removeItem('flapper-news-token');
	};

  return auth;
}]);


app.factory('socket', function() {
	var socket = io.connect('http://localhost:3000');
	return socket;
});

app.factory('dataService', [
	'$http',
	function($http){
		var o = {
			products: [],
			currentPrice: [],
			currentProduct :{},
			productRelate:[],
			productFinish:[]
		};

		o.getAuctionHistory = function() {
			return $http.get('/history').success(function(data) {
				angular.copy(data, o.products);
			});
		};
		o.getAuctionHistoryTechnology = function() {
			return $http.get('/historyTechnology').success(function(data) {
				angular.copy(data, o.products);
			});
		};
		o.getAuctionHistoryHot = function() {
			return $http.get('/historyHot').success(function(data) {
				angular.copy(data, o.products);
			});
		};
		o.getAuctionHistoryFashion = function() {
			return $http.get('/historyFashion').success(function(data) {
				angular.copy(data, o.products);
			});
		};
		o.getproductFinishAll = function() {
			return $http.get('/done').success(function(data) {
				angular.copy(data, o.productFinish);
			});
		};
		o.getproductFinishFashion = function() {
			return $http.get('/donefashion').success(function(data) {
				angular.copy(data, o.productFinish);
			});
		};
		o.getproductFinishTechnology = function() {
			return $http.get('/donetechnology').success(function(data) {
				angular.copy(data, o.productFinish);
			});
		};
		o.getproductFinishHot = function() {
			return $http.get('/donehot').success(function(data) {
				angular.copy(data, o.productFinish);
			});
		};
		o.getCurrentPrice = function() {
			return $http.get('/currentPrice').success(function(data) {
				angular.copy(data, o.currentPrice);
			});
		};
		o.getProduct = function(id) {
			return $http.get('/product/' + id.toString()).success(function(data) {
				angular.copy(data, o.currentProduct);
				//console.log(o.currentProduct);
			});
		};
		o.getProductRelative = function(id) {
			return $http.get('/productrelate/' + id.toString()).success(function(data) {
				angular.copy(data, o.productRelate);
			});
		
		};
		o.updatedata = function(email){
			return $http.get('/updatepass/'+email.toString()).success(function(data) {
				 
			});
		};
		

		return o;
}]);


//---------------------
app.controller('ProductCtrl', [
'$scope','$stateParams','auth','dataService','socket',
	function($scope, $stateParams,auth,dataService,socket){
	$scope.id = $stateParams.id;
	$scope.currentUser = auth.currentUser;
	dataService.getProduct($scope.id);	
	$scope.currentProduct = dataService.currentProduct;
	dataService.getProductRelative($scope.id);
	$scope.productRelative = dataService.productRelate;
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.checkLogin = function(bid){
		if( bid == 0 && $scope.isLoggedIn())
		return  true;
	return false;
	};
	$scope.CheckBID = function(isbid){
			if(isbid == 1)
				return true;
			return false;
		};
	$scope.submitAuction = function(id) {
		
		 var user = $scope.currentUser();
		 console.log(user);
		console.log('#' + id.toString() +'.newPrice');
		var price = angular.element( $( '#' + id.toString() +'.newPrice' ) ).val();
		 
		socket.emit('new auction',id,price,user);
	};
	$scope.submitAuction2 = function(id, price) {
		var user = $scope.currentUser();
		 console.log(user);
			if (confirm('Bạn có muốn BID giá cao nhất?')) {
				// Save it!
				socket.emit('new auction',id,price, user );
			} else {
				 
			}
		
	};
		socket.on('new price', function(data) {
			
			dataService.getProduct($scope.id);
		});
		
		socket.on('timeOut', function(id,data) {
			$scope.$apply(function() {
				$scope.errMessage = data;
			});
		});
}]);

app.controller('ForgetCtrl', [
'$scope','dataService','$state',
	function($scope, dataService, $state){
	 
	$scope.forgetpass = function(){
		console.log($scope.email);
		dataService.updatedata($scope.email);
		$state.go('home');
	}	
		 
}]);
app.controller('auctionCtrl', [
	'$scope',
	'$stateParams','auth',
	'dataService',
	'socket',
	function($scope,$stateParams,auth, dataService, socket) {
		// INIT DATA
		dataService.getAuctionHistory();
		dataService.getCurrentPrice();
		$scope.currentUser = auth.currentUser;
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.checkLogin = function(bid){
			if( bid == 0 && $scope.isLoggedIn())
			return  true;
			return false;
		};
		$scope.CheckBID = function(isbid){
			if(isbid == 1)
				return true;
			return false;
		};
		$scope.currentPrice = dataService.currentPrice;
		 
		$scope.products = dataService.products;
		$scope.errMessage = '';
		$scope.datatime = [];

		// ADD NEW DATA
		$scope.submitAuction = function(id) {
			var user = $scope.currentUser();
		 console.log(user);
			
			/* console.log(id)
			var myEl = angular.element( $( '#Hello' ) ).val();
			console.log(myEl); */
			console.log('#' + id.toString() +'.newPrice');
			var price = angular.element( $( '#' + id.toString() +'.newPrice' ) ).val();
			console.log(price);
			socket.emit('new auction',id,price,user);
		};
		$scope.submitAuction2 = function(id, price) {
			var user = $scope.currentUser();
		 console.log(user);
			if (confirm('Bạn có muốn BID giá cao nhất?')) {
				// Save it!
				socket.emit('new auction',id,price,user);
			} else {
				// Do nothing!
			}
		
	};
		socket.on('new price', function(data) {
			dataService.getAuctionHistory();
			dataService.getCurrentPrice();
			//dataService.getProduct(id);
		});
		/* socket.on('timeCount', function(id,data){
        initializeClock('clockdiv', data);
		console.log(data);
		}); */
		socket.on('timeOut', function(id,data) {
			$scope.$apply(function() {
				
				
			});
		});
	}
]);

app.controller('AuctionFashionCtrl', [
	'$scope',
	'$stateParams','auth',
	'dataService',
	'socket',
	function($scope,$stateParams,auth, dataService, socket) {
		// INIT DATA
		dataService.getAuctionHistoryFashion();
		dataService.getCurrentPrice();
		$scope.currentUser = auth.currentUser;
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.checkLogin = function(bid){
			if( bid == 0 && $scope.isLoggedIn())
			return  true;
			return false;
		};
		$scope.CheckBID = function(isbid){
			if(isbid == 1)
				return true;
			return false;
		};
		$scope.currentPrice = dataService.currentPrice;
		 
		$scope.products = dataService.products;
		$scope.errMessage = '';
		$scope.datatime = [];

		// ADD NEW DATA
		$scope.submitAuction = function(id) {
			var user = $scope.currentUser();
		 console.log(user);
			
			/* console.log(id)
			var myEl = angular.element( $( '#Hello' ) ).val();
			console.log(myEl); */
			console.log('#' + id.toString() +'.newPrice');
			var price = angular.element( $( '#' + id.toString() +'.newPrice' ) ).val();
			console.log(price);
			socket.emit('new auction',id,price,user);
		};
		$scope.submitAuction2 = function(id, price) {
			var user = $scope.currentUser();
		 console.log(user);
			if (confirm('Bạn có muốn BID giá cao nhất?')) {
				// Save it!
				socket.emit('new auction',id,price,user);
			} else {
				// Do nothing!
			}
		
	};
		socket.on('new price', function(data) {
			dataService.getAuctionHistoryFashion();
			dataService.getCurrentPrice();
			//dataService.getProduct(id);
		});
		/* socket.on('timeCount', function(id,data){
        initializeClock('clockdiv', data);
		console.log(data);
		}); */
		socket.on('timeOut', function(id,data) {
			$scope.$apply(function() {
				
				
			});
		});
	}
]);
app.controller('AuctionTechnologyCtrl', [
	'$scope',
	'$stateParams','auth',
	'dataService',
	'socket',
	function($scope,$stateParams,auth, dataService, socket) {
		// INIT DATA
		dataService.getAuctionHistoryTechnology();
		dataService.getCurrentPrice();
		$scope.currentUser = auth.currentUser;
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.checkLogin = function(bid){
			if( bid == 0 && $scope.isLoggedIn())
			return  true;
			return false;
		};
		$scope.CheckBID = function(isbid){
			if(isbid == 1)
				return true;
			return false;
		};
		$scope.currentPrice = dataService.currentPrice;
		 
		$scope.products = dataService.products;
		$scope.errMessage = '';
		$scope.datatime = [];

		// ADD NEW DATA
		$scope.submitAuction = function(id) {
			var user = $scope.currentUser();
		 console.log(user);
			
			/* console.log(id)
			var myEl = angular.element( $( '#Hello' ) ).val();
			console.log(myEl); */
			console.log('#' + id.toString() +'.newPrice');
			var price = angular.element( $( '#' + id.toString() +'.newPrice' ) ).val();
			console.log(price);
			socket.emit('new auction',id,price,user);
		};
		$scope.submitAuction2 = function(id, price) {
			var user = $scope.currentUser();
		 console.log(user);
			if (confirm('Bạn có muốn BID giá cao nhất?')) {
				// Save it!
				socket.emit('new auction',id,price,user);
			} else {
				// Do nothing!
			}
		
	};
		socket.on('new price', function(data) {
			dataService.getAuctionHistoryTechnology();
			dataService.getCurrentPrice();
			//dataService.getProduct(id);
		});
		/* socket.on('timeCount', function(id,data){
        initializeClock('clockdiv', data);
		console.log(data);
		}); */
		socket.on('timeOut', function(id,data) {
			$scope.$apply(function() {
				
				
			});
		});
	}
]);
app.controller('AuctionHotCtrl', [
	'$scope',
	'$stateParams','auth',
	'dataService',
	'socket',
	function($scope,$stateParams,auth, dataService, socket) {
		// INIT DATA
		dataService.getAuctionHistoryHot();
		dataService.getCurrentPrice();
		$scope.currentUser = auth.currentUser;
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.checkLogin = function(bid){
			if( bid == 0 && $scope.isLoggedIn())
			return  true;
			return false;
		};
		$scope.CheckBID = function(isbid){
			if(isbid == 1)
				return true;
			return false;
		};
		$scope.currentPrice = dataService.currentPrice;
		 
		$scope.products = dataService.products;
		$scope.errMessage = '';
		$scope.datatime = [];

		// ADD NEW DATA
		$scope.submitAuction = function(id) {
			var user = $scope.currentUser();
		 console.log(user);
			
			/* console.log(id)
			var myEl = angular.element( $( '#Hello' ) ).val();
			console.log(myEl); */
			console.log('#' + id.toString() +'.newPrice');
			var price = angular.element( $( '#' + id.toString() +'.newPrice' ) ).val();
			console.log(price);
			socket.emit('new auction',id,price,user);
		};
		$scope.submitAuction2 = function(id, price) {
			var user = $scope.currentUser();
		 console.log(user);
			if (confirm('Bạn có muốn BID giá cao nhất?')) {
				// Save it!
				socket.emit('new auction',id,price,user);
			} else {
				// Do nothing!
			}
		
	};
		socket.on('new price', function(data) {
			dataService.getAuctionHistoryHot();
			dataService.getCurrentPrice();
			//dataService.getProduct(id);
		});
		/* socket.on('timeCount', function(id,data){
        initializeClock('clockdiv', data);
		console.log(data);
		}); */
		socket.on('timeOut', function(id,data) {
			$scope.$apply(function() {
				
				
			});
		});
	}
]);


// done
app.controller('DoneProductCtrl', [
'$scope','dataService',
	function($scope, dataService){
	 
	dataService.getproductFinishAll();	
	$scope.product = dataService.productFinish;
	  
}]);
app.controller('DoneFashionCtrl', [
	'$scope','dataService',
	
	function($scope, dataService){
	 
	dataService.getproductFinishFashion();	
	$scope.product = dataService.productFinish;
	}
]);
app.controller('DoneTechnologyCtrl', [
	'$scope','dataService',
	function($scope, dataService){
	 
	dataService.getproductFinishTechnology();	
	$scope.product = dataService.productFinish;
	}
	]);
app.controller('DoneHotCtrl', [
	'$scope','dataService',
	function($scope, dataService){
	 
	dataService.getproductFinishHot();	
	$scope.product = dataService.productFinish;
	}
]);