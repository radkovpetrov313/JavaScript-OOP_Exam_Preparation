function solve() {
	if (!Array.prototype.findIndex) {
	  Array.prototype.findIndex = function(predicate) {
	    if (this === null) {
	      throw new TypeError('Array.prototype.findIndex called on null or undefined');
	    }
	    if (typeof predicate !== 'function') {
	      throw new TypeError('predicate must be a function');
	    }
	    var list = Object(this);
	    var length = list.length >>> 0;
	    var thisArg = arguments[1];
	    var value;

	    for (var i = 0; i < length; i++) {
	      value = list[i];
	      if (predicate.call(thisArg, value, i, list)) {
	        return i;
	      }
	    }
	    return -1;
	  };
	}

	function isValidString(str, min, max) {
		return (typeof(str) === 'string' && min >= 3 && max <= 25);
	}

	function isValidID (id) {
		return (typeof(id) === 'number' && id > 0);
	}

	var Player = (function(){
		function Player (name) {
			if (/*name === undefined || */!isValidString(name, 3, 25)) {
				throw {
					name: 'PlayerError',
					message: '"Name" must be a string with length from 3 to 25'
				};
			}
			this.name = name;
			this.playLists = [];

			return this;
		}

		Player.prototype.addPlaylist = function (playlistToAdd) {
			if (!(playlistToAdd instanceof Playlist)) {
				throw {
					name: 'addPlaylistError',
					message: 'Invalid /or missing/ playlistToAdd'
				}
			}

			this.playLists.push(playlistToAdd);

			return this;
		}

		Player.prototype.getPlaylistById = function (id) {
			if (!isValidID(id)) {
				throw {
					name: 'getPlaylistByIdError',
					message: 'Id must be a number greater than 0'
				};
			}

			index = this.playLists.findIndex(function (element) {
				return element.id === id;
			});

			if (index != -1) {
				return this.playLists[index];
			} else {
				return null;
			}
		}

		Player.prototype.removePlaylist = function (value) {
			var id = value;

			if (typeof(value) != 'number') {
				id = value.id;
			}

			index = this.playLists.findIndex(function (element) {
				return element.id === id;
			});

			if (index != -1) {
				this.playLists.splice(index, 1);
				return this;
			} else {
				throw {
					name: 'removePlayListError',
					message: 'No playlist with such id was found'
				}
			}
		}

		Player.prototype.listPlaylists = function (page, size) {
			if (/*page === undefined || size === undefined || */page < 0 || size <= 0 || (page * size > this.playLists.length)) {
				throw {
					name: 'listPlaylistsError',
					message: 'Invalid page, or size, or page * size is bigger than length of playlists'
				}
			}

			this.playLists.sort(function (a, b) {
				if (a.title === b.title) {
					return a.id - b.id;
				} else {
					return a.title.localeCompare(b.title);
				}
			});

			return this.playLists.slice((page * size), (page + 1) * size);
		}

		Player.prototype.contains = function (playable, playlist) {
			if (playable === undefined || playlist === undefined) {
				throw {
					name: 'Player.containsError',
					message: '"playable" or "playlist" is missing'
				};
			}

			return playlist.playables.some(function (element) {
				var props = Object.keys(playable),
					mysteryProp = props[props.length - 1];

				return (element.id === playable.id && element.title === playable.title && element.author === playable.author && element[mysteryProp] === playable[mysteryProp]);
			});
		}

		Player.prototype.search = function (pattern) {
			if (/*pattern === undefined || */typeof(pattern) != 'string') {
				throw {
					name: 'Player.searchError',
					message: 'Missing or invalid "pattern"'
				}
			}

			return this.playLists.filter(function (element) {
				var inside = element.playables.some(function (song) {
					var songName = song.title.toLowerCase();

					return (songName.indexOf(pattern.toLowerCase()) != -1);
				});

				if (inside) {
					return element;
				}
			});
		}

		return Player;
	}());

	var Playlist = (function(){
		var id = 0;
		function Playlist (name) {
			if (!isValidString(name, 3, 25)) {
				throw {
					name: 'NameError',
					message: 'Name must be a string with length between 3 and 25'
				};
			}

			this.name = name;
			this.id = (id += 1);
			this.playables = [];

			return this;
		}

		Playlist.prototype.addPlayable = function (playable) {
			/*if (playable.title === undefined || playable.author === undefined) {
				throw {
					name: 'addPlayableError',
					message: '"playable" atribute must have title and author properties!'
				};
			}*/

			this.playables.push(playable);

			return this;
		}

		Playlist.prototype.getPlayableById = function (id) {
			if (!isValidID(id)) {
				throw {
					name: 'getPlayableByIdError',
					message: 'Id must be a number greater than 0'
				};
			}

			index = this.playables.findIndex(function (element) {
				return element.id === id;
			});

			if (index != -1) {
				return this.playables[index];
			} else {
				return null;
			}
		}

		Playlist.prototype.removePlayable = function (value) {
			var id = value;

			if (typeof(value) != 'number') {
				id = value.id;
			}

			index = this.playables.findIndex(function (element) {
				return element.id === id;
			});

			if (index != -1) {
				this.playables.splice(index, 1);
				return this;
			} else {
				throw {
					name: 'removePlayableError',
					message: 'No playable with such id was found'
				}
			}
		}

		Playlist.prototype.listPlayables = function (page, size) {
			if (/*page === undefined || size === undefined || */page < 0 || size <= 0 || (page * size > this.playables.length)) {
				throw {
					name: 'listPlayablesError',
					message: 'Invalid page, or size, or page * size is bigger than length of playables'
				}
			}

			this.playables.sort(function (a, b) {
				if (a.title === b.title) {
					return a.id - b.id;
				} else {
					return a.title.localeCompare(b.title);
				}
			});

			return this.playables.slice((page * size), (page + 1) * size);
		}

		return Playlist;
	}());

	var Playable = (function(){
		var id = 0;
		function Playable (title, author) {
		/*	if (!isValidString(title, 3, 25)) {
				throw {
					name: 'TitleError',
					message: 'Title must be a string with length from 3 to 25'
				};
			}*/
			this.title = title;
			/*if (!isValidString(author, 3, 25)) {
				throw {
					name: 'AuthorError',
					message: 'Author must be a string with length from 3 to 25'
				};
			}*/
			this.author = author;
			this.id = (id += 1);

			//return this;
		}

		Playable.prototype.play = function() {
			return this.id + '. ' + this.title + ' - ' + this.author;
		}

		return Playable;
	}());

	var Audio = (function(){

		function Audio (title, author, length) {
			if (/*title === undefined || */!isValidString(title, 3, 25)) {
				throw {
					name: 'TitleError',
					message: 'Title must be a string with length from 3 to 25'
				};
			}
			if (/*author === undefined || */!isValidString(author, 3, 25)) {
				throw {
					name: 'AuthorError',
					message: 'Author must be a string with length from 3 to 25'
				};
			}

			Playable.call(this, title, author);

			length = +(length);

			if (/*length === undefined || */typeof(length) != 'number' || length <= 0) {
				throw {
					name: 'LengthError',
					message: 'Length must be number greater than 0'
				}
			}
			this.length = length;

			return this;
		}

		Audio.prototype = new Playable();

		Audio.prototype.play = function () {
			return (Playable.play.call(this)) + ' - ' + this.length;
		}
		
		return Audio;
	}());

	var Video = (function(){
		function Video (title, author, imdbRating) {
			if (/*title === undefined || */!isValidString(title, 3, 25)) {
				throw {
					name: 'TitleError',
					message: 'Title must be a string with length from 3 to 25'
				};
			}
			if (/*author === undefined || */!isValidString(author, 3, 25)) {
				throw {
					name: 'AuthorError',
					message: 'Author must be a string with length from 3 to 25'
				};
			}

			Playable.call(this, title, author);

			if (/*imdbRating === undefined || */typeof(imdbRating) != 'number' ||  imdbRating < 1 || imdbRating > 5) {
				throw {
					name: 'ImdbRaitingError',
					message: 'ImdbRaiting must be a number between 1 and 5'
				};
			}

			this.imdbRating = imdbRating;

			return this;
		}

		Video.prototype = new Playable();

		Video.prototype.play = function () {
			return (Playable.play.call(this)) + ' - ' + this.imdbRating;
		}

		return Video;
	}());

	var module = {
	    getPlayer: function (name){
	        return new Player(name);
	    },
	    getPlaylist: function(name){
	        return new Playlist(name);
	    },
	    getAudio: function(title, author, length){
	        return new Audio(title, author, length);
	    },
	    getVideo: function(title, author, imdbRating){
	        return new Video(title, author, imdbRating);
	    }
	};

	return module;
}

var module = solve();

//creating playlists:
var load = module.getPlaylist('Load'),
	reLoad = module.getPlaylist('ReLoad'),
	stAnger = module.getPlaylist('St.Anger');

//Adding songs to playlists:
load.addPlayable(module.getAudio('The House Jack Build', 'Metallica', 3.00));
load.addPlayable(module.getAudio('Until it Sleeps', 'Metallica', 2.00));
load.addPlayable(module.getAudio('The Hero of the Day', 'Metallica', 11.00));
load.addPlayable(module.getAudio('Mama Said', 'Metallica', 5.00));
load.addPlayable(module.getAudio('Ronnie', 'Metallica', 4.00));

reLoad.addPlayable(module.getAudio('The Memory Remains', 'Metallica', 3.32));
reLoad.addPlayable(module.getAudio('Fuel', 'Metallica', 5.16));
reLoad.addPlayable(module.getAudio('The Unforgiven 2', 'Metallica', 7.22));
reLoad.addPlayable(module.getAudio('Prince Charming', 'Metallica', 10.00));
reLoad.addPlayable(module.getAudio('Low Man\'s lyric', 'Metallica', 9.00));
reLoad.addPlayable(module.getAudio('Fixxxer', 'Metallica', 6.00));

stAnger.addPlayable(module.getAudio('St.Anger', 'Metallica', 8.20));
stAnger.addPlayable(module.getAudio('Frantic', 'Metallica', 7.00));
stAnger.addPlayable(module.getAudio('Invisible Kid', 'Metallica', 6.00));
stAnger.addPlayable(module.getAudio('Sweet Amber', 'Metallica', 2.44));
stAnger.addPlayable(module.getAudio('All Within My Hands', 'Metallica', 8.35));



//Adding playlists to Player:
var winAmp = module.getPlayer('WinAmp');
winAmp.addPlaylist(load);
winAmp.addPlaylist(reLoad);
winAmp.addPlaylist(stAnger);


console.log(load.listPlayables(1, 2));


