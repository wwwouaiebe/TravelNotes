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
	- v1.6.0:
		- created
	- v1.9.0:
		- Issue ♯101 : Add a print command for a route
		- Issue ♯103 : Review the attributions
	- v2.0.0:
		- Issue ♯134 : Remove node.setAttribute ( 'style', blablabla) in the code
		- Issue ♯135 : Remove innerHTML from code
		- Issue ♯142 : Transform the typedef layer to a class as specified in the layersToolbarUI.js
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file MapLayersToolbarUI.js
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
import theTranslator from '../UILib/Translator.js';
import theConfig from '../data/Config.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theEventDispatcher from '../coreLib/EventDispatcher.js';
import theAttributionsUI from '../attributionsUI/AttributionsUI.js';
import theMapLayersCollection from '../data/MapLayersCollection.js';
import MapLayersToolbarButton from '../mapLayersToolbarUI/MapLayersToolbarButton.js';
import MapLayersToolbarLink from '../mapLayersToolbarUI/MapLayersToolbarLink.js';
import theAPIKeysManager from '../core/APIKeysManager.js';

import { MOUSE_WHEEL_FACTORS, ZERO } from '../main/Constants.js';

const OUR_MIN_BUTTONS_VISIBLE = 3;

/**
@------------------------------------------------------------------------------------------------------------------------------

@class ButtonsContainerWheelEL
@classdesc Wheel event listeners on the map layer buttons. Scroll the buttons
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class ButtonsContainerWheelEL {

	/**
	A reference to the WheelEventData Object
	@type {Object}
	*/

	#wheelEventData = null;

	/*
	constructor
	@param {Object} wheelEventData A reference to the WheelEventData Object
	*/

	constructor ( wheelEventData ) {
		Object.freeze ( this );
		this.#wheelEventData = wheelEventData;
	}

	/**
	Event listener method
	*/

	handleEvent ( wheelEvent ) {
		wheelEvent.stopPropagation ( );
		if ( wheelEvent.deltaY ) {
			this.#wheelEventData.marginTop -= wheelEvent.deltaY * MOUSE_WHEEL_FACTORS [ wheelEvent.deltaMode ];
			this.#wheelEventData.marginTop =
				this.#wheelEventData.marginTop > this.#wheelEventData.buttonTop
					?
					this.#wheelEventData.buttonTop
					:
					this.#wheelEventData.marginTop;
			this.#wheelEventData.marginTop =
				this.#wheelEventData.marginTop < this.#wheelEventData.buttonTop - this.#wheelEventData.buttonsHeight +
				( OUR_MIN_BUTTONS_VISIBLE * this.#wheelEventData.buttonHeight )
					?
					(
						this.#wheelEventData.buttonTop -
						this.#wheelEventData.buttonsHeight +
						( OUR_MIN_BUTTONS_VISIBLE * this.#wheelEventData.buttonHeight )
					)
					:
					this.#wheelEventData.marginTop;
			wheelEvent.currentTarget.style.marginTop = String ( this.#wheelEventData.marginTop ) + 'px';
		}
	}
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class MapLayersToolbarUI
@classdesc This class is the Layer Toolbar on the left of the screen.
Displays buttons to change the background maps and manages the background maps list
@see {@link theMapLayersToolbarUI} for the one and only one instance of this class
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class MapLayersToolbarUI {

	/**
	The main HTMLElement of the UI
	@type {HTMLElement}
	*/

	#mainHTMLElement = null;

	/**
	The HTML element that contains the map layer buttons
	@type {HTMLElement}
	*/

	#buttonsHTMLElement = null;

	/**
	An array with the map layer buttons and links
	@type {Array.<Object>}
	*/

	#buttonsAndLinks = [];

	/**
	Data shared with the wheel event listener
	@type {Object}
	*/

	#wheelEventData = {
		marginTop : ZERO,
		buttonHeight : ZERO,
		buttonsHeight : ZERO,
		buttonTop : ZERO
	}

	/**
	Timer id for the mouse leave event
	@type {Number}
	*/

	#timerId = null;

	/**
	The wheel event listener
	@type {Object}
	*/

	#onWheelButtonsEventListener = null;

	/**
	Show the map layer buttons. Called by the mouseenter event
	*/

	#show ( ) {

		// cleaning the timer if needed. The buttons are always visible and we can stop.
		if ( this.#timerId ) {
			clearTimeout ( this.#timerId );
			this.#timerId = null;
			return;
		}

		// container for the button
		this.#buttonsHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-MapLayersToolbarUI-Buttons'
			},
			this.#mainHTMLElement
		);

		// wheel event data computation
		this.#wheelEventData.buttonTop = this.#mainHTMLElement.clientHeight;
		this.#wheelEventData.buttonsHeight = ZERO;

		// adding map layer buttons
		theMapLayersCollection.forEach (
			mapLayer => {
				if (
					( mapLayer.providerKeyNeeded && theAPIKeysManager.hasKey ( mapLayer.providerName.toLowerCase ( ) ) )
					|| ! mapLayer.providerKeyNeeded
				) {
					const mapLayerButton =
						new MapLayersToolbarButton ( mapLayer, this.#buttonsHTMLElement );
					this.#wheelEventData.buttonHeight = mapLayerButton.height;
					this.#wheelEventData.buttonsHeight += mapLayerButton.height;
					this.#buttonsAndLinks.push ( mapLayerButton );
				}
			}
		);

		// Adding link buttons
		if ( theConfig.layersToolbarUI?.theDevil?.addButton ) {
			const theDevilButton = new MapLayersToolbarLink (
				{
					href : 'https://www.google.com/maps/@' +
						theTravelNotesData.map.getCenter ( ).lat +
						',' +
						theTravelNotesData.map.getCenter ( ).lng +
						',' +
						theTravelNotesData.map.getZoom ( ) +
						'z',
					title : 'Reminder! The devil will know everything about you',
					textContent : '👿',
					target : '_blank'
				},
				this.#buttonsHTMLElement
			);
			this.#wheelEventData.buttonsHeight += theDevilButton.height;
			this.#buttonsAndLinks.push ( theDevilButton );
		}

		// wheel event data computation
		this.#wheelEventData.buttonTop += this.#wheelEventData.buttonHeight;
		this.#wheelEventData.marginTop = this.#wheelEventData.buttonTop;
		this.#buttonsHTMLElement.style.marginTop = String ( this.#wheelEventData.marginTop ) + 'px';

		// adding wheel event
		this.#buttonsHTMLElement.addEventListener ( 'wheel', this.#onWheelButtonsEventListener, false );
	}

	/**
	Hide the toolbar
	*/

	#hide ( ) {

		// Removing map layer buttons and links
		this.#buttonsAndLinks.forEach ( buttonOrLink => buttonOrLink.destructor ( ) );
		this.#buttonsAndLinks.length = ZERO;

		// Removing wheel event listener
		this.#buttonsHTMLElement.removeEventListener ( 'wheel', this.#onWheelButtonsEventListener, false );

		// removing buttons container
		this.#mainHTMLElement.removeChild ( this.#buttonsHTMLElement );
		this.#timerId = null;
	}

	/**
	The mouseleave event listener. Start a timer
	*/

	#onMouseLeave ( ) {
		this.#timerId = setTimeout ( ( ) => this.#hide ( ), theConfig.layersToolbarUI.toolbarTimeOut );
	}

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#onWheelButtonsEventListener = new ButtonsContainerWheelEL ( this.#wheelEventData );
	}

	/**
	creates the user interface
	*/

	createUI ( ) {
		this.#mainHTMLElement =
			theHTMLElementsFactory.create ( 'div', { id : 'TravelNotes-MapLayersToolbarUI' }, document.body );
		theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-MapLayersToolbarUI-Header',
				textContent : theTranslator.getText ( 'MapLayersToolbarUI - Layers' )
			},
			this.#mainHTMLElement
		);
		this.#mainHTMLElement.addEventListener ( 'mouseenter', ( ) => this.#show ( ), false );
		this.#mainHTMLElement.addEventListener ( 'mouseleave', ( ) => this.#onMouseLeave ( ), false );
		theEventDispatcher.dispatch ( 'layerchange', { layer : theMapLayersCollection.defaultMapLayer } );
		theAttributionsUI.attributions = theMapLayersCollection.defaultMapLayer.attribution;
	}

	/**
	Set a mapLayer as background map. If a provider key is needed and the key not available
	the 'OSM - Color' mapLayer is set. If the mapLayer is not found, the 'OSM - Color' mapLayer
	is set
	@param {String} mapLayerName the name of the mapLayer to set
	*/

	setMapLayer ( mapLayerName ) {
		const mapLayer = theMapLayersCollection.getMapLayer ( mapLayerName );
		theEventDispatcher.dispatch ( 'layerchange', { layer : mapLayer } );
		theAttributionsUI.attributions = mapLayer.attribution;
		theTravelNotesData.travel.layerName = mapLayer.name;
	}
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@desc The one and only one instance of MapLayersToolbarUI class
@type {MapLayersToolbarUI}
@constant
@global

@------------------------------------------------------------------------------------------------------------------------------
*/

const theMapLayersToolbarUI = new MapLayersToolbarUI ( );

export default theMapLayersToolbarUI;

/*
--- End of MapLayersToolbarUI.js file -----------------------------------------------------------------------------------------
*/