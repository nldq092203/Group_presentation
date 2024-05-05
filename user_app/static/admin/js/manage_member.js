let table_div = document.querySelector(".table-div");
const csrftoken = document.querySelector("[name=csrf-token]").content;

if (table_div){
    fetch("/admin/api/members_list", {
        method: "GET",
    })
        .then((response) =>response.json())
        .then(data => {
            console.log(data.serializer);
            serializer = data.serializer
            if (serializer){
                let content = '<table class="table"><thead><th>N</th><th>Member</th><th>Name</th><th colspan="2">Action</th></thead><tbody>';
                serializer.forEach((member, index) => {
                    content += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${member.student_id}, &nbsp; ${member.username}</td>
                            <td>${member.name}</td>
                            <td><button class="fa fa-trash btn delete" data-username=${member.username}></button></td>
                        </tr>
                    `;
                });
                content += '</tbody></table>';
                table_div.innerHTML = content;
                let delete_btns = document.querySelectorAll(".delete");
                console.log(delete_btns);
                delete_btns.forEach((delete_btn) => {
                    const username = delete_btn.dataset.username;
                    delete_btn.addEventListener ("click", () => {
                        fetch(`/admin/api/member?username=${username}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                "X-CSRFToken": csrftoken,
                            }
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            // Only parse as JSON if the response has content
                            return response.text().then(text => text ? JSON.parse(text) : {});
                        })
                        .then(data => {
                            console.log(data);
                            const row = delete_btn.closest('tr'); // Get the closest tr parent element
                            location.reload();
                        })
                        .catch(error => {
                            console.error('There has been a problem with your fetch operation:', error);
                        });
                    });
                });
            } else {
                table_div.innerHTML = '<h1>No members in the database.</h1>';
            }
        })
        
    }
