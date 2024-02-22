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


  CREATE TABLE lead (           
  customer_name varchar2(50),                         
      customer_gender varchar2(50),                      
     dept varchar2(50),                                  
     position_ varchar2(50),                             
      customer_picture varchar2(50),                     
        customer_resident_number varchar2(20),           
        customer_birthday date,                          
       customer_lunar_birthday varchar2(10),             
         customer_solar_curr_birthday date,              
       home_postal_code varchar2(50),                    
        home_address varchar2(255),                      
        home_telephone varchar2(100)        
  )