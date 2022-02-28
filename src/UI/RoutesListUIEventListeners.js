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

import RouteContextMenu from '../contextMenus/RouteContextMenu.js';
import theTravelEditor from '../core/TravelEditor.js';

import { MOUSE_WHEEL_FACTORS } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
dragover event listener for the RoutesList based on the EventListener API.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RoutesListDragOverEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} dragEvent The event to handle
	*/

	handleEvent ( dragEvent ) {
		dragEvent.preventDefault ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
dragstart event listener for the routes based on the EventListener API.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RouteDragStartEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} dragEvent The event to handle
	*/

	handleEvent ( dragEvent ) {
		dragEvent.stopPropagation ( );
		try {
			dragEvent.dataTransfer.setData ( 'ObjId', dragEvent.target.dataset.tanObjId );
			dragEvent.dataTransfer.dropEffect = 'move';
		}
		catch ( err ) {
			if ( err instanceof Error ) {
				console.error ( err );
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
drop event listener for the routes based on the EventListener API.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RouteDropEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} dropEvent The event to handle
	*/

	handleEvent ( dropEvent ) {
		dropEvent.preventDefault ( );
		const targetElement = dropEvent.target;
		const clientRect = targetElement.getBoundingClientRect ( );
		theTravelEditor.routeDropped (
			Number.parseInt ( dropEvent.dataTransfer.getData ( 'ObjId' ) ),
			Number.parseInt ( targetElement.dataset.tanObjId ),
			( dropEvent.clientY - clientRect.top < clientRect.bottom - dropEvent.clientY )
		);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
wheel event listener for the RoutesList based on the EventListener API.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RoutesListWheelEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} wheelEvent The event to handle
	*/

	handleEvent ( wheelEvent ) {
		wheelEvent.stopPropagation ( );
		if ( wheelEvent.deltaY ) {
			wheelEvent.target.scrollTop +=
					wheelEvent.deltaY * MOUSE_WHEEL_FACTORS [ wheelEvent.deltaMode ];
		}
		wheelEvent.stopPropagation ( );
	}

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
contextmenu event listener for the routes based on the EventListener API.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RouteUIContextMenuEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} contextMenuEvent The event to handle
	*/

	handleEvent ( contextMenuEvent ) {
		contextMenuEvent.stopPropagation ( );
		contextMenuEvent.preventDefault ( );
		new RouteContextMenu ( contextMenuEvent, contextMenuEvent.target.parentNode ).show ( );
	}
}

export {
	RouteDragStartEL,
	RouteDropEL,
	RouteUIContextMenuEL,
	RoutesListDragOverEL,
	RoutesListWheelEL
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */