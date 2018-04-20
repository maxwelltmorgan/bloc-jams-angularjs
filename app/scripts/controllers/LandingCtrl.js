(function() {
  function LandingCtrl() {
      this.heroTitle = "Turn the Music Up!";
  }


  angular
      .module('maxJams')
      .controller('LandingCtrl', LandingCtrl);
})();
