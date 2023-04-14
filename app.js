//before-after-slider 1
const container = document.querySelector('.ba-container');
document.querySelector('.slider').addEventListener('input', (e)=> {
    container.style.setProperty('--position', `${e.target.value}%`);
})

//before-after-slider 2
const tároló = document.querySelector('.ba-container-2');
document.querySelector('.slider-2').addEventListener('input', (e)=> {
    tároló.style.setProperty('--position', `${e.target.value}%`);
})

//shopping cart
const openModalButtons = document.querySelectorAll("[data-modal-target]")
const closeModalButtons = document.querySelectorAll("[data-close-button]")
const overlay = document.getElementById("overlay")

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

overlay.addEventListener("click", () => {
    const modals = document.querySelectorAll(".modal.active")
    modals.forEach(modal => {
        closeModal(modal)
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest(".modal")
        closeModal(modal)
    })
})

function openModal(modal){
    if (modal == null) return
    modal.classList.add("active")
    overlay.classList.add("active")
}

function closeModal(modal){
    if (modal == null) return
    modal.classList.remove("active")
    overlay.classList.remove("active")
}

