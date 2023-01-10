function calculateMaterial(cfg, length, width, height, numberGates, heightGates, widthGates, thicknessInsulation = null)
{
	const amount = [];
	//выбор толщины металла на купол
	let domeMaterial = 'steel_12';
	let innerDomeMaterial = 'steel_10';
	let endMaterial = 'steel_08';
	if ( width <= 12 )
	{
		domeMaterial = 'steel_08';
		innerDomeMaterial = 'steel_08';
	}
	else if ( width <= 16 )
	{
		domeMaterial = 'steel_10';
		innerDomeMaterial = 'steel_08';
	}

	function domeMetallWeight(length, height, width, domeMaterial, thicknessInsulation = null)
	{
		if (thicknessInsulation !== null)
		{
			thicknessInsulation = thicknessInsulation/1000;
			length += thicknessInsulation * 2;
			height += cfg.const.edgeInsulation + thicknessInsulation;
			width += (cfg.const.edgeInsulation + thicknessInsulation) * 2;
		}
		let domeMetalWeight = 0;
		let endMetalWeight = 0;
		//let volumeInsulation = 0;
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

		endMetalWeight = cfg.material[endMaterial].weight * S_end;
		// if (thicknessInsulation !== null)
		// {
		// 	volumeInsulation = length * thicknessInsulation * L_stripe + S_end * thicknessInsulation;
		// }
		//return [domeMetalWeight, endMetalWeight, volumeInsulation];
		return [domeMetalWeight, endMetalWeight, L_stripe*length + S_end];
	}

	//Рассчет без утепления
	if (thicknessInsulation == null) 
	{
		const [domeMetalWeight, endMetalWeight] = domeMetallWeight(length, height, width, domeMaterial);
		//Рассчет веса стали для купола
		amount.push(
			{
				material: domeMaterial,
				title: cfg.material[domeMaterial].title + ' (купол)',
				amount: domeMetalWeight / 1000,
				units: 'т',
				dome: true,
			}
		)
		//Рассчет металла на торцы
		amount.push(
			{
				material: endMaterial,
				title: cfg.material[endMaterial].title + ' (торцы)',
				amount: endMetalWeight / 1000,
				units: 'т',
				end: true
			}
		);
	}
	else
	{
		//Внутренний контур
		const [domeMetalWeightInner, endMetalWeightInner, SInsulation] = domeMetallWeight(length, height, width, innerDomeMaterial);
		//Внешний контур
		const [domeMetalWeight, endMetalWeight] = domeMetallWeight(length, height, width, domeMaterial, thicknessInsulation);
		//объем 
		let volumeInsulation = SInsulation * thicknessInsulation / 1000;
		if (domeMaterial === innerDomeMaterial)
		{
			//Материалы одинаковы
			amount.push(
				{
					material: domeMaterial,
					title: cfg.material[domeMaterial].title + ' (купол)',
					amount: (domeMetalWeightInner + domeMetalWeight) / 1000,
					units: 'т',
					dome: true,
				}
			)
		}
		else
		{
			amount.push(
				{
					material: domeMaterial,
					title: cfg.material[domeMaterial].title + ' (внешний купол)',
					amount: domeMetalWeight / 1000,
					units: 'т',
					dome: true,
				}
			);

			amount.push(
				{
					material: innerDomeMaterial,
					title: cfg.material[innerDomeMaterial].title + ' (внутренний купол)',
					amount: domeMetalWeightInner / 1000,
					units: 'т',
					dome: true,
				}
			)
		}
		//Рассчет металла на торцы
		amount.push(
			{
				material: endMaterial,
				title: cfg.material[endMaterial].title + ' (торцы)',
				amount: (endMetalWeight + endMetalWeightInner) / 1000,
				units: 'т',
				end: true
			}
		);
		//Рассчет минваты
		amount.push({
			material: 'mineralWool',
			title: cfg.material.mineralWool.title,
			amount: volumeInsulation * cfg.material.mineralWool.weight / 1000,
			units: 'т'
		})
	}

	let P_withoutGates = (length + width) * 2 - numberGates * widthGates; //Периметр без учета ворот

	//Рассчет количества свай
	amount.push(
		{
			material: 'pile_3_pneumatic_hammer',
			title: cfg.material.pile_3_pneumatic_hammer.title,
			amount: Math.ceil(P_withoutGates / cfg.const.pilesDistance),
			units: 'шт.'
		}
	)
	//------------------------------------------------------------------------------------------

	//Рассчет количества обвязочного уголка
	let angle100x100x7Weight =  Math.ceil(P_withoutGates / cfg.material.angle100x100x7.minWidth)
		* cfg.material.angle100x100x7.minWidth
		* cfg.material.angle100x100x7.weight;
	amount.push({
		material: 'angle100x100x7',
		title: cfg.material.angle100x100x7.title,
		amount: (thicknessInsulation == null ? angle100x100x7Weight : angle100x100x7Weight * 2) / 1000,
		units: 'т'
	})

	//Рассчет профильной трубы 100x100
	//Todo Уточнить методику рассчета труб
	amount.push(
		{
			material: 'profilePipe100x100x4',
			title: cfg.material.profilePipe100x100x4.title,
			amount: height * 0.06,
			units: 'т.'
		}
	)
	//Рассчет профильной трубы 50x50
	amount.push(
		{
			material: 'profilePipe50x50x4',
			title: cfg.material.profilePipe50x50x4.title,
			amount: height * 0.03,
			units: 'т.'
		}
	)

	//Рассчет ворот
	let typeGate = thicknessInsulation == null ? 'gate_4x4' : 'gate_insulate_4x4';
	amount.push({
		material: typeGate,
		title: cfg.material[typeGate].title,
		amount: numberGates,
		units: 'шт.'
	})

	//Рассчет крепежа
	amount.push({
		material: 'fasteners',
		title: cfg.material.fasteners.title,
		amount: thicknessInsulation == null ? 1 : 2,
		units: 'компл.'
	})

	return amount;
}
export {calculateMaterial};


function calculateCostMaterial(cfg, cost, materials, thicknessInsulation = null)
{
	let totalPrice = 0;
	
	let countedMaterials = materials.map(materialItem => {
		let amount = + materialItem.amount.toFixed(2);
		let costMaterial = cost.materials[materialItem.material] ?? 0;
		let price = costMaterial * amount; 
		totalPrice += price;
		return {
			...materialItem,
			amount: amount,
			cost: costMaterial,
			price: price
		};
	})

	return {
		totalPrice: +(totalPrice).toFixed(2),
		materials: countedMaterials
	};
}
export {calculateCostMaterial};


function calculateCostWork(cfg, cost, materials, numberGates, S, materialPrice, thicknessInsulation = null)
{
	const amount = [];
	
	let domeWeight = 0;
	let endWeight = 0;
	let pileCount = 0;
	materials.forEach(el => {
		if ('dome' in el)
		{
			domeWeight += el.amount;
		}
		if ('end' in el)
		{
			endWeight += el.amount;
		}
		if (el.material == 'pile_3_pneumatic_hammer')
		{
			pileCount = el.amount;
		}
	})
	
	
	
	//монтаж свай
	amount.push({
		...cfg.work.installation_pile_field,
		cost: Math.round(cost.work.installation_pile_field * pileCount)
	})

	//Услуги техники
	amount.push({
		...cfg.work.engineering_services,
		cost: Math.round(cost.work.engineering_services * S * (thicknessInsulation ? 2 : 1))
	})
	
    //стены и ворота
    /*
	amount.push({
		...cfg.work.fabrication_installation_end_walls_gates,
		cost: Math.round(cost.work.fabrication_installation_end_walls * endWeight + cost.work.fabrication_installation_gates * numberGates)
	})
    */
    let cost_gates = cost.work.fabrication_installation_gates * numberGates;

	//сбрка и монтаж купола
	let fabrication_installation_dome_cost = Math.round(cost.work.fabrication_installation_dome * domeWeight);
	
	const getWorkTotlaPrice = () => {
        //  +cost_gates
		return amount.reduce((acc, el) => { return acc += el.cost }, 0); //0
	}

	let workPrice = getWorkTotlaPrice() + cost_gates; //Цена работ
	let totalPrice = materialPrice + workPrice; //Цена всего ангара
	let fairPrice = S * (thicknessInsulation == null ? cost.cost_m2 : cost.cost_insulate_m2); //Настоящая цена (от площади)
	
    let fabrication_installation_dome_and_endwals_cost = fairPrice - totalPrice; //цена на монтаж купола и торцевых стен

	//fabrication_installation_dome_cost = fairPrice - totalPrice;
    fabrication_installation_dome_cost = Math.round(2 * fabrication_installation_dome_and_endwals_cost / 3);
    let fabrication_installation_end_walls = Math.round(fabrication_installation_dome_and_endwals_cost / 3);
    
    //монтаж тоцевых стен
    amount.push({
		...cfg.work.fabrication_installation_end_walls_gates,
		cost: Math.round(fabrication_installation_end_walls + cost.work.fabrication_installation_gates * numberGates)
	})

    //Монтаж купола
	amount.push({
		...cfg.work.fabrication_installation_dome,
		cost: Math.round(fabrication_installation_dome_cost)
	});
	
	workPrice = getWorkTotlaPrice();

	return {
		totalPrice: +(workPrice).toFixed(2),
		works: amount
	};
}
export {calculateCostWork};