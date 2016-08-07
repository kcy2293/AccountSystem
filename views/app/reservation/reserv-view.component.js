'use strict';
angular
  .module('reserv-view', [
  ])
  .component('reservView', {
    templateUrl: 'app/reservation/reserv-view.template.html',
    controller: reservViewController
  });

function reservViewController($scope, $http, $location) {
  var self = this;
  var paths = $location.path().split('/');
  var id = paths[paths.length - 1];
  var year = paths[paths.length - 2];

  $http.get('api/reservation/' + year + '/' + id).then(function(res) {
    self.reserv = res.data;
    self.reserv.decoDate = new Date(self.reserv.decoDate);
    self.reserv.day = moment(self.reserv.decoDate).format('M/DD(dd) h:mm');
  });

  self.update = update;
  self.delete = deleteOne;

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

}
