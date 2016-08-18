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
			return Object.keys(json).length;
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
	function decoLocChange() {
		calc();
	}
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
		self.reserv.sellList = {};
		self.reserv.feeList = {};

		var key, sell, fee, totalSell = 0, totalFee = 0;

		// decoLoc
		key = self.reserv.decoLoc;
		if (key) {
			fee = getSettingData("decoLoc", key, "commission");
			self.reserv.feeList[key] = fee;
			totalFee += fee;
		}
		// decoType
		key = self.reserv.decoType;
		if (key) {
			sell = getSettingData("decoType", key, "sell");
			fee = getSettingData("decoType", key, "repair");
			self.reserv.sellList[key] = sell;
			self.reserv.feeList[key] = fee;
			totalSell += sell;
			totalFee += fee;
		}

		// decoFruit
		key = self.reserv.decoFruit;
		if (key) {
			key.forEach(function(e) {
				sell = getSettingData("decoFruit", e, "sell");
				fee = getSettingData("decoFruit", e, "buy");
				self.reserv.sellList[e] = sell;
				self.reserv.feeList[e] = fee;
				totalSell += sell;
				totalFee += fee;
			});
		}

		//decoRcake
		key = self.reserv.decoRcake;
		if (key) {
			key.forEach(function(e) {
				sell = getSettingData("decoRcake", e, "sell");
				fee = getSettingData("decoRcake", e, "buy");
				self.reserv.sellList[e] = sell;
				self.reserv.feeList[e] = fee;
				totalSell += sell;
				totalFee += fee;
			});
		}

		//decoPhoto
		key = self.reserv.decoPhoto;
		if (key) {
			sell = getSettingData("decoPhoto", key, "sell");
			self.reserv.sellList[key] = sell;
			totalSell += sell;
		}

		//optDress
		key = self.reserv.optDress;
		if (key) {
			key.forEach(function(e) {
				sell = getSettingData("optDress", e, "sell");
				fee = getSettingData("optDress", e, "repair");
				self.reserv.sellList[e] = sell;
				self.reserv.feeList[e] = fee;
				totalSell += sell;
				totalFee += fee;
			});
		}

		//optMC
		key = self.reserv.optMC;
		if (key) {
			key.forEach(function(e) {
				sell = getSettingData("optMC", e, "sell");
				fee = getSettingData("optMC", e, "commission");
				self.reserv.sellList[e] = sell;
				self.reserv.feeList[e] = fee;
				totalSell += sell;
				totalFee += fee;
			});
		}

		//optMovie
		key = self.reserv.optMovie;
		if (key) {
			sell = getSettingData("optMovie", key, "sell");
			fee = getSettingData("optMovie", key, "commission");
			self.reserv.sellList[key] = sell;
			self.reserv.feeList[key] = fee;
			totalSell += sell;
			totalFee += fee;
		}

		//optOther
		key = self.reserv.optOther;
		if (key) {
			key.forEach(function(e) {
				sell = getSettingData("optOther", e, "sell");
				fee = getSettingData("optOther", e, "buy");
				self.reserv.sellList[e] = sell;
				self.reserv.feeList[e] = fee;
				totalSell += sell;
				totalFee += fee;
			});
		}

		//optDiscount
		key = self.reserv.optDiscount;
		if (key) {
			key.forEach(function(e) {
				sell = getSettingData("optDiscount", e, "disPrice") * (-1);
				fee = getSettingData("optDiscount", e, "repair") * (-1);
				self.reserv.sellList[e] = sell;
				self.reserv.feeList[e] = fee;
				totalSell += sell;
				totalFee += fee;
			});
		}

		//optOutgoingFee
		if (self.reserv.optOutgoingFee) {
			self.reserv.sellList['출장비'] = self.reserv.optOutgoingFee;
			totalSell += self.reserv.optOutgoingFee;
		}

		// 잔금 및 예약금 계산 
		self.reserv.balance = 0;
		for (var key in (self.reserv.sellList)) {
			self.reserv.balance += self.reserv.sellList[key];
		}
		self.reserv.balance -= self.reserv.deposit;

		// 총판매금, 총지출금 정리
		if (totalSell != 0) {
			self.reserv.sellList['총판매금'] = totalSell.toFixed(1);
		}
		if (totalFee != 0) {
			self.reserv.feeList['총지출금'] = totalFee.toFixed(1);
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
