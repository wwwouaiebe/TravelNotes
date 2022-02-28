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
	- v2.0.0:
		- created
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...
*/

import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';
import { ZERO, ONE } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container for the layer toolbar buttons properties
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class LayerToolbarButtonData {

	/**
	The text displayed in the button
	@type {String}
	*/

	#text;

	/**
	The button text color
	@type {String}
	*/

	#color;

	/**
	The button background color
	@type {String}
	*/

	#backgroundColor;

	/**
	The constructor
	@param {JsonObject} jsonToolbarData a json object with the data for the button
	*/

	constructor ( jsonToolbarData ) {
		if (
			'string' !== typeof ( jsonToolbarData?.text )
			||
			'string' !== typeof ( jsonToolbarData?.color )
			||
			'string' !== typeof ( jsonToolbarData?.backgroundColor )
		) {
			throw new Error ( 'invalid toolbar for layer' );
		}
		Object.freeze ( this );
		this.#text = theHTMLSanitizer.sanitizeToJsString ( jsonToolbarData.text );
		this.#color = theHTMLSanitizer.sanitizeToColor ( jsonToolbarData.color );
		this.#backgroundColor =	theHTMLSanitizer.sanitizeToColor ( jsonToolbarData.backgroundColor );
	}

	/**
	The text displayed in the button
	@type {String}
	*/

	get text ( ) { return this.#text; }

	/**
	The button text color
	@type {String}
	*/

	get color ( ) { return this.#color; }

	/**
	The button background color
	@type {String}
	*/

	get backgroundColor ( ) { return this.#backgroundColor; }

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class represent a background map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MapLayer	{

	/**
	The name of the map
	@type {String}
	*/

	#name = null;

	/**
	The type of service: wms or wmts
	@type {String}
	*/

	#service = null;

	/**
	The url to use to get the map
	@type {String}
	*/

	#url = null;

	/**
	The wmsOptions for this mapLayer
	See the Leaflet TileLayer.WMS documentation
	@type {LeafletObject}
	*/

	#wmsOptions = null;

	/**
	The lower left and upper right corner of the mapLayer
	@type {Array.<Number>}
	*/

	#bounds = null;

	/**
	The smallest possible zoom for this mapLayer
	@type {Number}
	*/

	#minZoom = null;

	/**
	The largest possible zoom for this mapLayer
	@type {Number}
	*/

	#maxZoom = null;

	/**
	An object with text, color and backgroundColor properties used to create the button in the toolbar
	@type {LayerToolbarButtonData}
	*/

	#toolbarButtonData = null;

	/**
	The name of the service provider.
	@type {String}
	*/

	#providerName = null;

	/**
	When true, an access key is required to get the map.
	@type {Boolean}
	*/

	#providerKeyNeeded = false;

	/**
	The map attributions.
	@type {String}
	*/

	#attribution = null;

	/**
	A temporary variable to store the layer data
	@type {JsonObject}
	*/

	#jsonLayer = null;

	/**
	Set the name of the map layer
	*/

	#setLayerName ( ) {
		if ( 'string' === typeof ( this.#jsonLayer?.name ) ) {
			this.#name = theHTMLSanitizer.sanitizeToJsString ( this.#jsonLayer.name );
		}
		else {
			throw new Error ( 'invalid name for layer' );
		}
	}

	/**
	Set the type of service: wms or wmts
	*/

	#setService ( ) {
		if ( 'wms' === this.#jsonLayer?.service || 'wmts' === this.#jsonLayer?.service ) {
			this.#service = this.#jsonLayer.service;
		}
		else {
			throw new Error ( 'invalid service for layer ' + this.#name );
		}
	}

	/**
	Set the url to use to get the map
	*/

	#setUrl ( ) {
		if ( 'string' === typeof ( this.#jsonLayer?.url ) ) {
			this.#url = this.#jsonLayer.url;
		}
		else {
			throw new Error ( 'invalid url for layer ' + this.#name );
		}
	}

	/**
	Set the wmsOptions for this mapLayer
	*/

	#setWmsOptions ( ) {
		if ( 'wms' === this.#service ) {
			if (
				'string' === typeof ( this.#jsonLayer?.wmsOptions?.layers )
				&&
				'string' === typeof ( this.#jsonLayer?.wmsOptions?.format )
				&&
				'boolean' === typeof ( this.#jsonLayer?.wmsOptions?.transparent )
			) {
				this.#wmsOptions = this.#jsonLayer.wmsOptions;
				this.#wmsOptions.layers = theHTMLSanitizer.sanitizeToJsString ( this.#wmsOptions.layers );
				this.#wmsOptions.format = theHTMLSanitizer.sanitizeToJsString ( this.#wmsOptions.format );
			}
			else {
				throw new Error ( 'invalid wmsOptions for layer ' + this.#name );
			}
		}
	}

	/**
	Set the lower left and upper right corner of the mapLayer
	*/

	#setBounds ( ) {
		try {
			if (
				this.#jsonLayer.bounds
				&&
				'number' === typeof this.#jsonLayer.bounds [ ZERO ] [ ZERO ]
				&&
				'number' === typeof this.#jsonLayer.bounds [ ZERO ] [ ONE ]
				&&
				'number' === typeof this.#jsonLayer.bounds [ ONE ] [ ZERO ]
				&&
				'number' === typeof this.#jsonLayer.bounds [ ONE ] [ ONE ]
			) {
				this.#bounds = this.#jsonLayer.bounds;
			}
		}
		catch ( err ) {
			throw new Error ( 'invalid bounds for layer ' + this.#name );
		}
	}

	/**
	Set the min and max zoom for the map
	*/

	#setMinMaxZoom ( ) {
		if ( this.#jsonLayer.minZoom ) {
			if ( 'number' === typeof ( this.#jsonLayer.minZoom ) ) {
				this.#minZoom = this.#jsonLayer.minZoom;
			}
			else {
				throw new Error ( 'invalid minZoom for layer ' + this.#name );
			}
		}
		if ( this.#jsonLayer.maxZoom ) {
			if ( 'number' === typeof ( this.#jsonLayer.maxZoom ) ) {
				this.#maxZoom = this.#jsonLayer.maxZoom;
			}
			else {
				throw new Error ( 'invalid maxZoom for layer ' + this.#name );
			}
		}
	}

	/**
	Set the toolbar data
	*/

	#setToolbarButtonData ( ) {
		this.#toolbarButtonData = new LayerToolbarButtonData ( this.#jsonLayer.toolbar );
	}

	/**
	Set the name of the service provider
	*/

	#setProviderName ( ) {
		if ( 'string' === typeof ( this.#jsonLayer?.providerName ) ) {
			this.#providerName = theHTMLSanitizer.sanitizeToJsString ( this.#jsonLayer.providerName );
		}
		else {
			throw new Error ( 'invalid providerName for layer ' + this.#name );
		}
	}

	/**
	Set the providerKeyNeeded value
	*/

	#setProviderKeyNeeded ( ) {
		if ( 'boolean' === typeof ( this.#jsonLayer.providerKeyNeeded ) ) {
			this.#providerKeyNeeded = this.#jsonLayer.providerKeyNeeded;
		}
		else {
			throw new Error ( 'invalid providerKeyNeeded for layer ' + this.#name );
		}
	}

	/**
	Set the map attributions.
	*/

	#setAttributions ( ) {
		if ( '' === this.#jsonLayer.attribution ) {
			this.#attribution = '';
		}
		else if ( 'string' === typeof ( this.#jsonLayer?.attribution ) ) {
			this.#attribution = theHTMLSanitizer.sanitizeToHtmlString ( this.#jsonLayer.attribution ).htmlString;
		}
		else {
			throw new Error ( 'invalid attribution for map layer ' + this.#name );
		}
	}

	/**
	The constructor
	@param {JsonObject} jsonLayer A json object from TravelNotesLayers.json
	*/

	constructor ( jsonLayer ) {
		Object.freeze ( this );
		this.#jsonLayer = jsonLayer;
		this.#setLayerName ( );
		this.#setService ( );
		this.#setUrl ( );
		this.#setWmsOptions ( );
		this.#setBounds ( );
		this.#setMinMaxZoom ( );
		this.#setToolbarButtonData ( );
		this.#setProviderName ( );
		this.#setProviderKeyNeeded ( );
		this.#setAttributions ( );
		this.#jsonLayer = null;
	}

	/**
	The name of the map
	@type {String}
	*/

	get name ( ) { return this.#name; }

	/**
	The type of service: wms or wmts
	@type {String}
	*/

	get service ( ) { return this.#service; }

	/**
	The url to use to get the map
	@type {String}
	*/

	get url ( ) { return this.#url; }

	/**
	The wmsOptions for this mapLayer
	See the Leaflet TileLayer.WMS documentation
	@type {LeafletObject}
	*/

	get wmsOptions ( ) { return this.#wmsOptions; }

	/**
	The lower left and upper right corner of the mapLayer
	@type {Array.<Number>}
	*/

	get bounds ( ) { return this.#bounds; }

	/**
	The smallest possible zoom for this mapLayer
	@type {Number}
	*/

	get minZoom ( ) { return this.#minZoom; }

	/**
	The largest possible zoom for this mapLayer
	@type {Number}
	*/

	get maxZoom ( ) { return this.#maxZoom; }

	/**
	An object with text, color and backgroundColor properties used to create the button in the toolbar
	@type {LayerToolbarButtonData}
	*/

	get toolbarButtonData ( ) { return this.#toolbarButtonData; }

	/**
	The name of the service provider. This name will be used to find the access key to the service.
	@type {String}
	*/

	get providerName ( ) { return this.#providerName; }

	/**
	When true, an access key is required to get the map.
	@type {Boolean}
	*/

	get providerKeyNeeded ( ) { return this.#providerKeyNeeded; }

	/**
	The map attributions. For maps based on OpenStreetMap, it is not necessary to add
	the attributions of OpenStreetMap because they are always present in Travel & Notes.
	@type {String}
	*/

	get attribution ( ) { return this.#attribution; }

}

export default MapLayer;

/* --- End of file --------------------------------------------------------------------------------------------------------- */