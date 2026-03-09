---
layout: home
hero:
  name: "AtmosphericX"
  tagline: "8.0.0.031 (beta-pre-dashboard-testing)"
  image:
    src: /logo.png
    alt: AtmosphericX Logo
  actions:
    - theme: brand
      text: Documentation
      link: /pages/installation/index
    - theme: alt
      text: GitHub
      link: https://github.com/AtmosphericX
    - theme: alt
      text: Discord
      link: https://atmosphericx-discord.scriptkitty.cafe
    - theme: alt
      text: Development Board
      link: https://github.com/users/AtmosphericX/projects/2
--- 

<script setup>
	import { VPTeamPage, VPTeamPageTitle, VPTeamMembers } from 'vitepress/theme'
	import { ref } from 'vue'
	const modalImage = ref(null)
	function openModal(src) { modalImage.value = src}
	function closeModal() { modalImage.value = null }
	const members = [
		{
			avatar: 'https://avatars.githubusercontent.com/u/54733885?v=4',
			name: 'KiyoWx',
			title: 'Project Developer & President @ ATMSX Storm Chasing',
			links: [
				{ icon: 'github', link: 'https://github.com/k3yomi' },
				{ icon: 'twitter', link: 'https://twitter.com/KiyomiWx' }
			]
		},
		{
			avatar: 'https://pbs.twimg.com/profile_images/1787879680558743554/RMFWOj1T_400x400.jpg',
			name: 'StarflightWx',
			title: 'Co-Developer & Vice President @ ATMSX Storm Chasing',
			links: [
				{ icon: 'github', link: 'https://github.com/Starflight24' },
				{ icon: 'twitter', link: 'https://x.com/starflightVR' }
			]
		},
		{
			avatar: 'https://pbs.twimg.com/profile_images/1614731133714825223/LoGNRgOp_400x400.jpg',
			name: 'CJ Ziegler',
			title: 'Beta Tester & Storm Chaser @ CJZiegler Media',
			links: [
				{ icon: 'youtube', link: 'https://www.youtube.com/@CJZiegler' },
				{ icon: 'twitter', link: 'https://x.com/StormChaser_CJ' }
			]
		}
	]
	const gallery = [
		{ src: '/assets/images/demos/d2.png', alt: '', caption: 'Credits: KiyoWx (Demo Showcase v7)' },
		{ src: '/assets/images/demos/d8.gif', alt: '', caption: 'Credits: CJ Ziegler (03.06.26)' },
		{ src: '/assets/images/demos/d9.gif', alt: '', caption: 'Credits: CJ Ziegler (03.05.26)' },
		{ src: '/assets/images/demos/d4.gif', alt: '', caption: 'Credits: CJ Ziegler (01.21.26)' },
		{ src: '/assets/images/demos/d5.gif', alt: '', caption: 'Credits: AaronOnAir (06.05.26)' },
		{ src: '/assets/images/demos/d7.gif', alt: '', caption: 'Credits: CJ Zielger (02.14.26)' },
	]

	const history = [
		{ src: '/assets/images/history/h1.gif', alt: '', caption: 'AtmosphericX v1 Interface (Released Sep. 2023)' },
		{ src: '/assets/images/history/d2.png', alt: '', caption: 'AtmosphericX v1 Dashboard (Released Sep. 2023)' },
		{ src: '/assets/images/not-found.png', alt: '', caption: 'AtmosphericX v2 (Released Dec. 2023)' },
		{ src: '/assets/images/not-found.png', alt: '', caption: 'AtmosphericX v3 (Released Feb. 2024)' },
		{ src: '/assets/images/history/d4.png', alt: '', caption: 'AtmosphericX v4 Interface (Released May. 2024)' },
		{ src: '/assets/images/history/d3.png', alt: '', caption: 'AtmosphericX v4 Dashboard (Released May. 2024)' },
		{ src: '/assets/images/history/d5.png', alt: '', caption: 'AtmosphericX v5 Dashboard (Released Jan. 2025)' },
		{ src: '/assets/images/history/d6.png', alt: '', caption: 'AtmosphericX v6 Dashboard (Released Mar. 2025)' },
		{ src: '/assets/images/history/d7.png', alt: '', caption: 'AtmosphericX v7 Dashboard (Released May. 2025)' },
		{ src: '/assets/images/history/d8.png', alt: '', caption: 'AtmosphericX v7 Interface (Released May. 2025)' },
		{ src: '/assets/images/history/d9.png', alt: '', caption: 'AtmosphericX v8 (beta) (Released March. 2026)' },
		{ src: '/assets/images/demos/d8.gif', alt: '', caption: 'AtmosphericX v8 (beta) Widgets (Released March. 2026)' },
	]

	const Gallery = { props: ['items'],
		template: `<div class="gallery-container"><div class="gallery-grid"><figure v-for="(item, i) in items" :key="i" class="gallery-item"><img :src="item.src" :alt="item.alt" class="gallery-image" @click="openModal(item.src)" /><figcaption class="gallery-image-credit">{{ item.caption }}</figcaption></figure></div></div>`
	}
</script>

<VPTeamPageTitle>
  <template #lead>
	AtmosphericX is a modern, modular, and powerful weather dashboard and widget project designed to be self hosted for live streaming, storm spotting, storm chasing, meteorologists, first responders, and weather enthusiasts who want better visibility into current conditions and severe weather events.
  </template>
</VPTeamPageTitle>


<div class="gallery-container">
	<div class="gallery-grid">
		<figure v-for="(item, i) in gallery" :key="i" class="gallery-item">
			<img :src="item.src" :alt="item.alt" class="gallery-image" @click="openModal(item.src)" />
			<figcaption class="gallery-image-credit">{{ item.caption }}</figcaption>
		</figure>
	</div>
</div>

<div v-if="modalImage" class="modal-overlay" @click="closeModal">
	<div class="modal-content">
		<img :src="modalImage" alt="Modal Image" />
	</div>
</div>

<VPTeamPageTitle>
  <template #title>AtmosphericX's History (2023-2026)</template>
  <template #lead>
    AtmosphericX has evolved significantly since its creation in late 2023, growing from a simple weather project into a comprehensive solution for weather enthusiasts and professionals alike.
  </template>
</VPTeamPageTitle>

<div class="gallery-container">
	<div class="gallery-grid">
		<figure v-for="(item, i) in history" :key="i" class="gallery-item">
			<img :src="item.src" :alt="item.alt" class="gallery-image" @click="openModal(item.src)" />
			<figcaption class="gallery-image-credit">{{ item.caption }}</figcaption>
		</figure>
	</div>
</div>

<div v-if="modalImage" class="modal-overlay" @click="closeModal">
	<div class="modal-content">
		<img :src="modalImage" alt="Modal Image" />
	</div>
</div>



<VPTeamPageTitle>
  <template #title>Meet the people behind the project</template>
  <template #lead>
    AtmosphericX is powered by a dedicated community that works tirelessly to create the best streaming experience possible. From beta testers and developers to documentation writers, every contributor helps move the project forward.
  </template>
</VPTeamPageTitle>
<VPTeamMembers :members />