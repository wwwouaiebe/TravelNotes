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
	- v3.4.0:
		- Issue ♯23 : URL have changed for OSM.
Doc reviewed 20210913
Tests ...
*/

import theAPIKeysManager from '../core/APIKeysManager.js';
import MapLayer from '../data/MapLayer.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class contains all the mapLayers

See theMapLayersCollection for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MapLayersCollection {

	/**
	A JS map to store the mapLayers, ordered by name
	@type {Map.<MapLayer>}
	*/

	#mapLayers;

	/**
	The mapLayer to use by default
	@type {MapLayer}
	*/

	#defaultMapLayer;

	/**
	A guard to block a second upload of the mapLayers
	@type {Boolean}
	*/

	#mapLayersAdded;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#mapLayers = new Map ( );
		this.#mapLayersAdded = false;
		this.#defaultMapLayer = new MapLayer (
			{
				service : 'wmts',
				url : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
				name : 'OSM - Color',
				toolbar :
				{
					text : 'OSM',
					color : '\u0023ff0000',
					backgroundColor : '\u0023ffffff'
				},
				providerName : 'OSM',
				providerKeyNeeded : false,
				attribution : ''
			}
		);
		this.#mapLayers.set ( this.#defaultMapLayer.name, this.#defaultMapLayer );
	}

	/**
	gives a MapLayer object
	@param {String} mapLayerName the name of the MapLayer to give
	@return {MapLayer} The asked MapLayer. If a provider key is needed and the key not available
	the defaultMapLayer is returned. If the layer is not found, the defaultMapLayer
	is returned
	*/

	getMapLayer ( mapLayerName ) {
		let mapLayer = this.#mapLayers.get ( mapLayerName ) || this.#defaultMapLayer;
		if ( mapLayer.providerKeyNeeded ) {
			if ( ! theAPIKeysManager.hasKey ( mapLayer.providerName.toLowerCase ( ) ) ) {
				mapLayer = this.#defaultMapLayer;
			}
		}

		return mapLayer;
	}

	/**
	Executes a function on each MapLayer in the collection
	@param {Function} fct The function to execute
	*/

	forEach ( fct ) { this.#mapLayers.forEach ( fct ); }

	/**
	Add a MapLayer list to the list of available MapLayers. This method can only be called once
	@param {Array.<Object>} jsonLayers the layer list to add (json object from TravelNotesLayers.json)
	*/

	addMapLayers ( jsonLayers ) {

		if ( this.#mapLayersAdded ) {
			return;
		}
		jsonLayers.forEach (
			jsonLayer => {
				const newLayer = new MapLayer ( jsonLayer );
				if ( ! this.#mapLayers.get ( newLayer.name ) ) {
					this.#mapLayers.set ( newLayer.name, newLayer );
				}
			}
		);
		this.#mapLayersAdded = true;
	}

	/**
	get the defaultMapLayer
	@type {MapLayer}
	*/

	get defaultMapLayer ( ) { return this.#defaultMapLayer; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of MapLayersCollection class
@type {MapLayersCollection}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theMapLayersCollection = new MapLayersCollection ( );

export default theMapLayersCollection;

/* --- End of file --------------------------------------------------------------------------------------------------------- */