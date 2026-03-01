import{_ as n}from"./chunks/logo.PPNoggWL.js";import{_ as a,o as e,c as i,ag as t}from"./chunks/framework.DQQHyi2x.js";const _=JSON.parse('{"title":"Core Configurations","description":"","frontmatter":{"layout":"doc","next":{"text":"Sources.jsonc","link":"/pages/configurations/sources"},"prev":{"text":"Configuration Introduction","link":"/pages/configurations/index"}},"headers":[],"relativePath":"pages/configurations/core.md","filePath":"pages/configurations/core.md"}'),o={name:"pages/configurations/core.md"};function p(r,s,c,l,g,d){return e(),i("div",null,[...s[0]||(s[0]=[t('<img src="'+n+`" alt="AtmosphericX Logo" width="200" style="display:block;margin:0 auto;"><small class="page-author">Written By: <b>KiyoWx</b> &amp; <b>StarflightWx</b></small><br><small class="last-updated">Last Updated: <b>Feb 27th, 2026</b></small><br><h1 id="core-configurations" tabindex="-1">Core Configurations <a class="header-anchor" href="#core-configurations" aria-label="Permalink to &quot;Core Configurations&quot;">​</a></h1><hr><p>The <code>core.jsonc</code> file is the <strong>central configuration file</strong> for AtmosphericX. It controls the behavior of your entire instance, including:</p><p>Key functions include:</p><ul><li><strong>Web Hosting:</strong> login requirements, HTTPS, ports, cache control, rate limiting, and account protection.</li><li><strong>WebSocket Management:</strong> connection limits, priority handling, and secondary sockets.</li><li><strong>Automation &amp; Scheduling:</strong> version checks, request timeouts, and scheduled updates.</li><li><strong>Integrations:</strong> Discord webhooks and StreamerBot connectivity.</li><li><strong>Dashboard Experience:</strong> forecasting sources, third party services, slideshow graphics, radar intensity labels, and color scales.</li></ul><p>Editing this file allows you to customize the functionality and appearance of your AtmosphericX instance to suit your needs.</p><h2 id="configuration-map" tabindex="-1">Configuration Map <a class="header-anchor" href="#configuration-map" aria-label="Permalink to &quot;Configuration Map&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>core.jsonc</span></span>
<span class="line"><span>├── core:hash</span></span>
<span class="line"><span>├── web_hosting_settings</span></span>
<span class="line"><span>│   ├── is_login_required</span></span>
<span class="line"><span>│   ├── is_guest_access_allowed</span></span>
<span class="line"><span>│   └── settings</span></span>
<span class="line"><span>│       ├── is_https</span></span>
<span class="line"><span>│       ├── port_number</span></span>
<span class="line"><span>│       ├── account_protection</span></span>
<span class="line"><span>│       ├── ratelimiting</span></span>
<span class="line"><span>│       └── certification_paths</span></span>
<span class="line"><span>├── internal_settings</span></span>
<span class="line"><span>├── websocket_settings</span></span>
<span class="line"><span>│   ├── maximum_connections_per_ip</span></span>
<span class="line"><span>│   ├── priority_sockets</span></span>
<span class="line"><span>│   └── secondary_sockets</span></span>
<span class="line"><span>├── webhook_settings</span></span>
<span class="line"><span>│   ├── general_events</span></span>
<span class="line"><span>│   ├── critical_events</span></span>
<span class="line"><span>│   └── misc_events</span></span>
<span class="line"><span>├── streamer_bot_settings</span></span>
<span class="line"><span>├── forecasting</span></span>
<span class="line"><span>├── services</span></span>
<span class="line"><span>├── slideshow</span></span>
<span class="line"><span>├── dbz_intensity</span></span>
<span class="line"><span>└── color_intensity</span></span></code></pre></div>`,13)])])}const m=a(o,[["render",p]]);export{_ as __pageData,m as default};
