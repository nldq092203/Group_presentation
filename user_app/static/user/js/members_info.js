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
                  <div data-username="${member.username}">
                      <img src="${member.avt}" alt="Avatar of ${member.name}" style="max-height:100px">
                      <p>${member.name}</p>
                      <a href="/member?username=${member.username}">View Profile</a>
                  </div>
              `;

        // Append the content to the members_list
        members_list.innerHTML += content;
      });
    });
}
