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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class performs the updates of the roadbook after changes in the Travel
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RoadbookUpdater {

	/**
	The HTMLElement in witch the roadbook content is placed
	@type {HTMLElement}
	*/

	#travelNotesHtmlElement;

	/**
	The visibility status of the travel notes
	@type {Boolean}
	*/

	#showTravelNotes;

	/**
	The visibility status of the route notes
	@type {Boolean}
	*/

	#showRouteNotes;

	/**
	The visibility status of the maneuver notes
	@type {Boolean}
	*/

	#showManeuversNotes;

	/**
	The visibility status of the small notes
	@type {Boolean}
	*/

	#showSmallNotes;

	/**
	The visibility status of the profiles
	@type {Boolean}
	*/

	#showProfiles;

	/**
	Show or hide the notes
	@param {String} selector The css selector for the notes to show/hide
	@param {Boolean} show A flag indicating when the note have to be showed
	*/

	#toggleNotes ( selector, show ) {
		document.querySelectorAll ( selector ).forEach (
			note => {
				if ( show ) {
					note.classList.remove ( 'TravelNotes-Hidden' );
				}
				else {
					note.classList.add ( 'TravelNotes-Hidden' );
				}
			}
		);
	}

	/**
	Show or hide the profiles
	@param {Boolean} show A flag indicating when the profiles have to be showed
	*/

	#toggleProfiles ( show ) {
		document.querySelectorAll ( '.TravelNotes-Roadbook-RouteProfile' ).forEach (
			profile => {
				if ( show ) {
					profile.classList.remove ( 'TravelNotes-Hidden' );
				}
				else {
					profile.classList.add ( 'TravelNotes-Hidden' );
				}
			}
		);
	}

	/**
	Show or hide the small notes
	@param {Boolean} small A flag indicating when the note have to be small
	*/

	#toggleSmallNotes ( small ) {
		if ( small ) {
			this.#travelNotesHtmlElement.classList.add ( 'TravelNotes-SmallNotes' );
			this.#travelNotesHtmlElement.classList.remove ( 'TravelNotes-BigNotes' );
		}
		else {
			this.#travelNotesHtmlElement.classList.add ( 'TravelNotes-BigNotes' );
			this.#travelNotesHtmlElement.classList.remove ( 'TravelNotes-SmallNotes' );
		}
		document.querySelectorAll (
			'.TravelNotes-Roadbook-Travel-Notes-IconCell, .TravelNotes-Roadbook-Route-ManeuversAndNotes-IconCell'
		).forEach (
			icon => {
				icon.style.width = small ? '6cm' : icon.dataset.tanWidth;
				icon.style.height = small ? '6cm' : icon.dataset.tanHeight;
			}
		);
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#travelNotesHtmlElement = document.getElementById ( 'TravelNotes' );
		this.#showTravelNotes = true;
		this.#showRouteNotes = true;
		this.#showManeuversNotes = false;
		this.#showSmallNotes = false;
		this.#showProfiles = true;
	}

	/**
	The visibility status of the travel notes
	@type {Boolean}
	*/

	get showTravelNotes ( ) { return this.#showTravelNotes; }
	set showTravelNotes ( show ) {
		this.#showTravelNotes = show;
		this.#toggleNotes ( '.TravelNotes-Roadbook-Travel-Notes-Row', show );
	}

	/**
	The visibility status of the route notes
	@type {Boolean}
	*/

	get showRouteNotes ( ) { return this.#showRouteNotes; }
	set showRouteNotes ( show ) {
		this.#showRouteNotes = show;
		this.#toggleNotes ( '.TravelNotes-Roadbook-Route-Notes-Row', show );
	}

	/**
	The visibility status of the maneuver notes
	@type {Boolean}
	*/

	get showManeuversNotes ( ) { return this.#showManeuversNotes; }
	set showManeuversNotes ( show ) {
		this.#showManeuversNotes = show;
		this.#toggleNotes ( '.TravelNotes-Roadbook-Route-Maneuvers-Row', show );
	}

	/**
	The visibility status of the small notes
	@type {Boolean}
	*/

	get showSmallNotes ( ) { return this.#showSmallNotes; }
	set showSmallNotes ( small ) {
		this.#showSmallNotes = small;
		this.#toggleSmallNotes ( small );
	}

	/**
	The visibility status of the profiles
	@type {Boolean}
	*/

	get showProfiles ( ) { return this.#showProfiles; }
	set showProfiles ( show ) {
		this.#showProfiles = show;
		this.#toggleProfiles ( show );
	}

	/**
	Update the notes visibility
	*/

	updateNotesAndProfiles ( ) {
		this.showTravelNotes = this.#showTravelNotes;
		this.showRouteNotes = this.#showRouteNotes;
		this.showManeuversNotes = this.#showManeuversNotes;
		this.showSmallNotes = this.#showSmallNotes;

		this.showProfiles = this.#showProfiles;
	}

	/**
	Updating roadbook
	@param {String} pageContent An html string with the travel, routes and notes
	*/

	updateRoadbook ( pageContent ) {
		this.#travelNotesHtmlElement.innerHTML = pageContent;
		const headerName = document.querySelector ( '.TravelNotes-Roadbook-Travel-Header-Name' );
		if ( headerName ) {
			document.title =
				'' === headerName.textContent ? 'roadbook' : headerName.textContent + ' - roadbook';
		}

		// when CSP is enabled, it's needed to set width and height with JS to avoid to add an 'unsafe-inline' for style in CSP
		document.querySelectorAll (
			'.TravelNotes-Roadbook-Travel-Notes-IconCell, .TravelNotes-Roadbook-Route-ManeuversAndNotes-IconCell'
		).forEach (
			icon => {
				icon.style.width = icon.dataset.tanWidth;
				icon.style.height = icon.dataset.tanHeight;
			}
		);

		this.updateNotesAndProfiles ( );
	}

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of RoadbookUpdater class
@type {RoadbookUpdater}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theRoadbookUpdater = new RoadbookUpdater ( );

export default theRoadbookUpdater;

/* --- End of file --------------------------------------------------------------------------------------------------------- */