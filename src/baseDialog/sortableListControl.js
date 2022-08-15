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

import DialogControl from '../baseDialog/DialogControl.js';

class DragStartEL {

	constructor ( ) {
		Object.freeze ( this );
	}

	handleEvent ( /* dragStartEvent */ ) {
	}
}

class SortableListControl extends DialogControl {

	#dragStartEL;

	constructor ( ) {
		super ( );
		this.#dragStartEL = new DragStartEL ( );
	}

	set contentHTMLElements ( htmlElements ) {

		htmlElements.forEach (
			htmlElement => {
				htmlElement.draggable = true;
				htmlElement.addEventListener ( 'dragstart', this.#dragStartEL, false );
				this.HTMLElement.appendChild ( htmlElement );
			}
		);
	}

}

export default SortableListControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */