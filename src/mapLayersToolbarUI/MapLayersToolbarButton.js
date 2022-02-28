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
Doc reviewed 20210913
Tests ...
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theEventDispatcher from '../coreLib/EventDispatcher.js';
import theAttributionsUI from '../attributionsUI/AttributionsUI.js';
import theMapLayersCollection from '../data/MapLayersCollection.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouse enter event listener for the button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class LayerButtonMouseEnterEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} mouseEnterEvent The event to handle
	*/

	handleEvent ( mouseEnterEvent ) {
		const mapLayer = theMapLayersCollection.getMapLayer ( mouseEnterEvent.target.dataset.tanMapLayerName );
		mouseEnterEvent.target.style.color = mapLayer.toolbarButtonData.backgroundColor;
		mouseEnterEvent.target.style[ 'background-color' ] = mapLayer.toolbarButtonData.color;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouse leave event listener for the button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class LayerButtonMouseLeaveEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} mouseLeaveEvent The event to handle
	*/

	handleEvent ( mouseLeaveEvent ) {
		mouseLeaveEvent.stopPropagation ( );
		const mapLayer = theMapLayersCollection.getMapLayer ( mouseLeaveEvent.target.dataset.tanMapLayerName );
		mouseLeaveEvent.target.style.color = mapLayer.toolbarButtonData.color;
		mouseLeaveEvent.target.style[ 'background-color' ] = mapLayer.toolbarButtonData.backgroundColor;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class LayerButtonClickEL {

	/**
	the constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		const mapLayer = theMapLayersCollection.getMapLayer ( clickEvent.target.dataset.tanMapLayerName );
		theEventDispatcher.dispatch ( 'layerchange', { layer : mapLayer } );
		theAttributionsUI.attributions = mapLayer.attribution;
		theTravelNotesData.travel.layerName = mapLayer.name;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Map layer button for the toolbar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MapLayersToolbarButton {

	/**
	The button HTMLElement
	@type {HTMLElement}
	*/

	#buttonHTMLElement;

	/**
	mouseenter event listener
	@type {LayerButtonMouseEnterEL}
	*/

	#layerButtonMouseEnterEL;

	/**
	mouseleave event listener
	@type {LayerButtonMouseLeaveEL}
	*/

	#layerButtonMouseLeaveEL;

	/**
	mouseclick event listener
	@type {LayerButtonClickEL}
	*/

	#layerButtonClickEL;

	/**
	The constructor
	@param {MapLayer} mapLayer the MapLayer object associated to the button
	@param {HTMLElement} parentNode the parent of the button
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
				textContent : mapLayer.toolbarButtonData.text,
				style : 'color:' +
					mapLayer.toolbarButtonData.color +
					';background-color:' + mapLayer.toolbarButtonData.backgroundColor
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
	@type {Number}
	*/

	get height ( ) { return this.#buttonHTMLElement.clientHeight; }

}

export default MapLayersToolbarButton;

/* --- End of file --------------------------------------------------------------------------------------------------------- */