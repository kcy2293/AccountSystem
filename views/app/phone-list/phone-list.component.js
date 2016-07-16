'use strict';

angular
	.module('phoneList', [
		'ngMaterial'
	])
	.component('phoneList', {
		templateUrl: 'app/phone-list/phone-list.template.html',
		controller: function PhoneListController($http) {
			var self = this;
			self.orderProp = 'age';

			$http.get('/app/data/phones.json').then(function(res) {
				self.phones = res.data;
			});
		}
	});
