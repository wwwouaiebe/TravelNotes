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
BaseDialog drag over event listener based on the EventListener API.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BackgroundDragOverEL {

	/**
	A reference to the mover object of the dialog
	@type {BaseDialogMover|DockableBaseDialogMover}
	*/

	#mover;

	/**
	The constructor
	@param {BaseDialogMover|DockableBaseDialogMover} mover A reference to the mover object of the dialog
	*/

	constructor ( mover ) {
		Object.freeze ( this );
		this.#mover = mover;
	}

	/**
	Event listener method
	@param {Event} dragEvent The event to handle
	*/

	handleEvent ( dragEvent ) {
		dragEvent.preventDefault ( );
		if ( Number.parseInt ( dragEvent.dataTransfer.getData ( 'ObjId' ) ) !== this.#mover.objId ) {

			// A lot of things can be dragged on the background and then receive the dragover event. Before moving the dialog,
			// we have to verify that it's the correct dialog and not something else like notes, routes or others dialog...
			return;
		}
		dragEvent.stopPropagation ( );
		this.#mover.moveDialog ( dragEvent );
	}
}

export default BackgroundDragOverEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */