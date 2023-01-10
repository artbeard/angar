<template>
	<TabView>
		<TabPanel v-for="tab in tabs" :key="tab.title" :header="tab.title">
			<component :is="tab.content"></component>
		</TabPanel>
	</TabView>
	<print-result ref="printResult">
		<template #header>
			<table class="table table-borderless my-0 mb-3">
				<tbody>
					<tr>
						<td style="width: 100px;"><img src="./assets/img/sibangar-logo.jpg" width="90" /></td>
						<td>ООО "Сибангар"<br>
							ИНН5507289170, ОГРН1225500010691, КПП550701001<br>
							644105, г. Омск, ул. 22-го Партсъезда, д. 97<br>
							тел. +7(965)975-58-29, адрес эл. почты sibangar55@gmail.com
						</td>
					</tr>
				</tbody>
			</table>
			<h1 class="text-center h5">Коммерческое предложение</h1>
		</template>
		<template #footer>
			<p>
				Коммерческое предложение дейсвтительно на {{new Date().toLocaleDateString()}}.
				<b>Цена окончательная и изменению не подлежит.</b>
				Все расходы по логистике включены в смету. Бетонные работы в смену <b>не&nbsp;включены</b> и оговариваются индивидуально в каждом случае.
				<b>Предоплата&nbsp;80%.</b>
			</p>
			<table class="table table-borderless py-3">
				<tbody>
					<tr>
						<td class="align-middle">С уважением, директор ООО "Сибангар"</td>
						<td class="align-middle" >
							<img src="./assets/img/sibangar-stamp.png" alt="" style="width: 150px" _width="100">
						</td>
						<td class="align-middle">Гильманов С.В.</td>
						<td class="align-middle text-primary">
							<img src="./assets/img/gilmanov-faсsimile.png" alt="" width="100">
						</td>
					</tr>
				</tbody>
			</table>
		</template>
	</print-result>
</template>

<script>
import { defineComponent, defineAsyncComponent, markRaw } from 'vue'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import printResult from '@/components/print-result.vue'

export default defineComponent({
	name: 'App',
	components: {
		TabView,
		TabPanel,
		printResult
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
