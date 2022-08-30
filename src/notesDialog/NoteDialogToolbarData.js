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
Doc reviewed 20210914
Tests ...
*/

import { ZERO, ONE } from '../main/Constants.js';
import PredefinedIconData from '../notesDialog/PredefinedIconData.js';
import EditionButtonData from '../notesDialog/EditionButtonData.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is a container for the edition buttons data and predefined icons data
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteDialogToolbarData {

	/**
	The additional buttons defined in the TravelNotesDialogXX.json file or a file loaded by the user
	@type {Array.<EditionButtonData>}
	*/

	#editionButtonsData;

	/**
	A map with the additional icons defined in the TravelNotesDialogXX.json file or a file loaded by the user, ordered by name
	@type {Map.<PredefinedIconData>}
	*/

	#preDefinedIconsDataMap;

	/**
	The additional icons defined in the TravelNotesDialogXX.json file or a file loaded by the user
	@type {Array.<PredefinedIconData>}
	*/

	#preDefinedIconsDataArray;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#editionButtonsData = [];
		this.#preDefinedIconsDataMap = new Map ( );
		this.#preDefinedIconsDataArray = [];
	}

	/**
	The additional buttons defined in the TravelNotesDialogXX.json file or a file loaded by the user
	@type {Array.<EditionButtonData>}
	*/

	get editionButtonsData ( ) { return this.#editionButtonsData; }

	/**
	The additional icons defined in the TravelNotesDialogXX.json file or a file loaded by the user
	@type {Array.<PredefinedIconData>}
	*/

	get preDefinedIconsData ( ) {
		return this.#preDefinedIconsDataArray;
	}

	/**
	get and icon from the icon position in the array
	@param {Number} index The icon index in the array
	@return {PredefinedIconData} The predefinedIconData at the given index
	*/

	preDefinedIconDataAt ( index ) {
		return this.#preDefinedIconsDataArray [ index ];
	}

	/**
	get an icon from the icon name
	@param {String} iconName The icon name
	@return {PredefinedIconData} The predefinedIconData with the name equal to the given name
	*/

	preDefinedIconDataFromName ( iconName ) {
		const preDefinedIcon = this.#preDefinedIconsDataMap.get ( iconName );
		return preDefinedIcon ? preDefinedIcon.icon : '';
	}

	/**
	Load a json file with predefined icons and / or edition buttons
	@param {JsonObject} jsonData The file content after JSON.parse ( )
	*/

	loadJson ( jsonData ) {
		if ( jsonData.editionButtons ) {
			jsonData.editionButtons.forEach (
				jsonEditionButtonData => {
					try {
						let editionButtonData = new EditionButtonData ( jsonEditionButtonData );
						this.#editionButtonsData.push ( editionButtonData );
					}
					catch ( err ) {
						console.error ( err.message );
					}
				}
			);
		}
		if ( jsonData.preDefinedIconsList ) {
			jsonData.preDefinedIconsList.forEach (
				jsonPredefinedIconData => {
					const predefinedIconData = new PredefinedIconData ( jsonPredefinedIconData );
					this.#preDefinedIconsDataMap.set ( predefinedIconData.name, predefinedIconData );
				}
			);

			this.#preDefinedIconsDataArray.length = ZERO;
			for ( const element of this.#preDefinedIconsDataMap ) {
				this.#preDefinedIconsDataArray.push ( element [ ONE ] );
			}
			this.#preDefinedIconsDataArray = this.#preDefinedIconsDataArray.sort (
				( first, second ) => first.name.localeCompare ( second.name )
			);
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of NoteDialogToolbarData class
@type {NoteDialogToolbarData}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theNoteDialogToolbarData = new NoteDialogToolbarData ( );

export default theNoteDialogToolbarData;

/* --- End of file --------------------------------------------------------------------------------------------------------- */