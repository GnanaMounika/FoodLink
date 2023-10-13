package com.example.FoodLink.APIController;

import com.google.gson.Gson
import com.inrix.carpool.trip.buddy.Services.MatchService
import com.inrix.carpool.trip.buddy.Util.ResponseUtil
import com.inrix.carpool.trip.buddy.storage.FirebaseDBImpl
import com.mashape.unirest.http.Unirest
import com.mashape.unirest.http.exceptions.UnirestException
import org.json.JSONObject
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController

import javax.servlet.http.HttpServletResponse
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
class FoodLinkController {

    ResponseUtil responseUtil = ResponseUtil.instance
    MatchService matchService = MatchService.instance

    @GetMapping("/myAuthenticationToken")
    public String myAuthenticationToken() throws UnirestException {
        Unirest.setTimeouts(0, 0);
        JSONObject jsonObject  = Unirest.get("https://api.iq.inrix.com/auth/v1/appToken?appId=650xzhocg7&hashToken=NjUweHpob2NnN3w1ODJlRG81dUN1NGFyTkJkRHBoeUo4N1JnVER1emV4QjJLQzMxMjNW")
                .header("accept", "application/json").asJson().getBody().getObject();
        Map mapResponse = new Gson().fromJson(jsonObject.toString(), HashMap.class);
        return responseUtil.getTokenFromResponseBody(mapResponse);
    }

    @RequestMapping(value = "/allPossibleRoutes/{startingWayPoint}/{endWayPoint}",
            method = RequestMethod.GET)
    @ResponseBody
    public Object findAllPossibleRoutes(@PathVariable String startingWayPoint, @PathVariable String endWayPoint, HttpServletResponse response) {
        String[] startCoordinates = startingWayPoint.split(',');
        String[] endCoordinates = endWayPoint.split(',');
        String authenticationToken = myAuthenticationToken();
        Unirest.setTimeouts(0, 0);
        JSONObject jsonObject = Unirest.get("https://api.iq.inrix.com/findRoute?wp_1="+startCoordinates[0]+"%2C"+startCoordinates[1]+"&wp_2="+endCoordinates[0]+"%2C"+endCoordinates[1]+"&routeOutputFields=D,S,P,I&isAmbiguousOrigin=true&format=json")
                .header("accept", "application/json")
                .header("Authorization", "Bearer "+authenticationToken)
                .asJson().getBody().getObject();
        Map mapResponse = new Gson().fromJson(jsonObject.toString(), HashMap.class);
        response.setHeader('Access-Control-Allow-Origin','*');
        return responseUtil.getRoutesFromFindRouteResponse(mapResponse);
    }

    @RequestMapping(value = "/saveRoute",
            method = RequestMethod.POST)
    @ResponseBody
    public Object saveRoute(@RequestBody Map requestBody, HttpServletResponse response) {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-ddHH:mm:ss");
        LocalDateTime now = LocalDateTime.now();
        String dateKey = dtf.format(now);
        FirebaseDBImpl.instance.addToDB(dateKey, requestBody, 'plannedRides');
        response.setHeader('Access-Control-Allow-Origin','*');
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
        response.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token')
        return ['status':'saved']
    }

    @RequestMapping(value = "/getPersonalisedRides/{startingWayPoint}/{endWayPoint}",
            method = RequestMethod.GET)
    @ResponseBody
    public Object getPersonalisedRides(@PathVariable String startingWayPoint, @PathVariable String endWayPoint, HttpServletResponse response) {
        Map matches = matchService.getPersonalisedMatch(startingWayPoint, endWayPoint)
        response.setHeader('Access-Control-Allow-Origin','*');
        return matches
    }

    public Object getCoordinatesForRide(String rideId) {
        Unirest.setTimeouts(0, 0);
        String authenticationToken = myAuthenticationToken();
        JSONObject jsonObject   = Unirest.get("https://api.iq.inrix.com/route?routeId="+rideId+"&routeOutputFields=D,S,P,I&format=json")
                .header("accept", "application/json")
                .header("Authorization", "Bearer "+authenticationToken)
                .asJson().getBody().getObject();
        Map mapResponse = new Gson().fromJson(jsonObject.toString(), HashMap.class);
        return mapResponse
    }

    @GetMapping("/test")
    public Object getCrimeStats() {
        List trial = getCoordinatesForRide('20129598').get('result').get('trip').get('routes').get(0).get('points').get('coordinates')
        String coordinateArgument = responseUtil.createCoordinateStringForCrimesAPI(trial);
        Unirest.setTimeouts(0, 0);
        String url = 'https://data.sfgov.org/resource/wg3w-h783.json?$where=incident_category%20in%20(%27Arson%27,%27Motor%20Vehicle%20theft%27,%27Assault%27,%27Burglary%27,%27Fire%20report%27,%27homicide%27,%27Larceny%20theft%27,%27Motor%20Vehicle%20theft%27,%27Robbery%27,%27Traffic%20collision%27,%27traffic%20violation%20arrest%27,%27weapon%20offence%27)%20and%20'+coordinateArgument
        println(url)
        JSONObject jsonObject  = Unirest.get(url)
                .asJson().getBody().getObject();
        Map response = new Gson().fromJson(jsonObject.toString(), Map.class);
        return response
    }

}
