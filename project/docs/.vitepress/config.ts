import { defineConfig } from "vitepress";
import serveStatic from "serve-static";
import path from "path";
const directory = path.resolve(__dirname, "../../../storage/www");
const description = "AtmosphericX is a modern, modular weather dashboard and widget platform built for live streaming, storm chasing, meteorologists, first responders, and weather-aware individuals.";

export default defineConfig({
	lang: "en-US",
	ignoreDeadLinks: true,
	outDir: directory + "/documentation",
	base: "/documentation",
	title: "AtmosphericX",
	description: description,
	head: [
		['link', { rel: 'icon', href: '/assets/images/favicon.ico' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:title', content: 'AtmosphericX' }],
		['meta', { name: 'twitter:title', content: 'AtmosphericX' }],
		['meta', { property: 'og:url', content: '/' }],
		['meta', { name: 'twitter:description', content: description }],
		['meta', { property: 'og:description', content: description }],
		['meta', { property: 'og:image', content: '/assets/images/manifest.png' }],
		['meta', { name: 'twitter:image', content: '/assets/images/manifest.png' }],
	],
	themeConfig: {
		search: { provider: "local" },
		logo: "/logo.png",
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Installation", link: "/pages/installation/index" },
			{ text: "Configurations", link: "/pages/configurations/index" },
			{ text: "Widgets", link: "/pages/widgets/index" },
		],
		sidebar: [
			{
				text: "Installation",
				items: [
					{ text: "What is AtmosphericX?", link: "/pages/installation/index" },
					{ text: "Installation", link: "/pages/installation/installation" },
					{ text: "Post Installation", link: "/pages/installation/post-installation" },
					{ text: "Updating AtmosphericX", link: "/pages/installation/updating-atmosphericx" },
					{ text: "Troubleshooting", link: "/pages/installation/troubleshooting" },
					{ text: "Configurations", link: "/pages/installation/configurations" },
				],
			},
			{
				text: "Core Configurations",
				items: [
				    { text: "Introduction", link: "/pages/core/index" },
					//{ text: "Webhosting [todo]", link: "/pages/core/webhosting" },
					//{ text: "Internal [todo]", link: "/pages/core/internal" },
					//{ text: "Websockets [todo]", link: "/pages/core/websockets" },
					//{ text: "Webhooks [todo]", link: "/pages/core/webhooks" },
                    //{ text: "Streamber Bot [todo]", link: "/pages/core/streamber-bot" },
                    //{ text: "Forecasting [todo]", link: "/pages/core/forecasting" },
                    //{ text: "Third Party Services [todo]", link: "/pages/core/services" },
                    //{ text: "Slideshow [todo]", link: "/pages/core/slideshow" },
                    //{ text: "dBZ Intensity Colortables [todo]", link: "/pages/core/dbz_color_tables" },
                    //{ text: "Generic Colortables [todo]", link: "/pages/core/generic_color_tables" },
                    //{ text: "Dynamic Widgets [todo]", link: "/pages/core/dynamic_widgets" },
				],
			},
			{
				text: "Source Configurations",
				items: [
				    { text: "Introduction", link: "/pages/sources/index" },
					{ text: "Ingestion Sources", link: "/pages/sources/ingestion" },
					{ text: "Location Tracking Nodes", link: "/pages/sources/location-tracking-nodes" },
					{ text: "Local Storm Reports", link: "/pages/sources/local-storm-reports" },
					{ text: "Discussions", link: "/pages/sources/discussions" },
					{ text: "Sonde (Rise26)", link: "/pages/sources/sonde" },
					{ text: "CIMSS Probabilitiy", link: "/pages/sources/cimss" },
					{ text: "Nexrad Locations", link: "/pages/sources/nexrad" },
					{ text: "WxRadio (WeatherUSA)", link: "/pages/sources/nwr" },
					{ text: "Outages (SDSWeather)", link: "/pages/sources/outages" },
					{ text: "IoT Streams (SDSWeather)", link: "/pages/sources/streams" },
					{ text: "Tempest Weather Station", link: "/pages/sources/tempest" },
					{ text: "PulsePoint Respond", link: "/pages/sources/pulsepoint" },
				],
			},
			{
				text: "Event Configurations",
				items: [
				    { text: "Introduction", link: "/pages/events/index" },
					//{ text: "Event Ingestion Filtering [todo]", link: "/pages/events/filtering" },
					//{ text: "Event Tones [todo]", link: "/pages/events/tones" },
					//{ text: "Event Dictionary [todo]", link: "/pages/events/dictionary" },
					//{ text: "Event Themes [todo]", link: "/pages/events/themes" },
				],
			},
			{
				text: "Display Configurations",
				items: [
				    { text: "Introduction", link: "/pages/display/index" },
				],
			},
			{
				text: "Placefile Configurations",
				items: [
				    { text: "Introduction", link: "/pages/placefiles/index" },
				],
			},
			{
				text: "Widgets",
				items: [
					{ text: "Widget Introduction", link: "/pages/widgets/index" },
					{ text: "Alert Widget", link: "/pages/widgets/alerts" },
					{ text: "Palette Widget", link: "/pages/widgets/palette" },
					{ text: "Polywarn Widget", link: "/pages/widgets/polywarn" },
					{ text: "Stream Widget", link: "/pages/widgets/stream" },
					{ text: "Strings Widget", link: "/pages/widgets/strings" },
				]
			},
			{
				text: "RESTful API",
				items: [
					{ text: "API Introduction [todo]", link: "/pages/restful-api/index" },
					{ text: "/data [todo]", link: "/pages/restful-api/data" },
					{ text: "/placefiles [todo]", link: "/pages/restful-api/placefiles" },
					{ text: "/api [todo]", link: "/pages/restful-api/api" },
				]
			},
			{
				text: "Contributing",
				items: [
					{ text: "Creating Widgets [todo]", link: "/pages/contributing/creating-widgets" },
					{ text: "Creating Themes [todo]", link: "/pages/contributing/creating-themes" },
					{ text: "Submitting Bugs [todo]", link: "/pages/contributing/submitting-bugs" },
				]
			},
			{
				text: "Frontend",
				items: [
					{ text: "Frontend Introduction [todo]", link: "/pages/frontend/index" },
					{ text: "Classes [todo]", link: "/pages/frontend/classes" },
					{ text: "Static [todo]", link: "/pages/frontend/static" },
				]
			},
			{
				text: "Backend",
				items: [
					{ text: "Backend Introduction [todo]", link: "/pages/backend/index" },
					{ text: "Classes [todo]", link: "/pages/backend/classes" },
					{ text: "Static [todo]", link: "/pages/backend/static" },
				]
			},
			{
				text: "Internal Packages",
				items: [
					{ text: "Packages Introduction [todo]", link: "/pages/packages/index"},
					{ text: "atmosx-nwws-parser [todo]", link: "/pages/packages/nwws-parser"},
					{ text: "atmosx-pulse-point [todo]", link: "/pages/packages/pulse-point"},
					{ text: "atmosx-placefile-parser [todo]", link: "/pages/packages/placefile-parser"},
					{ text: "atmosx-tempest-station [todo]", link: "/pages/packages/tempest-station"},
				]
			},
		],
	},
	vite: {
		plugins: [
			{
				name: "dev-assets-middleware",
				apply: "serve",
				configureServer(server) {server.middlewares.use("/assets", serveStatic(directory + "/assets", { fallthrough: false })) },
			},
		],
		resolve: { alias: { "/assets": directory + "/assets" } },
		server: {
			allowedHosts: ["docs.scriptkitty.cafe", "localhost"],
			fs: { allow: [ directory + "/assets" ] },
			hmr: { overlay: true },
		},
	},

	transformPageData(pageData) {
		const pageTitle = pageData.params?.pageTitle;
		if (pageTitle) {
			pageData.title = pageTitle;
			pageData.frontmatter ??= {};
			pageData.frontmatter.title = pageTitle;
		}
	},
});
