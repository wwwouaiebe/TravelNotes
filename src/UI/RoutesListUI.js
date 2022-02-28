/*
Copyright - 2017 2022 - wwwouaiebe - Contact: http//www.ouaie.be/

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

import theTravelNotesData from '../data/TravelNotesData.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import {
	RouteDragStartEL,
	RouteDropEL,
	RouteUIContextMenuEL,
	RoutesListDragOverEL,
	RoutesListWheelEL
} from '../UI/RoutesListUIEventListeners.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the Routes List part of the UI
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RoutesListUI {

	/**
	The route list HTMLElement
	@type {HTMLElement}
	*/

	#routesListHTMLElement;

	/**
	Route contextmenu event listeners
	@type {RouteUIContextMenuEL}
	*/

	#routeUIContextMenuEL;

	/**
	Route drop event listeners
	@type {RouteDropEL}
	*/

	#routeDropEL;

	/**
	Route dragstart event listeners
	@type {RouteDropEL}
	*/

	#routeDragStartEL;

	/**
	The constructor
	@param {HTMLElement} UIMainHTMLElement The HTMLElement in witch the RouteList must be added
	*/

	constructor ( UIMainHTMLElement ) {

		Object.freeze ( this );

		// container creation
		this.#routesListHTMLElement = theHTMLElementsFactory.create (
			'div',
			{ className : 'TravelNotes-TravelUI-RoutesListDiv' },
			UIMainHTMLElement
		);

		// event listeners
		this.#routesListHTMLElement.addEventListener ( 'dragover', new RoutesListDragOverEL ( ) );
		this.#routesListHTMLElement.addEventListener ( 'wheel', new RoutesListWheelEL ( ), { passive : true } );
		this.#routeUIContextMenuEL = new RouteUIContextMenuEL ( );
		this.#routeDropEL = new RouteDropEL ( );
		this.#routeDragStartEL = new RouteDragStartEL ( );
	}

	/**
	Toogle the visibility of the routes list
	*/

	toogleExpand ( ) {
		this.#routesListHTMLElement.classList.toggle ( 'TravelNotes-Hidden' );
		return this.#routesListHTMLElement.classList.contains ( 'TravelNotes-Hidden' );
	}

	/**
	Removes all routes from the routes list and add the routes that are in the TravelNotesData.travel object
	*/

	setRoutesList ( ) {

		// Removing old routes
		while ( this.#routesListHTMLElement.firstChild ) {
			this.#routesListHTMLElement.firstChild.removeEventListener ( 'dragstart', this.#routeDragStartEL );
			this.#routesListHTMLElement.firstChild.removeEventListener ( 'drop', this.#routeDropEL );
			this.#routesListHTMLElement.firstChild.removeEventListener ( 'contextmenu', this.#routeUIContextMenuEL );
			this.#routesListHTMLElement.removeChild ( this.#routesListHTMLElement.firstChild );
		}

		// Adding new routes
		const routesIterator = theTravelNotesData.travel.routes.iterator;
		while ( ! routesIterator.done ) {
			const route = routesIterator.value.objId === theTravelNotesData.editedRouteObjId
				?
				theTravelNotesData.travel.editedRoute
				:
				routesIterator.value;

			const routeName =
				( routesIterator.value.objId === theTravelNotesData.editedRouteObjId ? '🔴\u00a0' : '' ) +
				( route.chain ? '⛓\u00a0' : '' ) +
				(
					routesIterator.value.objId === theTravelNotesData.editedRouteObjId ?
						theTravelNotesData.travel.editedRoute.computedName :
						route.computedName
				);

			const routeHTMLElement = theHTMLElementsFactory.create (
				'div',
				{
					draggable : true,
					className :
						'TravelNotes-TravelUI-RoutesList-Item TravelNotes-UI-MoveCursor' +
						( routesIterator.value.hidden ? ' TravelNotes-TravelUI-RoutesList-HiddenItem' : '' ),
					dataset : { ObjId : route.objId },
					textContent : routeName
				},
				this.#routesListHTMLElement
			);

			routeHTMLElement.addEventListener ( 'dragstart', this.#routeDragStartEL );
			routeHTMLElement.addEventListener ( 'drop', this.#routeDropEL );
			routeHTMLElement.addEventListener ( 'contextmenu', this.#routeUIContextMenuEL );
		}
	}
}

export default RoutesListUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */