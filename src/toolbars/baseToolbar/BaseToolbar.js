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
import CommandButtonHTMLElementEL from './CommandButtonHTMLElementEL.js';
import LinkButtonHTMLElementEL from './LinkButtonHTMLElementEL.js';
import ButtonsHTMLElementEL from './ButtonsHTMLElementEL.js';
import ToolbarHTMLElementEL from './ToolbarHTMLElementEL.js';
import theConfig from '../../data/Config.js';

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
	Event listeners for the toolbar html element
	@type {ToolbarHTMLElementEL}
	*/

	#toolbarHTMLElementEL;

	/**
	The HTML element that contains the buttons
	@type {HTMLElement}
	*/

	#buttonsHTMLElement;

	/**
	Events listeners for the button container
	@type {ButtonsHTMLElementEL}
	*/

	#buttonsHTMLElementEL;

	/**
	The event listeners for the command buttons
	@type {CommandButtonHTMLElementEL}
	*/

	#commandButtonHTMLElementEL;

	/**
	The event listeners for the link buttons
	@type {LinkButtonHTMLElementEL}
	*/

	#linkButtonHTMLElementEL;

	/**
	Timer id for the mouse leave event
	@type {Number}
	*/

	#timerId;

	/**
	A boolean saving the the current state of the toolbar
	@type {boolean}
	 */

	#isShow;

	/**
	An array with the ToolbarItem objects
	@type {Array.<ToolbarItem>}
	*/

	#toolbarItemsArray;

	/**
	Add a command button to the toolbar
	@param {ToolbarItem} toolbarItem The toolbar item for witch the button will be created
	@param {Number} index The position of the toolbar item in the #toolbarItemsContainer.toolbarItemsArray
	*/

	#addCommandButton ( toolbarItem, index ) {
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

		this.#commandButtonHTMLElementEL.addEventListeners ( buttonHTMLElement );
	}

	/**
	Event listener action for click on a command button
	@param {Event} clickEvent The event
	*/

	commandButtonClick ( clickEvent ) {
		this.#toolbarItemsArray [ Number.parseInt ( clickEvent.target.dataset.tanItemId ) ]
			.action ( );
		this.hide ( );
	}

	/**
	Add a link button to the toolbar
	@param {ToolbarItem} toolbarItem The toolbar item for witch the button will be created
	*/

	#addLinkButton ( toolbarItem ) {
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
		this.#linkButtonHTMLElementEL.addEventListeners ( buttonHTMLElement );
	}

	/**
	Event listener action for click on a link button
	@param {Event} clickEvent The event
	*/

	linkButtonClick ( clickEvent ) {

		// due to preventDefault calls, link are not working on the toolbar and
		// we have to copy the link in a temp anchor element
		theHTMLElementsFactory.create (
			'a',
			{
				href : clickEvent.currentTarget.firstChild.href,
				rel : clickEvent.currentTarget.firstChild.rel,
				target : clickEvent.currentTarget.firstChild.target
			}
		).click ( );
		this.hide ( );

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
		this.#toolbarItemsArray = [ ];
		this.addToolbarItems ( );

		// adding buttons
		this.#toolbarItemsArray.forEach (
			( toolbarItem, index ) => {
				if ( toolbarItem.isCommand ( ) ) {
					this.#addCommandButton ( toolbarItem, index );
				}
				else {
					this.#addLinkButton ( toolbarItem );
				}
			}
		);

		this.#buttonsHTMLElementEL.addEventListeners ( this.#buttonsHTMLElement );
		this.#isShow = true;
	}

	/**
	Mouse enter or click on the toolbar event listener
	*/

	toolbarHTMLElementMouseEnterOrClick ( ) {
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

	toolbarHTMLElementMouseLeave ( ) {
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

			this.#commandButtonHTMLElementEL.removeEventListeners ( buttonHTMLElement );
			this.#buttonsHTMLElement.removeChild ( buttonHTMLElement );
		}

		// removing the buttons container
		this.#buttonsHTMLElementEL.removeEventListeners ( this.#buttonsHTMLElement );
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
		this.#toolbarItemsArray = [];

		// EL creation
		this.#buttonsHTMLElementEL = new ButtonsHTMLElementEL ( this );
		this.#commandButtonHTMLElementEL = new CommandButtonHTMLElementEL ( this );
		this.#linkButtonHTMLElementEL = new LinkButtonHTMLElementEL ( this );
		this.#toolbarHTMLElementEL = new ToolbarHTMLElementEL ( this );

		// Toolbar container creation
		this.#toolbarHTMLElement =
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-BaseToolbar-ToolbarHTMLElement ' + position
				},
				document.body
			);

		// Header text creation
		const headerHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseToolbar-HeaderHTMLElement'
			},
			this.#toolbarHTMLElement
		);
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseToolbar-HeaderTextHTMLElement',
				textContent : headerText
			},
			headerHTMLElement
		);
		this.#toolbarHTMLElementEL.addEventListeners ( headerHTMLElement );
	}

	/**
	Add a ToolbarItem on the collection of ToolbarItems
	@param {ToolbarItem} toolbarItem An object with data to configure the button
	*/

	addToolbarItem ( toolbarItem ) {
		this.#toolbarItemsArray.push ( toolbarItem );
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