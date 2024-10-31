document.addEventListener('DOMContentLoaded', () => {
    //Configuration of database
    if (!window.indexedDB) { //Validate compatibility of indexedDB
        window.alert("Su Navegador No es compatible con IndexedDB")
    }

    let dataBase //Variable for work with database
    let objectStore //For work with the object in database

    //Create a request to open database
    let request = indexedDB.open("CRM_Database", 1)

    //Control of request
    request.onerror = () => alert(`Error creando la base de datos`)
    request.onsuccess = (e) => {
        dataBase = e.target.result
        console.log(`Base de datos creada con exito`)
        if (tBody){ //If stay in show clients
            getClients()
        }
    }

    //Update database for create initial structure
    request.onupgradeneeded = (e) => {
        dataBase = e.target.result //Save database created in value for work

        //Configuration of the objectStore
        objectStore = dataBase.createObjectStore("clients",{keyPath: "id", autoIncrement: true})

        //Declaration unique values
        objectStore.createIndex("mail", "mail", { unique: true })
        objectStore.createIndex("numberPhone", "numberPhone", { unique: true })
    }

    //Selectors
    const name = document.querySelector("#nombre")
    const mail = document.querySelector("#email")
    const numberPhone = document.querySelector("#telefono")
    const company = document.querySelector("#empresa")
    const inputSubmit = document.querySelector('#formulario input[type="submit"]')
    const tBody = document.querySelector("#listado-clientes")

    //Local variables
    const errorBox = document.createElement("div")
    const submitMessage = document.createElement("div")
    let clients = []

    //When reload app, reset inputs
    function resetValues() {
        name.value = ""
        mail.value = ""
        numberPhone.value = ""
        company.value = ""
    }

    //Object to check validatión and submit
    const clientObject = { //These variables are necessary in spanish because de inputs are in spanish
        nombre: "",
        email: "",
        telefono: "",
        empresa: "",
    }

    //Listeners
    if (inputSubmit) { //Validate the correct page
        name.onblur = (e) => validateContent(e)
        mail.onblur = (e) => validateContent(e)
        numberPhone.onblur = (e) => validateContent(e)
        company.onblur = (e) => validateContent(e)
        inputSubmit.onclick = (e) => submitClient(e)
        resetValues()
        validateSubmit() //For disable inputSubmit to start
    }

    //Validation for inputs
    function validateContent(e) {
        //Simple validation is not empty
        if (e.target.value.trim() === "") {
            //Show an error message, put in parentElement
            errorMessage("El valor no puede estar vacío", e.target.parentElement)
            return
        }
        //Validation for name
        if (e.target.id === "nombre" && !validateName(e.target.value.trim())) {
            errorMessage("El nombre no es válido", e.target.parentElement)
            clientObject[e.target.name] = ""
            return
        }
        //Validation for mail
        if (e.target.id === "email" && !validateMail(e.target.value.trim())) {
            errorMessage("El correo no es válido", e.target.parentElement)
            clientObject[e.target.name] = ""
            return
        }
        //Validation for numberPhone
        if (e.target.id === "telefono" && !validateTlf(e.target.value.trim())) {
            errorMessage("El teléfono no es válido", e.target.parentElement)
            return
        }
        //Validation for company
        if (e.target.id === "empresa" && !validateCompany(e.target.value.trim())) {
            errorMessage("La empresa no es válida", e.target.parentElement)
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
        const regexTlf = /^\d{9}$/
        return regexTlf.test(tlf)
    }
    function validateCompany(company) {
        const regexCompany = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.\-]+$/
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
        removeBox()
    }

    //For show a message when the client was added correctly
    function okMessage(message, parentElement) {
        //Add classes for create a box with styles
        submitMessage.classList
            .add("bg-green-600",
                "text-center",
                "text-white",
                "p-2",
                "font-bold")
        submitMessage.textContent = message
        parentElement.appendChild(submitMessage)
        setTimeout(()=> {
            submitMessage.remove()
        },3000)
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
        //Transaction in database clients
        let transaction = dataBase.transaction("clients", "readwrite")
        let objectStore = transaction.objectStore("clients")
        request = objectStore.add({
            name: clientObject.nombre,
            mail: clientObject.email.toLowerCase(), //Mails must be in lowercase
            numberPhone: clientObject.telefono,
            company: clientObject.empresa
        })
        request.onsuccess = () => {
            okMessage("Cliente Agregado Correctamente", inputSubmit.parentElement)
            resetValues()
        }

        request.onerror = () => {
            errorMessage("El télefono o correo ya fueron utilizados", inputSubmit.parentElement)
            resetValues()
        }
    }


    //Get Clients Function from Database
    function getClients() {
        //Transaction for read clients and store in clients array
        let transaction = dataBase.transaction("clients", "readonly")
        let objectStore = transaction.objectStore("clients")

        //Controller for cursor
        let request = objectStore.openCursor()

        request.onsuccess = (e) => {
            let cursor = e.target.result

            if (cursor) {
                clients.push(cursor.value)
                cursor.continue()
            }else{
                showClients()
            }
        }

        request.onerror = (e) => {
            console.log(`Error en la lecutra de datos: ${e}`)
        }
    }

    //Show Clients in table
    function showClients() {
        while (tBody.firstChild) { //Clean tbody for changes
            tBody.removeChild(tBody.firstChild);
        }
        clients.forEach((client) => {
            const tr = document.createElement("tr")

            //For name
            const tdName = document.createElement("td")
            tdName.textContent = client.name

            //For PhoneNuber
            const tdNumberPhone = document.createElement("td")
            tdNumberPhone.textContent = client.numberPhone

            //For Company
            const tdCompany = document.createElement("td")
            tdCompany.textContent = client.company

            //For buttons
            const tdActions = document.createElement("td")

            const btnEdit = document.createElement("button")
            btnEdit.textContent = "Editar"
            btnEdit.classList.add("bg-yellow-500", "hover:bg-yellow-600",
                                "text-white", "font-bold",
                                "py-2", "px-4", "rounded")
            btnEdit.onclick = () => editClient(client.id)

            const btnDelete = document.createElement("button")
            btnDelete.textContent = "Eiminar"
            btnDelete.classList .add("bg-red-500", "hover:bg-red-600",
                                    "text-white", "font-bold",
                                    "py-2", "px-4", "rounded")
            btnDelete.onclick = () => deleteClient(client.id) //Pass id and tr for delete data en tuple

            tdActions.appendChild(btnEdit)
            tdActions.appendChild(btnDelete)
            //Add to tr
            tr.appendChild(tdName)
            tr.appendChild(tdNumberPhone)
            tr.appendChild(tdCompany)
            tr.appendChild(tdActions)
            tBody.appendChild(tr)  //Add to body
        })
    }

    function editClient(id) {

    }

    //Select client selected and remove in database with a transaction
    function deleteClient(id) {
        clients = [] //Clean actual clients
        //Transaction for delete
        let transaction = dataBase.transaction("clients", "readwrite")
        let objectStore = transaction.objectStore("clients")

        let request = objectStore.delete(id)
        request.onsuccess = () => {
            console.log("Eliminado con exito")
            // Refresh the clients array and UI after successful deletion
            getClients()
        }
        request.onerror = () => {
            console.log("Error en eliminar el cliente")
        }
    }

})