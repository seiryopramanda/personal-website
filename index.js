const express = require("express");

const app = express();
const port = 3000;

// Use handlebars for template engine
app.set("view engine", "hbs");
app.set("views", "src/views");

app.use("/assets", express.static("src/assets"));
app.use(express.urlencoded({ extended: false }));

app.get("/", home);
app.get("/project", project);
app.get("/project-detail/:id", projectDetail);
app.get("/testimonial", testimonial);
app.get("/contact", contact);
app.post("/project", handlePostProject);
app.get("/delete/:id", handleDeleteProject);
app.get("/edit-project/:id", editProject);
app.post("/edit-project", editPostProject);

const data = [];
const hbs = require("hbs");
const Handlebars = require("handlebars");

hbs.registerHelper("isChecked", (technologies, value) => {
  return technologies.includes(value) ? "checked" : "";
});

Handlebars.registerHelper("isArray", function (value) {
  return Array.isArray(value);
});

function home(req, res) {
  const dataWithDuration = data.map((project, index) => {
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    const duration = calculateDuration(startDate, endDate);
    return { ...project, duration };
  });

  res.render("index", { data: dataWithDuration, title: "Home" });
}

function calculateDuration(start, end) {
  const diffMs = end - start;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const diffYears = Math.floor(diffDays / 365);
  const diffMonths = Math.floor((diffDays % 365) / 30);
  const diffDaysRounded = Math.round(
    diffDays - diffYears * 365 - diffMonths * 30
  );

  let result = "";
  if (diffYears > 0) {
    result += diffYears + " years ";
  }
  if (diffMonths > 0) {
    result += diffMonths + " months ";
  }
  if (diffDaysRounded > 0) {
    result += diffDaysRounded + " days";
  }

  return result;
}

function project(req, res) {
  res.render("project", { title: "Add Project" });
}

function handlePostProject(req, res) {
  const { title, startDate, endDate, desc, technologies } = req.body;

  data.push({
    title,
    startDate,
    endDate,
    desc,
    technologies: Array.isArray(technologies) ? technologies : [technologies],
  });

  console.log(data);
  res.redirect("/");
}

function projectDetail(req, res) {
  const { id } = req.params;
  const dataDetail = data[id];
  const startDate = new Date(dataDetail.startDate);
  const endDate = new Date(dataDetail.endDate);
  dataDetail.duration = calculateDuration(startDate, endDate);
  res.render("project-detail", { data: dataDetail, title: "Detail Project" });
}

function handleDeleteProject(req, res) {
  const { id } = req.params;
  data.splice(id, 1);
  res.redirect("/");
}

function editProject(req, res) {
  const { id } = req.params;
  const dataEdit = data[parseInt(id)];
  dataEdit.id = parseInt(id);

  console.log("dataEdit", dataEdit);

  res.render("edit-project", {
    data: dataEdit,
    title: "Edit Project",
    id: id,
  });
}

function editPostProject(req, res) {
  const { id, title, startDate, endDate, desc, technologies } = req.body;
  data[parseInt(id)] = {
    id,
    title,
    startDate,
    endDate,
    desc,
    technologies: Array.isArray(technologies) ? technologies : [technologies],
  };

  console.log("technologies", technologies);
  res.redirect("/");
}

function testimonial(req, res) {
  res.render("testimonial", { title: "Testimonials" });
}

function contact(req, res) {
  res.render("contact", { title: "Contact Me" });
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
