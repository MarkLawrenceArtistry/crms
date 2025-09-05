
// store all functions inside a module to a single object
import * as patientApi from './js/patient-api.js'
import * as consultationApi from './js/consultation-api.js'
import * as medicineApi from './js/inventory-api.js'
import * as authApi from './js/auth-api.js'

import { renderPatients } from './js/ui-patient.js'
import { renderMedicines } from './js/ui-inventory.js'
import * as consultationUI from './js/ui-consultation.js'

document.addEventListener('DOMContentLoaded', () => {
    let currentPatientId = null;
    let currentMedicineId = null; // for displaying medicine name


    // MODALS
    const confirmationModal = document.querySelector('#confirmation-modal')
    const confirmationMessageEl = document.querySelector('#confirmation-question')
    const displayModal = document.querySelector('#display-modal')
    const displayTextEl = document.querySelector('#display-text')

    // PATIENTS
    const addPatientForm = document.querySelector('#add-patient-form');
    const addPatientModal = document.querySelector('#add-patient-modal');
    const addPatientBtn = document.querySelector('#add-patient-btn');
    const closeModalBtn = document.querySelector('#close-add-patient-modal');
    const searchPatientEl = document.querySelector('#search-patient-input');
    const closePatientsUpdateModalBtn = document.querySelector('#close-upd-patient-modal');
    const updatePatientForm = document.querySelector('#update-patient-form')
    const updatePatientModal = document.querySelector('#update-patient-modal')


    // CONSULTATIONS
    const consultationsModal = document.querySelector('#consultations-modal');
    const consultationHeader = document.querySelector('#consultation-header');
    const closeConsultationsModalBtn = document.querySelector('#close-consultations-modal');
    const addConsultationForm = document.querySelector('#add-consultation-form');


    // MEDICINES
    const addMedicineBtn = document.querySelector('#add-medicine-btn');
    const addMedicineForm = document.querySelector('#add-medicine-form');
    const addMedicineModal = document.querySelector('#add-medicine-modal');
    const closeMedicineModalBtn = document.querySelector('#close-add-medicine-modal');
    const updateMedicineForm = document.querySelector('#update-medicine-form');
    const updateMedicineModal = document.querySelector('#update-medicine-modal');
    const closeMedicineUpdateModalBtn = document.querySelector('#close-upd-medicine-modal');
    const searchMedicineEl = document.querySelector('#search-medicine-input');


    // CONTAINERS
    const patientListContainer = document.querySelector('#patient-list-container');
    const medicineListContainer = document.querySelector('#inventory-list-container');
    const consultationList = document.querySelector('#consultations-list');


    // LOGIN
    const loginForm = document.querySelector('#login-form');


    // LOGOUT
    const logoutBtn = document.querySelector('#logout-btn');


    const body = document.body;
    const hamburgerBtn = document.querySelector("#hamburger-btn");
    const sidebar = document.querySelector(".sidebar");


    // MODALS:
    if(addPatientBtn) {
        addPatientBtn.addEventListener('click', () => {
            addPatientModal.style.display = "flex";
        });
    }

    if(closePatientsUpdateModalBtn) {
        closePatientsUpdateModalBtn.addEventListener('click', () => {
            updatePatientModal.style.display = "none"
        })
    }

    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            addPatientModal.style.display = "none";
        });
    }

    if(addMedicineBtn) {
        addMedicineBtn.addEventListener('click', () => {
            addMedicineModal.style.display = "flex";
        });
    }

    if(closeMedicineModalBtn) {
        closeMedicineModalBtn.addEventListener('click', () => {
            addMedicineModal.style.display = "none";
        });
    }

    if(closeMedicineUpdateModalBtn) {
        closeMedicineUpdateModalBtn.addEventListener('click', () => {
            updateMedicineModal.style.display = "none";
        })
    }

    if(closeConsultationsModalBtn) {
        closeConsultationsModalBtn.addEventListener('click', () => {
            consultationsModal.style.display = 'none';
        }); 
    }


    // SIDEBAR

    if(hamburgerBtn) {
        hamburgerBtn.addEventListener('click', (event) => {
            event.stopPropagation(); 
            
            sidebar.classList.toggle('show');
            body.classList.toggle('sidebar-open');
        });
    }

    body.addEventListener('click', (event) => {
        if (body.classList.contains('sidebar-open')) {
            if (!sidebar.contains(event.target)) {
                sidebar.classList.remove('show');
                body.classList.remove('sidebar-open');
            }
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && body.classList.contains('sidebar-open')) {
            sidebar.classList.remove('show');
            body.classList.remove('sidebar-open');
        }
    });


    // DISPLAY/RENDER DATA
    // fetchPatients
    async function loadPatients() {
        try {
            const patients = await patientApi.fetchPatients()
            renderPatients(patients, patientListContainer)
        } catch(err) {
            console.error(err)
        }
    }

    async function loadMedicines() {
        try {
            const medicines = await medicineApi.fetchMedicines()
            renderMedicines(medicines, medicineListContainer)
        } catch(err) {
            console.error(err)
        }
    }

    
    // ADD PATIENT FORM
    if(addPatientForm) {
        addPatientForm.addEventListener('submit', async (event) => {
            event.preventDefault()

            const patientData = {
                name: document.querySelector('#patient-name').value,
                dob: document.querySelector('#patient-dob').value,
                address: document.querySelector('#patient-address').value
            }

            try {
                await patientApi.addPatient(patientData)
                addPatientForm.reset()
                addPatientModal.style.display = "none"
                loadPatients();
            } catch (err) {
                console.error(err);
            }
        })
    }
    // PATIENTS VIEW/EDIT/DELETE
    if(patientListContainer) {
        patientListContainer.addEventListener('click', async (event) => {
            const target = event.target;
            const patientItem = target.closest('.patient-item');
            if (!patientItem) return;

            const patientId = patientItem.dataset.id;
            
            // DELETE
            if (target.classList.contains('delete-btn')) {
                if (await showConfirmationModal('Are you sure you want to delete this patient?', confirmationModal)) {
                    try {
                        await patientApi.deletePatient(patientId);
                        loadPatients();
                    } catch (err) {
                        console.error(err);
                    }
                }
            }

            // EDIT/UPDATE
            if(target.classList.contains('edit-btn')) {
                try {
                    currentPatientId = patientId;
                    updatePatientModal.style.display = 'flex'
                } catch (err) {
                    console.error(err);
                }
            }

            // VIEW
            if (target.classList.contains('view-btn')) {
                try {
                    currentPatientId = patientId;
                    const patientName = patientItem.querySelector('td:first-child').textContent;
                    const consultations = await consultationApi.fetchConsultations(patientId);
                    
                    consultationUI.renderConsultations(consultations, consultationList);
                    consultationUI.showConsultationsModal(consultationsModal, consultationHeader, patientName);
                } catch (err) {
                    console.error(err);
                }
            }
        });
    }
    if(searchPatientEl) {
        searchPatientEl.addEventListener('input', async (e) => {
            e.preventDefault()

            try {
                const patients = await patientApi.searchPatients(searchPatientEl.value)
                if(patients.length === 0) {
                    loadPatients()
                    return
                }

                renderPatients(patients, patientListContainer)
            } catch(err) {
                console.error(err)
            }
        })
    }
    if(updatePatientForm) {
        updatePatientForm.addEventListener('submit', async (e) => {
            e.preventDefault()

            const patientData = {
                name: document.querySelector('#upd-patient-name').value,
                dob: document.querySelector('#upd-patient-dob').value,
                address: document.querySelector('#upd-patient-address').value
            }

            try {
                await patientApi.updatePatient(patientData, currentPatientId)
                updatePatientForm.reset()
                updatePatientModal.style.display = "none"
                loadPatients();
            } catch (err) {
                console.error(err);
            }
        })
    }


    // ADD CONSULTATION
    if(addConsultationForm) {
        addConsultationForm.addEventListener('submit', async (event) => {
            event.preventDefault()

            const consultationData = {
                complaint: document.querySelector('#consultation-complaint').value,
                diagnosis: document.querySelector('#consultation-diagnosis').value,
                treatment: document.querySelector('#consultation-treatment').value,
                consultation_date: document.querySelector('#consultation-date').value
            }
            
            try {
                await consultationApi.addConsultation(currentPatientId, consultationData);
                consultationUI.clearConsultationForm(addConsultationForm);
                
                const consultations = await consultationApi.fetchConsultations(currentPatientId);
                consultationUI.renderConsultations(consultations, consultationList);
            } catch (err) {
                console.error(err);
            }
        })
    }


    // ADD MEDICINE FORM
    if(addMedicineForm) {
        addMedicineForm.addEventListener('submit', async (event) => {
            event.preventDefault()

            const medicineData = {
                name: document.querySelector('#medicine-name').value,
                quantity: document.querySelector('#medicine-qty').value,
                description: document.querySelector('#medicine-description').value
            }

            try {
                await medicineApi.addMedicine(medicineData)
                addMedicineForm.reset()
                addMedicineModal.style.display = "none"
                loadMedicines();
            } catch (err) {
                console.error(err);
            }
        })
    }
    if(medicineListContainer) {
        medicineListContainer.addEventListener('click', async (event) => {
            const target = event.target;
            const medicineItem = target.closest('.medicine-item');
            if (!medicineItem) return;

            const medicineId = medicineItem.dataset.id;
            
            // DELETE
            if (target.classList.contains('delete-btn')) {
                if (await showConfirmationModal('Are you sure you want to delete this medicine?', confirmationModal)) {
                    try {
                        await medicineApi.deleteMedicine(medicineId);
                        loadMedicines();
                    } catch (err) {
                        console.error(err);
                    }
                }
            }

            if(target.classList.contains('edit-btn')) {
                try {
                    currentMedicineId = medicineId;
                    const medicineName = medicineItem.querySelector('td:first-child').textContent;
                    document.querySelector('#upd-medicine-name').value = medicineName
                    
                    updateMedicineModal.style.display = 'flex'
                } catch (err) {
                    console.error(err);
                }
            }
        });
    }
    if(updateMedicineForm) {
        updateMedicineForm.addEventListener('submit', async (e) => {
            e.preventDefault()

            const medicineData = {
                quantity: document.querySelector('#upd-medicine-qty').value,
                description: document.querySelector('#upd-medicine-description').value
            }

            try {
                await medicineApi.updateMedicine(currentMedicineId, medicineData)
                updateMedicineForm.reset()
                updateMedicineModal.style.display = "none"
                loadMedicines();
            } catch (err) {
                console.error(err);
            }
        })
    }
    if(searchMedicineEl) {
        searchMedicineEl.addEventListener('input', async (e) => {
            e.preventDefault()

            try {
                const medicines = await medicineApi.searchMedicine(searchMedicineEl.value)
                if(medicines.length === 0) {
                    loadMedicines()
                    return
                }

                renderMedicines(medicines, medicineListContainer)
            } catch(err) {
                console.error(err)
            }
        })
    }


    // LOGIN FORM
    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault()

            const credentials = {
                username: document.querySelector('#username-login').value,
                password: document.querySelector('#password-login').value
            }

            try {
                await authApi.loginUser(credentials)
                await showDisplayModal("Welcome back!", displayModal, displayTextEl)
                sessionStorage.setItem('isLoggedIn', 'true')
                window.location.href = 'dashboard.html'
            } catch(err) {
                console.error(err)
            }
        })
    }


    // LOGOUT BUTTON
    if(logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault()
            if(await showConfirmationModal('Are you sure you want to logout?', confirmationModal)) {
                sessionStorage.clear()
                window.location.href = 'index.html'
            }
        })
    }


    // CONFIRMATION MODAL
    const showConfirmationModal = (message, modal) => {
        return new Promise((resolve) => {
            modal.style.display = 'flex'
            confirmationMessageEl.innerHTML = message
            modal.addEventListener('click', (e) => {
                let choice = null
                const target = e.target
                
                if(target.classList.contains('yes-btn')) {
                    choice = true
                }

                if(target.classList.contains('cancel-btn')) {
                    choice = false
                }
                
                modal.style.display = 'none'
                resolve(choice)
            })
        })
    }
    // DISPLAY MODAL
    const showDisplayModal = (message, modal, messageEl) => {
        return new Promise((resolve) => {
            modal.style.display = 'flex'
            messageEl.innerHTML = message
            modal.addEventListener('click', (e) => {
                let choice = null
                const target = e.target
                
                if(target.classList.contains('ok-btn')) {
                    choice = true
                    modal.style.display = 'none'
                }
                
                resolve(choice)
            })
        })
    }







    

    if(window.location.pathname.endsWith("patients.html")){
        loadPatients()
    }

    if(window.location.pathname.endsWith("inventory.html")){
        loadMedicines()
    }

    // GATEKEEPER
    if(!window.location.pathname.endsWith("index.html") && !sessionStorage.getItem('isLoggedIn')){
        // alert('Session does not exist. Redirecting..')
        window.location.href = 'index.html'
    }

});