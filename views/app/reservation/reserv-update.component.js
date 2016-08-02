'use strict';
angular
  .module('reserv-update', [
  ])
  .component('reservUpdate', {
    templateUrl: 'app/reservation/reserv-create.template.html',
    controller: reservUpdateController
  });

function reservUpdateController($scope, $http, $mdToast, $location) {
  var self = this;
  var paths = $location.path().split('/');
  var id = paths[paths.length - 1];
  var year = paths[paths.length - 2];

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
    $http.get('/api/reservation/' + year + '/' + id).then(function(res) {
      self.reserv = res.data;
      self.reserv.decoDate = new Date(self.reserv.decoDate);
      self.reserv.decoTime = new Date(self.reserv.decoTime);
    });
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

	self.menuTableChange = menuTableChange;
	self.decoFruitChange = decoFruitChange;
	self.decoRcakeChange = decoRcakeChange;
	self.decoPhotoChange = decoPhotoChange;
	self.optDressChange = optDressChange;
	self.optMCChange = optMCChange;
	self.optMovieChange = optMovieChange;
	self.optOtherChange = optOtherChange;
	self.depositChange = depositChange;
	self.save = save;

	/****************
    예약서 정보 초기화
	 ****************/
	function initReserv() {
		self.reserv = {
			deposit : 5,
			balance : 0
		};
	}

	/****************
	 패키지 선택시
	 ****************/
	function menuTableChange() {
		var item = _.findWhere(self.settings.menuTable, {name: self.reserv.menuTable});
		self.reserv.decoType = item.decoType;
		self.reserv.decoFruit = [item.decoFruit];
		self.reserv.decoRcake = [item.decoRcake];
		self.reserv.optDress = [item.optDress];

		calcBalance();
	}

	function decoFruitChange() {
		calcBalance();
	}
	function decoRcakeChange() {
		calcBalance();
	}
	function decoPhotoChange() {
		calcBalance();
	}
	function optDressChange() {
		calcBalance();
	}
	function optMCChange() {
		calcBalance();
	}
	function optMovieChange() {
		calcBalance();
	}
	function optOtherChange() {
		calcBalance();
	}
	function depositChange() {
		calcBalance();
	}

	/****************
		잔금 계산
	 ****************/
	function calcBalance() {
		var calcKeys = ["menuTable", "decoFruit", "decoRcake"];
		self.reserv.sellList = {};

		var key;
		// menuTable
		key = self.reserv.menuTable;
		if (key) {
			self.reserv.sellList[key] = getIncomeData("menuTable", key, "sell");
		}

		// decoFruit
		key = self.reserv.decoFruit;
		if (key) {
			key.forEach(function(e) {
				self.reserv.sellList[e] = getIncomeData("decoFruit", e, "sell");
			});
		}

		//decoRcake
		key = self.reserv.decoRcake;
		if (key) {
			key.forEach(function(e) {
				self.reserv.sellList[e] = getIncomeData("decoRcake", e, "sell");
			});
		}

		//decoPhoto
		key = self.reserv.decoPhoto;
		if (key) {
			self.reserv.sellList[key] = getIncomeData("decoPhoto", key, "sell");
		}

		//optDress
		key = self.reserv.optDress;
		if (key) {
			key.forEach(function(e) {
				self.reserv.sellList[e] = getIncomeData("optDress", e, "sell");
			});
		}

		//optMC
		key = self.reserv.optMC;
		if (key) {
			key.forEach(function(e) {
				self.reserv.sellList[e] = getIncomeData("optMC", e, "sell");
			});
		}

		//optMovie
		key = self.reserv.optMovie;
		if (key) {
			key.forEach(function(e) {
				self.reserv.sellList[e] = getIncomeData("optMovie", e, "sell");
			});
		}

		//optOther
		key = self.reserv.optOther;
		if (key) {
			key.forEach(function(e) {
				self.reserv.sellList[e] = getIncomeData("optOther", e, "sell");
			});
		}

		self.reserv.balance = 0;
		for (var key in (self.reserv.sellList)) {
			self.reserv.balance += self.reserv.sellList[key];
		}
		self.reserv.balance -= self.reserv.deposit;
	}

	function getIncomeData(settingKey, itemKey, incomeKey) {
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

		$http.put('/api/reservation/' + year + '/' + id, self.reserv).then(function(res) {
			if (res.status == 200) {
				initReserv();
        $mdToast.showSimple('예약서가 저장되었습니다.');
			}
		});
	}
}
