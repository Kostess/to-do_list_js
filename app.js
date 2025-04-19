const root = document.querySelector(`#root`);
const listEl = document.querySelector(`#list`);

const saveData = (task) => {
    const arrData = [...getData("tasks"), task]
    localStorage.setItem('tasks', JSON.stringify(arrData));
}

const getData = (key) => {
    return JSON.parse(localStorage.getItem(key)) || [];
}

const deleteData = (id) => {
    const newArrTasks = getData("tasks").filter((item) => item.id !== id);
    localStorage.setItem('tasks', JSON.stringify(newArrTasks));
}

const updateStatus = (id) => {
    const newArrData = getData("tasks").map((task) => {
        if (task.id === id) {
            task.status = !task.status;
        }
        return task;
    })

    localStorage.setItem('tasks', JSON.stringify(newArrData));
}

const updateValue = (id, text) => {
    const newArrData = getData("tasks").map((task) => {
        if (task.id === id) {
            task.value = text;
        }
        return task;
    })

    localStorage.setItem('tasks', JSON.stringify(newArrData));
}

const createTask = (taskId, taskValue, taskStatus) => {
    const task = document.createElement('li');
    task.setAttribute('class', 'task');


    const spanText = document.createElement('span');
    spanText.setAttribute('class', `text-task ${taskStatus? 'through' : ''}`);
    spanText.setAttribute('data-id', taskId);
    spanText.textContent = taskValue;

    const btnDeleteTask = document.createElement('button');
    btnDeleteTask.setAttribute('class', 'buttonDelete');
    btnDeleteTask.setAttribute('data-id', taskId);
    btnDeleteTask.textContent = "❌";

    const checkboxEl = document.createElement('input');
    checkboxEl.setAttribute('type', 'checkbox');
    checkboxEl.setAttribute('class', 'checkBoxInput');
    checkboxEl.setAttribute('data-id', taskId);
    checkboxEl.checked = taskStatus;

    task.appendChild(checkboxEl);
    task.appendChild(spanText);
    task.appendChild(btnDeleteTask);
    return task;
}

const textWithInput = (element) => {
    const editText = document.createElement('input');
    editText.setAttribute('class', 'edit-task');
    editText.value = element.textContent;

    element.replaceWith(editText);
    editText.focus();

    root.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            updateValue(element.dataset.id, editText.value);
            outListTask();
        }

        if (event.key === 'Escape') {
            editText.value = element.textContent;
            editText.replaceWith(element);
        }
    })

    editText.addEventListener('blur', () => {
        updateValue(element.dataset.id, editText.value);
        outListTask();
    })

}

const outListTask = () => {
    const list = document.querySelector(`#list`);
    list.innerHTML = '';
    getData("tasks").map((item) => {
        list.append(createTask(item.id, item.value, item.status));
    })
}

window.addEventListener('load', () => {
    outListTask();
})

root.addEventListener('click', (event) => {
    if (event.target.id === 'button-add-task') {
        const elInput = document.querySelector(`#input-task`);
        const dataValue = elInput.value.trim()
        if (dataValue.length !== 0) {
            const task = {
                id: Date.now().toString(),
                value: dataValue,
                status: false
            }
            saveData(task);
            outListTask();
        }

        elInput.value = '';
    }

    if (event.target.classList.contains("buttonDelete")) {
        deleteData(event.target.dataset.id)
        outListTask();
    }

    if (event.target.classList.contains('checkBoxInput')) {
        updateStatus(event.target.dataset.id);
        outListTask();
    }
})

root.addEventListener(`dblclick`, (event) => {
    if (event.target.classList.contains("text-task")) {
        textWithInput(event.target);
    }
})

