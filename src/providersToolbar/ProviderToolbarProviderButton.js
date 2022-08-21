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
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210915
Tests ...
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theRouter from '../coreLib/Router.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Provider buttons on the ProvidersToolbarUI
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ProviderToolbarProviderButton {

	/**
	A reference to the toolbar
	@type {HTMLElement}
	*/

	#providersToolbarUI;

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
	@param {ProvidersToolbarUI} providersToolbarUI The providersToolbarUI on witch the button will be added
	@param {BaseRouteProvider} provider The provider object linked to the button
	*/

	constructor ( providersToolbarUI, provider ) {

		Object.freeze ( this );

		this.#providersToolbarUI = providersToolbarUI;
		this.#provider = provider;

		// HTML creation
		this.#buttonHTMLElement = theHTMLElementsFactory.create (
			'img',
			{
				src : provider.icon,
				id : 'TravelNotes-ProvidersToolbarUI-' + provider.name + 'ImgButton',
				className : 'TravelNotes-ProvidersToolbarUI-ImgButton',
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
		this.#providersToolbarUI.provider = this.#provider.name;
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
			this.#buttonHTMLElement.classList.add ( 'TravelNotes-ProvidersToolbarUI-ActiveProviderImgButton' );
		}
		else {
			this.#buttonHTMLElement.classList.remove ( 'TravelNotes-ProvidersToolbarUI-ActiveProviderImgButton' );
		}
	}
}

export default ProviderToolbarProviderButton;

/* --- End of file --------------------------------------------------------------------------------------------------------- */