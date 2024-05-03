let members_list = document.querySelector(".members-list");

if (members_list) {
  fetch("/api/members_list", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.serializer);
      data.serializer.forEach((member) => {
        // Create a template literal for the member info
        const content = `
                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4" data-username="${member.username}">
                          <div class="card shadow">
                            <img src="${member.avt}" class="card-img-top" alt="Avatar of ${member.name}">
                            <div class="card-body">
                                <h2 class="card-title">${member.name}</h2>
                                <a href="/member?username=${member.username}">View Profile</a>
                            </div>
                          </div>
                        </div>
                      `;

        // Append the content to the members_list
        members_list.innerHTML += content;
      });
    });
}
