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
Doc reviewed 20210913
Tests ...
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouse enter event listener for the link
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class LinkMouseEnterEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} mouseEnterEvent The event to handle
	*/

	handleEvent ( mouseEnterEvent ) {
		mouseEnterEvent.stopPropagation ( );
		mouseEnterEvent.target.classList.add ( 'TravelNotes-MapLayersToolbarUI-LinkButton-Enter' );
		mouseEnterEvent.target.classList.remove ( 'TravelNotes-MapLayersToolbarUI-LinkButton-Leave' );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouse leave event listener for the link
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class LinkMouseLeaveEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} mouseLeaveEvent The event to handle
	*/

	handleEvent ( mouseLeaveEvent ) {
		mouseLeaveEvent.stopPropagation ( );
		mouseLeaveEvent.target.classList.add ( 'TravelNotes-MapLayersToolbarUI-LinkButton-Leave' );
		mouseLeaveEvent.target.classList.remove ( 'TravelNotes-MapLayersToolbarUI-LinkButton-Enter' );
	}

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Link button for the map layers toolbar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MapLayersToolbarLink {

	/**
	Mouseenter event listener
	@type {LinkMouseEnterEL}
	*/

	#linkMouseEnterEL;

	/**
	Mouseenter event listener
	@type {LinkMouseLeaveEL}
	*/

	#linkMouseLeaveEL;

	/**
	The button with the link
	@type {HTMLElement}
	*/

	#linkButton;

	/**
	The constructor
	@param {Object} linkProperties An object with the buttons properties (href, title, textContent and target)
	@param {HTMLElement} parentNode The buttons container
	*/

	constructor ( linkProperties, parentNode ) {

		Object.freeze ( this );

		// HTML creation
		this.#linkButton = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-MapLayersToolbarUI-LinkButton TravelNotes-MapLayersToolbarUI-LinkButton-Leave'
			},
			parentNode
		);
		theHTMLElementsFactory.create ( 'a', linkProperties, this.#linkButton );

		// events listeners
		this.#linkMouseEnterEL = new LinkMouseEnterEL ( );
		this.#linkMouseLeaveEL = new LinkMouseLeaveEL ( );
		this.#linkButton.addEventListener ( 'mouseenter', this.#linkMouseEnterEL, false );
		this.#linkButton.addEventListener ( 'mouseleave', this.#linkMouseLeaveEL, false );
	}

	/**
	destructor. Remove event listeners.
	*/

	destructor ( ) {
		this.#linkButton.removeEventListener ( 'mouseenter', this.#linkMouseEnterEL, false );
		this.#linkButton.removeEventListener ( 'mouseleave', this.#linkMouseLeaveEL, false );
	}

	/**
	The height of the button
	@type {Number}
	*/

	get height ( ) { return this.#linkButton.clientHeight; }

}

export default MapLayersToolbarLink;

/* --- End of file --------------------------------------------------------------------------------------------------------- */