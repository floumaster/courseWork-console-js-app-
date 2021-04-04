const readlineSync = require('readline-sync');
const moment = require('moment');
const userInterface = {
    choose_model() {
        const answer = parseInt(readlineSync.question(`Выберите данные, с которыми Вы хотите работать:
Данные про классы                                          - 1
Данные про учеников                                        - 2
Данные про оценки                                          - 3
Данные про предметы                                        - 4
Данные про темы                                            - 5
Данные про количество учеников в каждом классе             - 6
Средний балл учеников в параллели                          - 7
Количество тем в каждом предмете                           - 8
Ученики, чей средний балл ниже проходного                  - 9
Ученики, чей средний балл выше проходного                  - 10
Средние оценки ученика по всем предметам                   - 11
Количество двоечников, хорошистов и отличников в школе     - 12
Вернуться в предыдущее меню                                - 13
Введите номер: `));
        if (answer > 13 || answer < 1) {
            throw new Error('Вы выбрали несуществующий вариант.');
        }
        return answer;
    },
    choose_operation() {
        const answer = parseInt(readlineSync.question(`Выберите операцию, которую Вы хотите совершить:
Вставка                     - 1
Обновление                  - 2
Удаление                    - 3
Вывод                       - 4
Вывод с фильтрацией         - 5
Генерация случайных данных  - 6
Вернуться в предыдущее меню - 7
Введите номер: `));
        return answer;
    },
    createData(model, fields) {
        let data = {};
        fields.forEach(element => {
            let asn = readlineSync.question(`Введите ${model} ${element[0]} с типом данных ${element[1]}: `);
            asn = validate(asn, element[1]);
            data[element[0]] = asn;
        });
        return data;
    },
    chooseClassAndScore() {
        const grade = parseInt(readlineSync.question(`Введите параллель, оценки которой вы хотите рассмотреть: `));
        const score = parseInt(readlineSync.question(`Введите средний балл: `));
        return { gr: grade, sc: score };
    },
    chooseClass() {
        const grade = parseInt(readlineSync.question(`Введите параллель, оценки которой вы хотите рассмотреть: `));
        return grade;
    },
    choosePerson(pupils, ids) {
        console.table(pupils);
        const id = parseInt(readlineSync.question(`Выберите id ученика из списка: `));
        if (!ids.includes(id)) {
            throw new Error('Такого ученика не существует');
        }
        return id;
    },
    choose_id(data) {
        console.table(data);
        const id = parseInt(readlineSync.question('Выберите id: '));
        if (isNaN(id)) {
            throw new Error('Invalid data type');
        }
        let available_ids = [];
        data.forEach(el => {
            available_ids.push(el['id']);
        })
        if (!available_ids.includes(id)) {
            throw new Error('This id does not exist');
        }
        return id;
    },
    choose_field_as_a_condition(fields) {
        let data_arr = [];
        fields.forEach(el => {
            data_arr.push(el[0]);
        })
        const data = readlineSync.question(`Выберите атрибут, по которому будет происходить поиск записи ${data_arr.join(', ')}: `);
        if (!data_arr.includes(data)) {
            throw new Error('Неверно введен атрибут');
        }
        let condition = {};
        fields.forEach(el => {
            if (el[0] === data) {
                let value = readlineSync.question(`Введите значение ${el[0]} типа ${el[1]}: `);
                value = validate(value, el[1]);
                condition[el[0]] = value;
                console.log(condition);
            }
        })
        return condition;
    },
    generate_rnd_data() {
        const count = readlineSync.question(`Введите количество записей, которые нужно сгенерировать: `);
        if (isNaN(count)) {
            throw new Error('Invalid data type');
        }
        return parseInt(count);
    },
    outputTable(data) {
        console.table(data);
    },
    todo() {
        const answer = parseInt(readlineSync.question(`Что вы хотите сделать?:
Работа с таблицами отдельно             - 1
Резервирование и восстановление данных  - 2
Выход из приложения                     - 3
Введите номер: `));
        return answer;
    },
    backup() {
        const answer = parseInt(readlineSync.question(`Что вы хотите сделать?:
Сделать резервную копию базы данных     - 1
Сделать резервную копию таблицы         - 2
Восстановить базу данных                - 3
Восстановить таблицу                    - 4
Вернуться в предыдущее меню             - 5
Введите номер: `));
        return answer;
    },
    chose_name() {
        const answer = readlineSync.question(`Выберите имя для резервного файла: `);
        return answer;
    },
    error_output(err) {
        console.error('Ошибка: ' + err);
    },
    makeConditions(fields) {
        let condition = 'where ';
        fields.forEach(el => {
            let answer = readlineSync.question(`Вы хотите искать запись по полю ${el[0]}? 
1 - да
2 - нет
`);
            if (isNaN(answer)) {
                throw new Error('Неверный вариант ответа');
            }
            answer = parseInt(answer);
            if (answer === 1) {
                if (el[1] === 'integer') {
                    let op = readlineSync.question(`Для поля типа integer необходимо выбрать тип фильтрации
1 - задать значение для поля
2 - задать пределы для значения поля
`);
                    if (isNaN(op)) {
                        throw new Error('Неверный вариант ответа');
                    }
                    op = parseInt(op);
                    if (op === 1) {
                        let val = readlineSync.question(`Введите значение для ${el[0]}: `);
                        if (isNaN(val)) {
                            throw new Error('Неверный вариант ответа');
                        }
                        val = parseInt(val);
                        condition += `(${el[0]} = ${val}) and `
                    }
                    if (op === 2) {
                        let left = parseInt(readlineSync.question(`Введите нижний предел для ${el[0]}: `));
                        if (isNaN(left)) {
                            throw new Error('Неверный вариант ответа');
                        }
                        left = parseInt(left);
                        let right = parseInt(readlineSync.question(`Введите верхний предел для ${el[0]}: `));
                        if (isNaN(right)) {
                            throw new Error('Неверный вариант ответа');
                        }
                        right = parseInt(right);
                        condition += `(${el[0]} between ${left} and ${right}) and `
                    }
                }
                if (el[1] === 'text') {
                    let op = readlineSync.question(`Для поля типа text необходимо выбрать тип фильтрации
1 - задать значение для поля
2 - задать начало значения для поля
3 - задать конец значения для поля
`);
                    if (isNaN(op)) {
                        throw new Error('Неверный вариант ответа');
                    }
                    op = parseInt(op);
                    if (op === 1) {
                        const val = readlineSync.question(`Введите значение для ${el[0]}: `);
                        condition += `${el[0]} = '${val}' and `
                    }
                    if (op === 2) {
                        const val = readlineSync.question(`Введите начало значения для ${el[0]}: `);
                        let cond = {};
                        condition += `${el[0]} like '${val}%' and `
                    }
                    if (op === 3) {
                        const val = readlineSync.question(`Введите конец значения для ${el[0]}: `);
                        let cond = {};
                        condition += `${el[0]} like '%${val}' and `
                    }
                }
                if (el[1] === 'date') {
                    let op = readlineSync.question(`Для поля типа date необходимо выбрать тип фильтрации
1 - задать значение для поля
2 - задать пределы для значения поля
`);
                    if (isNaN(op)) {
                        throw new Error('Неверный вариант ответа');
                    }
                    op = parseInt(op);
                    if (op === 1) {
                        const val = readlineSync.question(`Введите значение для ${el[0]}: `);
                        if (!moment(val, moment.ISO_8601).isValid()) {
                            throw new Error('Invalid data type');
                        }
                        condition += `${el[0]} = '${val}' and `
                    }
                    if (op === 2) {
                        const left = readlineSync.question(`Введите нижний предел для ${el[0]}: `);
                        if (!moment(left, moment.ISO_8601).isValid()) {
                            throw new Error('Invalid data type');
                        }
                        const right = readlineSync.question(`Введите верхний предел для ${el[0]}: `);
                        if (!moment(right, moment.ISO_8601).isValid()) {
                            throw new Error('Invalid data type');
                        }
                        let cond = {};
                        condition += `(${el[0]} between '${left}' and '${right}') and `
                    }
                }
            }
        })
        condition = condition.substring(0, condition.lastIndexOf(' and '));
        return condition;
    },
    with_or_without() {
        let op = readlineSync.question(`Вы хотите сделать тест скорости выполнения запроса?
1 - да
2 - нет
`);
        if (isNaN(op) || op > 2 || op < 1) {
            throw new Error('Неверный вариант ответа');
        }
        op = parseInt(op);
        return (op);
    }
}

function validate(data, type) {
    switch (type) {
        case 'integer':
            if (isNaN(data)) {
                throw new Error('Invalid data type');
            }
            data = parseInt(data);
            break;
        case 'date':
            if (!moment(data, moment.ISO_8601).isValid()) {
                throw new Error('Invalid data type');
            }
            break;
        default:
            break;
    }
    return data;
}

module.exports = userInterface;