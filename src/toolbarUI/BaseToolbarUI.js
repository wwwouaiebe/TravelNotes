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
		- created
Doc reviewed ...
Tests ...
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import { WheelEventData, ButtonsContainerTouchEL, ButtonsContainerWheelEL } from '../toolbarUI/BaseToolbarUIEL.js';
import theConfig from '../data/Config.js';
import { ZERO, ONE } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the toolbar buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ToolbarButtonClickEL {

	/**
	A reference to the ToolbarItem array of the BaseToolbarUI class
	@type {Array.<ToolbarItem>}
	*/

	#toolbarItems;

	/**
	The constructor
	@param {Array.<ToolbarItem>} toolbarItems A reference to the ToolbarItem array of the BaseToolbarUI class
	*/

	constructor ( toolbarItems ) {
		this.#toolbarItems = toolbarItems;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		this.#toolbarItems [ Number.parseInt ( clickEvent.target.dataset.tanItemId ) ].action ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A base class for realisation of toolbars
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BaseToolbarUI {

	/**
	The main HTMLElement of the UI
	@type {HTMLElement}
	*/

	#mainHTMLElement = null;

	/**
	The HTML element that contains the buttons
	@type {HTMLElement}
	*/

	#buttonsHTMLElement;

	/**
	Data shared with the wheel event listener of the buttons container
	@type {WheelEventData}
	*/

	#wheelEventData;

	/**
	The wheel event listener for the buttons container
	@type {ButtonsContainerWheelEL}
	*/

	#onWheelButtonsEventListener;

	/**
	Timer id for the mouse leave event
	@type {Number}
	*/

	#timerId;

	/**
	The touch event listener for the buttons container
	@type {ButtonsContainerTouchEL}
	*/

	#onButtonsContainerTouchEL;

	/**
	The click event listener for the buttons
	@type {ToolbarButtonClickEL}
	*/

	#onToolbarButtonClickEL;

	/**
	A boolean saving the the current state of the UI
	@type {boolean}
	 */

	#isShow = false;

	/**
	An array with the ToolbarItems
	@type {Array.<ToolbarItem>}
	*/

	#toolbarItems = [];

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
	Show the toolbar
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
				className : 'TravelNotes-ToolbarUI-Buttons'
			},
			this.#mainHTMLElement
		);

		this.#toolbarItems = [ ];
		this.addToolbarItems ( );

		// wheel event data computation
		this.#wheelEventData.buttonsHeight = ZERO;

		// adding buttons
		this.#toolbarItems.forEach (
			( toolbarItem, index ) => {
				if ( toolbarItem.isCommand ( ) ) {
					const buttonHTMLElement = theHTMLElementsFactory.create (
						'div',
						{
							className : 'TravelNotes-ToolbarUI-Button',
							textContent : toolbarItem.textContent,
							title : toolbarItem.title,
							dataset : { ItemId : index }
						},
						this.#buttonsHTMLElement
					);
					this.#wheelEventData.buttonHeight = buttonHTMLElement.offsetHeight;
					this.#wheelEventData.buttonsHeight += buttonHTMLElement.offsetHeight;
					buttonHTMLElement.addEventListener ( 'click', this.#onToolbarButtonClickEL, false );
				}
				else {
					const buttonHTMLElement = theHTMLElementsFactory.create (
						'div',
						{
							className : 'TravelNotes-ToolbarUI-Button',
							title : toolbarItem.title
						},
						this.#buttonsHTMLElement
					);
					theHTMLElementsFactory.create (
						'text',
						{
							value : toolbarItem.textContent
						},
						theHTMLElementsFactory.create (
							'a',
							{
								className : 'TravelNotes-ToolbarUI-Link',
								href : toolbarItem.action,
								target : '_blank'
							},
							buttonHTMLElement
						)
					);
					this.#wheelEventData.buttonHeight = buttonHTMLElement.offsetHeight;
					this.#wheelEventData.buttonsHeight += buttonHTMLElement.offsetHeight;
				}
			}
		);

		// wheel event data computation
		this.#wheelEventData.marginTop = this.#wheelEventData.buttonTop;
		this.#buttonsHTMLElement.style [ 'margin-top' ] = String ( this.#wheelEventData.marginTop ) + 'px';

		// adding wheel event
		this.#buttonsHTMLElement.addEventListener ( 'wheel', this.#onWheelButtonsEventListener, { passive : true } );

		// adding touch event listeners
		this.#buttonsHTMLElement.addEventListener ( 'touchstart', this.#onButtonsContainerTouchEL, false );
		this.#buttonsHTMLElement.addEventListener ( 'touchmove', this.#onButtonsContainerTouchEL, false );
		this.#buttonsHTMLElement.addEventListener ( 'touchend', this.#onButtonsContainerTouchEL, false );
		this.#isShow = true;
	}

	/**
	Mouse leave event listener
	*/

	#onMouseLeave ( ) {
		this.#timerId = setTimeout ( ( ) => this.#hide ( ), theConfig.layersToolbarUI.toolbarTimeOut );
	}

	/**
	Hide the toolbar
	*/

	#hide ( ) {

		if ( ! this.#isShow ) {
			return;
		}

		// removing wheel event
		this.#buttonsHTMLElement.removeEventListener ( 'wheel', this.#onWheelButtonsEventListener, { passive : true } );

		// removing touch event listeners
		this.#buttonsHTMLElement.removeEventListener ( 'touchstart', this.#onButtonsContainerTouchEL, false );
		this.#buttonsHTMLElement.removeEventListener ( 'touchmove', this.#onButtonsContainerTouchEL, false );
		this.#buttonsHTMLElement.removeEventListener ( 'touchend', this.#onButtonsContainerTouchEL, false );

		this.#mainHTMLElement.removeChild ( this.#buttonsHTMLElement );
		this.#timerId = null;
		this.#isShow = false;
	}

	/**
	The header touch event listener. Show or hide the toolbar
	@param {Event} touchEvent The event to handle
	*/

	#onHeaderTouch ( touchEvent ) {
		touchEvent.preventDefault ( );
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
					BaseToolbarUI.#HIDE_Y_PAN < deltaPanY
				) {
					this.#show ( );
				}
				else if (
					ZERO > deltaPanY
					&&
					BaseToolbarUI.#HIDE_Y_PAN < -deltaPanY
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
	}

	/**
	create the toolbar
	@param {String} headerText The text to display on the header of the toolbar
	@param {TOOLBAR_POSITION} position The position of the toolbar on the screen
	*/

	createUI ( headerText, position ) {
		if ( this.#mainHTMLElement ) {
			return false;
		}
		this.#wheelEventData = new WheelEventData ( );
		this.#onWheelButtonsEventListener = new ButtonsContainerWheelEL ( this.#wheelEventData );
		this.#onButtonsContainerTouchEL = new ButtonsContainerTouchEL ( this.#wheelEventData );

		this.#mainHTMLElement =
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-ToolbarUI-MainHTMLElement ' + position
				},
				document.body
			);
		this.#mainHTMLElement.addEventListener ( 'mouseenter', ( ) => this.#show ( ), false );

		this.#mainHTMLElement.addEventListener ( 'mouseleave', ( ) => this.#onMouseLeave ( ), false );

		const headerHtmlElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-ToolbarUI-Header',
				textContent : headerText
			},
			this.#mainHTMLElement
		);

		// don't try to understand the next line. to the css rotation offsetWidth and offsetHeight gives
		// strange results... Have spend 2 hours on this...
		this.#wheelEventData.buttonTop = headerHtmlElement.offsetWidth - headerHtmlElement.offsetHeight;

		headerHtmlElement.addEventListener ( 'touchstart', touchEvent => this.#onHeaderTouch ( touchEvent ), false );
		headerHtmlElement.addEventListener ( 'touchend', touchEvent => this.#onHeaderTouch ( touchEvent ), false );

		this.#onToolbarButtonClickEL = new ToolbarButtonClickEL ( this.#toolbarItems );
		return true;
	}

	/**
	Add a ToolbarItem on the collection of ToolbarItems
	@param {ToolbarItem} toolbarItem An object with data to configure the button
	*/

	addToolbarItem ( toolbarItem ) {
		this.#toolbarItems.push ( toolbarItem );
	}
}

export default BaseToolbarUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */