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
	- v1.4.0:
		- created from DataManager
		- added searchPointMarker, previousSearchLimit, nextSearchLimit to config
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
		- Issue ♯63 : Find a better solution for provider keys upload
		- Issue ♯75 : Merge Maps and TravelNotes
	- v1.9.0:
		- Issue ♯101 : Add a print command for a route
	- v1.11.0:
		- Issue ♯110 : Add a command to create a SVG icon from osm for each maneuver
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
	- v2.0.0:
		- Issue ♯136 : Remove html entities from js string
		- Issue ♯138 : Protect the app - control html entries done by user.
		- Issue ♯139 : Remove Globals
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...
*/

import theConfig from '../data/Config.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Class used to overload theConfig with the contains of theTravelNotesConfig.json file and
finally freeze the config.

See theConfig for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ConfigOverloader {

	/**
	copy the properties between two objects

	This method:
	- search recursively all target properties
	- foreach found property, search the same property in source
	- copy the property value from source to target if found
	- search recursively all sources properties
	- foreach found property search the same property in target
	- copy the property value from source to target
	So:
	- if a property is missing in the user config, the property is selected from the default config
	- if a property is in the user config but missing in the default config, the property is also added (and reminder
	  that the user can have more dashChoices than the default config )
	- if a property is changed in the user config, the property is adapted
	@param {Object} source The source object
	@param {Object} target The target object
	*/

	#copyObjectTo ( source, target ) {
		if ( ( 'object' !== typeof source ) || ( 'object' !== typeof target ) ) {
			return;
		}

		// iteration on target.
		for ( const property in target ) {
			if ( 'object' === typeof target [ property ] ) {
				this.#copyObjectTo ( source [ property ], target [ property ] );
			}
			else if ( typeof ( source [ property ] ) === typeof ( target [ property ] ) ) {
				if ( 'string' === typeof ( target [ property ] ) ) {
					if ( 'color' === property ) {
						target [ property ] = theHTMLSanitizer.sanitizeToColor ( source [ property ] )
							||
							target [ property ];
					}
					else if ( 'url' === property ) {
						target [ property ] = theHTMLSanitizer.sanitizeToUrl ( source [ property ] ).url;
					}
					else {
						target [ property ] =
								theHTMLSanitizer.sanitizeToJsString ( source [ property ] );
					}
				}
				else {
					target [ property ] = source [ property ] || target [ property ];
				}
			}
		}

		// iteration on source
		for ( const property in source ) {
			if ( 'object' === typeof source [ property ] ) {
				if ( '[object Array]' === Object.prototype.toString.call ( source [ property ] ) ) {
					target [ property ] = target [ property ] || [];
				}
				else {
					target [ property ] = target [ property ] || {};
				}
				this.#copyObjectTo ( source [ property ], target [ property ] );
			}
			else if ( 'string' === typeof ( target.property ) ) {
				target [ property ] =
							theHTMLSanitizer.sanitizeToHtmlString ( source [ property ], [] ).htmlString;
			}
			else {
				target [ property ] = source [ property ];
			}
		}
	}

	/**
	Freeze an object recursively
	@param {Object} object The object to freeze
	*/

	#freeze ( object ) {
		for ( const property in object ) {
			if ( 'object' === typeof object [ property ] ) {
				this.#freeze ( object [ property ] );
			}
		}
		Object.freeze ( object );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Overload the default config with another config. The config can be overloaded only once!
	@param {JsonObject} source The object from witch theConfig will be overloaded
	( = the contains of the TravelNotesConfig.json file )
	*/

	overload ( source ) {
		this.#copyObjectTo ( source, theConfig );
		this.#freeze ( theConfig );
	}
}

export default ConfigOverloader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */