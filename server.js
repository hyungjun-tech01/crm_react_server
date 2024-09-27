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

// nodemailer 를 사용하여 mail Test
//const nodemailer = require('nodemailer'); // 이메일 전송을 위한 nodemailer 모듈 불러오기

// uuid 로  pk 생성 
const pk_code = () => {
    const tokens = uuid().split('-')
    return (tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4]).toUpperCase();
}

//값이 없으면 null로 세팅
const defaultNull = (value) => value === undefined ? null : value;

const defaultIntegerNull = (value) => 
{
    console.log('defaultIntegerNull', value);
    if(value === undefined || value === "" || value === null) 
        return  0; 
    else
        return value;
}

// formating date string 
const formatDate = (date_value) => {
    if(date_value === undefined || date_value === null) return "";
    
    let  converted = null;
    if(typeof date_value === 'string') {
        converted = new Date(date_value);
    } else {
        converted = date_value;
    }
    const month = converted.getMonth() + 1;
    const date = converted.getDate();
    return converted.getFullYear()
          + "." + (month < 10 ? "0" + month.toString() : month.toString())
          + "." + (date < 10 ? "0" + date.toString() : date.toString());
};

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

// req body 전송 한계 용량을 늘려
//app.use(express.json({ limit: '25mb' })); // JSON 데이터에 대해 50MB로 제한
//app.use(express.urlencoded({ limit: '25mb', extended: true })); // URL-encoded 데이터에 대해 50MB로 제한


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
    const fileExt = req.body.fileExt;
    const fileData = req.file.buffer; // 이미지 데이터가 여기에 들어온다고 가정합니다.
    const fileName = req.body.fileName;
    const dirname = uuid();
    let dirName = path.join('uploads', dirname);

    try {
        fsUpper.mkdirSync(dirName);
    } catch (error) {
        console.error(err);
        res.status(500).send('업로드를 위한 경로 생성에 오류가 발생했습니다.');
    }

    // 이미지를 저장할 경로 및 파일 이름
    
    const filePath = path.join(dirName, fileName);
    let ret = {dirName:dirname, fileName:fileName, fileExt:fileExt, url:filePath};

    try {
        // 이미지 데이터를 바이너리로 변환하여 파일에 저장 (동기) -> 앞에 await를 붙히면 프로세스가 안 끝남.
        console.log('파일 저장 성공:', filePath); 
        writeFileAsync(filePath, fileData, 'binary');

        // if(imageWidth) {
        //     console.log('파일 종류 : image'); 
        //     console.log(`- width: ${imageWidth} / height: ${imageHeight}`);
        //     const thumbnailPath = path.join(dirName, 'thumbnail');
        //     try {
        //         fsUpper.mkdirSync(thumbnailPath);
        //     } catch (error) {
        //         console.log('fail to make folder for thumbnail :', error);
        //     };
            
        //     // thumbnail 생성
        //     const isPortrait = imageHeight > imageWidth;
        //     const image = sharp(filePath, {
        //         animated: true,
        //     });

        //     try {
        //         await image
        //         .resize(
        //             256,
        //             isPortrait ? 320 : undefined,
        //             imageWidth < 256 || (isPortrait && imageHeight < 320)
        //             ? {
        //                 kernel: sharp.kernel.nearest,
        //                 }
        //             : undefined,
        //         )
        //         .toFile(path.join(thumbnailPath, `cover-256.${fileExt}`));

        //         ret.imageWidth = imageWidth;
        //         ret.imageHeight = imageHeight;
        //         ret.coverUrl = path.join(thumbnailPath, `cover-256.${fileExt}`);
        //         res.json(ret);
        //     } catch (error) {
        //         console.log(error);
        //         res.json(ret);
        //     };
        // } else {
            res.json(ret);
        // }
    } catch (err) {
        console.error(err);
        res.status(500).send('파일 업로드 중 오류가 발생했습니다.');
    } finally{
        res.end();
    };
});

// app.post('/sendMail', async (req, res) => {
//     const { email, 
//             title, 
//             message, 
//             filename,
//             file } = req.body;
//     console.log('send mail', );
//     try {
//         let transporter = nodemailer.createTransport({
//             port: 587,
//             host: 'smtp.gmail.com',
//             auth: {
//                 user: 'whmoon00@gmail.com', //송신할 이메일
//                 pass: 'bsxa addo bxin vxxd',
//             },
//         });
        
//         let mailOptions = {
//             from: 'whmoon00@gmail.com', //송신할 이메일
//             to: email, //수신할 이메일
//             subject: title,
//             html: `
//             <div>
//                 ${message}
//             </div>
//             `,
//            attachments: [{
//             filename: filename, 
//             file: file}],
//        };
//        await transporter
//        .sendMail(mailOptions)
//        .then(() => res.json({'message':'success'}))
//        .catch(() => res.json({'message':'error'}));
//     } catch (err) {
//         console.error(err);
//         res.json({'message':'error'});
//     }
// });

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
app.post('/companies', async(req, res) => {
    const { 
        queryConditions               = defaultNull(req.body.queryConditions), 
        checkedDates                  = defaultNull(req.body.checkedDates),
        singleDate                    = defaultNull(req.body.singleDate),
    } = req.body;

    let queryString = "";
    if (queryConditions !== null && queryConditions.length !== 0){
        for (const i of queryConditions){
            if( i.column.value !== undefined || i.column.value !== null || i.column.value !== ""){
                if ( i.columnQueryCondition.value === "like")
                queryString = queryString 
                            + i.column.value + " "
                            + i.columnQueryCondition.value + " "
                            + "'%" + i.multiQueryInput + "%'" + " " + i.andOr + " ";
                if ( i.columnQueryCondition.value === "is null" || i.columnQueryCondition.value === "is not null")
                queryString = queryString 
                        + i.column.value + " "
                        + i.columnQueryCondition.value + " " + i.andOr + " ";
                if ( i.columnQueryCondition.value === "=")
                queryString = queryString 
                            + i.column.value + " "
                            + i.columnQueryCondition.value + " "
                            + "'" + i.multiQueryInput + "'" + " " + i.andOr + " ";
            }
        }
    }

    if (checkedDates !== null && checkedDates.length !== 0){
        for (const i of checkedDates){
            if( i.label === "modify_date"){
                queryString = queryString
                        +"(" + i.label + " between " 
                        +"'"+ formatDate(i.fromDate) +"'" + " and " + "'" + formatDate(i.toDate) + "' )" +" And ";                       
            }
        }
        queryString = queryString.replace(/And\s*$/, '');

        if(checkedDates.length >= 2){
            queryString += " and company_code in (select company_code from tbl_purchase_info where ";
            for (const i of checkedDates){
                if( i.label !== "modify_date"){
                queryString = queryString
                            +"(" + i.label + " between " 
                            +"'"+ formatDate(i.fromDate) +"'" + " and " + "'" + formatDate(i.toDate) + "' )" +" And ";
                }
            }
            queryString = queryString.replace(/And\s*$/, '');
            queryString += " )";
        }
    }

    if(singleDate !== null && singleDate.length !== 0){
        queryString += " and company_code in (select company_code from tbl_purchase_info where "; 
        for (const i of singleDate){
            console.log(formatDate(i.fromDate), formatDate(i.toDate));
            queryString = queryString
                        +"(" + i.label + " <= " 
                        +"'"+ formatDate(i.fromDate) + "'" + " ) " + " And ";
            }

        queryString = queryString.replace(/And\s*$/, '');
        queryString += " )";
    }

    console.log('company queryString:', queryString.replace(/And\s*$/, ''));      
    queryString = queryString.replace(/And\s*$/, '');


    try{
        console.log("[Get] Companies");
        const allCompaniesResult = await pool.query(`
            select * from tbl_company_info
            ${queryString ? `WHERE ${queryString}` : ''}
            order by modify_date desc`);

        if(allCompaniesResult.rows.length > 0) {
            const allCompanies = allCompaniesResult.rows;
            res.json(allCompanies);
            res.end();
        }else{
            res.json({message:'no data'});        
            res.end();
        }
    }catch(err){
        console.log(err);
        res.json({message:err.message});        
        res.end();
    }
});

app.post('/leads', async(req, res) => {

    const { 
        queryConditions               = defaultNull(req.body.queryConditions), 
        checkedDates                  = defaultNull(req.body.checkedDates),
        singleDate                    = defaultNull(req.body.singleDate),
    } = req.body;

    let queryString = "";
    if (queryConditions !== null && queryConditions.length !== 0){
        for (const i of queryConditions){
            if( i.column.value !== undefined || i.column.value !== null || i.column.value !== ""){
                if ( i.columnQueryCondition.value === "like")
                queryString = queryString 
                            + i.column.value + " "
                            + i.columnQueryCondition.value + " "
                            + "'%" + i.multiQueryInput + "%'" + " " + i.andOr + " ";
                if ( i.columnQueryCondition.value === "is null" || i.columnQueryCondition.value === "is not null")
                queryString = queryString 
                        + i.column.value + " "
                        + i.columnQueryCondition.value + " " + i.andOr + " ";
                if ( i.columnQueryCondition.value === "=")
                queryString = queryString 
                            + i.column.value + " "
                            + i.columnQueryCondition.value + " "
                            + "'" + i.multiQueryInput + "'" + " " + i.andOr + " ";
            }
        }
    }

    if (checkedDates !== null && checkedDates.length !== 0){
        for (const i of checkedDates){
            if( i.label === "modify_date"){
                queryString = queryString
                        +"(" + i.label + " between " 
                        +"'"+ formatDate(i.fromDate) +"'" + " and " + "'" + formatDate(i.toDate) + "' )" +" And ";                       
            }
        }
        queryString = queryString.replace(/And\s*$/, '');

        if(checkedDates.length >= 2){
            queryString += "and company_code in (select company_code from tbl_purchase_info where ";
            for (const i of checkedDates){
                if( i.label !== "modify_date"){
                queryString = queryString
                            +"(" + i.label + " between " 
                            +"'"+ formatDate(i.fromDate) +"'" + " and " + "'" + formatDate(i.toDate) + "' )" +" And ";
                }
            }
            queryString = queryString.replace(/And\s*$/, '');
            queryString += " )";
        }
    }

    if(singleDate !== null && singleDate.length !== 0){
        queryString += " and company_code in (select company_code from tbl_purchase_info where "; 
        for (const i of singleDate){
            console.log(formatDate(i.fromDate), formatDate(i.toDate));
            queryString = queryString
                        +"(" + i.label + " <= " 
                        +"'"+ formatDate(i.fromDate) + "'" + " ) " + " And ";
            }

        queryString = queryString.replace(/And\s*$/, '');
        queryString += " )";
    }

    console.log('lead queryString:', queryString.replace(/And\s*$/, ''));      
    queryString = queryString.replace(/And\s*$/, '');

    try{
        console.log("[Post]] leads");
        const allLeadsResult = await pool.query(`
            select * from tbl_lead_info
            ${queryString ? `WHERE ${queryString}` : ''}            
            order by modify_date desc`);

        if(allLeadsResult.rows.length > 0) {
            const allLeads = allLeadsResult.rows;
            res.json(allLeads);
            res.end();
        }else{
            res.json({message:'no data'});        
            res.end();
        }
    }catch(err){
        console.log(err);
        res.json({message:err.message});         
        res.end();
    }
});

app.post('/consultings', async(req, res) => {

    const { 
        queryConditions               = defaultNull(req.body.queryConditions), 
        checkedDates                  = defaultNull(req.body.checkedDates),
        singleDate                    = defaultNull(req.body.singleDate),
    } = req.body;

    let queryString = "";
    if (queryConditions !== null && queryConditions.length !== 0){
        for (const i of queryConditions){
            if( i.column.value !== undefined || i.column.value !== null || i.column.value !== ""){
                if ( i.columnQueryCondition.value === "like")
                queryString = queryString 
                            + i.column.value + " "
                            + i.columnQueryCondition.value + " "
                            + "'%" + i.multiQueryInput + "%'" + " " + i.andOr + " ";
                if ( i.columnQueryCondition.value === "is null" || i.columnQueryCondition.value === "is not null")
                queryString = queryString 
                        + i.column.value + " "
                        + i.columnQueryCondition.value + " " + i.andOr + " ";
                if ( i.columnQueryCondition.value === "=")
                queryString = queryString 
                            + i.column.value + " "
                            + i.columnQueryCondition.value + " "
                            + "'" + i.multiQueryInput + "'" + " " + i.andOr + " ";
            }
        }
    }

    if (checkedDates !== null && checkedDates.length !== 0){
        //queryString += " company_code in (select company_code from tbl_purchase_info where ";
        for (const i of checkedDates){
        console.log(formatDate(i.fromDate), formatDate(i.toDate));
        queryString = queryString
                    +"(" + i.label + " between " 
                    +"'"+ formatDate(i.fromDate) +"'" + " and " + "'" + formatDate(i.toDate) + "' )" +" And ";
        }
        queryString = queryString.replace(/And\s*$/, '');
        //queryString += " )";
    }

    if(singleDate !== null && singleDate.length !== 0){
        //queryString += " and company_code in (select company_code from tbl_purchase_info where "; 
        for (const i of singleDate){
            console.log(formatDate(i.fromDate), formatDate(i.toDate));
            queryString = queryString
                        +"(" + i.label + " <= " 
                        +"'"+ formatDate(i.fromDate) + "'" + " ) " + " And ";
            }

        queryString = queryString.replace(/And\s*$/, '');
        //queryString += " )";
    }

    console.log('consulting queryString:', queryString.replace(/And\s*$/, ''));      
    queryString = queryString.replace(/And\s*$/, '');

    try{
        console.log("[Get] consultings");
        const allConsultingsResult = await pool.query(`
            select * from tbl_consulting_info
            ${queryString ? `WHERE ${queryString}` : ''}                
            order by modify_date desc`);

        if(allConsultingsResult.rows.length > 0) {
            const allConsultings = allConsultingsResult.rows;
            res.json(allConsultings);
            res.end();
        }else{
            res.json({message:'no data'});        
            res.end();
        }
    }catch(err){
        console.log(err);
        res.json({message:err.message});    
        res.end();
    }
});


app.post('/consultingCodeConsultings', async(req, res) => {
    const { 
        consulting_code               = defaultNull(req.body.consulting_code) 
    } = req.body;
    try{
        console.log("[Get] consulting code consultings", consulting_code);
        const allConsultingsResult = await pool.query(`
            select * from tbl_consulting_info 
            where consulting_code = $1
            order by modify_date desc`,[consulting_code] );

        if(allConsultingsResult.rows.length > 0) {
            const allConsultings = allConsultingsResult.rows;
            console.log(allConsultings);
            res.json(allConsultings[0]);
            res.end();
        }else{
            res.json({message:'no data'});        
            res.end();
        }
    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});

app.post('/companyConsultings', async(req, res) => {
    const { 
        company_code               = defaultNull(req.body.company_code) 
    } = req.body;

    try{
        console.log("[Get] consultings", company_code);
        const companyConsultingsResult = await pool.query(`
            select  
                consulting_code       ,
                lead_code             ,
                receipt_date          ,
                consulting_type       ,
                receiver              ,
                sales_representative  ,
                company_name          ,
                company_code          ,
                lead_name             ,
                department            ,
                position              ,
                phone_number          ,
                mobile_number         ,
                email                 ,
                replace(request_content, chr(10), '\n') request_content,
                status                ,
                lead_time             ,
                replace(action_content, chr(10), '\n')  action_content,
                request_type          ,
                create_date,
                creator,
                modify_date,
                recent_user,
                product_type,
                application_engineer          
           from tbl_consulting_info
              where company_code = $1
              order by modify_date desc`, [company_code]);

        if(companyConsultingsResult.rows.length > 0) {
            const companyConsultings = companyConsultingsResult.rows;
            res.json(companyConsultings);
            res.end();
        }else{
            res.json({message:'no data'});        
            res.end();
        }
    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});


app.post('/companyQuotations', async(req, res) => {
    console.log("[Get] company quotations", req.body.company_code);
    const { 
        company_code               = defaultNull(req.body.company_code) 
    } = req.body;

    try{
        const companyQuotationsResult = await pool.query(`
            select  *
           from tbl_quotation_info
              where company_code = $1
              order by modify_date desc`, [company_code]);  

        if(companyQuotationsResult.rows.length > 0) {
            const companyQuotations = companyQuotationsResult.rows;
            res.json(companyQuotations);
            res.end();
        }else{
            res.json({message:'no data'});        
            res.end();
        }
    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});


app.post('/quotations', async(req, res) => {

    const { 
        queryConditions               = defaultNull(req.body.queryConditions), 
        checkedDates                  = defaultNull(req.body.checkedDates),
        singleDate                    = defaultNull(req.body.singleDate),
    } = req.body;

    let queryString = "";
    if (queryConditions !== null && queryConditions.length !== 0){
        for (const i of queryConditions){
            if( i.column.value !== undefined || i.column.value !== null || i.column.value !== ""){
                if ( i.columnQueryCondition.value === "like")
                queryString = queryString 
                            + i.column.value + " "
                            + i.columnQueryCondition.value + " "
                            + "'%" + i.multiQueryInput + "%'" + " " + i.andOr + " ";
                if ( i.columnQueryCondition.value === "is null" || i.columnQueryCondition.value === "is not null")
                queryString = queryString 
                        + i.column.value + " "
                        + i.columnQueryCondition.value + " " + i.andOr + " ";
                if ( i.columnQueryCondition.value === "=")
                queryString = queryString 
                            + i.column.value + " "
                            + i.columnQueryCondition.value + " "
                            + "'" + i.multiQueryInput + "'" + " " + i.andOr + " ";
            }
        }
    }

    if (checkedDates !== null && checkedDates.length !== 0){
        // queryString += " company_code in (select company_code from tbl_purchase_info where ";
        for (const i of checkedDates){
        console.log(formatDate(i.fromDate), formatDate(i.toDate));
        queryString = queryString
                    +"(" + i.label + " between " 
                    +"'"+ formatDate(i.fromDate) +"'" + " and " + "'" + formatDate(i.toDate) + "' )" +" And ";
        }
        queryString = queryString.replace(/And\s*$/, '');
       
    }

    if(singleDate !== null && singleDate.length !== 0){
        //queryString += " and company_code in (select company_code from tbl_purchase_info where "; 
        for (const i of singleDate){
            console.log(formatDate(i.fromDate), formatDate(i.toDate));
            queryString = queryString
                        +"(" + i.label + " >= " 
                        +"'"+ formatDate(i.fromDate) + "'" + " ) " + " And ";
            }

        queryString = queryString.replace(/And\s*$/, '');
        queryString += " )";
    }

    console.log('quotations queryString:', queryString.replace(/And\s*$/, ''));      
    queryString = queryString.replace(/And\s*$/, '');

    try{
        console.log("[Get] quotations");
        const allQuotationsResult = await pool.query(`
            select * from tbl_quotation_info
            ${queryString ? `WHERE ${queryString}` : ''}          
            order by modify_date desc`);

        if(allQuotationsResult.rows.length > 0) {
            const allQuotations = allQuotationsResult.rows;
            res.json(allQuotations);
            res.end();
        }else{
            res.json({message:'no data'});        
            res.end();
        }
    }catch(err){
        console.log(err);
        res.json({message:err.message});       
        res.end();
    }
});

app.post('/transactions', async(req, res) => {

    const { 
        queryConditions               = defaultNull(req.body.queryConditions), 
        checkedDates                  = defaultNull(req.body.checkedDates),
        singleDate                    = defaultNull(req.body.singleDate),
    } = req.body;

    let queryString = "";
    if (queryConditions !== null && queryConditions.length !== 0){
        for (const i of queryConditions){
            if( i.column.value !== undefined || i.column.value !== null || i.column.value !== ""){
                if ( i.columnQueryCondition.value === "like")
                queryString = queryString 
                            + i.column.value + " "
                            + i.columnQueryCondition.value + " "
                            + "'%" + i.multiQueryInput + "%'" + " " + i.andOr + " ";
                if ( i.columnQueryCondition.value === "is null" || i.columnQueryCondition.value === "is not null")
                queryString = queryString 
                        + i.column.value + " "
                        + i.columnQueryCondition.value + " " + i.andOr + " ";
                if ( i.columnQueryCondition.value === "=")
                queryString = queryString 
                            + i.column.value + " "
                            + i.columnQueryCondition.value + " "
                            + "'" + i.multiQueryInput + "'" + " " + i.andOr + " ";
            }
        }
    }

    if (checkedDates !== null && checkedDates.length !== 0){
        // queryString += " company_code in (select company_code from tbl_purchase_info where ";
        for (const i of checkedDates){
        console.log(formatDate(i.fromDate), formatDate(i.toDate));
        queryString = queryString
                    +"(" + i.label + " between " 
                    +"'"+ formatDate(i.fromDate) +"'" + " and " + "'" + formatDate(i.toDate) + "' )" +" And ";
        }
        queryString = queryString.replace(/And\s*$/, '');
       
    }

    if(singleDate !== null && singleDate.length !== 0){
        //queryString += " and company_code in (select company_code from tbl_purchase_info where "; 
        for (const i of singleDate){
            console.log(formatDate(i.fromDate), formatDate(i.toDate));
            queryString = queryString
                        +"(" + i.label + " >= " 
                        +"'"+ formatDate(i.fromDate) + "'" + " ) " + " And ";
            }

        queryString = queryString.replace(/And\s*$/, '');
        queryString += " )";
    }

    console.log('transaction queryString:', queryString.replace(/And\s*$/, ''));      
    queryString = queryString.replace(/And\s*$/, '');
    
    try{
        console.log("[Get] transactions");
        const allTransactionsResult = await pool.query(`
            select * from tbl_transaction_info
            ${queryString ? `WHERE ${queryString}` : ''}                      
            order by modify_date desc`);

        if(allTransactionsResult.rows.length > 0) {
            const allTransactions = allTransactionsResult.rows;
            res.json(allTransactions);
            res.end();
        }else{
            res.json({message:'no data'});        
            res.end();
        }
    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});

app.post('/purchases', async(req, res) => {

    const { 
        queryConditions               = defaultNull(req.body.queryConditions), 
        checkedDates                  = defaultNull(req.body.checkedDates),
        singleDate                    = defaultNull(req.body.singleDate),
    } = req.body;

    let queryString = "";
    if (queryConditions !== null && queryConditions.length !== 0){
        for (const i of queryConditions){
            if( i.column.value !== undefined || i.column.value !== null || i.column.value !== ""){
                if ( i.columnQueryCondition.value === "like")
                queryString = queryString 
                            + i.column.value + " "
                            + i.columnQueryCondition.value + " "
                            + "'%" + i.multiQueryInput + "%'" + " " + i.andOr + " ";
                if ( i.columnQueryCondition.value === "is null" || i.columnQueryCondition.value === "is not null")
                queryString = queryString 
                        + i.column.value + " "
                        + i.columnQueryCondition.value + " " + i.andOr + " ";
                if ( i.columnQueryCondition.value === "=")
                queryString = queryString 
                            + i.column.value + " "
                            + i.columnQueryCondition.value + " "
                            + "'" + i.multiQueryInput + "'" + " " + i.andOr + " ";
            }
        }
    }

    if (checkedDates !== null && checkedDates.length !== 0){
        // queryString += " company_code in (select company_code from tbl_purchase_info where ";
        for (const i of checkedDates){
        console.log(formatDate(i.fromDate), formatDate(i.toDate));
        queryString = queryString
                    +"( tpi." + i.label + " between " 
                    +"'"+ formatDate(i.fromDate) +"'" + " and " + "'" + formatDate(i.toDate) + "' )" +" And ";
        }
        queryString = queryString.replace(/And\s*$/, '');
       
    }

    if(singleDate !== null && singleDate.length !== 0){
        //queryString += " and company_code in (select company_code from tbl_purchase_info where "; 
        for (const i of singleDate){
            console.log(formatDate(i.fromDate), formatDate(i.toDate));
            queryString = queryString
                        +"(" + i.label + " >= " 
                        +"'"+ formatDate(i.fromDate) + "'" + " ) " + " And ";
            }

        queryString = queryString.replace(/And\s*$/, '');
        queryString += " )";
    }

    console.log('purchase queryString:', queryString.replace(/And\s*$/, ''));      
    queryString = queryString.replace(/And\s*$/, '');
        
    try{
        console.log("[Get] purchases");
        const allpurchasesResult = await pool.query(`
        select tci.company_name, tpi.* 
            from tbl_purchase_info tpi, tbl_company_info tci
            where tpi.company_code = tci.company_code
            ${queryString ? `AND ${queryString}` : ''}                   
            order by tpi.modify_date desc`);

        if(allpurchasesResult.rows.length > 0) {
            const allpurchases = allpurchasesResult.rows;
            res.json(allpurchases);
            res.end();
        }else{
            res.json({message:'no data'});        
            res.end();
        }
    }catch(err){
        console.log(err);
        res.json({message:err.message});        
        res.end();
    }
});

app.post('/companyMaContract', async(req, res) => {
    console.log("[Get] comapany ma contract", req.body.company_code);
    const { 
        company_code               = defaultNull(req.body.company_code) 
    } = req.body;

    try{
        const companyMaContractResult = await pool.query(`
            select tpi.product_code, 
                tpi.product_name, 
                tpi.serial_number, 
                tci.company_name, 
                tmc.* 
                from tbl_ma_contract tmc , tbl_purchase_info tpi, tbl_company_info tci
                where tmc.purchase_code = tpi.purchase_code
                and tmc.ma_company_code = tci.company_code
                and tmc.ma_company_code = $1
                order by tmc.ma_modify_date desc`, [company_code]);  

        if(companyMaContractResult.rows.length > 0) {
            const companyMaContract = companyMaContractResult.rows;
            res.json(companyMaContract);
            res.end();
        }else{
            res.json({message:'no data'});        
            res.end();
        }
    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});

app.post('/purchaseMaContract', async(req, res) => {
    console.log("[Get] purchase ma contract", req.body.purchase_code);
    const { 
        purchase_code               = defaultNull(req.body.purchase_code) 
    } = req.body;

    try{
        const purchaseMaContractResult = await pool.query(`
            select tpi.product_code, 
                tpi.product_name, 
                tpi.serial_number, 
                tci.company_name, 
                tmc.* 
                from tbl_ma_contract tmc , tbl_purchase_info tpi, tbl_company_info tci
                where tmc.purchase_code = $1
                and tmc.purchase_code = tpi.purchase_code
                and tmc.ma_company_code = tci.company_code
                order by tmc.ma_modify_date desc`, [purchase_code]);  

        if(purchaseMaContractResult.rows.length > 0) {
            const purchaseMaContract = purchaseMaContractResult.rows;
            res.json(purchaseMaContract);
            res.end();
        }else{
            res.json({message:'no data'});        
            res.end();
        }
    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});

app.post('/companyPurchases', async(req, res) => {
    console.log("[Get] company purchase", req.body.company_code);
    const { 
        company_code               = defaultNull(req.body.company_code) 
    } = req.body;

    try{
        const companyPurchaseResult = await pool.query(`
            select  *
           from tbl_purchase_info
              where company_code = $1
              order by modify_date desc`, [company_code]);  

        if(companyPurchaseResult.rows.length > 0) {
            const companyPurchase = companyPurchaseResult.rows;
            res.json(companyPurchase);
            res.end();
        }else{
            res.json({message:'no data'});        
            res.end();
        }
    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});

app.get('/product', async(req, res) => {
    try{
        console.log("[Get] Product");
        const allProductResult = await pool.query(`
        select * 
            from tbl_product_info tpi
            order by tpi.modify_date desc`);

        if(allProductResult.rows.length > 0) {
            const allproducts = allProductResult.rows;
            res.json(allproducts);
            res.end();
        }else{
            res.json({message:'no data'});        
            res.end();
        }
    }catch(err){
        console.log(err);
        res.json({message:err.message});        
        res.end();
    }
});

app.get('/productClass', async(req, res) => {
    try{
        console.log("[Get] productClass");
        const allproductClassResult = await pool.query(`
        select product_class_code  ,
                product_class_name  ,
                product_class_order ,
                product_class_memo  
            from tbl_product_class_list tpc
            order by product_class_order`);

        if(allproductClassResult.rows.length > 0) {
            const allproductsClass = allproductClassResult.rows;
            res.json(allproductsClass);
            res.end();
        }else{
            res.json({message:'no data'});        
            res.end();
        }
    }catch(err){
        console.log(err);
        res.json({message:err.message});        
        res.end();
    }
});

app.post('/companyTaxInvoice', async(req, res) => {
    const { 
        company_code               = defaultNull(req.body.company_code) 
    } = req.body;    
    try{
        console.log("[Get] tax Invoice");
        const allTaxInvoiceResult = await pool.query(`
        select * 
            from tbl_tax_invoice tti
            where tti.company_code = $1
            order by tti.modify_date desc`, [company_code]);  

        if(allTaxInvoiceResult.rows.length > 0) {
            const alltaxInvoices = allTaxInvoiceResult.rows;
            res.json(alltaxInvoices);
            res.end();
        }else{
            res.json({message:'no data'});        
            res.end();
        }
    }catch(err){
        console.log(err);
        res.json({message:err.message});        
        res.end();
    }
});

app.post('/taxInvoice', async(req, res) => {

    const { 
        queryConditions               = defaultNull(req.body.queryConditions), 
        checkedDates                  = defaultNull(req.body.checkedDates),
        singleDate                    = defaultNull(req.body.singleDate),
    } = req.body;

    let queryString = "";
    if (queryConditions !== null && queryConditions.length !== 0){
        for (const i of queryConditions){
            if( i.column.value !== undefined || i.column.value !== null || i.column.value !== ""){
                if ( i.columnQueryCondition.value === "like")
                queryString = queryString 
                            + i.column.value + " "
                            + i.columnQueryCondition.value + " "
                            + "'%" + i.multiQueryInput + "%'" + " " + i.andOr + " ";
                if ( i.columnQueryCondition.value === "is null" || i.columnQueryCondition.value === "is not null")
                queryString = queryString 
                        + i.column.value + " "
                        + i.columnQueryCondition.value + " " + i.andOr + " ";
                if ( i.columnQueryCondition.value === "=")
                queryString = queryString 
                            + i.column.value + " "
                            + i.columnQueryCondition.value + " "
                            + "'" + i.multiQueryInput + "'" + " " + i.andOr + " ";
            }
        }
    }

    if (checkedDates !== null && checkedDates.length !== 0){
        // queryString += " company_code in (select company_code from tbl_purchase_info where ";
        for (const i of checkedDates){
        console.log(formatDate(i.fromDate), formatDate(i.toDate));
        queryString = queryString
                    +"(" + i.label + " between " 
                    +"'"+ formatDate(i.fromDate) +"'" + " and " + "'" + formatDate(i.toDate) + "' )" +" And ";
        }
        queryString = queryString.replace(/And\s*$/, '');
       
    }

    if(singleDate !== null && singleDate.length !== 0){
        //queryString += " and company_code in (select company_code from tbl_purchase_info where "; 
        for (const i of singleDate){
            console.log(formatDate(i.fromDate), formatDate(i.toDate));
            queryString = queryString
                        +"(" + i.label + " >= " 
                        +"'"+ formatDate(i.fromDate) + "'" + " ) " + " And ";
            }

        queryString = queryString.replace(/And\s*$/, '');
        queryString += " )";
    }

    console.log('tax Invoice queryString:', queryString.replace(/And\s*$/, ''));      
    queryString = queryString.replace(/And\s*$/, '');
        
    try{
        console.log("[Get] tax Invoice");
        const allTaxInvoiceResult = await pool.query(`
        select * 
            from tbl_tax_invoice tti
            ${queryString ? `WHERE ${queryString}` : ''}    
            order by tti.modify_date desc`);  

        if(allTaxInvoiceResult.rows.length > 0) {
            const alltaxInvoices = allTaxInvoiceResult.rows;
            res.json(alltaxInvoices);
            res.end();
        }else{
            res.json({message:'no data'});        
            res.end();
        }
    }catch(err){
        console.log(err);
        res.json({message:err.message});        
        res.end();
    }
});

app.post('/attachment', async(req, res) => {
    const { 
        attachment_code                    = defaultNull(req.body.attachment_code),
    } = req.body;
    try{
        console.log("[Get] attachment");
        const attachmentResult = await pool.query(`
        select * 
            from tbl_attachment_info tai
            WHERE attachment_code = $1
            order by attachment_index `,[attachment_code]);  

        if(attachmentResult.rows.length > 0) {
            const allAttachment = attachmentResult.rows;
            res.json(allAttachment);
            res.end();
        }else{
            res.json({message:'no data'});        
            res.end();
        }
    }catch(err){
        console.log(err);
        res.json({message:err.message});        
        res.end();
    }
});


app.get('/getallusers', async(req, res) => {
    console.log("[Get] all users");
    try{
        const users = await pool.query(`
        SELECT t.user_id as "userId", 
        t.user_name as "userName", 
		t.mobile_number as "mobileNumber",
        t.phone_number as "phoneNumber",
        t.department as "department", 
        t.position as "position", 
        t.email as "email", 
        t.private_group  as "private_group",
        t.memo  as "memo",
        t.job_type as "jobType",
        t.is_work as "isWork"
        FROM tbl_user_info t`);
        if(users.rows.length >0) {
            const allusers = users.rows;
            res.json(allusers);
            res.end();
        }else{
            res.json({message:'no data'});        
            res.end();
        }

    }catch(err){
        console.error(err);
        res.json({message:err.message});        
        res.end();
    }
});

//create/update company 
app.post('/modifyCompany', async(req, res) => {
    const {
        action_type                = defaultNull(req.body.action_type) ,   
        company_code               = defaultNull(req.body.company_code) ,
        company_number             = defaultNull(req.body.company_number) , 
        company_group              = defaultNull(req.body.company_group) ,
        company_scale              = defaultNull(req.body.company_scale) ,
        deal_type                  = defaultNull(req.body.deal_type) ,
        company_name               = defaultNull(req.body.company_name) ,
        company_name_en            = defaultNull(req.body.company_name_en) ,
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
        region                     = defaultNull(req.body.region),
        site_id                    = defaultNull(req.body.site_id)
    } = req.body;    

    try{

        const current_date = await pool.query(`select to_char(now(),'YYYY.MM.DD HH24:MI:SS') currdate`);
        const currentDate = current_date.rows[0];
        let v_company_code = company_code;
        let v_company_number = company_number;

        if (modify_user === null ){
            throw new Error('modify user는 not null입니다.');
        }

       

        const modify_user_exist = await pool.query(`select user_id from tbl_user_info
                                                    where user_id = $1`,[modify_user]);
        if (modify_user_exist.rows.length === 0 ){
            throw new Error(`modify user${modify_user}는 user_id 이어야 합니다.`);
        }

        if (action_type === 'ADD') {
            if (company_name === null ){
                throw new Error('company_name은 not null입니다.');
            }
    
            if (site_id === null ){
                throw new Error('site_id는 not null입니다.');
            }
    
            if (sales_resource === null ){
                throw new Error('sales_resource는 not null입니다.');
            }

            v_company_code  = pk_code();

            // 현재 db에 있는 sequence에서  company_number 하나 생성해서 입력
            const company_number_result = await pool.query(`
            select nextval(\'index_number_seq\') company_count ;`);

            v_company_number = parseInt(company_number_result.rows[0].company_count);

            const response = await pool.query(`
            insert into tbl_company_info(
                company_code                   ,
                company_number                 ,
                company_group                         ,
                company_scale                  ,
                deal_type                      ,
                company_name                   ,
                company_name_en                ,
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
                region                         ,
                site_id)
            values(
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 
                $18, $19, $20, $21, $22::timestamp, $23::timestamp, $24, $25::integer, $26, $27, $28, $29, $30, $31, $32);
            `,[v_company_code,v_company_number,company_group,company_scale,deal_type,company_name,company_name_en,
               business_registration_code,establishment_date,closure_date,ceo_name,business_type,business_item,
               industry_type,company_zip_code,company_address,company_phone_number,company_fax_number,homepage,
               memo,modify_user,currentDate.currdate,currentDate.currdate,modify_user,counter,account_code,bank_name,account_owner,
               sales_resource,application_engineer,region, site_id
            ]);
        }
        if (action_type === 'UPDATE') {
            const response = await pool.query(`
            update tbl_company_info
              set company_number =  COALESCE($1 ,company_number) ,
                  company_group =  COALESCE($2, company_group)  ,
                  company_scale =  COALESCE($3, company_scale)  ,
                  deal_type  =  COALESCE($4, deal_type) ,
                  company_name  =  COALESCE($5, company_name) ,
                  company_name_en  =  COALESCE($6, company_name_en) ,
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
                  region                 =  COALESCE( $28, region),
                  site_id                =  COALESCE($29, site_id)       
             where company_code = $30;
            `,[company_number,company_group,company_scale,deal_type,company_name,company_name_en,
                business_registration_code,establishment_date,closure_date,ceo_name,business_type,business_item,
                industry_type,company_zip_code,company_address,company_phone_number,company_fax_number,homepage,
                memo,currentDate.currdate, modify_user,counter,account_code,bank_name,account_owner,
                sales_resource,application_engineer,region,site_id, v_company_code
            ]);
           // update 
        }  
        const out_company_code = v_company_code;
        const out_create_user = action_type === 'ADD' ? modify_user : "";
        const out_create_date = action_type === 'ADD' ? currentDate.currdate:"";
        const out_modify_date = currentDate.currdate;
        const out_recent_user = modify_user;
        const out_company_number = v_company_number;
         
        res.json({ out_company_code: out_company_code,  out_create_user:out_create_user, 
            out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user,
            out_company_number:out_company_number
            }); // 결과 리턴을 해 줌 .  
        console.log({ out_company_code: out_company_code,  out_create_user:out_create_user, 
                out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user,
                out_company_number:out_company_number });
        res.end();  

    }catch(err){
        console.error(err);
        res.json({message:err.message});
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
        lead_group              = defaultNull(req.body.lead_group)    ,
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
        status                  = defaultNull(req.body.status)   ,
        memo                    = defaultNull(req.body.memo)     ,
        deal_type              = defaultNull(req.body.deal_type),
        email2                  = defaultNull(req.body.email2)
                 } = req.body;
    try{
       
        const current_date = await pool.query(`select to_char(now(),'YYYY.MM.DD HH24:MI:SS') currdate`);
        const currentDate = current_date.rows[0];
        let v_lead_code = lead_code;
        let v_lead_number = lead_number;

        if (modify_user === null ){
            throw new Error('modify user는 not null입니다.');
        }

        const modify_user_exist = await pool.query(`select user_id from tbl_user_info
                                                    where user_id = $1`,[modify_user]);
        if (modify_user_exist.rows.length === 0 ){
            throw new Error(`modify user${modify_user}는 user_id 이어야 합니다.`);
        }        

        if (action_type === 'ADD') {
            if (company_code === null || company_code === "") {
                throw new Error('company_code는 not null입니다.');
            }

            const company_code_exist = await pool.query(`select company_code from tbl_company_info
                                                        where company_code = $1`,[company_code]);
            if (company_code_exist.rows.length === 0 ){
                throw new Error(`${company_code}는 등록되지 않은 company입니다.`);
            }    

            v_lead_code  = pk_code();


            // 현재 db에 있는 sequence에서  lead_number 하나 생성해서 입력
            const lead_number_result = await pool.query(`
            select nextval(\'index_number_seq\') lead_count ;`);

            v_lead_number = parseInt(lead_number_result.rows[0].lead_count);
            
            const response = await pool.query(`
            insert into tbl_lead_info(
                lead_code               ,
                company_code            ,
                lead_index             ,
                company_index           ,
                lead_group              ,
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
                status                  ,
                memo                    ,
                deal_type               ,
                email2)
             values(
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,
                $23,$24,$25,$26,$27,$28, $29, $30);
            `,[ v_lead_code,
                company_code            ,
                lead_index             ,
                company_index           ,
                lead_group               ,
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
                status                  ,
                memo                    ,
                deal_type               ,
                email2
            ]);
        }
        if (action_type === 'UPDATE') {
            if(company_code !== null) {
                const company_code_exist = await pool.query(`select company_code from tbl_company_info
                                                        where company_code = $1`,[company_code]);
                if (company_code_exist.rows.length === 0 ){
                    throw new Error(`${company_code}는 등록되지 않은 company입니다.`);
                }
            }

            const response = await pool.query(`
            update tbl_lead_info 
               set company_code   =  COALESCE($1,company_code)         ,
                   lead_index   =  COALESCE($2,lead_index)         ,
                   company_index   =  COALESCE($3,company_index)         ,
                   lead_group           = COALESCE($4 , lead_group)   ,
                   sales_resource       = COALESCE($5, sales_resource)   ,
                   region               = COALESCE($6, region)   ,
                   company_name         = COALESCE($7, company_name)   ,
                   company_zip_code     = COALESCE($8, company_zip_code)   ,
                   company_address      = COALESCE($9, company_address)   ,
                   company_phone_number = COALESCE($10, company_phone_number)   ,
                   company_fax_number   = COALESCE($11, company_fax_number)   ,
                   lead_name           = COALESCE($12, lead_name)   ,
                   is_keyman            = COALESCE($13, is_keyman)   ,
                   department           = COALESCE($14, department)   ,
                   position             = COALESCE($15, position)   ,
                   mobile_number        = COALESCE($16, mobile_number)   ,
                   company_name_en      = COALESCE($17, company_name_en)   ,
                   email                = COALESCE($18, email)   ,
                   homepage             = COALESCE($19, homepage)   ,
                   modify_date          = $20::timestamp   ,
                   recent_user          = $21   ,
                   counter  = COALESCE($22::integer, counter)   ,
                   application_engineer = COALESCE($23, application_engineer)   ,
                   status               = COALESCE($24, status)   ,
                   memo                 = COALESCE($25, memo)       ,
                   deal_type            = COALESCE($26, deal_type) ,
                   email2               = COALESCE($27, email2)
               where lead_code = $28;
            `,[company_code            ,
                lead_index             ,
                company_index           ,
                lead_group                  ,
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
                counter                 ,
                application_engineer    ,
                status                  ,
                memo                    ,
                deal_type               ,
                email2                  ,
                v_lead_code
            ]);
        }      


     const out_lead_code = v_lead_code;
     const out_lead_number = v_lead_number;
     const out_create_user = action_type === 'ADD' ? modify_user : "";
     const out_create_date = action_type === 'ADD' ? currentDate.currdate : "";
     const out_modify_date = currentDate.currdate;
     const out_recent_user = modify_user;
     
    res.json({ out_lead_code: out_lead_code,  out_create_user:out_create_user, 
        out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user,
        out_lead_number:out_lead_number }); // 결과 리턴을 해 줌 .  

    console.log({ out_lead_code: out_lead_code,  out_create_user:out_create_user, 
            out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user,
            out_lead_number:out_lead_number });

    res.end();
    }catch(err){
        console.error(err);
        res.json({message:err.message});
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
        product_type            = defaultNull(req.body.product_type),
        application_engineer    = defaultNull(req.body.application_engineer),
        request_attachment_code = defaultNull(req.body.request_attachment_code),
        action_attachment_code  = defaultNull(req.body.action_attachment_code),
        } = req.body;

    try{

        const current_date = await pool.query(`select to_char(now(),'YYYY.MM.DD HH24:MI:SS') currdate`);
        const currentDate = current_date.rows[0];
        let v_consulting_code = consulting_code;

        if (modify_user === null ){
            throw new Error('modify user는 not null입니다.');
        }

        const modify_user_exist = await pool.query(`select user_id from tbl_user_info
                                                    where user_id = $1`,[modify_user]);
        if (modify_user_exist.rows.length === 0 ){
            throw new Error(`modify user(${modify_user})는 user id  이어야 합니다.`);
        }        

        if (action_type === 'ADD') {
            if (company_code === null || company_code === "") {
                throw new Error('company_code는 not null입니다.');
            }
            const company_code_exist = await pool.query(`select company_code from tbl_company_info
                                                        where company_code = $1`,[company_code]);
            if (company_code_exist.rows.length === 0 ){
                throw new Error(`${company_code}는 등록되지 않은 company입니다.`);
            }

            if (lead_code === null || lead_code === "") {
                throw new Error('lead_code는 not null입니다.');
            }
            const lead_code_exist = await pool.query(`select lead_code from tbl_lead_info
                                                where lead_code = $1`,[lead_code]);
            if (lead_code_exist.rows.length === 0 ){
                throw new Error(`${lead_code}는 등록되지 않은 lead 입니다.`);
            }


            v_consulting_code  = pk_code();
            const response = await pool.query(`
            insert into tbl_consulting_info(
                consulting_code         , 
                lead_code               , 
                receipt_date            , 
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
                creator                 ,
                recent_user             ,
                modify_date             ,
                product_type            ,
                application_engineer    ,
                request_attachment_code ,
                action_attachment_code
            )
             values(
                $1,$2,$3::timestamp,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20::timestamp,$21,$22,
                $23::timestamp,$24,$25, $26, $27);
            `,[ v_consulting_code,
                lead_code               , 
                receipt_date            , 
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
                product_type             ,
                application_engineer     ,
                request_attachment_code  ,
                action_attachment_code
            ]);
        }

        if (action_type === 'UPDATE') {
            if(company_code !== null) {
                const company_code_exist = await pool.query(`select company_code from tbl_company_info
                                                        where company_code = $1`,[company_code]);
                if (company_code_exist.rows.length === 0 ){
                    throw new Error(`${company_code}는 등록되지 않은 company입니다.`);
                }
            }

            if(lead_code !== null) {
                const lead_code_exist = await pool.query(`select lead_code from tbl_lead_info
                                                    where lead_code = $1`,[lead_code]);
                if (lead_code_exist.rows.length === 0 ){
                    throw new Error(`${lead_code}는 등록되지 않은 lead 입니다.`);
                }
            }

            const response = await pool.query(`
            update tbl_consulting_info 
               set lead_code               = COALESCE($1, lead_code), 
                   receipt_date            = COALESCE($2::timestamp, receipt_date), 
                   consulting_type         = COALESCE($3, consulting_type), 
                   receiver                = COALESCE($4, receiver), 
                   sales_representative    = COALESCE($5, sales_representative), 
                   company_name            = COALESCE($6, company_name), 
                   company_code            = COALESCE($7, company_code), 
                   lead_name               = COALESCE($8, lead_name), 
                   department              = COALESCE($9, department), 
                   position                = COALESCE($10, position), 
                   phone_number            = COALESCE($11, phone_number), 
                   mobile_number           = COALESCE($12, mobile_number), 
                   email                   = COALESCE($13, email), 
                   request_content         = COALESCE($14, request_content), 
                   status                  = COALESCE($15, status), 
                   lead_time               = COALESCE($16, lead_time), 
                   action_content          = COALESCE($17, action_content), 
                   request_type            = COALESCE($18, request_type), 
                   recent_user             = COALESCE($19, recent_user),
                   modify_date             = COALESCE($20::timestamp, modify_date),
                   product_type            = COALESCE($21, product_type),
                   application_engineer    = COALESCE($22, application_engineer),
                   request_attachment_code = COALESCE($23, request_attachment_code),
                   action_attachment_code  = COALESCE($24, action_attachment_code)
                where consulting_code = $25;
            `,[lead_code               , 
                receipt_date            , 
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
                currentDate.currdate    ,
                product_type            ,
                application_engineer    ,
                request_attachment_code ,
                action_attachment_code  ,
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
        res.json({message:err.message});
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
        product_class_name       = defaultNull(req.body.product_class_name),
        product_name        = defaultNull(req.body.product_name),
        serial_number       = defaultNull(req.body.serial_number),
        licence_info        = defaultNull(req.body.licence_info),
        po_number           = defaultNull(req.body.po_number),
        product_type        = defaultNull(req.body.product_type),
        module              = defaultNull(req.body.module),
        receipt_date        = defaultNull(req.body.receipt_date),
        delivery_date       = defaultNull(req.body.delivery_date),
        ma_finish_date      = defaultNull(req.body.ma_finish_date),
        invoice_number      = defaultNull(req.body.invoice_number),
        price               = defaultNull(req.body.price),
        modify_user         = defaultNull(req.body.modify_user),   
        purchase_memo       = defaultNull(req.body.purchase_memo),
        status              = defaultNull(req.body.status),
        hq_finish_date      = defaultNull(req.body.hq_finish_date),
        quantity            = defaultNull(req.body.quantity),
        regcode             = defaultNull(req.body.regcode),
        ma_contact_date     = defaultNull(req.body.ma_contact_date),
    } = req.body;
    try{

        const current_date = await pool.query(`select to_char(now(),'YYYY.MM.DD HH24:MI:SS') currdate`);
        const currentDate = current_date.rows[0];
        let v_purchase_code = purchase_code;

        if (modify_user === null ){
            throw new Error('modify_user는 not null입니다.');
        }

        const modify_user_exist = await pool.query(`select user_id from tbl_user_info
                                                    where user_id = $1`,[modify_user]);
        if (modify_user_exist.rows.length === 0 ){
            throw new Error('modify_user는 user_id 이어야 합니다.');
        }

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
                    purchase_code  ,     
                    company_code   ,    
                    product_code   ,      
                    product_class_name  ,     
                    product_name   ,    
                    serial_number  ,     
                    licence_info   ,      
                    po_number      ,         
                    product_type   ,      
                    module         ,      
                    receipt_date   ,      
                    delivery_date  ,     
                    ma_finish_date ,    
                    invoice_number ,    
                    price          ,    
                    registration_date, 
                    recent_user    ,    
                    modify_date    ,    
                    purchase_memo  ,    
                    status         ,   
                    hq_finish_date ,    
                    quantity       ,   
                    regcode        ,   
                    ma_contact_date    )  
                    values(
                    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::date,$12::date,$13::date,
                    $14,$15::numeric,$16::timestamp,$17,$18::timestamp,$19, $20, $21::date, $22, 
                    $23::integer, $24::date)
            `,[
                v_purchase_code, 
                company_code   ,  
                product_code   ,  
                product_class_name  ,  
                product_name   ,  
                serial_number  ,  
                licence_info   ,  
                po_number      ,  
                product_type   ,  
                module         ,  
                receipt_date   ,  
                delivery_date  ,  
                ma_finish_date ,  
                invoice_number      ,  
                price          ,  
                currentDate.currdate ,  
                modify_user    ,  
                currentDate.currdate ,  
                purchase_memo  ,  
                status         ,  
                hq_finish_date ,  
                quantity       ,  
                regcode        ,  
                ma_contact_date   
            ]);     
        }
        if (action_type === 'UPDATE') {
            if(company_code !== null) {
                const company_code_exist = await pool.query(`select company_code from tbl_company_info
                                                        where company_code = $1`,[company_code]);
                if (company_code_exist.rows.length === 0 ){
                    throw new Error(`${company_code}는 등록되지 않은 company입니다.`);
                }
            }

            const response = await pool.query(`
               update tbl_purchase_info 
               set  company_code      = COALESCE($1, company_code ),  
                    product_code      = COALESCE($2, product_code),  
                    product_class_name     = COALESCE($3, product_class_name),  
                    product_name      = COALESCE($4, product_name),  
                    serial_number     = COALESCE($5, serial_number),  
                    licence_info      = COALESCE($6, licence_info),  
                    po_number         = COALESCE($7, po_number),  
                    product_type      = COALESCE($8, product_type),  
                    module            = COALESCE($9, module),  
                    receipt_date      = COALESCE($10::timestamp, receipt_date),  
                    delivery_date     = COALESCE($11::timestamp, delivery_date),  
                    ma_finish_date    = COALESCE($12::date, ma_finish_date),  
                    invoice_number    = COALESCE($13, invoice_number ),  
                    price             = COALESCE($14::numeric, price),  
                    recent_user       = COALESCE($15, recent_user), 
                    modify_date       = COALESCE($16::timestamp, modify_date),  
                    purchase_memo     = COALESCE($17, purchase_memo),  
                    status            = COALESCE($18, status),  
                    hq_finish_date    = COALESCE($19::date, hq_finish_date),  
                    quantity          = COALESCE($20, quantity),  
                    regcode           = COALESCE($21, regcode),  
                    ma_contact_date   = COALESCE($22::date, ma_contact_date)
                where purchase_code = $23
            `,[company_code   ,  
                product_code   ,  
                product_class_name  ,  
                product_name   ,  
                serial_number  ,  
                licence_info   ,  
                po_number      ,  
                product_type   ,  
                module         ,  
                receipt_date   ,  
                delivery_date  ,  
                ma_finish_date ,  
                invoice_number      ,  
                price          ,  
                modify_user      ,
                currentDate.currdate    ,
                purchase_memo    ,
                status           ,
                hq_finish_date   ,
                quantity         ,
                regcode          ,
                ma_contact_date  ,
                v_purchase_code  
            ]);
        }
        const out_purchase_code = v_purchase_code;
        const out_create_user = action_type === 'ADD' ? modify_user : "";
        const out_create_date = action_type === 'ADD' ? currentDate.currdate : "";
        const out_modify_date = currentDate.currdate;
        const out_recent_user = modify_user;
        
        res.json({ out_purchase_code: out_purchase_code,  out_create_user:out_create_user, 
           out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user }); // 결과 리턴을 해 줌 .  
   
        console.log({ out_purchase_code: out_purchase_code,  out_create_user:out_create_user, 
               out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user });
   
        res.end();
    }catch(err){
        console.error(err);
        res.json({message:err.message});
        res.end();        
    }
});

// create/update transaction info 
app.post('/modifyTransaction', async(req, res) => {
    const  { 
        action_type                = defaultNull(req.body.action_type),
        transaction_code           = defaultNull(req.body.transaction_code),
        transaction_title          = defaultNull(req.body.transaction_title),
        transaction_type           = defaultNull(req.body.transaction_type),
        transaction_contents       = defaultNull(req.body.transaction_contents),
        publish_date               = defaultNull(req.body.publish_date),
        publish_type               = defaultNull(req.body.publish_type),
        payment_type               = defaultNull(req.body.payment_type),
        supply_price               = defaultNull(req.body.supply_price),
        tax_price                   = defaultNull(req.body.tax_price),
        total_price                 = defaultNull(req.body.total_price),
        paid_money                  = defaultNull(req.body.paid_money),
        bank_name                   = defaultNull(req.body.bank_name),
        account_owner               = defaultNull(req.body.account_owner),
        account_number              = defaultNull(req.body.account_number),
        card_name                   = defaultNull(req.body.card_name),
        card_number                 = defaultNull(req.body.card_number),
        is_bill_publish             = defaultNull(req.body.is_bill_publish),
        company_code                = defaultNull(req.body.company_code),
        company_name               = defaultNull(req.body.company_name),
        ceo_name                   = defaultNull(req.body.ceo_name),
        company_address            = defaultNull(req.body.company_address),
        business_type              = defaultNull(req.body.business_type),
        business_item              = defaultNull(req.body.business_item),
        business_registration_code = defaultNull(req.body.business_registration_code),
        modify_user                = defaultNull(req.body.modify_user),
    } = req.body;

    try{

        const current_date = await pool.query(`select to_char(now(),'YYYY.MM.DD HH24:MI:SS') currdate`);
        const currentDate = current_date.rows[0];
        let v_transaction_code = transaction_code;

        if (modify_user === null ){
            throw new Error('modify user는 not null입니다.');
        }

        const modify_user_exist = await pool.query(`select user_id from tbl_user_info
                                                    where user_id = $1`,[modify_user]);
        if (modify_user_exist.rows.length === 0 ){
            throw new Error('modify user는 user_id 이어야 합니다.');
        }7        

        if (action_type === 'ADD') {
            if (company_code === null || company_code === "") {
                throw new Error('company_code not null입니다.');
            }
            if (publish_date === null || publish_date === "") {
                throw new Error('publish_date는 not null입니다.');
            }
            v_transaction_code  = pk_code();
            const response = await pool.query(`
                insert into tbl_transaction_info(
                    transaction_code            ,
                    transaction_title           ,
                    transaction_type            ,
                    transaction_contents        ,
                    publish_date                ,
                    publish_type                ,
                    payment_type                ,
                    supply_price                ,
                    tax_price                   ,
                    total_price                 ,
                    paid_money                  ,
                    bank_name                   ,
                    account_owner               ,
                    account_number              ,
                    card_name                   ,
                    card_number                 ,
                    is_bill_publish             ,
                    company_code                ,
                    company_name                ,
                    ceo_name                    ,
                    company_address             ,
                    business_type               ,
                    business_item               ,
                    business_registration_code  ,
                    creator                     ,
                    modify_date                 ,
                    recent_user                 
                ) values($1,$2,$3,$4,$5::date,$6,$7,$8::numeric,$9::numeric,$10::numeric,
                    $11::numeric,$12,$13,$14,$15,$16,$17,$18,$19,$20,
                    $21,$22,$23,$24,$25,$26::timestamp,$27)
            `,[
                v_transaction_code          ,
                transaction_title           ,
                transaction_type            ,
                transaction_contents        ,
                publish_date                ,
                publish_type                ,
                payment_type                ,
                supply_price                ,
                tax_price                   ,
                total_price                 ,
                paid_money                  ,
                bank_name                   ,
                account_owner               ,
                account_number              ,
                card_name                   ,
                card_number                 ,
                is_bill_publish             ,
                company_code                ,
                company_name                ,
                ceo_name                    ,
                company_address             ,
                business_type               ,
                business_item               ,
                business_registration_code  ,
                modify_user                 ,
                currentDate.currdate        ,
                modify_user                 ,
            ]);

        }
        if (action_type === 'UPDATE') {

            const response = await pool.query(`
                update tbl_transaction_info 
                  set transaction_title             = COALESCE($1 , transaction_title),
                        transaction_type            = COALESCE($2 , transaction_type),
                        transaction_contents        = COALESCE($3 , transaction_contents),
                        publish_date                = COALESCE($4::date , publish_date),
                        publish_type                = COALESCE($5 , publish_type),
                        payment_type                = COALESCE($6 , payment_type),
                        supply_price                = COALESCE($7::numeric , supply_price),
                        tax_price                   = COALESCE($8::numeric , tax_price),
                        total_price                 = COALESCE($9::numeric , total_price),
                        paid_money                  = COALESCE($10::numeric , paid_money),
                        bank_name                   = COALESCE($11, bank_name),
                        account_owner               = COALESCE($12, account_owner),
                        account_number              = COALESCE($13, account_number),
                        card_name                   = COALESCE($14, card_name),
                        card_number                 = COALESCE($15, card_number),
                        is_bill_publish             = COALESCE($16, is_bill_publish),
                        company_code                = COALESCE($17 , company_code),
                        company_name               = COALESCE($18 , company_name),
                        ceo_name                   = COALESCE($19 , ceo_name),
                        company_address            = COALESCE($20 , company_address),
                        business_type              = COALESCE($21 , business_type),
                        business_item              = COALESCE($22 , business_item),
                        business_registration_code = COALESCE($23 , business_registration_code),
                        modify_date                = COALESCE($24::timestamp , modify_date),
                        recent_user                = COALESCE($25 , recent_user)
                        
                where transaction_code = $26
            `,[ transaction_title         ,
                transaction_type          ,
                transaction_contents      ,
                publish_date              ,
                publish_type              ,
                payment_type              ,
                supply_price              ,
                tax_price                 ,
                total_price               ,
                paid_money                ,
                bank_name               ,
                account_owner           ,
                account_number          ,
                card_name               ,
                card_number             ,
                is_bill_publish         ,
                company_code            ,         
                company_name              ,
                ceo_name                  ,
                company_address           ,
                business_type             ,
                business_item             ,
                business_registration_code,
                currentDate.currdate      ,
                modify_user               ,
                v_transaction_code
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
        res.json({message:err.message});
        res.end();              
    }
});

// get sequence next number 
app.post('/getQuotationNumber', async(req, res) => {

    const  { 
        modify_user                = defaultNull(req.body.modify_user)   ,  
    } = req.body;

    let v_quotation_number_result;
    console.log('getSequenceNext');

    try{   
                  
        if (modify_user === null ){
            throw new Error('modify user는 not null입니다.');
        }

        const modify_user_exist = await pool.query(`select user_id from tbl_user_info
                                                    where user_id = $1`,[modify_user]);
        if (modify_user_exist.rows.length === 0 ){
            throw new Error('modify user는 user_id 이어야 합니다.');
        }         
    
        const current_date = await pool.query(`select to_char(current_date,'YYMMDD') currdate`);
        const currentDate = current_date.rows[0].currdate;

        const todayCount = await pool.query(`
            select count(*) today_count from tbl_quotation_info
            where  create_date >= current_date`);

        let v_number_result;

        if(todayCount.rows[0].today_count === 0) {
            // alter sequence  
            await pool.query(`ALTER SEQUENCE quotation_reset_seq RESTART WITH 1`);
        }

        // 현재 db에 있는 sequence에서  _number 하나 생성해서 입력
        const number_result = await pool.query(`
        select nextval(\'quotation_reset_seq\') number_result ;`);

        v_number_result = parseInt(number_result.rows[0].number_result);
        const formattedNumber = v_number_result.toString().padStart(4, '0');
        v_quotation_number_result = currentDate + formattedNumber;

        console.log(v_quotation_number_result);
        
        res.json({ out_quotation_number:v_quotation_number_result }); // 결과 리턴을 해 줌 .  
    
    }catch(err){
        console.error(err);
        res.json({message:err.message});
        res.end();              
    }
});    

// create/update quotation info 
app.post('/modifyQuotation', async(req, res) => {
    const  { 
        action_type                = defaultNull(req.body.action_type),
        quotation_code             = defaultNull(req.body.quotation_code)   ,           
        lead_code                  = defaultNull(req.body.lead_code)   ,
        region                     = defaultNull(req.body.region)   ,
        company_name               = defaultNull(req.body.company_name)   ,
        lead_name                  = defaultNull(req.body.lead_name)   ,
        department                 = defaultNull(req.body.department)   ,
        position                   = defaultNull(req.body.position)   ,
        mobile_number              = defaultNull(req.body.mobile_number)   ,
        phone_number               = defaultNull(req.body.phone_number)   ,
        fax_number                 = defaultNull(req.body.fax_number)   ,
        email                      = defaultNull(req.body.email)   ,
        quotation_type             = defaultNull(req.body.quotation_type)   ,
        quotation_number           = defaultNull(req.body.quotation_number)   ,
        quotation_send_type        = defaultNull(req.body.quotation_send_type)   ,
        quotation_date             = defaultNull(req.body.quotation_date)   ,
        delivery_location          = defaultNull(req.body.delivery_location)   ,
        payment_type               = defaultNull(req.body.payment_type)   ,
        warranty_period            = defaultNull(req.body.warranty_period)   ,
        delivery_period            = defaultNull(req.body.delivery_period)   ,
        quotation_expiration_date  = defaultNull(req.body.quotation_expiration_date)   ,
        status                     = defaultNull(req.body.status)   ,
        comfirm_date               = defaultNull(req.body.comfirm_date)   ,
        quotation_manager          = defaultNull(req.body.quotation_manager)   ,
        sales_representative       = defaultNull(req.body.sales_representative)   ,
        quotation_title            = defaultNull(req.body.quotation_title)   ,
        list_price                 = defaultNull(req.body.list_price)   ,
        list_price_dc              = defaultNull(req.body.list_price_dc)   ,
        sub_total_amount           = defaultNull(req.body.sub_total_amount)   ,
        dc_rate                    = defaultNull(req.body.dc_rate)   ,
        dc_amount                  = defaultNull(req.body.dc_amount)   ,
        quotation_amount           = defaultNull(req.body.quotation_amount)   ,
        tax_amount                 = defaultNull(req.body.tax_amount)   ,
        total_quotation_amount     = defaultNull(req.body.total_quotation_amount)   ,
        cutoff_amount              = defaultNull(req.body.cutoff_amount)   ,
        total_cost_price           = defaultNull(req.body.total_cost_price)   ,
        profit                     = defaultNull(req.body.profit)   ,
        profit_rate                = defaultNull(req.body.profit_rate)   ,
        upper_memo                 = defaultNull(req.body.upper_memo)   ,
        lower_memo                 = defaultNull(req.body.lower_memo)   ,
        count                      = defaultNull(req.body.count)   ,
        modify_user                = defaultNull(req.body.modify_user)   ,
        print_template             = defaultNull(req.body.print_template)   ,
        quotation_table            = defaultNull(req.body.quotation_table)   ,
        company_code               = defaultNull(req.body.company_code)   ,
        quotation_contents         = defaultNull(req.body.quotation_contents) 
    } = req.body;
    try{

        const current_date = await pool.query(`select to_char(now(),'YYYY.MM.DD HH24:MI:SS') currdate`);
        const currentDate = current_date.rows[0];
        let v_quotation_code = quotation_code;
        let v_quotation_number_result = quotation_number;

        if (modify_user === null ){
            throw new Error('modify user는 not null입니다.');
        }

        const modify_user_exist = await pool.query(`select user_id from tbl_user_info
                                                    where user_id = $1`,[modify_user]);
        if (modify_user_exist.rows.length === 0 ){
            throw new Error('modify user는 user_id 이어야 합니다.');
        }        

        if (action_type === 'ADD') {
            if (lead_code === null || lead_code === "") {
                throw new Error('lead_code not null입니다.');
            }
            if (quotation_date === null || quotation_date === "") {
                throw new Error('quotation_date는 not null입니다.');
            }
            v_quotation_code  = pk_code();

            if( v_quotation_number_result  === null) {
               // 현재 db에 있는 sequence에서  quotation_number 하나 생성해서 입력
               const quotation_number_result = await pool.query(`
                select nextval(\'index_number_seq\') quotation_number ;`);

               v_quotation_number_result = parseInt(quotation_number_result.rows[0].quotation_number);    
            }
            const response = await pool.query(`insert into tbl_quotation_info(
                quotation_code               ,           
                lead_code                    ,
                region                       ,
                company_name                 ,
                lead_name                    ,
                department                   ,
                position                     ,
                mobile_number                ,
                phone_number                 ,
                fax_number                   ,
                email                        ,
                quotation_type               ,
                quotation_number             ,
                quotation_send_type          ,
                quotation_date               ,
                delivery_location            ,
                payment_type                 ,
                warranty_period              ,
                delivery_period              ,
                quotation_expiration_date    ,
                status                       ,
                comfirm_date                 ,
                quotation_manager            ,
                sales_representative         ,
                quotation_title              ,
                list_price                   ,
                list_price_dc                ,
                sub_total_amount             ,
                dc_rate                      ,
                dc_amount                    ,
                quotation_amount             ,
                tax_amount                   ,
                total_quotation_amount       ,
                cutoff_amount                ,
                total_cost_price             ,
                profit                       ,
                profit_rate                  ,
                upper_memo                   ,
                lower_memo                   ,
                count                        ,
                creator                      ,
                create_date                  ,
                modify_date                  ,
                recent_user                  ,
                print_template               ,
                quotation_table              ,
                company_code                 ,
                quotation_contents           ) 
                values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::text,$14,$15::date,
                       $16,$17,$18,$19,$20,$21,$22::date,$23,$24,$25,$26::numeric,$27::numeric,$28::numeric,$29::numeric,$30::numeric,
                       $31::numeric,$32::numeric,$33::numeric,$34::numeric,$35::numeric,$36::numeric,$37::numeric,$38,$39,$40::numeric,$41,$42::timestamp,$43::timestamp,$44,$45,
                       $46,$47,$48)`,
                [
                    v_quotation_code           ,
                    lead_code                  ,
                    region                    ,
                    company_name              ,
                    lead_name                 ,
                    department                ,
                    position                  ,
                    mobile_number             ,
                    phone_number              ,
                    fax_number                ,
                    email                     ,
                    quotation_type            ,
                    v_quotation_number_result ,
                    quotation_send_type       ,
                    quotation_date            ,
                    delivery_location         ,
                    payment_type              ,
                    warranty_period           ,
                    delivery_period           ,
                    quotation_expiration_date ,
                    status                    ,
                    comfirm_date              ,
                    quotation_manager         ,
                    sales_representative      ,
                    quotation_title           ,
                    list_price                ,
                    list_price_dc             ,
                    sub_total_amount          ,
                    dc_rate                   ,
                    dc_amount                 ,
                    quotation_amount          ,
                    tax_amount                ,
                    total_quotation_amount    ,
                    cutoff_amount             ,
                    total_cost_price          ,
                    profit                    ,
                    profit_rate               ,
                    upper_memo                ,
                    lower_memo                ,
                    count                     ,
                    modify_user               ,
                    currentDate.currdate      ,
                    currentDate.currdate      ,
                    modify_user               ,
                    print_template            ,
                    quotation_table           ,
                    company_code              ,
                    quotation_contents         
            ]);        
        }
        if (action_type === 'UPDATE') {

            if(lead_code !== null) {
                const lead_code_exist = await pool.query(`select lead_code from tbl_lead_info
                                                    where lead_code = $1`,[lead_code]);
                if (lead_code_exist.rows.length === 0 ){
                    throw new Error(`${lead_code}는 등록되지 않은 lead 입니다.`);
                }
            }

            const response = await pool.query(`
                update tbl_quotation_info 
                   set lead_code               = COALESCE($1 , lead_code) ,
                   region                      = COALESCE($2, region) ,
                   company_name                = COALESCE($3 , company_name) ,
                   lead_name                   = COALESCE($4 , lead_name) ,
                   department                  = COALESCE($5 , department) ,
                   position                    = COALESCE($6 , position) ,
                   mobile_number               = COALESCE($7 , mobile_number) ,
                   phone_number                = COALESCE($8 , phone_number) ,
                   fax_number                  = COALESCE($9 , fax_number) ,
                   email                       = COALESCE($10 , email) ,
                   quotation_type              = COALESCE($11 , quotation_type) ,
                   quotation_number            = COALESCE($12 , quotation_number) ,
                   quotation_send_type         = COALESCE($13 , quotation_send_type) ,
                   quotation_date              = COALESCE($14 , quotation_date) ,
                   delivery_location           = COALESCE($15 , delivery_location) ,
                   payment_type                = COALESCE($16 , payment_type) ,
                   warranty_period             = COALESCE($17 , warranty_period) ,
                   delivery_period             = COALESCE($18 , delivery_period) ,
                   quotation_expiration_date   = COALESCE($19 , quotation_expiration_date) ,
                   status                      = COALESCE($20 , status) ,
                   comfirm_date                = COALESCE($21 , comfirm_date) ,
                   quotation_manager           = COALESCE($22 , quotation_manager) ,
                   sales_representative        = COALESCE($23 , sales_representative) ,
                   quotation_title             = COALESCE($24 , quotation_title) ,
                   list_price                  = COALESCE($25::numeric , list_price) ,
                   list_price_dc               = COALESCE($26::numeric , list_price_dc) ,
                   sub_total_amount            = COALESCE($27::numeric , sub_total_amount) ,
                   dc_rate                     = COALESCE($28::numeric , dc_rate) ,
                   dc_amount                   = COALESCE($29::numeric , dc_amount) ,
                   quotation_amount            = COALESCE($30::numeric , quotation_amount) ,
                   tax_amount                  = COALESCE($31::numeric , tax_amount) ,
                   total_quotation_amount      = COALESCE($32::numeric , total_quotation_amount) ,
                   cutoff_amount               = COALESCE($33::numeric , cutoff_amount) ,
                   total_cost_price            = COALESCE($34::numeric , total_cost_price) ,
                   profit                      = COALESCE($35::numeric , profit) ,
                   profit_rate                 = COALESCE($36::numeric , profit_rate) ,
                   upper_memo                  = COALESCE($37 , upper_memo) ,
                   lower_memo                  = COALESCE($38 , lower_memo) ,
                   count                       = COALESCE($39::numeric , count) ,
                   modify_date                 = COALESCE($40::timestamp , modify_date) ,
                   recent_user                 = COALESCE($41 , recent_user) ,
                   print_template              = COALESCE($42 , print_template) ,
                   quotation_table             = COALESCE($43 , quotation_table) ,
                   company_code                = COALESCE($44 , company_code) ,
                   quotation_contents          = COALESCE($45 , quotation_contents) 
                where quotation_code = $46
            `,[
                lead_code                ,
                region                   ,
                company_name             ,
                lead_name                ,
                department               ,
                position                 ,
                mobile_number            ,
                phone_number             ,
                fax_number               ,
                email                    ,
                quotation_type           ,
                v_quotation_number_result,
                quotation_send_type      ,
                quotation_date           ,
                delivery_location        ,
                payment_type             ,
                warranty_period          ,
                delivery_period          ,
                quotation_expiration_date,
                status                   ,
                comfirm_date             ,
                quotation_manager        ,
                sales_representative     ,
                quotation_title          ,
                list_price               ,
                list_price_dc            ,
                sub_total_amount         ,
                dc_rate                  ,
                dc_amount                ,
                quotation_amount         ,
                tax_amount               ,
                total_quotation_amount   ,
                cutoff_amount            ,
                total_cost_price         ,
                profit                   ,
                profit_rate              ,
                upper_memo               ,
                lower_memo               ,
                count                    ,
                currentDate.currdate     ,
                modify_user              ,
                print_template           ,
                quotation_table          ,
                company_code             ,
                quotation_contents       ,
                v_quotation_code
            ]);
        }

        const out_quotation_code = v_quotation_code;
        const out_quotation_number = v_quotation_number_result ;
        const out_create_user = action_type === 'ADD' ? modify_user : "";
        const out_create_date = action_type === 'ADD' ? currentDate.currdate : "";
        const out_modify_date = currentDate.currdate;
        const out_recent_user = modify_user;
        
        res.json({ out_quotation_code: out_quotation_code, out_quotation_number:out_quotation_number, out_create_user:out_create_user, 
           out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user }); // 결과 리턴을 해 줌 .  
   
        console.log({ out_quotation_code: out_quotation_code,  out_quotation_number:out_quotation_number, out_create_user:out_create_user, 
               out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user });

    }catch(err){
        console.error(err);
        res.json({message:err.message});
        res.end();              
    }

});

// create/update ma contract info 
app.post('/modifyMaContract', async(req, res) => {
    const  { 
        action_type                = defaultNull(req.body.action_type),
        ma_code                       = defaultNull(req.body.ma_code),
        purchase_code              = defaultNull(req.body.purchase_code),
        ma_company_code            = defaultNull(req.body.ma_company_code),
        ma_contract_date           = defaultNull(req.body.ma_contract_date),
        ma_finish_date             = defaultNull(req.body.ma_finish_date),
        ma_price                   = defaultNull(req.body.ma_price),
        ma_memo                    = defaultNull(req.body.ma_memo),
        modify_user                = defaultNull(req.body.modify_user)
    } = req.body;

    try{

        const current_date = await pool.query(`select to_char(now(),'YYYY.MM.DD HH24:MI:SS') currdate`);
        const currentDate = current_date.rows[0];
        let v_ma_code = ma_code;

        if (modify_user === null ){
            throw new Error('modify user는 not null입니다.');
        }

        const modify_user_exist = await pool.query(`select user_id from tbl_user_info
                                                    where user_id = $1`,[modify_user]);
        if (modify_user_exist.rows.length === 0 ){
            throw new Error('modify user는 user_id 이어야 합니다.');
        }        

        if (action_type === 'ADD') {
            if (purchase_code === null || purchase_code === "") {
                throw new Error('purchase_code는 not null입니다.');
            }
            if (ma_company_code === null || ma_company_code === "") {
                throw new Error('ma_company_code는 not null입니다.');
            }
            v_ma_code  = pk_code();
            const response = await pool.query(`insert into tbl_MA_contract(
                ma_code                      ,
                purchase_code             ,
                ma_company_code           ,
                ma_contract_date          ,
                ma_finish_date            ,
                ma_price                  ,
                ma_memo                   ,
                ma_register               ,
                ma_registration_date      ,
                ma_recent_user            ,
                ma_modify_date            )
                values($1,$2,$3,$4::date,$5::date,$6::numeric,$7,$8,$9::timestamp,$10,$11::timestamp)`,
                [
                    v_ma_code                ,
                    purchase_code         ,
                    ma_company_code       ,
                    ma_contract_date      ,
                    ma_finish_date        ,
                    ma_price              ,
                    ma_memo               ,
                    modify_user           ,
                    currentDate.currdate  ,
                    modify_user           ,
                    currentDate.currdate 
            ]);       

        }
        if (action_type === 'UPDATE') {

            const response = await pool.query(`
                update tbl_MA_contract 
                    set  purchase_code            = COALESCE($1, purchase_code) ,
                    ma_company_code          = COALESCE($2, ma_company_code) ,
                    ma_contract_date         = COALESCE($3::date, ma_contract_date) ,
                    ma_finish_date           = COALESCE($4::date, ma_finish_date) ,
                    ma_price                 = COALESCE($5::numeric, ma_price) ,
                    ma_memo                  = COALESCE($6, ma_memo) ,
                    ma_recent_user           = COALESCE($7, ma_recent_user) ,
                    ma_modify_date           = COALESCE($8::timestamp, ma_modify_date) 
                where ma_code = $9
            `,[
                purchase_code                ,
                ma_company_code              ,
                ma_contract_date             ,
                ma_finish_date               ,
                ma_price                     ,
                ma_memo                      ,
                modify_user                  ,
                currentDate.currdate         ,
                v_ma_code
            ]);            
        }

        const out_ma_code = v_ma_code;
        const out_create_user = action_type === 'ADD' ? modify_user : "";
        const out_create_date = action_type === 'ADD' ? currentDate.currdate : "";
        const out_modify_date = currentDate.currdate;
        const out_recent_user = modify_user;
        
        res.json({ out_ma_code: out_ma_code,  out_create_user:out_create_user, 
           out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user }); // 결과 리턴을 해 줌 .  
   
        console.log({ action_type:action_type, out_ma_code: out_ma_code,  out_create_user:out_create_user, 
               out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user });

    }catch(err){
        console.error(err);
        res.json({message:err.message});
        res.end();              
    }
});

// create/update product info 
app.post('/modifyProduct', async(req, res) => {
    const  { 
        action_type                = defaultNull(req.body.action_type),
        product_code               = defaultNull(req.body.product_code),
        product_class_name              = defaultNull(req.body.product_class_name),
        manufacturer               = defaultNull(req.body.manufacturer),
        model_name                 = defaultNull(req.body.model_name),
        product_name               = defaultNull(req.body.product_name),
        unit                       = defaultNull(req.body.unit),
        cost_price                 = defaultNull(req.body.cost_price),
        reseller_price             = defaultNull(req.body.reseller_price),
        list_price                 = defaultNull(req.body.list_price),
        detail_desc                = defaultNull(req.body.detail_desc),
        memo                       = defaultNull(req.body.memo),
        modify_user                = defaultNull(req.body.modify_user)
    } = req.body;

    try{

        const current_date = await pool.query(`select to_char(now(),'YYYY.MM.DD HH24:MI:SS') currdate`);
        const currentDate = current_date.rows[0];
        let v_product_code = product_code;

        if (modify_user === null ){
            throw new Error('modify user는 not null입니다.');
        }

        const modify_user_exist = await pool.query(`select user_id from tbl_user_info
                                                    where user_id = $1`,[modify_user]);
        if (modify_user_exist.rows.length === 0 ){
            throw new Error('modify user는 user_id 이어야 합니다.');
        }        

        if (action_type === 'ADD') {

            v_product_code  = pk_code();
            const response = await pool.query(`insert into tbl_product_info(
                product_code  ,
                product_class_name ,
                manufacturer  ,
                model_name    ,
                product_name  ,
                unit          ,
                cost_price    ,
                reseller_price,
                list_price    ,
                detail_desc   ,
                memo          ,
                creator       ,
                create_date   ,
                modify_date   ,
                recent_user    )
                values($1,$2,$3,$4,$5,$6,$7::numeric,$8::numeric, $9::numeric, $10, $11, $12, $13::timestamp,$14::timestamp,$15)`,
                [
                    v_product_code        ,
                    product_class_name         ,
                    manufacturer          ,
                    model_name            ,
                    product_name          ,
                    unit                  ,
                    cost_price            ,
                    reseller_price        ,
                    list_price            ,
                    detail_desc           ,
                    memo                  ,
                    modify_user           ,
                    currentDate.currdate  ,
                    currentDate.currdate  ,
                    modify_user 
            ]);       

        }
        if (action_type === 'UPDATE') {

            const response = await pool.query(`
                update tbl_product_info 
                set product_class_name  = COALESCE($1 , product_class_name),
                    manufacturer   = COALESCE($2 , manufacturer),
                    model_name     = COALESCE($3 , model_name),
                    product_name   = COALESCE($4 , product_name),
                    unit           = COALESCE($5 , unit),
                    cost_price     = COALESCE($6::numeric , cost_price),
                    reseller_price = COALESCE($7::numeric , reseller_price),
                    list_price     = COALESCE($8::numeric , list_price),
                    detail_desc    = COALESCE($9 , detail_desc),
                    memo           = COALESCE($10 , memo),
                    modify_date    = COALESCE($11::timestamp , modify_date),
                    recent_user    = COALESCE($12 , recent_user)
                where product_code = $13
            `,[
                product_class_name ,
                manufacturer  ,
                model_name    ,
                product_name  ,
                unit          ,
                cost_price    ,
                reseller_price,
                list_price    ,
                detail_desc   ,
                memo          ,
                currentDate.currdate    ,
                modify_user             ,
                v_product_code
            ]);            
        }

        const out_product_code = v_product_code;
        const out_create_user = action_type === 'ADD' ? modify_user : "";
        const out_create_date = action_type === 'ADD' ? currentDate.currdate : "";
        const out_modify_date = currentDate.currdate;
        const out_recent_user = modify_user;
        
        res.json({ out_product_code: out_product_code,  out_create_user:out_create_user, 
           out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user }); // 결과 리턴을 해 줌 .  
   
        console.log({ out_product_code: out_product_code,  out_create_user:out_create_user, 
               out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user });

    }catch(err){
        console.error(err);
        res.json({message:err.message});
        res.end();              
    }
});

// create/update product class  
app.post('/modifyProductClass', async(req, res) => {
    const  { 
        action_type                = defaultNull(req.body.action_type),
        product_class_code         = defaultNull(req.body.product_class_code),
        product_class_name         = defaultNull(req.body.product_class_name),
        product_class_order        = defaultNull(req.body.order),
        product_class_memo         = defaultNull(req.body.memo),
        modify_user               = defaultNull(req.body.modify_user)
    } = req.body;

    try{
        const current_date = await pool.query(`select to_char(now(),'YYYY.MM.DD HH24:MI:SS') currdate`);
        const currentDate = current_date.rows[0];

        if (modify_user === null ){
            throw new Error('modify user는 not null입니다.');
        }

        const modify_user_exist = await pool.query(`select user_id from tbl_user_info
                                                    where user_id = $1`,[modify_user]);
        if (modify_user_exist.rows.length === 0 ){
            throw new Error('modify user는 user_id 이어야 합니다.');
        }        

        let v_product_class_code = product_class_code;

        if (action_type === 'ADD') {
            v_product_class_code  = pk_code();

            const v_product_class_order = await pool.query(`select max(product_class_order)+1 from tbl_product_class_list`,[]);

            const response = await pool.query(`insert into tbl_product_class_list(
                product_class_code  ,
                product_class_name  ,
                "order" ,
                memo      )
                values($1,$2,$3::integer,$4)`,
                [
                    v_product_class_code  ,
                    product_class_name    ,
                    v_product_class_order ,
                    product_class_memo
                ]
            );       
        }
        if (action_type === 'UPDATE') {
            const response = await pool.query(`
            update tbl_product_class_list 
                set product_class_name    = COALESCE($1 , product_class_name),
                "order"   = COALESCE($2 , "order"),
                memo    = COALESCE($3 , memo),
            where product_class_code = $4
            `,[
                product_class_name ,
                product_class_order,
                product_class_memo ,
                v_product_class_code
            ]);
        }

        const out_product_class_code = v_product_class_code;
        const out_create_user = action_type === 'ADD' ? modify_user : "";
        const out_create_date = action_type === 'ADD' ? currentDate.currdate : "";
        const out_modify_date = currentDate.currdate;
        const out_recent_user = modify_user;
        
        res.json({ message:'success', out_product_class_code: out_product_class_code,  out_create_user:out_create_user, 
           out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user }); // 결과 리턴을 해 줌 .  
   
        console.log({ out_product_class_code: out_product_class_code,  out_create_user:out_create_user, 
               out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user });
    }catch(err){
        console.error(err);
        res.json({message:err.message});   
        res.end();              
    }
});

// create/update user info 
app.post('/modifyUser', async(req, res) => {
    const  { 
        action_type                = defaultNull(req.body.action_type),
        userId                     = defaultNull(req.body.userId),
        userName                   = defaultNull(req.body.userName),
        current_password           = defaultNull(req.body.current_password),
        change_password            = defaultNull(req.body.change_password),
        mobileNumber               = defaultNull(req.body.mobileNumber),
        phoneNumber                = defaultNull(req.body.phoneNumber),
        department                 = defaultNull(req.body.department),
        position                   = defaultNull(req.body.position),
        email                      = defaultNull(req.body.email),
        private_group              = defaultNull(req.body.private_group),
        memo                       = defaultNull(req.body.memo),
        modify_user                = defaultNull(req.body.modify_user),
    } = req.body;

    try{
        const current_date = await pool.query(`select to_char(now(),'YYYY.MM.DD HH24:MI:SS') currdate`);
        const currentDate = current_date.rows[0];

        let hashPassword;

        if (action_type === 'ADD') {

            if (userId === null ){
                throw new Error('user id는 not null입니다.');
            }
            const user_exist = await pool.query(`select user_id from tbl_user_info
                                                    where user_id = $1`,[userId]);
            if (user_exist.rows.length !== 0 ){
                throw new Error('user_id 중복입니다.');
            }                  
            if (userName === null ){
                throw new Error('user name은 not null입니다.');
            }
            // user 생성시에는 password 입력되어야 함.
            if(password !== null){
                const salt = bcrypt.genSaltSync(10);
                hashPassword = bcrypt.hashSync(password, salt);
            }else{
                throw new Error('password는 not null입니다.');
            }

            const response = await pool.query(`
                insert into tbl_user_info (
                    user_id,
                    user_name,
                    password,
                    mobile_number,
                    phone_number,
                    department,
                    position,
                    email,
                    private_group,
                    memo
                )values( $1,$2,$3,$4,$5,$6,$7,$8,$9,$10 )
            `,[userId, 
               userName,
               hashPassword,
               mobileNumber,
               phoneNumber,
               department,
               position,
               email,
               private_group,
               memo
            ]);
        }
        if (action_type === 'UPDATE') {
 
            if (modify_user === null ){
                throw new Error('modify user는 not null입니다.');
            }

            const response = await pool.query(`
                update tbl_user_info 
                   set user_name    = COALESCE( $1, user_name ),
                   mobile_number    = COALESCE( $2, mobile_number),
                   phone_number     = COALESCE( $3, phone_number),
                   department       = COALESCE( $4, department),
                   position         = COALESCE( $5, position),
                   email            = COALESCE( $6, email),
                   private_group           = COALESCE( $7, private_group),
                   memo             = COALESCE( $8, memo)
                where user_id = $9
            `,[userName, mobileNumber, phoneNumber, department, position, email, private_group, memo, userId]);
        }

        if (action_type === 'UPDATE_PASSWORD') {
            if (modify_user === null ){
                throw new Error('modify user는 not null입니다.');
            }
            if(change_password !== null){
                if( change_password !== '') {
                    const salt = bcrypt.genSaltSync(10);
                    hashPassword = bcrypt.hashSync(change_password, salt);
                }
            }else{
                hashPassword = null;
            }

            const users = await pool.query(`
                SELECT t.user_id as "userId", 
                t.password as "password"
                FROM tbl_user_info t WHERE t.user_id = $1`, [userId]);
        
            if(!users.rows.length){ 
                console.log("fail invalid_current_user");
                res.json({message:"invalid_current_user"});
                res.end();   
                return ;
            }

            const success = await bcrypt.compare(current_password, users.rows[0].password);
            if(success){
                console.log(change_password, );
                // update password 
                const salt = bcrypt.genSaltSync(10);
                const hashPassword1 = bcrypt.hashSync(change_password, salt);

                const response = await pool.query(`
                    update tbl_user_info 
                    set password    = COALESCE( $1, password)
                    where user_id = $2
                `,[hashPassword1,  userId]);
            }else{
                console.log("fail Invalid_current_password");
                res.json({message:"Invalid_current_password"});
                res.end();   
                return;
            }
        }
        const out_user_id = userId;
        const out_create_user = action_type === 'ADD' ? modify_user : "";
        const out_create_date = action_type === 'ADD' ? currentDate.currdate : "";
        const out_modify_date = currentDate.currdate;
        const out_recent_user = modify_user;
        
        res.json({ message:'success', out_user_id: out_user_id,  out_create_user:out_create_user, 
           out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user }); // 결과 리턴을 해 줌 .  
        res.end();                    
   
        console.log({ out_user_id: out_user_id,  out_create_user:out_create_user, 
               out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user });        
    }catch(err){
        console.error(err);
        res.json({message:err.message});   
        res.end();              
    }
});

// create/update tax invoice
app.post('/modifyTaxInvoice', async(req, res) => {
    console.log('modifyTaxInvoice');
    const  { 
        action_type                = defaultNull(req.body.action_type),
        tax_invoice_code          = defaultNull(req.body.tax_invoice_code),
        company_code                 = defaultNull(req.body.company_code),
        publish_type              = defaultNull(req.body.publish_type),
        transaction_type          = defaultNull(req.body.transaction_type),
        invoice_type              = defaultNull(req.body.invoice_type),
        index1                    = defaultNull(req.body.index1),
        index2                    = defaultNull(req.body.index2),
        business_registration_code= defaultNull(req.body.business_registration_code),
        company_name              = defaultNull(req.body.company_name),
        ceo_name                  = defaultNull(req.body.ceo_name),
        company_address           = defaultNull(req.body.company_address),
        business_type             = defaultNull(req.body.business_type),
        business_item             = defaultNull(req.body.business_item),
        supply_price              = defaultNull(req.body.supply_price),
        tax_price                 = defaultNull(req.body.tax_price),
        total_price               = defaultNull(req.body.total_price),
        cash_amount               = defaultNull(req.body.cash_amount),
        check_amount              = defaultNull(req.body.check_amount),
        note_amount               = defaultNull(req.body.note_amount),
        receivable_amount         = defaultNull(req.body.receivable_amount),
        receive_type              = defaultNull(req.body.receive_type),
        memo                      = defaultNull(req.body.memo),
        summary                   = defaultNull(req.body.summary),
        invoice_contents          =  defaultNull(req.body.invoice_contents),
        modify_user               = defaultNull(req.body.modify_user),
        sequence_number           = defaultNull(req.body.sequence_number),
    } = req.body;

    console.log('modifyTaxInvoice index1 index2', index1, index2);
    let v_index1 = defaultIntegerNull(index1);
    let v_index2 = defaultIntegerNull(index2);
    console.log(action_type, index1, index2);
    try{

        console.log('modifyTaxInvoice1');
        const current_date = await pool.query(`select to_char(now(),'YYYY.MM.DD HH24:MI:SS') currdate`);
        const currentDate = current_date.rows[0];
        let v_tax_invoice_code = tax_invoice_code;

        if (modify_user === null ){
            throw new Error('modify user는 not null입니다.');
        }
        if(company_code === null || company_code === ''){
            throw new Error('company는 not null입니다.');
        }

        const modify_user_exist = await pool.query(`select user_id from tbl_user_info
                                                    where user_id = $1`,[modify_user]);
        if (modify_user_exist.rows.length === 0 ){
            throw new Error('modify user는 user_id 이어야 합니다.');
        }        

        if (action_type === 'ADD') {

            v_tax_invoice_code  = pk_code();
            const response = await pool.query(`insert into tbl_tax_invoice(
                tax_invoice_code           ,    
                company_code                  , 
                publish_type               , 
                transaction_type           , 
                invoice_type               , 
                index1                     , 
                index2                     , 
                business_registration_code , 
                company_name               , 
                ceo_name                   , 
                company_address            , 
                business_type              , 
                business_item              , 
                create_date                , 
                supply_price               , 
                tax_price                  , 
                total_price                , 
                cash_amount                , 
                check_amount               , 
                note_amount                , 
                receivable_amount          , 
                receive_type               , 
                memo                       , 
                summary                    , 
                invoice_contents           , 
                modify_date                , 
                creator                    , 
                recent_user                ,
                sequence_number )
                values($1,$2,$3,$4,$5,$6::integer,$7::integer,$8, $9, $10, $11, $12, $13,$14::timestamp,$15::numeric,
                    $16::numeric,$17::numeric,$18::numeric,$19::numeric,$20::numeric,$21::numeric,$22,$23,$24,$25,$26::timestamp,$27,$28, $29    
                    )`,
                [
                    v_tax_invoice_code    ,
                    company_code          ,
                    publish_type          ,
                    transaction_type      ,
                    invoice_type          ,
                    v_index1                ,
                    v_index2                ,
                    business_registration_code ,
                    company_name          ,
                    ceo_name              ,
                    company_address       ,
                    business_type         ,
                    business_item         ,
                    currentDate.currdate  ,
                    supply_price          ,
                    tax_price             ,
                    total_price           ,
                    cash_amount           , 
                    check_amount          , 
                    note_amount           , 
                    receivable_amount     , 
                    receive_type          , 
                    memo                  , 
                    summary               , 
                    invoice_contents      , 
                    currentDate.currdate  , 
                    modify_user           ,
                    modify_user           ,
                    sequence_number
            ]);       
            console.log('modifyTaxInvoice3');
        }
        if (action_type === 'UPDATE') {

            const response = await pool.query(`
                update tbl_tax_invoice 
                set company_code                  = COALESCE($1 ,company_code), 
                    publish_type               = COALESCE($2 ,publish_type), 
                    transaction_type           = COALESCE($3 ,transaction_type ), 
                    invoice_type               = COALESCE($4 ,transaction_type ), 
                    index1                     = COALESCE($5::integer ,index1 ), 
                    index2                     = COALESCE($6::integer ,index2 ), 
                    business_registration_code = COALESCE($7 ,business_registration_code ), 
                    company_name               = COALESCE($8 ,company_name ), 
                    ceo_name                   = COALESCE($9 ,ceo_name ), 
                    company_address            = COALESCE($10 ,company_address ), 
                    business_type              = COALESCE($11 ,business_type ), 
                    business_item              = COALESCE($12 ,business_item ), 
                    supply_price               = COALESCE($13::numeric , supply_price), 
                    tax_price                  = COALESCE($14::numeric , tax_price), 
                    total_price                = COALESCE($15::numeric , total_price), 
                    cash_amount                = COALESCE($16::numeric , cash_amount), 
                    check_amount               = COALESCE($17::numeric , check_amount), 
                    note_amount                = COALESCE($18::numeric , note_amount), 
                    receivable_amount          = COALESCE($19::numeric , receivable_amount), 
                    receive_type               = COALESCE($20 , receive_type), 
                    memo                       = COALESCE($21 , memo), 
                    summary                    = COALESCE($22 , summary), 
                    invoice_contents           = COALESCE($23 , invoice_contents), 
                    modify_date                = COALESCE($24::timestamp , modify_date), 
                    recent_user                = COALESCE($25 , recent_user) ,
                    sequence_number            = COALESCE($26 , sequence_number)   
                where tax_invoice_code = $27    
            `,[
                company_code                 ,           
                publish_type              ,
                transaction_type          ,
                invoice_type              ,
                index1                    ,
                index2                    ,
                business_registration_code,
                company_name              ,
                ceo_name                  ,
                company_address           ,
                business_type             ,
                business_item             ,
                supply_price              ,
                tax_price                 ,
                total_price               ,
                cash_amount               ,
                check_amount              ,
                note_amount               ,
                receivable_amount         ,
                receive_type              ,
                memo                      ,
                summary                   ,
                invoice_contents          ,
                currentDate.currdate      ,
                modify_user               ,
                sequence_number           ,
                v_tax_invoice_code  
            ]);            
        }

        const out_tax_invoice_code = v_tax_invoice_code;
        const out_create_user = action_type === 'ADD' ? modify_user : "";
        const out_create_date = action_type === 'ADD' ? currentDate.currdate : "";
        const out_modify_date = currentDate.currdate;
        const out_recent_user = modify_user;
        
        res.json({ out_tax_invoice_code: out_tax_invoice_code,  out_create_user:out_create_user, 
           out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user }); // 결과 리턴을 해 줌 .  
   
        console.log({ out_tax_invoice_code: out_tax_invoice_code,  out_create_user:out_create_user, 
               out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user });

    }catch(err){
        console.error(err);
        res.json({message:err.message});
        res.end();              
    }
});

// create/update ma contract info 
app.post('/modifyAttachment', async(req, res) => {
    console.log('modifyAttachment');
    const  { 
        action_type              = defaultNull(req.body.action_type),
        attachment_code          = defaultNull(req.body.attachment_code),
        uuid                     = defaultNull(req.body.uuid),
        dir_name                 = defaultNull(req.body.dir_name),  
        file_name                = defaultNull(req.body.file_name),
        file_ext                 = defaultNull(req.body.file_ext),
        creator                  = defaultNull(req.body.creator),
        }    = req.body;

    try{
        // ADD인데 attachment_code === null 이면 완전 추가  new attachment_code , uuid 리턴 
        // ADD인데 attachment_code === null 이 아니면 있는 attachment 에다가 line 추가, 받은 attachment_code , uuid 리턴 
        // DELETE uuid 있으으면 그것 삭제 
        let v_attachment_code = attachment_code;
        let v_uuid = uuid;
        let v_attachment_index;
        const current_date = await pool.query(`select to_char(now(),'YYYY.MM.DD HH24:MI:SS') currdate`);
        const currentDate = current_date.rows[0];

        if (action_type === 'ADD') {
            if(v_attachment_code === null || v_attachment_code === ""){
                v_attachment_code = pk_code();
                v_attachment_index = 1;
            }else{
              const count_attach = await pool.query(`select max(attachment_index)+1 count_attach from 
                                                     tbl_attachment_info tai 
                                                     where attachment_code = $1`,[v_attachment_code]);
                v_attachment_index  = count_attach.rows[0].count_attach;                                   
            }   
            v_uuid = pk_code();
            const response = await pool.query(`insert into tbl_attachment_info(
                uuid            ,
                attachment_code ,
                dir_name        ,  
                file_name       ,
                file_ext        ,
                attachment_index,
                create_date     ,
                creator    )
                values($1,$2,$3,$4,$5,$6::integer,$7::timestamp,$8)`,
                [
                    v_uuid              ,
                    v_attachment_code   ,
                    dir_name            ,
                    file_name           ,
                    file_ext            ,
                    v_attachment_index  ,
                    currentDate.currdate,
                    creator
            ]);       
        }else if(action_type === 'DELETE'){
            const response = await pool.query(`delete from tbl_attachment_info 
               where uuid = $1`,[v_uuid]);
        }

        const out_attachment_code = v_attachment_code;
        const out_uuid = v_uuid;
        const out_attachment_index = v_attachment_index;
        const out_create_user = action_type === 'ADD' ? creator : "";
        const out_create_date = action_type === 'ADD' ? currentDate.currdate : "";
        const out_delete_date =  action_type === 'DELETE' ? currentDate.currdate : "";
        
        res.json({ out_attachment_code: out_attachment_code,  out_uuid:out_uuid, out_attachment_index:out_attachment_index,
                   out_create_user:out_create_user, out_create_date:out_create_date, 
                   out_delete_date:out_delete_date }); // 결과 리턴을 해 줌 .  
   
        console.log({ out_attachment_code: out_attachment_code,  out_uuid:out_uuid, out_attachment_index:out_attachment_index,
            out_create_user:out_create_user, out_create_date:out_create_date, 
            out_delete_date:out_delete_date });


    }catch(err){
        console.error(err);
        res.json({message:err.message});
        res.end();              
    }

});

/////////////////////////////////////////////////////////////////////

//login
app.post('/login', async(req, res) => {

    const {userId, password} = req.body;
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
        t.private_group  as "private_group",
        t.memo  as "memo"
        FROM tbl_user_info t WHERE t.user_id = $1`, [userId]);
        if(!users.rows.length){ 
            console.log("invalid id fail");
            return res.json({message:"Invalid userId or password"});
        }

        const success = await bcrypt.compare(password, users.rows[0].password);
        const token = jwt.sign({userId}, 'secret', {expiresIn:'1hr'});
        if(success){
            res.json({userId : users.rows[0].userId,
                      userName : users.rows[0].userName, 
                      mobileNumber: users.rows[0].mobileNumber, 
                      phoneNumber: users.rows[0].phoneNumber, 
                      department: users.rows[0].department,
                      position: users.rows[0].position, 
                      email: users.rows[0].email, 
                      private_group: users.rows[0].private_group, 
                      memo: users.rows[0].memo,
                      token: token,
                      message:"success"});
            console.log("login success",  users.rows[0].userId);
        }else{
            console.log("invalid password fail");
            res.json({message:"Invalid userId or password"});
        }
        res.end();
    }catch(err){
        console.error(err);
        res.json({message:err.message});        
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
        t.private_group  as "private_group",
        t.memo  as "memo"
        FROM tbl_user_info t WHERE t.user_id = $1`, [userId]);
        if(!users.rows.length) 
            return res.json({message:'User does not exist'});

        console.log(users.rows[0]);    
        res.json(users.rows[0]); // 결과 리턴을 해 줌 .
        res.end();

    }catch(err){
        console.error(err);
        res.json({message:err});        
        res.end();
    }
});



// password hash처리 임시 
app.get('/passHash', async(req, res) => {
    console.log('passHash');
    const salt = bcrypt.genSaltSync(10);
    //  const hashPassword = bcrypt.hashSync(password, salt);vs
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
        t.private_group  as "private_group",
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