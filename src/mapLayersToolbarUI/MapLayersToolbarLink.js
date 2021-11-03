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
Doc reviewed 20210913
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file MapLayersToolbarLink.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module mapLayersToolbarUI

@------------------------------------------------------------------------------------------------------------------------------
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class LinkMouseEnterEL
@classdesc mouse enter event listener for the link
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class LinkMouseEnterEL {

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	handleEvent ( mouseEnterEvent ) {
		mouseEnterEvent.stopPropagation ( );
		mouseEnterEvent.target.classList.add ( 'TravelNotes-MapLayersToolbarUI-LinkButton-Enter' );
		mouseEnterEvent.target.classList.remove ( 'TravelNotes-MapLayersToolbarUI-LinkButton-Leave' );
	}
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class LinkMouseLeaveEL
@classdesc mouse leave event listener for the link
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class LinkMouseLeaveEL {

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	handleEvent ( mouseLeaveEvent ) {
		mouseLeaveEvent.stopPropagation ( );
		mouseLeaveEvent.target.classList.add ( 'TravelNotes-MapLayersToolbarUI-LinkButton-Leave' );
		mouseLeaveEvent.target.classList.remove ( 'TravelNotes-MapLayersToolbarUI-LinkButton-Enter' );
	}

}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class MapLayersToolbarLink
@classdesc Link button for the map layers toolbar
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class MapLayersToolbarLink {

	/**
	Event listeners for the buttons
	*/

	#linkMouseEnterEL = null;
	#linkMouseLeaveEL = null;

	/**
	A reference to the link button html element
	*/

	#linkButton = null;

	/*
	constructor
	*/

	constructor ( linkProperties, parentNode ) {

		Object.freeze ( this );

		// HTML creation
		this.#linkButton = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-MapLayersToolbarUI-Button TravelNotes-MapLayersToolbarUI-LinkButton-Leave'
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
	*/

	get height ( ) { return this.#linkButton.clientHeight; }

}

export default MapLayersToolbarLink;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of MapLayersToolbarLink.js file

@------------------------------------------------------------------------------------------------------------------------------
*/