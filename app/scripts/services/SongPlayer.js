(function() {
     function SongPlayer($rootScope, Fixtures) {
          var SongPlayer = {};

          var currentAlbum = Fixtures.getAlbum();

          SongPlayer.volume = 80;

          SongPlayer.setVolume = function (volume) {
              if (currentBuzzObject) {
                  currentBuzzObject.setVolume(volume);
              }
          };

          /**
          * @desc Buzz object audio file
          * @type {Object}
          */
          var currentBuzzObject = null;

          /**
          * @function setSong
          * @desc Stops currently playing song and loads new audio file as currentBuzzObject
          * @param {Object} song
          */
          var setSong = function(song) {
              if (currentBuzzObject) {
                  stopSong(song);
              }

              currentBuzzObject = new buzz.sound(song.audioUrl, {
                  formats: ['mp3'],
                  preload: true
              });

              currentBuzzObject.bind('timeupdate', function() {
                  $rootScope.$apply(function() {
                      SongPlayer.currentTime = currentBuzzObject.getTime();
                      if (currentBuzzObject.isEnded()) {
                        SongPlayer.next();
                     }
                  });
              });

              SongPlayer.currentSong = song;
          };

          /**
          * @function playSong
          * @desc Plays the selected song
          * @param {Object} song
          */

          var playSong = function(song) {
              currentBuzzObject.play();
              song.playing = true;
          };

          var getSongIndex = function(song) {
              return currentAlbum.songs.indexOf(song);
          };

          SongPlayer.currentSong = null;

          /**
          * @desc Current playback time (in seconds) of currently playing song
          * @type {Number}
          */
          SongPlayer.currentTime = null;

          var stopSong = function (song) {
            currentBuzzObject.stop();
            SongPlayer.currentSong.playing = null;
          };

          SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {

              setSong(song);
              playSong(song);

            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }

          };

          SongPlayer.pause = function(song) {
              song = song || SongPlayer.currentSong;
              currentBuzzObject.pause();
              song.playing = false;
          };

          SongPlayer.isMuted = function(song) {
              if(!currentBuzzObject) {
                  return false;
              }
              return currentBuzzObject.isMuted();
          };

          SongPlayer.toggleMute = function(song) {
              if(currentBuzzObject && currentBuzzObject.isMuted()){
                  currentBuzzObject.toggleMute();
                  SongPlayer.volume = currentBuzzObject.getVolume();
              } else if(currentBuzzObject && !currentBuzzObject.isMuted()) {
                  currentBuzzObject.toggleMute();
                  SongPlayer.volume = 0;
              }
          };

          SongPlayer.previous = function() {
              var currentSongIndex = getSongIndex(SongPlayer.currentSong);
              currentSongIndex--;

              if (currentSongIndex < 0) {
                  stopSong(song);
              } else {
                  var song = currentAlbum.songs[currentSongIndex];
                  setSong(song);
                  playSong(song);
              }
          };

          SongPlayer.next = function() {
              var currentSongIndex = getSongIndex(SongPlayer.currentSong);
              currentSongIndex++;

              if ((currentSongIndex + 1) > currentAlbum.songs.length) {
                  stopSong(song);
              } else {
                  var song = currentAlbum.songs[currentSongIndex];
                  setSong(song);
                  playSong(song);
              }
          };

          /**
          * @function setCurrentTime
          * @desc Set current time (in seconds) of currently playing song
          * @param {Number} time
          */
          SongPlayer.setCurrentTime = function(time) {
              if (currentBuzzObject) {
              currentBuzzObject.setTime(time);
              }
          };

          return SongPlayer;
     }

     angular
         .module('maxJams')
         .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
 })();
