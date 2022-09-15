'use strict'

const quiz = () => {
    const form = document.querySelector('.form')


    const validate = (block) => {
        const message = document.createElement('div')
        const inputs = block.querySelectorAll('.form__input')
        const regExMail = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu
        const regExPhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/i;

        let isFalse = true

        message.classList.add('error')
        message.textContent = 'Введите корректные данные'


        block.querySelectorAll('.error').forEach(item => item.remove())

        inputs.forEach(item => {
            if (item.classList.contains('form__input_name') && /\d/gi.test(item.value)) {
                item.after(message.cloneNode(true))
                isFalse = false
            } else if (item.classList.contains('form__input_age') && !/^\d{2}/gi.test(item.value)) {
                item.after(message.cloneNode(true))
                isFalse = false
            } else if (item.classList.contains('form__input_phone') && !regExPhone.test(item.value)) {
                item.after(message.cloneNode(true))
                isFalse = false
            } else if (item.classList.contains('form__input_mail') && !regExMail.test(item.value)) {
                item.after(message.cloneNode(true))
                isFalse = false
            } else if (item.value.trim().length < 2) {
                item.after(message.cloneNode(true))
                isFalse = false
            }
        })

        return isFalse
    }

    const thanks = (data) => {
        const thanks = form.querySelector('.form__thanks')
        const list = document.createElement('ul')

        form.querySelectorAll('.form__block').forEach(item => {
            item.classList.remove('form__block_active')
        })

        thanks.classList.add('form__thanks_active')

        list.innerHTML = `
                    <li>
                        ${data.get('name')}
                    </li>
                    <li>
                        ${data.get('lastname')}
                    </li>
                    <li>
                        ${data.get('age')}
                    </li>
                    <li>
                        ${data.get('sex')}
                    </li>
                    <li>
                        ${data.get('country')}
                    </li>
                    <li>
                        ${data.get('phone')}
                    </li>
                    <li>
                        ${data.get('mail')}
                    </li>
        `
        thanks.querySelector('ul').after(list)
    }

    const nextForm = () => {
        form.addEventListener('click', (e) => {
            if (e.target.closest('.form__button_next')) {
                e.preventDefault()
                if (validate(e.target.closest('.form__block_active'))) {
                    let i
                    form.querySelectorAll('.form__block').forEach((item, index) => {
                        if (item.classList.contains('form__block_active')) {
                            i = index
                            item.classList.remove('form__block_active')
                        }
                    })
                    form.querySelectorAll('.form__block')[i + 1].classList.add('form__block_active')
                }
            } else if (e.target.closest('.form__button_send')) {
                e.preventDefault()
                if (validate(e.target.closest('.form'))) {
                    e.target.setAttribute('disabled', '')

                    fetch('https://jsonplaceholder.typicode.com/posts', {
                        method: 'POST',
                        body: new FormData(form),
                    }).then(res => res.json())
                        .then(data => {
                            thanks(new FormData(form))
                        })
                        .catch(err => {
                            console.log(err)
                            const error = document.createElement('div')
                            error.classList.add('error')
                            error.textContent = 'Ошибка, попробуйте позже'
                            e.target.after(error)
                        })
                }
            }
        })
    }

    nextForm()
}

quiz()