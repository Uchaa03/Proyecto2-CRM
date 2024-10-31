

document.addEventListener('DOMContentLoaded', () => {
    //Selectors
    const name = document.querySelector("#nombre")
    const email = document.querySelector("#email")
    const tlf = document.querySelector("#telefono")
    const company = document.querySelector("#empresa")

    //Listeners
    name.onblur = (e) => validateContent(e)
    email.onblur = (e) => validateContent(e)
    tlf.onblur = (e) => validateContent(e)
    company.onblur = (e) => validateContent(e)

    //Función de validación que valide
    function validateContent(e) {
        console.log(e.target.value)
    }
})