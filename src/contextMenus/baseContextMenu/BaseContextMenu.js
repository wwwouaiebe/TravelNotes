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

import theTranslator from '../../core/uiLib/Translator.js';
import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import BaseContextMenuOperator from './BaseContextMenuOperator.js';
import { ZERO, INVALID_OBJ_ID, LAT_LNG } from '../../main/Constants.js';
import theDevice from '../../core/lib/Device.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Base class used to create context menus
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BaseContextMenu {

	/**
	The X screen coordinate of the mouse event that have triggered the menu
	@type {Number}
	*/

	#clientX;

	/**
	The Y screen coordinate of the mouse event that have triggered the menu
	@type {Number}
	*/

	#clientY;

	/**
	The lat an lng at the mouse position for events triggered by the map
	@type {Array.<Number>}
	*/

	#latLng;

	/**
	The ObjId of the TravelObject on witch the mouse is positionned if any
	@type {Number}
	*/

	#targetObjId;

	/**
	A flag indicating when the menu must have a parent node. Menus triggered from leaflet objects don't have
	parentNode
	@type {Boolean}
	*/

	#haveParentNode;

	/**
	The active BaseContextMenu instance. Needed to close the menu when a second menu is loaded
	@type {BaseContextMenu}
	*/

	static #currentMenu = null;

	/**
	The promise ok handler
	@type {function}
	*/

	#onPromiseOk;

	/**
	The promise error handler
	@type {function}
	*/

	#onPromiseError;

	/**
	The root HTMLElement of the menu
	@type {HTMLElement}
	*/

	#contextMenuHTMLElement;

	/**
	The cancel button HTMLElement
	@type {HTMLElement}
	*/

	#cancelButton;

	/**
	The HTMLElement of the menu items
	@type {Array.<HTMLElement>}
	*/

	#menuItemHTMLElements;

	/**
	The associated BaseContextMenuOperator object
	@type {BaseContextMenuOperator}
	*/

	#menuOperator;

	/**
	The min margin between the screen borders and the menu in pixels
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #menuMargin ( ) { return 20; }

	/**
	A flag indicating if a menu is active
	@type {Boolean}
	*/

	static get isActive ( ) { return Boolean ( BaseContextMenu.#currentMenu ); }

	/**
	Build the menu container and add event listeners
	*/

	#createContextMenuHTMLElement ( ) {
		this.#contextMenuHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-ContextMenu-ContextMenuHTMLElement'
			},
			document.body
		);
	}

	/**
	Create the cancel button and it's event listener to the menu
	*/

	#createCancelButton ( ) {
		this.#cancelButton = theHTMLElementsFactory.create (
			'div',
			{
				textContent : '❌',
				className : 'TravelNotes-ContextMenu-CancelButton',
				title : theTranslator.getText ( 'BaseContextMenu - Close' )
			},
			this.#contextMenuHTMLElement
		);
	}

	/**
	Create the menuItems html elements
	*/

	#createMenuItemsHTMLElements ( ) {
		this.#menuItemHTMLElements = [];
		this.menuItems.forEach (
			( menuItem, index ) => {
				const menuItemHTMLElement = theHTMLElementsFactory.create (
					'div',
					{
						textContent : menuItem.itemText,
						className :	'TravelNotes-ContextMenu-MenuItem',
						dataset : { ObjId : String ( index ) }
					},
					this.#contextMenuHTMLElement
				);
				if ( ! menuItem.isActive ) {
					menuItemHTMLElement.classList.add ( 'TravelNotes-ContextMenu-MenuItemDisabled' );
				}
				this.#menuItemHTMLElements.push ( menuItemHTMLElement );
			}
		);
	}

	/**
	Move the container, so the top of the container is near the mouse
	*/

	#moveContextMenu ( ) {

		// the menu is positionned ( = top left where the user have clicked but the menu must be completely in the window...
		const screenAvailable = theDevice.screenAvailable;
		const menuTop = Math.min (
			this.#clientY,
			screenAvailable.height - this.#contextMenuHTMLElement.clientHeight - BaseContextMenu.#menuMargin
		);
		this.#contextMenuHTMLElement.style.top = String ( menuTop ) + 'px';
		const menuLeft = Math.min (
			this.#clientX,
			screenAvailable.width -
			this.#contextMenuHTMLElement.clientWidth -
			BaseContextMenu.#menuMargin
		);
		this.#contextMenuHTMLElement.style.left = String ( menuLeft ) + 'px';
	}

	/**
	Create and show the menu. This method is called by the Promise
	@param {function} onPromiseOk The Promise Ok handler
	@param {function} onPromiseError The Promise Error handler
	*/

	#createMenu ( onPromiseOk, onPromiseError ) {
		this.#onPromiseOk = onPromiseOk;
		this.#onPromiseError = onPromiseError;
		this.#createContextMenuHTMLElement ( );
		this.#createCancelButton ( );
		this.#createMenuItemsHTMLElements ( );
		this.#moveContextMenu ( );
		this.#menuOperator = new BaseContextMenuOperator ( this );

	}

	/**
	The constructor
	@param {Event} contextMenuEvent The event that have triggered the menu
	@param {?HTMLElement} parentNode The parent node of the menu. Can be null for leaflet objects
	*/

	constructor ( contextMenuEvent, parentNode ) {

		Object.freeze ( this );

		if ( BaseContextMenu.#currentMenu ) {

			// the menu is already opened, so we suppose the user will close the menu by clicking outside...
			BaseContextMenu.#currentMenu.onCancel ( );
			return;
		}

		// Saving data from the contextMenuEvent and parentNode
		this.#clientX = contextMenuEvent.clientX || contextMenuEvent.originalEvent.clientX || ZERO;
		this.#clientY = contextMenuEvent.clientY || contextMenuEvent.originalEvent.clientY || ZERO;
		this.#latLng = [
			contextMenuEvent.latlng ? contextMenuEvent.latlng.lat : LAT_LNG.defaultValue,
			contextMenuEvent.latlng ? contextMenuEvent.latlng.lng : LAT_LNG.defaultValue
		];
		this.#targetObjId =
			contextMenuEvent.target?.objId
			??
			( Number.parseInt ( contextMenuEvent?.currentTarget?.dataset?.tanObjId ) || INVALID_OBJ_ID );
		this.#haveParentNode = Boolean ( parentNode );
		BaseContextMenu.#currentMenu = this;
	}

	/**
	onOk method used by the menu operator. Clean the variables and call the Promise Ok handler
	@param {Number} selectedItemObjId The id of the item selected by the user
	*/

	onOk ( selectedItemObjId ) {
		this.#menuOperator.destructor ( );
		BaseContextMenu.#currentMenu = null;
		this.#onPromiseOk ( selectedItemObjId );
	}

	/**
	onCancel method used by the menu operator. Clean the variables and call the Promise Error handler
	*/

	onCancel ( ) {
		this.#menuOperator.destructor ( );
		BaseContextMenu.#currentMenu = null;
		this.#onPromiseError ( );
	}

	/**
	Show the menu on the screen and perform the correct operation when an item is selected
	*/

	show ( ) {
		if ( ! BaseContextMenu.#currentMenu ) {
			return;
		}
		new Promise (
			( onPromiseOk, onPromiseError ) => { this.#createMenu ( onPromiseOk, onPromiseError ); }
		)
			.then ( selectedItemObjId => this.menuItems [ selectedItemObjId ].action ( ) )
			.catch (
				err => {
					if ( err ) {
						console.error ( err );
					}
				}
			);
	}

	/**
	The list of menu items to use. Must be implemented in the derived classes
	@type {Array.<MenuItem>}
	*/

	get menuItems ( ) { return []; }

	/**
	The root HTMLElement of the menu
	@type {HTMLElement}
	*/

	get contextMenuHTMLElement ( ) { return this.#contextMenuHTMLElement; }

	/**
	The cancel button HTMLElement
	@type {HTMLElement}
	*/

	get cancelButton ( ) { return this.#cancelButton; }

	/**
	The HTMLElement of the menu items
	@type {Array.<HTMLElement>}
	*/

	get menuItemHTMLElements ( ) { return this.#menuItemHTMLElements; }

	/**
	The X screen coordinate of the mouse event that have triggered the menu
	@type {Number}
	*/

	get clientX ( ) { return this.#clientX; }

	/**
	The Y screen coordinate of the mouse event that have triggered the menu
	@type {Number}
	*/

	get clientY ( ) { return this.#clientY; }

	/**
	The lat an lng at the mouse position for events triggered by the map
	@type {Array.<Number>}
	*/

	get latLng ( ) { return this.#latLng; }

	/**
	The ObjId of the TravelObject on witch the mouse is positionned if any
	@type {Number}
	*/

	get targetObjId ( ) { return this.#targetObjId; }

	/**
	A flag indicating when the menu must have a parent node. Menus triggered from leaflet objects don't have
	parentNode
	@type {Boolean}
	*/

	get haveParentNode ( ) { return this.#haveParentNode; }

}

export default BaseContextMenu;

/* --- End of file --------------------------------------------------------------------------------------------------------- */