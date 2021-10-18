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
	- v2.0.0:
		- created
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file MapLayer.js
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

/**
@------------------------------------------------------------------------------------------------------------------------------
@typedef {Object} LayerToolbarButtonData
@desc A layers toolbar button properties
@property {string} text The text to display in the toolbar button
@property {string} color The foreground color of the toolbar button
@property {string} backgroundColor The background color of the toolbar button
@public

@------------------------------------------------------------------------------------------------------------------------------
*/

import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';
import { ZERO, ONE } from '../main/Constants.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class MapLayer
@classdesc This class represent a background map
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class MapLayer	{

	/**
	The name of the map
	@type {string}
	@private
	*/

	#name = null;

	/**
	The type of service: wms or wmts
	@type {string}
	@private
	*/

	#service = null;

	/**
	The url to use to get the map
	@type {string}
	@private
	*/

	#url = null;

	/**
	The wmsOptions for this mapLayer
	See the Leaflet TileLayer.WMS documentation
	@type {object}
	@private
	*/

	#wmsOptions = null;

	/**
	The lower left and upper right corner of the mapLayer
	@type {Array.<number>}
	@private
	*/

	#bounds = null;

	/**
	The smallest possible zoom for this mapLayer
	@type {number}
	@private
	*/

	#minZoom = null;

	/**
	The largest possible zoom for this mapLayer
	@type {number}
	@private
	*/

	#maxZoom = null;

	/**
	An object with text, color and backgroundColor properties used to create the button in the toolbar
	@type {LayerToolbarButtonData}
	@private
	*/

	#toolbar = null;

	/**
	The name of the service provider.
	@type {string}
	@private
	*/

	#providerName = null;

	/**
	When true, an access key is required to get the map.
	@type {boolean}
	@private
	*/

	#providerKeyNeeded = false;

	/**
	The map attributions.
	@type {string}
	@private
	*/

	#attribution = null;

	/**
	A temporary variable to store the layer data
	@private
	*/

	#jsonLayer = null;

	/**
	Set the name of the map layer
	@private
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
	@private
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
	@private
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
	@private
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
	@private
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
	@private
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
	@private
	*/

	#setToolbarData ( ) {
		if (
			'string' === typeof ( this.#jsonLayer?.toolbar?.text )
			&&
			'string' === typeof ( this.#jsonLayer?.toolbar?.color )
			&&
			'string' === typeof ( this.#jsonLayer?.toolbar?.backgroundColor )
		) {
			this.#toolbar = this.#jsonLayer.toolbar;
			this.#toolbar.text = theHTMLSanitizer.sanitizeToJsString ( this.#toolbar.text );
			this.#toolbar.color =
				theHTMLSanitizer.sanitizeToColor ( this.#toolbar.color ) || '\u0023000000';
			this.#toolbar.backgroundColor =
				theHTMLSanitizer.sanitizeToColor ( this.#toolbar.backgroundColor ) || '\u0023ffffff';
		}
		else {
			throw new Error ( 'invalid toolbar for layer ' + this.#name );
		}
	}

	/**
	Set the name of the service provider
	@private
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
	@private
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
	@private
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

	/*
	constructor
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
		this.#setToolbarData ( );
		this.#setProviderName ( );
		this.#setProviderKeyNeeded ( );
		this.#setAttributions ( );
		this.#jsonLayer = null;
	}

	/**
	The name of the map
	@type {string}
	*/

	get name ( ) { return this.#name; }

	/**
	The type of service: wms or wmts
	@type {string}
	*/

	get service ( ) { return this.#service; }

	/**
	The url to use to get the map
	@type {string}
	*/

	get url ( ) { return this.#url; }

	/**
	The wmsOptions for this mapLayer
	See the Leaflet TileLayer.WMS documentation
	@type {object}
	*/

	get wmsOptions ( ) { return this.#wmsOptions; }

	/**
	The lower left and upper right corner of the mapLayer
	@type {Array.<number>}
	*/

	get bounds ( ) { return this.#bounds; }

	/**
	The smallest possible zoom for this mapLayer
	@type {number}
	*/

	get minZoom ( ) { return this.#minZoom; }

	/**
	The largest possible zoom for this mapLayer
	@type {number}
	*/

	get maxZoom ( ) { return this.#maxZoom; }

	/**
	An object with text, color and backgroundColor properties used to create the button in the toolbar
	@type {LayerToolbarButtonData}
	*/

	get toolbar ( ) { return this.#toolbar; }

	/**
	The name of the service provider. This name will be used to find the access key to the service.
	@type {string}
	*/

	get providerName ( ) { return this.#providerName; }

	/**
	When true, an access key is required to get the map.
	@type {boolean}
	*/

	get providerKeyNeeded ( ) { return this.#providerKeyNeeded; }

	/**
	The map attributions. For maps based on OpenStreetMap, it is not necessary to add
	the attributions of OpenStreetMap because they are always present in Travel & Notes.
	@type {string}
	*/

	get attribution ( ) { return this.#attribution; }

}

export default MapLayer;

/**
--- End of MapLayer.js file ---------------------------------------------------------------------------------------------------
*/