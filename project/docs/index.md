---
layout: home
hero:
  name: "AtmosphericX"
  tagline: "v8.0.0-beta"
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
      link: https://discord.gg/YAEjtzU3E8
    - theme: alt
      text: Project Board
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
			title: 'Project Developer',
			links: [
				{ icon: 'github', link: 'https://github.com/k3yomi' },
				{ icon: 'twitter', link: 'https://twitter.com/KiyomiWx' }
			]
		},
		{
			avatar: 'https://pbs.twimg.com/profile_images/1787879680558743554/RMFWOj1T_400x400.jpg',
			name: 'StarflightWx',
			title: 'Co-Developer',
			links: [
				{ icon: 'github', link: 'https://github.com/Starflight24' },
				{ icon: 'twitter', link: 'https://x.com/starflightVR' }
			]
		},
		{
			avatar: 'https://pbs.twimg.com/profile_images/1614731133714825223/LoGNRgOp_400x400.jpg',
			name: 'CJ Ziegler',
			title: 'QA Tester / Storm Chaser',
			links: [
				{ icon: 'youtube', link: 'https://www.youtube.com/@CJZiegler' },
				{ icon: 'twitter', link: 'https://x.com/StormChaser_CJ' }
			]
		}
	]
	const gallery = [
		{ src: '/assets/images/demos/d2.png', alt: 'Settings Panel', caption: 'KiyoWx - Demo Showcase' },
		{ src: '/assets/images/demos/d1.gif', alt: 'Settings Panel', caption: 'KiyoWx - Demo Showcase v2' },
		{ src: '/assets/images/demos/d3.png', alt: 'Settings Panel', caption: 'nbur21wx - Rounded Theme' },
		{ src: '/assets/images/demos/d4.gif', alt: 'Settings Panel', caption: 'CJ Ziegler - Live Storm Chase' },
		{ src: '/assets/images/demos/d5.gif', alt: 'Settings Panel', caption: 'AaronOnAir - Live Storm Chase' },
		{ src: '/assets/images/demos/d6.gif', alt: 'Settings Panel', caption: 'KiyoWx - Recorded Storm Chase' },
	]

	const Gallery = {
		props: ['items'],
		template: `
			<div class="gallery-container">
				<div class="gallery-grid">
					<figure v-for="(item, i) in items" :key="i" class="gallery-item">
						<img :src="item.src" :alt="item.alt" class="gallery-image" @click="openModal(item.src)" />
						<figcaption class="gallery-image-credit">{{ item.caption }}</figcaption>
					</figure>
				</div>
			</div>
		`
	}
</script>

<VPTeamPageTitle>
  <template #lead>
	Ignite your stream with AtmosphericX's powerful fully customizable widget and dashboard framework, immersive tools that turn passive viewers into active participants and boost engagement like never before. Elevate every broadcast with dynamic visuals, real time data, and interactive elements crafted for storm chasers, weather fans, and every curious viewer in between.
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
  <template #title>Meet the people behind the project</template>
  <template #lead>
    Our dedicated team works tirelessly to bring you the best streaming experience possible.
  </template>
</VPTeamPageTitle>
<VPTeamMembers :members />