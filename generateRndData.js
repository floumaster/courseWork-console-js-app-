const parse = require('./parser');
const model = require('./model');
const moment = require('moment');


async function generatePeople(count) {
    let names = [];
    let surnames = [];
    let part = [];
    let arr = [];
    let n = 0;
    for (let i = 0; i < 2; i++) {
        await parse.parse().then((data) => {
            names = names.concat(data['name']);
            surnames = surnames.concat(data['surname']);
            part = part.concat(data['patronymic']);
        });
    }
    for (let i = 0; i < names.length; i++) {
        for (let j = 0; j < surnames.length; j++) {
            for (let k = 0; k < part.length; k++) {
                let obj = {};
                obj['name'] = names[i];
                obj['surname'] = surnames[j];
                obj['patronymic'] = part[k];
                arr.push(obj);
                n++;
                if (n === count) {
                    return arr;
                }
            }
        }
    }
    return arr;
}

function generateDates(count) {
    let arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(moment(randomDate(new Date(2001, 0, 1), new Date())).format('YYYY-MM-DD'))
    }
    return arr;
}

function generateRndIntegers(count, min, max) {
    let arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(getRandomInt(min, max));
    }
    return arr;
}

function randomDate(start, end) {
    return new Date(new Date(start).getTime() + Math.random() * (new Date(end).getTime() - new Date(start).getTime()));
}
async function generateClassId(count) {
    const last = await model.get_last_id('class', 'id');
    const first = await model.get_first_id('class', 'id');
    let arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(getRandomInt(first, last));
    }
    return arr;
}
async function generatePupilId(count) {
    const last = await model.get_last_id('pupil', 'id');
    const first = await model.get_first_id('pupil', 'id');
    let arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(getRandomInt(first, last));
    }
    return arr;
}
async function generateTopicId(count) {
    const last = await model.get_last_id('topic', 'id');
    const first = await model.get_first_id('topic', 'id');
    let arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(getRandomInt(first, last));
    }
    return arr;
}
async function generateSubjectId(count) {
    const last = await model.get_last_id('subject', 'id');
    const first = await model.get_first_id('subject', 'id');
    let arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(getRandomInt(first, last));
    }
    return arr;
}

function getRandomDirection(count) {
    let arr = [];
    for (let i = 0; i < count; i++) {
        if (getRandomInt(2) === 1) {
            arr.push(`Точная наука`);
        } else {
            arr.push(`Гуманитарная наука`);
        }
    }
    return arr;
}

function getRandomInt(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

const operations = {
    async generateSciences(count) {
        let info = 'name,direction';
        const subjects = [
            ['Чистописание', 'Гуманитарный'],
            ['Чтение', 'Гуманитарный'],
            ['Труд', 'Гуманитарный'],
            ['Природоведение', 'Гуманитарный'],
            ['Математика', 'Точный'],
            ['Музыка', 'Гуманитарный'],
            ['Изобразительное искусство', 'Гуманитарный'],
            ['Русский язык', 'Гуманитарный'],
            ['Физкультура', 'Гуманитарный'],
            ['Родной язык', 'Гуманитарный'],
            ['Иностранный язык', 'Гуманитарный'],
            ['Граждановедение', 'Гуманитарный'],
            ['Краеведение', 'Гуманитарный'],
            ['История', 'Гуманитарный'],
            ['Литература', 'Гуманитарный'],
            ['ОБЖ', 'Гуманитарный'],
            ['Технология', 'Точный'],
            ['Геогрфия', 'Точный'],
            ['Биология', 'Точный'],
            ['Информатика', 'Точный'],
            ['Обществознание', 'Гуманитарный'],
            ['Черчение', 'Точный'],
            ['Алгебра', 'Точный'],
            ['Геометрия', 'Точный'],
            ['Физика', 'Точный'],
            ['Химия', 'Точный'],
            ['Естествознание', 'Гуманитарный'],
            ['Основы экономики', 'Точный'],
            ['Правоведение', 'Гуманитарный'],
            ['Философия', 'Гуманитарный'],
            ['Экология', 'Точный'],
            ['Астрономия', 'Точный'],
            ['Начальная военная подготовка', 'Гуманитарный'],
            ['Мировая художественная культура', 'Гуманитарный'],
            ['Риторика', 'Гуманитарный']
        ]
        for (let i = 1; i < subjects.length; i++) {
            info += `\n${subjects[i][0]},${subjects[i][1]}`
        }
        return info;
        /*let str = `name,direction`;
        let first = [];
        let second = [];
        let n = 0;
        for (let i = 0; i < 2; i++) {
            await parse.parse_words().then((data) => {
                first = first.concat(data['first']);
                second = second.concat(data['second']);
            });
        }
        const arr = getRandomDirection(count);
        for (let i = 0; i < first.length; i++) {
            for (let j = 0; j < second.length; j++) {
                str += `\n${first[i]} ${second[j]} science,${arr[n]}`;
                n++;
                if (n === count) {
                    return str;
                }
            }
        }
        return str;*/
    },
    async generateMarks(count) {
        let str = `score,date,pupilId,subjectId,topicId`;
        let score = generateRndIntegers(count, 1, 12);
        let date = generateDates(count);
        let pid = await generatePupilId(count);
        let sid = await generateSubjectId(count);
        let tid = await generateTopicId(count);
        for (let i = 0; i < count; i++) {
            str += `\n${score[i]},${date[i]},${pid[i]},${sid[i]},${tid[i]}`
        }
        return str;
    },
    async generateTopcs(count) {
        let str = `name,subjectId`;
        let first = [];
        let second = [];
        let n = 0;
        const classid = await generateSubjectId(count);
        for (let i = 0; i < 2; i++) {
            await parse.parse_words().then((data) => {
                first = first.concat(data['first']);
                second = second.concat(data['second']);
            });
        }
        const arr = getRandomDirection(count);
        for (let i = 0; i < first.length; i++) {
            for (let j = 0; j < second.length; j++) {
                str += `\n${first[i]} ${second[j]},${classid[n]}`;
                n++;
                if (n === count) {
                    return str;
                }
            }
        }
        return str;
    },
    async generateClasses() {
        let info = 'grade,letters';
        for (let i = 1; i < 12; i++) {
            info += `\n${i},А`;
            info += `\n${i},Б`;
            info += `\n${i},В`;
        }
        return info;
        /*let n = await model.get_last_id('class', 'grade') + 1;
        const query = `insert into class ("grade", "letters") (with symbols(characters) as (VALUES ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'))
            (select trunc(1+random()*11)::int, string_agg(substr(characters, (random() * length(characters) + 1) :: INTEGER, 1), '')
            from symbols
            join generate_series(1,16) as word(chr_idx) on 1 = 1
            join generate_series(${n+1},${n+count}) as words(idx) on 1 = 1 -- # of words
            group by idx))`;
        return info;*/
    },
    async generatePupils(count) {
        const names = await generatePeople(count);
        const birthdays = generateDates(count);
        const classid = await generateClassId(count);
        let info = 'name,surname,patronymic,birth_date,classId';
        for (let i = 0; i < count; i++) {
            info += `\n${names[i].name},${names[i].surname},${names[i].patronymic},${birthdays[i]}, ${classid[i]}`;
        }
        return info;
    }
}


module.exports = operations;