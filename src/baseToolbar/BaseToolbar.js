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
	ToolbarItemsContainer,
	ButtonHTMLElementClickEL,
	ButtonHTMLElementTouchEL,
	ButtonsHTMLElementTouchEL,
	ButtonsHTMLElementWheelEL
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

	#toolbarHTMLElement;

	#headerHTMLElement;

	/**
	The HTML element that contains the buttons
	@type {HTMLElement}
	*/

	#buttonsHTMLElement;

	/**
	Timer id for the mouse leave event
	@type {Number}
	*/

	#timerId;

	/**
	The wheel event listener for the buttons container
	@type {ButtonsHTMLElementWheelEL}
	*/

	#buttonsHTMLElementWheelEL;

	/**
	The touch event listener for the buttons container
	@type {ButtonsHTMLElementTouchEL}
	*/

	#buttonsHTMLElementTouchEL;

	/**
	The click event listener for the buttons
	@type {ButtonHTMLElementClickEL}
	*/

	#buttonHTMLElementClickEL;

	/**
	The touch event listener for the buttons
	@type {ButtonHTMLElementTouchEL}
	*/

	#buttonHTMLElementTouchEL;

	/**
	A boolean saving the the current state of the UI
	@type {boolean}
	 */

	#isShow;

	/**
	An object with the ToolbarItems array. Needed to have an object to share with EL.
	@type {ToolbarItemsContainer}
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
				className : 'TravelNotes-BaseToolbar-ButtonsHTMLElement'
			},
			this.#toolbarHTMLElement
		);

		this.#toolbarItemsContainer.toolbarItemsArray = [ ];
		this.addToolbarItems ( );

		// adding buttons
		this.#toolbarItemsContainer.toolbarItemsArray.forEach (
			( toolbarItem, index ) => {
				if ( toolbarItem.isCommand ( ) ) {
					const buttonHTMLElement = theHTMLElementsFactory.create (
						'div',
						{
							className : 'TravelNotes-BaseToolbar-ButtonHTMLElement',
							textContent : toolbarItem.textContent,
							title : toolbarItem.title,
							dataset : { ItemId : index }
						},
						this.#buttonsHTMLElement
					);
					buttonHTMLElement.addEventListener ( 'click', this.#buttonHTMLElementClickEL, false );
					buttonHTMLElement.addEventListener ( 'touchstart', this.#buttonHTMLElementTouchEL, false );
					buttonHTMLElement.addEventListener ( 'touchend', this.#buttonHTMLElementTouchEL, false );
				}
				else {
					const buttonHTMLElement = theHTMLElementsFactory.create (
						'div',
						{
							className : 'TravelNotes-BaseToolbar-ButtonHTMLElement',
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
								className : 'TravelNotes-BaseToolbar-ButtonLinkHTMLElement',
								href : toolbarItem.action,
								target : '_blank'
							},
							buttonHTMLElement
						)
					);
				}
			}
		);

		// adding wheel event
		this.#buttonsHTMLElement.addEventListener ( 'wheel', this.#buttonsHTMLElementWheelEL, { passive : true } );

		// adding touch event listeners
		this.#buttonsHTMLElement.addEventListener ( 'touchstart', this.#buttonsHTMLElementTouchEL, false );
		this.#buttonsHTMLElement.addEventListener ( 'touchmove', this.#buttonsHTMLElementTouchEL, false );
		this.#buttonsHTMLElement.addEventListener ( 'touchend', this.#buttonsHTMLElementTouchEL, false );
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

	#toolbarHTMLElementClickEL ( mouseEvent ) {

		// When the delay is lower than #MOUSE_EVENT_MAX_DELAY 	we consider that the click event and the
		// mouse enter event are trigered by the same user action on touch devices
		// and the click event is cancelled
		if ( BaseToolbar.#MOUSE_EVENT_MAX_DELAY > mouseEvent.timeStamp - this.#lastMouseEventTimestamp ) {
			return;
		}

		this.#toolbarHTMLElementMouseEnterEL ( mouseEvent );
	}

	/**
	Mouse enter event listener
	@param {Event} mouseEvent the trigered event
	*/

	#toolbarHTMLElementMouseEnterEL ( mouseEvent ) {
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

	#toolbarHTMLElementMouseLeaveEL ( ) {
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
		this.#buttonsHTMLElement.removeEventListener ( 'wheel', this.#buttonsHTMLElementWheelEL, { passive : true } );

		// removing touch event listeners
		this.#buttonsHTMLElement.removeEventListener ( 'touchstart', this.#buttonsHTMLElementTouchEL, false );
		this.#buttonsHTMLElement.removeEventListener ( 'touchmove', this.#buttonsHTMLElementTouchEL, false );
		this.#buttonsHTMLElement.removeEventListener ( 'touchend', this.#buttonsHTMLElementTouchEL, false );

		this.#toolbarHTMLElement.removeChild ( this.#buttonsHTMLElement );
		this.#buttonsHTMLElement = null;
		this.#isShow = false;
	}

	/**
	create the toolbar
	@param {String} headerText The text to display on the header of the toolbar
	@param {TOOLBAR_POSITION} position The position of the toolbar on the screen
	*/

	createUI ( headerText, position ) {
		if ( this.#toolbarHTMLElement ) {
			return false;
		}
		this.#timerId = null;
		this.#isShow = false;
		this.#lastMouseEventTimestamp = ZERO;
		this.#toolbarItemsContainer = new ToolbarItemsContainer ( );
		this.#buttonsHTMLElementWheelEL = new ButtonsHTMLElementWheelEL ( );
		this.#buttonsHTMLElementTouchEL = new ButtonsHTMLElementTouchEL ( );
		this.#buttonHTMLElementClickEL = new ButtonHTMLElementClickEL ( this.#toolbarItemsContainer );
		this.#buttonHTMLElementTouchEL = new ButtonHTMLElementTouchEL ( this, this.#toolbarItemsContainer );

		this.#toolbarHTMLElement =
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-BaseToolbar-ToolbarHTMLElement ' + position
				},
				document.body
			);
		this.#toolbarHTMLElement.addEventListener (
			'click',
			mouseEvent => this.#toolbarHTMLElementClickEL ( mouseEvent ),
			false
		);
		this.#toolbarHTMLElement.addEventListener (
			'mouseenter',
			mouseEvent => this.#toolbarHTMLElementMouseEnterEL ( mouseEvent ),
			false
		);
		this.#toolbarHTMLElement.addEventListener (
			'mouseleave',
			mouseEvent => this.#toolbarHTMLElementMouseLeaveEL ( mouseEvent ),
			false
		);

		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseToolbar-HeaderTextHTMLElement',
				textContent : headerText
			},
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-BaseToolbar-HeaderHTMLElement'
				},
				this.#toolbarHTMLElement
			)
		);

	}

	/**
	Add a ToolbarItem on the collection of ToolbarItems
	@param {ToolbarItem} toolbarItem An object with data to configure the button
	*/

	addToolbarItem ( toolbarItem ) {
		this.#toolbarItemsContainer.toolbarItemsArray.push ( toolbarItem );
	}
}

export default BaseToolbar;

/* --- End of file --------------------------------------------------------------------------------------------------------- */