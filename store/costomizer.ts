interface color{
    primary:string;
    secondary:string
}
export const  usecustomizerStore= defineStore('customizer' , () => {
    const property = ref()
    function setcolor(color:color){

            document.documentElement.style.setProperty('--theme-default7' , color.primary)
            document.documentElement.style.setProperty('--theme-default6' , color.secondary)
    
    }
    return{
       
        setcolor,
        property
    }
})