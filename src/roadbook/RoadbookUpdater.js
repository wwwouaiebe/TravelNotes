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

@file RoadbookUpdater.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module roadbook
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@class RoadbookUpdater
@classdesc coming soon...
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class RoadbookUpdater {

	#travelNotesHtmlElement = document.getElementById ( 'TravelNotes' );

	#showTravelNotes = true;

	#showRouteNotes = true;

	#showManeuversNotes = false;

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

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	get showTravelNotes ( ) { return this.#showTravelNotes; }
	set showTravelNotes ( show ) {
		this.#showTravelNotes = show;
		this.#toggleNotes ( '.TravelNotes-Roadbook-Travel-Notes-Row', show );
	}

	get showRouteNotes ( ) { return this.#showRouteNotes; }
	set showRouteNotes ( show ) {
		this.#showRouteNotes = show;
		this.#toggleNotes ( '.TravelNotes-Roadbook-Route-Notes-Row', show );
	}

	get showManeuversNotes ( ) { return this.#showManeuversNotes; }
	set showManeuversNotes ( show ) {
		this.#showManeuversNotes = show;
		this.#toggleNotes ( '.TravelNotes-Roadbook-Route-Maneuvers-Row', show );
	}

	updateNotes ( ) {
		this.showTravelNotes = this.#showTravelNotes;
		this.showRouteNotes = this.#showRouteNotes;
		this.showManeuversNotes = this.#showManeuversNotes;
	}

	/**
	Updating roadbook
	*/

	updateRoadbook ( pageContent ) {
		this.#travelNotesHtmlElement.innerHTML = pageContent;
		const headerName = document.querySelector ( '.TravelNotes-Roadbook-Travel-Header-Name' );
		if ( headerName ) {
			document.title =
				'' === headerName.textContent ? 'roadbook' : headerName.textContent + ' - roadbook';
		}
		this.updateNotes ( );
	}

}

/**
@------------------------------------------------------------------------------------------------------------------------------

@desc The one and only one instance of RoadbookUpdater class
@type {RoadbookUpdater}
@constant
@global

@------------------------------------------------------------------------------------------------------------------------------
*/

const theRoadbookUpdater = new RoadbookUpdater ( );

export default theRoadbookUpdater;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of RoadbookUpdater.js file

@------------------------------------------------------------------------------------------------------------------------------
*/