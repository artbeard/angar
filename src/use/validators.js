//import { useVuelidate } from '@vuelidate/core'
import { minValue, maxValue, required, helpers } from '@vuelidate/validators'
import { cfg } from '../assets/js/cgf'

const coldValidators = {
	length: {
		required: helpers.withMessage('Поле обязательно к заполнению. ', required),
		minValue: helpers.withMessage(
			({$params}) => `Минимальная длинна строения должна быть не менее ${$params.min} м. `,
			minValue(cfg.limits.length.min)
		),
		maxValue: helpers.withMessage(
			({$params}) => `Максимальная длинна строения должна быть не более ${$params.max} м. `,
			maxValue(cfg.limits.length.max)
		)
	},
	width: {
		required: helpers.withMessage('Поле обязательно к заполнению', required),
		minValue: helpers.withMessage(
			({$params}) => `Минимальная ширина строения должна быть не менее ${$params.min} м. `,
			minValue(cfg.limits.width.min)
		),
		maxValue: helpers.withMessage(
			({$params}) => `Максимальная ширина строения должна быть не более ${$params.max} м. `,
			maxValue(cfg.limits.width.max)
		)
	},
	

    numberGates: {
		//required: helpers.withMessage('Поле обязательно к заполнению', required),
		minValue: helpers.withMessage(
			({$params}) => `Минимальное количество ворот ${$params.min} шт. `,
			minValue(cfg.limits.numberGates.min)
		),
		maxValue: helpers.withMessage(
			({$params}) => `Минимальное количество ворот ${$params.max} шт. `,
			maxValue(cfg.limits.numberGates.max)
		)
	},
};

const thicknessValidators = {
    ...coldValidators,
    thicknessInsulation: {
		minValue: helpers.withMessage(
			({$params}) => `Минимальная толщина утепления ${$params.min} м. `,
			minValue(cfg.limits.thicknessInsulation.min)
		),
		maxValue: helpers.withMessage(
			({$params}) => `Минимальная толщина утепления ${$params.max} м. `,
			maxValue(cfg.limits.thicknessInsulation.max)
		)
	},
}

/**
 * Валидаор для проверки, что ширина менее или равна длинне
 * @param {*} param 
 * @returns 
 */
const widthtLessHeigh = (param) => (widthValue) => {
    return widthValue <= param.value;
};

export {widthtLessHeigh};
export {coldValidators};
export {thicknessValidators};