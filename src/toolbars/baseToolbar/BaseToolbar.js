/*
Copyright - 2017 2023 - wwwouaiebe - Contact: https://www.ouaie.be/

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
import ToolbarItemsCollection from './ToolbarItemsCollection.js';
import ButtonHTMLElementPointerEL from './ButtonHTMLElementPointerEL.js';
import ButtonsContainerWheelEL from './ButtonsContainerWheelEL.js';
import ButtonsContainerPointerEL from './ButtonsContainerPointerEL.js';
import theConfig from '../../data/Config.js';
import theDevice from '../../core/lib/Device.js';

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

	#toolbarContainer;

	/**
	 * The header of the toolbar ( = the always visible part of the toolbar)
	 * @type {HTMLElement}
	 */

	#toolbarHeader;

	/**
	The HTML element that contains the buttons
	@type {HTMLElement}
	*/

	#buttonsContainer;

	/**
	Timer id for the mouse leave event
	@type {Number}
	*/

	#timerId;

	/**
	The wheel event listener for the buttons container
	@type {ButtonsContainerWheelEL}
	*/

	#buttonsContainerWheelEL;

	/**
	The pointer event listener for the buttons container
	@type {ButtonsContainerWheelEL}
	*/

	#buttonsContainerPointerEL;

	/**
	The pointer event listener for the buttons
	@type {ButtonHTMLElementPointerEL}
	*/

	#buttonHTMLElementPointerEL;

	/**
	 * pointer event listener on the toolbar header
	 * Only active when thr pointer type is 'touch'
	 * Remember that toolbars are global objects never deleted, so we can have EL as simple member methods
	 * @param {Event} pointerEvent The event to trigger
	 */

	#toolbarHeaderPointerEnterEL ( pointerEvent ) {
		theDevice.setPointerType ( pointerEvent );
		switch ( theDevice.pointerType ) {
		case 'mouse' :
			break;
		case 'touch' :
			if ( this.#isShow ) {
				this.hide ( );
			}
			else {
				this.#show ( );
			}
			break;
		default :
			break;
		}
	}

	/**
	 * Mouse enter on the toolbar event listener
	 * Only active when thr pointer type is 'mouse'
	 * @param {Event} pointerEvent the trigered event
	 */

	#toolbarContainerPointerEnterEL ( pointerEvent ) {
		theDevice.setPointerType ( pointerEvent );
		if ( this.#timerId ) {
			clearTimeout ( this.#timerId );
			this.#timerId = null;
		}
		switch ( theDevice.pointerType ) {
		case 'mouse' :
			if ( ! this.#isShow ) {
				this.#show ( );
			}
			break;
		case 'touch' :
			break;
		default :
			break;
		}
	}

	/**
	 * Mouse leave the toolbar event listener
	 * Only active when thr pointer type is 'mouse'
	 * Remember that toolbars are global objects never deleted, so we can have EL as simple member methods
	 * @param {event} pointerEvent The event to manage
	 */

	#toolbarContainerPointerLeaveEL ( pointerEvent ) {
		theDevice.setPointerType ( pointerEvent );
		switch ( theDevice.pointerType ) {
		case 'mouse' :
			if ( this.#isShow ) {
				this.#timerId = setTimeout ( ( ) => this.hide ( ), theConfig.toolbars.timeOut );
			}
			break;
		default :
			break;
		}
	}

	/**
	A boolean saving the the current state of the toolbar
	@type {boolean}
	 */

	#isShow;

	/**
	An object with the ToolbarItems array. Needed to have an object to share with EL.
	@type {ToolbarItemsCollection}
	*/

	#toolbarItemsCollection;

	/**
	Add a button to the toolbar
	@param {ToolbarItem} toolbarItem The toolbar item for witch the button will be created
	@param {Number} index The position of the toolbar item in the #toolbarItemsCollection.toolbarItemsArray
	*/

	#addButton ( toolbarItem, index ) {
		const buttonHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'travelnotes-base-toolbar-button',
				textContent : toolbarItem.textContent,
				title : toolbarItem.title,
				dataset : { ItemId : index }
			},
			this.#buttonsContainer
		);
		buttonHTMLElement.addEventListener ( 'pointerdown', this.#buttonHTMLElementPointerEL, false );
		buttonHTMLElement.addEventListener ( 'pointerup', this.#buttonHTMLElementPointerEL, false );
		buttonHTMLElement.addEventListener ( 'pointerenter', this.#buttonHTMLElementPointerEL, false );
		buttonHTMLElement.addEventListener ( 'pointerleave', this.#buttonHTMLElementPointerEL, false );
	}

	/**
	Show the toolbar
	*/

	#show ( ) {

		// container for the buttons
		this.#buttonsContainer = theHTMLElementsFactory.create (
			'div',
			{
				className : 'travelnotes-base-toolbar-buttons-container'
			},
			this.#toolbarContainer
		);

		// Calling the addToolbarItems ( ) method of the derived classes
		this.#toolbarItemsCollection.toolbarItemsArray = [ ];
		this.addToolbarItems ( );

		// adding buttons
		this.#toolbarItemsCollection.toolbarItemsArray.forEach (
			( toolbarItem, index ) => {
				this.#addButton ( toolbarItem, index );
			}
		);

		// adding wheel and pointer events
		this.#buttonsContainer.addEventListener ( 'wheel', this.#buttonsContainerWheelEL, { passive : true } );
		this.#buttonsContainer.addEventListener ( 'pointerdown', this.#buttonsContainerPointerEL, false );
		this.#buttonsContainer.addEventListener ( 'pointerup', this.#buttonsContainerPointerEL, false );
		this.#buttonsContainer.addEventListener ( 'pointermove', this.#buttonsContainerPointerEL, false );
		this.#isShow = true;
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Add the ToolbarItems to the toolbar. Must be overloaded in the derived classes
	*/

	addToolbarItems ( ) {
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
		while ( this.#buttonsContainer.firstChild ) {
			const buttonHTMLElement = this.#buttonsContainer.firstChild;
			buttonHTMLElement.removeEventListener ( 'pointerdown', this.#buttonHTMLElementPointerEL, false );
			buttonHTMLElement.removeEventListener ( 'pointerup', this.#buttonHTMLElementPointerEL, false );
			buttonHTMLElement.removeEventListener ( 'pointerenter', this.#buttonHTMLElementPointerEL, false );
			buttonHTMLElement.removeEventListener ( 'pointerleave', this.#buttonHTMLElementPointerEL, false );
			this.#buttonsContainer.removeChild ( buttonHTMLElement );
		}

		// removing the buttons container
		this.#buttonsContainer.removeEventListener ( 'wheel', this.#buttonsContainerWheelEL, { passive : true } );
		this.#buttonsContainer.removeEventListener ( 'pointerdown', this.#buttonsContainerPointerEL, false );
		this.#buttonsContainer.removeEventListener ( 'pointerup', this.#buttonsContainerPointerEL, false );
		this.#buttonsContainer.removeEventListener ( 'pointermove', this.#buttonsContainerPointerEL, false );
		this.#toolbarContainer.removeChild ( this.#buttonsContainer );
		this.#buttonsContainer = null;

		this.#isShow = false;
	}

	/**
	create the toolbar container and header
	@param {String} headerText The text to display on the header of the toolbar
	@param {TOOLBAR_POSITION} position The position of the toolbar on the screen
	*/

	createUI ( headerText, position ) {

		// Toolbar already created... return
		if ( this.#toolbarContainer ) {
			return false;
		}

		// init of members
		this.#timerId = null;
		this.#isShow = false;

		this.#toolbarItemsCollection = new ToolbarItemsCollection ( );

		// EL creation
		this.#buttonsContainerWheelEL = new ButtonsContainerWheelEL ( );
		this.#buttonsContainerPointerEL = new ButtonsContainerPointerEL ( );
		this.#buttonHTMLElementPointerEL = new ButtonHTMLElementPointerEL ( this, this.#toolbarItemsCollection );

		// Toolbar container creation
		this.#toolbarContainer =
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'travelnotes-base-toolbar-container ' + position
				},
				document.body
			);

		this.#toolbarContainer.addEventListener (
			'pointerenter',
			pointerEvent => this.#toolbarContainerPointerEnterEL ( pointerEvent ),
			false
		);
		this.#toolbarContainer.addEventListener (
			'pointerleave',
			pointerEvent => this.#toolbarContainerPointerLeaveEL ( pointerEvent ),
			false
		);

		// Header text creation
		this.#toolbarHeader = theHTMLElementsFactory.create (
			'div',
			{
				className : 'travelnotes-base-toolbar-header'
			},
			this.#toolbarContainer
		);

		this.#toolbarHeader.addEventListener (
			'pointerenter',
			pointerEvent => this.#toolbarHeaderPointerEnterEL ( pointerEvent ),
			false
		);

		theHTMLElementsFactory.create (
			'div',
			{
				className : 'travelnotes-base-toolbar-header-text',
				textContent : headerText
			},
			this.#toolbarHeader
		);
	}

	/**
	Add a ToolbarItem on the collection of ToolbarItems
	@param {ToolbarItem} toolbarItem An object with data to configure the button
	*/

	addToolbarItem ( toolbarItem ) {
		this.#toolbarItemsCollection.toolbarItemsArray.push ( toolbarItem );
	}

	/**
	Add a css class to the #toolbarContainer, so some css settings can be overloaded for a specific toolbar
	@param {String} cssClass The css class to add
	*/

	addCssClass ( cssClass ) {
		this.#toolbarContainer.classList.add ( cssClass );
	}
}

export default BaseToolbar;

/* --- End of file --------------------------------------------------------------------------------------------------------- */