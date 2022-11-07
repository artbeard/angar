<template>
	<TabView>
		<TabPanel v-for="tab in tabs" :key="tab.title" :header="tab.title">
			<component :is="tab.content"></component>
		</TabPanel>
	</TabView>
</template>

<script>
import { defineComponent, defineAsyncComponent, markRaw } from 'vue'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

export default defineComponent({
	name: 'App',
	components: {
		TabView,
		TabPanel
	},
	data: () => ({
		tabs: [
			{
				title: 'Ангар холодный', content: markRaw(defineAsyncComponent(
					() => import('./components/cold-angar.vue')
				))
			},
			{
				title: 'Ангар утепленный', content: markRaw(defineAsyncComponent(
					() => import('./components/insulated-angar.vue')
				))
			},
		],
	}),
})
</script>

<style lang="scss" scoped>
.tabview-custom {
	i, span {
		vertical-align: middle;
	}

	span {
		margin: 0 .5rem;
	}
}

.p-tabview p {
	line-height: 1.5;
	margin: 0;
}
</style>
