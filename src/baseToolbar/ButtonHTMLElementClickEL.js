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
Doc reviewed 20220828
Tests ...
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the toolbar buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ButtonHTMLElementClickEL {

	/**
	A reference to the toolbarItemsContainer of the BaseToolbar class
	@type {ToolbarItemsContainer}
	*/

	#toolbarItemsContainer;

	/**
	The constructor
	@param {ToolbarItemsContainer} toolbarItemsContainer A reference to the toolbarItemsContainer
	of the BaseToolbar class object
	*/

	constructor ( toolbarItemsContainer ) {
		Object.freeze ( this );
		this.#toolbarItemsContainer = toolbarItemsContainer;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		this.#toolbarItemsContainer.toolbarItemsArray [ Number.parseInt ( clickEvent.target.dataset.tanItemId ) ]
			.action ( );
	}
}

export default ButtonHTMLElementClickEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */