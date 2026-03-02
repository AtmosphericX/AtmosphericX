import { defineConfig } from "vitepress";
import serveStatic from "serve-static";
import path from "path";
const directory = path.resolve(__dirname, "../../../storage/www");

export default defineConfig({
	lang: "en-US",
	ignoreDeadLinks: true,
	outDir: directory + "/documentation",
	base: "/documentation",
	title: "AtmosphericX",
	description: "A modern, modular, and powerful weather dashboard platform for live streaming, spotting, and content creation.",
	themeConfig: {
		search: { provider: "local" },
		logo: "/logo.png",
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Installation", link: "/pages/installation/index" },
			{ text: "Configurations", link: "/pages/configurations/index" },
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
				],
			},
			{
				text: "Configurations",
				items: [
					{ text: "Configurations Introduction", link: "/pages/configurations/index" },
					{ text: "Core.jsonc", link: "/pages/configurations/core" },
					{ text: "Sources.jsonc", link: "/pages/configurations/sources" },
					{ text: "Events.jsonc", link: "/pages/configurations/events" },
					{ text: "Display.jsonc", link: "/pages/configurations/display" },
					{ text: "Placefiles.jsonc", link: "/pages/configurations/placefiles" },
				],
			},
			{
				text: "Widgets",
				items: [
					{ text: "Widget Introduction", link: "/pages/widgets/index" },
					{ text: "Alerts Widget [todo]", link: "/pages/widgets/alerts" },
					{ text: "Palette Widget [todo]", link: "/pages/widgets/palette" },
					{ text: "Polywarn Widget [todo]", link: "/pages/widgets/polywarn" },
					{ text: "Stream Widget [todo]", link: "/pages/widgets/streams" },
					{ text: "Strings Widget [todo]", link: "/pages/widgets/strings" },
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
				text: "Frontend Codebase",
				items: [
					{ text: "Frontend Introduction [todo]", link: "/pages/frontend/index" },
					{ text: "Classes [todo]", link: "/pages/frontend/classes" },
					{ text: "Static [todo]", link: "/pages/frontend/static" },
				]
			},
			{
				text: "Internal Packages",
				items: [
					{ text: "Internal Packages Introduction [todo]", link: "/pages/packages/index"},
					{ text: "ATMOSX-NWWS-PARSER [todo]", link: "/pages/packages/nwws-parser"},
					{ text: "ATMOSX-PULSE-POINT [todo]", link: "/pages/packages/pulse-point"},
					{ text: "ATMOSX-PLACEFILE-PARSER [todo]", link: "/pages/packages/placefile-parser"},
					{ text: "ATMOSX-TEMPEST-STATION [todo]", link: "/pages/packages/tempest-station"},
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
			allowedHosts: ["atmosx-documentation.scriptkitty.cafe", "localhost"],
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
