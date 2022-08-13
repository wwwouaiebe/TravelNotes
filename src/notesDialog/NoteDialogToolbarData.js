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

import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';

import { ZERO, ONE, ICON_DIMENSIONS } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Simple container for buttons data of the NoteDialogToolbar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class EditionButtonData {

	/**
	The text to be displayed on the button. Can be HTML
	@type {String}
	*/

	#title;

	/**
	The text to be inserted before the cursor when clicking on the button
	@type {String}
	*/

	#htmlBefore;

	/**
	The text to be inserted after the cursor when clicking on the button. Optional
	@type {String}
	*/

	#htmlAfter;

	/**
	The constructor
	@param {JsonObject} jsonEditionButton A json object with the data for the EditionButton
	*/

	constructor ( jsonEditionButton ) {
		Object.freeze ( this );
		if (
			'string' !== typeof ( jsonEditionButton?.title )
			||
			'string' !== typeof ( jsonEditionButton?.htmlBefore )
			||
			( jsonEditionButton.htmlAfter && 'string' !== typeof ( jsonEditionButton.htmlAfter ) )
		) {
			throw new Error ( 'Invalid toolbar button' );
		}
		let htmlString = ( jsonEditionButton.htmlBefore || '' ) + ( jsonEditionButton.htmlAfter || '' );
		let errorString = theHTMLSanitizer.sanitizeToHtmlString ( htmlString ).errorsString;
		if ( '' === errorString ) {
			this.#title = theHTMLSanitizer.sanitizeToHtmlString ( jsonEditionButton.title ).htmlString;
			if ( '' === this.title ) {
				this.title = '?';
			}
			this.#htmlBefore = jsonEditionButton.htmlBefore || '';
			this.#htmlAfter = jsonEditionButton.htmlAfter || '';
		}
		else {
			throw new Error ( 'Invalid toolbar button : ' + htmlString + errorString );
		}
	}

	/**
	The text to be displayed on the button. Can be HTML
	@type {String}
	*/

	get title ( ) { return this.#title; }

	/**
	The text to be inserted before the cursor when clicking on the button
	@type {String}
	*/

	get htmlBefore ( ) { return this.#htmlBefore; }

	/**
	The text to be inserted after the cursor when clicking on the button. Optional
	@type {String}
	*/

	get htmlAfter ( ) { return this.#htmlAfter; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Simple container for predefined icons data of the NoteDialogToolbar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

// eslint-disable-next-line no-unused-vars
class PredefinedIconData {

	/**
	The name of the predefined icon. This name will be displayed in the select of the NoteDialogToolbar
	@type {String}
	*/

	#name;

	/**
	The html definition of the predefined icon
	@type {String}
	*/

	#icon;

	/**
	The tooltip of the predefined icon
	@type {String}
	*/

	#tooltip;

	/**
	The width of the predefined icon
	@type {Number}
	*/

	#width;

	/**
	The height of the predefined icon
	@type {Number}
	*/

	#height;

	/**
	The constructor
	@param {JsonObject} jsonPredefinedIconData A json object with the data for the predefined icon
	*/

	constructor ( jsonPredefinedIconData ) {
		this.#name =
			'string' === typeof ( jsonPredefinedIconData?.name )
				?
				theHTMLSanitizer.sanitizeToJsString ( jsonPredefinedIconData.name )
				:
				'?';
		this.#icon =
			'string' === typeof ( jsonPredefinedIconData.icon )
				?
				theHTMLSanitizer.sanitizeToHtmlString ( jsonPredefinedIconData?.icon ).htmlString
				:
				'?';
		this.#tooltip =
			'string' === typeof ( jsonPredefinedIconData?.tooltip )
				?
				theHTMLSanitizer.sanitizeToHtmlString ( jsonPredefinedIconData.tooltip ).htmlString
				:
				'?';
		this.#width =
			'number' === typeof ( jsonPredefinedIconData?.width ) ? jsonPredefinedIconData.width : ICON_DIMENSIONS.width;
		this.#height =
			'number' === typeof ( jsonPredefinedIconData?.height ) ? jsonPredefinedIconData.height : ICON_DIMENSIONS.height;
	}

	/**
	The name of the predefined icon. This name will be displayed in the select of the NoteDialog
	@type {String}
	*/

	get name ( ) { return this.#name; }

	/**
	The html definition of the predefined icon
	@type {String}
	*/

	get icon ( ) { return this.#icon; }

	/**
	The tooltip of the predefined icon
	@type {String}
	*/

	get tooltip ( ) { return this.#tooltip; }

	/**
	The width of the predefined icon
	@type {Number}
	*/

	get width ( ) { return this.#width; }

	/**
	The height of the predefined icon
	@type {Number}
	*/

	get height ( ) { return this.#height; }

}

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