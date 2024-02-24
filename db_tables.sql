-- 기업관리 테이블 
  drop table company;

  CREATE TABLE company                                   
  (id serial PRIMARY KEY,                                
  company_code varchar(32),                              
  customer_code varchar(32),                             
  business_code varchar(32),                             
  company_number varchar(50),                            
  group_ varchar(255),                                   
  relationship varchar(50),                              
  registration_date date,                                
  head_quater_responsible varchar(50),                   
   Business_strategy_area varchar(50),                  
  Corporate_number varchar(50),                         
  group_classification varchar(100),                    
  Transaction_classification varchar(100),              
  company_name varchar(50),                              
  company_name1 varchar(50),                             
   english_company_name varchar(100),                    
   Business_number  varchar(50)   ,                      
   start_date date,                                      
   end_date date,                                        
  representative varchar(50),                           
     repr_resident_number varchar(50),                  
 	state_business varchar(100),                          
  type_ varchar(100),                                   
     postal_code varchar(50),                            
     business_address varchar(255),                     
    industry_class varchar(50),                          
     discount_policy float,                             
      trade_start_date date,                             
      trade_end_date  date,                              
      estimate_request_ varchar(2),                      
       repr_birthday   date,                             
      repr_lunar_birthday varchar(10),                  
       repr_solar_birthday date,                         
      company_postal_code1 varchar(50),                 
      company_address1 varchar(255),                    
      company_postal_code2 varchar(50),                 
      company_address2 varchar(255),                    
      company_telephone1 varchar(100),                  
      company_fax1 varchar(100),                        
      company_telephone2 varchar(100),                  
      company_fax2 varchar(100)             
  );

-- 기업관리 테이블 컬럼 
COMMENT ON COLUMN company.id IS '회사색인';
comment on column company.company_code is  '기업코드';
comment on column company.customer_code is '거래처코드';
comment on column company.business_code is '사업코드';
comment on column company.company_number is '기업번호' ;
comment on column company.group_ is '그룹' ;
comment on column company.relationship is '관계' ;
comment on column company.registration_date is '등록일자' ;
comment on column company.head_quater_responsible is '본사담당자';
comment on column company.Business_strategy_area is '영업전략지';
comment on column company.Corporate_number is '법인번호';
comment on column company.group_classification is '단체구분' ;
comment on column company.Transaction_classification is '거래구분';
comment on column company.company_name is '회사명' ;
comment on column company.company_name1 is '회사명I' ;
comment on column company.english_company_name is '회사명영문';
comment on column company.Business_number is '사업자번호';
comment on column company.start_date is '개업년월일';
comment on column company.end_date is '폐업년월일';
comment on column company.representative is '대표자명';
comment on column company.repr_resident_number is '대표자주민번호';
comment on column company.state_business is '업태' ;
comment on column company.type_ is '종목' ;
comment on column company.postal_code is '사업장우편';
comment on column company.business_address is '사업장주소';
comment on column company.industry_class is '산업구분' ;
comment on column company.discount_policy is '할인율정책';
comment on column company.trade_start_date is '거래시작일';
comment on column company.trade_end_date is '거래종료일';
comment on column company.estimate_request_ is '견적요청많음';
comment on column company.repr_birthday is '대표자생년';
comment on column company.repr_lunar_birthday is '대표자음력';
comment on column company.repr_solar_birthday is '대표자금년생일';
comment on column company.company_postal_code1 is '회사우편1' ;
comment on column company.company_address1 is '회사주소1';
comment on column company.company_postal_code2 is '회사우편2'; 
comment on column company.company_address2 is '회사주소2'; 
comment on column company.company_telephone1 is '회사전화1';
comment on column company.company_fax1 is '회사팩스1'; 
comment on column company.company_telephone2 is '회사전화2';
comment on column company.company_fax2 is '회사팩스2';

-- 컬럼 코맨트 조회 
SELECT
	PS.RELNAME AS TABLE_NAME,
	PA.ATTNAME AS COLUMN_NAME,
	PD.DESCRIPTION AS COLUMN_COMMENT
FROM PG_STAT_ALL_TABLES PS, PG_DESCRIPTION PD, PG_ATTRIBUTE PA
WHERE PD.OBJSUBID<>0
	AND PS.RELID=PD.OBJOID
	AND PD.OBJOID=PA.ATTRELID
	AND PD.OBJSUBID=PA.ATTNUM
	AND PS.SCHEMANAME='public'
	AND PS.RELNAME='company'
ORDER BY PS.RELNAME, PD.OBJSUBID;

drop table lead;

CREATE TABLE lead(                                             
  customer_id  serial PRIMARY KEY,                                
  customer_name varchar(50),                                  
  customer_gender varchar(50),                               
  dept varchar(50),                                           
  position_ varchar(50),                                      
  customer_picture varchar(50),                              
  customer_resident_number varchar(20),                    
  customer_birthday date,                                   
  customer_lunar_birthday varchar(10),                      
  customer_solar_curr_birthday date,                       
  home_postal_code varchar(50),                             
  home_address varchar(255),                               
  home_telephone varchar(100),                              
  home_fax varchar(50),                                     
  mobile_phone varchar(50),                                 
  reference_number varchar(50),                           
  Field_of_major	varchar(50),                            
  Career text,                                          
  History text,                                         
  Hobby varchar(50),                                  
  talent varchar(50),                                    
  is_married varchar(50) ,                             
  wedding_anniversary date,                           
  spouse_name varchar(50)  ,                          
  spouse_birthday date,                             
  spouse_lunar_birthday varchar(10),                  
  spouse_solar_birthday date,                        
  email_address varchar(255),                          
  homepage varchar(255),                               
  email_address1 varchar(255),                    
  email_address2 varchar(255),                    
  homepage1 varchar(255),                          
  homepage2 varchar(255),                              
  memo text,                                          
  attatchment text,                                 
  purchase_history text,                          
  consultation text ,                           
  as_history text,                                  
  purchase_character text,                        
  personal_character text,                         
  map_file varchar(50),                            
  mileage float  ,                               
  point float  ,                                    
  unit_price integer,                              
  created_by varchar(50),                        
  creation_date date,                              
  last_update_date date,                           
  last_updated_by varchar(50),                    
  del varchar(1),                                     
  dm varchar(2),                                   
  dm2 varchar(2),                                    
  n_add integer,                                     
  cid1   varchar(50),                                
  cid2   varchar(50),                                
  cid3   varchar(50),                                
  cid4   varchar(50),                                
  cid5   varchar(50),                                
  cid6   varchar(50),                                
  cid7   varchar(50),                                
  m_image1  varchar(50),                             
  m_image2  varchar(50),                             
  m_image3  varchar(50),                             
  m_image4  varchar(50),                             
  m_image5  varchar(50),                             
  scan   varchar(1) ,                                
  share varchar(1),                                
  in_house_employee varchar(1),                 
  counter integer,                           
  passbook varchar(50),                            
  bank_account varchar(50),                       
  bank_name varchar(50),                           
  account_holder varchar(50),                    
  field01  varchar(100),                                        
  field02  varchar(100),
  field03  varchar(100),
  field04  varchar(100),
  field05  varchar(100),
  field06  float, 
  field07  float,
  field08  float,
  field09  text,
  field10  text,
  field11  text,
  field12  float,  
  field13  float, 
  field14  float, 
  field15  date,
  field16  date,
  field17  date,
sales_resp varchar(50),
engineer varchar(50),
area varchar(50)
);

comment on column lead.customer_id is '고객번호';
comment on column lead.customer_name is '고객명' ;
comment on column lead.customer_gender is '고객성별' ;
comment on column lead.dept is '부서' ;
comment on column lead.position_ is '직위';
comment on column lead.customer_picture is '고객사진' ;
comment on column lead.customer_resident_number is '고객주민번호';
comment on column lead.customer_birthday is '고객생년월일';
comment on column lead.customer_lunar_birthday is '고객음력' ;
comment on column lead.customer_solar_curr_birthday is '고객금년생일';
comment on column lead.home_postal_code is '자택우편';
comment on column lead.home_address is '자택주소' ;
comment on column lead.home_telephone is '자택전화' ;
comment on column lead.home_fax is '자택팩스' ;
comment on column lead.mobile_phone is '이동통신' ;
comment on column lead.reference_number is '참고번호' ;
comment on column lead.field_of_major is '전공분야' ;
comment on column lead.career is '경력사항' ;
comment on column lead.history is '이력사항' ;
comment on column lead.hobby is '취미';
comment on column lead.talent is '특기';
comment on column lead.is_married is '결혼여부' ;
comment on column lead.wedding_anniversary is '결혼기념일' ;
comment on column lead.spouse_name is '배우자성명' ;
comment on column lead.spouse_birthday is '배우자생년월일' ;
comment on column lead.spouse_lunar_birthday is '배우자음력' ;
comment on column lead.spouse_solar_birthday is '배우자금년생일' ;
comment on column lead.email_address is '전자우편' ;
comment on column lead.homepage is '홈페이지' ;
comment on column lead.email_address1 is '전자우편1' ;
comment on column lead.email_address2 is '전자우편2' ;
comment on column lead.homepage1 is '홈페이지1' ;
comment on column lead.homepage2 is '홈페이지2' ;
comment on column lead.memo is '메모';
comment on column lead.attatchment is '첨부파일' ;
comment on column lead.purchase_history is '구매이력' ;
comment on column lead.consultation is '상담문의' ;
comment on column lead.as_history  is 'AS이력' ;
comment on column lead.purchase_character is '구매성향' ;
comment on column lead.personal_character is '개인성향' ;
comment on column lead.map_file is '약도파일' ;
comment on column lead.mileage is '마일리지' ;
comment on column lead.point is '포인트' ;
comment on column lead.unit_price is '적용단가' ;
comment on column lead.created_by is '작성자' ;
comment on column lead.creation_date is '작성일자' ;
comment on column lead.last_update_date is '수정일자' ;
comment on column lead.last_updated_by is '최근사용자';
comment on column lead.share is '공유' ;
comment on column lead.in_house_employee is '사내임직원';
comment on column lead.카운터 is '카운터' ;
comment on column lead.passbook is '통장' ;
comment on column lead.bank_account is '계좌번호' ;
comment on column lead.bank_name is '은행명' ;
comment on column lead.account_holder is '예금주' ;
comment on column lead.sales_resp is '영업담당자' IS sales_resp;
comment on column lead.engineer is '담당엔지니어' is engineer;
comment on column lead.area is '지역';

-- 컬럼 코맨트 조회 
SELECT
	PS.RELNAME AS TABLE_NAME,
	PA.ATTNAME AS COLUMN_NAME,
	PD.DESCRIPTION AS COLUMN_COMMENT
FROM PG_STAT_ALL_TABLES PS, PG_DESCRIPTION PD, PG_ATTRIBUTE PA
WHERE PD.OBJSUBID<>0
	AND PS.RELID=PD.OBJOID
	AND PD.OBJOID=PA.ATTRELID
	AND PD.OBJSUBID=PA.ATTNUM
	AND PS.SCHEMANAME='public'
	AND PS.RELNAME='lead'
ORDER BY PS.RELNAME, PD.OBJSUBID;


  drop table invoce; 

CREATE TABLE invoice(
	invoice_id  serial PRIMARY KEY,         -- 거래명세표코드
	customer_id varchar(32) ,              -- 거래처코드
	class_issue varchar(10) ,              -- 발행구분
	class_ varchar(10) ,                 -- [구분]
	book integer ,                      -- [권] 
	item integer ,                      -- [호] [int] ,
	invoice_number varchar(50) ,     -- [일련번호] 
	Transaction_classification varchar(50) ,   -- [거래구분] 
	Business_number varchar(50) ,    -- [사업자번호]
	company_name varchar(50) ,       -- [상호]
	name varchar(50) ,               -- [성명]
	business_address varchar(255) ,  -- [사업장주소] 
 	state_business varchar(100) ,    -- [업태] [n
	type_ varchar(100) ,             -- [종목] [n
	issue_date date ,                -- [발행일자] [
	transaction_content varchar(100) ,  -- [거래내용]
	supply_amount float ,               -- [공급가액]
	tax_amount float ,                  -- [세액]
	total_amount float ,               -- [합계금액] [
	in_out_amount float  ,              -- [입출금액] 
	accounts_receivable float ,         -- [미수금]
	payment_type varchar(20) ,         -- [결제유형] [n
	memo text ,                        -- [비고]
	bank_name  varchar(50) ,           --[은행명]
	account_holder varchar(50) ,       -- [예금주]
	bank_account varchar(50) ,         -- [계좌번호] [n
	card_name varchar(50) ,            -- [카드명] [n
	card_number varchar(50) ,          -- [카드번호] [n
	in_out_code varchar(32) ,          -- [입출코드] [n
	transaction_code varchar(32) ,     -- [출납코드] [n
	created_by varchar(50) ,           -- [작성자] [n
	last_update_date date ,            -- [수정일자] [
	last_updated_by varchar(50) ,      -- [최근사용자] [n
	n_add integer ,                    -- [N추가] [int]
	field01 varchar(100) ,
	field02 varchar(100) ,
	field03 varchar(100) ,
	field04 varchar(100) ,
	field05 varchar(100) ,
	field06 float ,
	field07 float ,
	field08 float ,
	field09 text ,
	field10 text ,
	field11 text ,
	field12 float ,
	field13 float ,
	field14 float ,
	field15 date ,
	field16 date ,
	field17 date 
);