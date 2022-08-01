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
	- v1.6.0:
		- created
	- v1.9.0:
		- Issue ♯101 : Add a print command for a route
		- Issue ♯103 : Review the attributions
	- v2.0.0:
		- Issue ♯134 : Remove node.setAttribute ( 'style', blablabla) in the code
		- Issue ♯135 : Remove innerHTML from code
		- Issue ♯142 : Transform the layer object to a class as specified in the layersToolbarUI.js
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
	- v4.0.0:
		- Issue ♯45 : Add touch events on the map toolbar to expand or reduce the toolbar
		- Issue ♯46 : Add touch events on the map toolbar to scroll the toolbar
Doc reviewed 20210913
Tests ...
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

import { MOUSE_WHEEL_FACTORS, ZERO, ONE } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container for data exchange between the ButtonsContainerWheelEL and the MapLayersToolbarUI
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class WheelEventData {

	/**
	The min buttons that have to be always visible
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MIN_BUTTONS_VISIBLE ( ) { return 3; }

	/**
	The current margin-top in pixels css value for the buttons container
	@type {Number}
	*/

	#marginTop = ZERO;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
	}

	/**
	The height of 1 button in pixel;
	@type {Number}
	*/

	buttonHeight = ZERO;

	/**
	The total height of all butons in pixels
	@type {Number}
	*/

	buttonsHeight = ZERO;

	/**
	The top css value of the first button
	@type {Number}
	*/

	buttonTop = ZERO;

	/**
	The top margin to be used for the toolbar
	@type {Number}
	*/

	get marginTop ( ) { return this.#marginTop; }

	set marginTop ( marginTop ) {
		this.#marginTop = marginTop;
		this.#marginTop =
			this.#marginTop > this.buttonTop
				?
				this.buttonTop
				:
				this.#marginTop;
		this.#marginTop =
			this.#marginTop < this.buttonTop - this.buttonsHeight +
			( WheelEventData.#MIN_BUTTONS_VISIBLE * this.buttonHeight )
				?
				(
					this.buttonTop -
					this.buttonsHeight +
					( WheelEventData.#MIN_BUTTONS_VISIBLE * this.buttonHeight )
				)
				:
				this.#marginTop;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Touch event listener on the map layer buttons container. Scroll the buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ButtonsContainerTouchEL {

	/**
	A reference to the WheelEventData Object
	@type {WheelEventData}
	*/

	#wheelEventData;

	/**
	The Y position of the previous touch event
	@type {Number}
	*/

	#touchContainerStartY = Number.MAX_VALUE;

	/**
	The constructor
	@param {WheelEventData} wheelEventData A reference to the WheelEventData Object
	*/

	constructor ( wheelEventData ) {
		Object.freeze ( this );
		this.#wheelEventData = wheelEventData;
	}

	/**
	Event listener method
	@param {Event} touchEvent The event to handle
	*/

	handleEvent ( touchEvent ) {
		switch ( touchEvent.type ) {
		case 'touchstart' :
			if ( ONE === touchEvent.changedTouches.length ) {
				const touch = touchEvent.changedTouches.item ( ZERO );
				this.#touchContainerStartY = touch.screenY;
			}
			break;
		case 'touchmove' :
		case 'touchend' :
			if ( ONE === touchEvent.changedTouches.length ) {
				const touch = touchEvent.changedTouches.item ( ZERO );
				const deltaY = this.#touchContainerStartY - touch.screenY;
				if ( ZERO !== deltaY ) {
					this.#wheelEventData.marginTop -= deltaY;
					this.#touchContainerStartY = touch.screenY;
					touchEvent.currentTarget.style.marginTop = String ( this.#wheelEventData.marginTop ) + 'px';
				}
			}
			break;
		default :
			break;
		}
		if ( 'touchend' === touchEvent.type ) {
			this.#touchContainerStartY = Number.MAX_VALUE;
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Wheel event listener on the map layer buttons container. Scroll the buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ButtonsContainerWheelEL {

	/**
	A reference to the WheelEventData Object
	@type {WheelEventData}
	*/

	#wheelEventData;

	/**
	The constructor
	@param {WheelEventData} wheelEventData A reference to the WheelEventData Object
	*/

	constructor ( wheelEventData ) {
		Object.freeze ( this );
		this.#wheelEventData = wheelEventData;
	}

	/**
	Event listener method
	@param {Event} wheelEvent The event to handle
	*/

	handleEvent ( wheelEvent ) {
		wheelEvent.stopPropagation ( );
		if ( wheelEvent.deltaY ) {
			this.#wheelEventData.marginTop -= wheelEvent.deltaY * MOUSE_WHEEL_FACTORS [ wheelEvent.deltaMode ];
			wheelEvent.currentTarget.style.marginTop = String ( this.#wheelEventData.marginTop ) + 'px';
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the Layer Toolbar on the left of the screen.
Displays buttons to change the background maps and manages the background maps list

See theMapLayersToolbarUI for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MapLayersToolbarUI {

	/**
	The main HTMLElement of the UI
	@type {HTMLElement}
	*/

	#mainHTMLElement;

	/**
	The HTML element that contains the map layer buttons
	@type {HTMLElement}
	*/

	#buttonsHTMLElement;

	/**
	An array with the map layer buttons and links
	@type {Array.<Object>}
	*/

	#buttonsAndLinks;

	/**
	Data shared with the wheel event listener
	@type {WheelEventData}
	*/

	#wheelEventData;

	/**
	Timer id for the mouse leave event
	@type {Number}
	*/

	#timerId;

	/**
	The wheel event listener for the buttons container
	@type {ButtonsContainerWheelEL}
	*/

	#onWheelButtonsEventListener;

	/**
	The touch event listener for the buttons container
	@type {ButtonsContainerTouchEL}
	*/

	#onButtonsContainerTouchEL;

	/**
	The Y position on the screen of the header touchstart event
	@type {Number}
	*/

	#touchHeaderStartY = Number.MAX_VALUE;

	/**
	The pan value needed to hide or show the UI
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #HIDE_Y_PAN ( ) { return 10; }

	/**
	A boolean saving the the current state of the UI
	@type {boolean}
	 */

	#isShow = false;

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

		if ( this.#isShow ) {
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
		this.#buttonsHTMLElement.addEventListener ( 'wheel', this.#onWheelButtonsEventListener, { passive : true } );

		// adding touch event listeners
		this.#buttonsHTMLElement.addEventListener ( 'touchstart', this.#onButtonsContainerTouchEL, false );
		this.#buttonsHTMLElement.addEventListener ( 'touchmove', this.#onButtonsContainerTouchEL, false );
		this.#buttonsHTMLElement.addEventListener ( 'touchend', this.#onButtonsContainerTouchEL, false );
		this.#isShow = true;
	}

	/**
	Hide the toolbar
	*/

	#hide ( ) {

		if ( ! this.#isShow ) {
			return;
		}

		// Removing map layer buttons and links
		this.#buttonsAndLinks.forEach ( buttonOrLink => buttonOrLink.destructor ( ) );
		this.#buttonsAndLinks.length = ZERO;

		// Removing wheel event listener
		this.#buttonsHTMLElement.removeEventListener ( 'wheel', this.#onWheelButtonsEventListener, { passive : true } );

		// Removing touch event listeners
		this.#buttonsHTMLElement.removeEventListener ( 'touchstart', this.#onButtonsContainerTouchEL, false );
		this.#buttonsHTMLElement.removeEventListener ( 'touchmove', this.#onButtonsContainerTouchEL, false );
		this.#buttonsHTMLElement.removeEventListener ( 'touchend', this.#onButtonsContainerTouchEL, false );

		// removing buttons container
		this.#mainHTMLElement.removeChild ( this.#buttonsHTMLElement );
		this.#timerId = null;

		this.#isShow = false;
	}

	/**
	The mouseleave event listener. Start a timer
	*/

	#onMouseLeave ( ) {
		this.#timerId = setTimeout ( ( ) => this.#hide ( ), theConfig.layersToolbarUI.toolbarTimeOut );
	}

	/**
	The header touch event listener. Show or hide the toolbar
	@param {Event} touchEvent The event to handle
	*/

	#onHeaderTouch ( touchEvent ) {
		switch ( touchEvent.type ) {
		case 'touchstart' :
			if ( ONE === touchEvent.changedTouches.length ) {
				const touch = touchEvent.changedTouches.item ( ZERO );
				this.#touchHeaderStartY = touch.screenY;
			}
			break;
		case 'touchend' :
			if ( ONE === touchEvent.changedTouches.length ) {
				const touch = touchEvent.changedTouches.item ( ZERO );
				const deltaPanY = touch.screenY - this.#touchHeaderStartY;
				if (
					ZERO < deltaPanY
					&&
					MapLayersToolbarUI.#HIDE_Y_PAN < deltaPanY
				) {
					this.#show ( );
				}
				else if (
					ZERO > deltaPanY
					&&
					MapLayersToolbarUI.#HIDE_Y_PAN < -deltaPanY
				) {
					this.#hide ( );
				}
				else if ( ZERO === deltaPanY ) {
					if ( this.#isShow ) {
						this.#hide ( );
					}
					else {
						this.#show ( );
					}
				}
			}
			this.#touchHeaderStartY = Number.MAX_VALUE;
			break;
		default :
			break;
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#wheelEventData = new WheelEventData ( );
		this.#onWheelButtonsEventListener = new ButtonsContainerWheelEL ( this.#wheelEventData );
		this.#onButtonsContainerTouchEL = new ButtonsContainerTouchEL ( this.#wheelEventData );
		this.#buttonsAndLinks = [];
	}

	/**
	creates the user interface
	*/

	createUI ( ) {
		this.#mainHTMLElement =
			theHTMLElementsFactory.create ( 'div', { id : 'TravelNotes-MapLayersToolbarUI' }, document.body );
		this.#mainHTMLElement.addEventListener ( 'mouseenter', ( ) => this.#show ( ), false );
		this.#mainHTMLElement.addEventListener ( 'mouseleave', ( ) => this.#onMouseLeave ( ), false );

		const headerHtmlElement = theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-MapLayersToolbarUI-Header',
				textContent : theTranslator.getText ( 'MapLayersToolbarUI - Layers' )
			},
			this.#mainHTMLElement
		);
		headerHtmlElement.addEventListener ( 'touchstart', touchEvent => this.#onHeaderTouch ( touchEvent ), false );
		headerHtmlElement.addEventListener ( 'touchend', touchEvent => this.#onHeaderTouch ( touchEvent ), false );

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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of MapLayersToolbarUI class
@type {MapLayersToolbarUI}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theMapLayersToolbarUI = new MapLayersToolbarUI ( );

export default theMapLayersToolbarUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */