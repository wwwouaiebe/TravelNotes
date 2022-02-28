/*
Copyright - 2017 2022 - wwwouaiebe - Contact: https://www.ouaie.be/

This  program is free software;
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation;
either version 3 of the License, or any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

/*
Changes:
	- v1.0.0:
		- created
	- v1.4.0:
		- Replacing DataManager with TravelNotesData, Config, Version and DataSearchEngine
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
	- v2.0.0:
		- Issue ♯138 : Protect the app - control html entries done by user.
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...
*/

import ObjId from '../data/ObjId.js';
import ObjType from '../data/ObjType.js';
import { LAT_LNG, DISTANCE, ZERO, ONE, INVALID_OBJ_ID, ICON_DIMENSIONS } from '../main/Constants.js';
import TravelObject from '../data/TravelObject.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class represent a note
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class Note extends TravelObject {

	/**
	The object type for notes
	@type {ObjType}
	*/

	static #objType = new ObjType (
		'Note',
		[
			'iconHeight',
			'iconWidth',
			'iconContent',
			'popupContent',
			'tooltipContent',
			'phone',
			'url',
			'address',
			'iconLat',
			'iconLng',
			'lat',
			'lng',
			'distance',
			'chainedDistance',
			'objId'
		]
	);

	/**
	the height of the icon associated to the note
	@type {Number}
	*/

	#iconHeight = ICON_DIMENSIONS.height;

	/**
	the width of the icon associated to the note
	@type {Number}
	*/

	#iconWidth = ICON_DIMENSIONS.width;

	/**
	the html needed to display the icon
	@type {String}
	*/

	#iconContent = '';

	/**
	the html added to the icon popup
	@type {String}
	*/

	#popupContent = '';

	/**
	the html added to the icon tooltip
	@type {String}
	*/

	#tooltipContent = '';

	/**
	the phone number dsplayed in the Note
	@type {String}
	*/

	#phone = '';

	/**
	the url dsplayed in the Note
	@type {String}
	*/

	#url = '';

	/**
	the address dsplayed in the Note
	@type {String}
	*/

	#address = '';

	/**
	the latitude of the Note icon
	@type {Number}
	*/

	#iconLat = LAT_LNG.defaultValue;

	/**
	the longitude of the Note icon
	@type {Number}
	*/

	#iconLng = LAT_LNG.defaultValue;

	/**
	the latitude of the Note
	@type {Number}
	*/

	#lat = LAT_LNG.defaultValue;

	/**
	the longitude of the Note
	@type {Number}
	*/

	#lng = LAT_LNG.defaultValue;

	/**
	the distance between the beginning of the Route and the Note
	@default DISTANCE.invalid
	@type {Number}
	*/

	#distance = DISTANCE.invalid;

	/**
	the distance between the beginning of the Travel and the Note
	@default DISTANCE.defaultValue
	@type {Number}
	*/

	#chainedDistance = DISTANCE.defaultValue;

	/**
	the objId of the note
	@type {Number}
	*/

	#objId = INVALID_OBJ_ID;

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
		this.#objId = ObjId.nextObjId;
	}

	/**
	the height of the icon associated to the note
	@type {Number}
	*/

	get iconHeight ( ) { return this.#iconHeight; }

	set iconHeight ( iconHeight ) {
		this.#iconHeight = 'number' === typeof ( iconHeight ) ? iconHeight : ICON_DIMENSIONS.height;
	}

	/**
	the width of the icon associated to the note
	@type {Number}
	*/

	get iconWidth ( ) { return this.#iconWidth; }

	set iconWidth ( iconWidth ) {
		this.#iconWidth = 'number' === typeof ( iconWidth ) ? iconWidth : ICON_DIMENSIONS.width;
	}

	/**
	the html needed to display the icon
	@type {String}
	*/

	get iconContent ( ) { return this.#iconContent; }

	set iconContent ( iconContent ) {
		this.#iconContent =
			'string' === typeof ( iconContent )
				?
				theHTMLSanitizer.sanitizeToHtmlString ( iconContent ).htmlString
				:
				'';
	}

	/**
	the html added to the icon popup
	@type {String}
	*/

	get popupContent ( ) { return this.#popupContent; }

	set popupContent ( popupContent ) {
		this.#popupContent =
			'string' === typeof ( popupContent )
				?
				theHTMLSanitizer.sanitizeToHtmlString ( popupContent ).htmlString
				:
				'';
	}

	/**
	the html added to the icon tooltip
	@type {String}
	*/

	get tooltipContent ( ) { return this.#tooltipContent; }

	set tooltipContent ( tooltipContent ) {
		this.#tooltipContent =
			'string' === typeof ( tooltipContent )
				?
				theHTMLSanitizer.sanitizeToHtmlString ( tooltipContent ).htmlString
				:
				'';
	}

	/**
	the phone number dsplayed in the Note
	@type {String}
	*/

	get phone ( ) { return this.#phone; }

	set phone ( phone ) {
		this.#phone =
			'string' === typeof ( phone )
				?
				theHTMLSanitizer.sanitizeToHtmlString ( phone ).htmlString
				:
				'';
	}

	/**
	the url dsplayed in the Note
	@type {String}
	*/

	get url ( ) { return this.#url; }

	set url ( url ) {
		this.#url =
			'string' === typeof ( url )
				?
				encodeURI ( theHTMLSanitizer.sanitizeToUrl ( url ).url )
				:
				'';
	}

	/**
	the address dsplayed in the Note
	@type {String}
	*/

	get address ( ) { return this.#address; }

	set address ( address ) {
		this.#address =
			'string' === typeof ( address )
				?
				theHTMLSanitizer.sanitizeToHtmlString ( address ).htmlString
				:
				'';
	}

	/**
	the latitude of the Note icon
	@type {Number}
	*/

	get iconLat ( ) { return this.#iconLat; }

	set iconLat ( iconLat ) {
		this.#iconLat = 'number' === typeof ( iconLat ) ? iconLat : LAT_LNG.defaultValue;
	}

	/**
	the longitude of the Note icon
	@type {Number}
	*/

	get iconLng ( ) { return this.#iconLng; }

	set iconLng ( iconLng ) {
		this.#iconLng = 'number' === typeof ( iconLng ) ? iconLng : LAT_LNG.defaultValue;
	}

	/**
	the latitude of the Note
	@type {Number}
	*/

	get lat ( ) { return this.#lat; }

	set lat ( lat ) {
		this.#lat = 'number' === typeof ( lat ) ? lat : LAT_LNG.defaultValue;
	}

	/**
	the longitude of the Note
	@type {Number}
	*/

	get lng ( ) { return this.#lng; }

	set lng ( lng ) {
		this.#lng = 'number' === typeof ( lng ) ? lng : LAT_LNG.defaultValue;
	}

	/**
	the distance between the beginning of the Route and the Note
	@default DISTANCE.invalid
	@type {Number}
	*/

	get distance ( ) { return this.#distance; }

	set distance ( distance ) {
		this.#distance = 'number' === typeof ( distance ) ? distance : DISTANCE.invalid;
	}

	/**
	the distance between the beginning of the Travel and the Note
	@default DISTANCE.defaultValue
	@type {Number}
	*/

	get chainedDistance ( ) { return this.#chainedDistance; }

	set chainedDistance ( chainedDistance ) {
		this.#chainedDistance = 'number' === typeof ( chainedDistance ) ? chainedDistance : DISTANCE.defaultValue;
	}

	/**
	is true when the note is linked with a route
	@type {Boolean}
	*/

	get isRouteNote ( ) { return this.#distance !== DISTANCE.invalid; }

	/**
	the latitude and longitude of the Note icon
	@type {Array.<Number>}
	*/

	get iconLatLng ( ) { return [ this.iconLat, this.iconLng ]; }

	set iconLatLng ( iconLatLng ) {
		if (
			'number' === typeof ( iconLatLng [ ZERO ] )
			&&
			'number' === typeof ( iconLatLng [ ONE ] )
		) {
			this.#iconLat = iconLatLng [ ZERO ];
			this.#iconLng = iconLatLng [ ONE ];
		}
		else {
			this.#iconLat = LAT_LNG.defaultValue;
			this.#iconLng = LAT_LNG.defaultValue;
		}
	}

	/**
	the latitude and longitude of the Note
	@type {Array.<Number>}
	*/

	get latLng ( ) { return [ this.lat, this.lng ]; }

	set latLng ( latLng ) {
		if (
			'number' === typeof ( latLng [ ZERO ] )
			&&
			'number' === typeof ( latLng [ ONE ] )
		) {
			this.#lat = latLng [ ZERO ];
			this.#lng = latLng [ ONE ];
		}
		else {
			this.#lat = LAT_LNG.defaultValue;
			this.#lng = LAT_LNG.defaultValue;
		}
	}

	/**
	the ObjType of the Note.
	@type {ObjType}
	*/

	get objType ( ) { return Note.#objType; }

	/**
	the objId of the Note. objId are unique identifier given by the code
	@type {Number}
	*/

	get objId ( ) { return this.#objId; }

	/**
	An object literal with the Note properties and without any methods.
	This object can be used with the JSON object
	@type {JsonObject}
	*/

	get jsonObject ( ) {
		return {
			iconHeight : this.iconHeight,
			iconWidth : this.iconWidth,
			iconContent : this.iconContent,
			popupContent : this.popupContent,
			tooltipContent : this.tooltipContent,
			phone : this.phone,
			url : this.url,
			address : this.address,
			iconLat : parseFloat ( this.iconLat.toFixed ( LAT_LNG.fixed ) ),
			iconLng : parseFloat ( this.iconLng.toFixed ( LAT_LNG.fixed ) ),
			lat : parseFloat ( this.lat.toFixed ( LAT_LNG.fixed ) ),
			lng : parseFloat ( this.lng.toFixed ( LAT_LNG.fixed ) ),
			distance : parseFloat ( this.distance.toFixed ( DISTANCE.fixed ) ),
			chainedDistance : parseFloat ( this.chainedDistance.toFixed ( DISTANCE.fixed ) ),
			objId : this.#objId,
			objType : this.objType.jsonObject
		};
	}
	set jsonObject ( something ) {
		const otherthing = this.validateObject ( something );
		this.iconHeight = otherthing.iconHeight;
		this.iconWidth = otherthing.iconWidth;
		this.iconContent = otherthing.iconContent;
		this.popupContent = otherthing.popupContent;
		this.tooltipContent = otherthing.tooltipContent;
		this.phone = otherthing.phone;
		this.url = otherthing.url;
		this.address = otherthing.address;
		this.iconLat = otherthing.iconLat;
		this.iconLng = otherthing.iconLng;
		this.lat = otherthing.lat;
		this.lng = otherthing.lng;
		this.distance = otherthing.distance;
		this.chainedDistance = otherthing.chainedDistance;
		this.#objId = ObjId.nextObjId;
	}
}

export default Note;

/* --- End of file --------------------------------------------------------------------------------------------------------- */