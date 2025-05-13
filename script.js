
const form = document.getElementById('skill-form');
const skillInput = document.getElementById('skill');
const levelSelect = document.getElementById('level');
const notesInput = document.getElementById('notes');
const skillList = document.getElementById('skill-list');
const filterSelect = document.getElementById('filter');

let skills = JSON.parse(localStorage.getItem('skills')) || [];


function saveSkills() {
  localStorage.setItem('skills', JSON.stringify(skills));
}


function renderSkills(filteredLevel = 'All') {
  skillList.innerHTML = '';
  const filteredSkills = filteredLevel === 'All'
    ? skills
    : skills.filter(skill => skill.level === filteredLevel);

  filteredSkills.forEach((skill, index) => {
    const card = document.createElement('div');
    card.className = `skill-card ${skill.level}`;
    card.innerHTML = `
      <div class="card-buttons">
        <button onclick="editSkill(${index})" title="Edit">✏️</button>
        <button onclick="confirmDeleteSkill(${index})" title="Delete">🗑️</button>
      </div>
      <h3>${skill.name}</h3>
      <p><strong>Level:</strong> ${skill.level}</p>
      ${skill.notes ? `<p><strong>Notes:</strong> ${skill.notes}</p>` : ''}
      <small>Added on: ${skill.date}</small>
    `;
    skillList.appendChild(card);
  });
}


form.addEventListener('submit', e => {
  e.preventDefault();
  const name = skillInput.value.trim();
  const level = levelSelect.value;
  const notes = notesInput.value.trim();

  if (!name) {
    Swal.fire('Oops!', 'Please enter a skill name.', 'warning');
    return;
  }

  const newSkill = {
    name,
    level,
    notes,
    date: new Date().toLocaleDateString()
  };

  
  const editingIndex = form.getAttribute('data-editing-index');
  if (editingIndex !== null) {
    skills[editingIndex] = newSkill;
    form.removeAttribute('data-editing-index');
    Swal.fire('Updated!', 'Skill updated successfully.', 'success');
  } else {
    skills.push(newSkill);
    Swal.fire('Added!', 'Skill added successfully.', 'success');
  }

  saveSkills();
  renderSkills(filterSelect.value);
  form.reset();
});


function editSkill(index) {
  const skill = skills[index];
  skillInput.value = skill.name;
  levelSelect.value = skill.level;
  notesInput.value = skill.notes;
  form.setAttribute('data-editing-index', index);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


function confirmDeleteSkill(index) {
  Swal.fire({
    title: 'Delete this skill?',
    text: "You can't undo this.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Yes, delete it!'
  }).then(result => {
    if (result.isConfirmed) {
      skills.splice(index, 1);
      saveSkills();
      renderSkills(filterSelect.value);
      Swal.fire('Deleted!', 'Skill has been removed.', 'success');
    }
  });
}


filterSelect.addEventListener('change', () => {
  renderSkills(filterSelect.value);
});


renderSkills();
