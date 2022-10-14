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

/* eslint-disable no-magic-numbers */

// css files needed for TravelNotes

const travelNotesCss = [
	'node_modules/leaflet/dist/leaflet.css',
	'src/css/Map.css',
	'src/css/Notes.css',
	'src/css/NotesIcons.css',
	'src/css/NotesForMap.css',
	'src/css/NotesForUI.css',
	'src/css/Print.css',
	'src/css/RoutesForMap.css',
	'src/css/RoutesForUI.css',
	'src/css/RoutesForSvgProfile.css',
	'src/css/WayPointsForMap.css',
	'src/css/Background.css',
	'src/css/WaitAnimation.css',
	'src/contextMenus/baseContextMenu/BaseContextMenu.css',
	'src/controls/addressControl/AddressControl.css',
	'src/controls/colorControl/ColorControl.css',
	'src/controls/numberInputControl/NumberInputControl.css',
	'src/controls/passwordControl/PasswordControl.css',
	'src/controls/sortableListControl/SortableListControl.css',
	'src/controls/textAreaControl/TextAreaControl.css',
	'src/controls/textInputControl/TextInputControl.css',
	'src/dialogs/baseDialog/BaseDialog.css',
	'src/dialogs/baseDialog/DockableBaseDialog.css',
	'src/dialogs/baseDialog/ModalBaseDialog.css',
	'src/dialogs/aboutDialog/AboutDialog.css',
	'src/dialogs/apiKeysdialog/ApiKeysDialog.css',
	'src/dialogs/notesDialog/NoteDialog.css',
	'src/dialogs/osmSearchDialog/OsmSearchDialog.css',
	'src/dialogs/printRouteMapDialog/PrintRouteMapDialog.css',
	'src/dialogs/profileDialog/ProfileDialog.css',
	'src/dialogs/routePropertiesDialog/RoutePropertiesDialog.css',
	'src/dialogs/twoButtonsDialog/TwoButtonsDialog.css',
	'src/dialogs/wayPointPropertiesDialog/WayPointPropertiesDialog.css',
	'src/printRoute/PrintRoute.css',
	'src/toolbars/baseToolbar/BaseToolbar.css',
	'src/toolbars/mapLayersToolbar/MapLayersToolbar.css',
	'src/toolbars/providersToolbar/ProvidersToolbar.css',
	'src/uis/AttributionsUI/AttributionsUI.css',
	'src/uis/ErrorsUI/ErrorsUI.css',
	'src/uis/fullScreenUI/FullScreenUI.css',
	'src/uis/mouseUI/MouseUI.css',
	'src/uis/waitUI/WaitUI.css',
	'src/css/Hidden.css' // must always be the last css
];

// css files needed for the viewer

const travelNotesViewerCss = [
	'node_modules/leaflet/dist/leaflet.css',
	'src/css/Map.css',
	'src/css/Notes.css',
	'src/css/NotesIcons.css',
	'src/css/NotesForMap.css',
	'src/css/RoutesForMap.css',
	'src/toolbars/viewerLayersToolbar/ViewerLayersToolbar.css',
	'src/uis/AttributionsUI/AttributionsUI.css',
	'src/uis/ErrorsUI/ErrorsUI.css'
];

// css files needed for the roadbook

const travelNotesRoadbookCss = [
	'src/css/TravelForRoadbook.css',
	'src/css/Notes.css',
	'src/css/NotesIcons.css',
	'src/css/NotesForRoadbook.css',
	'src/css/RoutesForRoadbook.css',
	'src/css/RoutesForSvgProfile.css',
	'src/roadbook/Roadbook.css',
	'src/css/Hidden.css'
];

// eslint-disable-next-line no-undef
module.exports = {
	options : {

		// don't remove this. Colors must not be changed in css to avoid problems with data uri
		compatibility : {
			properties : {
				colors : false
			}
		},
		mergeIntoShorthands : false,
		roundingPrecision : -1
	},

	// debug mode. Files are copied in the debug folder

	debug : {
		files : {
			'debug/TravelNotes.min.css' : travelNotesCss,
			'debug/viewer/TravelNotesViewer.min.css' : travelNotesViewerCss,
			'debug/TravelNotesRoadbook.min.css' : travelNotesRoadbookCss
		}
	},

	// release mode. Files are copied in the dist and docs/demo folders

	release : {
		files : {
			'docs/demo/TravelNotes.min.css' : travelNotesCss,
			'docs/demo/viewer/TravelNotesViewer.min.css' : travelNotesViewerCss,
			'docs/demo/TravelNotesRoadbook.min.css' : travelNotesRoadbookCss
		}
	}
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */