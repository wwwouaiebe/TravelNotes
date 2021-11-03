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
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file MapLayersToolbarButton.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module mapLayersToolbarUI

@------------------------------------------------------------------------------------------------------------------------------
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theEventDispatcher from '../coreLib/EventDispatcher.js';
import theAttributionsUI from '../attributionsUI/AttributionsUI.js';
import theMapLayersCollection from '../data/MapLayersCollection.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class LayerButtonMouseEnterEL
@classdesc mouse enter event listener for the button
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class LayerButtonMouseEnterEL {

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	*/

	handleEvent ( mouseEnterEvent ) {
		const mapLayer = theMapLayersCollection.getMapLayer ( mouseEnterEvent.target.dataset.tanMapLayerName );
		mouseEnterEvent.target.style.color = mapLayer.toolbar.backgroundColor;
		mouseEnterEvent.target.style[ 'background-color' ] = mapLayer.toolbar.color;
	}
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class LayerButtonMouseLeaveEL
@classdesc mouse leave event listener for the button
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class LayerButtonMouseLeaveEL {

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	*/

	handleEvent ( mouseLeaveEvent ) {
		mouseLeaveEvent.stopPropagation ( );
		const mapLayer = theMapLayersCollection.getMapLayer ( mouseLeaveEvent.target.dataset.tanMapLayerName );
		mouseLeaveEvent.target.style.color = mapLayer.toolbar.color;
		mouseLeaveEvent.target.style[ 'background-color' ] = mapLayer.toolbar.backgroundColor;
	}
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class LayerButtonClickEL
@classdesc click event listener for the button
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class LayerButtonClickEL {

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		const mapLayer = theMapLayersCollection.getMapLayer ( clickEvent.target.dataset.tanMapLayerName );
		theEventDispatcher.dispatch ( 'layerchange', { layer : mapLayer } );
		theAttributionsUI.attributions = mapLayer.attribution;
		theTravelNotesData.travel.layerName = mapLayer.name;
	}
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class MapLayersToolbarButton
@classdesc Map layer button for the toolbar
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class MapLayersToolbarButton {

	/**
	The button HTMLElement
	@type {HTMLElement}
	*/

	#buttonHTMLElement = null;

	/**
	mouseenter event listener
	@type {LayerButtonMouseEnterEL}
	*/

	#layerButtonMouseEnterEL = null;

	/**
	mouseleave event listener
	@type {LayerButtonMouseLeaveEL}
	*/

	#layerButtonMouseLeaveEL = null;

	/**
	mouseclick event listener
	@type {LayerButtonClickEL}
	*/

	#layerButtonClickEL = null;

	/*
	constructor
	@param {MapLayer} mapLayer the MapLayer object associated to the button
	@parentNode {HTMLElement} the parent of the button
	*/

	constructor ( mapLayer, parentNode ) {

		Object.freeze ( this );

		// HTML creation
		this.#buttonHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-MapLayersToolbarUI-Button',
				title : mapLayer.name,
				dataset : { MapLayerName : mapLayer.name },
				textContent : mapLayer.toolbar.text,
				style : 'color:' + mapLayer.toolbar.color + ';background-color:' + mapLayer.toolbar.backgroundColor
			},
			parentNode
		);

		// event listeners
		this.#layerButtonMouseEnterEL = new LayerButtonMouseEnterEL ( );
		this.#layerButtonMouseLeaveEL = new LayerButtonMouseLeaveEL ( );
		this.#layerButtonClickEL = new LayerButtonClickEL ( );

		this.#buttonHTMLElement.addEventListener ( 'mouseenter', this.#layerButtonMouseEnterEL, false );
		this.#buttonHTMLElement.addEventListener ( 'mouseleave', this.#layerButtonMouseLeaveEL, false );
		this.#buttonHTMLElement.addEventListener ( 'click', this.#layerButtonClickEL, false );
	}

	/**
	destructor. Remove event listeners.
	*/

	destructor ( ) {
		this.#buttonHTMLElement.removeEventListener ( 'mouseenter', this.#layerButtonMouseEnterEL, false );
		this.#buttonHTMLElement.removeEventListener ( 'mouseleave', this.#layerButtonMouseLeaveEL, false );
		this.#buttonHTMLElement.removeEventListener ( 'click', this.#layerButtonClickEL, false );
	}

	/**
	The height of the button
	*/

	get height ( ) { return this.#buttonHTMLElement.clientHeight; }

}

export default MapLayersToolbarButton;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of MapLayersToolbarButton.js file

@------------------------------------------------------------------------------------------------------------------------------
*/