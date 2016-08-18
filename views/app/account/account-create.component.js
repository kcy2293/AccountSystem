'use strict';
angular
  .module('account-create', [
  ])
  .component('accountCreate', {
    templateUrl: 'app/account/account-create.template.html',
    controller: accountController
  });

function accountController($scope, $http, $location, $mdToast, moment) {
  var self = this;

	var paths = $location.path().split('/');
	var dateStr = paths[paths.length - 1];
	var accountDate = new moment(dateStr);
	var accountStartDate = new moment(dateStr).subtract(6,'days').set('hour', 0).set('minute', 0);
	var accountEndDate = new moment(dateStr).add(1,'days').set('hour', 0).set('minute', 0);

	/***********************
	  setting item 조회
	 ***********************/
	var settings;
	$http.get('/api/setting/').then(function(res) {
		settings = res.data;
	});

	/***********************
	  기간별 예약서 조회
	 ***********************/
	var config = {
		params: {
			from : accountStartDate.toISOString(),
			to : accountEndDate.toISOString()
		},
		headers: {'Accept' : 'application/json'}
	};
	$http.get('/api/reservation/', config).then(function(res) {
		console.log(res);
		self.list = res.data;
    for (var i = 0, len = self.list.length ; i < len ; i++){
      self.list[i].docoDate = new Date(self.list[i].decoDate);
      self.list[i].day = moment(self.list[i].decoDate).format('M/D(dd)');
    }
	});
	/***********************
	  정산서 타이틀 기간 입력
	 ***********************/
	self.period = accountStartDate.format("M/D(dd)") + " ~ " + accountDate.format("M/D(dd)");

	/***********************
	  화면 이벤트
	 ***********************/
	self.changePrevDate = changePrevDate;
	self.changeNextDate = changeNextDate;

	function changePrevDate() {
		var prevDateStr = new moment(dateStr).subtract(7, 'days').format('YYYYMMDD');
		$location.url('/account-create/'+ prevDateStr);
	}
	function changeNextDate() {
		var nextDateStr = new moment(dateStr).add(7, 'days').format('YYYYMMDD');
		$location.url('/account-create/'+ nextDateStr);
	}
}
