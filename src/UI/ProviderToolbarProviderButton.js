/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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

/**
@------------------------------------------------------------------------------------------------------------------------------

@file ProviderToolbarProviderButton.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module providersToolbarUI

@------------------------------------------------------------------------------------------------------------------------------
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theRouter from '../coreLib/Router.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class ProviderToolbarProviderButton
@classdesc Provider buttons on the ProvidersToolbarUI
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class ProviderToolbarProviderButton {

	/**
	A reference to the toolbar
	@type {HTMLElement}
	*/

	#providerToolbarUI = null;

	/**
	The provider
	@type {BaseRouteProvider}
	*/

	#provider = null;

	/**
	the button HTMLElement
	@type {HTMLElement}
	*/

	#buttonHTMLElement = null;

	/*
	constructor
	@param {ProviderToolbarUI} providerToolbarUI The providerToolbarUI on witch the button will be added
	@param {BaseRouteProvider} provider The provider object linked to the button
	*/

	constructor ( providerToolbarUI, provider ) {

		Object.freeze ( this );

		this.#providerToolbarUI = providerToolbarUI;
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
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		this.#providerToolbarUI.provider = this.#provider.name;
		theRouter.startRouting ( );
	}

	/**
	the button HTMLElements
	@type HTMLElement
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

/*
@------------------------------------------------------------------------------------------------------------------------------

end of ProviderToolbarProviderButton.js file

@------------------------------------------------------------------------------------------------------------------------------
*/