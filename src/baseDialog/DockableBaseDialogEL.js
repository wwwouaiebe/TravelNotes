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
		- created
Doc reviewed ...
Tests ...
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Mouse enter on the dialog event listener. Show the content of the dialog when the dialog is docked
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MouseEnterDockableDialogEL {

	/**
	A reference to the dragData object of the dialog
	@type {DragData}
	*/

	#dragData;

	/**
	The constructor
	@param {DragData} dragData A reference to the dragData object of the dialog
	*/

	constructor ( dragData ) {
		Object.freeze ( this );
		this.#dragData = dragData;
	}

	/**
	Event listener method
	*/

	handleEvent ( ) {
		if ( this.#dragData.dialogHTMLElement.classList.contains ( 'TravelNotes-BaseDialog-OnTop' ) ) {
			for ( const node of this.#dragData.dialogHTMLElement.childNodes ) {
				if ( node.classList.contains ( 'TravelNotes-BaseDialog-ContentHTMLElement' ) ) {
					node.classList.remove ( 'TravelNotes-Hidden' );
				}
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Mouse leave on the dialog event listener. Hide the content of the dialog when the dialog is docked
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MouseLeaveDockableDialogEL {

	/**
	A reference to the dragData object of the dialog
	@type {DragData}
	*/

	#dragData;

	/**
	The constructor
	@param {DragData} dragData A reference to the dragData object of the dialog
	*/

	constructor ( dragData ) {
		Object.freeze ( this );
		this.#dragData = dragData;
	}

	/**
	Event listener method
	*/

	handleEvent ( ) {
		if ( this.#dragData.dialogHTMLElement.classList.contains ( 'TravelNotes-BaseDialog-OnTop' ) ) {
			for ( const node of this.#dragData.dialogHTMLElement.childNodes ) {
				if ( node.classList.contains ( 'TravelNotes-BaseDialog-ContentHTMLElement' ) ) {
					node.classList.add ( 'TravelNotes-Hidden' );
				}
			}
		}
	}
}

export { MouseEnterDockableDialogEL, MouseLeaveDockableDialogEL };

/* --- End of file --------------------------------------------------------------------------------------------------------- */