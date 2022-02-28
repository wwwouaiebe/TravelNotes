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
	- v1.5.0:
		- Issue ♯52 : when saving the travel to the file, save also the edited route.
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...
*/

import { NOT_FOUND } from '../main/Constants.js';
import { theDataVersion } from '../data/Version.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class represent a ObjType
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ObjType {

	/**
	The name of the object
	@type {String}
	*/

	#objTypeName = '';

	/**
	An array with all the valid objects names for the ObjType objects
	@type {Array.<String>}
	*/

	#validObjTypeNames = [ 'Itinerary', 'ItineraryPoint', 'Maneuver', 'Note', 'Route', 'Travel', 'WayPoint' ];

	/**
	An array with all the valid properties for the ObjType
	@type {Array.<String>}
	*/

	#properties = [];

	/**
	constructor
	@param {String} objTypeName The name of the ObjType
	@param {Array.<String>} properties The properties names of the ObjType
	*/

	constructor ( objTypeName, properties ) {
		Object.freeze ( this );
		if ( NOT_FOUND === this.#validObjTypeNames.indexOf ( objTypeName ) ) {
			throw new Error ( 'Invalid ObjType name : ' + objTypeName );
		}
		this.#objTypeName = objTypeName;
		this.#properties = properties;
		Object.freeze ( this.#properties );
	}

	/**
	the name of the ObjType
	@type {String}
	*/

	get name ( ) { return this.#objTypeName; }

	/**
	the version of the ObjType
	@type {String}
	*/

	get version ( ) { return theDataVersion; }

	/**
	An array with all the valid properties for the ObjType
	@type {Array.<String>}
	*/

	get properties ( ) { return this.#properties; }

	/**
	An object literal with the ObjType properties and without any methods.
	This object can be used with the JSON object
	@type {JsonObject}
	*/

	get jsonObject ( ) {
		return {
			name : this.#objTypeName,
			version : theDataVersion
		};
	}

	/**
	Verify that the given object is an ObjType and is valid
	@param {JsonObject} something An object to validate
	*/

	validate ( something ) {
		if ( ! Object.getOwnPropertyNames ( something ).includes ( 'name' ) ) {
			throw new Error ( 'No name for ' + this.#objTypeName );
		}
		if ( this.#objTypeName !== something.name ) {
			throw new Error ( 'Invalid name for ' + this.#objTypeName );
		}
		if ( ! Object.getOwnPropertyNames ( something ).includes ( 'version' ) ) {
			throw new Error ( 'No version for ' + this.#objTypeName );
		}
	}
}

export default ObjType;

/* --- End of file --------------------------------------------------------------------------------------------------------- */