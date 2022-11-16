<template lang="">
	<div class="container">
		<form @submit.prevent="submitHandle(v$.$validate())" class="row" v-show="calculatorVisibility">
			<div class="col-12 mb-3">
				<p>Введите желаемые параметры. Обязательными к заполнению являются поля формы, помеченные звездочкой (*).</p>
			</div>
			<div class="col-12 col-lg-6 mb-3">
				<label for="length" class="pb-1">Длинна строения *</label>
				<InputText id="length"
					class="w-100"
					type="number"
					:class="{'p-invalid' : submitted && v$.length.$invalid}"
					v-model.number="length"
				/>
				<span v-if="submitted && (v$.length.$error || v$.length.$invalid)">
					<span id="length-error" v-for="(error, index) of v$.length.$silentErrors" :key="index">
						<small class="p-error">{{error.$message}}</small>
					</span>
				</span>
			</div>

			<div class="col-12 col-lg-6 mb-3">
				<label for="width" class="pb-1">Ширина строения *</label>
				<InputText id="width" 
					class="w-100"
					type="number"
					:class="{'p-invalid' : submitted && v$.width.$invalid}"
					v-model.number="width"
				/>
				<span v-if="submitted && (v$.width.$error || v$.width.$invalid)">
					<span id="length-error" v-for="(error, index) of v$.width.$silentErrors" :key="index">
						<small class="p-error">{{error.$message}}</small>
					</span>
				</span>
			</div>

			<div class="col-12 col-lg-6 mb-3">
				<label for="height" class="pb-1">Минимальная высота купола</label>
				<InputText id="height" class="w-100"
					v-model.number="height"
					type="number"
					:class="{'p-invalid' : submitted && v$.height.$invalid }"
				/>
				<span v-if="submitted && (v$.height.$error || v$.height.$invalid)">
					<span id="length-error" v-for="(error, index) of v$.height.$silentErrors" :key="index">
						<small class="p-error">{{error.$message}}</small>
					</span>
				</span>
			</div>

			<div class="col-12 col-lg-6 mb-3">
				<label for="numberGates" class="pb-1">Количество ворот</label>
				<InputText id="numberGates" class="w-100"
					v-model.number="numberGates"
					type="number"
					:class="{'p-invalid' : submitted && v$.numberGates.$invalid }"
				/>
				<span v-if="submitted && (v$.numberGates.$error || v$.numberGates.$invalid)">
					<span id="length-error" v-for="(error, index) of v$.numberGates.$silentErrors" :key="index">
						<small class="p-error">{{error.$message}}</small>
					</span>
				</span>
			</div>

			<!-- <div class="col-12 col-lg-6 mb-3">
				<label for="heightGates" class="pb-1">Высота ворот</label>
				<InputText id="heightGates" class="w-100"
				   v-model.number="heightGates"
				   type="number"
				   :class="{'p-invalid' : submitted && v$.heightGates.$invalid }"
				/>
				<span v-if="submitted && (v$.heightGates.$error || v$.heightGates.$invalid)">
					<span id="length-error" v-for="(error, index) of v$.heightGates.$silentErrors" :key="index">
						<small class="p-error">{{error.$message}}</small>
					</span>
				</span>
			</div> -->

			<!-- <div class="col-12 col-lg-6 mb-3">
				<label for="widthGates" class="pb-1">Ширина ворот</label>
				<InputText id="widthGates" class="w-100"
				   v-model.number="widthGates"
				   type="number"
				   :class="{'p-invalid' : submitted && v$.widthGates.$invalid }"
				/>
				<span v-if="submitted && (v$.widthGates.$error || v$.widthGates.$invalid)">
					<span id="length-error" v-for="(error, index) of v$.widthGates.$silentErrors" :key="index">
						<small class="p-error">{{error.$message}}</small>
					</span>
				</span>
			</div> -->

			<div class="col-12 col-lg-6 mb-3">
				<button type="submit" class="btn btn-primary">Рассчет</button>
			</div>

		</form>

        <div class="row" _v-show="!calculatorVisibility">
            <div class="col-12 pb-5">
				<button type="button" class="btn btn-default" @click="calculatorVisibility = true">Вернуться к рассчету</button>
                <button type="button" class="btn btn-primary" @click="printResult">Распечатать коммерческое предложение</button>
			</div>
			<div class="col-12">
				<div class="container-fluid calculatedData fs-6">
					<p class="text-center">Бескаркасный ангар холодный, {{S}} м<sup>2</sup> ({{length}}м x {{width}}м)</p>
					<table class="table table-borderless">
						<tbody>
						<tr>
							<td>
								<!-- <img src="../assets/img/schema1.jpg" alt=""> -->
							</td>
							<td class="align-middle">
								<b>Длинна</b>: {{length}}м<br>
								<b>Ширина</b>: {{width}}м<br>
								<b>Высота</b>: {{height}}м<br>
								<b>Площадь</b>: {{S}}м<sup>2</sup>
							</td>
						</tr>
						</tbody>
					</table>

					<!-- <table class="table table-bordered table-sm caption-top calcData">
						<caption class="text-center">
							<b>Перечень используемых материалов</b>
						</caption>
						<thead>
							<tr>
								<th>Наименование</th>
								<th>Количество</th>
								<th>Цена</th>
								<th>Стоимость</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(index, material) in costMaterial" :key="">
								<td>Металл оцинкованный 1,2 мм</td>
								<td>{{weightStripe}} т.</td>
								<td>{{cfg.cost.steel_12}}</td>
								<td>{{amountMaterial.steel_12}}</td>
							</tr>
							
						<tfoot>
							<tr>
								<td colspan="3"><b>Итого</b></td>
								<td><b>{{amountMaterialTotal}}</b></td>
							</tr>
						</tfoot>
					</table> -->

					<!-- <table class="table table-bordered table-sm caption-top calcData">
						<caption class="text-center">
							<b>Перечень работ</b>
						</caption>
						<thead>
							<tr>
								<th>Наименование</th>
								<th>Стоимость</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Монтаж свай и уголка</td>
								<td>{{amountWork.installationPile}}</td>
							</tr>
							
						</tbody>
						<tfoot>
							<tr>
								<td><b>Итого</b></td>
								<td><b>{{amountWorklTotal}}</b></td>
							</tr>
						</tfoot>
					</table>
					<p class="text-center"><b>Обзая стоимость {{TotalPrice}} р. ({{TotalPricePerM}}р/1м<sup>2</sup>)</b></p> -->
				</div>
			</div>
		</div>

	</div>
</template>
<script>
import { defineComponent } from 'vue'
import InputText from 'primevue/inputtext';
export default defineComponent({
	name: 'coldAngar',
	components:{
		InputText
	}
})
</script>
<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, inject } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { minValue, maxValue, required, helpers } from '@vuelidate/validators'
import { cfg } from '../assets/js/cgf'
import { coldValidators } from '../use/validators.js'
import { calculateMaterial, calculateCostMaterial, calculateCostWork } from '../use/calculate'


let Cost = {};
fetch('/assets/js/cost.json').then(res => res.json()).then(data => {Cost = data})

//Вводные данные
const length = ref();   //Длиинна
const width = ref();    //Ширина
const height = ref();   //Высота
const numberGates = ref();    // количество ворот
const heightGates = ref(cfg.const.heightGate);    //Высота ворот
const widthGates = ref(cfg.const.widthGate);     //Ширина ворот

const calculatorVisibility = ref(true);
const submitted = ref(false);

const rules = computed(() => ({
	...coldValidators,
	height: {
		//required: helpers.withMessage('Поле обязательно к заполнению', required),
		minValue: helpers.withMessage(
			({$params}) => `Минимальная высота строения должна быть не менее ${$params.min} м`,
			minValue(cfg.limits.height.min)
		),
		maxValue: helpers.withMessage(
			({$params}) => `Максимальная высота строения должна быть не более половины ширины - ${$params.max} м`,
			//maxValue(cfg.limits.height.max)
			maxValue(+(width.value/2).toFixed(2))
		)
	},
}))
const v$ = useVuelidate(rules, { length, width, height, numberGates, heightGates, widthGates })

//Рассчет
const S = ref(0); //площадь



const amountMaterialTotal = ref(0);
const amountWorklTotal = ref(0);


const submitHandle = async function (isFormCorrect){
	submitted.value = true;
	isFormCorrect
		.then(res => {
			if (res)
			{
				//calculatorVisibility.value = false; //Выключаем отображение формы
				//Значения по дефолту
				if (!height.value)
				{
					height.value = width.value / 2;
				}
			    if (!numberGates.value)
				{
					numberGates.value = cfg.limits.numberGates.min;
				}
			    if (!heightGates.value)
				{
					heightGates.value = cfg.limits.heightGates.min;
				}
			    if (!widthGates.value)
				{
					widthGates.value = cfg.limits.widthGates.min;
				}
				// для утпеленного ангара
			    // if (thicknessInsulation !== null && !thicknessInsulation.value)
				// {
				// 	thicknessInsulation.value = cfg.limits.thicknessInsulation.min;
				// }
				
				//Вычисление площади
				S.value = length.value * width.value || 0;
				
				//console.log(Cost);
				let materialsAmount = calculateMaterial(cfg, length.value, width.value, height.value, numberGates.value, heightGates.value, widthGates.value);
                //let costMaterial = ;
                const costMaterial = ref(calculateCostMaterial(cfg, Cost, materialsAmount));
                let costWorks = calculateCostWork(cfg, Cost, materialsAmount, numberGates.value, S.value, costMaterial.value.totalPrice);
                let CostPerS = (costMaterial.totalPrice + costWorks.totalPrice) / S.value;
				console.log(costMaterial, costWorks);
                console.log('Итоговая цена за квадрат', CostPerS)
			}
		})
	;
}

</script>