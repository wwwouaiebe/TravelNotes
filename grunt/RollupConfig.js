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

// eslint-disable-next-line no-undef
module.exports = {

	// debug mode. Files are created but not used, so import and export errors are detected

	debug : {
		options : {
			format : 'iife'
		},
		files : {
			'tmpDebug/TravelNotes.min.js' : [ 'src/main/Main.js' ],
			'tmpDebug/TravelNotesViewer.min.js' : [ 'src/main/MainViewer.js' ],
			'tmpDebug/TravelNotesRoadbook.min.js' : [ 'src/roadbook/roadbook.js' ],
			'tmpDebug/GraphHopperRouteProvider.min.js' : [ 'src/routeProviders/GraphHopperRouteProvider.js' ],
			'tmpDebug/MapboxRouteProvider.min.js' : [ 'src/routeProviders/MapboxRouteProvider.js' ],
			'tmpDebug/MapzenValhallaRouteProvider.min.js' : [ 'src/routeProviders/MapzenValhallaRouteProvider.js' ],
			'tmpDebug/OpenRouteServiceRouteProvider.min.js' : [ 'src/routeProviders/OpenRouteServiceRouteProvider.js' ],
			'tmpDebug/OsrmRouteProvider.min.js' : [ 'src/routeProviders/OsrmRouteProvider.js' ],
			'tmpDebug/PolylineRouteProvider.min.js' : [ 'src/routeProviders/PolylineRouteProvider.js' ],
			'tmpDebug/PublicTransportRouteProvider.min.js' : [ 'src/routeProviders/PublicTransportRouteProvider.js' ]
		}
	},

	// release mode

	release : {
		options : {
			format : 'iife'
		},
		files : {
			'tmpRelease/TravelNotes.min.js' : [ 'tmpRelease/src/main/Main.js' ],
			'tmpRelease/TravelNotesViewer.min.js' : [ 'tmpRelease/src/main/MainViewer.js' ],
			'tmpRelease/TravelNotesRoadbook.min.js' : [ 'tmpRelease/src/roadbook/roadbook.js' ],
			'tmpRelease/GraphHopperRouteProvider.min.js' : [ 'tmpRelease/src/routeProviders/GraphHopperRouteProvider.js' ],
			'tmpRelease/MapboxRouteProvider.min.js' : [ 'tmpRelease/src/routeProviders/MapboxRouteProvider.js' ],
			'tmpRelease/MapzenValhallaRouteProvider.min.js' :
				[ 'tmpRelease/src/routeProviders/MapzenValhallaRouteProvider.js' ],
			'tmpRelease/OpenRouteServiceRouteProvider.min.js' :
				[ 'tmpRelease/src/routeProviders/OpenRouteServiceRouteProvider.js' ],
			'tmpRelease/OsrmRouteProvider.min.js' : [ 'tmpRelease/src/routeProviders/OsrmRouteProvider.js' ],
			'tmpRelease/PolylineRouteProvider.min.js' : [ 'tmpRelease/src/routeProviders/PolylineRouteProvider.js' ],
			'tmpRelease/PublicTransportRouteProvider.min.js' :
				[ 'tmpRelease/src/routeProviders/PublicTransportRouteProvider.js' ]
		}
	}
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */