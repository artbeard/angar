const printMixin = {
   data: ()=>({
      title: '',
      printTitle: '',
   }),

   methods:{
		printResult(selector)
		{
			this.$root.$refs.printResult.print(selector);
		},
		//Возвращаем старый title
      addAfterPrint(){
         document.querySelector('title').innerText = this.title;
		},
		//Устанавливаем новый title
		addBeforePrint(){
         this.title = document.querySelector('title').innerText;
         document.querySelector('title').innerText = this.printTitle;
		},
   },

   mounted(){
		window.addEventListener('afterprint', this.addAfterPrint);
    	window.addEventListener('beforeprint', this.addBeforePrint);
	},

	unmounted(){
		window.removeEventListener('afterprint', this.addAfterPrint);
    	window.removeEventListener('beforeprint', this.addBeforePrint);
	},
}

export default printMixin;