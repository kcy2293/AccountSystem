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
		self.tabList = res.data;
    for (var i = 0, len = self.tabList.length ; i < len ; i++){
      self.tabList[i].docoDate = new Date(self.tabList[i].decoDate);
      self.tabList[i].day = moment(self.tabList[i].decoDate).format('M/D(dd)');
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
	self.calc = calc;

	function changePrevDate() {
		var prevDateStr = new moment(dateStr).subtract(7, 'days').format('YYYYMMDD');
		$location.url('/account-create/'+ prevDateStr);
	}
	function changeNextDate() {
		var nextDateStr = new moment(dateStr).add(7, 'days').format('YYYYMMDD');
		$location.url('/account-create/'+ nextDateStr);
	}
	function calc() {
		if (self.tabList.length < 1) {
			$mdToast.showSimple("입력된 예약서가 없습니다.");
		}

		self.account = {};
		self.account.expenseList = [];
		self.account.incomeList = [];

		for (var i = 0, priceList, len = self.tabList.length ; i < len ; i++){ 
			priceList = self.tabList[i].priceList;
			for (var j = 0, jlen = priceList.length ; j < jlen ; j++) {
				// expense list
				if (priceList[j].hasOwnProperty('fee')) {
					buildExpenseList(priceList[j]);
				}

				// income list
				if (priceList[j].hasOwnProperty('sell')) {
				}
			}
		}

		/*
		for (var i = 0, len = self.account.expenseList.length ; i < len ; i++) {
			console.log(self.account.expenseList[i].groupName, self.account.expenseList[i].totalFee);
		}
		*/
	}

	var expenseNames = {
		'decoLoc': '전속커미션',
		'decoType': '소품수리비',
		'decoFruit': '생과일',
		'decoRcake': '떡케익',
		'optDress': '돌복수선비',
		'optMC': 'MC커미션',
		'optMovie': '성장동영상'
	};

	function buildExpenseList(obj) {
		// 1. 그룹이 있는지 확인
		var groupIndex = _.findLastIndex(self.account.expenseList, {group: obj.group});
		if (groupIndex < 0 ) {
			// 2. 없으면 push
			if (Number(obj.fee) !== 0) {
				self.account.expenseList.push({
					group: obj.group,
					groupName: expenseNames[obj.group] || "총지출",
					itemList: [{
						name: obj.item,
						fee: Number(obj.fee)
					}],
					totalFee: Number(obj.fee)
				});
			}
		} else {
			// 3. 있으면 itemList에 item 이 있는지 확인
			var itemList = self.account.expenseList[groupIndex].itemList;
			var itemIndex = _.findLastIndex(itemList, {name: obj.item});
			if (itemIndex < 0) {
				// 4. 없으면 push
				if (Number(obj.fee) !== 0) {
					itemList.push({
						name: obj.item,
						fee: Number(obj.fee)
					});
				}
			} else {
				// 5. 있으면 합산
				itemList[itemIndex].fee = Number((Number(itemList[itemIndex].fee) + Number(obj.fee)).toFixed(1));
			}
			// 6. 총 합산은 있으나 없으나 더함
			self.account.expenseList[groupIndex].totalFee = Number((Number(self.account.expenseList[groupIndex].totalFee) + Number(obj.fee)).toFixed(1));
		}
	}

}
