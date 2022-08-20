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
import {
	WheelEventData,
	ToolbarItemsContainer,
	ToolbarButtonClickEL,
	ToolbarButtonTouchEL,
	ButtonsContainerTouchEL,
	ButtonsContainerWheelEL
} from '../baseToolbar/BaseToolbarEL.js';
import theConfig from '../data/Config.js';
import { ZERO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A base class for realisation of toolbars
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BaseToolbar {

	/**
	The main HTMLElement of the UI
	@type {HTMLElement}
	*/

	#mainHTMLElement;

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
	The touch event listener for the buttons
	@type {ToolbarButtonTouchEL}
	*/

	#onToolbarButtonTouchEL;

	/**
	A boolean saving the the current state of the UI
	@type {boolean}
	 */

	#isShow;

	/**
	An array with the ToolbarItems
	@type {Array.<ToolbarItem>}
	*/

	#toolbarItemsContainer;

	/**
	The delay between a mouseenter and a click event.
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MOUSE_EVENT_MAX_DELAY ( ) { return 100; }

	/**
	Show the toolbar
	*/

	#show ( ) {

		// container for the button
		this.#buttonsHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-ToolbarUI-Buttons'
			},
			this.#mainHTMLElement
		);

		this.#toolbarItemsContainer.toolbarItems = [ ];
		this.addToolbarItems ( );

		// wheel event data computation
		this.#wheelEventData.buttonsHeight = ZERO;

		// adding buttons
		this.#toolbarItemsContainer.toolbarItems.forEach (
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
					buttonHTMLElement.addEventListener ( 'touchstart', this.#onToolbarButtonTouchEL, false );
					buttonHTMLElement.addEventListener ( 'touchend', this.#onToolbarButtonTouchEL, false );
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
	The timestamp pf the last mouseenter or click event
	@type {Number}
	*/

	#lastMouseEventTimestamp;

	/**
	Mouse enter event listener
	@param {Event} mouseEvent the trigered event
	*/

	#onClick ( mouseEvent ) {

		// When the delay is lower than #MOUSE_EVENT_MAX_DELAY 	we consider that the click event and the
		// mouse enter event are trigered by the same user action on touch devices
		// and the click event is cancelled
		if ( BaseToolbar.#MOUSE_EVENT_MAX_DELAY > mouseEvent.timeStamp - this.#lastMouseEventTimestamp ) {
			return;
		}

		this.#onMouseEnter ( mouseEvent );
	}

	/**
	Mouse enter event listener
	@param {Event} mouseEvent the trigered event
	*/

	#onMouseEnter ( mouseEvent ) {
		this.#lastMouseEventTimestamp = mouseEvent.timeStamp;
		if ( this.#isShow ) {
			this.hide ( );
		}
		else {

			// cleaning the timer
			if ( this.#timerId ) {
				clearTimeout ( this.#timerId );
				this.#timerId = null;
			}
			this.#show ( );
		}
	}

	/**
	Mouse leave event listener
	*/

	#onMouseLeave ( ) {
		if ( this.#isShow ) {
			this.#timerId = setTimeout ( ( ) => this.hide ( ), theConfig.layersToolbarUI.toolbarTimeOut );
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );

	}

	/**
	Hide the toolbar
	*/

	hide ( ) {

		// cleaning the timer
		if ( this.#timerId ) {
			clearTimeout ( this.#timerId );
			this.#timerId = null;
		}

		// removing wheel event
		this.#buttonsHTMLElement.removeEventListener ( 'wheel', this.#onWheelButtonsEventListener, { passive : true } );

		// removing touch event listeners
		this.#buttonsHTMLElement.removeEventListener ( 'touchstart', this.#onButtonsContainerTouchEL, false );
		this.#buttonsHTMLElement.removeEventListener ( 'touchmove', this.#onButtonsContainerTouchEL, false );
		this.#buttonsHTMLElement.removeEventListener ( 'touchend', this.#onButtonsContainerTouchEL, false );

		this.#mainHTMLElement.removeChild ( this.#buttonsHTMLElement );
		this.#buttonsHTMLElement = null;
		this.#isShow = false;
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
		this.#timerId = null;
		this.#isShow = false;
		this.#lastMouseEventTimestamp = ZERO;
		this.#wheelEventData = new WheelEventData ( );
		this.#toolbarItemsContainer = new ToolbarItemsContainer ( );
		this.#onWheelButtonsEventListener = new ButtonsContainerWheelEL ( this.#wheelEventData );
		this.#onButtonsContainerTouchEL = new ButtonsContainerTouchEL ( this.#wheelEventData );
		this.#onToolbarButtonTouchEL = new ToolbarButtonTouchEL ( this, this.#toolbarItemsContainer );
		this.#mainHTMLElement =
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-ToolbarUI-MainHTMLElement ' + position
				},
				document.body
			);
		this.#mainHTMLElement.addEventListener ( 'click', mouseEvent => this.#onClick ( mouseEvent ), false );
		this.#mainHTMLElement.addEventListener ( 'mouseenter', mouseEvent => this.#onMouseEnter ( mouseEvent ), false );
		this.#mainHTMLElement.addEventListener ( 'mouseleave', mouseEvent => this.#onMouseLeave ( mouseEvent ), false );
		const headerHtmlElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-ToolbarUI-Header',
				textContent : headerText
			},
			this.#mainHTMLElement
		);

		// don't try to understand the next line. Due to the css rotation offsetWidth and offsetHeight gives
		// strange results... Have spend 2 hours on this...
		this.#wheelEventData.buttonTop = headerHtmlElement.offsetWidth - headerHtmlElement.offsetHeight;
		this.#onToolbarButtonClickEL = new ToolbarButtonClickEL ( this.#toolbarItemsContainer );
		return true;
	}

	/**
	Add a ToolbarItem on the collection of ToolbarItems
	@param {ToolbarItem} toolbarItem An object with data to configure the button
	*/

	addToolbarItem ( toolbarItem ) {
		this.#toolbarItemsContainer.toolbarItems.push ( toolbarItem );
	}
}

export default BaseToolbar;

/* --- End of file --------------------------------------------------------------------------------------------------------- */