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
	- v4.0.0:
       - created from BaseDialogEventListeners.js
		- Issue ♯38 : Review mouse and touch events on the background div of dialogs
		- Issue #41 : Not possible to move a dialog on touch devices
Doc reviewed 20210914
Tests ...
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
contextmenu event listener for the background
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BackgroundContextMenuEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} contextmenuEvent The event to handle
	*/

	handleEvent ( contextmenuEvent ) {
		contextmenuEvent.preventDefault ( );
	}
}

export default BackgroundContextMenuEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */