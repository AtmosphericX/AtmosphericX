---
layout: doc
next: 
    text: 'Location Tracking Nodes'
    link: /pages/sources/location-tracking-nodes
prev:
    text: 'Placfiles.jsonc'
    link: /pages/configurations/placefiles
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 23rd, 2026</b></small><br><br><br>

# Ingestion Sources (Events)
---
AtmosphericX offers **two methods** for ingesting events parsed by the [`atmosx-nwws-parser`](/pages/packages/atmosx-nwws-parser) package, which handles parsing of National Weather Service (NWS) products. Both methods provide access to NWS alerts and forecasts, but they differ in **reliability** and **speed**.

## National Weather Service API (Default)
This data source is the **most reliable**, as it comes directly from official NWS products. However, it is also the **slowest**, because it relies on a **REST API** for data retrieval. For faster access to alerts and forecasts, consider using the [NOAA Weather Wire Service](/sources/nwws). It offers a **near realtime** solution for ingesting NWS products, making it better suited for **time critical applications and uses**.

## NOAA Weather Wire Service (Recommended)
This data source is by far the **fastest**, using [XMPP](https://en.wikipedia.org/wiki/XMPP) to provide **near realtime** access to NWS products. It is the recommended method for ingesting NWS products, especially when timely alerts and forecasts are critical. 

However, note that it parses **raw text** products into a structured format, so it may contain occasional parsing bugs and may not be as reliable as the NWS API method. If you encounter issues with parsing or event generation, please submit a [PR Request](https://github.com/AtmosphericX/atmosx-nwws-parser/issues). But for the most part, it's a great and stable option as of lately.

::: danger Internet Connection Stability
`XMPP` requires a stable internet connection because it relies on a persistent connection to receive updates. With an unstable connection, you may experience missed updates or delays. In such cases, the NWS API method may be a more reliable option.
:::

:::info Credentials
The **NOAA Weather Wire Service (NWWS)** requires an active account to access NWS products. To request access, visit the [NWWS Request Access page](https://www.weather.gov/nwws/nwws_oi_request) and apply for an account. Once approved, you can configure your credentials in the `sources.jsonc` file to enable the NOAA Weather Wire Service data source.
:::

## National Weather Service API Settings
The `national_weather_service_settings` section in `atmosx_parser_settings` allows you to configure the interval settings and endpoint settings for the NWS API data source. This is important for managing how often the parser checks for new products and how it interacts with the NWS API endpoints.

## NOAA Weather Wire Settings
The `weather_wire_settings` section in `atmosx_parser_settings` allows you to configure how the NOAA Weather Wire Service client behaves, including credentials, reconnections, caching, and alert preferences.

### client_credentials
This manages the credentials required to access **NOAA Weather Wire Service (NWWS)** products via XMPP. You must have an active NOAA Weather Wire Service account to use this data source.

### client_cache
The client cache stores previous events captured from XMPP stanzas, allowing AtmosphericX to reload events after a restart. The cache settings allow you to configure the database used for caching, including options for in-memory caching or persistent storage. This uses a SQLite database located under `atmosx_parser_settings.database`

### alert_preferences
The alert preferences section allows you to specify which type of NWS products you'd like to receive. This is useful for filtering VTEC, UGC, and raw text events without having to fully parse them. You can also choose between CAP (XML) or raw text products, depending on your needs and preferences. 

::: danger CAP vs Raw Text Products
CAP (Common Alerting Protocol) products are structured in XML format and provide a standardized way to represent alerts. They are generally more reliable for parsing and event generation; however, they aren't as fast as raw text stanzas and are similar to requesting from the NWS API without having to wait for the REST API. Raw text products are considered faster.
:::

## global_settings
The global settings handle how polygon generation and event creation is handled between the NWS API and NOAA Weather Wire Service data sources. This is important for ensuring that events are generated consistently across both data sources, regardless of which one is enabled. The global settings allow you to configure how polygons are generated from NWS products, as well as how events are created and structured based on the parsed data.

## Conclusion
In summary, AtmosphericX provides two methods for ingesting products parsed by the `atmosx-nwws-parser` package: the NWS API method, which is more reliable but slower, and the NOAA Weather Wire Service method, which is faster but may have occasional parsing issues. Depending on your needs for reliability and speed, you can choose the data source that best fits your use case. For time critical applications, the NOAA Weather Wire Service method is recommended, while for applications where reliability is paramount, the NWS API method may be more suitable.

::: info NOAA WEATHER WIRE SERVICE RELIABILITY
While the NOAA Weather Wire Service method is generally faster, it may occasionally encounter parsing issues due to the nature of raw text products. If you experience any issues with event generation or parsing, please consider submitting a PR request to the [`atmosx-nwws-parser`](/pages/packages/atmosx-nwws-parser) repository to help improve the reliability of this data source.

At this time, it is stable for most use cases, though improvements are ongoing. Your contributions are greatly appreciated!
:::