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
	- v4.0.0:
		- created from v3.6.0
Doc reviewed 202208
 */

import theEventDispatcher from '../../core/lib/EventDispatcher.js';
import theAttributionsUI from '../../uis/attributionsUI/AttributionsUI.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Click event listener for the map layer buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MapLayerButtonClickEL {

	/**
	A reference to the array of MapLayer objects
	@type {Array.<MapLayer>}
	*/

	#mapLayers;

	/**
	The constructor
	@param {Array.<MapLayer>} mapLayers A reference to the array of MapLayer objects
	*/

	constructor ( mapLayers ) {
		Object.freeze ( this );
		this.#mapLayers = mapLayers;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		const mapLayer = this.#mapLayers [ Number.parseInt ( clickEvent.target.dataset.tanMapLayerId ) ];
		theEventDispatcher.dispatch ( 'layerchange', { layer : mapLayer } );
		theAttributionsUI.attributions = mapLayer.attribution;
	}
}

export default MapLayerButtonClickEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */