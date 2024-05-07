let table_div = document.querySelector(".table-div");
const csrftoken = document.querySelector("[name=csrf-token]").content;


if (table_div){
    fetch("/admin/api/requests_list", {
        method: "GET",
    })
        .then((response) =>response.json())
        .then(data => {
            console.log(data.serializer);
            serializer = data.serializer
            if (serializer){
                let content = '<table class="table"><thead><th>N</th><th>Member</th><th>Name</th><th>Action</th></thead><tbody>';
                serializer.forEach((member, index) => {
                    content += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${member.student_id}, &nbsp; ${member.username}</td>
                            <td>${member.name}</td>
                            <td><button class="fa fa-check btn publish" data-username=${member.username} ></button></td>
                        </tr>
                    `;
                });
                content += '</tbody></table>';
                table_div.innerHTML = content;
                let publish_btns = document.querySelectorAll(".publish");

                publish_btns.forEach((publish_btn) => {
                    console.log(publish_btn);
                    const username = publish_btn.dataset.username;
                    console.log(username);

                    publish_btn.onclick = () => {
                        fetch(`/admin/api/member?username=${username}`, {
                            method: 'PUT',
                            headers: {
                            'Content-Type': 'application/json',
                            "X-CSRFToken": csrftoken,

                            },
                            body: JSON.stringify({
                                username: username,
                                is_member: true
                            }),
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log(data);
                            location.reload();
                        })
                        .catch(error => {
                            console.error('There has been a problem with your fetch operation:', error);
                        });
                    }
});
            } else {
                table_div.innerHTML = '<h1>No requests in the database.</h1>';
            }
        })
}