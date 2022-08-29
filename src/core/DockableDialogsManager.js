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
Doc reviewed 20220829
Tests ...
*/

import OsmSearchDialog from '../osmSearchDialog/OsmSearchDialog.js';
import TravelPropertiesDialog from '../travelPropertiesDialog/TravelPropertiesDialog.js';
import TravelNotesDialog from '../travelNotesDialog/TravelNotesDialog.js';
import theConfig from '../data/Config.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class manages the dockable dialogs.
We cannot create the dockable dialogs as global objects because it's needed that the translations are loaded before
creating the dialogs.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DockableDialogsManager {

	/**
	The one and only one instance of OsmSearchDialog
	@type {OsmSearchDialog}
	*/

	#osmSearchDialog = null;

	/**
	The one and only one instance of TravelPropertiesDialog
	@type {TravelPropertiesDialog}
	*/

	#travelPropertiesDialog = null;

	/**
	The one and only one instance of TravelNotesDialog
	@type {TravelPropertiesDialog}
	*/

	#travelNotesDialog = null;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	The one and only one instance of OsmSearchDialog
	@type {OsmSearchDialog}
	*/

	get osmSearchDialog ( ) {
		if ( ! this.#osmSearchDialog ) {
			this.#osmSearchDialog = new OsmSearchDialog (
				theConfig.osmSearchDialog.dialogX,
				theConfig.osmSearchDialog.dialogY
			);
		}
		return this.#osmSearchDialog;
	}

	/**
	The one and only one instance of TravelPropertiesDialog
	@type {TravelPropertiesDialog}
	*/

	get travelPropertiesDialog ( ) {
		if ( ! this.#travelPropertiesDialog ) {
			this.#travelPropertiesDialog = new TravelPropertiesDialog (
				theConfig.travelPropertiesDialog.dialogX,
				theConfig.travelPropertiesDialog.dialogY
			);
		}
		return this.#travelPropertiesDialog;
	}

	/**
	The one and only one instance of TravelPropertiesDialog
	@type {TravelPropertiesDialog}
	*/

	get travelNotesDialog ( ) {
		if ( ! this.#travelNotesDialog ) {
			this.#travelNotesDialog = new TravelNotesDialog (
				theConfig.travelNotesDialog.dialogX,
				theConfig.travelNotesDialog.dialogY
			);
		}
		return this.#travelNotesDialog;
	}

	/**
	Show the travel properties dialog visible and centered on the screen
	*/

	showTravelProperties ( ) {
		this.travelPropertiesDialog.show ( );
		this.travelPropertiesDialog.mover.centerDialog ( );
	}

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of DockableDialogsManager class
@type {DockableDialogsManager}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theDockableDialogsManager = new DockableDialogsManager ( );

export default theDockableDialogsManager;

/* --- End of file --------------------------------------------------------------------------------------------------------- */