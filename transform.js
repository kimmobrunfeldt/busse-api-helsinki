var moment = require('moment');

// Returned format from original API is a bit strange and very deeply nested.
// Original API url: http://dev.hsl.fi/siriaccess/vm/json?operatorRef=HSL

function transform(data) {
    var vehicles = data.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity;

    return {
        vehicles: vehicles.map(transformVehicle),
        responseUnixTime: data.Siri.ServiceDelivery.ResponseTimestamp
    };
}

function transformVehicle(vehicle) {
    var journey = vehicle.MonitoredVehicleJourney;

    var routeInfo = interpretJore(journey.LineRef.value);
    var lineName = routeInfo[2];
    var vehicleType = routeInfo[0].toLowerCase();

    return {
        id: journey.VehicleRef.value,
        line: lineName,
        latitude: journey.VehicleLocation.Latitude,
        longitude: journey.VehicleLocation.Longitude,
        rotation: journey.Bearing || 0,
        operator: journey.OperatorRef.value,
        direction: journey.DirectionRef.value,
        validUntil: moment(vehicle.ValidUntilTime).toISOString(),
        type: vehicleType
    };
}

// From http://dev.hsl.fi/:
// (Values of lineRef are "JORE codes" and can be converted to passenger-friendly line numbers using the interpret_jore example code.)
// (lineRef query parameter can be added to limit the response to that single "JORE code".)
// This function was automatically converted from coffeescript to js, from
// https://github.com/HSLdevcom/navigator-proto/blob/master/src/routing.coffee
function interpretJore(routeId) {
    var mode, ref, ref1, ref2, ref3, ref4, ref5, ref6, route, routeType;

    if (routeId != null ? routeId.match(/^1019/) : void 0) {
        ref1 = ["FERRY", 4, "Ferry"], mode = ref1[0], routeType = ref1[1], route = ref1[2];
    } else if (routeId != null ? routeId.match(/^1300/) : void 0) {
        ref2 = ["SUBWAY", 1, routeId.substring(4, 5)], mode = ref2[0], routeType = ref2[1], route = ref2[2];
    } else if (routeId != null ? routeId.match(/^300/) : void 0) {
        ref3 = ["RAIL", 2, routeId.substring(4, 5)], mode = ref3[0], routeType = ref3[1], route = ref3[2];
    } else if (routeId != null ? routeId.match(/^10(0|10)/) : void 0) {
        ref4 = ["TRAM", 0, routeId.replace(/^.0*/, "")], mode = ref4[0], routeType = ref4[1], route = ref4[2];
    } else if (routeId != null ? routeId.match(/^(1|2|4).../) : void 0) {
        ref5 = ["BUS", 3, routeId.replace(/^.0*/, "")], mode = ref5[0], routeType = ref5[1], route = ref5[2];
    } else {
        ref6 = ["BUS", 3, routeId], mode = ref6[0], routeType = ref6[1], route = ref6[2];
    }
    return [mode, routeType, route];
}

module.exports = transform;
