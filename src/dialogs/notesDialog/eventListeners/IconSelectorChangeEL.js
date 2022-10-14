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
		- created from v3.6.0
Doc reviewed 202208
 */

import theTranslator from '../../../core/uiLib/Translator.js';
import theNoteDialogToolbarData from '../toolbar/NoteDialogToolbarData.js';
import MapIconFromOsmFactory from '../../../core/mapIcon/MapIconFromOsmFactory.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
change event listener for the icon selector
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class IconSelectorChangeEL {

	/**
	A reference to the NoteDialog object
	@type {NoteDialog}
	*/

	#noteDialog;

	/**
	Helper method for the onIconSelectChange mehod
	@param {Object} noteData An object with the note properties to update
	*/

	#updatePreviewAndControls ( noteData )	{
		this.#noteDialog.setControlsValues ( noteData );
		this.#noteDialog.updatePreview ( noteData );
	}

	/**
	Svg Map icon creation
	*/

	#onMapIcon ( ) {
		const mapIconData = this.#noteDialog.mapIconData;
		if ( ! mapIconData.route ) {
			this.#noteDialog.showError (
				theTranslator.getText ( 'IconSelectorChangeEL - not possible to create a SVG icon for a travel note' )
			);
			return;
		}

		this.#noteDialog.hideError ( );
		this.#noteDialog.showWait ( );
		new MapIconFromOsmFactory ( ).getIconAndAdressWithPromise ( mapIconData )
			.then (
				noteData => {
					this.#noteDialog.hideWait ( );
					this.#updatePreviewAndControls ( noteData );
				}
			)
			.catch (
				err => {
					if ( err instanceof Error ) {
						console.error ( err );
					}
					this.#noteDialog.hideWait ( );
					this.#noteDialog.showError (
						theTranslator.getText ( 'IconSelectorChangeEL - an error occurs when creating the SVG icon' )
					);
				}
			);
	}

	/**
	The constructor
	@param {NoteDialog} noteDialog A reference to the Notedialog object
	*/

	constructor ( noteDialog ) {
		Object.freeze ( this );
		this.#noteDialog = noteDialog;
	}

	/**
	Event listener method
	@param {Event} changeEvent The event to handle
	*/

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		const preDefinedIcon = theNoteDialogToolbarData.preDefinedIconDataAt ( changeEvent.target.selectedIndex );
		if ( 'SvgIcon' === preDefinedIcon.icon ) {
			this.#onMapIcon ( );
			return;
		}
		this.#updatePreviewAndControls (
			{
				iconContent : preDefinedIcon.icon,
				iconHeight : preDefinedIcon.height,
				iconWidth : preDefinedIcon.width,
				tooltipContent : preDefinedIcon.tooltip
			}
		);
		this.#noteDialog.setAddress ( );
	}
}

export default IconSelectorChangeEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */