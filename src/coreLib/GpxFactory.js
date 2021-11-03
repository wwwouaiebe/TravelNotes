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
	- v1.2.0:
		- created
	- v2.0.0:
		- Issue ♯147 : Add the travel name to gpx file name
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import theDataSearchEngine from '../data/DataSearchEngine.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theUtilities from '../UILib/Utilities.js';

/**
@--------------------------------------------------------------------------------------------------------------------------

@classdesc This class is used to create gpx files

@--------------------------------------------------------------------------------------------------------------------------
*/

class GpxFactory {

	/**
	The gpx string to write in the gpx file
	@type {String}
	*/

	#gpxString;

	/**
	The time stamp added in the gpx
	@type {String}
	*/

	#timeStamp;

	/**
	A reference to the Route for witch the gpx file is created
	@type {Route}
	*/

	#route;

	/**
	Simple constant for gpx presentation
	@type {String}
	*/

	static get#TAB0 ( ) { return '\n'; }

	/**
	Simple constant for gpx presentation
	@type {String}
	*/

	static get#TAB1 ( ) { return '\n\t'; }

	/**
	Simple constant for gpx presentation
	@type {String}
	*/

	static get#TAB2 ( ) { return '\n\t\t'; }

	/**
	Simple constant for gpx presentation
	@type {String}
	*/

	static get#TAB3 ( ) { return '\n\t\t\t'; }

	/**
	Creates the header of the gpx file
	*/

	#addHeader ( ) {

		// header
		this.#gpxString = '<?xml version="1.0"?>' + GpxFactory.#TAB0;
		this.#gpxString += '<gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
		'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
		'xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" ' +
		'version="1.1" creator="TravelNotes">';
	}

	/**
	Add the waypoints to the gpx file
	*/

	#addWayPoints ( ) {
		const wayPointsIterator = this.#route.wayPoints.iterator;
		while ( ! wayPointsIterator.done ) {
			this.#gpxString +=
				GpxFactory.#TAB1 + '<wpt lat="' + wayPointsIterator.value.lat + '" lon="' + wayPointsIterator.value.lng + '" ' +
				this.#timeStamp + '/>';

		}
	}

	/**
	Add the route to the gpx file
	*/

	#addRoute ( ) {
		this.#gpxString += GpxFactory.#TAB1 + '<rte>';
		const maneuverIterator = this.#route.itinerary.maneuvers.iterator;
		while ( ! maneuverIterator.done ) {
			const wayPoint = this.#route.itinerary.itineraryPoints.getAt (
				maneuverIterator.value.itineraryPointObjId
			);
			const instruction = maneuverIterator.value.instruction
				.replaceAll ( /\u0027/g, '&apos;' )
				.replaceAll ( /"/g, '&quot;' )
				.replaceAll ( /</g, '&lt;' )
				.replaceAll ( />/g, '&gt;' );
			this.#gpxString +=
				GpxFactory.#TAB2 +
				'<rtept lat="' +
				wayPoint.lat +
				'" lon="' +
				wayPoint.lng +
				'" ' +
				this.#timeStamp +
				'desc="' +
				instruction + '" />';
		}
		this.#gpxString += GpxFactory.#TAB1 + '</rte>';
	}

	/**
	Add the track to the gpx file
	*/

	#addTrack ( ) {
		this.#gpxString += GpxFactory.#TAB1 + '<trk>';
		this.#gpxString += GpxFactory.#TAB2 + '<trkseg>';
		const itineraryPointsIterator = this.#route.itinerary.itineraryPoints.iterator;
		while ( ! itineraryPointsIterator.done ) {
			this.#gpxString +=
				GpxFactory.#TAB3 +
				'<trkpt lat="' + itineraryPointsIterator.value.lat +
				'" lon="' +
				itineraryPointsIterator.value.lng +
				'" ' +
				this.#timeStamp +
				' />';
		}
		this.#gpxString += GpxFactory.#TAB2 + '</trkseg>';
		this.#gpxString += GpxFactory.#TAB1 + '</trk>';
	}

	/**
	Add the footer to the gpx file
	*/

	#addFooter ( ) {
		this.#gpxString += GpxFactory.#TAB0 + '</gpx>';
	}

	/**
	Save the gpx string to a file
	*/

	#saveGpxToFile ( ) {
		let fileName =
			( '' === theTravelNotesData.travel.name ? '' : theTravelNotesData.travel.name + ' - ' ) + this.#route.computedName;
		if ( '' === fileName ) {
			fileName = 'TravelNote';
		}
		fileName += '.gpx';
		theUtilities.saveFile ( fileName, this.#gpxString, 'application/xml' );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Transform a route into a gpx file
	@param {Number} routeObjId the objId of the route to save in a gpx file
	*/

	routeToGpx ( routeObjId ) {
		this.#route = theDataSearchEngine.getRoute ( routeObjId );
		if ( ! this.#route ) {
			return;
		}
		this.#timeStamp = 'time="' + new Date ( ).toISOString ( ) + '" ';

		this.#addHeader ( );
		this.#addWayPoints ( );
		this.#addRoute ( );
		this.#addTrack ( );
		this.#addFooter ( );
		this.#saveGpxToFile ( );
	}
}

export default GpxFactory;

/*
--- End of GpxFactory.js file -------------------------------------------------------------------------------------------------
*/