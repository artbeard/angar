<template>
    <teleport to="body">
		<div class="container-fluid forPrint fs-6">
			<slot name="header"></slot>
			<div ref="printWrapper">
			</div>
			<slot name="footer"></slot>
		</div>
	</teleport>
</template>
<script>
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'printResult',
    methods: {
      print(selector)
		{
			if (typeof selector === 'string')
			{
				selector = document.querySelector(selector);
			}
			this.$refs['printWrapper'].innerHTML = '';
			this.$refs['printWrapper'].innerHTML = selector.innerHTML;
			window.print();
		},
   },
})
</script>
<style lang="css">
@media not print {
	.forPrint{
		display: none;
	}
}

@media print {
	
    body > *:not(.forPrint)
    {
        display:none;
    }
	
	.forPrint {
		display:block;
		position: absolute;
		left: 0;
		top: 0;
		right:0;
        bottom:0;
	}

	.forPrint, .forPrint * {
		visibility: visible;
		font-family: Georgia, "Times New Roman", serif;
	}
	.forPrint table, .forPrint p{
		font-size: 0.8rem;
	}
	.forPrint table.table>:not(caption)>*>* {
		padding: 0.05rem 0.5rem !important;
        font-size: 0.75rem;
	}
	.forPrint table.table.calcData th:not(:first-child),
	.forPrint table.table.calcData td:not(:first-child)
	{
		text-align:center;
	}
}
</style>