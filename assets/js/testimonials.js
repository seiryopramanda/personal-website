const testimonials = [
  {
    author: "Daffi Prayudhi",
    content: "Keren sekali mas!",
    image:
      "https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 3,
  },
  {
    author: "Leonardo",
    content: "Tampilannya sangat menarik",
    image:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 2,
  },
  {
    author: "Bayu Samudra",
    content: "Mantap mas",
    image:
      "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 1,
  },
  {
    author: "Najla Anbar",
    content: "Bagus sekali mas",
    image:
      "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 5,
  },
  {
    author: "Hadrian Naufal",
    content: "Perceft!",
    image:
      "https://images.pexels.com/photos/1182825/pexels-photo-1182825.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 2,
  },
];

function allTestimonial() {
  const testimonialHTML = testimonials.map((value) => {
    return `<div class="testimonial">
                   <img src="${value.image}" class="profile-testimonial" />
                   <p class="quote">"${value.content}"</p>
                   <p class="author">- ${value.author}</p>
               </div>`;
  });

  document.getElementById("testimonials").innerHTML = testimonialHTML.join(" ");
}

function filterTestimonial(rating) {
  const filteredTestimonial = testimonials.filter(
    (value) => value.rating === rating
  );

  const filteredTestimonialHTML = filteredTestimonial.map((value) => {
    return `<div class="testimonial">
                   <img src="${value.image}" class="profile-testimonial" />
                   <p class="quote">"${value.content}"</p>
                   <p class="author">- ${value.author}</p>
               </div>`;
  });

  document.getElementById("testimonials").innerHTML =
    filteredTestimonialHTML.join(" ");
}

allTestimonial();
