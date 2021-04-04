const { Sequelize } = require('sequelize');
var cmd = require('node-cmd');
let current_server = 'master';

async function check() {
    console.log('Подключаемся к главному серверу...');
    sequelize = new Sequelize(
        'School',
        'postgres',
        '66lularo', {
            host: "127.0.0.1",
            port: 5432,
            dialect: 'postgres',
            timestamps: false,
        },
    )
    await sequelize
        .authenticate()
        .then(() => {
            console.log('Подключение установлено успешно.');
            /*if (current_server !== 'master') {
                cmd.runSync('systemctl stop postgresql@12-main.service && sudo -u postgres chmod 777 /var/lib/postgresql/12/main && sudo rm -rf /var/lib/postgresql/12/main/* && sudo -u postgres pg_basebackup -h 127.0.0.1 -p 5434 -U flomaster -D /var/lib/postgresql/12/main/ -Fp -Xs -R && sudo rm -rf /var/lib/postgresql/12/main/standby.signal && sudo -u postgres chmod 700 /var/lib/postgresql/12/main && systemctl start postgresql@12-main.service');
            }*/
            //current_server = 'master';
            sequelize = new Sequelize(
                'School',
                'postgres',
                '66lularo', {
                    host: "127.0.0.1",
                    port: 5432,
                    dialect: 'postgres',
                    timestamps: false,
                },
            )

        })
        .catch(async err => {
            console.log('Невозможно подключиться к главному серверу');
            console.log('Подключаемся к ведомому серверу...');
            sequelize = new Sequelize(
                'School',
                'postgres',
                '66lularo', {
                    host: "127.0.0.1",
                    port: 5434,
                    dialect: 'postgres',
                    timestamps: false,
                },
            )
            await sequelize
                .authenticate()
                .then(() => {
                    console.log('Подключение установлено успешно.');
                    if (current_server !== 'slave') {
                        cmd.runSync('systemctl stop postgresql@12-slave.service && sudo rm -rf /var/lib/postgresql/12/slave/standby.signal && systemctl start postgresql@12-slave.service');
                    }
                    /*if (current_server === 'master') {
                        console.log('Нaстраиваем master-slave взаимодействие.');
                        cmd.runSync('systemctl stop postgresql@12-main.service && sudo -u postgres chmod 777 /var/lib/postgresql/12/main && sudo rm -rf /var/lib/postgresql/12/main/* && sudo -u postgres pg_basebackup -h 127.0.0.1 -p 5434 -U flomaster -D /var/lib/postgresql/12/main/ -Fp -Xs -R && sudo -u postgres chmod 700 /var/lib/postgresql/12/main');
                    }*/
                    current_server = 'slave';
                    sequelize = new Sequelize(
                        'School',
                        'postgres',
                        '66lularo', {
                            host: "127.0.0.1",
                            port: 5434,
                            dialect: 'postgres',
                            timestamps: false,
                        },
                    )
                })
        }).finally(() => {
            Class.init({
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    unique: true,
                    comment: "id of the class",
                },
                grade: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: false,
                    autoIncrement: false,
                    unique: false,
                    comment: "grade of the class",
                },
                letters: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                    primaryKey: false,
                    autoIncrement: false,
                    unique: false,
                    comment: "letters of the class",
                },
            }, { sequelize, modelName: 'class', tableName: 'class', timestamps: false })

            Pupil.init({
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    unique: true,
                    comment: "Pupil's id, int",
                },
                name: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                    primaryKey: false,
                    autoIncrement: false,
                    unique: false,
                    comment: "Pupil's name, string",
                },
                surname: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                    primaryKey: false,
                    autoIncrement: false,
                    unique: false,
                    comment: "Pupil's surname, string",
                },
                patronymic: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                    primaryKey: false,
                    autoIncrement: false,
                    unique: false,
                    comment: "Pupil's patronymic, string",
                },
                birth_date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    primaryKey: false,
                    autoIncrement: false,
                    unique: false,
                    comment: "Pupil's bitrh date, date iso 8601",
                },
            }, { sequelize, modelName: 'pupil', tableName: 'pupil', timestamps: false })

            Mark.init({
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    unique: true,
                    comment: "id of the mark",
                },
                score: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: false,
                    autoIncrement: false,
                    unique: false,
                    comment: "score of the mark",
                },
                date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    primaryKey: false,
                    autoIncrement: false,
                    unique: false,
                    comment: "date of the mark",
                },
            }, { sequelize, modelName: 'mark', tableName: 'mark', timestamps: false })

            Subject.init({
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    unique: true,
                    comment: "Id of the subject, int",
                },
                name: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                    primaryKey: false,
                    autoIncrement: false,
                    unique: false,
                    comment: "name of the subject, string",
                },
                direction: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                    primaryKey: false,
                    autoIncrement: false,
                    unique: false,
                    comment: "direction of the subject, string",
                }
            }, { sequelize, modelName: 'subject', tableName: 'subject', timestamps: false })

            Topic.init({
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    unique: true,
                    comment: "Id of the topic, int",
                },
                name: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                    primaryKey: false,
                    autoIncrement: false,
                    unique: false,
                    comment: "name of the topic, string",
                }
            }, { sequelize, modelName: 'topic', tableName: 'topic', timestamps: false })

            Pupil.hasMany(Mark);
            Class.hasMany(Pupil);
            Subject.hasMany(Topic);
            Subject.hasMany(Mark);
            Topic.hasMany(Mark);
        })
}

class Class extends Sequelize.Model {};
class Pupil extends Sequelize.Model {};
class Mark extends Sequelize.Model {};
class Subject extends Sequelize.Model {};
class Topic extends Sequelize.Model {};


const operations = {
    async insert(model, data) {
        await models[model].create(data).catch(err => console.log(err));
        const id = await sequelize.query(`SELECT MAX(id) FROM ${model}`, { raw: true, type: Sequelize.QueryTypes.SELECT, }).catch(err => { throw new Error(err); })
        return id[0].max;
    },
    async update(model, data, condition) {
        await models[model].update(data, { where: condition }).catch(err => { throw new Error(err) });
    },
    async delete(model, condition) {
        await models[model].destroy({ where: condition }).catch(err => { throw new Error(err) });
    },
    async select(model) {
        let data;
        await models[model].findAll({ raw: true }).then(entities => {
            data = entities
        }).catch(err => { throw new Error(err) });
        return data;
    },
    async select_with_condition(model, condition) {
        let data;
        await models[model].findAll({
            where: {
                condition
            }
        }).then(entities => {
            data = entities
        }).catch(err => { throw new Error(err) });
        return data;
    },
    async get_last_id(model, field) {
        const id = await sequelize.query(`select ${field} from ${model} where id = (select max(id) from ${model}) `, { raw: true, type: Sequelize.QueryTypes.SELECT, }).catch(err => { throw new Error(err); })
        return id[0][field];
    },
    async get_first_id(model, field) {
        const id = await sequelize.query(`select ${field} from ${model} where id = (select min(id) from ${model}) `, { raw: true, type: Sequelize.QueryTypes.SELECT, }).catch(err => { throw new Error(err); })
        return id[0][field];
    },
    getRelations(model) {
        let relations_arr = [];
        for (let key in models[model].rawAttributes) {
            if (key.includes('Id')) {
                relations_arr.push(key.substring(0, key.indexOf('Id')));
            }
        }
        return relations_arr;
    },
    async makeCopy() {
        await sequelize.query(`pg_dump "School" > /home/flomaster/dbCoursework/school.dump`, { raw: true, type: Sequelize.QueryTypes.SELECT, }).catch(err => { throw new Error(err); });
    },
    getFields(model) {
        let fields_arr = [];
        for (let key in models[model].rawAttributes) {
            if (!key.includes('Id')) {
                fields_arr.push([key, models[model].rawAttributes[key].type.key.toLowerCase()])
            }
        }
        return fields_arr;
    },
    async makeQuery(query) {
        let data;
        await sequelize.query(query, { raw: true, type: Sequelize.QueryTypes.SELECT, }).catch(err => {
            throw new Error(err);
        }).then(entity => { data = entity });
        return data;
    },
    async check_connection() {
        await check();
    }
}


const models = {
    'class': Class,
    'pupil': Pupil,
    'mark': Mark,
    'subject': Subject,
    'topic': Topic
}

module.exports = operations;