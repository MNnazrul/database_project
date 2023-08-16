// handling database requests.

const pool = require("../config/dbconnection");

const find_user_by_email_from_users = (body, callBack) => {
    // finding particular users.
    pool.query(
        `select user_name, password from users where email = ? and role = ?`,
        [body.email, body.role],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results[0]);
        }
    );
};

const requested_users = (callBack) => {
    pool.query(
        `select * from registration 
        where user_id not in(select user_id from users);`,
        [],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results);
        }
    );
};

const find_user_by_email_or_username_from_registration = (body, callBack) => {
    pool.query(
        `select user_name from registration where email = ? or user_name = ?`,
        [body.email, body.user_name],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results[0]);
        }
    );
};

const insert_into_registration = (body, callBack) => {
    pool.query(
        `insert into registration (user_name, full_name, email, address, phone_number, shop_category, role, password) values(?,?,?,?,?,?,?,?)`,
        [
            body.user_name,
            body.full_name,
            body.email,
            body.address,
            body.phone,
            body.shop_category,
            body.category,
            body.password,
        ],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results);
        }
    );
};

const delete_from_registration = (body, callBack) => {
    pool.query(
        `delete from registration where email = ?`,
        [body.email],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results);
        }
    );
};

const insert_into_admin = (body, callBack) => {
    pool.query(
        `insert into admin (user_name, email, password) values(?, ?, ?)`,
        [body.user_name, body.email, body.password],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results);
        }
    );
};

const insert_into_users = (body, callBack) => {
    pool.query(
        `insert into users (user_name, email, role, password) values(?, ?, ?, ?)`,
        [body.user_name, body.email, body.role, body.password],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results);
        }
    );
};

const product_info = (callBack) => {
    pool.query(`select * from products`, [], (error, results, fields) => {
        if (error) return callBack(error);
        return callBack(null, results);
    });
};

// full_name: 'john doe',
//   user_name: 'john.doe',
//   email: 'admin@gmail.com',
//   phone: '01738430336',
//   address: 'Sylhet',
//   category: 'admin',
//   shop_category: 'Super Shop',
//   password: '1111',
//   confirm_password: '1111'

const find_user_by_email_from_admin = (body, callBack) => {
    // finding particular users.
    pool.query(
        `select user_name, password from admin where email = ?`,
        [body.email],
        (error, results, fields) => {
            if (error) return callBack(error);
            return callBack(null, results[0]);
        }
    );
};

const all = {
    find_user_by_email_from_users,
    find_user_by_email_from_admin,
    find_user_by_email_or_username_from_registration,
    insert_into_admin,
    insert_into_registration,
    insert_into_users,
    requested_users,
    delete_from_registration,
    product_info,
};

module.exports = all;
