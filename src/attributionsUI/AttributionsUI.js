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
	- v1.6.0:
		- created
	- v1.9.0:
		- Issue ♯103 : Review the attributions
	- v2.0.0:
		- Issue ♯135 : Remove innerHTML from code
		- Issue ♯136 : Remove html entities from js string
		- Issue ♯138 : Protect the app - control html entries done by user.
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Show the attributons of the current map, OpenStreetMap, leaflet and TravelNotes.
See theAttributionsUI for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class AttributionsUI {

	/**
	The root HTMLElement of the UI
	@type {HTMLElement}
	*/

	#mainHTMLElement = null;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	creates the Attributions UI.
	*/

	createUI ( ) {
		this.#mainHTMLElement = theHTMLElementsFactory.create ( 'div', { id : 'TravelNotes-AttributionsUI' }, document.body );
	}

	/**
	Add/replace the given map attributions to the UI. Leaflet, OpenStreetMap and TravelNotes are always credited.
	*/

	set attributions ( attributions ) {
		const attributionsString =
			'© <a href="https://leafletjs.com/" target="_blank" title="Leaflet">Leaflet</a> ' +
			'| © <a href="https://www.openstreetmap.org/copyright" target="_blank" ' +
			'title="OpenStreetMap contributors">OpenStreetMap contributors</a> ' +
			attributions +
			'| © <a href="https://github.com/wwwouaiebe" target="_blank" ' +
			'title="https://github.com/wwwouaiebe">Travel & Notes</a>';

		while ( this.#mainHTMLElement.firstChild ) {
			this.#mainHTMLElement.removeChild ( this.#mainHTMLElement.firstChild );
		}
		theHTMLSanitizer.sanitizeToHtmlElement ( attributionsString, this.#mainHTMLElement );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of AttributionsUI class
@type {AttributionsUI}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theAttributionsUI = new AttributionsUI ( );

export default theAttributionsUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */