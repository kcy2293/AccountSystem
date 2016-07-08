'use strict';

angular
	.module('myApp', [
		'ngMaterial'
	])
	.component('phoneList', {
		templateUrl: 'app/phone-list/phone-list.template.html',
		controller: function PhoneListController() {
			this.phones = [
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
		}
	});

