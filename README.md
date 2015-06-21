# Busse API for Helsinki

This proxy doesn't do anything else than:

* Handles load
* [Transforms](https://github.com/kimmobrunfeldt/busse-api-helsinki/blob/master/transform.js) response to a nicer format

## API

This proxy API returns data in JSON format. Original API is here: http://dev.hsl.fi/siriaccess/vm/json?operatorRef=HSL

This API fetches newest data from original API in 1000ms interval.

### Response format

```
{
    "vehicles": [
        [Vehicle data object],
        [Vehicle data object],
        ...
    ]
}
```

### Vehicle data

These are my findings about the data.

Parameter | Type | Description
--------- | ---- | -----------
**id**               | *String*  |  Bus identifier. Example: `TKL_34`
**line**             | *String*  |  Bus line name. Example: `90M`
**latitude**         | *Number*  |  Latitude coordinate. Example: `61.5192917`
**longitude**        | *Number*  |  Longitude coordinate. Example: `23.6257467`
**rotation**         | *Number*  |  Rotation of a bus. *0* to *360*. *0* means the bus is stopped. East would be *90*. Example: `12`.
**origin**           | *String*  |  Origin of a bus route. Example: `Hermia`
**destination**      | *String*  |  Destination of bus route. Example: `Särkitie`
**operator**         | *String*  |  Bus operator name. Example: `TKL` or `Paunu`.
**direction**        | *String*  |  Determines which direction bus is headed to. Example: `2`
**validUntil**       | *Date*    |  Data is valid until this date time.. I guess?. Example: `2014-11-13T20:56:34.007Z`


### Errors

If error occured when fetching vehicle data from original API, response contains *error* key:

```json
{
    "error": true
}
```
