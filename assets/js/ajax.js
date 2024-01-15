
function getTestimonialData() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open("GET", "https://api.npoint.io/9d384ee2292596cec048", true)
        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText)
                resolve(response)
            } else {
                reject('Error loading data')
            }
        }

        xhr.onerror = () => {
            reject("Network Error!")
        }

        xhr.send()
    })
}


async function allTestimonial() {
    document.getElementById("testimonials").innerHTML = "LOADING..."
    const testimonials = await getTestimonialData()

    let testimonialHTML = ""

    testimonials.forEach((value) => {
        testimonialHTML += `<div class="testimonial">
                <img src="${value.image}" class="profile-testimonial" />
                <p class="quote">"${value.content}"</p>
                <p class="author">- ${value.author}</p>
            </div>`
    })

    document.getElementById("testimonials").innerHTML = testimonialHTML
}

async function filterTestimonial(rating) {
    document.getElementById("testimonials").innerHTML = "LOADING..."
    const testimonials = await getTestimonialData()

    const filteredTestimonial = testimonials.filter((value) => value.rating === rating)
    
    if (!filteredTestimonial.length) {
        return document.getElementById("testimonials").innerHTML = "<h1>Data not found!</h1>"
    }
    
    let filteredTestimonialHTML = ""
     
    filteredTestimonial.forEach((value) => {
        filteredTestimonialHTML += `<div class="testimonial">
                    <img src="${value.image}" class="profile-testimonial" />
                    <p class="quote">"${value.content}"</p>
                    <p class="author">- ${value.author}</p>
                </div>`
    })

    document.getElementById("testimonials").innerHTML = filteredTestimonialHTML
}

allTestimonial()
