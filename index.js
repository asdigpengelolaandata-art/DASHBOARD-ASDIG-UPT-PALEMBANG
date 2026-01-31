
const express=require('express');
const cors=require('cors');
const {Pool}=require('pg');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

const app=express();
app.use(cors());
app.use(express.json());

const pool=new Pool({connectionString:process.env.DATABASE_URL});
const SECRET='PLN_SECRET_KEY';

function auth(role){
 return (req,res,next)=>{
  const token=req.headers.authorization;
  if(!token) return res.sendStatus(401);
  try{
    const user=jwt.verify(token,SECRET);
    if(role && user.role!==role) return res.sendStatus(403);
    req.user=user;
    next();
  }catch(e){res.sendStatus(401);}
 };
}

// LOGIN
app.post('/login',async(req,res)=>{
 const {email,password}=req.body;
 const q=await pool.query('SELECT * FROM users WHERE email=$1',[email]);
 if(!q.rows.length) return res.sendStatus(401);
 const u=q.rows[0];
 if(!bcrypt.compareSync(password,u.password)) return res.sendStatus(401);
 const token=jwt.sign({id:u.id,role:u.role,upt:u.upt},SECRET);
 res.json({token,role:u.role,upt:u.upt});
});

// INPUT (UPT)
app.post('/gangguan',auth('UPT'),async(req,res)=>{
 const d=req.body;
 await pool.query(
 'INSERT INTO gangguan(upt,status,lat,lng) VALUES($1,$2,$3,$4)',
 [req.user.upt,d.status,d.lat,d.lng]
 );
 res.json({ok:true});
});

// VIEW ALL (PUSAT)
app.get('/gangguan',auth('PUSAT'),async(req,res)=>{
 const q=await pool.query('SELECT * FROM gangguan');
 res.json(q.rows);
});

app.listen(3000);
