import { DbUser } from "../interfaces/auth.types";
import bcrypt from "bcrypt";
import dotenv from  "dotenv";
import {pool} from "../config/db"

dotenv.config();

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const email = process.env.EMAIL;


 const createAdmin = async():Promise<DbUser | undefined> => {

    if (!username || !password || !email) {
        console.error(" Lipsesc variabilele USERNAME, PASSWORD, sau EMAIL din .env");
        return;
    }

    try{
        const hashedPassword = await bcrypt.hash(String(password), 10);

        const existingAdmin = await pool.query<DbUser>("SELECT * FROM users WHERE is_admin = true")

        if(existingAdmin.rowCount === 0){

            console.log("⏳ Adminul nu a fost găsit. Se creează...");

            const newAdmin = await pool.query("INSERT INTO users (username , email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING *",[username,email,hashedPassword, true])

            console.log(" Admin creat cu succes!");
            return newAdmin.rows[0];
        }else{
            console.log("Adminul există deja. Nu se face nimic.");
            return existingAdmin.rows[0];
        }
    }catch(err){
        console.error(" A apărut o eroare:", err);
    }
}

console.log("Rulare script creare admin...");

createAdmin()
    .then(admin => {
        if (admin) {
            console.log(`Script terminat. Adminul este: ${admin.email}`);
        }
    })
    .catch(err => {
        console.error("Eroare fatală în script:", err);
    })
    .finally(async () => {
        // 4. FOARTE IMPORTANT: Închide conexiunea la DB
        //    Altfel scriptul nu se va termina (va "atârna").
        await pool.end();
        console.log("Conexiune la DB închisă.");
    });