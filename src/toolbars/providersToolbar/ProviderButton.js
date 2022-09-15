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
import theRouter from '../../core/lib/Router.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Provider buttons on the ProvidersToolbar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ProviderButton {

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
				id : 'TravelNotes-ProvidersToolbar-' + provider.name + 'ImgButton',
				className : 'TravelNotes-ProvidersToolbar-ImgButton',
				title : provider.title || provider.name
			}
		);
		this.#buttonHTMLElement.addEventListener ( 'click', this );
	}

	/**
	click event listener. The button is also it's own event listener.
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		this.#providersToolbar.provider = this.#provider.name;
		theRouter.startRouting ( );
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
			this.#buttonHTMLElement.classList.add ( 'TravelNotes-ProvidersToolbar-ActiveProviderImgButton' );
		}
		else {
			this.#buttonHTMLElement.classList.remove ( 'TravelNotes-ProvidersToolbar-ActiveProviderImgButton' );
		}
	}
}

export default ProviderButton;

/* --- End of file --------------------------------------------------------------------------------------------------------- */