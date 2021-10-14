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

@file RoutesListUIEventListeners.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module travelUI
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

import RouteContextMenu from '../contextMenus/RouteContextMenu.js';
import theTravelEditor from '../core/TravelEditor.js';

import { MOUSE_WHEEL_FACTORS } from '../main/Constants.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class RoutesListDragOverEL
@classdesc dragover event listener for the RoutesList based on the EventListener API.
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class RoutesListDragOverEL {

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	*/

	handleEvent ( dragEvent ) {
		dragEvent.preventDefault ( );
	}
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class RouteDragStartEL
@classdesc dragstart event listener for the routes based on the EventListener API.
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class RouteDragStartEL {

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
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

/**
@------------------------------------------------------------------------------------------------------------------------------

@class RouteDropEL
@classdesc drop event listener for the routes based on the EventListener API.
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class RouteDropEL {

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
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

/**
@------------------------------------------------------------------------------------------------------------------------------

@class RoutesListWheelEL
@classdesc wheel event listener for the RoutesList based on the EventListener API.
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class RoutesListWheelEL {

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
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

/**
@------------------------------------------------------------------------------------------------------------------------------

@class RouteContextMenuEL
@classdesc contextmenu event listener for the routes based on the EventListener API.
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class RouteContextMenuEL {

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
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
	RouteContextMenuEL,
	RoutesListDragOverEL,
	RoutesListWheelEL
};

/*
@------------------------------------------------------------------------------------------------------------------------------

end of RoutesListUIEventListeners.js file

@------------------------------------------------------------------------------------------------------------------------------
*/