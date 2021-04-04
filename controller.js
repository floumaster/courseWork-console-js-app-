const view = require('./view');
const model = require('./model');
const generate = require('./generateRndData');
const _backup = require('./backup');
const moment = require('moment');
var opn = require('opn');
const fs = require('fs')
const _insert = model.insert;
const _update = model.update;
const _delete = model.delete;
const _select = model.select;

todo();

async function todo() {
    await model.check_connection();
    const answer = view.todo();
    switch (answer) {
        case 1:
            await start().catch(err => { view.error_output(err) });
            break;
        case 2:
            await backup().catch(err => { view.error_output(err) });
            break;
        case 3:
            process.exit();
            break;
        default:
            view.error_output('Вы выбрали несуществующий вариант. ')
            await todo();
            break;
    }
}

async function backup() {
    const answer = view.backup();
    switch (answer) {
        case 1:
            const answer = view.chose_name();
            _backup.make_db_backup(answer);
            await todo();
            break;
        case 2:
            const answer1 = view.chose_name();
            _backup.make_table_backup(answer1);
            await todo();
            break;
        case 3:
            _backup.recovery_bd();
            await todo();
            break;
        case 4:
            await _backup.recovery_table();
            await todo();
            break;
        case 5:
            await todo();
            break;
        default:
            view.error_output('Вы выбрали несуществующий вариант. ')
            backup();
            break;
    }
}

async function start() {
    try {
        const entity_number = view.choose_model();
        if (entity_number === 6) {
            const data = await model.makeQuery(`select grade, letters, count(*) as pupils from class, pupil where pupil."classId" = class.id
            group by grade, letters
            order by grade`).catch(err => { throw new Error(err) });
            view.outputTable(data);
            let str = 'Количество учеников в каждом классе';
            data.forEach(element => {
                str += `\n${element.grade} ${element.letters} ${element.pupils}`;
            });
            fs.writeFileSync("./analytics/public/chart.txt", str);
            fs.writeFileSync('./analytics/public/info.json', JSON.stringify(data, null, 4));
            opn('http://localhost:3001/', { app: 'firefox' });
            opn('http://localhost:3001/chart', { app: 'firefox' });
            await todo();
        } else if (entity_number === 7) {
            const grade = view.chooseClass();
            const data1 = await model.makeQuery(`select name,surname,patronymic, avg(score) from pupil, mark, class
            where pupil.id = mark."pupilId"
            and class.id = pupil."classId"
            and class.grade = ${grade}
            group by name,surname,patronymic`).catch(err => { throw new Error(err) });
            //view.outputTable(data1);
            let str = `Средний балл учеников в ${grade} классе `;
            data1.forEach(element => {
                str += `\n${element.surname} ${element.name} ${element.patronymic} ${element.avg}`;
            });
            fs.writeFileSync("./analytics/public/chart.txt", str);
            fs.writeFileSync('./analytics/public/info.json', JSON.stringify(data1, null, 4));
            opn('http://localhost:3001/', { app: 'firefox' });
            opn('http://localhost:3001/chart', { app: 'firefox' });
            await todo();
        } else if (entity_number === 8) {
            const data = await model.makeQuery(`select subject.name, count(*) from topic, subject
            where subject.id = topic."subjectId"
            group by subject.name`).catch(err => { throw new Error(err) });
            view.outputTable(data);
            let str = 'Количество тем в каждом предмете';
            data.forEach(element => {
                str += `\n${element.name} ${element.count}`;
            });
            fs.writeFileSync("./analytics/public/chart.txt", str);
            fs.writeFileSync('./analytics/public/info.json', JSON.stringify(data, null, 4));
            opn('http://localhost:3001/', { app: 'firefox' });
            opn('http://localhost:3001/chart', { app: 'firefox' });
            await todo();
        } else if (entity_number === 9) {
            const info = view.chooseClassAndScore();
            const data1 = await model.makeQuery(`select name,surname,patronymic, avg(score) from pupil, mark, class
            where pupil.id = mark."pupilId"
            and class.id = pupil."classId"
            and class.grade = ${info.gr}
            group by name,surname,patronymic
            having avg(score) < ${info.sc}`).catch(err => { throw new Error(err) });
            view.outputTable(data1);
            let str = `Список учеников, которые рискуют не закончить успешно ${info.gr} класс`;
            data1.forEach(element => {
                str += `\n${element.surname} ${element.name} ${element.patronymic} ${element.avg}`;
            });
            fs.writeFileSync("./analytics/public/chart.txt", str);
            fs.writeFileSync('./analytics/public/info.json', JSON.stringify(data1, null, 4));
            opn('http://localhost:3001/', { app: 'firefox' });
            opn('http://localhost:3001/chart', { app: 'firefox' });
            await todo();
        } else if (entity_number === 10) {
            const info = view.chooseClassAndScore();
            const data1 = await model.makeQuery(`select name,surname,patronymic, avg(score) from pupil, mark, class
            where pupil.id = mark."pupilId"
            and class.id = pupil."classId"
            and class.grade = ${info.gr}
            group by name,surname,patronymic
            having avg(score) > ${info.sc}`).catch(err => { throw new Error(err) });
            view.outputTable(data1);
            let str = `Список отличников в ${info.gr} классе `;
            data1.forEach(element => {
                str += `\n${element.surname} ${element.name} ${element.patronymic} ${element.avg}`;
            });
            fs.writeFileSync("./analytics/public/chart.txt", str);
            fs.writeFileSync('./analytics/public/info.json', JSON.stringify(data1, null, 4));
            opn('http://localhost:3001/', { app: 'firefox' });
            opn('http://localhost:3001/chart', { app: 'firefox' });
            await todo();
        } else if (entity_number === 11) {
            const pupils = await model.makeQuery(`select id, surname, name, patronymic from pupil`);
            const answer = await model.makeQuery(`select id from pupil`);
            let ids = [];
            answer.forEach(el => {
                ids.push(el.id)
            })
            const id = view.choosePerson(pupils, ids);
            const fio = await model.makeQuery(`select surname, name, patronymic from pupil where id = ${id}`);
            const data1 = await model.makeQuery(`select subject.name, avg(score) from pupil, mark, subject
            where pupil.id = mark."pupilId"
            and mark."subjectId" = subject.id
            and pupil.id = ${id}
            group by subject.name`).catch(err => { throw new Error(err) });
            view.outputTable(data1);
            let str = `Оценки ${fio[0].surname} ${fio[0].name} ${fio[0].patronymic} по всем предметам `;
            data1.forEach(element => {
                str += `\n${element.name} ${element.avg}`;
            });
            fs.writeFileSync("./analytics/public/chart.txt", str);
            fs.writeFileSync('./analytics/public/info.json', JSON.stringify(data1, null, 4));
            opn('http://localhost:3001/', { app: 'firefox' });
            opn('http://localhost:3001/chart', { app: 'firefox' });
            await todo();
        } else if (entity_number === 12) {
            const bad = await model.makeQuery(`select count(*) from (select avg(score) from pupil, mark
            where mark."pupilId" = pupil.id
			group by (pupil.id)) as result
			where avg <= 5`);
            const middle = await model.makeQuery(`select count(*) from (select avg(score) from pupil, mark
            where mark."pupilId" = pupil.id
			group by (pupil.id)) as result
			where avg <= 9 and avg >5`);
            const strong = await model.makeQuery(`select count(*) from (select avg(score) from pupil, mark
            where mark."pupilId" = pupil.id
			group by (pupil.id)) as result
			where avg >= 9`);
            let str = 'Количество двоечников, хорошистов и отличников в школе ';
            str += `\nДвоечники ${bad[0].count}`;
            str += `\nХорошисты ${middle[0].count}`;
            str += `\nОтличники ${strong[0].count}`;
            console.log(str);
            fs.writeFileSync("./analytics/public/chart.txt", str);
            opn('http://localhost:3001/chart', { app: 'firefox' });
            await todo();
        } else {
            const operation_number = view.choose_operation();
            await makeOperationByNumber(operation_number, getModelByNmber(entity_number)).catch(err => { throw new Error(err) });
        }
    } catch (err) {
        view.error_output(err);
        await start()
    }
}

async function makeOperationByNumber(operation, entity) {
    switch (operation) {
        case 1:
            let fields = model.getFields(entity);
            fields.shift();
            let data = view.createData(entity, fields);
            const rel_arr = model.getRelations(entity);
            for (let i = 0; i < rel_arr.length; i++) {
                const tableData = await _select(rel_arr[i]).catch(err => { throw new Error(err) });
                if (tableData.length === 0) {
                    const extra_id = await makeOperationByNumber(1, rel_arr[i]).catch(err => { throw new Error(err) });
                    data[rel_arr[i] + 'Id'] = extra_id;
                } else {
                    const id = view.choose_id(tableData);
                    data[rel_arr[i] + 'Id'] = id;
                }
            }
            const _id = await _insert(entity, data).catch(err => { throw new Error(err) });
            await todo();
            break;
        case 2:
            const table = await _select(entity).catch(err => { throw new Error(err) });
            view.outputTable(table);
            let fields1 = model.getFields(entity);
            fields1.shift()
            const condition = view.choose_field_as_a_condition(model.getFields(entity));
            const upd_data = view.createData(entity, fields1);
            await _update(entity, upd_data, condition).catch(err => { throw new Error(err) });
            await todo();
            break;
        case 3:
            const table1 = await _select(entity).catch(err => { throw new Error(err) });
            view.outputTable(table1);
            const condition1 = view.choose_field_as_a_condition(model.getFields(entity));
            const id = await model.select_with_condition(entity, condition1).catch(err => { throw new Error(err) });
            await deleteRelations(entity, id[0].id);
            await todo();
            break;
        case 4:
            const table2 = await _select(entity).catch(async err => {
                await model.check_connection();
                throw new Error(err);
            });
            view.outputTable(table2);
            fs.writeFileSync('./analytics/info.json', JSON.stringify(table2, null, 4));
            await todo();
            break;
        case 5:
            const tfields = model.getFields(entity);
            let query = `select * from ${entity} `
            try {
                query += view.makeConditions(tfields);
                if (view.with_or_without() === 1) {
                    /*---------Without indexes-------------*/
                    await model.makeQuery(`drop index index1`).catch(err => { console.log(err) });
                    await model.makeQuery(`drop index index2`).catch(err => { console.log(err) });
                    let without = new Date().getTime();
                    const data_1 = await model.makeQuery(query).catch(err => { console.log(err) });
                    without = new Date().getTime() - without;
                    /*-----------------------------------*/
                    /*---------With indexes-----------*/
                    await model.makeQuery(`create index index1 on mark using btree(date);
            create index index2 on mark using btree(score);`).catch(err => { console.log(err) });
                    let withind = new Date().getTime();
                    const data_2 = await model.makeQuery(query).catch(err => { console.log(err) });
                    withind = new Date().getTime() - withind;
                    /*-----------------------------------*/
                    fs.writeFileSync('./analytics/public/info.json', JSON.stringify(data_2, null, 4));
                    let text = fs.readFileSync("./analytics/public/speed.txt", 'utf-8');
                    let arr = text.split('\n');
                    arr.pop();
                    let lastquery = parseInt(arr[arr.length - 1].split(' ')[0].split('_')[1]) + 1;
                    text += `\nquery_${lastquery} ${without} ${withind}`;
                    fs.writeFileSync("./analytics/public/speed.txt", text);
                    view.outputTable(data_2);
                    opn('http://localhost:3001/speed', { app: 'firefox' });
                } else {
                    const data_2 = await model.makeQuery(query).catch(err => { console.log(err) });
                    fs.writeFileSync('./analytics/public/info.json', JSON.stringify(data_2, null, 4));
                    view.outputTable(data_2);
                    opn('http://localhost:3001', { app: 'firefox' });
                }
            } catch (err) {
                view.error_output(err);
            }
            await todo();
            break;
        case 6:
            if (!['class', 'subject'].includes(entity)) {
                const count = view.generate_rnd_data();
                await make_data(entity, count).catch(err => { throw new Error(err) });
            } else {
                await make_data(entity).catch(err => { throw new Error(err) });
            }
            await todo();
            break;
        case 7:
            await start();
            break;
        case 13:
            await start();
            break;
        default:
            view.error_output('Вы выбрали несуществующий вариант. ')
            await makeOperationByNumber(operation, entity);
            break;
    }
}

function getModelByNmber(number) {
    switch (number) {
        case 1:
            return 'class';
        case 2:
            return 'pupil';
        case 3:
            return 'mark';
        case 4:
            return 'subject';
        case 5:
            return 'topic';
        default:
            view.error_output('Вы выбрали несуществующий вариант. ')
            start();
            break;
    }
}

async function deleteRelations(entity, _id) {
    let all_tables = ['class', 'pupil', 'mark', 'subject', 'topic']
    for (let i = 0; i < all_tables.length; i++) {
        if (all_tables[i] !== entity && model.getRelations(all_tables[i]).includes(entity)) {
            let def = entity + 'Id';
            let condition = {};
            condition[def] = _id;
            const ids = await model.select_with_condition(all_tables[i], condition).catch(err => { throw new Error(err) });
            for (let j = 0; j < ids.length; j++) {
                await deleteRelations(all_tables[i], ids[j].id).catch(err => { throw new Error(err) });
            }
        }
    }
    await _delete(entity, { id: _id }).catch(err => { throw new Error(err) });
}

async function make_data(entity, count) {
    switch (entity) {
        case 'class':
            const classes = await generate.generateClasses();
            //await model.makeQuery(query).catch(err => { throw new Error(err) });
            fs.writeFileSync("classes.csv", classes);
            await model.makeQuery(`copy class("grade", "letters") FROM '/home/flomaster/dbCoursework/classes.csv' WITH(FORMAT CSV, HEADER)`).catch(err => { throw new Error(err) });
            break;
        case 'pupil':
            const info = await generate.generatePupils(count);
            fs.writeFileSync("pupils.csv", info);
            await model.makeQuery(`copy pupil("name", "surname", "patronymic", "birth_date", "classId") FROM '/home/flomaster/dbCoursework/pupils.csv' WITH(FORMAT CSV, HEADER)`).catch(err => { throw new Error(err) });
            break;
        case 'mark':
            const marks = await generate.generateMarks(count);
            fs.writeFileSync("marks.csv", marks);
            await model.makeQuery(`copy mark("score", "date", "pupilId", "subjectId", "topicId") FROM '/home/flomaster/dbCoursework/marks.csv' WITH(FORMAT CSV, HEADER)`).catch(err => { throw new Error(err) });
            break;
        case 'subject':
            const text = await generate.generateSciences(count);
            fs.writeFileSync("science.csv", text);
            await model.makeQuery(`copy subject("name", "direction") FROM '/home/flomaster/dbCoursework/science.csv' WITH(FORMAT CSV, HEADER)`).catch(err => { throw new Error(err) });
            break;
        case 'topic':
            const topics = await generate.generateTopcs(count);
            fs.writeFileSync("topics.csv", topics);
            await model.makeQuery(`copy topic("name", "subjectId") FROM '/home/flomaster/dbCoursework/topics.csv' WITH(FORMAT CSV, HEADER)`).catch(err => { throw new Error(err) });
            break;
        default:
            break;
    }
}

async function filter(model) {

}