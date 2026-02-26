import { defineConfig } from "vitepress";
import serveStatic from "serve-static";
import path from "path";
const directory = path.resolve(__dirname, "../../../storage/www");

export default defineConfig({
	lang: "en-US",
	ignoreDeadLinks: true,
	outDir: directory + "/docs",
	base: "/docs",
	title: "AtmosphericX",
	description: "A modern, modular, and powerful weather dashboard platform for live streaming, spotting, and content creation.",
	themeConfig: {
		search: { provider: "local" },
		logo: "/logo.png",
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Installation", link: "/pages/installation/index" },
			{ text: "Configurations", link: "/pages/configurations/index" },
			{ text: "Widgets", link: "/pages/widgets/index" },
			{ text: "API", link: "/pages/api/index" },
			{ text: "Themes", link: "/pages/themes/index" },
			{ text: "Packages", link: "/pages/packages/index" },
		],
		sidebar: [
			{
				text: "Installation Guide",
				items: [
					{ text: "Installation", link: "/pages/installation/index" },
					{ text: "Troubleshooting", link: "/pages/installation/troubleshooting"},
					{ text: "Post-Installation [todo]", link: "/pages/installation/post-installation" },
					{ text: "Creating Accounts [todo]", link: "/pages/installation/creating-accounts" },
					{ text: "OBS Studio Setup [todo]", link: "/pages/installation/obs-setup" },
					{ text: "Updating [todo]", link: "/pages/installation/updating" },
				],
			},
			{
				text: "Configuration Guide",
				items: [
					{ text: "Introduction [todo]", link: "/pages/configurations/index" },
					{ text: "Core [todo]", link: "/pages/configurations/core" },
					{ text: "Sources [todo]", link: "/pages/configurations/sources" },
					{ text: "Events [todo]", link: "/pages/configurations/events" },
					{ text: "Display [todo]", link: "/pages/configurations/display" },
					{ text: "Placefiles [todo]", link: "/pages/configurations/placefiles" },
				],
			},
			{
				text: "Widgets Guide",
				items: [
					{ text: "Introduction", link: "/pages/widgets/index" },
					{ text: "Strings [todo]", link: "/pages/widgets/strings" },
					{ text: "Events [todo]", link: "/pages/widgets/events" },
					{ text: "Slideshow [todo]", link: "/pages/widgets/slideshow" },
					{ text: "Color Palette [todo]", link: "/pages/widgets/pallete" },
				],
			},
			{
				text: "RESTful / Websockets Guide",
				items: [
					{ text: "Introduction [todo] ", link: "/pages/api/index" },
					{ text: "Cache [todo]", link: "/pages/api/core" },
					{ text: "Placefiles [todo]", link: "/pages/api/core" },
					{ text: "Security [todo]", link: "/pages/api/security" },
					{ text: "Middleware [todo]", link: "/pages/api/middleware" },
				],
			},
			{
				text: "Theme Creation",
				items: [
					{ text: "Introduction [todo] ", link: "/pages/themes/index" },
					{ text: "Importing a theme [todo]", link: "/pages/themes/importing" },
					{ text: "Creating a theme [todo]", link: "/pages/themes/creating" },
					{ text: "Sharing a theme [todo]", link: "/pages/themes/sharing" },
				],
			},
			{
				text: "Submodules / Packages",
				items: [
					{ text: "Introduction [todo]", link: "/pages/api/index" },
					{ text: "atmosx-nwws-parser [todo]", link: "/pages/packages/parser" },
					{ text: "atmosx-pulse-point [todo]", link: "/pages/packages/pulsepoint" },
					{ text: "atmosx-placefile-parser [todo]", link: "/pages/packages/placefiles" },
					{ text: "atmosx-tempest-station [todo]", link: "/pages/packages/tempest" },
				],
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
