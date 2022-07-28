"use strict";
window.onload = function () {
    getValidDirectories()
};

load();
submit();
reset()

function reset() {
    const resetButton = document.getElementById('clearAll');
    resetButton.addEventListener('click', async (e) => {
        e.preventDefault();
        document.getElementById('form').reset();
        document.getElementById('selected_sub_folder').remove();
    })
}

function load() {
    listenForSelectedFolder();
    listenForSelectedSubFolder();
    listenForSelectedAction();
    listenForMarkDownAction();
    listenForProjectAction();
}

function submit() {
    const submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const obj = {
            action: getSelectedAction(),
            folder: getFolderSelection(),
            subFolder: getSubFolderSelection() === 'Add New Directory' ? getNewSubFolderNameSelection() : getSubFolderSelection(),
            checkboxes: getAllCheckBoxes(),
            markdown: {
                action: document.getElementById('markdownAction') ? document.getElementById('markdownAction').value : '',
                count: getMarkdownCount()
            },
            project: {
                action: document.getElementById('projectAction') ? document.getElementById('projectAction').value : '',
                count: getProjectCount()
            }
        };

        if (!obj.folder) {
            alert(`Selected Folder is empty`);
            return '';
        } else if (!obj.subFolder) {
            alert(`Selected Sub Folder is empty`);
            return '';
        } else if (!obj.action) {
            alert(`Selected Action is empty`);
            return '';
        }

        let data;
        switch (obj.action) {
            case 'CREATE':
                data = await fetchData('createFolders', 'POST', obj);
                break;
            case 'MARKDOWN':
                data = await fetchData('updateMarkDown', 'POST', obj);
                break;
            case 'PROJECTS':
                data = await fetchData('updateProjects', 'POST', obj);
                break;
        }


        // alert(`Available at: ${data.location}\nBe sure to start/restart ${data.appName}`);

    });
}

async function getValidDirectories() {
    const select = document.getElementById('selected_folder');
    const data = await fetchData('getFolders', 'GET');
    data.map((dir) => {
        const option = document.createElement('option');
        option.innerHTML = dir.pretty
        option.value = dir.key;
        select.appendChild(option);
    });
}

function getSelectedAction() {
    const elem = document.getElementById('selected_action');
    return elem.value.toUpperCase();
}

function listenForSelectedFolder() {
    const select = document.getElementById('selected_folder');
    select.addEventListener('change', async (event) => {

        document.getElementById('selected_sub_folder') && document.getElementById('selected_sub_folder').remove();
        const select_target_container = document.getElementById('selected_sub_folder_container');
        const select_target = createSelectionTarget('selected_sub_folder');
        select_target_container.append(select_target);

        const key = event.target.value;
        const data = key && await fetchData('getSubFolders', 'POST', { key });

        data.map((dir) => {
            const option = document.createElement('option');
            option.innerHTML = prettify(dir)
            option.value = dir;
            select_target.appendChild(option);
        });
        listenForSelectedSubFolder();
    });
}

function listenForSelectedSubFolder() {
    const select = document.getElementById('selected_sub_folder');
    console.log(select)
    select.addEventListener('change', async (event) => {
        document.getElementById('sub_remove') && document.getElementById('sub_remove').remove();
        if (event.target.value === 'Add New Directory') {
            const id = 'sub_folder_name';
            const options = createTextBoxOptions();
            const header = 'Set Subfolder Name';
            createDynamicElement(id, options, header, 'sub_remove')
        }
    });
}

function listenForSelectedAction() {
    const select = document.getElementById('selected_action');
    select.addEventListener('change', async (event) => {
        document.querySelectorAll('.remove').forEach(qs => qs.remove());
        let labels;
        let checks;
        let id;
        let options;
        let header;
        let texts;
        let values;
        let element;

        switch (event.target.value) {
            case 'CREATE':
                id = 'checkboxSections';
                if (!document.getElementById(id)) {
                    labels = ['markdowns', 'projects', 'exports'];
                    checks = [true, true, false];
                    options = createCheckBoxOptions(labels, checks);
                    header = 'Select Sections';
                    createDynamicElement(id, options, header, 'remove');
                }

                id = 'markdownCount';
                if (!document.getElementById(id)) {
                    texts = ['1', '5', '10', '30', '50', '100'];
                    values = texts.map((texts) => +texts);
                    options = createDropDownOptions(texts, values);
                    header = 'Markdown Count';
                    createDynamicElement(id, options, header, 'remove');
                }
                break;
            case 'MARKDOWN':
                id = 'markdownAction';
                if (!document.getElementById(id)) {
                    texts = ['Choose Action', 'Add', 'Remove'];
                    values = texts.map((text) => text.toUpperCase());
                    options = createDropDownOptions(texts, values);
                    header = 'Markdown Action';
                    element = createDynamicElement(id, options, header, 'remove');
                    listenForMarkDownAction();
                }

                break;
            case 'PROJECTS':
                id = 'projectAction';
                if (!document.getElementById(id)) {
                    texts = ['Choose Action', 'Add', 'Remove'];
                    values = texts.map((text) => text.toUpperCase());
                    options = createDropDownOptions(texts, values);
                    header = 'Project Action';
                    element = createDynamicElement(id, options, header, 'remove');
                    listenForProjectAction();
                }
                break;
            default:
                break;

        }

    });
}

function listenForMarkDownAction() {
    const select = document.getElementById('markdownAction');
    select && select.addEventListener('change', async (event) => {
        let id = 'markdownTextboxCount';
        let header;

        if (!document.getElementById(id)) {
            let options = createTextBoxOptions();
            switch (event.target.value) {
                case 'ADD':
                    header = 'Add How Many Markdowns?';
                    break;
                case 'REMOVE':
                    header = 'Remove How Many Markdowns?';
                    break;
                default:
                    break;
            }
            createDynamicElement(id, options, header, 'remove');
        }
    })
}

function listenForProjectAction() {
    const select = document.getElementById('projectAction');
    select && select.addEventListener('change', async (event) => {
        let id = 'projectTextboxCount';
        let header;

        if (!document.getElementById(id)) {
            let options = createTextBoxOptions();
            switch (event.target.value) {
                case 'ADD':
                    header = 'Add How Many Projects?';
                    break;
                case 'REMOVE':
                    header = 'Remove How Many Projects?';
                    break;
                default:
                    break;
            }
            createDynamicElement(id, options, header, 'remove');
        }
    })
}

function getFolderSelection() {
    return document.getElementById('selected_folder').value;
}

function getSubFolderSelection() {
    return document.getElementById('selected_sub_folder').value;
}

function getNewSubFolderNameSelection() {
    return document.getElementById('sub_folder_name').value;
}

function createSelectionTarget(id) {
    const select = document.createElement('select');
    select.setAttribute('id', id);
    select.classList.add("select-l");
    select.classList.add("is-family-monospace");
    return select;
}

function createDropDownOptions(texts, values) {
    const options = {};
    options.existAs = 'DROPDOWN';

    if (texts.length === values.length) {
        options.children = texts.map((text, id) => {
            return {
                text,
                value: values[id]
            }
        })
    }
    return options;
}

function createCheckBoxOptions(labels, checks) {
    const options = {};
    options.existAs = 'CHECKBOX';

    if (labels.length === checks.length) {
        options.children = labels.map((label, id) => {
            return {
                label,
                checked: checks[id]
            }
        })
    }
    return options;
}

function createTextBoxOptions() {
    const options = {};
    options.existAs = 'TEXTBOX';
    return options;
}

function createDynamicElement(id, options, header, name) {
    let element;
    const div = document.createElement('div');
    const form = document.getElementById('form');
    form.appendChild(div);

    const h2 = document.createElement('h2');
    h2.innerHTML = header;
    div.appendChild(h2);

    switch (options.existAs) {
        case 'DROPDOWN':
            element = document.createElement('select');
            options.children.map((child) => {
                const option = document.createElement('option');
                option.innerHTML = child.text
                option.value = child.value
                element.appendChild(option);
                element.classList.add('is-family-monospace');
                element.classList.add('select-l');
                div.appendChild(element);
            });
            element.id = id;
            break;
        case 'TEXTBOX':
            element = document.createElement('input');
            element.type = 'text';
            element.classList.add('input')
            element.value = 'Enter value';
            element.id = id;

            div.appendChild(element)
            break;
        case 'CHECKBOX':
            options.children.map((child) => {
                let subElement = document.createElement('div');
                let input = document.createElement('input');
                let label = document.createElement('label');

                input.type = 'checkbox';
                input.checked = child.checked;
                label.innerHTML = child.label;

                subElement.appendChild(input);
                subElement.appendChild(label);
                subElement.classList.add('checkbox');
                subElement.classList.add('checkboxSpacing');

                div.appendChild(subElement);
            });
            div.classList.add('checkboxDiv');

            break;
        default:
            ''
    }

    if (!element) {
        div.id = id;
    }

    if (!name) {
        div.classList.add(name);
    }

    return element || div;
}

function prettify(str) {
    return str.split("_").join(" ").trim();
}

function getMarkdownCount() {
    if (document.getElementById('markdownTextboxCount')) {
        return +document.getElementById('markdownTextboxCount').value;
    }

    if (document.getElementById('markdownCount')) {
        return +document.getElementById('markdownCount').value;
    }

    return 0;
}

function getProjectCount() {
    if (document.getElementById('projectTextboxCount')) {
        return +document.getElementById('projectTextboxCount').value;
    }

    if (document.getElementById('projectCount')) {
        return +document.getElementById('projectCount').value;
    }

    return 0;
}

function getAllCheckBoxes() {
    const result = [...document.querySelectorAll('.checkbox')].map(qs => {
        return {
            name: qs.innerText.toUpperCase(),
            checked: qs.firstChild.checked
        }
    }).reduce((obj, elem) => {
        let newObj = {};
        newObj[elem.name] = elem.checked;
        return { ...obj, ...newObj };
    }, {});

    return Object.keys(result).length ? result : null
}


function fetchOptions(method, body) {
    const headers = {
        'Content-Type': 'application/json',
    };

    return {
        method,
        headers,
        body: `${JSON.stringify({ data: body })}`
    };
}

async function fetchData(route, method, data) {
    const body = data;
    let fetchOtions = {};
    if (body) {
        fetchOtions = fetchOptions(method, body);
    }
    return await (await fetch(`http://localhost:8080/${route}`, fetchOtions)).json();
}
