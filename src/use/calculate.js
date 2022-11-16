/**
 * Рассчет материалов для возведения ангара
 * @param {*} cfg специальные данные для рассчета (вес, установочные параметры)
 * @param number length длинна здания
 * @param number width ширина здания
 * @param number height высота купола
 * @param number numberGates количество ворот
 * @param number heightGates высота ворот //todo добавить расчет влезания ворот в торец
 * @param number widthGates ширина ворот
 * @param number|null thicknessInsulation толщина утепления. Если равна null то рассчет выполняется для холодного ангара
 * @returns массив вида
 *   'марка материала из cfg.material': {
 *       title: 'наименование материала',
 *       amount: колиечество материала,
 *       units: 'единицы измерения', приведение к тоннам или м**3
 *   }
 */
function calculateMaterial(cfg, length, width, height, numberGates, heightGates, widthGates, thicknessInsulation = null)
{
	const amount = [];
	//выбор толщины металла на купол
	let domeMaterial = 'steel_12';
    let endMaterial = 'steel_08';
	if ( width <= 12 )
	{
		domeMaterial = 'steel_08';
	}
	else if ( width <= 16 )
	{
		domeMaterial = 'steel_10';
	}
	/**
	 * Рассчет металла на купол
	 * @param number length 
	 * @param number height 
	 * @param number width 
	 * @param number | null thicknessInsulation 
	 * @returns Возвращает маасив [
	 *      вес металла купола,
	 *      вес металла на торцы,
	 *      объем под утеплитель, если передан параметр thicknessInsulation
	 *      ]
	 */
	function domeMetallWeight(length, height, width, thicknessInsulation = null)
	{
		if (thicknessInsulation !== null)
		{
			length += thicknessInsulation * 2;
			height += cfg.const.edgeInsulation + thicknessInsulation;
			width += (cfg.const.edgeInsulation + thicknessInsulation) * 2;
		}
		let domeMetalWeight = 0;
		let EndMetalWeight = 0;
		let VolumeInsulation = 0;
		//радиус купола l**2/4*h + h
		let R_dome = height/2 + width**2/(8*height);
		//Угол (при высоте, не равноей 2x ширины, мненее 180)
		let angle = 2 * Math.acos(1 - height/R_dome);
		//длинна одной полосы
		let L_stripe = angle * R_dome;
		//кол-во полос на купол
		let Number_stripe = Math.ceil(length / cfg.const.stripeWidth) + 2;
		domeMetalWeight = cfg.material[domeMaterial].weight * L_stripe * Number_stripe
		//Площаь торцов
		let S_end = 0.5 * (R_dome * L_stripe - (R_dome - height) * width);
		//Площадь металла с учетом формовки
		S_end = 2 * S_end / cfg.const.stripeWidth - numberGates * heightGates * widthGates;

		EndMetalWeight = cfg.material[endMaterial].weight * S_end;
		if (thicknessInsulation !== null)
		{
			VolumeInsulation = length * thicknessInsulation * L_stripe + S_end * thicknessInsulation;
		}
		return [domeMetalWeight, EndMetalWeight, VolumeInsulation];
	}

	//рассчет металла для внутреннего контура
	let [domeMetalWeight, EndMetalWeight] = domeMetallWeight(length, height, width);
	//Добавляем вес второго контура, если указано утепление
	if (thicknessInsulation !== null)
	{
		let [domeMetalWeightIns, EndMetalWeightIns, VolumeInsulation] = domeMetallWeight(length, height, width, thicknessInsulation);
		domeMetalWeight += domeMetalWeightIns;
		EndMetalWeight += EndMetalWeightIns;
		//------------------------------------------------------------------------------------------
		//Рассчет минваты (при необходимости)
		amount.push({
			mineralWool: {
				title: cfg.material.mineralWool.title,
				amount: VolumeInsulation * cfg.const.safetyFactor * cfg.material.mineralWool.weight / 1000,
				units: 'т'
			}
		})
	}
	//------------------------------------------------------------------------------------------
	
    //Рассчет веса стали для купола
	let domeMaterialCalc = {};
	domeMaterialCalc[domeMaterial] = {
		title: cfg.material[domeMaterial].title + ' (купол)',
		amount: domeMetalWeight / 1000,
		units: 'т',
        dome: true,
	};
	amount.push(
		domeMaterialCalc
	)
	//------------------------------------------------------------------------------------------

	//Рассчет металла на торцы
    let endMaterialCalc = {};
    endMaterialCalc[endMaterial] = {
        title: cfg.material[endMaterial].title + ' (торцы)',
        amount: EndMetalWeight / 1000,
        units: 'т',
        end: true
    };
	amount.push(endMaterialCalc);
	//------------------------------------------------------------------------------------------

	let P_withoutGates = (length + width) * 2 - numberGates * widthGates; //Периметр без учета ворот

	//Рассчет количества свай
	amount.push({
		pile_3_pneumatic_hammer: {
			title: cfg.material.pile_3_pneumatic_hammer.title,
			amount: Math.ceil(P_withoutGates / cfg.const.pilesDistance),
			units: 'шт.'
		}
	})
	//------------------------------------------------------------------------------------------

	//Рассчет количества обвязочного уголка
	amount.push({
		angle100x100x7: {
			title: cfg.material.angle100x100x7.title,
			amount: Math.ceil(
                P_withoutGates / cfg.material.angle100x100x7.minWidth
                ) * cfg.material.angle100x100x7.minWidth * cfg.material.angle100x100x7.weight / 1000,
			units: 'т'
		}
	})


    //------------------------------------------------------------------------------------------
	// //Рассчет арматуры
	// amount.push({
	// 	fitting_d12: {
	// 		title: cfg.material.fitting_d12.title,
	// 		amount: P_withoutGates * 4 * cfg.material.fitting_d12.weight /* * cfg.const.safetyFactor*/ / 1000,
	// 		units: 'т'
	// 	}
	// })
	// //------------------------------------------------------------------------------------------
	// //Расссчет бетона
	// amount.push({
	// 	concrete_m250: {
	// 		title: cfg.material.concrete_m250.title,
	// 		amount: P_withoutGates * cfg.const.basementHeight * (cfg.const.basementWidth + thicknessInsulation ?? 0) * cfg.const.safetyFactor,
	// 		units: 'м3'
	// 	}
	// })
	return amount;
}
export {calculateMaterial};






/**
 * Функция рассчета стоимости ворот
 * @param {*} cfg специальные данные для рассчета (вес, установочные параметры)
 * @param {*} cost Объект с ценами на материалы
 * @param number numberGates количество ворот
 * @param number heightGates высота ворот
 * @param number widthGates ширина ворот
 * @param number|null thicknessInsulation толщина утепления. Если равна null то рассчет выполняется для холодного ангара
 * @returns Объект вида
 *      gate: {
 *          title: `Ворота heightGates x widthGates`,
 *          amount: numberGates,
 *          units: 'шт'
 *          price:  стоимость одного
 *          cost: стоимость всего
 *      }
 */
function calculateCostGate(cfg, cost, numberGates, heightGates, widthGates, thicknessInsulation = null1)
{
	let costGate = thicknessInsulation ? cost.materials.gate_insulate_4x4 : cost.materials.gate_4x4;
    return {
		gate: {
			title: `${thicknessInsulation ? cfg.material.gate_insulate_4x4.title : cfg.material.gate_4x4.title}`,
			amount: numberGates,
			units: 'шт',
			price: costGate,
			cost: costGate * numberGates
		}
	}
}
export {calculateCostGate};
 
 /**
  * Функция рассчета стоимости комплекта крпежа
  * @param {*} cfg 
  * @param {*} cost 
  * @param number length 
  * @param number width 
  * @param number|null thicknessInsulation 
  * @returns Объект вида
  *      fasteners: {
  *          title: `Крепеж`,
  *          amount: количество комплектов,
  *          units: 'компл.'
  *          price:  стоимость одного
  *          cost: стоимость всего
  *      }
  */
function calculateCostFasteners(cfg, cost, length, width, thicknessInsulation = null)
{
	let amount = 1
	return {
		fasteners: {
			title: `${cfg.material.gate.fasteners}`,
			amount: amount,
			units: 'компл.',
			price: cost.materials.fasteners,
			cost: cost.materials.fasteners * amount
		}
	}
}
export {calculateCostFasteners};

/**
 * Фцнкция рассчета стоимости опалубки
 * todo уточнить методику рассчета
 * @param {*} cfg 
 * @param {*} cost 
 * @param number length 
 * @param number width 
 * @returns Объект вида
  *      formwork: {
  *          title: `опалубка`,
  *          amount: количество комплектов,
  *          units: 'компл.'
  *          price:  стоимость одного
  *          cost: стоимость всего
  *      }
 */
// function calculateCostFormwork(cfg, cost, length, width)
// {
// 	let amount = 1
// 	return {
// 		formwork: {
// 			title: `${cfg.material.gate.formwork}`,
// 			amount: amount,
// 			units: 'компл.',
// 			price: 150000,
// 			cost: 150000 * amount
// 		}
// 	}
// }
// export {calculateCostFormwork};


function calculateCostMaterial(cfg, cost, materials, thicknessInsulation = null)
{
    let totalPrice = 0;
    let countedMaterials = materials.map(materialItem => {
        const [materialType, materialObj] = Object.entries(materialItem)[0];
        let newItem = {};
        let amount = + materialObj.amount.toFixed(2);
        let costMaterial = cost.materials[materialType] ?? 0;
        let price = costMaterial * amount; 
        newItem[materialType] = {
            ...materialObj,
            amount: amount,
            cost: costMaterial,
            price: price
        }
        totalPrice += price;
        return newItem;
	})
    return {
        totalPrice,
        materials: countedMaterials
    };
}
export {calculateCostMaterial};

/**
 * Рассчет стоимости работ
 * @param {*} cfg 
 * @param {*} cost 
 * @param {*} materials 
 * @param {*} numberGates 
 * @param {*} S 
 * @param {*} materialPrice 
 * @returns 
 */
function calculateCostWork(cfg, cost, materials, numberGates, S, materialPrice)
{
    const amount = [];
	
    let domeWeight = 0;
    let endWeight = 0;
    let pileCount = 0;
    materials.forEach(el => {
        const [materialType, materialObj] = Object.entries(el)[0];
        if ('dome' in materialObj)
        {
            domeWeight += materialObj.amount;
        }
        if ('end' in materialObj)
        {
            endWeight += materialObj.amount;
        }
        if (materialType == 'pile_3_pneumatic_hammer')
        {
            pileCount = materialObj.amount;
        }
    })
    
	//стены и ворота
    amount.push({
		...cfg.work.fabrication_installation_end_walls_gates,
		cost: Math.round(cost.work.fabrication_installation_end_walls * endWeight + cost.work.fabrication_installation_gates * numberGates)
	})
	
    //монтаж свай
	amount.push({
		...cfg.work.installation_pile_field,
		cost: Math.round(cost.work.installation_pile_field * pileCount)
	})

	//Услуги техники
	amount.push({
		...cfg.work.engineering_services,
		cost: Math.round(cost.work.engineering_services * S)
	})
    
    //сбрка и монтаж купола
    let fabrication_installation_dome_cost = Math.round(cost.work.fabrication_installation_dome * domeWeight);
	
    const getWorkTotlaPrice = () => {
        return amount.reduce((acc, el) => { return acc += el.cost }, 0);
    }

    let totalPrice = getWorkTotlaPrice();

    let CostPerS = Math.round( (materialPrice + totalPrice) / S );
    console.log('получившаяся цена за кварат', CostPerS);
    if (CostPerS != cost.cost_m2)
    {
        console.log('Стоимость монтажа до коррекции', fabrication_installation_dome_cost);
        let deltaCostPerS = CostPerS - cost.cost_m2;
        console.log('Разница в стоимости за квардрат', deltaCostPerS);
        console.log('Разница в стоимости на всю площадь квардрат', deltaCostPerS * S);
        fabrication_installation_dome_cost += deltaCostPerS * S;
        console.log('Стоимость монтажа после коррекции', fabrication_installation_dome_cost);
    }
    amount.push({
		...cfg.work.fabrication_installation_dome,
		cost: Math.round(fabrication_installation_dome_cost)
	});
    
    totalPrice = getWorkTotlaPrice();

	return {
        totalPrice,
        works: amount
    };
}
export {calculateCostWork};