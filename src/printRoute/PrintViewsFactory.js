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
Doc reviewed 20210915
Tests ...
*/

/*---------------------------------------------------------------------------------------------------------------------------*/
/**
@typedef {Object} PointCoordinates
An object to store the latitude and longitude of a point
@property {Number} lat The latitude
@property {Number} lng The longitude
*/
/*---------------------------------------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------------------------------------*/
/**
@typedef {Object} PrintView
An object to store a print view
@property {PointCoordinates} bottomLeft The bottom left corner of the view
@property {PointCoordinates} upperRight The upper right corner of the view
@property {PointCoordinates} entryPoint The entry point of the route in the view. EntryPoint and exitPoint
are not on the frame!
@property {PointCoordinates} exitPoint The exit point of the route in the view
*/
/*---------------------------------------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------------------------------------*/
/**
An object to store the width and height of a view
*/
/*---------------------------------------------------------------------------------------------------------------------------*/

class ViewSize {

	/**
	The width of the view
	@type {Number}
	*/

	#width;

	/**
	The height of the view
	@type {Number}
	*/

	#height;

	/**
	The constructor
	@param {Number} width The width of the view
	@param {Number} height The height of the view
	*/

	constructor ( width, height ) {
		Object.freeze ( this );
		this.#width = width;
		this.#height = height;
	}

	/**
	The width of the view
	@type {Number}
	*/

	get width ( ) { return this.#width; }

	/**
	The height of the view
	@type {Number}
	*/

	get height ( ) { return this.#height; }
}

/*---------------------------------------------------------------------------------------------------------------------------*/
/**
Compute the size of the views for printing
*/
/*---------------------------------------------------------------------------------------------------------------------------*/

class PrintViewsFactory {

	/**
	An array with rhe computed views
	@type {Array.<PrintView>}
	*/

	#printViews;

	/**
	A reference to the printed route
	@type {Route}
	*/

	#route;

	/**
	the greatest possible view size
	@type {ViewSize}
	*/

	#maxViewSize;

	/**
	Compute if the line defined by firstItineraryPoint  lastItineraryPoint
	is horizontal or vertical. If yes, the intersection of the line and currentView is returned
	@param {PrintView} currentView The current view
	@param {ItineraryPoint} firstItineraryPoint The first ItineraryPoint
	@param {ItineraryPoint} lastItineraryPoint The last ItineraryPoint
	@return {PointCoordinates} The coordinates of the intersection or null if the line is not horizontal or vertical.
	*/

	#isItineraryHorOrVer ( currentView, firstItineraryPoint, lastItineraryPoint ) {

		if ( firstItineraryPoint.lng === lastItineraryPoint.lng ) {

			// Itinerary is vertical
			return {
				lat : firstItineraryPoint.lat > lastItineraryPoint.lat
					?
					currentView.bottomLeft.lat
					:
					currentView.upperRight.lat,
				lng : firstItineraryPoint.lng
			};
		}
		if ( firstItineraryPoint.lat === lastItineraryPoint.lat ) {

			// Itinerary is horizontal
			return {
				lat : firstItineraryPoint.lat,
				lng : firstItineraryPoint.lng < lastItineraryPoint.lng
					?
					currentView.upperRight.lng
					:
					currentView.bottomLeft.lng
			};
		}
		return null;
	}

	/**
	Test if itineraryPoint is on the frame of currentView
	@param {PrintView} currentView The current view
	@param {ItineraryPoint} itineraryPoint The ItineraryPoint to test
	@return {PointCoordinates} The coordinates of itineraryPoint or null if the itinerayPoint is not on the frame
	*/

	#isPointOnViewFrame ( currentView, itineraryPoint ) {

		const LAT_LNG_TOLERANCE = 0.000001;

		if (
			itineraryPoint.lat - currentView.bottomLeft.lat < LAT_LNG_TOLERANCE
			||
			currentView.upperRight.lat - itineraryPoint.lat < LAT_LNG_TOLERANCE
			||
			itineraryPoint.lng - currentView.bottomLeft.lng < LAT_LNG_TOLERANCE
			||
			currentView.upperRight.lng - itineraryPoint.lng < LAT_LNG_TOLERANCE
		) {

			// itinerary point is really near the frame. we consider the itinerary point as intermediate point
			return { lat : itineraryPoint.lat, lng : itineraryPoint.lng };
		}
		return null;
	}

	/**
	Test if currentView is only a point. If yes an intermediatePoint is computed
	to extend the view to the maximun possible
	@param {PrintView} currentView The current view
	@param {ItineraryPoint} firstItineraryPoint The first ItineraryPoint
	@param {ItineraryPoint} lastItineraryPoint The last ItineraryPoint
	@return {PointCoordinates} The coordinates of the computed intermediate point or null
	*/

	#haveViewOnlyOnePoint ( currentView, firstItineraryPoint, lastItineraryPoint ) {
		if (
			currentView.bottomLeft.lat === currentView.upperRight.lat
			&&
			currentView.bottomLeft.lng === currentView.upperRight.lng
		) {
			const coef = Math.min (
				Math.abs ( this.#maxViewSize.height / ( lastItineraryPoint.lat - firstItineraryPoint.lat ) ),
				Math.abs ( this.#maxViewSize.width / ( lastItineraryPoint.lng - firstItineraryPoint.lng ) )
			);
			return {
				lat : firstItineraryPoint.lat + ( coef * ( lastItineraryPoint.lat - firstItineraryPoint.lat ) ),
				lng : firstItineraryPoint.lng + ( coef * ( lastItineraryPoint.lng - firstItineraryPoint.lng ) )
			};
		}
		return null;
	}

	/**
	See comments in the code
	@param {PrintView} currentView The current view
	@param {ItineraryPoint} firstItineraryPoint The first ItineraryPoint
	@param {ItineraryPoint} lastItineraryPoint The last ItineraryPoint
	@return {PointCoordinates} The computed point
	*/

	#computeIntermediatePoint ( currentView, firstItineraryPoint, lastItineraryPoint ) {

		/*
		we have to find the intersection of the line segment 'firstItineraryPoint -> lastItineraryPoint' with
		the rectangle defined by currentView.lowerLeft, currentView.upperRight.
		We know also that firstItineraryPoint is inside currentView but perhaps on the frame and that
		lastItineraryPoint is outside the frame so the intersection is always between firstItineraryPoint
		and lastItineraryPoint

		Equation of the a line :
			y = coefA * x + coefB
			or
			x = ( y - coefB ) / coefA

		So we have :

			firstItineraryPoint.lat = coefA * firstItineraryPoint.lng + coefB
			and
			lastItineraryPoint.lat = coefA * lastItineraryPoint.lng + coefB

		and after some transformations:
			coefA = ( firstItineraryPoint.lat - lastItineraryPoint.lat ) / ( firstItineraryPoint.lng - lastItineraryPoint.lng )
			coefB = firstItineraryPoint.lat - ( coefA * firstItineraryPoint.lng )

		Notice: we have some computing problems when
		- currentView.lowerLeft === currentView.upperRight. We cannot find an intersection and we have to compute a
		intermediatePoint outside the currentView
		- firstItineraryPoint is on the frame (or really near the frame ) of currentView -> the intersection
		is the firstItineraryPoint
		- the line segment 'firstItineraryPoint -> lastItineraryPoint' is horizontal or vertical
		(we have to divide by 0)

		So we test first the 3 problems and then we compute the intersection if needed
		*/

		let intermediatePoint = this.#haveViewOnlyOnePoint ( currentView, firstItineraryPoint, lastItineraryPoint );
		if ( intermediatePoint ) {
			return intermediatePoint;
		}

		intermediatePoint = this.#isPointOnViewFrame ( currentView, firstItineraryPoint );
		if ( intermediatePoint ) {
			return intermediatePoint;
		}

		intermediatePoint = this.#isItineraryHorOrVer ( currentView, firstItineraryPoint, lastItineraryPoint );
		if ( intermediatePoint ) {
			return intermediatePoint;
		}

		const coefA =
			( firstItineraryPoint.lat - lastItineraryPoint.lat )
			/
			( firstItineraryPoint.lng - lastItineraryPoint.lng );
		const coefB = firstItineraryPoint.lat - ( coefA * firstItineraryPoint.lng );

		// Searching intersection with the right side of currentView
		intermediatePoint = {
			lat : ( coefA * currentView.upperRight.lng ) + coefB,
			lng : currentView.upperRight.lng
		};

		if (
			intermediatePoint.lat <= currentView.upperRight.lat
				&&
				intermediatePoint.lat >= currentView.bottomLeft.lat
				&&
				intermediatePoint.lng < lastItineraryPoint.lng
		) {
			return intermediatePoint;
		}

		// Searching intersection with the top side of currentView
		intermediatePoint = {
			lat : currentView.upperRight.lat,
			lng : ( currentView.upperRight.lat - coefB ) / coefA
		};

		if (
			intermediatePoint.lng >= currentView.bottomLeft.lng
				&&
				intermediatePoint.lng <= currentView.upperRight.lng
				&&
				intermediatePoint.lat < lastItineraryPoint.lat
		) {
			return intermediatePoint;
		}

		// Searching intersection with the left side of currentView
		intermediatePoint = {
			lat : ( coefA * currentView.bottomLeft.lng ) + coefB,
			lng : currentView.bottomLeft.lng
		};

		if (
			intermediatePoint.lat <= currentView.upperRight.lat
				&&
				intermediatePoint.lat >= currentView.bottomLeft.lat
				&&
				intermediatePoint.lng > lastItineraryPoint.lng
		) {
			return intermediatePoint;
		}

		// Searching intersection with the bottom side of currentView
		intermediatePoint = {
			lat : currentView.bottomLeft.lat,
			lng : ( currentView.bottomLeft.lat - coefB ) / coefA
		};

		if (
			intermediatePoint.lng >= currentView.bottomLeft.lng
				&&
				intermediatePoint.lng <= currentView.upperRight.lng
				&&
				intermediatePoint.lat > lastItineraryPoint.lat
		) {
			return intermediatePoint;
		}
		throw new Error ( 'intermediate point not found' );
	}

	/**
	Compute the different views needed to print the maps
	*/

	#computePrintViews ( ) {

		this.#printViews = [];

		// Iteration on the route
		const itineraryPointsIterator = this.#route.itinerary.itineraryPoints.iterator;
		let done = itineraryPointsIterator.done;

		// First view is created with the first itineraryPoint
		// ! Be sure that points in the views are clones and not only references...
		let currentView = {
			bottomLeft : { lat : itineraryPointsIterator.value.lat, lng : itineraryPointsIterator.value.lng },
			upperRight : { lat : itineraryPointsIterator.value.lat, lng : itineraryPointsIterator.value.lng },
			entryPoint : { lat : itineraryPointsIterator.value.lat, lng : itineraryPointsIterator.value.lng },
			exitPoint : { lat : itineraryPointsIterator.value.lat, lng : itineraryPointsIterator.value.lng }
		};

		let previousItineraryPoint = itineraryPointsIterator.value;

		// we go to the next point
		done = itineraryPointsIterator.done;
		let currentItineraryPoint = itineraryPointsIterator.value;
		while ( ! done ) {

			// a temporary view is created, extending the current view with the current itinerary point
			const tmpView = {
				bottomLeft : {
					lat : Math.min ( currentView.bottomLeft.lat, currentItineraryPoint.lat ),
					lng : Math.min ( currentView.bottomLeft.lng, currentItineraryPoint.lng )
				},
				upperRight : {
					lat : Math.max ( currentView.upperRight.lat, currentItineraryPoint.lat ),
					lng : Math.max ( currentView.upperRight.lng, currentItineraryPoint.lng )
				},
				entryPoint : {
					lat : currentView.entryPoint.lat,
					lng : currentView.entryPoint.lng
				},
				exitPoint : {
					lat : currentView.exitPoint.lat,
					lng : currentView.exitPoint.lng
				}
			};

			// computing the temporary view size...
			const tmpViewSize = new ViewSize (
				tmpView.upperRight.lat - tmpView.bottomLeft.lat,
				tmpView.upperRight.lng - tmpView.bottomLeft.lng
			);

			// and comparing with the desired max view size
			if ( this.#maxViewSize.height > tmpViewSize.height && this.#maxViewSize.width > tmpViewSize.width ) {

				// the current itineraryPoint is inside the temporary view.
				// the temporary view becomes the current view and we go to the next itinerary point
				currentView = tmpView;
				previousItineraryPoint = itineraryPointsIterator.value;
				done = itineraryPointsIterator.done;
				currentItineraryPoint = itineraryPointsIterator.value;
				if ( done ) {

					// It's the last view. Adding the exit point
					currentView.exitPoint.lat = previousItineraryPoint.lat;
					currentView.exitPoint.lng = previousItineraryPoint.lng;

					// and the view is added to the list of views
					this.#printViews.push ( Object.freeze ( currentView ) );
				}
			}
			else {

				// the itineraryPoint is outside the view. We have to compute an intermediate
				// point (where the route intersect with the max size view).
				const intermediatePoint = this.#computeIntermediatePoint (
					currentView,
					previousItineraryPoint,
					currentItineraryPoint
				);

				// The view is extended to the intermediate point
				currentView.bottomLeft = {
					lat : Math.min ( currentView.bottomLeft.lat, intermediatePoint.lat ),
					lng : Math.min ( currentView.bottomLeft.lng, intermediatePoint.lng )
				};
				currentView.upperRight = {
					lat : Math.max ( currentView.upperRight.lat, intermediatePoint.lat ),
					lng : Math.max ( currentView.upperRight.lng, intermediatePoint.lng )
				};

				// exit point is added to the view
				currentView.exitPoint.lat = intermediatePoint.lat;
				currentView.exitPoint.lng = intermediatePoint.lng;

				// and the view added to the list view
				this.#printViews.push ( Object.freeze ( currentView ) );

				// and a new view is created
				currentView = {
					bottomLeft : { lat : intermediatePoint.lat, lng : intermediatePoint.lng },
					upperRight : { lat : intermediatePoint.lat, lng : intermediatePoint.lng },
					entryPoint : { lat : intermediatePoint.lat, lng : intermediatePoint.lng },
					exitPoint : { lat : intermediatePoint.lat, lng : intermediatePoint.lng }
				};
			}
		} // end of while ( ! done )
	}

	/**
	The constructor
	@param {Route} route The route to print
	@param {ViewSize} maxViewSize The view size
	*/

	constructor ( route, maxViewSize ) {

		Object.freeze ( this );

		this.#route = route;
		this.#maxViewSize = maxViewSize;

		this.#computePrintViews ( );
	}

	/**
	The print views
	@type {Array.<PrintView>}
	*/

	get printViews ( ) { return this.#printViews; }

}

export { PrintViewsFactory, ViewSize };

/*
@------------------------------------------------------------------------------------------------------------------------------

end of PrintViewsFactory.js file
*/
/*---------------------------------------------------------------------------------------------------------------------------*/