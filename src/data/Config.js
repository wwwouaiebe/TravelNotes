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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Class used to store the configuration of the code
*/
/* ------------------------------------------------------------------------------------------------------------------------- */
/* eslint-disable no-magic-numbers */

const theConfig = {
	ApiKeys : {
		saveToSessionStorage : true
	},
	ApiKeysDialog : {
		haveUnsecureButtons : true,
		showApiKeys : false,
		showButton : true
	},
	baseDialog : {
		cancelTouchX : 100,
		cancelTouchY : 150,
		deltaZoomDistance : 75
	},
	contextMenu : {
		timeout : 1500
	},
	dockableBaseDialog : {
		timeout : 1500
	},
	errorsUI :
	{
		helpTimeOut : 30000,
		showError : true,
		showHelp : false,
		showInfo : true,
		showWarning : true,
		timeOut : 10000
	},
	fontSize :
	{
		initialValue : 3.5,
		incrementValue : 0.5
	},
	FullScreenUI :
	{
		timeOut : 5000,
		screenMaxWidth : 1200
	},
	geoCoder : {
		distances : {
			city : 1200,
			hamlet : 200,
			town : 1500,
			village : 400
		},
		osmCityAdminLevel : {
			DEFAULT : '8',
			GB : '10'
		}
	},
	geoLocation : {
		marker : {
			color : '\u0023ff0000',
			radius : 0
		},
		options : {
			enableHighAccuracy : true,
			maximumAge : 0,
			timeout : 3600000
		},
		watch : true,
		zoomFactor : 17,
		zoomToPosition : true
	},
	itineraryPoint : {
		marker : {
			color : '\u0023ff0000',
			fill : false,
			radius : 7,
			weight : 2
		},
		zoomFactor : 17
	},
	mapContextMenu : {
		mouseMaxRouteDistance : 10,
		touchMaxRouteDistance : 10
	},
	mapLayersToolbar : {
		theDevil : {
			addButton : true
		}
	},
	map :
	{
		center : {
			lat : 50.50923,
			lng : 5.49542
		},
		zoom : 12
	},
	nominatim :
	{
		url : 'https://nominatim.openstreetmap.org/',
		language : '*'
	},
	note : {
		grip : {
			size : 10,
			opacity : 0,
			moveOpacity : 1
		},
		haveBackground : false,
		maxManeuversNotes : 100,
		polyline : {
			color : '\u0023808080',
			weight : 1
		},
		svgIcon : {
			angleDistance : 10,
			angleDirection :
			{
				right : 35,
				slightRight : 80,
				continue : 100,
				slightLeft : 145,
				left : 200,
				sharpLeft : 270,
				sharpRight : 340
			},
			rcnRefDistance : 20,
			roadbookFactor : 6,
			zoom : 17
		}
	},
	noteDialog : {
		areaHeight : {
			icon : 2,
			popupContent : 8
		},
		theDevil : {
			addButton : true,
			zoomFactor : 17
		}
	},
	osmSearchDialog :
	{
		dialogX : 50,
		dialogY : 0
	},
	osmSearch : {
		nextSearchLimit : {
			color : '\u0023ff0000',
			fill : false,
			weight : 1
		},
		previousSearchLimit : {
			color : '\u0023006400',
			fill : false,
			weight : 1
		},
		searchPointMarker : {
			color : '\u0023006400',
			fill : false,
			radius : 20,
			weight : 4
		},
		searchPointPolyline : {
			color : '\u0023006400',
			fill : false,
			weight : 4
		},
		showSearchNoteDialog : false
	},
	overpassApi : {
		useNwr : true,
		timeOut : 40,
		url : 'https://lz4.overpass-api.de/api/interpreter' // "https://overpass.openstreetmap.fr/api/interpreter"
	},
	printRouteMap :
	{
		firefoxBrowser : true,
		isEnabled : true,
		maxTiles : 240,
		paperWidth : 287,
		paperHeight : 200,
		printNotes : true,
		borderWidth : 10,
		zoomFactor : 15,
		entryPointMarker : {
			color : '\u002300ff00',
			weight : 4,
			radius : 10,
			fill : true,
			fillOpacity : 1
		},
		exitPointMarker : {
			color : '\u0023ff0000',
			weight : 4,
			radius : 10,
			fill : true,
			fillOpacity : 1
		}
	},
	route : {
		color : '\u0023ff0000',
		dashIndex : 0,
		dashChoices : [
			{
				text : '——————',
				iDashArray : [ 0 ]
			},
			{
				text : '— — — — —',
				iDashArray : [ 4, 2 ]
			},
			{
				text : '—‧—‧—‧—‧—',
				iDashArray : [ 4, 2, 0, 2 ]
			},
			{
				text : '················',
				iDashArray : [ 0, 2 ]
			}
		],
		elev : {
			smooth : true,
			smoothCoefficient : 2.5,
			smoothPoints : 3
		},
		showDragTooltip : 0,
		width : 5
	},
	routeEditor : {
		showEditedRouteInRoadbook : true
	},
	toolbars : {
		timeOut : 1500
	},
	travelNotes : {
		haveBeforeUnloadWarning : true,
		language : 'fr',
		startupRouteEdition : true
	},
	TravelNotesToolbar :
	{
		contactMail : {
			url : 'https://github.com/wwwouaiebe/TravelNotes/issues'
		}
	},
	travelNotesDialog :
	{
		dialogX : 250,
		dialogY : 0
	},
	travelPropertiesDialog :
	{
		dialogX : 50,
		dialogY : 0
	},
	wayPoint : {
		reverseGeocoding : true,
		geocodingIncludeName : true
	}
};
/* eslint-enable no-magic-numbers */

export default theConfig;

/* --- End of file --------------------------------------------------------------------------------------------------------- */