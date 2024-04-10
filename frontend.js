const users = document.getElementById("users");
const loadButton = document.getElementById("load");
const addForm = document.getElementById("add");

function getUsers() {
    return fetch("http://localhost:3000/users").then((response) =>
        response.json()
    );
}

function createUser(data) {
    return fetch("http://localhost:3000/users", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => response.json());
}

function deleteUser(id) {
    return fetch("http://localhost:3000/users/" + id, {
        method: "DELETE",
    }).then((response) => response.json());
}

function getUserElement(user) {
    const paragraph = document.createElement("p");
    const paragraphText = document.createTextNode(
        user.id + " " + user.name + " "
    );
    const button = document.createElement("button");
    const buttonText = document.createTextNode("Delete");

    button.append(buttonText);

    paragraph.append(paragraphText);
    paragraph.append(button);

    button.addEventListener("click", () => {
        deleteUser(user.id);
        paragraph.outerHTML = "";
    });

    return paragraph;
}

function getUserElements(users) {
    const button = document.createElement("Delete");
    button.addEventListener("click", (event) => {});

    const elements = users.map((user) => {
        return getUserElement(user);
    });

    return elements;
}

loadButton.addEventListener("click", async (event) => {
    const button = document.createElement("Delete");
    button.addEventListener("click", (event) => {});

    const users = await getUsers();

    const elements = getUserElements(users);

    const usersContainer = document.getElementById("users");

    usersContainer.innerHTML = "";

    elements.forEach((element) => {
        usersContainer.append(element);
    });
});

addForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get name field from the DOM
    const nameValue = document.getElementById("nameField").value;

    console.log(nameValue);

    await createUser({ name: nameValue });

    // Cleaning the HTML inside
    const usersContainer = document.getElementById("users");

    usersContainer.innerHTML = "";

    const users = await getUsers();

    // Refresh the list after creating
    const elements = getUserElements(users);

    elements.forEach((element) => {
        usersContainer.append(element);
    });
});
