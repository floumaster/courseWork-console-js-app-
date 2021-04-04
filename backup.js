const { exec } = require("child_process");
const readlineSync = require('readline-sync');
const view = require('./view');
const model = require('./model');
const fs = require('fs')
var cmd = require('node-cmd');

const operations = {
    make_db_backup(name) {
        cmd.runSync(`pg_dump --host "127.0.0.1" --port "5434" -U postgres "School" > ~/dbCoursework/backups/${name}.sql`);
        let databases = fs.readFileSync("./backups/databases.txt");
        databases += `\n${name} | ${Date()}`;
        fs.writeFileSync("./backups/databases.txt", databases);
    },
    make_table_backup(tablename) {
        let tables = fs.readFileSync("./backups/tables.txt");
        tables += `\n${tablename} | ${Date()}`;
        fs.writeFileSync("./backups/tables.txt", tables);
        cmd.runSync(`pg_dump --host "127.0.0.1" --port "5434" --file "/home/flomaster/dbCoursework/backups/${tablename}.sql" --username "postgres" --no-password --verbose --format=c --blobs --table "public.${tablename}" "School"`);
    },
    recovery_bd() {
        let arr = [];
        let available = [];
        let databases = fs.readFileSync("./backups/databases.txt", 'utf8');
        arr = databases.split('\n')
        let info = 'File name | date';
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].includes('|')) {
                arr[i] = arr[i].split(' | ');
                available.push(arr[i][0]);
                info += `\n${arr[i][0]} | ${arr[i][1]}`
            }
        }
        const answer = readlineSync.question(`Введите название файла резервной копии из списка: 
${info}: `);
        if (!available.includes(answer)) {
            throw new Error('Неверное название файла. ');
        }
        //cmd.runSync(`systemctl stop postgresql@12-slave.service`);
        cmd.runSync(`psql --host "127.0.0.1" --port "5434" -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'School' AND pid <> pg_backend_pid()"`);
        cmd.runSync(`dropdb --host "127.0.0.1" --port "5434" "School" && createdb --host "127.0.0.1" --port "5434" "School" && psql --host "127.0.0.1" --port "5434" -U postgres "School" < ~/dbCoursework/backups/${answer}.sql`);
        //cmd.runSync(`systemctl start postgresql@12-slave.service`);
    },
    async recovery_table() {
        let arr = [];
        let available = [];
        let databases = fs.readFileSync("./backups/tables.txt", 'utf8');
        arr = databases.split('\n')
        arr.pop();
        let info = 'File name | date';
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].includes('|')) {
                arr[i] = arr[i].split(' | ');
                available.push(arr[i][0]);
                info += `\n${arr[i][0]} | ${arr[i][1]}`
            }
        }
        const answer = readlineSync.question(`Введите название файла резервной копии из списка: 
${info}: `);
        if (!available.includes(answer)) {
            throw new Error('Неверное название файла. ');
        }
        await model.makeQuery(`TRUNCATE ${answer} CASCADE`);
        cmd.runSync(`pg_restore --host "127.0.0.1" --port "5434" --username "postgres" --no-password --dbname "School" --data-only --verbose --schema "public" --table "${answer}" "/home/flomaster/dbCoursework/backups/${answer}.sql"`);
    }
}


module.exports = operations;