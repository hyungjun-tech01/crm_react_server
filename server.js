const express = require('express');
const app = express();
const pool = require('./db');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// multer 미들웨어 사용
const multer = require('multer');
const fsUpper = require('fs');
const path = require('path');

//const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises; // fs.promises를 사용하여 비동기 파일 작업을 수행합니다.
const util = require('util');
const fsSync = require('fs');
const { v4: uuid } = require('uuid');
const sharp = require('sharp');

try {
    fsUpper.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fsUpper.mkdirSync('uploads');
}    

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const PORT =  process.env.MYPORT ? process.env.MYPORT:8000;
const MYHOST  = process.env.MYHOST ? "http://"+process.env.MYHOST+":"+PORT:"http://localhost"+":"+PORT;

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded( {extended : false } ));
app.use('/uploads', express.static('uploads'));

// util.promisify를 사용하여 fs.writeFile을 프로미스로 변환합니다.
const writeFileAsync = util.promisify(fs.writeFile);
// promisify를 사용하여 fs.unlink를 비동기 함수로 변환
// const unlinkAsync = util.promisify(fs.unlink);
const unlinkSync = fs.unlink;

// 동적요청에 대한 응답을 보낼때 etag 를 생성하지 않도록
app.set('etag', false);

// 정적요청에 대한 응답을 보낼때 etag 생성을 하지 않도록
const options = { etag : false };

app.post('/upload', upload.single('file'),async (req, res) => {
    const cardId = req.body.cardId;
    const fileExt = req.body.fileExt;
    const fileData = req.file.buffer; // 이미지 데이터가 여기에 들어온다고 가정합니다.
    const fileName = req.body.fileName;
    const imageWidth = req.body.width ? req.body.width : null;
    const imageHeight = req.body.height ? req.body.height : null;
    const dirname = uuid();
    let dirName = path.join('uploads', dirname);

    // /카드 id 폴더가 없으면 생성  --> uuid를 사용하는 것으로 대체
    try {
        // fsUpper.readdirSync(`uploads/${dirname}`);
        fsUpper.mkdirSync(dirName);
    } catch (error) {
        // console.error('uploads/cardid  폴더가 없어 cardid 폴더를 생성합니다.');
        console.error('첨부 파일을 위한 폴더 생성에 실패하여 cardid 폴더로 생성합니다.');
        dirName = path.join('uploads', cardId + "_" + dirname);
        fsUpper.mkdirSync(dirName);
    }

    // 이미지를 저장할 경로 및 파일 이름
    
    const filePath = path.join(dirName, fileName);

    try {
        // 이미지 데이터를 바이너리로 변환하여 파일에 저장 (동기) -> 앞에 await를 붙히면 프로세스가 안 끝남.
        writeFileAsync(filePath, fileData, 'binary');
        console.log('파일 저장 성공:', filePath); 
        res.json({fileName:fileName, dirName:dirname});
    } catch (err) {
        console.error(err);
        res.status(500).send('파일 업로드 중 오류가 발생했습니다.');
    } finally{
        res.end();
        console.log('final:', filePath);

        if(imageWidth) {
            const thumbnailPath = path.join(dirName, 'thumbnail');
            try {
                fsUpper.mkdirSync(thumbnailPath);
            } catch (error) {
                console.log('fail to make folder for thumbnail :', error);
            };
            
            // thumbnail 생성
            const isPortrait = imageHeight > imageWidth;
            const image = sharp(filePath, {
                animated: true,
            });

            console.log('[Check] thumbnail path :', thumbnailPath);
            console.log('[Check] file ext :', fileExt)
            try {
                await image
                .resize(
                    256,
                    isPortrait ? 320 : undefined,
                    imageWidth < 256 || (isPortrait && imageHeight < 320)
                    ? {
                        kernel: sharp.kernel.nearest,
                        }
                    : undefined,
                )
                .toFile(path.join(thumbnailPath, `cover-256.${fileExt}`));
            } catch (error) {
                console.log(error);
            };
        };
    };
});

app.post('/deleteFile', async (req, res) => {
    const {fileExt, fileName, dirName} = req.body;
    // 이미지를 삭제할 경로 및 파일 이름
    const fileDir = path.join('uploads', dirName);
    const filePath = path.join(fileDir, fileName);
    try {
        // 파일이 존재하는지 확인
         const fileStats = await fs.stat(filePath);
    
        // 파일이 존재할 때만 삭제 수행
        if (fileStats.isFile()) {
            //  unlinkAsync(filePath);   // sync 밖에 안됨. 왜 안되는지 모르겠음 await넣으면 진행 안됨.
            fsUpper.unlinkSync(filePath);

            // thumbnail 확인 및 삭제
            const thumbnailDir = path.join(fileDir, 'thumbnail');
            console.log('Thumbnail Dir :', thumbnailDir);
            fsUpper.stat(thumbnailDir, (err, stats) => {
                if(err) console.error(err);
                else {
                    if(stats.isDirectory()) {
                        const thumbnailPath = path.join(thumbnailDir, `cover-256.${fileExt}`);
                        fsUpper.stat(thumbnailPath, (err0, stats0) => {
                            if(err0) console.error(err0);
                            else {
                                if(stats0.isFile()) {
                                    fsUpper.unlinkSync(thumbnailPath);
                                }
                                fsUpper.rmdirSync(thumbnailDir);
                                fsUpper.rmdirSync(fileDir);
                            };
                        });
                    };
                };
            });
            console.log('파일 삭제 성공:', filePath); 
            res.json({fileName:fileName, filePath:filePath});
        }else{
            console.error(err);
            console.log('파일 미존재 삭제 성공:', filePath); 
            res.json({fileName:fileName, filePath:filePath});
        }
    } catch (err) {
        console.error(err);
        console.log('파일 미존재 삭제 성공:', filePath); 
        res.json({fileName:fileName, filePath:filePath});
      //  res.status(500).send('파일 삭제 중 오류가 발생했습니다.');
    }finally{
        res.end();
        console.log('final:', filePath); 
    }
});

// home  test
app.get('/', (req, res)=>{
    res.send("Service is started");
});

////////////////// crm schema query, modify /////////////////////////
app.get('/companies', async(req, res) => {
    try{
        console.log("[Get] Companies");
        const allCompaniesResult = await pool.query(`
            select * from tbl_company_info`);

        if(allCompaniesResult.rows.length > 0) {
            const allCompanies = allCompaniesResult.rows;
            res.json(allCompanies);
            res.end();
        };
    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});

app.get('/leads', async(req, res) => {
    try{
        console.log("[Get] leads");
        const allLeadsResult = await pool.query(`
            select * from tbl_leads_info`);

        if(allLeadsResult.rows.length > 0) {
            const allLeads = allLeadsResult.rows;
            res.json(allLeads);
            res.end();
        };
    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});

/////////////////////////////////////////////////////////////////////

//login
app.post('/login', async(req, res) => {

    const {email, password} = req.body;
    try{
        const users = await pool.query(`
        SELECT t.user_id as "userId", 
        t.user_name as "userName", 
        t.password as "password",
		t.mobile_number as "mobileNumber",
        t.phone_number as "phoneNuber",
        t.department as "department", 
        t.position as "position", 
        t.email as "phone", 
        t.group_  as "group_",
        t.memo  as "memo"
        FROM tbl_user_info t WHERE t.user_id = $1`, [email]);
        if(!users.rows.length){ 
            console.log("fail");
            return res.json({message:"Invalid email or password"});
        }

        const success = await bcrypt.compare(password, users.rows[0].password);
        const token = jwt.sign({email}, 'secret', {expiresIn:'1hr'});
        if(success){
            res.json({userId : users.rows[0].userId,
                      userName : users.rows[0].userName, 
                      mobileNumber: users.rows[0].mobileNumber, 
                      email: users.rows[0].email, 
                      phoneNuber: users.rows[0].phoneNuber, 
                      department: users.rows[0].department,
                      position: users.rows[0].position, 
                      email: users.rows[0].email, 
                      group_: users.rows[0].group_, 
                      memo: users.rows[0].memo,
                      token: token,
                      message:"success"});
            console.log("success", token);
        }else{
            console.log("fail");
            res.json({message:"Invalid email or password"});
        }
        res.end();
    }catch(err){
        console.error(err);
        res.json({message:err});        
        res.end();
    }
});

//getuserinfo
app.post('/getuser', async(req, res) => {
    const {userId} = req.body;
    try{
        const users = await pool.query(`
        SELECT t.id as "userId", 
        t.username as "userName", 
        t.name as "name",
        t.email as "email", 
        t.is_admin as "isAdmin", 
        t.phone as "phone", 
        t.organization  as "organization",
        t.subscribe_to_own_cards  as "subscribeToOwnCards", 
        t.created_at as "createdAt",
        t.updated_at as "updatedAt",
        t.deleted_at as "deletedAt", 
        t.language as "language",
        t.password_changed_at as "passwordChangeAt",
        t.avatar as "avatar"
        FROM user_account t WHERE t.id = $1`, [userId]);
        if(!users.rows.length) 
            return res.json({detail:'User does not exist'});


        res.json(users.rows[0]); // 결과 리턴을 해 줌 .
        res.end();

    }catch(err){
        console.error(err);
        res.json({message:err});        
        res.end();
    }
});

//signup 계정 생성 
app.post('/signup', async(req, res) => {
    const {createrId , 
        userActionType , 
        userName , 
        name , 
        userId ,
        email ,
        isAdmin,
        password , 
        phone , 
        organization , 
        subscribeToOwnCards,
        language ,
        avatar ,
        detail ,
           } = req.body;    
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    try{
        const signUp = await pool.query(`call p_modify_user($1, $2, $3, $4, 
            $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 
            $19)` ,
        [createrId , 
            userActionType , 
            userName , 
            name , 
            userId ,
            email ,
            isAdmin,
            hashPassword , 
            phone , 
            organization , 
            subscribeToOwnCards,
            language ,
            avatar ,
            detail ,
            null,
            null,
            null,
            null,
            null
        ]);
        const outUserId = signUp.rows[0].x_user_id;
        const outCreatedAt = signUp.rows[0].x_created_at;

        res.json({outUserId:outUserId, userName:userName, outCreatedAt:outCreatedAt});
    }catch(err){
        console.error(err);
        if(err){
            res.json({message:err});
        }
    }
});

// password hash처리 임시 
app.get('/passHash', async(req, res) => {
    console.log('passHash');
    const salt = bcrypt.genSaltSync(10);
    //  const hashPassword = bcrypt.hashSync(password, salt);
      const hashPassword = bcrypt.hashSync('demo', salt);
    try{
        const users = await pool.query(`
        SELECT t.user_id as "userId", 
        t.user_name as "userName", 
        t.password as "password",
		t.mobile_number as "mobileNumber",
        t.phone_number as "phoneNuber",
        t.department as "department", 
        t.position as "position", 
        t.email as "phone", 
        t.group_  as "group_",
        t.memo  as "memo"
        FROM tbl_user_info t `, []);

        let user;
        if(users.rows.length > 0 ) {
            user = users.rows;
            for (const c of user) {
                const response = await pool.query(`
                    update tbl_user_info 
                    set password = $1 
                    where user_id = $2`,
                [hashPassword,c.userId]);
                console.log(c.userId, c.password);
            }
        }
    }catch{

    }

  //  const salt = bcrypt.genSaltSync(10);
  //  const hashPassword = bcrypt.hashSync(password, salt);
  //  const hashPassword = bcrypt.hashSync('demo', salt);
    console.log('passHash');
    res.json({message:'passHash'});
});

app.listen(PORT, ()=> {
    console.log(`Server running on PORT ${PORT}`);
});