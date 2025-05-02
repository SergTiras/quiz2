(function () {
    const Answers = {
        testId: sessionStorage.getItem('testId'),
        userResult: null,
        rightAnswers: [],
        quiz: null,
        init() {
            if (this.testId) {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", 'https://testologia.ru/get-quiz?id=' + this.testId, false);
                xhr.send();
                if (xhr.status === 200 && xhr.responseText) {
                    try {
                        this.quiz = JSON.parse(xhr.responseText);
                    } catch (e) {
                        location.href = 'index.html';
                    }
                } else {
                    location.href = 'index.html';
                }
            } else {
                location.href = 'index.html';
            }

            this.getAnswers();

            this.getUserAnswers()

            this.rightAnswers = JSON.parse(sessionStorage.getItem('rightAnswers'));

            document.getElementById('answers-title-name').innerHTML = this.quiz.name;

            document.getElementById('answers-user-data').innerHTML = this.getUserData();

            this.formAnswers();
        },
        getUserData(){
            return ('Тест выполнил <span> ' + sessionStorage.getItem('name') + ' ' + sessionStorage.getItem('surname') + ', ' + sessionStorage.getItem('email') + '</span>');
        },
        getUserAnswers(){
            let answers = JSON.parse(sessionStorage.getItem('userResult'));
            let answersIdArray = [];
            answers.forEach(answer => {
               answersIdArray.push(answer.chosenAnswerId);
            });
            this.userResult = answersIdArray;
        },
        getAnswers() {
            const xhr = new XMLHttpRequest();
            let id = sessionStorage.getItem('testId');
            let address = 'https://testologia.ru/get-quiz-right?id=' + id;
            let rightAnswers;
            xhr.open("GET", address);
            xhr.send();
            xhr.onload = function () {
                if (xhr.status === 200) {

                    rightAnswers = xhr.response;
                    sessionStorage.setItem('rightAnswers', rightAnswers);

                } else {
                    console.log(`Ошибка ${xhr.status}: ${xhr.statusText}`);


                }
            };
            xhr.onerror = function () {
                console.log("Запрос не удался");
            };
        },
        formAnswers() {
            let questionsContainer = document.getElementById('answers-questions');
            this.quiz.questions.forEach(question => {
                let item = document.createElement('div');
                item.className = 'answers-quiz-item';
                let itemName = document.createElement('div');
                itemName.className = 'answers-quiz-item-title';
                itemName.innerHTML = '<span>Вопрос ' + question.id + ':</span>' + question.question;
                item.appendChild(itemName);
                questionsContainer.appendChild(item);
                let options = document.createElement('div');
                options.className = 'answers-quiz-item-options';
                item.appendChild(options);
                let that = this;
                question.answers.forEach(option => {
                    let variant = document.createElement('div');
                    variant.className = 'answers-quiz-item-options-variant';
                    let circle = document.createElement('div');
                    circle.className = 'answers-quiz-item-options-circle';
                    let check = that.rightAnswers;
                    variant.appendChild(circle);
                    let text = document.createElement('div');
                    text.className = 'answers-quiz-item-options-text';
                    for (let i = 0; i < that.userResult.length; i++) {
                        if (that.userResult[i] === option.id && that.userResult[i] === check.find((a) => a === that.userResult[i]) ) {
                            circle.classList.add('answers-quiz-item-options-circle', 'correct-circle');
                            text.classList.add( 'answers-quiz-item-options-text', 'correct-text');
                        } else if(that.userResult[i] === option.id && that.userResult[i] !== check.find((a) => a === that.userResult[i])){
                            circle.classList.add('answers-quiz-item-options-circle', 'error-circle');
                            text.classList.add('answers-quiz-item-options-text', 'error-text');
                        }
                    }
                    text.innerText = option.answer;
                    variant.appendChild(text);
                    options.appendChild(variant);
                })
            })
        },

    }
    Answers.init();
}())