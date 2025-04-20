const root = document.querySelector(`#root`);

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

const setActiveFilter = () => {
    document.querySelectorAll(`.filter`).forEach((filter) => {
        const filterValue = localStorage.getItem('filter') || 'all';
        if (filterValue === filter.id) {
            filter.classList.add('active');
        } else {
            filter.classList.remove('active');
        }
    })
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

    const handlerKeydown = (event) => {
        if (event.key === 'Enter') {
            updateValue(element.dataset.id, editText.value);
            setTimeout(outListTask, 10);

            editText.removeEventListener('blur', handlerBlur);
            root.removeEventListener('keydown', handlerKeydown);
        }

        if (event.key === 'Escape') {
            editText.value = element.textContent;
            editText.replaceWith(element);

            editText.removeEventListener('blur', handlerBlur);
            root.removeEventListener('keydown', handlerKeydown);
        }
    }

    const handlerBlur = () => {
        updateValue(element.dataset.id, editText.value);
        outListTask();

        root.removeEventListener('keydown', handlerKeydown);
    }

    root.addEventListener('keydown', handlerKeydown);
    editText.addEventListener('blur', handlerBlur);
}

const outListTask = () => {
    const list = document.querySelector(`#list`);
    list.innerHTML = '';
    const filter = localStorage.getItem('filter') || 'all';
    getData("tasks").map((item) => {
        switch (filter) {
            case 'not-completed':
                if (!item.status) {
                    return list.append(createTask(item.id, item.value, item.status));
                }
                break;
            case 'completed':
                if (item.status) {
                    return list.append(createTask(item.id, item.value, item.status));
                }
                break;
            default:
                return list.append(createTask(item.id, item.value, item.status));
                break;
        }

    })
}

window.addEventListener('load', () => {
    setActiveFilter();
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

    if (event.target.classList.contains('filter')) {
        localStorage.setItem('filter', event.target.id);
        setActiveFilter();
        outListTask();
    }
})

root.addEventListener(`dblclick`, (event) => {
    if (event.target.classList.contains("text-task")) {
        textWithInput(event.target);
    }
})

