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
            height += thicknessInsulation;
            width += thicknessInsulation * 2;
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
        domeMetalWeight = cfg.material.steel_12.weight * L_stripe * Number_stripe
        //Площаь торцов
        let S_end = 0.5 * (R_dome * L_stripe - (R_dome - height) * width);
        //Площадь металла с учетом формовки
        S_end = 2 * S_end / cfg.const.stripeWidth;
        EndMetalWeight = cfg.material.steel_08.weight * S_end;
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
    amount.push({
        steel_12: {
            title: cfg.material.steel_12.title,
            amount: domeMetalWeight * cfg.const.safetyFactor / 1000,
            units: 'т'
        }
    })
    //------------------------------------------------------------------------------------------
    //Рассчет металла на торцы
    amount.push({
        steel_08: {
            title: cfg.material.steel_08.title,
            amount: EndMetalWeight * cfg.const.safetyFactor / 1000,
            units: 'т'
        }
    })
    //------------------------------------------------------------------------------------------
    let P_withoutGates = (length + width) * 2 - numberGates * widthGates; //Периметр без учета ворот
    //Рассчет количества свай
    amount.push({
        pile_3: {
            title: cfg.material.pile_3.title,
            amount: P_withoutGates * cfg.const.safetyFactor / cfg.const.pilesDistance,
            units: 'шт.'
        }
    })
    //------------------------------------------------------------------------------------------
    //Рассчет количества Обвязочного уголка
    amount.push({
        angle100x100x7: {
            title: cfg.material.angle100x100x7.title,
            amount: P_withoutGates * cfg.material.angle100x100x7.weight / 1000,
            units: 'т'
        }
    })
    //------------------------------------------------------------------------------------------
    //Рассчет арматуры
    //Todo уточничть расчет хомутов и количество хлыстов
    amount.push({
        fitting_d12: {
            title: cfg.material.fitting_d12.title,
            amount: P_withoutGates * 4 * cfg.material.fitting_d12.weight /* * cfg.const.safetyFactor*/ / 1000,
            units: 'т'
        }
    })
    //------------------------------------------------------------------------------------------
    //Расссчет бетона
    //todo уточниить увеличение ширины фундамента и количество арматуры на утепленный ангар
    amount.push({
        concrete_m250: {
            title: cfg.material.concrete_m250.title,
            amount: P_withoutGates * cfg.const.basementHeight * (cfg.const.basementWidth + thicknessInsulation ?? 0) * cfg.const.safetyFactor,
            units: 'м3'
        }
    })
    return amount;
}
export {calculateMaterial};

/**
 * Функция рассчета стоимости ворот
 * todo уточнить методику рассчета
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
    return {
        gate: {
            title: `${cfg.material.gate.title} ${heightGates}x${widthGates}`,
            amount: numberGates,
            units: 'шт',
            price: 68000,
            cost: 68000 * numberGates
        }
    }
}
export {calculateCostGate};
 
 /**
  * Функция рассчета стоимости комплекта крпежа
  * todo уточнить методику рассчета крепежа
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
            price: 55000,
            cost: 68000 * amount
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
function calculateCostFormwork(cfg, cost, length, width)
{
    let amount = 1
    return {
        formwork: {
            title: `${cfg.material.gate.formwork}`,
            amount: amount,
            units: 'компл.',
            price: 150000,
            cost: 150000 * amount
        }
    }
}
export {calculateCostFormwork};

function calculateCostMaterial(cfg, cost, materials, length, width, height, numberGates, thicknessInsulation = null)
{
    return materials.map(material => {
        
    })
}
export {calculateCostMaterial};

/**
 * Рассчет стоимости работ
 * todo уточнить методику рассчета стоимости работ
 * @param {*} cfg 
 * @param {*} cost 
 * @param {*} materials 
 * @param {*} length 
 * @param {*} width 
 * @param {*} height 
 * @param {*} numberGates 
 * @param {*} thicknessInsulation 
 */
function calculateCostWork(cfg, cost, materials, length, width, height, numberGates, thicknessInsulation = null)
{
    const amount = [];
    //монтаж уголка
    amount.push({
        ...cfg.work.installation_piles_corner,
        cost: cost.work.installation_piles_corner * materials.angle100x100x7.amount
    })
    //монтах купола
    amount.push({
        ...cfg.work.fabrication_installation_dome,
        cost: cost.work.fabrication_installation_dome * materials.steel_15.amount
    })
    //стены и ворота
    amount.push({
        ...cfg.work.fabrication_installation_end_walls_gates,
        cost: cost.work.fabrication_installation_end_walls_gates * materials.steel_08.amount
    })
    //Бетонирование
    amount.push({
        ...cfg.work.сoncreting_works,
        cost: cost.work.сoncreting_works * materials.concrete_m250.amount
    })
    //Работы по утеплению
    thicknessInsulation !== null && amount.push({
        ...cfg.work.insulation_works,
        cost: cost.work.insulation_works * materials.mineralWool.amount
    })
    //Услуги техники
    amount.push({
        ...cfg.work.engineering_services,
        cost: cost.work.engineering_services * length * width
    })
    return amount
}
export {calculateCostWork};