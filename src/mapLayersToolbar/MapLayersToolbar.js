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

import { TOOLBAR_POSITION } from '../main/Constants.js';
import BaseToolbar from '../baseToolbar/BaseToolbar.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import ToolbarItem from '../baseToolbar/ToolbarItem.js';
import theConfig from '../data/Config.js';
import theMapLayersCollection from '../data/MapLayersCollection.js';
import theAPIKeysManager from '../core/APIKeysManager.js';
import theMapLayersManager from '../core/MapLayersManager.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the map layers toolbar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MapLayersToolbar extends BaseToolbar {

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
	}

	/**
	Create the UI, adding buttons
	*/

	createUI ( ) {
		super.createUI ( 'Travel & Notes', TOOLBAR_POSITION.topLeft );
	}

	/**
	Add the ToolbarItems to the toolbar. Called by the #show ( ) method of the vase class
	*/

	addToolbarItems ( ) {

		// adding map layer buttons
		theMapLayersCollection.forEach (
			mapLayer => {
				if (
					( mapLayer.providerKeyNeeded && theAPIKeysManager.hasKey ( mapLayer.providerName.toLowerCase ( ) ) )
					|| ! mapLayer.providerKeyNeeded
				) {
					this.addToolbarItem (
						new ToolbarItem (
							mapLayer.toolbarButtonData.text,
							mapLayer.name,
							( ) => { theMapLayersManager.setMapLayer ( mapLayer.name ); }
						)
					);
				}
			}
		);

		if ( theConfig.layersToolbarUI?.theDevil?.addButton ) {
			this.addToolbarItem (
				new ToolbarItem (
					'👿',
					'Reminder! The devil will know everything about you',
					'https://www.google.com/maps/@' +
							theTravelNotesData.map.getCenter ( ).lat +
							',' +
							theTravelNotesData.map.getCenter ( ).lng +
							',' +
							theTravelNotesData.map.getZoom ( ) +
							'z'
				)
			);
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of MapLayersToolbarUI class
@type {MapLayersToolbar}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theMapLayersToolbar = new MapLayersToolbar ( );

export default theMapLayersToolbar;

/* --- End of file --------------------------------------------------------------------------------------------------------- */