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
	- v4.0.0:
        - created from BaseDialogEventListeners.js
		- Issue ♯38 : Review mouse and touch events on the background div of dialogs
		- Issue #41 : Not possible to move a dialog on touch devices
Doc reviewed 20220828
Tests ...
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
dragend event event listener for the top bar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TopBarDragEndEL {

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
	@param {Event} dragEndEvent The event to handle
	*/

	handleEvent ( dragEndEvent ) {
		this.#mover.moveDialog ( dragEndEvent );
	}
}

export default TopBarDragEndEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */