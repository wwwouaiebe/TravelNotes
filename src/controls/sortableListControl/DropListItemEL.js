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
Drop list item event listener
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DropListItemEL {

	/**
	The function to call when an item is droped
	@type {function}
	*/

	#dropFunction;

	/**
	The constructor
	@param {function} dropFunction The function to call when an item is droped
	*/

	constructor ( dropFunction ) {
		Object.freeze ( this );
		this.#dropFunction = dropFunction;
	}

	/**
	Event listener method
	@param {Event} dropEvent The event to handle
	*/

	handleEvent ( dropEvent ) {
		dropEvent.preventDefault ( );
		const clientRect = dropEvent.currentTarget.getBoundingClientRect ( );

		// Try ... catch because a lot of thing can be dragged in the dialog and the drop function
		// throw when an unknown objId is given
		try {
			this.#dropFunction (
				Number.parseInt ( dropEvent.dataTransfer.getData ( 'ObjId' ) ),
				Number.parseInt ( dropEvent.currentTarget.dataset.tanObjId ),
				( dropEvent.clientY - clientRect.top < clientRect.bottom - dropEvent.clientY )
			);
		}

		// eslint-disable-next-line no-empty
		catch { }
	}
}

export default DropListItemEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */