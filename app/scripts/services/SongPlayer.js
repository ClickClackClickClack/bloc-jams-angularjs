(function() {
     function SongPlayer($rootScope, Fixtures) {
          var SongPlayer = {};

          /**
          * @desc Copy of the current selected/playing album
          * @type {Object}
          */

          var currentAlbum = Fixtures.getAlbum();

          /**
          * @desc Buzz object audio file
          * @type {Object}
          */
          var currentBuzzObject = null;


           /**
           * @function playSong
           * @desc Plays currentBuzzObject and sets the song's playing property to true
           * @param {Object} song
           */

          var playSong = function(song){
            currentBuzzObject.play();
            song.playing = true;
          };

          /**
          * @function stopSong
          * @desc Stops currentBuzzObject and sets the song's playing property to null
          * @param {Object} song
          */

          var stopSong = function(song){
             currentBuzzObject.stop();
             song.playing = null;
          };

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
                });
            });

               SongPlayer.currentSong = song;
            };

          /**
          * @function getSongIndex
          * @desc Grabs the index value of a song
          * @param {Object} song
          * @return {number}
          */

          var getSongIndex = function(song) {
              return currentAlbum.songs.indexOf(song);
          };

          /**
          * @desc Current playing/paused song object
          * @type {Object}
          */
          SongPlayer.currentSong = null;

          /**
          * @desc Current playback time (in seconds) of currently playing song
          * @type {Number}
          */
          SongPlayer.currentTime = null;

          /**
          * @desc Current volume of song, default 50
          * @type {Number}
          */
          SongPlayer.volume = 50;

          /**
          * @function SongPlayer.play
          * @desc Either plays a currently paused song or sets and plays a new song object
          * @param {Object} song
          */

          SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
              
              setSong(song);
              playSong(song);

            }else if (SongPlayer.currentSong === song) {
                 if (currentBuzzObject.isPaused()) {
                    currentBuzzObject.play();
                 }
              }
          };


          /**
           * @function SongPlayer.pause
           * @desc Pauses the current song and sets song's playing property to false
           * @param {Object} song
           */

          SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
               song.playing = false;
          };

           /**
           * @function SongPlayer.previous
           * @desc Changes to previous song on album by decreasing the index
           * @param {Object} song
           */

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

           /**
           * @function SongPlayer.next
           * @desc Changes to next song on album by increasing the index
           * @param {Object} song
           */

           SongPlayer.next = function() {
             var currentSongIndex = getSongIndex(SongPlayer.currentSong);
             currentSongIndex++;
             if(currentSongIndex > (currentAlbum.songs.length)){
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

           SongPlayer.setVolume = function(volume) {
               if (currentBuzzObject) {
                   currentBuzzObject.setVolume(volume);
               }
           };

          return SongPlayer;
         }

     angular
         .module('blocJams')
         .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
 })();
