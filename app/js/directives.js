'use strict';

/* Directives */

//change background image for any element
app.directive('myBackgroundImage', function () {
        return function (scope, element, attrs) {
            element.css({
                'background-image': 'url(' + attrs.myBackgroundImage + ')',
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat',
                    'background-position': 'center center',
                    'background-attachment': 'fixed'
            });
        };
});
