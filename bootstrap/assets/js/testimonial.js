class Testimonial {
  #author = "";
  #image = "";
  #content = "";

  constructor(author, image, content) {
    this.#author = author;
    this.#image = image;
    this.#content = content;
  }

  set author(val) {
    if (val.length <= 3) {
      return console.error("Author name cannot under 3 letters");
    }
    this.#author = val;
  }

  set image(val) {
    this.#image = val;
  }

  set content(val) {
    this.#content = val;
  }

  get author() {
    return this.#author;
  }

  get image() {
    return this.#image;
  }

  get content() {
    return this.#content;
  }

  html() {
    throw new Error("You must choose as author or company");
  }
}

class AuthorTestimonial extends Testimonial {
  html() {
    return `<div class="testimonial">
            <img src="${this.image}" class="profile-testimonial" />
            <p class="quote">"${this.content}"</p>
            <p class="author">- ${this.author}</p>
        </div>`;
  }
}

class CompanyTestimonial extends Testimonial {
  html() {
    return `<div class="testimonial">
            <img src="${this.image}" class="profile-testimonial" />
            <p class="quote">"${this.content}"</p>
            <p class="author">- ${this.author} Company</p>
        </div>`;
  }
}

const testimonial1 = new AuthorTestimonial(
  "Riyan Anto ",
  "https://images.pexels.com/photos/819530/pexels-photo-819530.jpeg?auto=compress&cs=tinysrgb&w=600",
  "Bagus sekali tampilan websitenya!"
);
const testimonial2 = new CompanyTestimonial(
  "Chaddrick",
  "https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=600",
  "Sangat menarik untuk kolaborasi!"
);
const testimonial3 = new AuthorTestimonial(
  "Naurah Anbar",
  "https://images.pexels.com/photos/1035682/pexels-photo-1035682.jpeg?auto=compress&cs=tinysrgb&w=600",
  "Terima kasih, sangat membantu"
);

const testimonials = [testimonial1, testimonial2, testimonial3]; // length => 3
let testimonialsHTML = "";

for (let index = 0; index < testimonials.length; index++) {
  testimonialsHTML += testimonials[index].html();
}

document.getElementById("testimonials").innerHTML = testimonialsHTML;
