export const cfg = {
    limits: {
        length: {
            min: 10,
            max: 100
        },
        width: {
            min: 10,
            max: 25
        },
        height: {
            min: 5,
            max: 12.5
        },
        //колчиество ворот
        numberGates: {
            min: 1,
            max: 2
        },
        heightGates: {
            min: 3,
            max: 4
        },
        widthGates: {
            min: 3,
            max: 4
        },
        thicknessInsulation: {
            min: 150,
            max: 350
        },
    },

    const: {
        basementHeight: 0.6, //высота фундамента
        basementWidth: 0.4, //Ширина фундамента
        pilesDistance: 2.5, //Расстояние между сваями

        stripeWidth: 0.55, //Ширина одного отформованного листа

        edgeInsulation: 0.18, //Высота ребра, учитывается при утеплении

        safetyFactor: 1.1, //Запас по маетриалам

        heightGate: 4,
        widthGate:4,
    },

    material: {
        //Сталь в бухтах
        steel_12: {
            title: 'Оцинкованный металл 1.2 мм',
            weight: 9.42
        },
        steel_10: {
            title: 'Оцинкованный металл 1 мм',
            weight: 7.85 //уточнить вес
        },
        steel_08: {
            title: 'Оцинкованный металл 0.8 мм',
            weight: 6.28
        },

        //Уголок
        angle100x100x7: {
            title: 'Уголок 100x100x7 мм',
            minWidth: 12, //минимальная длинна 12 м
            weight: 10.79
        },
        //Профильная труба
        profilePipe100x100x4: {
            title: 'Профильная труба 100x100x4 мм',
            minWidth: 12,
            weight: 11.8
        },
        profilePipe50x50x4: {
            title: 'Профильная труба 50x50x4 мм',
            minWidth: 12,
            weight: 5.56
        },
        
        
        //Сваи
        pile_3_pneumatic_hammer: {
            title: 'Свая под пневмомолот',
            weight: 0
        },
        pile_3: {
            title: 'Свая 3 м',
            weight: 0
        },
        
        //Ворота
        gate_4x4: {
            title: 'Ворота (4x4м)',
            weight: 0
        },
        gate_insulate_4x4: {
            title: 'Ворота утепленные (4x4м)',
            weight: 0
        },
        //Крепеж
        fasteners: {
            title: 'Крпеж (саморезы, электроды и т.п.)',
            weight: 0
        },
        
        //Утеплитель
        mineralWool: {
            title: 'Минеральная вата',
            weight: 10
        },

    },

    //Перечень работ для возведения
    work: {
        installation_pile_field: {
            title: 'Монтаж cвайного поля',
            //за тонну
        },

        fabrication_installation_dome: {
            title: 'Изготовление и монтаж купола ангара',
            //За тонну
        },

        fabrication_installation_end_walls_gates: {
            title: 'Изготовление и монтаж тоцевых стен и ворот',
            //За тонну
        },

        engineering_services: {
            title: 'Услуги техники (кран, люлька и т.п.)',
            //за площадь
        },

    }
}
