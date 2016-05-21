'use strict';

/* Filters */

MainApp.filter('orderObjectBy', function() {
    return function(items, field, reverse){

        var strRef = function (object, reference) {
            function arr_deref(o, ref, i) {
                return !ref ? o : (o[ref.slice(0, i ? -1 : ref.length)]);
            }
            function dot_deref(o, ref) {
                return !ref ? o : ref.split('[').reduce(arr_deref, o);
            }
            return reference.split('.').reduce(dot_deref, object);
        };

        var filtered = [];

        angular.forEach(items, function(item) {
           filtered.push(item);
        });
        filtered.sort(function (a, b) {
           return (strRef(a, field) > strRef(a, field) ? 1 : -1);
        });
        if(reverse) filtered.reverse();
        return filtered;
    };
});
