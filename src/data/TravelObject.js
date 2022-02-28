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
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed ...
Tests ...
*/

import TravelUpdater from '../data/TravelUpdater.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the bases class for all the objects contained in a travel
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelObject {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Verify that the parameter can be transformed to a TravelObject
	@param {JsonObject} something an object to validate
	@return {JsonObject} the validated object
	*/

	validateObject ( something ) {
		if ( ! Object.getOwnPropertyNames ( something ).includes ( 'objType' ) ) {
			throw new Error ( 'No objType for ' + this.objType.name );
		}
		this.objType.validate ( something.objType );
		if ( 'Travel' === this.objType.name && this.objType.version !== something.objType.version ) {
			new TravelUpdater ( ).update ( something );
		}
		const properties = Object.getOwnPropertyNames ( something );
		this.objType.properties.forEach (
			property => {
				if ( ! properties.includes ( property ) ) {
					throw new Error ( 'No ' + property + ' for ' + this.objType.name );
				}
			}
		);
		return something;
	}
}

export default TravelObject;

/* --- End of file --------------------------------------------------------------------------------------------------------- */