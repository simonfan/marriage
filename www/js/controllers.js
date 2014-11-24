angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', ['$scope', 'Style', function($scope, Styl_) {


}])

.controller('EditorCtrl', ['$scope', 'Style', function($scope, Styl_) {



	$scope.variables = Styl_.variables;

	$scope.applyVariables = function () {
		Styl_.applyVariables(Styl_.variables);
	}

}])

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
});
