'use strict';
angular
  .module('reserv-view', [
  ])
  .component('reservView', {
    templateUrl: 'app/reservation/reserv-view.template.html',
    controller: reservViewController
  });

function reservViewController($scope, $http, $location, moment) {
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
		self.consultList.push({
			'consultDate' : now.format('YYYY.M.D.(dd)'),
			'content': self.consultContent
		});
		self.consultContent = '';
	}

	function updateConsult(index) {
		console.log("updateConsult : " + index);
	}

	function deleteConsult(index) {
		console.log("deleteConsult : " + index);
	}
}
