/*
Copyright - 2017 2023 - wwwouaiebe - Contact: https://www.ouaie.be/

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
import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import MapLayer from '../../data/MapLayer.js';
import MapLayerButtonClickEL from './MapLayerButtonClickEL.js';
import GeoLocationButtonClickEL from './GeoLocationButtonClickEL.js';
import ZoomButtonClickEL from './ZoomButtonClickEL.js';
import { ZERO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the Layer Toolbar on the left of the viewer screen.
- Displays buttons to change the background maps and manages the background maps list.
- Displays also a geo location button and a zoom to travel button.
See theViewerLayersToolbar for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ViewerLayersToolbar {

	/**
	The toolbar
	@type {HTMLElement}
	*/

	#mapLayersToolbar;

	/**
	An array with the available MapLayer objects
	@type {Array.<MapLayer>}
	*/

	#mapLayers;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#mapLayers = [];
		const osmMapLayer = new MapLayer (
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
		this.#mapLayers.push ( osmMapLayer );

	}

	/**
	creates the user interface
	*/

	createUI ( ) {

		// Toolbar
		this.#mapLayersToolbar = theHTMLElementsFactory.create (
			'div',
			{ id : 'travelnotes-viewer-layers-toolbar' },
			document.body
		);

		// Geolocation button
		// Don't test the https protocol. On some mobile devices with an integreted GPS
		// the geolocation is working also on http protocol
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'travelnotes-viewer-layers-toolbar-button',
				title : 'My position',
				textContent : '🌐',
				style : 'color:black;background-color:white'
			},
			this.#mapLayersToolbar
		).addEventListener ( 'click', new GeoLocationButtonClickEL ( ), false );

		// Zoom button
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'travelnotes-viewer-layers-toolbar-button',
				title : 'Zoom on the travel',
				textContent : '🔍',
				style : 'color:black;background-color:white'
			},
			this.#mapLayersToolbar
		).addEventListener ( 'click', new ZoomButtonClickEL ( ), false );

		// MapLayer buttons
		const mapLayerButtonClickEL = new MapLayerButtonClickEL ( this.#mapLayers );
		for ( let mapLayerCounter = 0; mapLayerCounter < this.#mapLayers.length; mapLayerCounter ++ ) {
			const mapLayer = this.#mapLayers [ mapLayerCounter ];
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'travelnotes-viewer-layers-toolbar-button',
					title : mapLayer.name,
					dataset : { MapLayerId : mapLayerCounter },
					textContent : mapLayer.toolbarButtonData.text,
					style : 'color:' +
						mapLayer.toolbarButtonData.color + ';background-color:' +
						mapLayer.toolbarButtonData.backgroundColor
				},
				this.#mapLayersToolbar
			).addEventListener ( 'click', mapLayerButtonClickEL, false );
		}
	}

	/**
	Set a layer as background map. If the layer is not found, the 'OSM - Color' layer is set
	@param {String} layerName the name of the layer to set or the index of theMapLayer in the #mapLayers
	*/

	setMapLayer ( layerName ) {
		const newLayer =
			( layerName.match ( /^[0-9]$/ ) )
				?
				this.#mapLayers [ Number.parseInt ( layerName ) ] || this.#mapLayers [ ZERO ]
				:
				this.#mapLayers.find ( layer => layer.name === layerName ) || this.#mapLayers [ ZERO ];
		theEventDispatcher.dispatch ( 'layerchange', { layer : newLayer } );
		theAttributionsUI.attributions = newLayer.attribution;
	}

	/**
	Add a layer list to the list of available layers
	@param {JsonObject} jsonLayers the layer list to add
	*/

	addMapLayers ( jsonLayers ) {
		jsonLayers.forEach (
			jsonLayer => {
				const newLayer = new MapLayer ( jsonLayer );
				if ( ! newLayer.providerKeyNeeded ) {
					this.#mapLayers.push ( newLayer );
				}
			}
		);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of ViewerLayersToolbar class
@type {ViewerLayersToolbar}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theViewerLayersToolbar = new ViewerLayersToolbar ( );

export default theViewerLayersToolbar;

/* --- End of file --------------------------------------------------------------------------------------------------------- */