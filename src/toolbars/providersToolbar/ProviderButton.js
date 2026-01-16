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
import theRouter from '../../core/lib/Router.js';
import { NOT_FOUND } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Provider buttons on the ProvidersToolbar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ProviderButton {

	/**
	 * The screenX coor. of the pointer after a pointerdown event
	 * @type {Number}
	 */

	#pointerScreenX = NOT_FOUND;

	/**
	 * The screenX coor. of the pointer after a pointerdown event
	 * @type {Number}
	 */

	#pointerScreenY = NOT_FOUND;

	/**
	A reference to the toolbar
	@type {HTMLElement}
	*/

	#providersToolbar;

	/**
	The provider
	@type {BaseRouteProvider}
	*/

	#provider;

	/**
	the button HTMLElement
	@type {HTMLElement}
	*/

	#buttonHTMLElement;

	/**
	The constructor
	@param {ProvidersToolbar} providersToolbar The providersToolbar on witch the button will be added
	@param {BaseRouteProvider} provider The provider object linked to the button
	*/

	constructor ( providersToolbar, provider ) {

		Object.freeze ( this );

		this.#providersToolbar = providersToolbar;
		this.#provider = provider;

		// HTML creation
		this.#buttonHTMLElement = theHTMLElementsFactory.create (
			'img',
			{
				src : provider.icon,
				id : 'travelnotes-providers-toolbar-' + provider.name + 'img-button',
				className : 'travelnotes-providers-toolbar-img-button',
				title : provider.title || provider.name
			}
		);
		this.#buttonHTMLElement.addEventListener ( 'pointerdown', this );
		this.#buttonHTMLElement.addEventListener ( 'pointerup', this );
	}

	/**
	click event listener. The button is also it's own event listener.
	@param {Event} pointerEvent The event to handle
	*/

	handleEvent ( pointerEvent ) {
		switch ( pointerEvent.type ) {
		case 'pointerdown' :
			this.#pointerScreenX = pointerEvent.screenX;
			this.#pointerScreenY = pointerEvent.screenY;
			break;
		case 'pointerup' :
			if (
				this.#pointerScreenX === pointerEvent.screenX
					&&
					this.#pointerScreenY === pointerEvent.screenY
			) {
				this.#providersToolbar.provider = this.#provider.name;
				theRouter.startRouting ( );
			}
			this.#pointerScreenX = NOT_FOUND;
			this.#pointerScreenY = NOT_FOUND;
			break;
		default :
			break;
		}

	}

	/**
	the button HTMLElements
	@type {HTMLElement}
	*/

	get buttonHTMLElement ( ) { return this.#buttonHTMLElement; }

	/**
	The provider
	@type {BaseRouteProvider}
	*/

	get provider ( ) { return this.#provider; }

	/**
	draw or remove a frame around the button
	*/

	set active ( active ) {
		if ( active ) {
			this.#buttonHTMLElement.classList.add ( 'travelnotes-providers-toolbar-active-provider-img-button' );
		}
		else {
			this.#buttonHTMLElement.classList.remove ( 'travelnotes-providers-toolbar-active-provider-img-button' );
		}
	}
}

export default ProviderButton;

/* --- End of file --------------------------------------------------------------------------------------------------------- */