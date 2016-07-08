'use strict';

app.controller('MyAppController', function MyAppController($scope) {
	$scope.phones = [
		{
			name : 'Nexus S',
			snippet: 'Fast just got faster with Nexus S'
		}, {
			name : 'Motorola', 
			snippet: 'Fast just got faster with Motorola'
		}, {
			name : 'Tablet',
			snippet: 'Motorola Tablet'
		}
	];
});
