<template lang="">
   <div class="container">

      <div v-if="loading">
         <div class="text-center my-5">
            <div class="spinner-border" role="status">
               <span class="visually-hidden">Loading...</span>
            </div>
            <p class="my-3">Загрузка</p>
         </div>
      </div>

      <div v-else-if="loadingError !== null">
         <div class="text-center my-5">
            <p class="my-3">{{loadingError}}</p>
         </div>
      </div>

      <form v-else @submit.prevent="submitHandle(v$.$validate())" class="row" v-show="calculatorVisibility">
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
               step="0.01"
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

         <div class="col-12 col-lg-6 mb-3">
            <button type="submit" class="btn btn-primary">Рассчет</button>
         </div>

      </form>

      <div class="row" v-show="!calculatorVisibility">
         <div class="col-12 pb-5">
            <button type="button" class="btn btn-default" @click="calculatorVisibility = true"><i class="fas mx-1 fa-arrow-left"></i> Вернуться к рассчету</button>
            <button type="button" class="btn btn-success" @click="printResult('.calculatedData')"><i class="fas mx-1 fa-print"></i>Распечатать коммерческое предложение</button>
         </div>
         <div class="col-12">
            <div class="container-fluid calculatedData fs-6">
               <p class="text-center">Бескаркасный ангар холодный, {{S}} м<sup>2</sup> ({{length}}м x {{width}}м)</p>
               <table class="table table-borderless">
                  <tbody>
                  <tr>
                     <td>
                        <img src="../assets/img/cold-angar-schema.jpg" height="160" alt="">
                     </td>
                     <td class="align-middle">
                        <b>Длинна</b> (B): {{length}}м<br>
                        <b>Ширина</b> (L): {{width}}м<br>
                        <b>Высота</b> (H): {{height}}м<br>
                        <b>Площадь</b>: {{S}}м<sup>2</sup>
                     </td>
                  </tr>
                  </tbody>
               </table>

               <table class="table table-bordered table-sm caption-top calcData">
                  <caption class="text-center">
                     <b>Перечень используемых материалов</b>
                  </caption>
                  <thead>
                     <tr>
                        <th>Наименование</th>
                        <th>Количество</th>
                        <th>Цена</th>
                        <th width="16%">Стоимость</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr v-for="material in costMaterial.materials" :key="'m_tbl_index' + material.material">
                        <td>{{material.title}}</td>
                        <td>{{material.amount}} {{material.units}}</td>
                        <td>{{ (material.cost).toLocaleString() }}</td>
                        <td>{{ (material.price).toLocaleString() }}</td>
                     </tr>
                  </tbody>	
                  <tfoot>
                     <tr>
                        <td colspan="3"><b>Итого</b></td>
                        <td><b>{{ (costMaterial.totalPrice).toLocaleString() }}</b></td>
                     </tr>
                  </tfoot>
               </table>

               <table class="table table-bordered table-sm caption-top calcData">
                  <caption class="text-center">
                     <b>Перечень работ</b>
                  </caption>
                  <thead>
                     <tr>
                        <th>Наименование</th>
                        <th width="16%">Стоимость</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr v-for="work in costWorks.works" :key="'w_tbl_index'+work.work">
                        <td>{{work.title}}</td>
                        <td>{{ (work.cost).toLocaleString() }}</td>
                     </tr>
                  </tbody>
                  <tfoot>
                     <tr>
                        <td><b>Итого</b></td>
                        <td><b>{{ (costWorks.totalPrice).toLocaleString() }}</b></td>
                     </tr>
                  </tfoot>
               </table>
               <p class="text-center"><b>Общая стоимость {{ (TotalPrice).toLocaleString() }} р. ({{ (TotalPricePerM).toLocaleString() }} руб./м<sup>2</sup>)</b></p>
            </div>
         </div>
      </div>
   </div>
</template>
<script>
import { defineComponent } from 'vue'
import InputText from 'primevue/inputtext';
import printMixin from '@/mixins/print'
import urls from '@/use/urls'
export default defineComponent({
   name: 'coldAngar',
   components:{
      InputText
   },
   mixins: [printMixin],
   data: ()=>({
      printTitle: 'Коммерческое предлоежение от ООО Сибангар - Ангар бескаркасный холодный',
   }),
})
</script>
<script setup>
import { ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { minValue, maxValue, helpers } from '@vuelidate/validators'
import { cfg } from '../assets/js/cgf'
import { coldValidators, widthtLessHeigh } from '../use/validators.js'
import { calculateMaterial, calculateCostMaterial, calculateCostWork } from '../use/calculate'

const loading = ref(true);
const loadingError = ref(null);
//Загрузка стоимости материалов и работ с сервера
let Cost = {};
fetch( urls.costUrl, {method: 'GET', cache: 'no-cache'})
   .then(res => res.json())
   .then(data => {
      Cost = data;
      loading.value = false;
   })
   .catch(err => {
      console.log((err));
      loadingError.value = 'Не удалось загрузить цены поставщиков. Попробуйте позже.'
      loading.value = false;
   });

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
         ({$params}) => `Минимальная высота строения должна быть не менее ${$params.min} м. `,
         minValue(cfg.limits.height.min)
      ),
      maxValue: helpers.withMessage(
         ({$params}) => `Максимальная высота строения должна быть не более половины ширины - ${$params.max} м. `,
         maxValue(+(width.value/2).toFixed(2))
      )
   },
   width:{
      ...coldValidators.width,
      heightWidth: helpers.withMessage(
         ({$params}) => `Максимальная ширина не должна быть более длинны - ${length.value} м. `,
         widthtLessHeigh(length)
      )
   }
}))
const v$ = useVuelidate(rules, { length, width, height, numberGates, heightGates, widthGates })

//Рассчет
const S = ref(0); //площадь
//Общая стоимость проекта
const TotalPrice = ref(0);
//Общая цена за 1м2
const TotalPricePerM = ref(0);

//перечень и стоимость материалов
const costMaterial = ref(
   {
      totalPrice: 0,
      materials: []
   }
);
//Перечеень и стоимость работ
const costWorks = ref(
   {
      totalPrice: 0,
      works: []
   }
);

const submitHandle = async function (isFormCorrect){
   submitted.value = true;
   isFormCorrect
      .then(res => {
         if (res)
         {
            calculatorVisibility.value = false; //Выключаем отображение формы
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
            
            let materialsAmount = calculateMaterial(cfg, length.value, width.value, height.value, numberGates.value, heightGates.value, widthGates.value);
            costMaterial.value = calculateCostMaterial(cfg, Cost, materialsAmount);
            costWorks.value = calculateCostWork(cfg, Cost, materialsAmount, numberGates.value, S.value, costMaterial.value.totalPrice);
            TotalPrice.value = +( costMaterial.value.totalPrice + costWorks.value.totalPrice ).toFixed(2);
            TotalPricePerM.value = +( TotalPrice.value / S.value).toFixed(2);
         }
      });
}
</script>