'use strict';
angular
  .module('reserv-create', [
  ])
  .component('reservCreate', {
    templateUrl: 'app/reservation/reserv-create.template.html',
    controller: reservController
  });

function reservController($scope, $http, $mdToast) {
  var self = this;
	initReserv();

  $http.get('/api/setting/').then(function(res) {
    self.settings = res.data;

    var pays = self.settings.pay;
		if (pays) {
			var role = [];
			for (var i = 0, len = pays.length ; i < len ; i++) {
				if (role.indexOf(pays[i].role) < 0) {
					role.push(pays[i].role);
				}
			}
			self.role = role;
		}
  });

  $http.get('/api/users/').then(function(res) {
    self.users = res.data;
    /*
    var ranks = [];
    for (var i = 0, len = self.users.length ; i < len ; i++) {
      if (ranks.indexOf(self.users[i].rank) < 0) {
        ranks.push(self.users[i].rank);
      }
    }
    self.ranks = ranks;
    */
  });

  //window.DEBUG = self;

	self.companyChange = companyChange;
	self.decoTypeChange = decoTypeChange;
	self.decoLocChange = decoLocChange;
	self.menuTableChange = menuTableChange;
  self.decoNameChange = decoNameChange;
	self.decoFruitChange = decoFruitChange;
	self.decoRcakeChange = decoRcakeChange;
	self.decoPhotoChange = decoPhotoChange;
	self.optDressChange = optDressChange;
	self.optMCChange = optMCChange;
	self.optMovieChange = optMovieChange;
	self.optOtherChange = optOtherChange;
	self.optOutgoingFeeChange = optOutgoingFeeChange;
	self.optDiscountChange = optDiscountChange;
	self.depositChange = depositChange;
	self.save = save;

	self.getJsonLen = function(json) {
		if (json) {
			return Object.items(json).length;
		} else {
			return 0;
		}
	};

	/****************
    예약서 정보 초기화
	 ****************/
	function initReserv() {
		self.reserv = {
			deposit : 5,
			balance : 0
		};
	}
	/****************************
	 담당사업자 변경시 잔금 반영
	 ***************************/
	function companyChange() {
		if (self.reserv.company == "파티리움") {
			self.reserv.deposit = 10;
		} else {
			self.reserv.deposit = 5;
		}
		calc();
	}

	/****************
	 패키지 선택시
	 ****************/
	function menuTableChange() {
		var item = _.findWhere(self.settings.menuTable, {name: self.reserv.menuTable});
		self.reserv.decoType = item.decoType;
		self.reserv.decoFruit = [item.decoFruit];
		self.reserv.decoRcake = (item.decoRcake).split(',');
		self.reserv.optDiscount = (item.optDiscount).split(',');

		calc();
	}
  function decoNameChange() {
		var item = _.findWhere(self.settings.decoName, {name: self.reserv.decoName});
    if (item.imgName) {
      self.reserv.decoImage = item.imgName;
    }
  }
	function decoTypeChange() {
		calc();
	}
	function decoLocChange() {
		calc();
	}
	function decoFruitChange() {
		calc();
	}
	function decoRcakeChange() {
		calc();
	}
	function decoPhotoChange() {
		calc();
	}
	function optDressChange() {
		calc();
	}
	function optMCChange() {
		calc();
	}
	function optMovieChange() {
		calc();
	}
	function optOtherChange() {
		calc();
	}
	function optDiscountChange() {
		calc();
	}
	function optOutgoingFeeChange(){
		calc();
	}
	function depositChange() {
		calc();
	}

	/****************
		잔금 계산
	 ****************/
	function calc() {
		self.reserv.priceList = [];

		/* example
			{
				group: "decoFruit",
				item: "생과일3종",
				sell: 3,
				fee: 2
			}
		*/

		var group, item, sell, fee, totalSell = 0, totalFee = 0;
		// decoType
		item = self.reserv.decoType;
		if (item) {
			group = "decoType";
			sell = getSettingData(group, item, "sell");
			fee = getSettingData(group, item, "repair");
			self.reserv.priceList.push({
				group: group,
				item: item,
				sell: sell,
				fee: fee
			});
			totalSell += sell;
			totalFee += fee;
		}
		// decoFruit
		item = self.reserv.decoFruit;
		if (item) {
			group = "decoFruit";
			item.forEach(function(e) {
				sell = getSettingData(group, e, "sell");
				fee = getSettingData(group, e, "buy");
				self.reserv.priceList.push({
					group: group,
					item: e,
					sell: sell,
					fee: fee
				});
				totalSell += sell;
				totalFee += fee;
			});
		}
		//decoRcake
		item = self.reserv.decoRcake;
		if (item) {
			group = "decoRcake";
			item.forEach(function(e) {
				sell = getSettingData(group, e, "sell");
				fee = getSettingData(group, e, "buy");
				self.reserv.priceList.push({
					group: group,
					item: e,
					sell: sell,
					fee: fee
				});
				totalSell += sell;
				totalFee += fee;
			});
		}
		//decoPhoto
		item = self.reserv.decoPhoto;
		if (item) {
			group = "decoPhoto";
			sell = getSettingData(group, item, "sell");
			fee = getSettingData(group, item, "repair");
			self.reserv.priceList.push({
				group: group,
				item: item,
				sell: sell,
				fee: fee
			});
			totalSell += sell;
			totalFee += fee;
		}
		//optDress
		item = self.reserv.optDress;
		if (item) {
			group = "optDress";
			item.forEach(function(e) {
				sell = getSettingData(group, e, "sell");
				fee = getSettingData(group, e, "repair");
				self.reserv.priceList.push({
					group: group,
					item: e,
					sell: sell,
					fee: fee
				});
				totalSell += sell;
				totalFee += fee;
			});
		}
		//optMC
		item = self.reserv.optMC;
		if (item) {
			group = "optMC";
			item.forEach(function(e) {
				sell = getSettingData(group,  e, "sell");
				fee = getSettingData(group,  e, "commission");
				self.reserv.priceList.push({
					group: group,
					item: e,
					sell: sell,
					fee: fee
				});
				totalSell += sell;
				totalFee += fee;
			});
		}
		//optMovie
		item = self.reserv.optMovie;
		if (item) {
			group = "optMovie";
			sell = getSettingData(group, item, "sell");
			fee = getSettingData(group, item, "commission");
			self.reserv.priceList.push({
				group: group,
				item: item,
				sell: sell,
				fee: fee
			});
			totalSell += sell;
			totalFee += fee;
		}
		//optOther
		item = self.reserv.optOther;
		if (item) {
			group = "optOther";
			item.forEach(function(e) {
				sell = getSettingData(group, e, "sell");
				fee = getSettingData(group, e, "buy");
				self.reserv.priceList.push({
					group: group,
					item: e,
					sell: sell,
					fee: fee
				});
				totalSell += sell;
				totalFee += fee;
			});
		}
		//optDiscount
		item = self.reserv.optDiscount;
		if (item) {
			group = "optDiscount";
			item.forEach(function(e) {
				sell = getSettingData(group, e, "disPrice") * (-1);
				fee = getSettingData(group, e, "repair") * (-1);
				var discountType = getSettingData(group, e, "item");
				self.reserv.priceList.push({
					group: discountType,
					item: e,
					sell: sell,
					fee: fee
				});
				totalSell += sell;
				totalFee += fee;
			});
		}
		//optOutgoingFee
		if (self.reserv.optOutgoingFee) {
			self.reserv.priceList.push({
				group: "optOutgoingFee",
				item: "출장비",
				sell: self.reserv.optOutgoingFee
			});
			totalSell += self.reserv.optOutgoingFee;
		}
		// decoLoc
		item = self.reserv.decoLoc;
		if (item) {
			group = "decoLoc";
			var commCalcRule = getSettingData(group, item, "commCalcRule");
			var value = getSettingData(group, item, "commission");
			if (commCalcRule == '총판매비') {
				fee = totalSell * value * 0.01
			} else if (commCalcRule == '부가세비') {
				fee = (totalSell + totalSell * 0.1) * value * 0.01
			} else { // '차감'
				fee = value;
			}
			self.reserv.priceList.push({
				group: group,
				item: item,
				fee: fee
			});
			totalFee += fee;
		}
		// 잔금 및 예약금 계산 
		self.reserv.balance = 0;
		for (var i = 0, data, len = self.reserv.priceList.length ; i < len ; i++) {
			data = self.reserv.priceList[i];
			if (data.hasOwnProperty('sell')) {
				self.reserv.balance += data.sell;
			}
		}
		self.reserv.balance -= self.reserv.deposit;

		// 총판매금, 총지출금 정리
		if (totalSell != 0) {
			self.reserv.priceList.push({
				group: "revenue",
				item: "총판매",
				//sell: totalSell.toFixed(1)
				sell: totalSell
			});
			self.reserv.priceList.push({
				group: "expense",
				item: "총지출",
				//fee: totalFee.toFixed(1)
				fee: totalFee
			});
		}
	}

	function getSettingData(settingKey, itemKey, incomeKey) {
		var item = _.findWhere(self.settings[settingKey], {name: itemKey});
		return item[incomeKey];
	}

	/****************
	 저장버튼 클릭시
	 ****************/
	function save() {
		var decoDate = self.reserv.decoDate;
		var decoTime = self.reserv.decoTime;
		if (decoDate && decoTime) {
			decoDate.setHours(decoTime.getHours());
			decoDate.setMinutes(decoTime.getMinutes());
		}

		$http.post('/api/reservation/', self.reserv).then(function(res) {
			if (res.status == 200) {
				initReserv();
        $mdToast.showSimple('예약서가 저장되었습니다.');
			}
		});
	}
}
