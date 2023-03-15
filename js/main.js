let teachersRow = document.getElementById("teachers");
const teacher = document.getElementById("firstName");
const teacherLast = document.getElementById("lastName");
const teacherGroup = document.getElementById("groups");
const teacherEmail = document.getElementById("email");
const teacherphoneNumber = document.getElementById("phoneNumber");
const teacherIsMarried = document.getElementById("isMarried");
const teacherImage = document.getElementById("avatar");
const teacherForm = document.getElementById("teacherForm");
const teacherModal = document.getElementById("teacher-modal");
const teacherBtn = document.getElementById("teacher-add-btn");
const modalOpenBtn = document.getElementById("modal-open-btn");
let pagination = document.querySelector(".pagination");

let selected = null;
let page = 1;
let limit = 12;
let pagination_items;

const getTeacherCard = ({
    avatar,
    firstName,
    lastName,
    groups,
    email,
    isMarried,
    phoneNumber,
    id,
}) => {
    return `<div class="col-md-6 col-lg-3 my-3">
    <div class="card">
      <img height="200px" style={objectFit: 'cover'} src="${avatar}" class="card-img-top" alt="${avatar}" />
      <div class="card-body">
        <div class="d-flex gap-1">
          <h5 class="card-title">${firstName}</h5>
          <h5 class="card-title">${lastName}</h5>
        </div>
        <div>
          <span class="card-group mb-2">${groups}</span>
        </div>
        <div>
          <p class="card-email">${email}</p>
        </div>
        <div>
          <h5 class="teacher__married">${isMarried ? "Married" : "Not married"
        }</h5>
        </div>
        <div class="d-flex justify-content-between gap-3">
        <a href="student.html" onclick="saveId(${id})" class="btn btn-success teacher__btn1"> student vision </a>
          <button class="btn btn-danger teacher__btn w-50" onclick="deleteTeacher(${id})" >Delete</button>
        </div>
      </div>
    </div>
  </div>`;
};

async function getTeachers() {
    teachersRow.innerHTML = "";
    let res = await fetch(ENDPOINT + `teacher?page=${page}&limit=${limit}`, {
        method: "GET",
    });
    let teachers = await res.json();
    teachersRow.innerHTML = "";
    teachers.forEach((teacher) => {
        teachersRow.innerHTML += getTeacherCard(teacher);
    });
}

getTeachers();

teacherForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let check = this.checkValidity();
    this.classList.add("was-validated");
    if (check) {
        bootstrap.Modal.getInstance(teacherModal).hide();
        let data = {
            firstName: teacher.value,
            lastName: teacherLast.value,
            groups: teacherGroup.value,
            avatar: teacherImage.value,
            email: teacherEmail.value,
            isMarried: teacherIsMarried.checked,
            phoneNumber: teacherphoneNumber.value,
        };
        if (selected) {
            fetch(ENDPOINT + `teacher/${selected}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: { "content-type": "application/json" },
            }).then(() => {
                alert("Teacher is edited");
                getTeachers();
                emptyForm();
            });
        } else {
            fetch(ENDPOINT + "teacher", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "content-type": "application/json" },
            }).then(() => {
                alert("Teacher is added");
                getTeachers();
                emptyForm();
            });
        }
    }
});
function editTeacher(id) {
    selected = id;
    teacherBtn.innerHTML = "Save teacher";
    fetch(ENDPOINT + `teacher/${id}`)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            teacher.value = res.firstName;
            teacherLast.value = res.lastName;
            teacherGroup.value = res.groups;
            teacherImage.value = res.avatar;
            teacherEmail.value = res.email;
            teacherphoneNumber.value = res.phoneNumber;
            teacherIsMarried.checked = res.isMarried;
        });
}

function deleteTeacher(id) {
    let check = confirm("Rostan ham o'chirishni xohlaysizmi ?");
    if (check) {
        fetch(ENDPOINT + `teacher/${id}`, { method: "DELETE" }).then(() => {
            getTeachers();
        });
    }
}

function saveId(id) {
    localStorage.setItem("teacher", id);
}

function emptyForm() {
    teacher.value = "";
    teacherLast.value = "";
    teacherGroup.value = "";
    teacherImage.value = "";
    teacherEmail.value = "";
    teacherphoneNumber.value = "";
    teacherIsMarried.checked = "";
}

modalOpenBtn.addEventListener("click", () => {
    selected = null;
});

async function getPagination() {
    let pagination_numbers = "";
    let res = await fetch(ENDPOINT + `teacher`);
    let teachers = await res.json();
    products_number = teachers.length;
    pagination_items = Math.ceil(products_number / limit);
    Array(pagination_items)
        .fill(1)
        .forEach((item, index) => {
            pagination_numbers += `<li class="page-item ${page == index + 1 ? "active" : ""
                }" onclick="getPage(${index + 1})">
        <span class="page-link">
          ${index + 1}
        </span>
      </li>`;
        });

    pagination.innerHTML = `
    <li onclick="getPage('-')" class="page-item ${page == 1 ? "disabled" : ""
        }"><button class="page-link" href="#">Previous</button></li>
    ${pagination_numbers}
    <li onclick="getPage('+')" class="page-item ${page == pagination_items ? "disabled" : ""
        }"><button class="page-link" href="#">Next</button></li>
  `;
}

getPagination();

function getPage(p) {
    if (p == "+") {
        page++;
    } else if (p == "-") {
        page--;
    } else {
        page = p;
    }
    if (page <= pagination_items) {
        getTeachers();
        getPagination();
    }
}
