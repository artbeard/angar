export const cold = {
    limits: {
        length: {
            min: 10,
            max: 200
        },
        width: {
            min: 10,
            max: 35
        },
        height: {
            min: 5,
            max: 17.5
        },
        //колчиество ворот
        numberGates: {
            min: 1,
            max: 2
        },
        heightGates: {
            min: 2,
            max: 4
        },
        widthGates: {
            min: 3,
            max: 5
        },
    },

    const: {
        basementHeight: 0.6, //высота фундамента
        basementWidth: 0.4, //Ширина фундамента
        pilesDistance: 2.5, //Расстояние между сваями

        stripeWidth: 0.55, //Ширина одного отформованного листа

        safetyFactor: 1.1, //Запас по маетриалам
    },

    material: {
        //Сталь в бухтах
        steel_15: {
            title: 'Сталь 1.5 мм',
            weight: 11.78
        },
        steel_12: {
            title: 'Сталь 1.2 мм',
            weight: 9.42
        },
        steel_08: {
            title: 'Сталь 0.8 мм',
            weight: 6.28
        },
        //Уголок
        angle100x100x7: {
            title: 'Уголок 100x100x7 мм',
            weight: 10.79
        },
        //Профильная труба
        profilePipe100x100x4: {
            title: 'Профильная труба 100x100x4 мм',
            weight: 11.8
        },
        profilePipe50x50x4: {
            title: 'Профильная труба 50x50x4 мм',
            weight: 5.56
        },
        //Арматура
        fitting_d12: {
            title: 'Арматура 12 мм',
            weight: 0.888
        },
        //Утеплитель
        mineralWool: {
            title: 'Минеральная вата',
            weight: 150
        },
        //Сваи
        pile_3: {
            title: 'Свая 3 м',
            weight: 0
        },
        //Бетон
        concrete_m250: {
            title: 'Бетон М250',
            weight: 0
        },
        
    },

    //Устаревшее
    weight: {
        //Уголок
        angle100x100x7: 10.79, //метр погонный
        //Сталь
        steel_15: 11.78,
        steel_12: 9.42,
        steel_08: 6.28,
        //Профильная труба
        profilePipe100x100x4: 11.8,
        profilePipe50x50x4: 5.56,
        //Арматура
        fitting_d12: 0.888,
    },
}

export const insulated = {
    ...cold,
    limits: {
        ...cold.limits,
        //Толщина утпеления
        thicknessInsulation: {
            min: 150,
            max: 350
        }
    }
}