// const length = ref();   //Длиинна
// const width = ref();    //Ширина
// const height = ref();   //Высота
// const numberGates = ref();    // количество ворот
// const heightGates = ref();    //Высота ворот
// const widthGates = ref();     //Ширина ворот
// const thicknessInsulation = ref(); //Толщина утепления
// const cfg = {};
// const cost = {};

function calculateMaterial(cfg, length, width, height, numberGates, heightGates, widthGates, thicknessInsulation = null)
{
    const amount = [];

    //Рассчет металла на купол
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
            console.log(VolumeInsulation, L_stripe, length, height, width, thicknessInsulation)
        }
        return [domeMetalWeight, EndMetalWeight, VolumeInsulation];
    }

    let [domeMetalWeight, EndMetalWeight] = domeMetallWeight(length, height, width);
    //Добавляем вес второго купола, если указано утепление
    if (thicknessInsulation !== null)
    {
        let [domeMetalWeightIns, EndMetalWeightIns, VolumeInsulation] = domeMetallWeight(length, height, width, thicknessInsulation);
        domeMetalWeight += domeMetalWeightIns;
        EndMetalWeight += EndMetalWeightIns;
        //Рассчет минваты (при необходимости)
        amount.push({
            mineralWool: {
                title: cfg.material.mineralWool.title,
                amount: +( VolumeInsulation * cfg.const.safetyFactor * cfg.material.mineralWool.weight / 1000).toFixed(2),
                units: 'т'
            }
        })
    }
    //Рассчет веса стали для купола
    amount.push({
        steel_12: {
            title: cfg.material.steel_12.title,
            amount: +( domeMetalWeight * cfg.const.safetyFactor / 1000).toFixed(2),
            units: 'т'
        }
    })
    //Рассчет металла на торцы
    amount.push({
        steel_08: {
            title: cfg.material.steel_08.title,
            amount: +(EndMetalWeight * cfg.const.safetyFactor / 1000).toFixed(2),
            units: 'т'
        }
    })

    let P_withoutGates = (length + width) * 2 - numberGates * widthGates; //Периметр без ворот
    //Рассчет количества свай
    amount.push({
        pile_3: {
            title: cfg.material.pile_3.title,
            amount: Math.floor( P_withoutGates * cfg.const.safetyFactor / cfg.const.pilesDistance),
            units: 'шт.'
        }
    })
    //Рассчет количества Обвязочного уголка
    amount.push({
        angle100x100x7: {
            title: cfg.material.angle100x100x7.title,
            amount: +( P_withoutGates * cfg.material.angle100x100x7.weight / 1000 ).toFixed(2),
            units: 'т'
        }
    })
    //Рассчет арматуры
    amount.push({
        fitting_d12: {
            title: cfg.material.fitting_d12.title,
            amount: +( P_withoutGates * 4 * cfg.material.fitting_d12.weight /* * cfg.const.safetyFactor*/ / 1000).toFixed(2),
            units: 'т'
        }
    })

    //Расссчет бетона
    amount.push({
        concrete_m250: {
            title: cfg.material.concrete_m250.title,
            amount: +( P_withoutGates * cfg.const.basementHeight * (cfg.const.basementWidth + thicknessInsulation ?? 0) * cfg.const.safetyFactor ).toFixed(2),
            units: 'м3'
        }
    })
    return amount;
}

export {calculateMaterial};

// function calculateWork(cfg, cost, length, width, height, numberGates, heightGates, widthGates, thicknessInsulation = null)
// {
//     const amount = ref([
//         // name: {
//         // 	title: '',
//         // 	amount: 0,
//         // 	price: 0,
//         // 	cost: 0,
//         // 	units: 'т'
//         // }
//     ])
// }