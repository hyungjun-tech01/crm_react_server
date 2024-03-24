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
const { timeStamp } = require('console');


// uuid 로  pk 생성 
const pk_code = () => {
    const tokens = uuid().split('-')
    return (tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4]).toUpperCase();
}

//값이 없으면 null로 세팅
const defaultNull = (value) => value === undefined ? null : value;

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
            select * from tbl_lead_info`);

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


//create/update company 
app.post('/modifyCompany', async(req, res) => {
    const {
        action_type                = defaultNull(req.body.action_type) ,   
        company_code               = defaultNull(req.body.company_code) ,
        company_number             = defaultNull(req.body.company_number) , 
        group_                     = defaultNull(req.body.group_) ,
        company_scale              = defaultNull(req.body.company_scale) ,
        deal_type                  = defaultNull(req.body.deal_type) ,
        company_name               = defaultNull(req.body.company_name) ,
        company_name_eng           = defaultNull(req.body.company_name_eng) ,
        business_registration_code = defaultNull(req.body.business_registration_code) ,
        establishment_date         = defaultNull(req.body.establishment_date) ,
        closure_date               = defaultNull(req.body.closure_date) ,
        ceo_name                   = defaultNull(req.body.ceo_name) ,
        business_type              = defaultNull(req.body.business_type) ,
        business_item              = defaultNull(req.body.business_item) ,
        industry_type              = defaultNull(req.body.industry_type) ,
        company_zip_code           = defaultNull(req.body.company_zip_code) ,
        company_address            = defaultNull(req.body.company_address) ,
        company_phone_number       = defaultNull(req.body.company_phone_number) ,
        company_fax_number         = defaultNull(req.body.company_fax_number) ,
        homepage                   = defaultNull(req.body.homepage) ,
        memo                       = defaultNull(req.body.memo) ,
        modify_user                = defaultNull(req.body.modify_user) ,
        counter                    = defaultNull(req.body.counter) ,
        account_code               = defaultNull(req.body.account_code) ,
        bank_name                  = defaultNull(req.body.bank_name) ,
        account_owner              = defaultNull(req.body.account_owner) ,
        sales_resource             = defaultNull(req.body.sales_resource) ,
        application_engineer       = defaultNull(req.body.application_engineer) ,
        region                     = defaultNull(req.body.region)
    } = req.body;    
    try{

        const current_date = await pool.query(`select to_char(now(),'YYYY.MM.DD HH24:MI:SS') currdate`);
        const currentDate = current_date.rows[0];
        let v_company_code = company_code;

        if (action_type === 'ADD') {
            v_company_code  = pk_code();
            const response = await pool.query(`
            insert into tbl_company_info(
                company_code                   ,
                company_number                 ,
                group_                         ,
                company_scale                  ,
                deal_type                      ,
                company_name                   ,
                company_name_eng               ,
                business_registration_code     ,
                establishment_date             ,
                closure_date                   ,
                ceo_name                       ,
                business_type                  ,
                business_item                  ,
                industry_type                  ,
                company_zip_code               ,
                company_address                ,
                company_phone_number           ,
                company_fax_number             ,
                homepage                       ,
                memo                           ,
                create_user                    ,
                create_date                    ,
                modify_date                    ,
                recent_user                    ,
                counter                        ,
                account_code                   ,
                bank_name                      ,
                account_owner                  ,
                sales_resource                 ,
                application_engineer           ,
                region                         )
            values(
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 
                $18, $19, $20, $21, $22::timestamp, $23::timestamp, $24, $25::integer, $26, $27, $28, $29, $30, $31);
            `,[v_company_code,company_number,group_,company_scale,deal_type,company_name,company_name_eng,
               business_registration_code,establishment_date,closure_date,ceo_name,business_type,business_item,
               industry_type,company_zip_code,company_address,company_phone_number,company_fax_number,homepage,
               memo,modify_user,currentDate.currdate,currentDate.currdate,modify_user,counter,account_code,bank_name,account_owner,
               sales_resource,application_engineer,region
            ]);
        }
        if (action_type === 'UPDATE') {
            const response = await pool.query(`
            update tbl_company_info
              set company_number =  COALESCE($1 ,company_number) ,
                  group_ =  COALESCE($2, group_)  ,
                  company_scale =  COALESCE($3, company_scale)  ,
                  deal_type  =  COALESCE($4, deal_type) ,
                  company_name  =  COALESCE($5, company_name) ,
                  company_name_eng  =  COALESCE($6, company_name_eng) ,
                  business_registration_code  =  COALESCE($7, business_registration_code),
                  establishment_date =  COALESCE($8::date,establishment_date::date) ,
                  closure_date  =  COALESCE( $9::date, closure_date::date) ,
                  ceo_name  =  COALESCE( $10, ceo_name)  ,
                  business_type  =  COALESCE( $11, business_type) ,
                  business_item  =  COALESCE( $12, business_item) ,
                  industry_type  =  COALESCE( $13, industry_type) ,
                  company_zip_code  =  COALESCE( $14, company_zip_code) ,
                  company_address  =  COALESCE( $15, company_address) ,
                  company_phone_number =  COALESCE( $16, company_phone_number) ,
                  company_fax_number   =  COALESCE( $17, company_fax_number),
                  homepage             =  COALESCE( $18, homepage) ,
                  memo                 =  COALESCE( $19, memo) ,
                  modify_date          = $20::timestamp          ,
                  recent_user          = $21          ,
                  counter              = COALESCE($22::integer, counter),
                  account_code         =  COALESCE( $23, account_code)         ,
                  bank_name            =  COALESCE( $24, bank_name)         ,
                  account_owner        =  COALESCE( $25, account_owner)         ,
                  sales_resource       =  COALESCE( $26, sales_resource)        ,
                  application_engineer   =  COALESCE($27, application_engineer)        ,
                  region                 =  COALESCE( $28, region)       
             where company_code = $29;
            `,[company_number,group_,company_scale,deal_type,company_name,company_name_eng,
                business_registration_code,establishment_date,closure_date,ceo_name,business_type,business_item,
                industry_type,company_zip_code,company_address,company_phone_number,company_fax_number,homepage,
                memo,currentDate.currdate, modify_user,counter,account_code,bank_name,account_owner,
                sales_resource,application_engineer,region,v_company_code
            ]);
           // update 
        }  
        const out_company_code = v_company_code;
        const out_create_user = action_type === 'ADD' ? modify_user : "";
        const out_create_date = action_type === 'ADD' ? currentDate.currdate:"";
        const out_modify_date = currentDate.currdate;
        const out_recent_user = modify_user;
         
        res.json({ out_company_code: out_company_code,  out_create_user:out_create_user, 
            out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user }); // 결과 리턴을 해 줌 .  
        console.log({ out_company_code: out_company_code,  out_create_user:out_create_user, 
                out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user });
        res.end();  

    }catch(err){
        console.error(err);
        res.json({message:err});
        res.end();
    }
});

//create/update lead 
app.post('/modifyLead', async(req, res) => {
    const {
        action_type             = defaultNull(req.body.action_type)   ,   
        lead_code               = defaultNull(req.body.lead_code)  ,   
        company_code            = defaultNull(req.body.company_code)    ,                                                                 
        lead_index             = defaultNull(req.body.lead_index)    ,                                                
        company_index           = defaultNull(req.body.company_index)    ,
        lead_number             = defaultNull(req.body.lead_number)    ,
        group_                  = defaultNull(req.body.group_)    ,
        sales_resource          = defaultNull(req.body.sales_resource)    ,
        region                  = defaultNull(req.body.region)    ,
        company_name            = defaultNull(req.body.company_name)    ,
        company_zip_code        = defaultNull(req.body.company_zip_code)    ,
        company_address         = defaultNull(req.body.company_address)    ,
        company_phone_number    = defaultNull(req.body.company_phone_number)    ,
        company_fax_number      = defaultNull(req.body.company_fax_number)    ,
        lead_name              = defaultNull(req.body.lead_name)    ,
        is_keyman               = defaultNull(req.body.is_keyman)    ,
        department              = defaultNull(req.body.department)    ,
        position                = defaultNull(req.body.position)    ,
        mobile_number           = defaultNull(req.body.mobile_number)    ,
        company_name_en         = defaultNull(req.body.company_name_en)    ,
        email                   = defaultNull(req.body.email)    ,
        homepage                = defaultNull(req.body.homepage)    ,
        modify_user             = defaultNull(req.body.modify_user)    ,
        counter                 = defaultNull(req.body.counter)    ,
        application_engineer    = defaultNull(req.body.application_engineer)    ,
        status                  = defaultNull(req.body.status)    
                 } = req.body;
    try{
       
        const current_date = await pool.query(`select to_char(now(),'YYYY.MM.DD HH24:MI:SS') currdate`);
        const currentDate = current_date.rows[0];
        let v_lead_code = lead_code;

        if (action_type === 'ADD') {
            if (company_code === null || company_code === "") {
                throw new Error('company_code는 not null입니다.');
            }
            v_lead_code  = pk_code();
            const response = await pool.query(`
            insert into tbl_lead_info(
                lead_code               ,
                company_code            ,
                lead_index             ,
                company_index           ,
                lead_number             ,
                group_                  ,
                sales_resource          ,
                region                  ,
                company_name            ,
                company_zip_code        ,
                company_address         ,
                company_phone_number    ,
                company_fax_number      ,
                lead_name              ,
                is_keyman               ,
                department              ,
                position                ,
                mobile_number           ,
                company_name_en         ,
                email                   ,
                homepage                ,
                create_user             ,
                create_date             ,
                modify_date             ,
                recent_user             ,
                counter                 ,
                application_engineer    ,
                status                    )
             values(
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,
                $23,$24,$25,$26,$27,$28 );
            `,[ v_lead_code,
                company_code            ,
                lead_index             ,
                company_index           ,
                lead_number             ,
                group_                  ,
                sales_resource          ,
                region                  ,
                company_name            ,
                company_zip_code        ,
                company_address         ,
                company_phone_number    ,
                company_fax_number      ,
                lead_name              ,
                is_keyman               ,
                department              ,
                position                ,
                mobile_number           ,
                company_name_en         ,
                email                   ,
                homepage                ,
                modify_user             ,
                currentDate.currdate     ,
                currentDate.currdate    ,
                modify_user             ,
                counter                 ,
                application_engineer    ,
                status                   ]);
        }
        if (action_type === 'UPDATE') {
            const response = await pool.query(`
            update tbl_lead_info 
               set company_code   =  COALESCE($1,company_code)         ,
                   lead_index   =  COALESCE($2,lead_index)         ,
                   company_index   =  COALESCE($3,company_index)         ,
                   lead_number          = COALESCE($4, lead_number)   ,
                   group_               = COALESCE($5 , group_)   ,
                   sales_resource       = COALESCE($6, sales_resource)   ,
                   region               = COALESCE($7, region)   ,
                   company_name         = COALESCE($8, company_name)   ,
                   company_zip_code     = COALESCE($9, company_zip_code)   ,
                   company_address      = COALESCE($10, company_address)   ,
                   company_phone_number = COALESCE($11, company_phone_number)   ,
                   company_fax_number   = COALESCE($12, company_fax_number)   ,
                   lead_name           = COALESCE($13, lead_name)   ,
                   is_keyman            = COALESCE($14, is_keyman)   ,
                   department           = COALESCE($15, department)   ,
                   position             = COALESCE($16, position)   ,
                   mobile_number        = COALESCE($17, mobile_number)   ,
                   company_name_en      = COALESCE($18, company_name_en)   ,
                   email                = COALESCE($19, email)   ,
                   homepage             = COALESCE($20, homepage)   ,
                   modify_date          = $21::timestamp   ,
                   recent_user          = $22   ,
                   counter  = COALESCE($23::integer, counter)   ,
                   application_engineer = COALESCE($24, application_engineer)   ,
                   status               = COALESCE($25, status)    
               where lead_code = $26;
            `,[company_code            ,
                lead_index             ,
                company_index           ,
                lead_number             ,
                group_                  ,
                sales_resource          ,
                region                  ,
                company_name            ,
                company_zip_code        ,
                company_address         ,
                company_phone_number    ,
                company_fax_number      ,
                lead_name              ,
                is_keyman               ,
                department              ,
                position                ,
                mobile_number           ,
                company_name_en         ,
                email                   ,
                homepage                ,
                currentDate.currdate     ,
                modify_user             ,
                counter,
                application_engineer,
                status,
                v_lead_code
            ]);
        }      


     const out_lead_code = v_lead_code;
     const out_create_user = action_type === 'ADD' ? modify_user : "";
     const out_create_date = action_type === 'ADD' ? currentDate.currdate : "";
     const out_modify_date = currentDate.currdate;
     const out_recent_user = modify_user;
     
    res.json({ out_lead_code: out_lead_code,  out_create_user:out_create_user, 
        out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user }); // 결과 리턴을 해 줌 .  

    console.log({ out_lead_code: out_lead_code,  out_create_user:out_create_user, 
            out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user });

        res.end();
    }catch(err){
        console.error(err);
        res.json({message:err});
        res.end();
    }
});

// create/update consult 
app.post('/modifyConsult', async(req, res) => {
    const {
        action_type             = defaultNull(req.body.action_type),   
        consulting_code         = defaultNull(req.body.consulting_code), 
        lead_code               = defaultNull(req.body.lead_code), 
        receipt_date            = defaultNull(req.body.receipt_date), 
        receipt_time            = defaultNull(req.body.receipt_time), 
        consulting_type         = defaultNull(req.body.consulting_type), 
        receiver                = defaultNull(req.body.receiver), 
        sales_representative    = defaultNull(req.body.sales_representative), 
        company_name            = defaultNull(req.body.company_name), 
        company_code            = defaultNull(req.body.company_code), 
        lead_name               = defaultNull(req.body.lead_name), 
        department              = defaultNull(req.body.department), 
        position                = defaultNull(req.body.position), 
        phone_number            = defaultNull(req.body.phone_number), 
        mobile_number           = defaultNull(req.body.mobile_number), 
        email                   = defaultNull(req.body.email), 
        request_content         = defaultNull(req.body.request_content), 
        status                  = defaultNull(req.body.status), 
        lead_time               = defaultNull(req.body.lead_time), 
        action_content          = defaultNull(req.body.action_content), 
        request_type            = defaultNull(req.body.request_type), 
        modify_user             = defaultNull(req.body.modify_user),            
        product_type            = defaultNull(req.body.product_type)
        } = req.body;

    try{

        const current_date = await pool.query(`select to_char(now(),'YYYY.MM.DD HH24:MI:SS') currdate`);
        const currentDate = current_date.rows[0];
        let v_consulting_code = consulting_code;

        if (action_type === 'ADD') {
            if (company_code === null || company_code === "") {
                throw new Error('company_code는 not null입니다.');
            }
            if (lead_code === null || lead_code === "") {
                throw new Error('lead_code는 not null입니다.');
            }
            v_consulting_code  = pk_code();
            const response = await pool.query(`
            insert into tbl_consulting_info(
                consulting_code         , 
                lead_code               , 
                receipt_date            , 
                receipt_time            , 
                consulting_type         , 
                receiver                , 
                sales_representative    , 
                company_name            , 
                company_code            , 
                lead_name               , 
                department              , 
                position                , 
                phone_number            , 
                mobile_number           , 
                email                   , 
                request_content         , 
                status                  , 
                lead_time               , 
                action_content          , 
                request_type            , 
                create_date             ,
                creater                 ,
                recent_user             ,
                modify_date             ,
                product_type            
            )
             values(
                $1,$2,$3::date,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21::timestamp,$22,
                $23,$24::timestamp,$25);
            `,[ v_consulting_code,
                lead_code               , 
                receipt_date            , 
                receipt_time            , 
                consulting_type         , 
                receiver                , 
                sales_representative    , 
                company_name            , 
                company_code            , 
                lead_name               , 
                department              , 
                position                , 
                phone_number            , 
                mobile_number           , 
                email                   , 
                request_content         , 
                status                  , 
                lead_time               , 
                action_content          , 
                request_type            , 
                currentDate.currdate     ,
                modify_user             ,
                modify_user             ,
                currentDate.currdate     ,
                product_type
            ]);
        }

        if (action_type === 'UPDATE') {
            const response = await pool.query(`
            update tbl_consulting_info 
               set lead_code               = COALESCE($1, lead_code), 
                   receipt_date            = COALESCE($2::date, receipt_date), 
                   receipt_time            = COALESCE($3, receipt_time), 
                   consulting_type         = COALESCE($4, consulting_type), 
                   receiver                = COALESCE($5, receiver), 
                   sales_representative    = COALESCE($6, sales_representative), 
                   company_name            = COALESCE($7, company_name), 
                   company_code            = COALESCE($8, company_code), 
                   lead_name               = COALESCE($9, lead_name), 
                   department              = COALESCE($10, department), 
                   position                = COALESCE($11, position), 
                   phone_number            = COALESCE($12, phone_number), 
                   mobile_number           = COALESCE($13, mobile_number), 
                   email                   = COALESCE($14, email), 
                   request_content         = COALESCE($15, request_content), 
                   status                  = COALESCE($16, status), 
                   lead_time               = COALESCE($17, lead_time), 
                   action_content          = COALESCE($18, action_content), 
                   request_type            = COALESCE($19, request_type), 
                   recent_user             = COALESCE($20, recent_user),
                   modify_date             = COALESCE($21::timestamp, modify_date),
                   product_type            = COALESCE($22, product_type)
                where consulting_code = $23;
            `,[lead_code               , 
                receipt_date            , 
                receipt_time            , 
                consulting_type         , 
                receiver                , 
                sales_representative    , 
                company_name            , 
                company_code            , 
                lead_name               , 
                department              , 
                position                , 
                phone_number            , 
                mobile_number           , 
                email                   , 
                request_content         , 
                status                  , 
                lead_time               , 
                action_content          , 
                request_type            , 
                modify_user             ,
                currentDate.currdate     ,
                product_type            ,
                v_consulting_code
            ]);
        }      

        const out_consulting_code = v_consulting_code;
        const out_create_user = action_type === 'ADD' ? modify_user : "";
        const out_create_date = action_type === 'ADD' ? currentDate.currdate : "";
        const out_modify_date = currentDate.currdate;
        const out_recent_user = modify_user;
        
       res.json({ out_consulting_code: out_consulting_code,  out_create_user:out_create_user, 
           out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user }); // 결과 리턴을 해 줌 .  
   
       console.log({ out_consulting_code: out_consulting_code,  out_create_user:out_create_user, 
               out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user });
   
        res.end();
    }catch(err){
        console.error(err);
        res.json({message:err});
        res.end();
    }

});    

// create/update purchase info 
app.post('/modifyPurchase', async(req, res) => {
    const  {
        action_type          = defaultNull(req.body.action_type),   
        purchase_code       = defaultNull(req.body.purchase_code), 
        company_code        = defaultNull(req.body.company_code),
        product_code        = defaultNull(req.body.product_code),
        product_type        = defaultNull(req.body.product_type),
        product_name        = defaultNull(req.body.product_name),
        serial_number       = defaultNull(req.body.serial_number),
        delivery_date       = defaultNull(req.body.delivery_date),
        MA_finish_date      = defaultNull(req.body.MA_finish_date),
        price               = defaultNull(req.body.price),
        modify_user         = defaultNull(req.body.modify_user),   
        purchase_memo       = defaultNull(req.body.purchase_memo),
        status              = defaultNull(req.body.status),
        quantity            = defaultNull(req.body.quantity),
        regcode             = defaultNull(req.body.regcode),
        MA_contact_date     = defaultNull(req.body.MA_contact_date),
        currency            = defaultNull(req.body.currency)
    } = req.body;
    try{

        const current_date = await pool.query(`select to_char(now(),'YYYY.MM.DD HH24:MI:SS') currdate`);
        const currentDate = current_date.rows[0];
        let v_purchase_code = purchase_code;

        if (action_type === 'ADD') {
            if (company_code === null || company_code === "") {
                throw new Error('company_code는 not null입니다.');
            }
            if (product_code === null || product_code === "") {
                throw new Error('product_code는 not null입니다.');
            }
            v_purchase_code  = pk_code();
            const response = await pool.query(`
                insert into tbl_purchase_info(
                    purchase_code       , 
                    company_code        ,
                    product_code        ,
                    product_type        ,
                    product_name        ,
                    serial_number       ,
                    delivery_date        ,
                    MA_finish_date       ,
                    price                ,
                    register            ,
                    registration_date    ,
                    recent_user         ,
                    modify_date         ,
                    purchase_memo       ,
                    status              ,
                    quantity             ,
                    regcode             ,
                    MA_contact_date      ,
                    currency            )  
                    values(
                    $1,$2,$3,$4,$5,$6,$7::date,$8::date,$9::numeric,$10,$11::timestamp,$12,$13::timestamp,
                    $14,$15,$16::integer,$17,$18::date,$19) 
            `,[
                v_purchase_code       , 
                company_code        ,
                product_code        ,
                product_type        ,
                product_name        ,
                serial_number       ,
                delivery_date       ,
                MA_finish_date      ,
                price               ,
                modify_user         ,
                currentDate.currdate ,
                modify_user         ,
                currentDate.currdate ,
                purchase_memo       ,
                status              ,
                quantity            ,
                regcode             ,
                MA_contact_date     ,
                currency           
            ]);     
        }
        if (action_type === 'UPDATE') {
            const response = await pool.query(`
               update tbl_purchase_info 
               set company_code      = COALESCE($1, company_code)  ,
                   product_code      = COALESCE($2, product_code)  ,
                   product_type      = COALESCE($3, product_type)  ,
                   product_name      = COALESCE($4, product_name)  ,
                   serial_number     = COALESCE($5, serial_number)  ,
                   delivery_date     = COALESCE($6::date, delivery_date)   ,
                   MA_finish_date    = COALESCE($7::date, MA_finish_date)   ,
                   price             = COALESCE($8::numeric, price)   ,
                   recent_user       = COALESCE($9, recent_user )  ,
                   modify_date       = COALESCE($10::timestamp, modify_date)  ,
                   purchase_memo     = COALESCE($11,purchase_memo )  ,
                   status            = COALESCE($12, status)  ,
                   quantity          = COALESCE($13::integer, quantity)   ,
                   regcode           = COALESCE($14, regcode)  ,
                   MA_contact_date   = COALESCE($15::date, MA_contact_date)   ,
                   currency          = COALESCE($16, currency)  
               where purchase_code = $17
            `,[company_code,
                product_code        ,
                product_type        ,
                product_name        ,
                serial_number       ,
                delivery_date       ,
                MA_finish_date      ,
                price               ,
                modify_user         ,
                currentDate.currdate ,
                purchase_memo       ,
                status              ,
                quantity            ,
                regcode             ,
                MA_contact_date     ,
                currency            ,
                v_purchase_code
            ]);
        }
        const out_purchse_code = v_purchase_code;
        const out_create_user = action_type === 'ADD' ? modify_user : "";
        const out_create_date = action_type === 'ADD' ? currentDate.currdate : "";
        const out_modify_date = currentDate.currdate;
        const out_recent_user = modify_user;
        
        res.json({ out_purchse_code: out_purchse_code,  out_create_user:out_create_user, 
           out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user }); // 결과 리턴을 해 줌 .  
   
        console.log({ out_purchse_code: out_purchse_code,  out_create_user:out_create_user, 
               out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user });
   
        res.end();
    }catch(err){
        console.error(err);
        res.json({message:err});
        res.end();        
    }
});

// create/update transaction info 
app.post('/modifyTransaction', async(req, res) => {
    const  { 
        action_type                = defaultNull(req.body.action_type),
        transaction_code           = defaultNull(req.body.transaction_code),
        lead_code                  = defaultNull(req.body.lead_code),
        publish_type               = defaultNull(req.body.publish_type),
        transaction_type           = defaultNull(req.body.transaction_type),
        business_registration_code = defaultNull(req.body.business_registration_code),
        company_name               = defaultNull(req.body.company_name),
        ceo_name                   = defaultNull(req.body.ceo_name),
        company_address            = defaultNull(req.body.company_address),
        business_type              = defaultNull(req.body.business_type),
        business_item              = defaultNull(req.body.business_item),
        publish_date               = defaultNull(req.body.publish_date),
        transaction_title          = defaultNull(req.body.transaction_title),
        supply_price               = defaultNull(req.body.supply_price),
        tax_price                  = defaultNull(req.body.tax_price),
        total_price                = defaultNull(req.body.total_price),
        payment_type               = defaultNull(req.body.payment_type),
        modify_user                = defaultNull(req.body.modify_user),
        transaction_contents       = defaultNull(req.body.transaction_contents),
        currency                   = defaultNull(req.body.currency)
    } = req.body;
    try{

        const current_date = await pool.query(`select to_char(now(),'YYYY.MM.DD HH24:MI:SS') currdate`);
        const currentDate = current_date.rows[0];
        let v_transaction_code = transaction_code;

        if (action_type === 'ADD') {
            if (lead_code === null || lead_code === "") {
                throw new Error('lead_code not null입니다.');
            }
            if (publish_date === null || publish_date === "") {
                throw new Error('publish_date는 not null입니다.');
            }
            v_transaction_code  = pk_code();
            const response = await pool.query(`
                insert into tbl_transaction_info(
                    transaction_code          ,
                    lead_code                 ,
                    publish_type              ,
                    transaction_type          ,
                    business_registration_code,
                    company_name              ,
                    ceo_name                  ,
                    company_address           ,
                    business_type             ,
                    business_item             ,
                    publish_date              ,
                    transaction_title         ,
                    supply_price              ,
                    tax_price                 ,
                    total_price               ,
                    payment_type              ,
                    creater                   ,
                    modify_date               ,
                    recent_user               ,
                    transaction_contents      ,
                    currency                          
                ) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::date,$12,$13::numeric,
                    $14::numeric,$15::numeric,$16,$17,$18::timestamp,$19, $20, $21)
            `,[
                v_transaction_code,
                lead_code                   ,                
                publish_type                ,
                transaction_type            ,
                business_registration_code  ,
                company_name                ,
                ceo_name                    ,
                company_address             ,
                business_type             ,
                business_item             ,
                publish_date              ,
                transaction_title         ,
                supply_price              ,
                tax_price                 ,
                total_price               ,
                payment_type              ,
                modify_user               ,
                currentDate.currdate         ,
                modify_user               ,
                transaction_contents      ,
                currency                  
            ]);

        }
        const out_transaction_code = v_transaction_code;
        const out_create_user = action_type === 'ADD' ? modify_user : "";
        const out_create_date = action_type === 'ADD' ? currentDate.currdate : "";
        const out_modify_date = currentDate.currdate;
        const out_recent_user = modify_user;
        
        res.json({ out_transaction_code: out_transaction_code,  out_create_user:out_create_user, 
           out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user }); // 결과 리턴을 해 줌 .  
   
        console.log({ out_transaction_code: out_transaction_code,  out_create_user:out_create_user, 
               out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user });

    }catch(err){
        console.error(err);
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
        t.phone_number as "phoneNumber",
        t.department as "department", 
        t.position as "position", 
        t.email as "email", 
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
                      phoneNumber: users.rows[0].phoneNumber, 
                      department: users.rows[0].department,
                      position: users.rows[0].position, 
                      email: users.rows[0].email, 
                      group_: users.rows[0].group_, 
                      memo: users.rows[0].memo,
                      token: token,
                      message:"success"});
            console.log("success", users.rows[0]);
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
        SELECT t.user_id as "userId", 
        t.user_name as "userName", 
		t.mobile_number as "mobileNumber",
        t.phone_number as "phoneNumber",
        t.department as "department", 
        t.position as "position", 
        t.email as "email", 
        t.group_  as "group_",
        t.memo  as "memo"
        FROM tbl_user_info t WHERE t.user_id = $1`, [userId]);
        if(!users.rows.length) 
            return res.json({message:'User does not exist'});

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