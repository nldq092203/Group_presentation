const csrftoken = document.querySelector("[name=csrf-token]").content;

let full_member = document.querySelector(".full-member-div");
let edit_info = document.querySelector(".edit-info");
let memberData = null;
let csrfToken = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

if (full_member) {
  console.log(is_member);
  // Get the query parameters from the URL

  let myself = full_member.dataset.username == username;
  console.log(myself);
  console.log (full_member.dataset.username);
  if (!myself || is_member == "True") {
    fetch(`/api/member?username=${username}`, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        memberData = data;
        console.log(data);
        const content = `
            <h1>${data.name}</h1>
            <div class="info">
                <img class="avt" src="${data.avt}" alt="${
          data.name
        } Avatar" style="max-height:100px">
                <div class="dob">${data.dob}</div>
                <div class="id">${data.student_id}</div>
                <div class="email">${data.email}</div>
                <div class="address">${data.address}</div>
                <ul class="skillList">
                    ${(data.skills || [])
                      .map(
                        (skill) => `
                        <li>
                            <h4>${skill.name}</h4>
                            <h4>${skill.level}</h4>
                        </li>
                    `
                      )
                      .join("")}
                </ul>
                <ul class="experienceList">
                    ${(data.experiences || [])
                      .map(
                        (experience) => `
                    <li>
                        <h4>${experience.title}</h4>
                        <h4>${experience.agency}</h4>
                        <h4>${experience.description}</h4>
                    </li>
                    `
                      )
                      .join("")}
                </ul>
                <ul class="educationList">
                    ${(data.educations || [])
                      .map(
                        (education) => `
                    <li>
                        <h4>${education.institution}</h4>
                        <h4>${education.degree}</h4>
                        <h4>${education.start_date}</h4>
                        <h4>${education.end_date}</h4>
                    </li>
                    `
                      )
                      .join("")}
                </ul>
                <ul class="mediaList">
                    ${(data.medias || [])
                      .map(
                        (media) => `
                    <li>
                        <h4>${media.name}</h4>
                        <h4>${media.url}</h4>
                    </li>
                    `
                      )
                      .join("")}
                </ul>
            </div>
        `;
        // Insert the content into the full_member div
        full_member.innerHTML = content;
        let btn = '';
        if (myself) {
          if (is_member == "True") {
            btn = `<button class="btn-edit">Modify</button>`;
          } else {
            btn = `<button class="btn-join">Join Our Team</button>`;
          }
          if (btn != '') edit_info.innerHTML = btn;
        }
        console.log(btn);
        let btnElement = document.querySelector('.btn-edit') || document.querySelector('.btn-join');
        if(btnElement.className == "btn-edit"){
          btnElement.addEventListener("click",edit)
        }
        else if(btnElement.className == "btn-join"){
          btnElement.addEventListener("click", join)
        }
      });
  } else {
    let message, join_btn = '';
    if (is_requested == "True") {
      message = `<h4>Your request has been sent!</h4>`;
    } else {
      message = `<h4>You have not joined our team yet!</h4>`;
      join_btn = `<button class="btn-join">Join Our Team</button>`;
    }
    full_member.innerHTML = message;
    edit_info.innerHTML = join_btn;
    join_btn = document.querySelector(".btn-join");
    if(join_btn) join_btn.addEventListener("click", join);
  }

  function edit () {
    let skillsHTML = "";
    let experiencesHTML = "";
    let educationsHTML = "";
    let mediasHTML = "";

    if (memberData.skills) {
      memberData.skills.forEach((skill, index) => {
        skillsHTML += `
              <div class="skill">
                  <label for="skill-name-${index}">Skill Name:</label>
                  <input type="text" name="skill-name-${index}" id="skill-name-${index}" value="${
          skill.name || ""
        }">
                  <label for="skill-level-${index}">Skill Level:</label>
                  <input type="text" name="skill-level-${index}" id="skill-level-${index}" value="${
          skill.level || ""
        }">
              </div>
              `;
      });
    }

    if (memberData.experiences) {
      memberData.experiences.forEach((experience, index) => {
        experiencesHTML += `
              <div class="experience">
                  <label for="experience-title-${index}">Title:</label>
                  <input type="text" name="experience-title-${index}" id="experience-title-${index}" value="${
          experience.title || ""
        }">
                  <label for="experience-agency-${index}">Agency:</label>
                  <input type="text" name="experience-agency-${index}" id="experience-agency-${index}" value="${
          experience.agency || ""
        }">
                  <label for="experience-description-${index}">Description:</label>
                  <textarea name="experience-description-${index}" id="experience-description-${index}">${
          experience.description || ""
        }</textarea>
              </div>
              `;
      });
    }

    if (memberData.educations) {
      memberData.educations.forEach((education, index) => {
        educationsHTML += `
              <div class="education">
                  <label for="education-institution-${index}">Institution:</label>
                  <input type="text" name="education-institution-${index}" id="education-institution-${index}" value="${
          education.institution || ""
        }">
                  <label for="education-degree-${index}">Degree:</label>
                  <input type="text" name="education-degree-${index}" id="education-degree-${index}" value="${
          education.degree || ""
        }">
                  <label for="education-start-date-${index}">Start Date:</label>
                  <input type="date" name="education-start-date-${index}" id="education-start-date-${index}" value="${
          education.start_date || ""
        }">
                  <label for="education-end-date-${index}">End Date:</label>
                  <input type="date" name="education-end-date-${index}" id="education-end-date-${index}" value="${
          education.end_date || ""
        }">
              </div>
              `;
      });
    }

    if (memberData.medias) {
      memberData.medias.forEach((media, index) => {
        mediasHTML += `
              <div class="media">
                  <label for="media-name-${index}">Name:</label>
                  <input type="text" name="media-name-${index}" id="media-name-${index}" value="${
          media.name || ""
        }">
                  <label for="media-url-${index}">URL:</label>
                  <input type="text" name="media-url-${index}" id="media-url-${index}" value="${
          media.url || ""
        }">
              </div>
              `;
      });
    }

    full_member.innerHTML = `
      <form class="info-form-edit" method="post">
          <input type="hidden" name="csrfmiddlewaretoken" value="${csrfToken}">
          <label for="name">Name:</label>
          <input type="text" name="name" value="${
            memberData.name || ""
          }" required>
          <label for="dob">Date of Birth:</label>
          <input type="date" name="dob" value="${
            memberData.dob || ""
          }" required>
          <label for="id">Student ID:</label>
          <input type="text" name="id" value="${
            memberData.student_id || ""
          }" required>
          <label for="email">Email:</label>
          <input type="email" name="email" value="${
            memberData.email || ""
          }" required>
          <label for="address">Address:</label>
          <input type="text" name="address" id="address" value="${
            memberData.address || ""
          }" required>
          ${skillsHTML}
          ${experiencesHTML}
          ${educationsHTML}
          ${mediasHTML}
          <input type="submit" value="Save" />
      </form>
      `;
      let form = document.querySelector(".info-form-edit");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          let content = {
            name: form.querySelector('input[name="name"]').value,
            dob: form.querySelector('input[name="dob"]').value,
            id: form.querySelector('input[name="id"]').value,
            email: form.querySelector('input[name="email"]').value,
            address: form.querySelector('input[name="address"]').value,
            skills: [],
            experiences: [],
            educations: [],
            medias: [],
          };
    
          // Get skills, experiences, educations, and medias
          let skills = document.querySelectorAll(".skill");
          let experiences = document.querySelectorAll(".experience");
          let educations = document.querySelectorAll(".education");
          let medias = document.querySelectorAll(".media");
    
          skills.forEach((skill, index) => {

            let nameSkill = form.querySelector(`#skill-name-${index}`);
            let levelSkill = form.querySelector(`#skill-level-${index}`);
            if(nameSkill && levelSkill)
            content.skills.push({
              name: nameSkill.value,
              level: levelSkill.value
            });
          });
      
          experiences.forEach((experience, index) => {
            let titleExperience = form.querySelector(`#experience-title-${index}`);
            let agencyExperience = form.querySelector(`#experience-agency-${index}`);
            let descriptionExperience = form.querySelector(`#experience-description-${index}`);
            if(titleExperience && agencyExperience && descriptionExperience)
            content.experiences.push({
              title: titleExperience.value,
              agency: agencyExperience.value,
              description: descriptionExperience.value,
            });
          });
      
          educations.forEach((education, index) => {
            let institutionEducation = form.querySelector(`#education-institution-${index}`);
            let degreeEducation = form.querySelector(`#education-degree-${index}`);
            let start_dateEducation = form.querySelector(`#education-start-date-${index}`);
            let end_dateEducation = form.querySelector(`#education-end-date-${index}`);
            if (institutionEducation && degreeEducation && start_dateEducation && end_dateEducation)
            content.educations.push({
              institution: document.querySelector(`#education-institution-${index}`)
                .value,
              degree: document.querySelector(`#education-degree-${index}`).value,
              start_date: document.querySelector(`#education-start-date-${index}`)
                .value,
              end_date: document.querySelector(`#education-end-date-${index}`)
                .value,
            });
          });
      
          medias.forEach((media, index) => {
            let nameMedia = form.querySelector(`#media-name-${index}`);
            let urlMedia = form.querySelector(`#media-url-${index}`);
            if (nameMedia && urlMedia)
            content.medias.push({
              name: document.querySelector(`#media-name-${index}`).value,
              url: document.querySelector(`#media-url-${index}`).value,
            });
          });
          fetch(`/api/member?username=${username}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify(content),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              console.log(data);
              data = data.member;
              const content = `
                <h1>${data.name}</h1>
                <div class="info">
                    <img class="avt" src="${data.avt}" alt="${
                data.name
              } Avatar" style="max-height:100px">
                    <div class="dob">${data.dob}</div>
                    <div class="id">${data.student_id}</div>
                    <div class="email">${data.email}</div>
                    <div class="address">${data.address}</div>
                    <ul class="skillList">
                        ${(data.skills || [])
                          .map(
                            (skill) => `
                            <li>
                                <h4>${skill.name}</h4>
                                <h4>${skill.level}</h4>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                    <ul class="experienceList">
                        ${(data.experiences || [])
                          .map(
                            (experience) => `
                        <li>
                            <h4>${experience.title}</h4>
                            <h4>${experience.agency}</h4>
                            <h4>${experience.description}</h4>
                        </li>
                        `
                          )
                          .join("")}
                    </ul>
                    <ul class="educationList">
                        ${(data.educations || [])
                          .map(
                            (education) => `
                        <li>
                            <h4>${education.institution}</h4>
                            <h4>${education.degree}</h4>
                            <h4>${education.start_date}</h4>
                            <h4>${education.end_date}</h4>
                        </li>
                        `
                          )
                          .join("")}
                    </ul>
                    <ul class="mediaList">
                        ${(data.medias || [])
                          .map(
                            (media) => `
                        <li>
                            <h4>${media.name}</h4>
                            <h4>${media.url}</h4>
                        </li>
                        `
                          )
                          .join("")}
                    </ul>
                </div>
            `;
    
              // Insert the content into the full_member div
              full_member.innerHTML = content;
            });
        });
      }
  }
  function join (){
    let skillsHTML = "";
    let experiencesHTML = "";
    let educationsHTML = "";
    let mediasHTML = "";

    skillsHTML = `
    <div id="skills-container">
      <div class="skill">
        <label for="skill-name-0">Skill Name:</label>
        <input type="text" name="skill-name-0" id="skill-name-0" value="">
        <label for="skill-level-0">Skill Level:</label>
        <input type="text" name="skill-level-0" id="skill-level-0" value="">
      </div>
    </div>
    <button id="add-skill">Add Skill</button>
  `;
  if (document.querySelector("#add-skill"))
  document.querySelector("#add-skill").addEventListener("click", function(e) {
      e.preventDefault(); // Prevent the form from being submitted
    
      // Get the current number of skills
      let skillCount = document.querySelectorAll(".skill").length ;
    
      // Create a new set of input fields
      let newSkillHTML = `
        <div class="skill">
          <label for="skill-name-${skillCount}">Skill Name:</label>
          <input type="text" name="skill-name-${skillCount}" id="skill-name-${skillCount}" value="">
          <label for="skill-level-${skillCount}">Skill Level:</label>
          <input type="text" name="skill-level-${skillCount}" id="skill-level-${skillCount}" value="">
        </div>
      `;
    
      // Append the new input fields to the skills container
      document.querySelector("#skills-container").insertAdjacentHTML("beforeend", newSkillHTML);
    });

    experiencesHTML = `
              <div class="experience">
                  <label for="experience-title-0">Title:</label>
                  <input type="text" name="experience-title-0" id="experience-title-0" value="">
                  <label for="experience-agency-0">Agency:</label>
                  <input type="text" name="experience-agency-0" id="experience-agency-0 value="">
                  <label for="experience-description-0">Description:</label>
                  <textarea name="experience-description-0" id="experience-description-0"></textarea>
              </div>
              `;

    educationsHTML = `
              <div class="education">
                  <label for="education-institution-0">Institution:</label>
                  <input type="text" name="education-institution-0" id="education-institution-0" value="">
                  <label for="education-degree-0">Degree:</label>
                  <input type="text" name="education-degree-0" id="education-degree-0" value="">
                  <label for="education-start-date-0">Start Date:</label>
                  <input type="date" name="education-start-date-0" id="education-start-date-0" value="">
                  <label for="education-end-date-0">End Date:</label>
                  <input type="date" name="education-end-date-0" id="education-end-date-0" value="">
              </div>
              `;

    mediasHTML = `
              <div class="media">
                  <label for="media-name-0">Name:</label>
                  <input type="text" name="media-name-0" id="media-name-0" value="">
                  <label for="media-url-0">URL:</label>
                  <input type="text" name="media-url-0" id="media-url-0" value="">
              </div>
              `;

    full_member.innerHTML = `
      <form class="info-form-post" method="post">
          <input type="hidden" name="csrfmiddlewaretoken" value="${csrfToken}">
          <label for="name">Name:</label>
          <input type="text" name="name" value="" required>
          <label for="avt">Avatar:</label>
          <input type="file" name="avt" accept="image/*">
          <label for="dob">Date of Birth:</label>
          <input type="date" name="dob" value="" required>
          <label for="id">Student ID:</label>
          <input type="text" name="id" value="" required>
          <label for="email">Email:</label>
          <input type="email" name="email" value="" required>
          <label for="address">Address:</label>
          <input type="text" name="address" id="address" value="" required>
          ${skillsHTML}
          ${experiencesHTML}
          ${educationsHTML}
          ${mediasHTML}
          <input type="submit" value="Save" />
      </form>
      `;

  
let form = document.querySelector(".info-form-post");
if (form){
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let content = {
      name: form.querySelector('input[name="name"]').value,
      avt: form.querySelector('input[name="avt"]').files[0],
      dob: form.querySelector('input[name="dob"]').value,
      id: form.querySelector('input[name="id"]').value,
      email: form.querySelector('input[name="email"]').value,
      address: form.querySelector('input[name="address"]').value,
      skills: [],
      experiences: [],
      educations: [],
      medias: [],
    };

    // Get skills, experiences, educations, and medias
    let skills = form.querySelectorAll(".skill");
    let experiences = form.querySelectorAll(".experience");
    let educations = form.querySelectorAll(".education");
    let medias = form.querySelectorAll(".media");
    console.log(skills)

    skills.forEach((skill, index) => {

      let nameSkill = form.querySelector(`#skill-name-${index}`);
      let levelSkill = form.querySelector(`#skill-level-${index}`);
      if(nameSkill && levelSkill)
      content.skills.push({
        name: nameSkill.value,
        level: levelSkill.value
      });
    });

    experiences.forEach((experience, index) => {
      let titleExperience = form.querySelector(`#experience-title-${index}`);
      let agencyExperience = form.querySelector(`#experience-agency-${index}`);
      let descriptionExperience = form.querySelector(`#experience-description-${index}`);
      if(titleExperience && agencyExperience && descriptionExperience)
      content.experiences.push({
        title: titleExperience.value,
        agency: agencyExperience.value,
        description: descriptionExperience.value,
      });
    });

    educations.forEach((education, index) => {
      let institutionEducation = form.querySelector(`#education-institution-${index}`);
      let degreeEducation = form.querySelector(`#education-degree-${index}`);
      let start_dateEducation = form.querySelector(`#education-start-date-${index}`);
      let end_dateEducation = form.querySelector(`#education-end-date-${index}`);
      if (institutionEducation && degreeEducation && start_dateEducation && end_dateEducation)
      content.educations.push({
        institution: document.querySelector(`#education-institution-${index}`)
          .value,
        degree: document.querySelector(`#education-degree-${index}`).value,
        start_date: document.querySelector(`#education-start-date-${index}`)
          .value,
        end_date: document.querySelector(`#education-end-date-${index}`)
          .value,
      });
    });

    medias.forEach((media, index) => {
      let nameMedia = form.querySelector(`#media-name-${index}`);
      let urlMedia = form.querySelector(`#media-url-${index}`);
      if (nameMedia && urlMedia)
      content.medias.push({
        name: document.querySelector(`#media-name-${index}`).value,
        url: document.querySelector(`#media-url-${index}`).value,
      });
    });
    console.log(content);
    fetch("/api/member", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(content),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        location.reload();
      });
  });
  }
  }


}
