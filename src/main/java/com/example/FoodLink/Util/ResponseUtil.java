package com.example.FoodLink.Util;



import java.util.List;
import java.util.Map;

@Singleton
class ResponseUtil {

    FirebaseDBImpl firebaseDB = FirebaseDBImpl.instance

    public getTokenFromResponseBody(def responseBody) {
        return responseBody.get('result').get('token');
    }

    public getRoutesFromFindRouteResponse(def responseBody) {
        Map responseMap = [:]
        List routes = responseBody.get('result').get('trip').get('routes');
        for (Map route : routes) {
            Map modifiedResponseMap = [:]
            modifiedResponseMap.put('points', trimCoordinates(route.get('points').get('coordinates')))
            modifiedResponseMap.put('travelTimeMinutes', route.get('travelTimeMinutes'))
            modifiedResponseMap.put('averageSpeed', route.get('averageSpeed'))
            modifiedResponseMap.put('totalDistance', route.get('totalDistance'))
            modifiedResponseMap.put('summary', route.get('summary').get('text'))
            responseMap.put(route.get('id'), modifiedResponseMap)
        }

        return responseMap;
    }

    public List trimCoordinates(List coordinates) {
        List trimmedList = []
        int div = 0;
        if ( coordinates.size() > 100) {
            div = coordinates.size()/15;
        } else {
            div = coordinates.size()/5
        }
        for(int i=1;i<coordinates.size();i++) {
            if ((i%div)==0) {
                trimmedList.add(coordinates.get(i))
            }
        }
        return trimmedList;
    }

    public String createCoordinateStringForCrimesAPI(List coordinates) {
        StringBuilder stringBuilder = new StringBuilder()
        //((latitude = 37.72623624315635 and longitude = -122.43362359230944) or (latitude = 37.72623624315640 and longitude = -122.43362359230944))
        stringBuilder.append('(')
        for (List coordinate : coordinates) {
            stringBuilder.append('(')
            stringBuilder.append('latitude%20=%20')
            stringBuilder.append(coordinate.get(1)+ "%20")
            stringBuilder.append('and%20longitude%20=%20')
            stringBuilder.append(coordinate.get(0)+ ")")
            stringBuilder.append('%20or%20')
        }
        String answer = stringBuilder.substring(0, stringBuilder.length()-8);
        return answer + ')'
    }
}
