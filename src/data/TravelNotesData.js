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
		- added searchData
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

-------------------------------------------------------------------------------------------------------------------------------
*/

import Travel from '../data/Travel.js';
import theUtilities from '../UILib/Utilities.js';
import { INVALID_OBJ_ID } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
helper class to encapsulate the routing
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class Routing {

	/**
	The routing provider
	@type {String}
	*/

	#provider = '';

	/**
	The routing transit mode
	@type {String}
	*/

	#transitMode = '';

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	The routing provider
	@type {String}
	*/

	get provider ( ) { return this.#provider; }

	set provider ( provider ) {
		this.#provider = 'string' === typeof ( provider ) ? provider : '';
	}

	/**
	The routing transit mode
	@type {String}
	*/

	get transitMode ( ) { return this.#transitMode; }

	set transitMode ( transitMode ) {
		this.#transitMode = 'string' === typeof ( transitMode ) ? transitMode : '';
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Class used to store the data needed by TravelNotes
See theTravelNotesData for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelNotesData {

	/**
	A JS map with the provider objects. Providers objects are created and added by the plugins
	@type {Map.<BaseRouteProvider>}
	*/

	#providers;

	/**
	A JS map with all the Leaflet objects ordered by objId
	@type {Map.Object}
	*/

	#mapObjects;

	/**
	An Object with the provider and transit mode used
	@type {Routing}
	*/

	#routing;

	/**
	The UUID currently used
	@type {String}
	*/

	#UUID;

	/**
	The Leaflet map object
	@type {LeafletObject}
	*/

	#map;

	/**
	The one and only one object Travel
	@type {Travel}
	*/

	#travel;

	/**
	The objId of the currently edited route or INVALID_OBJ_ID if none
	@type {Number}
	*/

	#editedRouteObjId;

	/**
	The POI data found in OpenStreetMap
	@type {Array.<Object>}
	*/

	#searchData;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#providers = new Map ( );
		this.#mapObjects = new Map ( );
		this.#routing = new Routing ( );
		this.#UUID = theUtilities.UUID;
		this.#map = null;
		this.#travel = new Travel ( );
		this.#editedRouteObjId = INVALID_OBJ_ID;
		this.#searchData = [];
	}

	/**
	The Leaflet map object
	@type {LeafletObject}
	*/

	get map ( ) { return this.#map; }

	set map ( map ) {
		if ( ! this.#map ) {
			this.#map = map;
		}
	}

	/**
	The one and only one object Travel
	@type {Travel}
	*/

	get travel ( ) { return this.#travel; }

	/**
	The objId of the currently edited route or INVALID_OBJ_ID if none
	@type {Number}
	*/

	get editedRouteObjId ( ) { return this.#editedRouteObjId; }

	set editedRouteObjId ( editedRouteObjId ) {
		this.#editedRouteObjId = 'number' === typeof ( editedRouteObjId ) ? editedRouteObjId : INVALID_OBJ_ID;
	}

	/**
	The POI data found in OpenStreetMap
	@type {Array.<Object>}
	*/

	get searchData ( ) { return this.#searchData; }

	/**
	A JS map with the provider objects. Providers objects are created and added by the plugins
	@type {Map.<BaseRouteProvider>}
	*/

	get providers ( ) { return this.#providers; }

	/**
	A JS map with all the Leaflet objects ordered by objId
	@type {Map.Object}
	*/

	get mapObjects ( ) { return this.#mapObjects; }

	/**
	An Object with the provider and transit mode used
	@type {Routing}
	*/

	get routing ( ) { return this.#routing; }

	/**
	The UUID currently used
	@type {String}
	*/

	get UUID ( ) { return this.#UUID; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of TravelNoteData class
@type {TravelNotesData}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theTravelNotesData = new TravelNotesData ( );

export default theTravelNotesData;

/* --- End of file --------------------------------------------------------------------------------------------------------- */