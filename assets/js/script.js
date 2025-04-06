/* Author: 

*/

let users;
let textarea = document.querySelector('.get-year textarea');
let url = "https://abhijeet-portfolio.github.io/json/Birthday-data.json";
let input = document.querySelector('#year');
let error = document.querySelector('.error');
let days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
let dayElements = document.querySelectorAll('.days ul');

/*
* @params url string
* display the data once page get loaded
*/
fetch(url)
.then(res => res.json())
.then(data => {
    users = data;
    textarea.readOnly = true;
    textarea.innerHTML = JSON.stringify(data, null, 4);
})

/*
* validate input while user entering value
*/
input.addEventListener('input', () => {
    let regex = /[^0-9]/;
    if(regex.test(input.value)) {
        error.innerText = "This field must contains only digits"
        error.classList.add('show-error');
    }
    else {
        error.classList.remove('show-error');
    }
});

/*
* validate input after clicking on submit
*/
document.querySelector('.submit').addEventListener('click', event => {
    event.preventDefault();
    if(input.value === '') {
        error.innerText = "This field is required!"
        error.classList.add('show-error');
    }
    else if ((/[^0-9]/).test(input.value)) {
        error.innerText = "This field must contains only digits"
        error.classList.add('show-error');
    }
    else {
        error.classList.remove('show-error');
        let obj = new birthday(users,input.value);
        obj.clearPreviousData();
        obj.getDay();
    }    
});


/*
* class birthday includes all methods that will calculate the day according to input year
*/
class birthday {

    /*
    * @params users array
    * @params year integer
    * constructor
    */
    constructor(users,year) {
        this.users = users;
        this.year = year;
    }

    /*
    * to calaculate age, day from particular birthdate and initials of name
    */
    getDay() {
        this.users.forEach(user => {
            let nameArr = user.name.split(' ');
            let firstLetter = nameArr[0].charAt(0) + nameArr[1].charAt(0);
            let currYear = this.year + user.birthdate.slice(4);
            let day = new Date(currYear).getDay();
            let age = Number(this.year) - Number(user.birthdate.slice(0,4));
            
            /* if age is negtive it will not shown in calendar */
            if(age > 0) {
                this.insertElement(firstLetter,day,age);
            }         
        });

        this.getCount();
    }

    /*
    * to genrate the random color
    */
    randomColor() {
        let letters = '0123456789ABCDEF'.split('');
        let color = '#';
        for (let i = 0; i < 6; i++) { color += letters[Math.round(Math.random() * 15)];}
        return color;
    }

    /*
    * @params letter string
    * @params day interger
    * @params age interger
    * create and insert the element li according to age
    */
    insertElement(letter,day,age) {
        this.letter = letter;
        this.day = day;
        this.age = age;
        dayElements.forEach(element => {
            if(element.className === days[day]) {
                let newli = document.createElement('li');
                newli.style.background = this.randomColor();
                newli.innerText = letter;
                newli.setAttribute('data-age', age);
                element.appendChild(newli);
                

                if(element.childElementCount > 0) {
                    let child = Array.from(element.children);
                    for(let i = 0; i < child.length ; i++) {
                        if (child[i].getAttribute('data-age') >= newli.getAttribute('data-age')) {
                            element.insertBefore(newli, child[i]);
                            break;
                        }
                        else { element.appendChild(newli);}
                    }
                }
                else { element.appendChild(newli);}
            }
        });
    }

    /*
    * to get the count of birthday and adding class to ul according to count of child for better visual (styling)
    */
    getCount() {
        console.log(dayElements);
        dayElements.forEach(element => {
            if (element.childElementCount === 0) {
                element.classList.add('zero');
                element.innerHTML = '<li>~</li>';
                element.nextElementSibling.innerText = '0 Birthdays';
            }
            else if (element.childElementCount === 1) {
                element.classList.add('one');
                element.nextElementSibling.innerText = '1 Birthday';
            }
            else if (element.childElementCount < 5) {
                element.classList.add('less_than_five');
                element.nextElementSibling.innerText = element.childElementCount + ' Birthdays';
            }
            else if (element.childElementCount < 10) {
                element.classList.add('less_than_ten');
                element.nextElementSibling.innerText = element.childElementCount + ' Birthdays';
            }
            else {
                element.nextElementSibling.innerText = element.childElementCount + ' Birthdays';
            }
        });
    }

    /*
    * to clear the previous data after getting new input
    */
    clearPreviousData() {
        dayElements.forEach(element => {
            element.innerHTML = '';
            element.classList.remove('less_than_five');
            element.classList.remove('less_than_ten');
            element.classList.remove('one');
            element.classList.remove('zero');
        });
    }
}






















