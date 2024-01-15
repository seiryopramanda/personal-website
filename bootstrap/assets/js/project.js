const projects = [];

function addProject(event) {
  event.preventDefault();

  const name = document.getElementById("input-project-name").value;
  const startDate = document.getElementById("input-start-date").value;
  const endDate = document.getElementById("input-end-date").value;
  const desc = document.getElementById("desc").value;
  let image = document.getElementById("input-project-image").files;
  const nodejs = document.getElementById("nodejs").checked;
  const reactjs = document.getElementById("reactjs").checked;
  const vuejs = document.getElementById("vuejs").checked;
  const angularjs = document.getElementById("angularjs").checked;

  image = URL.createObjectURL(image[0]);

  const createdAt = new Date();

  // Mendapatkan data yang sudah tersimpan di local storage
  const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];

  // Menambahkan data baru ke dalam array projects
  const project = {
    name,
    startDate,
    endDate,
    desc,
    image,
    createdAt,
    nodejs,
    reactjs,
    vuejs,
    angularjs,
  };

  storedProjects.unshift(project);

  // Menyimpan array projects kembali ke local storage
  localStorage.setItem("projects", JSON.stringify(storedProjects));

  displayProjects();

  console.log("projects", storedProjects);
}

function calculateDuration(startDate, endDate) {
  let duration = endDate - startDate;
  let durationInDays = duration / (1000 * 60 * 60 * 24);

  if (durationInDays < 30) {
    return `${Math.floor(durationInDays)} Hari`;
  } else if (durationInDays >= 30 && durationInDays < 365) {
    return `${Math.floor(durationInDays / 30)} Bulan`;
  } else {
    return `${Math.floor(durationInDays / 365)} Tahun`;
  }
}

function displayProjects() {
  // Mendapatkan data dari local storage
  const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];

  // Membangun HTML untuk setiap proyek
  let html = "";
  for (let index = 0; index < storedProjects.length; index++) {
    let renderTechIcon = "";
    if (storedProjects[index].nodejs) {
      renderTechIcon += `<i class="fa-brands fa-node-js"></i>`;
    }
    if (storedProjects[index].reactjs) {
      renderTechIcon += `<i class="fa-brands fa-react"></i>`;
    }
    if (storedProjects[index].vuejs) {
      renderTechIcon += `<i class="fa-brands fa-vuejs"></i>`;
    }
    if (storedProjects[index].angularjs) {
      renderTechIcon += `<i class="fa-brands fa-angular"></i>`;
    }

    html += `
    <div class="project-list-item">
      <div class="project-image">
        <img src="${storedProjects[index].image}" alt="" />
      </div>
      <div class="project-content">
        
        <h1>
          <a href="project-detail.html" target="_blank"
            >${storedProjects[index].name}</a
          >
          
        </h1>
        <div class="detail-project-content" >
        <span id="duration">Durasi : ${calculateDuration(
          new Date(storedProjects[index].startDate),
          new Date(storedProjects[index].endDate)
        )}</span>
        </div>
        <p>
          ${storedProjects[index].desc}
        </p>
        <div class="icon-tech">
        <p>${renderTechIcon}</p>
        </div>
        
        <br>
        <div class="btn-group">
          <button class="btn-edit">Edit</button>
          <button class="btn-post">Delete</button>
        </div>
      </div>
    </div>`;
  }

  // Menambahkan HTML ke dalam elemen dengan id "contents"
  document.getElementById("contents").innerHTML = html;
}

// Memanggil fungsi displayProjects untuk menampilkan data saat halaman dimuat
displayProjects();
