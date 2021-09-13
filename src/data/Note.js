/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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

/**
@------------------------------------------------------------------------------------------------------------------------------

@file Note.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module data
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/* eslint no-fallthrough: ["error", { "commentPattern": "eslint break omitted intentionally" }]*/

import ObjId from '../data/ObjId.js';
import ObjType from '../data/ObjType.js';
import { LAT_LNG, DISTANCE, ZERO, ONE, INVALID_OBJ_ID, ICON_DIMENSIONS } from '../main/Constants.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';

const OUR_OBJ_TYPE = new ObjType ( 'Note' );

/**
@--------------------------------------------------------------------------------------------------------------------------

@class Note
@classdesc This class represent a note
@hideconstructor

@--------------------------------------------------------------------------------------------------------------------------
*/

class Note {

	/**
	the height of the icon associated to the note
	@type {!number}
	@private
	*/

	#iconHeight = ICON_DIMENSIONS.height;

	/**
	the width of the icon associated to the note
	@type {!number}
	@private
	*/

	#iconWidth = ICON_DIMENSIONS.width;

	/**
	the html needed to display the icon
	@type {string}
	@private
	*/

	#iconContent = '';

	/**
	the html added to the icon popup
	@type {string}
	@private
	*/

	#popupContent = '';

	/**
	the html added to the icon tooltip
	@type {string}
	@private
	*/

	#tooltipContent = '';

	/**
	the phone number dsplayed in the Note
	@type {string}
	@private
	*/

	#phone = '';

	/**
	the url dsplayed in the Note
	@type {string}
	@private
	*/

	#url = '';

	/**
	the address dsplayed in the Note
	@type {string}
	@private
	*/

	#address = '';

	/**
	the latitude of the Note icon
	@type {number}
	@private
	*/

	#iconLat = LAT_LNG.defaultValue;

	/**
	the longitude of the Note icon
	@type {number}
	@private
	*/

	#iconLng = LAT_LNG.defaultValue;

	/**
	the latitude of the Note
	@type {number}
	@private
	*/

	#lat = LAT_LNG.defaultValue;

	/**
	the longitude of the Note
	@type {number}
	@private
	*/

	#lng = LAT_LNG.defaultValue;

	/**
	the distance between the beginning of the Route and the Note
	@default DISTANCE.invalid
	@type {number}
	@private
	*/

	#distance = DISTANCE.invalid;

	/**
	the distance between the beginning of the Travel and the Note
	@default DISTANCE.defaultValue
	@type {number}
	@private
	*/

	#chainedDistance = DISTANCE.defaultValue;

	#objId = INVALID_OBJ_ID;;

	/**
	Transform a style attribute to a class attribute for conversion from 1.13.0 to 2.0.0 version
	@param {string} somethingText
	@return {string} the modified text
	@private
	*/

	#UpdateStyles ( somethingText ) {
		let returnValue = somethingText
			.replaceAll ( /style='color:white;background-color:red'/g, 'class=\'TravelNotes-Note-WhiteRed\'' )
			.replaceAll ( /style='color:white;background-color:green'/g, 'class=\'TravelNotes-Note-WhiteGreen\'' )
			.replaceAll ( /style='color:white;background-color:blue'/g, 'class=\'TravelNotes-Note-WhiteBlue\'' )
			.replaceAll ( /style='color:white;background-color:brown'/g, 'class=\'TravelNotes-Note-WhiteBrown\'' )
			.replaceAll ( /style='color:white;background-color:black'/g, 'class=\'TravelNotes-Note-WhiteBlack\'' )
			.replaceAll ( /style='border:solid 0.1em'/g, 'class=\'TravelNotes-Note-BlackWhite\'' )
			.replaceAll ( /style='background-color:white;'/g, 'class=\'TravelNotes-Note-Knooppunt\'' )
			.replaceAll ( /style='fill:green;font:bold 120px sans-serif;'/g, '' )
			.replaceAll ( /style='fill:none;stroke:green;stroke-width:10;'/g, '' );
		return returnValue;
	}

	/**
	Performs the upgrade
	@param {Object} note a note to upgrade
	@throws {Error} when the note version is invalid
	@private
	*/

	/* eslint-disable-next-line complexity */
	#upgradeObject ( note ) {
		switch ( note.objType.version ) {
		case '1.0.0' :
		case '1.1.0' :
		case '1.2.0' :
		case '1.3.0' :
		case '1.4.0' :
		case '1.5.0' :
		case '1.6.0' :
		case '1.7.0' :
		case '1.7.1' :
		case '1.8.0' :
		case '1.9.0' :
		case '1.10.0' :
		case '1.11.0' :
		case '1.12.0' :
		case '1.13.0' :
			if ( 'string' === typeof ( note.iconHeight ) ) {
				note.iconHeight = Number.parseInt ( note.iconHeight );
			}
			if ( 'string' === typeof ( note.iconWidth ) ) {
				note.iconWidth = Number.parseInt ( note.iconWidth );
			}
			note.iconContent = this.#UpdateStyles ( note.iconContent );
			note.popupContent = this.#UpdateStyles ( note.popupContent );
			note.tooltipContent = this.#UpdateStyles ( note.tooltipContent );
			note.phone = this.#UpdateStyles ( note.phone );
			note.address = this.#UpdateStyles ( note.address );
			// eslint break omitted intentionally
		case '2.0.0' :
		case '2.1.0' :
		case '2.2.0' :
			note.objType.version = '2.3.0';
			break;
		default :
			throw new Error ( 'invalid version for ' + OUR_OBJ_TYPE.name );
		}
	}

	/**
	Verify that the parameter can be transformed to a Note and performs the upgrate if needed
	@param {Object} something an object to validate
	@return {Object} the validated object
	@throws {Error} when the parameter is invalid
	@private
	*/

	#validateObject ( something ) {
		if ( ! Object.getOwnPropertyNames ( something ).includes ( 'objType' ) ) {
			throw new Error ( 'No objType for ' + OUR_OBJ_TYPE.name );
		}
		OUR_OBJ_TYPE.validate ( something.objType );
		if ( OUR_OBJ_TYPE.version !== something.objType.version ) {
			this.#upgradeObject ( something );
		}
		let properties = Object.getOwnPropertyNames ( something );
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
		].forEach (
			property => {
				if ( ! properties.includes ( property ) ) {
					throw new Error ( 'No ' + property + ' for ' + OUR_OBJ_TYPE.name );
				}
			}
		);
		return something;
	}

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#objId = ObjId.nextObjId;
	}

	/**
	the height of the icon associated to the note
	@type {!number}
	*/

	get iconHeight ( ) { return this.#iconHeight; }

	set iconHeight ( iconHeight ) {
		this.#iconHeight = 'number' === typeof ( iconHeight ) ? iconHeight : ICON_DIMENSIONS.height;
	}

	/**
	the width of the icon associated to the note
	@type {!number}
	*/

	get iconWidth ( ) { return this.#iconWidth; }

	set iconWidth ( iconWidth ) {
		this.#iconWidth = 'number' === typeof ( iconWidth ) ? iconWidth : ICON_DIMENSIONS.width;
	}

	/**
	the html needed to display the icon
	@type {string}
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
	@type {string}
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
	@type {string}
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
	@type {string}
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
	@type {string}
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
	@type {string}
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
	@type {number}
	*/

	get iconLat ( ) { return this.#iconLat; }

	set iconLat ( iconLat ) {
		this.#iconLat = 'number' === typeof ( iconLat ) ? iconLat : LAT_LNG.defaultValue;
	}

	/**
	the longitude of the Note icon
	@type {number}
	*/

	get iconLng ( ) { return this.#iconLng; }

	set iconLng ( iconLng ) {
		this.#iconLng = 'number' === typeof ( iconLng ) ? iconLng : LAT_LNG.defaultValue;
	}

	/**
	the latitude of the Note
	@type {number}
	*/

	get lat ( ) { return this.#lat; }

	set lat ( lat ) {
		this.#lat = 'number' === typeof ( lat ) ? lat : LAT_LNG.defaultValue;
	}

	/**
	the longitude of the Note
	@type {number}
	*/

	get lng ( ) { return this.#lng; }

	set lng ( lng ) {
		this.#lng = 'number' === typeof ( lng ) ? lng : LAT_LNG.defaultValue;
	}

	/**
	the distance between the beginning of the Route and the Note
	@default DISTANCE.invalid
	@type {number}
	*/

	get distance ( ) { return this.#distance; }

	set distance ( distance ) {
		this.#distance = 'number' === typeof ( distance ) ? distance : DISTANCE.invalid;
	}

	/**
	the distance between the beginning of the Travel and the Note
	@default DISTANCE.defaultValue
	@type {number}
	*/

	get chainedDistance ( ) { return this.#chainedDistance; }

	set chainedDistance ( chainedDistance ) {
		this.#chainedDistance = 'number' === typeof ( chainedDistance ) ? chainedDistance : DISTANCE.defaultValue;
	}

	/**
	is true when the note is linked with a route
	@type {boolean}
	@readonly
	*/

	get isRouteNote ( ) { return this.#distance !== DISTANCE.invalid; }

	/**
	the latitude and longitude of the Note icon
	@type {Array.<number>}
	*/

	get iconLatLng ( ) { return [ this.iconLat, this.iconLng ]; }

	set iconLatLng ( iconLatLng ) {
		if (
			'number' === typeof ( iconLatLng [ ZERO ] )
			&&
			'number' === typeof ( iconLatLng )
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
	@type {Array.<number>}
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
	@readonly
	*/

	get objType ( ) { return OUR_OBJ_TYPE; }

	/**
	the objId of the Note. objId are unique identifier given by the code
	@readonly
	@type {!number}
	*/

	get objId ( ) { return this.#objId; }

	/**
	An object literal with the Note properties and without any methods.
	This object can be used with the JSON object
	@type {Object}
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
			objType : OUR_OBJ_TYPE.jsonObject
		};
	}
	set jsonObject ( something ) {
		const otherthing = this.#validateObject ( something );
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

/*
--- End of Note.js file -------------------------------------------------------------------------------------------------------
*/