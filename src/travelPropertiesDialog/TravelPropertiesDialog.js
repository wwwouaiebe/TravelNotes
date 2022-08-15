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

import DockableBaseDialog from '../baseDialog/DockableBaseDialog.js';
import TextInputControl from '../baseDialog/TextInputControl.js';
import theTranslator from '../UILib/Translator.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import SortableListControl from '../baseDialog/sortableListControl.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theTravelEditor from '../core/TravelEditor.js';
import RouteContextMenu from '../contextMenus/RouteContextMenu.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the TravelPropertiesDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelPropertiesDialog extends DockableBaseDialog {

	/**
	The travel name control
	@type {TextInputControl}
	*/

	#travelNameControl;

	/**
	The routes control
	@type {SortableListControl}
	*/

	#travelRoutesControl;

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
		this.#travelNameControl = new TextInputControl ( theTranslator.getText ( 'TravelPropertiesDialog - Name' ) );
		this.#travelNameControl.value = theTravelNotesData.travel.name;
		this.#travelRoutesControl = new SortableListControl ( theTravelEditor.routeDropped, RouteContextMenu );
	}

	/**
	Overload of the BaseDialog.onCancel ( ) method.
	*/

	/**
	An array with the HTMLElements that have to be added in the content of the dialog.
	Overload of the BaseDialog contentHTMLElements property.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [ ].concat (
			this.#travelNameControl.HTMLElement,
			this.#travelRoutesControl.HTMLElement
		);
	}

	/**
	The dialog title. Overload of the BaseDialog.title property
	@type {String}
	*/

	get title ( ) { return theTranslator.getText ( 'TravelPropertiesDialog - Travel properties' ); }

	updateContent ( ) {
		const contentHTMLElements = [];
		theTravelNotesData.travel.routes.forEach (
			route => {
				contentHTMLElements.push (
					theHTMLElementsFactory.create (
						'div',
						{
							textContent : route.computedName,
							dataset : { ObjId : String ( route.objId ) }
						}
					)
				);
			}
		);
		this.#travelRoutesControl.updateContent ( contentHTMLElements );
	}
}

const theTravelPropertiesDialog = new TravelPropertiesDialog ( );

export default theTravelPropertiesDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */