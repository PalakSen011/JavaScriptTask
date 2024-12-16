document.addEventListener("DOMContentLoaded", () => {

    // ******************---Fetching data---***************************
    const URL = "https://jsonplaceholder.typicode.com/users/1/posts";
    const tableBody = document.querySelector("#table-body");
    const updateForm = document.getElementById("update-form");
    const updateIdInput = document.getElementById("update-id");
    const updateTitleInput = document.getElementById("update-title");
    const updateContentInput = document.getElementById("update-content");
    const formContainer = document.querySelector(".add-post-container");
    const crossBtn = document.getElementById("cross-btn");
    const editButton = document.querySelector(".edit-button");
    const addButton = document.querySelector(".add-btn");
    const addbtnForm = document.querySelector(".add-button");
    const selectpageId = document.getElementById("pages");
    let data = [];
    let len = 0;


    //******************* Fetching data from the API************************
    async function functionToCall() {
        try {
            let result = await fetch(URL);
            data = await result.json();
            console.log(data);

            if (!result.ok) {
                throw new Error("Could not fetch the data");
            }

            for (let i = 1; i <= data.length; i++) {
                const option = document.createElement("option");
                option.value = i;
                option.textContent = i;
                selectpageId.appendChild(option);
            }
            populateTable(data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }

    }

    // data.forEach((row) => {
    //     

    // });

    //*******Populating the table with data***********

    function populateTable(data) {
        const row = data.map(item =>
            `<tr>
            <td>${item.userId}</td>
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${item.body}</td>
            <td ><button class="edit-btn"  data-id ="${item.id}" >Edit</button>
            <button class="delete-btn"  data-id="${item.id}">Delete</button></td>
        </tr>`
        ).join("");
        tableBody.innerHTML = row; // Set the rows directly in the table body

    }
    // *******************handling button visibility**********************
    let btn = "close";
    crossBtn.addEventListener("click", toCloseForm);

    function toCloseForm() {

        if (btn === "close") {
            formContainer.style.display = "none";
            btn = "open"
        }
        else {
            formContainer.style.display = "inline";
            btn = "close";
        }
    }
    // ************handling the edit and delete button from table*****************
    tableBody.addEventListener("click", (e) => {
        console.log(e.target);
        const button = e.target.closest(".edit-btn");
        // Check if the clicked element has the "edit-btn" class
        if (button) {
            console.log(button);
            const id = button.dataset.id; // Get the data-id value
            // console.log(data[id-1].title);
            updateIdInput.value = data[id - 1].id;
            updateTitleInput.value = data[id - 1].title;
            updateContentInput.value = data[id - 1].body;
            console.log(id);
            editButton.style.display = "inline";
            btn = "open";
            toCloseForm();
        }

        // Check if the clicked element is the "delete-btn" class
        if (e.target.classList.contains("delete-btn")) {
            const id = e.target.dataset.id;
            console.log(id);
            deleteButtonHandler(id);
        }

    });

    // ***************************Handle Edit(update) button click************************
    updateForm.addEventListener("submit", async (event) => {
        event.preventDefault();//****It Prevent form reload

        // Resource ID to be updated
        const resourceId = updateIdInput.value;
        console.log("Resource id:", resourceId, "type of :", typeof (resourceId));

        // Validate if the resource ID exists
        if (!resourceId) {
            console.error("Resource ID is missing!");
            return;
        }

        const updatedData = {
            title: updateTitleInput.value,
            body: updateContentInput.value
        };

        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${resourceId}`, { // fetchign URL include resource ID 
                method: "PUT",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error(`Failed to update record: ${response.status}`);
            }

            const result = await response.json();
            console.log("Updated data:", result);

            // Update the data array
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === parseInt(resourceId)) {
                    data[i].title = updatedData.title;
                    data[i].body = updatedData.body;
                    break; // Exiting the loop once the match is found
                }
            }
            populateTable(data);// Re-render the table with updated data
            btn = "close";
            toCloseForm();

        } catch (error) {
            console.error("Failed to update data:", error);
        }
    });

    // *******************Handle delete button click******************************
    async function deleteButtonHandler(id) {
        try {
            const result = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
                method: "DELETE",
            });

            if (!result.ok) {
                throw new Error("Could not delete the data");
            }

            console.log(`Post with ID ${id} deleted`);

            // Remove the deleted post from the data array
            data = data.filter(post => post.id !== parseInt(id));

            // Re-populate the table
            populateTable(data);
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    }

    // ************************Handle Add button click********************************************

    addButton.addEventListener("click", () => {
        btn = "open";
        toCloseForm();
        window.scrollTo({
            top: 0, // Position to scroll to (0 means top of the page)
            behavior: "smooth", // Smooth scrolling animation
        });
        updateTitleInput.value = "";
        updateContentInput.value = "";
        addbtnForm.style.display = "inline";
        editButton.style.display = "none";
    });
    //****************** Handle ADD button from form click**********************
    addbtnForm.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent form reload

        // Get input values
        const title = updateTitleInput.value;
        const body = updateContentInput.value;

        // Validate inputs
        if (!title || !body) {
            alert("Please fill in all fields.");
            return;
        }
        let maxId = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].id > maxId) {
                maxId = data[i].id;
            }
        }
        const newPost = {
            id: maxId + 1, // Generate a new ID
            title: title,
            body: body,
            userId: 1,
        };
        try {

            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(newPost),
            });

            if (!response.ok) {
                throw new Error(`Failed to add post: ${response.status}`);
            }

            const result = await response.json();
            console.log("Newly added post:", result);

            // console.log(result);
            data.push(newPost);

            // Populate the table with the updated data
            populateTable(data);
            btn = "close";
            toCloseForm();
        }
        catch (error) {
            console.error("Failed to add post:", error);

        }


    })
    functionToCall();
});

