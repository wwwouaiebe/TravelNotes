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
		- created from v3.6.0
Doc reviewed 202208
 */

import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import ToolbarItemsContainer from './ToolbarItemsContainer.js';
import ButtonHTMLElementClickEL from './ButtonHTMLElementClickEL.js';
import ButtonHTMLElementTouchEL from './ButtonHTMLElementTouchEL.js';
import ButtonsHTMLElementTouchEL from './ButtonsHTMLElementTouchEL.js';
import ButtonsHTMLElementWheelEL from './ButtonsHTMLElementWheelEL.js';
import theConfig from '../../data/Config.js';
import { ZERO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A base class for realisation of toolbars
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BaseToolbar {

	/**
	The main HTMLElement of the toolbar
	@type {HTMLElement}
	*/

	#toolbarHTMLElement;

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
	A boolean saving the the current state of the toolbar
	@type {boolean}
	 */

	#isShow;

	/**
	An object with the ToolbarItems array. Needed to have an object to share with EL.
	@type {ToolbarItemsContainer}
	*/

	#toolbarItemsContainer;

	/**
	The max delay between a mouseenter and a click event to consider the two events as a single event
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MOUSE_EVENT_MAX_DELAY ( ) { return 100; }

	/**
	The timestamp of the last mouseenter or click event
	@type {Number}
	*/

	#lastMouseEventTimestamp;

	/**
	Add a button to the toolbar
	@param {ToolbarItem} toolbarItem The toolbar item for witch the button will be created
	@param {Number} index The position of the toolbar item in the #toolbarItemsContainer.toolbarItemsArray
	*/

	#addButton ( toolbarItem, index ) {
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

	/**
	Show the toolbar
	*/

	#show ( ) {

		// container for the buttons
		this.#buttonsHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseToolbar-ButtonsHTMLElement'
			},
			this.#toolbarHTMLElement
		);

		// Calling the addToolbarItems ( ) method of the derived classes
		this.#toolbarItemsContainer.toolbarItemsArray = [ ];
		this.addToolbarItems ( );

		// adding buttons
		this.#toolbarItemsContainer.toolbarItemsArray.forEach (
			( toolbarItem, index ) => {
				this.#addButton ( toolbarItem, index );
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
	Click on the toolbar event listener. It's needed for touch devices where the mouseenter EL don't work.
	Remember that toolbars are global objects never deleted, so we can have EL as simple member methods
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
	Mouse enter on the toolbar event listener
	Remember that toolbars are global objects never deleted, so we can have EL as simple member methods
	@param {Event} mouseEvent the trigered event
	*/

	#toolbarHTMLElementMouseEnterEL ( mouseEvent ) {

		// Saving the time stamp
		this.#lastMouseEventTimestamp = mouseEvent.timeStamp;

		if ( this.#isShow ) {
			if ( this.#timerId ) {
				clearTimeout ( this.#timerId );
				this.#timerId = null;
				return;
			}

			// Hiding the toolbar if already show. Needed for touch devices for closing the toolbar by clicking on it
			this.hide ( );
		}
		else {
			this.#show ( );
		}
	}

	/**
	Mouse leave the toolbar event listener
	Remember that toolbars are global objects never deleted, so we can have EL as simple member methods
	*/

	#toolbarHTMLElementMouseLeaveEL ( ) {
		if ( this.#isShow ) {
			this.#timerId = setTimeout ( ( ) => this.hide ( ), theConfig.toolbars.timeOut );
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

		// removing buttons
		while ( this.#buttonsHTMLElement.firstChild ) {
			const buttonHTMLElement = this.#buttonsHTMLElement.firstChild;
			buttonHTMLElement.removeEventListener ( 'click', this.#buttonHTMLElementClickEL, false );
			buttonHTMLElement.removeEventListener ( 'touchstart', this.#buttonHTMLElementTouchEL, false );
			buttonHTMLElement.removeEventListener ( 'touchend', this.#buttonHTMLElementTouchEL, false );
			this.#buttonsHTMLElement.removeChild ( buttonHTMLElement );
		}

		// removing the buttons container
		this.#buttonsHTMLElement.removeEventListener ( 'wheel', this.#buttonsHTMLElementWheelEL, { passive : true } );
		this.#buttonsHTMLElement.removeEventListener ( 'touchstart', this.#buttonsHTMLElementTouchEL, false );
		this.#buttonsHTMLElement.removeEventListener ( 'touchmove', this.#buttonsHTMLElementTouchEL, false );
		this.#buttonsHTMLElement.removeEventListener ( 'touchend', this.#buttonsHTMLElementTouchEL, false );
		this.#toolbarHTMLElement.removeChild ( this.#buttonsHTMLElement );
		this.#buttonsHTMLElement = null;

		this.#isShow = false;
	}

	/**
	create the toolbar container and header
	@param {String} headerText The text to display on the header of the toolbar
	@param {TOOLBAR_POSITION} position The position of the toolbar on the screen
	*/

	createUI ( headerText, position ) {

		// Toolbar already created... return
		if ( this.#toolbarHTMLElement ) {
			return false;
		}

		// init of members
		this.#timerId = null;
		this.#isShow = false;
		this.#lastMouseEventTimestamp = ZERO;
		this.#toolbarItemsContainer = new ToolbarItemsContainer ( );

		// EL creation
		this.#buttonsHTMLElementWheelEL = new ButtonsHTMLElementWheelEL ( );
		this.#buttonsHTMLElementTouchEL = new ButtonsHTMLElementTouchEL ( );
		this.#buttonHTMLElementClickEL = new ButtonHTMLElementClickEL ( this.#toolbarItemsContainer );
		this.#buttonHTMLElementTouchEL = new ButtonHTMLElementTouchEL ( this, this.#toolbarItemsContainer );

		// Toolbar container creation
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

		// Header text creation
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

	/**
	Add a css class to the #toolbarHTMLElement, so some css settings can be overloaded for a specific toolbar
	@param {String} cssClass The css class to add
	*/

	addCssClass ( cssClass ) {
		this.#toolbarHTMLElement.classList.add ( cssClass );
	}
}

export default BaseToolbar;

/* --- End of file --------------------------------------------------------------------------------------------------------- */