// Patient Class
class Patient {
  constructor(name, age, gender, weight, height, bmi) {
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.weight = weight;
    this.height = height;
    this.bmi = bmi;
  }
}

// UI Classes
class UI {
  static displayPatients() {
    /*
    const StoredPatients = [
      {
        name: 'Débora',
        age: 27,
        gender: 'Feminino',
        weight: 60,
        height: 1.61,
        bmi: 35
      },
      {
        name: 'Adriano',
        age: 29,
        gender: 'Masculino',
        weight: 80,
        height: 1.73,
        bmi: 35
      }
    ];
    */

    //const patients = StoredPatients;

    const patients = Store.getPatients();

    patients.forEach(patient => UI.addPatientToList(patient));
  }

  static addPatientToList(patient) {
    const list = document.querySelector('#patient-list');
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${UI.jsUcFirst(patient.name)}</td>
      <td>${patient.age}</td>
      <td>${patient.gender}</td>
      <td>${patient.weight}</td>
      <td>${patient.height}</td>
      <td>${patient.bmi.toFixed(1)}</td>
      <td>
        <a href="#" class="edit" title="Editar"><i class="fas fa-pen edit"></i></a>
        <a href="#" class="delete" title="Excluir"><i class="fas fa-trash delete"></i></a>
      </td>
    `;

    list.appendChild(tr);
  }

  // Uppercase First Letter
  static jsUcFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Delete Patient
  static deletePatient(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.parentElement.remove();
    }
  }

  // Edit Patient
  static editPatient(el) {
    if (el.classList.contains('edit')) {
      // Get form values
      alert('Editar');
    }
  }

  // Show Alert
  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const wrapper = document.querySelector('.wrapper');
    const form = document.querySelector('#patient-form');
    wrapper.insertBefore(div, form);
    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  // Clear Fields
  static clearFields() {
    document.querySelector('#name').value = '';
    document.querySelector('#age').value = '';
    document.querySelector('#weight').value = '';
    document.querySelector('#height').value = '';
  }
}

// Store Class: Handles Storage
class Store {
  static getPatients() {
    let patients;
    if (localStorage.getItem('patients') === null) {
      patients = [];
    } else {
      patients = JSON.parse(localStorage.getItem('patients'));
    }
    return patients;
  }

  static addPatient(patient) {
    const patients = Store.getPatients();
    patients.push(patient);
    localStorage.setItem('patients', JSON.stringify(patients));
  }
}

// Event: Display Patients
document.addEventListener('DOMContentLoaded', UI.displayPatients);

// Event: Add Patient
document.querySelector('#patient-form').addEventListener('submit', e => {
  e.preventDefault();

  // Get form values
  const name = document.querySelector('#name').value;
  const age = document.querySelector('#age').value;
  const gender = document.querySelector('#gender').value;
  const weight = document.querySelector('#weight').value;
  const height = document.querySelector('#height').value;

  // Calculating BMI
  const square = Math.pow(height, 2);
  const bmi = (weight / square) * 10000;

  // Validate
  let letter = /^[A-Za-zá-ú]+$/;
  if (name === '') {
    UI.showAlert('Digite um nome', 'danger');
  } else if (!name.match(letter)) {
    UI.showAlert('Digite apenas letras', 'danger');
  } else if (age < 0 || age > 100) {
    UI.showAlert('Idade incorreta', 'danger');
  } else if (weight < 0) {
    UI.showAlert('Peso incorreto', 'danger');
  } else if (height < 0) {
    UI.showAlert('Altura incorreta', 'danger');
  } else {
    // Instantiate Patient
    const patient = new Patient(name, age, gender, weight, height, bmi);

    // Add Patient to UI
    UI.addPatientToList(patient);
    // Add patient to store
    Store.addPatient(patient);
    // Show Success Message
    UI.showAlert('Paciente adicionado com sucesso!', 'success');
    // Clear Fields
    UI.clearFields();

    // console.log(e.target);
  }
});

// Event: Remove and Edit a Patient
document.querySelector('#patient-list').addEventListener('click', e => {
  // Remove Patient from UI
  UI.deletePatient(e.target);

  // Edit Patient
  UI.editPatient(e.target);
});
