'use strict';
angular
  .module('settingItem', [
    'md.data.table',
    'decoLoc', 'decoType', 'decoName', 'decoFruit', 'decoRcake', 'decoPhoto',
    'optDress', 'optMC', 'optMovie', 'optSnap', 'optOther'
  ])
  .component('settingItem', {
      templateUrl: 'app/setting-item/setting-item.template.html',
      controller: settingItem
  });

function settingItem($scope) {
}
