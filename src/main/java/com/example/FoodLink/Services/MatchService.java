package com.example.FoodLink.Services;

package com.inrix.carpool.trip.buddy.Services

import com.inrix.carpool.trip.buddy.Util.ResponseUtil
import com.inrix.carpool.trip.buddy.controllers.InrixAPIController
import com.inrix.carpool.trip.buddy.storage.FirebaseDBImpl

import java.util.List;
import java.util.Map;


@Singleton
class MatchService {

    FirebaseDBImpl firebaseDB = FirebaseDBImpl.instance
    ResponseUtil responseUtil = ResponseUtil.instance

    public Map getPersonalisedMatch(String startCoordinates, String endCoordinates) {
        Map personalisedMatches = [:]
        List plannedRides = firebaseDB.getDocumentsFromDB('plannedRides');
        for (Map plannedRide : plannedRides) {
            Map rideData = InrixAPIController.newInstance().getCoordinatesForRide(plannedRide.get('routeId'))
            List coordinates = rideData?.get('result')?.get('trip')?.get('routes')?.get(0)?.get('points')?.get('coordinates')
            boolean isApplicable = checkIfApplicable(startCoordinates, endCoordinates, coordinates)
            if (isApplicable) {
                plannedRide.put('points', responseUtil.trimCoordinates(coordinates))
                personalisedMatches.put(plannedRide.get('routeId'), plannedRide)
            } else if(plannedRide.get('startCoordinates') == startCoordinates && plannedRide.get('endCoordinates') == endCoordinates) {
                plannedRide.put('points', responseUtil.trimCoordinates(coordinates))
                personalisedMatches.put(plannedRide.get('routeId'), plannedRide)
            }
        }
        return personalisedMatches
    }

    private boolean checkIfApplicable(String startCoordinate, String endCoordinate, List coordinates) {
        boolean isStartAvailable = false
        for (List coordinate : coordinates) {
            String point = coordinate.get(1).toString()+','+coordinate.get(0).toString()
            if (point == startCoordinate) {
                isStartAvailable = true
            } else if ((point == endCoordinate) && isStartAvailable) {
                return true
            }
        }
        return false
    }
}
