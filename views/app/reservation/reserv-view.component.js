'use strict';
angular
  .module('reserv-view', [
  ])
  .component('reservView', {
    templateUrl: 'app/reservation/reserv-view.template.html',
    controller: reservViewController
  });

function reservViewController($scope, $http, $location, $mdToast, moment) {
  var self = this;
  var paths = $location.path().split('/');
  var id = paths[paths.length - 1];
  var year = paths[paths.length - 2];

  $http.get('api/reservation/' + year + '/' + id).then(function(res) {
    self.reserv = res.data;
    self.reserv.decoDate = new Date(self.reserv.decoDate);
    self.reserv.day = moment(self.reserv.decoDate).format('M/DD(dd) h:mm');
		self.consultList = self.reserv.consultList || [];
  });

  self.update = update;
  self.delete = deleteOne;
	self.addConsult = addConsult;
	self.updateConsult = updateConsult;
	self.deleteConsult = deleteConsult;
	self.clickedConsultUpdate = clickedConsultUpdate;

  function update() {
    $location.url('/reserv-update/' + self.year + '/' + id);
  }

  function deleteOne() {
    $http.delete('/api/reservation/' + year + '/' + id).then(function(res) {
      if (res.status == 200) {
        $location.url('/reservation/' + year + '/');
      }
    });
  }

	function addConsult() {
		var now = new moment();
		self.consultList.unshift({
			'consultDate' : now.format('YYYY.M.D.(dd)'),
			'content': self.consultContent
		});

		submitUpdate(function(success) {
			if (success) {
				$mdToast.showSimple('상담 내용이 추가되었습니다.');
				self.consultContent = '';
			} else {
				$mdToast.showSimple('다시한번 시도해주시기 바랍니다.');
				self.consultList.shift();
			}
		});
	}

	function updateConsult(index) {
		self.updateIndex = index;
		self.consultContent = self.consultList[index].content;
	}

	function deleteConsult(index) {
		var item = self.consultList.splice(index, 1);
		submitUpdate(function(success) {
			if (success) {
				$mdToast.showSimple('상담 내용이 삭제되었습니다.');
			} else {
				$mdToast.showSimple('다시한번 시도해주시기 바랍니다.');
				self.consultList.splice(index, 0, item);
			}
		});
	}

	function clickedConsultUpdate() {
		self.consultList[self.updateIndex].content = self.consultContent;
		submitUpdate(function(success) {
			if (success) {
				$mdToast.showSimple('상담 내용이 변경되었습니다.');
				self.consultContent = '';
				self.updateIndex = undefined;
			} else {
				$mdToast.showSimple('다시한번 시도해주시기 바랍니다.');
			}
		});
	}

	function submitUpdate(callback) {
		$http.put('/api/reservation/' + year + '/' + id + '/consulting', self.consultList).then(function(res) {
			if (res.status == 200) {
				callback(true);
			} else {
				callback(false);
			}
		});
	}
}
