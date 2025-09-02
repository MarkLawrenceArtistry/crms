

export async function fetchConsultations(patientId) {
    const response = await fetch(`/api/patients/${patientId}/consultations`)
    if(!response.ok) {
        throw new Error('Failed to fetch consultations.')
    }

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}

export async function addConsultation(patientId, consultationData) {
    const response = await fetch(`/api/patients/${patientId}/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultationData)
    })
    if(!response.ok) {
        throw new Error('Failed to add consultation.')
    }

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}