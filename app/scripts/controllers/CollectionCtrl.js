(function() {
     function CollectionCtrl(Fixtures) {
        this.albums = Fixtures.getCollection(12);
     }

     angular
         .module('maxJams')
         .controller('CollectionCtrl', ['Fixtures', CollectionCtrl]);
 })();
