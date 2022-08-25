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
	'src/contextMenus/BaseContextMenu.css',
	'src/baseDialog/BaseDialog.css',
	'src/baseDialog/DockableBaseDialog.css',
	'src/aboutDialog/AboutDialog.css',
	'src/apiKeysdialog/APIKeysDialog.css',
	'src/notesDialog/NoteDialog.css',
	'src/passwordDialog/PasswordDialog.css',
	'src/printRouteMapDialog/PrintRouteMapDialog.css',
	'src/profileDialog/ProfileDialog.css',
	'src/routePropertiesDialog/RoutePropertiesDialog.css',
	'src/twoButtonsDialog/TwoButtonsDialog.css',
	'src/wayPointPropertiesDialog/WayPointPropertiesDialog.css',
	'src/colorControl/ColorControl.css',
	'src/sortableListControl/SortableListControl.css',
	'src/AttributionsUI/AttributionsUI.css',
	'src/ErrorsUI/ErrorsUI.css',
	'src/fullScreenUI/FullScreenUI.css',
	'src/mouseUI/MouseUI.css',
	'src/waitUI/WaitUI.css',
	'src/baseToolbar/BaseToolbar.css',
	'src/mapLayersToolbar/MapLayersToolbar.css',
	'src/providersToolbar/ProvidersToolbar.css',
	'src/css/Hidden.css' // must always be the last css
];

// css files needed for the viewer

const travelNotesViewerCss = [
	'src/css/Map.css',
	'src/css/Notes.css',
	'src/css/NotesIcons.css',
	'src/css/NotesForMap.css',
	'src/css/RoutesForMap.css',
	'src/AttributionsUI/AttributionsUI.css',
	'src/ErrorsUI/ErrorsUI.css',
	'src/viewerLayersToolbarUI/ViewerLayersToolbarUI.css'
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
const localServerPath = require ( './LocalServerPath.js' );

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
			'debug/TravelNotesRoadbook.min.css' : travelNotesRoadbookCss,
			[ localServerPath + 'debug/TravelNotes.min.css' ] : travelNotesCss,
			[ localServerPath + 'debug/viewer/TravelNotesViewer.min.css' ] : travelNotesViewerCss,
			[ localServerPath + 'debug/TravelNotesRoadbook.min.css' ] : travelNotesRoadbookCss
		}
	},

	// release mode. Files are copied in the dist and docs/demo folders

	release : {
		files : {
			'dist/TravelNotes.min.css' : travelNotesCss,
			'dist/viewer/TravelNotesViewer.min.css' : travelNotesViewerCss,
			'dist/TravelNotesRoadbook.min.css' : travelNotesRoadbookCss,
			'docs/demo/TravelNotes.min.css' : travelNotesCss,
			'docs/demo/viewer/TravelNotesViewer.min.css' : travelNotesViewerCss,
			'docs/demo/TravelNotesRoadbook.min.css' : travelNotesRoadbookCss
		}
	}
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */