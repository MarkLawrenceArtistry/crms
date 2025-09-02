
export const renderConsultations = (consultations, divContainer) => {
    divContainer.innerHTML = ``

    if(consultations === 0) {
        divContainer.innerHTML = `<p>No consultations found.</p>`
    }

    consultations.forEach(consult => {
        const consultItem = document.createElement('div');
        consultItem.className = 'consultation-item';
        consultItem.innerHTML = `
            <p><strong>Date:</strong> ${new Date(consult.consultation_date).toLocaleDateString()}</p>
            <p><strong>Complaint:</strong> ${consult.complaint}</p>
            <p><strong>Diagnosis:</strong> ${consult.diagnosis || 'N/A'}</p>
            <p><strong>Treatment:</strong> ${consult.treatment || 'N/A'}</p>
        `;
        divContainer.appendChild(consultItem);  
    })
}

export const showConsultationsModal = (modal, header, patientName) => {
    header.textContent = `Consultations for ${patientName}`;
    modal.style.display = 'flex';
}

export function clearConsultationForm(form) {
    form.reset();
}