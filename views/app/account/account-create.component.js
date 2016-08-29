(function() {
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
		self.account = {};

		var paths = $location.path().split('/');
		var year = paths[paths.length - 3];
		var month = paths[paths.length - 2];
		var dateStr = paths[paths.length - 1];
		var accountDate = new moment(dateStr);
		var accountStartDate = new moment(dateStr).subtract(6,'days').set('hour', 0).set('minute', 0);
		var accountEndDate = new moment(dateStr).add(1,'days').set('hour', 0).set('minute', 0);

		/***********************
			저장된 정산서 조회
		 ***********************/
		$http.get('/api/account/'+year+'/'+month+'/'+dateStr).then(function(res) {
			if (res.data.length > 0) {
				self.account = res.data[0];
			}
		});

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
			self.tabList = res.data;
			for (var i = 0, len = self.tabList.length ; i < len ; i++){
				self.tabList[i].docoDate = new Date(self.tabList[i].decoDate);
				self.tabList[i].day = moment(self.tabList[i].decoDate).format('M/D(dd)');
			}
		});
		/***********************
			정산서 타이틀 기간 입력
		 ***********************/
		self.account.period = accountStartDate.format("M/D(dd)") + " ~ " + accountDate.format("M/D(dd)");

		/***********************
			화면 이벤트
		 ***********************/
		self.account.addedExpenseList = [];
		self.updateIndex = -1;

		self.changePrevDate = changePrevDate;
		self.changeNextDate = changeNextDate;
		self.calc = calc;
		self.addExpenseItem = addExpenseItem;
		self.clickedUpdate = clickedUpdate;
		self.updateExpenseItem = updateExpenseItem;
		self.deleteExpenseItem = deleteExpenseItem;
		self.save = save;

		function changePrevDate() {
			var prevDateStr = new moment(dateStr).subtract(7, 'days').format('YYYYMMDD');
			$location.url('/account/'+year+'/'+month+'/'+ prevDateStr);
		}
		function changeNextDate() {
			var nextDateStr = new moment(dateStr).add(7, 'days').format('YYYYMMDD');
			$location.url('/account/'+year+'/'+month+'/'+ nextDateStr);
		}
		function calc() {
			if (self.tabList.length < 1) {
				$mdToast.showSimple("입력된 예약서가 없습니다.");
			}

			self.account.revenueList = [];
			self.account.incomeList = [];
			self.account.expenseList = [];
			self.account.revenueTotal = 0;
			self.account.incomeTotal = 0;
			self.account.expenseTotal = 0;

			for (var i = 0, priceList, len = self.tabList.length ; i < len ; i++) { 
				priceList = self.tabList[i].priceList;
				for (var j = 0, jlen = priceList.length ; j < jlen ; j++) {
					// revenue list
					if (priceList[j].hasOwnProperty('sell')) {
						buildRevenueList(priceList[j]);
					}
					// expense list
					if (priceList[j].hasOwnProperty('fee')) {
						buildExpenseList(priceList[j]);
					}
				}
			}
			buildIncomeList();
			calcTotal();
		}

		var revenueNames = { // 매출 표기명
			'decoLoc': '전속할인',
			'decoType': '돌상',
			'decoFruit': '생과일',
			'decoRcake': '떡케익',
			'decoPhoto': '포토테이블',
			'optDress': '돌복/드레스',
			'optMC': 'MC사회',
			'optMovie': '성장동영상',
			'optOther': '기타',
			'optOutgoingFee': '출장비'
		};
		var incomeNames = { // 수익 표기명
			'decoType': '돌상수익',
			'decoLoc': '전속수익',
			'decoFruit': '생과일수익',
			'decoRcake': '떡케익수익',
			'decoPhoto': '포토테이블수익',
			'optDress': '돌복/드레스수익',
			'optMC': 'MC수익',
			'optMovie': '동영상수익',
			'optOther': '기타수익',
			'optOutgoingFee': '출장비수익',
			'addExpense': '사업외지출'
		};
		var expenseNames = { // 지출 표기명
			'decoLoc': '전속커미션',
			'decoType': '소품수리비',
			'decoFruit': '생과일',
			'decoRcake': '떡케익',
			'decoPhoto': '포토수리비',
			'optDress': '돌복수선비',
			'optMC': 'MC커미션',
			'optMovie': '성장동영상',
			'optOther': '기타지출',
			'addExpense': '사업외지출'
		};

		function buildRevenueList(obj) {
			// 0. 총매출항목은 별도로 뺀다.
			if (obj.group === 'revenue') {
				self.account.revenueTotal += Number(obj.sell);
				return;
			}
			// 1. 그룹이 있는지 확인
			var groupIndex = _.findIndex(self.account.revenueList, {group: obj.group});
			if (groupIndex < 0 ) {
				// 2. 없으면 push
				if (Number(obj.sell) !== 0) {
					self.account.revenueList.push({
						group: obj.group,
						groupName: revenueNames[obj.group] || "지정안됨",
						itemList: [{
							name: obj.item,
							price: Number(obj.sell)
						}],
						totalPrice: Number(obj.sell)
					});
				}
			} else {
				// 3. 있으면 itemList에 item 이 있는지 확인
				var itemList = self.account.revenueList[groupIndex].itemList;
				var itemIndex = _.findIndex(itemList, {name: obj.item});
				if (itemIndex < 0) {
					// 4. 없으면 push
					if (Number(obj.sell) !== 0) {
						itemList.push({
							name: obj.item,
							price: Number(obj.sell)
						});
					}
				} else {
					// 5. 있으면 합산
					itemList[itemIndex].price = itemList[itemIndex].price + obj.sell;
				}
				// 6. 총 합산은 있으나 없으나 더함
				self.account.revenueList[groupIndex].totalPrice += obj.sell;
			}
		}

		function buildExpenseList(obj) {
			if (obj.group === 'expense') {
				self.account.expenseTotal += Number(obj.fee);
				return;
			}
			var groupIndex = _.findIndex(self.account.expenseList, {group: obj.group});
			if (groupIndex < 0 ) {
				if (Number(obj.fee) !== 0) {
					var detailPrint = _.contains(['decoLoc', 'optMC', 'optMovie'], obj.group);
					self.account.expenseList.push({
						group: obj.group,
						groupName: expenseNames[obj.group] || "지정안됨",
						itemList: [{
							name: obj.item,
							price: Number(obj.fee)
						}],
						totalPrice: Number(obj.fee),
						detailPrint: detailPrint
					});
				}
			} else {
				var itemList = self.account.expenseList[groupIndex].itemList;
				var itemIndex = _.findIndex(itemList, {name: obj.item});
				if (itemIndex < 0) {
					if (Number(obj.fee) !== 0) {
						itemList.push({
							name: obj.item,
							price: Number(obj.fee)
						});
					}
				} else {
					itemList[itemIndex].price = itemList[itemIndex].price + obj.fee;
				}
				self.account.expenseList[groupIndex].totalPrice += obj.fee;
			}
		}

		function buildIncomeList() {
			self.account.incomeTotal = self.account.revenueTotal - self.account.expenseTotal;
			self.account.incomeList = JSON.parse(JSON.stringify(self.account.revenueList));

			for (var i = 0, len = self.account.incomeList.length ; i < len ; i++) {
				self.account.incomeList[i].groupName = incomeNames[self.account.incomeList[i].group] || "지정안됨";
			}

			for (var i = 0, len = self.account.expenseList.length ; i < len ; i++) {
				var expense = self.account.expenseList[i];
				var index = _.findIndex(self.account.revenueList, {group : expense.group});
				if (index < 0) {
					self.account.incomeList.push({
						group: expense.group,
						groupName: incomeNames[expense.group] || "지정안됨",
						itemList: expense.itemList,
						totalPrice: expense.totalPrice
					});
				} else {
					self.account.incomeList[index].groupName = incomeNames[expense.group];
					var itemList = self.account.incomeList[index].itemList;
					for (var j = 0, jlen = expense.itemList.length ; j < jlen ; j++) {
						var itemIndex = _.findIndex(itemList, {name: expense.itemList[j].name});
						if (itemIndex < 0) {
							itemList.push(expense.itemList[j]);
						} else {
							itemList[itemIndex].price = itemList[itemIndex].price - expense.itemList[j].price;
						}
						self.account.incomeList[index].totalPrice -= expense.itemList[j].price;
					}
				}
			}
		}

		// 기존 예약서 지출 및 수익 내역에
		// 추가된 지출항목을 포함시켜 계산한다.
		function calcTotal() {
			for (var i = 0, len = self.account.addedExpenseList.length ; i < len ; i++) {
				var item = self.account.addedExpenseList[i];
				addExpenseList(item);
				addIncomeList(item);
			}
		}

		// 지출리스트에 항목추가 또는 변경하고 총계 합산하는 기능
		function addExpenseList(item) {
			var index = _.findIndex(self.account.expenseList, {group: item.group});
			if (index < 0) {
				self.account.expenseList.push({
					group: item.group,
					groupName: expenseNames[item.group] || "지정안됨",
					itemList: [{
						name: item.itemName,
						price: item.itemPrice
					}],
					totalPrice: item.itemPrice,
					detailPrint: true
				});
				self.account.expenseTotal += item.itemPrice;
				self.account.expenseTotal = Number(self.account.expenseTotal.toFixed(3));
			} else {
				var itemList = self.account.expenseList[index].itemList;
				var itemIndex = _.findIndex(itemList, {name: item.itemName});
				if (itemIndex < 0) {
					if (item.itemPrice !== 0) {
						itemList.push({
							name: item.itemName,
							price: item.itemPrice
						});

						self.account.expenseList[index].totalPrice += item.itemPrice;
						self.account.expenseList[index].totalPrice = Number(self.account.expenseList[index].totalPrice.toFixed(3));
						self.account.expenseTotal += item.itemPrice;
						self.account.expenseTotal = Number(self.account.expenseTotal.toFixed(3));
					}
				} else {
					var diff = item.itemPrice - itemList[itemIndex].price;
					itemList[itemIndex].price = item.itemPrice;
					self.account.expenseList[index].totalPrice += diff;
					self.account.expenseList[index].totalPrice = Number(self.account.expenseList[index].totalPrice.toFixed(3));
					self.account.expenseTotal += diff;
					self.account.expenseTotal = Number(self.account.expenseTotal.toFixed(3));
				}
			}
		}

		// 수익리스트에 항목추가 또는 변경하고 총계 합산하는 기능
		function addIncomeList(item) {
			var index = _.findIndex(self.account.incomeList, {group: item.group});
			if (index < 0) {
				self.account.incomeList.push({
					group: item.group,
					groupName: incomeNames[item.group] || "지정안됨",
					itemList: [{
						name: item.itemName,
						price: item.itemPrice
					}],
					totalPrice: item.itemPrice,
					detailPrint: true
				});
				self.account.incomeTotal += item.itemPrice;
				self.account.incomeTotal = Number(self.account.incomeTotal.toFixed(3));
			} else {
				var itemList = self.account.incomeList[index].itemList;
				var itemIndex = _.findIndex(itemList, {name: item.itemName});
				if (itemIndex < 0) {
					if (item.itemPrice !== 0) {
						itemList.push({
							name: item.itemName,
							price: item.itemPrice
						});

						self.account.incomeList[index].totalPrice += item.itemPrice;
						self.account.incomeList[index].totalPrice = Number(self.account.incomeList[index].totalPrice.toFixed(3));
						self.account.incomeTotal += item.itemPrice;
						self.account.incomeTotal = Number(self.account.incomeTotal.toFixed(3));
					}
				} else {
					var diff = item.itemPrice - itemList[itemIndex].price;
					itemList[itemIndex].price = item.itemPrice;
					self.account.incomeList[index].totalPrice += diff;
					self.account.incomeList[index].totalPrice = Number(self.account.incomeList[index].totalPrice.toFixed(3));
					self.account.incomeTotal += diff;
					self.account.incomeTotal = Number(self.account.incomeTotal.toFixed(3));
				}
			}
		}

		function deleteCalc(item) {
			var index = _.findIndex(self.account.expenseList, {group: item.group});
			if (index < 0) {
				console.log(item.group + " 이 리스트에 존재하지 않습니다.");
				return;
			} else {
				var itemList = self.account.expenseList[index].itemList;
				var itemIndex = _.findIndex(itemList, {name: item.itemName});
				if (itemIndex < 0) {
					console.log(item.itemName + " 이 리스트에 존재하지 않습니다.");
					return;
				} else {
					var el = itemList.splice(itemIndex, 1);
					self.account.expenseList[index].totalPrice -= el[0].price;
					self.account.expenseList[index].totalPrice = Number(self.account.expenseList[index].totalPrice.toFixed(3));
					self.account.expenseTotal -= el[0].price;
					self.account.expenseTotal = Number(self.account.expenseTotal.toFixed(3));

					if (itemList.length == 0) {
						self.account.expenseList.splice(index, 1);
					}
				}
			}

			index = _.findIndex(self.account.incomeList, {group: item.group});
			if (index < 0) {
				console.log(item.group + " 이 그룹에 존재하지 않습니다.");
				return;
			} else {
				var itemList = self.account.incomeList[index].itemList;
				var itemIndex = _.findIndex(itemList, {name: item.itemName});
				if (itemIndex < 0) {
					console.log(item.itemName + " 이 리스트에 존재하지 않습니다.");
					return;
				} else {
					var item = itemList.splice(itemIndex, 1);
					self.account.incomeList[index].totalPrice -= item[0].price;
					self.account.incomeList[index].totalPrice = Number(self.account.incomeList[index].totalPrice.toFixed(3));
					self.account.incomeTotal -= item[0].price;
					self.account.incomeTotal = Number(self.account.incomeTotal.toFixed(3));

					if (itemList.length == 0) {
						self.account.incomeList.splice(index, 1);
					}
				}
			}
		}

		function addExpenseItem() {
			var index = _.findIndex(self.account.addedExpenseList, {itemName: self.addItem});
			if (index < 0) {
				var item = {
					group: "addExpense",
					itemName: self.addItem,
					itemPrice: Number(self.addPrice)
				};
				self.account.addedExpenseList.push(item);
				addExpenseList(item);
				addIncomeList(item);
			} else {
				var item = self.account.addedExpenseList[index];
				item.itemName = self.addItem;
				item.itemPrice = self.addPrice;
				addExpenseList(item);
				addIncomeList(item);
			}

			self.addItem = undefined;
			self.addPrice = undefined;
		}
		function clickedUpdate(index) {
			self.updateIndex = index;
			self.addItem = self.account.addedExpenseList[index].itemName;
			self.addPrice = self.account.addedExpenseList[index].itemPrice;
		}
		function updateExpenseItem() {
			var item = {
				group: "addExpense",
				itemName: self.addItem,
				itemPrice: Number(self.addPrice)
			};
			self.account.addedExpenseList[self.updateIndex] = item;
			addExpenseList(item);
			addIncomeList(item);

			self.addItem = undefined;
			self.addPrice = undefined;
			self.updateIndex = -1;
		}
		function deleteExpenseItem(index) {
			var item = self.account.addedExpenseList.splice(index, 1);
			deleteCalc(item[0]);
		}

		function save() {
			if (!self.account.hasOwnProperty('expenseList')) {
				$mdToast.showSimple('저장할 내용이 없습니다.');
			} else {
				self.account.accountDate = accountDate.toDate();
				self.account.dateStr = dateStr;

				$http.post('/api/account/' + year + '/' + month + '/' + dateStr + '/', self.account).then(function(res) {
					if (res.status == 200) {
						$mdToast.showSimple('정산서가 저장되었습니다.');
					}
				});
			}
		}
	}
})();
