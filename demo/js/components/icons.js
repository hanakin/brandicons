var icon;

(function($){
    'use strict';
    icon = $('symbol');
})(window.jQuery);

(function(angular){
    'use strict';
    angular.module('appBrandicons')
    .service('symbols', function(){
        this.getSymbols = function(){
            var icons = [];
            for (var i in icon) {
                icons.push(i.id);
            }
            return icons;
        };
    })
    .controller('IconsController', function($scope){
        $scope.getIcons = function(){
            var icons = [];
            for (var i in icon) {
                icons.push(i.id);
            }
            return icons;
        };
        $scope.icons = $scope.getIcons();
    })
    .directive('icons', function(){
        return {
            templateUrl: './templates/icons.html',
            replace: true,
            controller: 'IconsController'
        };
    });
})(window.angular);
