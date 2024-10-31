//Configuration of database
if (!window.indexedDB) { //Validate compatibility of indecedDB
    window.alert("Su Navegador No es compatible con IndexedDB");
}

let dataBase //Variable for work with database
let objectStore //For work with the object in database

//Create a request to open database
let request = indexedDB.open("CRM_Database", 1)

//Control of request
request.onerror = () => alert(`Error creando la base de datos`)
request.onsuccess = () => console.log(`Base de datos creada con exito`)
//Update database for create initial structure
request.onupgradeneeded = (e) => {
    dataBase = e.target.result //Save database created in value for work

    //Configuration of the objectStore
    objectStore = dataBase.createObjectStore("clients",{keyPath: "id", autoIncrement: true})

    //Declaration unique values
    objectStore.createIndex("email", "email", { unique: true });
    objectStore.createIndex("telefono", "telefono", { unique: true });
}


//App functions
document.addEventListener('DOMContentLoaded', () => {
    //Selectors
    const name = document.querySelector("#nombre")
    const mail = document.querySelector("#email")
    const tlf = document.querySelector("#telefono")
    const company = document.querySelector("#empresa")
    const inputSubmit = document.querySelector('#formulario input[type="submit"]')

    //Local variables
    const errorBox = document.createElement("div")

    //When reload app, reset inputs
    function resetValues() {
        name.value = ""
        mail.value = ""
        tlf.value = ""
        company.value = ""
    }
    resetValues()

    //Listeners
    name.onblur = (e) => validateContent(e)
    mail.onblur = (e) => validateContent(e)
    tlf.onblur = (e) => validateContent(e)
    company.onblur = (e) => validateContent(e)
    inputSubmit.onclick = (e) => submitClient(e)

    //Object to check validatión and submit
    const clientObject = { //These variables are necessary in spanish because de inputs are in spanish
        nombre: "",
        email: "",
        telefono: "",
        empresa: "",
    }
    validateSubmit() //For disable inputSubmit to start

    //Validation for inputs
    function validateContent(e) {
        //Simple validation is not empty
        if (e.target.value.trim() === "") {
            //Show an error message, put in parentElement
            errorMessage("El valor no puede estar vacío", e.target.parentElement)
            removeBox()
            return
        }
        //Validation for name
        if (e.target.id === "nombre" && !validateName(e.target.value.trim())) {
            errorMessage("El nombre no es válido", e.target.parentElement)
            removeBox()
            clientObject[e.target.name] = ""
            return
        }
        //Validation for mail
        if (e.target.id === "email" && !validateMail(e.target.value.trim())) {
            errorMessage("El correo no es válido", e.target.parentElement)
            removeBox()
            clientObject[e.target.name] = ""
            return
        }
        //Validation for tlf
        if (e.target.id === "telefono" && !validateTlf(e.target.value.trim())) {
            errorMessage("El teléfono no es válido", e.target.parentElement)
            removeBox()
            return
        }
        //Validation for company
        if (e.target.id === "empresa" && !validateCompany(e.target.value.trim())) {
            errorMessage("La empresa no es válida", e.target.parentElement)
            removeBox()
            return
        }
        //If the values pass validations, change de statement of button
        clientObject[e.target.name] = e.target.value
        validateSubmit()
    }

    //If the value pass regex validation return true else false
    function validateName(name) {
        const regexName = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
        return regexName.test(name)
    }
    function validateMail(mail) {
        const regexMail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/
        return regexMail.test(mail)
    }
    function validateTlf(tlf) {
        const regexTlf = /^\d{9}$/;
        return regexTlf.test(tlf)
    }
    function validateCompany(company) {
        const regexCompany = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.\-]+$/;
        return regexCompany.test(company)
    }

    //If all validations are ok you can submit de client
    function validateSubmit() {
        const values = Object.values(clientObject) //Extract values for check
        if (values.includes("")) {
            inputSubmit.classList.add("opacity-50")
            inputSubmit.disabled = true
            return
        }
            inputSubmit.classList.remove("opacity-50")
            inputSubmit.disabled = false
    }

    //Box to show errors
    function errorMessage(message, parentElement) {
        //Add classes for create a box with styles
        errorBox.classList
            .add("bg-red-600",
                "text-center",
                "text-white",
                "p-2",
                "font-bold",
                "rounded-md")
        errorBox.textContent = message
        parentElement.appendChild(errorBox)
    }

    //Delete error box and update de validation submit in a function factorized
    function removeBox() {
        validateSubmit()
        setTimeout(()=> {
            errorBox.remove()
        },1500)
    }

    //Submit Client to database
    function submitClient(e) {
        e.preventDefault()
        console.log("Cliente enviado correctamente")
        console.log(`Nombre: ${clientObject.nombre}`)
        console.log(`Email: ${clientObject.email.trim()}`)
        console.log(`Tlf: ${clientObject.telefono}`)
        console.log(`Empresa: ${clientObject.empresa}`)
        resetValues()
    }
})