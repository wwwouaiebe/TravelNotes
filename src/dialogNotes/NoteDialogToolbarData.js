/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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

/*---------------------------------------------------------------------------------------------------------------------------*/
/**
This class is a container for the edition buttons and predefined icons
*/
/*---------------------------------------------------------------------------------------------------------------------------*/

class NoteDialogToolbarData {

	/**
	The additional buttons defined in the TravelNotesDialogXX.json file or a file loaded by the user
	@type {Array.<NoteDialogToolbarButton>}
	*/

	#editionButtons = [];

	/**
	A map with the additional icons defined in the TravelNotesDialogXX.json file or a file loaded by the user, ordered by name
	@type {Map.<NoteDialogToolbarSelectOption>}
	*/

	#preDefinedIconsMap = new Map ( );

	/**
	The additional icons defined in the TravelNotesDialogXX.json file or a file loaded by the user
	@type {Array.<NoteDialogToolbarSelectOption>}
	*/

	#preDefinedIcons = [];

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#editionButtons = [];
		this.#preDefinedIconsMap = new Map ( );
		this.#preDefinedIcons = [];
	}

	/**
	The additional buttons defined in the TravelNotesDialogXX.json file or a file loaded by the user
	@type {Array.<NoteDialogToolbarButton>}
	*/

	get buttons ( ) { return this.#editionButtons; }

	/**
	The additional icons defined in the TravelNotesDialogXX.json file or a file loaded by the user
	@type {Array.<NoteDialogToolbarSelectOption>}
	*/

	get icons ( ) {
		return this.#preDefinedIcons;
	}

	/**
	get and icon from the icon position in the array
	@param {Number} index The icon index in the array
	*/

	getIconData ( index ) {
		return this.#preDefinedIcons [ index ];
	}

	/**
	get an icon from the icon name
	@param {String} iconName The icon name
	*/

	getIconContentFromName ( iconName ) {
		const preDefinedIcon = this.#preDefinedIconsMap.get ( iconName );
		return preDefinedIcon ? preDefinedIcon.icon : '';
	}

	/**
	Load a json file with predefined icons and / or edition buttons
	@param {NoteDialogCfgFileContent} jsonData The file content after JSON.parse ( )
	*/

	loadJson ( jsonData ) {
		if ( jsonData.editionButtons ) {
			jsonData.editionButtons.forEach (
				editionButton => {
					let htmlString = ( editionButton.htmlBefore || '' ) + ( editionButton.htmlAfter || '' );
					let errorsString = theHTMLSanitizer.sanitizeToHtmlString ( htmlString ).errorsString;
					if ( '' === errorsString ) {
						this.#editionButtons.push ( editionButton );
					}
					else {
						console.error ( 'Invalid editionButton : ' + htmlString + ' ' + errorsString );
					}
				}
			);
		}
		if ( jsonData.preDefinedIconsList ) {
			jsonData.preDefinedIconsList.forEach (
				predefinedIcon => {
					predefinedIcon.name =
						'string' === typeof ( predefinedIcon.name )
							?
							theHTMLSanitizer.sanitizeToJsString ( predefinedIcon.name )
							:
							'?';
					predefinedIcon.icon =
						'string' === typeof ( predefinedIcon.icon )
							?
							theHTMLSanitizer.sanitizeToHtmlString ( predefinedIcon.icon ).htmlString
							:
							'?';
					predefinedIcon.tooltip =
						'string' === typeof ( predefinedIcon.tooltip )
							?
							theHTMLSanitizer.sanitizeToHtmlString ( predefinedIcon.tooltip ).htmlString
							:
							'?';
					predefinedIcon.width =
						'number' === typeof ( predefinedIcon.width ) ? predefinedIcon.width : ICON_DIMENSIONS.width;
					predefinedIcon.height =
						'number' === typeof ( predefinedIcon.height ) ? predefinedIcon.height : ICON_DIMENSIONS.height;
					this.#preDefinedIconsMap.set ( predefinedIcon.name, predefinedIcon );
				}
			);
			this.#preDefinedIcons.length = ZERO;
			for ( const element of this.#preDefinedIconsMap ) {
				this.#preDefinedIcons.push ( element [ ONE ] );
			}
			this.#preDefinedIcons = this.#preDefinedIcons.sort (
				( first, second ) => first.name.localeCompare ( second.name )
			);
		}
	}
}

/*---------------------------------------------------------------------------------------------------------------------------*/
/**
The one and only one instance of NoteDialogToolbarData class
@type {NoteDialogToolbarData}
*/
/*---------------------------------------------------------------------------------------------------------------------------*/

const theNoteDialogToolbarData = new NoteDialogToolbarData ( );

export default theNoteDialogToolbarData;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of NoteDialogToolbarData.js file
*/
/*---------------------------------------------------------------------------------------------------------------------------*/