const state = {
    idContact: 1,
    bodyTable: document.getElementById('body-table'),
    tagsArray: document.getElementsByClassName('form-item-interest__tag'),
    year: document.getElementById('date').innerText = (new Date).getFullYear(),
    btnAdd: document.getElementById('btn-add'),
    btnEdit: document.querySelector('.btn-edit'),
    btnDelete: document.querySelector('.btn-delete'),
    tagsContainer: document.getElementById('tags-container'),
    interest: document.getElementById('input-interest'),
    formAction: document.getElementById('form-action').value,
    inputValues: {
        name: document.getElementById('input-name'),
        phone: document.getElementById('input-phone'),
        email: document.getElementById('input-email'),
    }
};

state.btnAdd.addEventListener('click', (event) => {
    event.preventDefault();
    
    if (Object.keys(state.tagsArray).length === 0) {
        message('Aviso!', 'Preencha todos os campos.', 'info');
    } else {
        let qtdVazios = 0;
     
        for (const i  in state.inputValues) {
            let value = state.inputValues[i].value;
            if (value === '') qtdVazios++;
        }

        if(qtdVazios === 0) {
            state.formAction = document.getElementById('form-action').value;
            let id = 0;
            switch (state.formAction) {
                case 'add':
                    id = addContact();
                    break;
                case 'edit':
                    id = document.getElementById('idContact').value;
                    break;
                default:
                    break;
            }
            renderContacts(id);
            clearDataForm();
            
            message('Sucesso!', `Contato ${state.formAction === 'add' ? 'cadastrado' : 'alterado'} com sucesso!`, 'success');

        } else if (qtdVazios <= Object.keys(state.inputValues).length ) {
            message('Aviso!', 'Preencha todos os campos.', 'info');
        }    
    }
    
});


const addTag = (tagValue) => {
    const tag = document.createElement('span');
    tag.className = 'form-item-interest__tag';
    tag.textContent = tagValue;
    tag.onclick = function() {
      this.parentNode.removeChild(this);
    };
  
    state.tagsContainer.appendChild(tag);
};
  

state.interest.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag(this.value);
      this.value = ''; 
    }
});

const addContact = () => {
    const currentId = state.idContact;
    state.idContact +=1;
    return currentId
};

const formEdit = (id) => {
    clearDataForm();
    const tr = document.getElementById(id);
    const tds = tr.childNodes;
    const values = Object.values(state.inputValues);
    values.forEach((value, key) => {
        if (key === 2) {
            const link = tds[key].innerHTML;
            value.value = link.innerText;
        }
    
        value.value = tds[key].innerText;
       
    });

    let key = 0;
    for (const i  in state.inputValues) {
        state.inputValues[i].value = tds[key].innerText;
        key ++;
    }

    document.getElementById('form-action').value = 'edit';
    document.getElementById('idContact').value = id;
    const ul = tds[3].childNodes;
    
    ul.forEach((value) => {
        value.childNodes.forEach((li) => {
            addTag(li.textContent);
           
        });
    });
};

const deleteContact = (id,name) => {
    const tr = document.getElementById(id);

    Swal.fire({
        icon: 'question',
        title: `Você deseja excluir o contato de: ${name}?`,
        showDenyButton: true,
        confirmButtonText: "Excluir",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        denyButtonText: `Fechar`
        }).then((result) => {
            if (result.isConfirmed) {
                tr.remove();
                Swal.fire("Excluído!", "Contato excluído com sucesso!", "success");
            }
        });

};

const renderContacts = (id) => {
    let tr = document.getElementById(id);
    
    if (tr === null) {
        tr = document.createElement('tr');
        tr.id = id;
    } else {
        tr.innerHTML = '';
        tr.id = id;
    }

    let td = [];
    let tdInterest = '<td><ul>';
    for (const i  in state.inputValues) {
        let value = state.inputValues[i].value;
        if (state.inputValues[i].id === 'input-email') {

            td.push(`<td><a href='mailto:${value}' target='_blank'>${value}</a></td>`);
        } else {
            td.push(`<td>${value}</td>`);
        }
    }
    for (const i in state.tagsArray) {
        if (state.tagsArray[i].innerText !== undefined) tdInterest += `<li>${state.tagsArray[i].innerText}</li>`;
        
    }
    tdInterest += '</ul></td>';
    td.push(tdInterest);
    td.push(`<td class="table-responsive__actions">
                <button class="btn-edit" onclick="formEdit(${id})">Editar</button>
                <button class="btn-delete" onclick="deleteContact(${id},'${state.inputValues.name.value}')">Excluir</button>
            </td>`
    );
    
    td.forEach(cell =>  tr.innerHTML += cell);
    
    state.bodyTable.appendChild(tr);  
};


const clearDataForm = () => {
    for (const i  in state.inputValues) {
        state.inputValues[i].value = '';
    }
    state.tagsContainer.innerHTML = '';
};

const message = (title, text, icon) => {
    Swal.fire({
        title: title,
        text: text,
        icon:  icon,
        confirmButtonColor: "#007cba",
        cancelButtonColor: "#dc3545"
    });
};